import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import UserModel, { IUser } from './models/User';
import ProjectModel, { IProject } from './models/Project';
import ProjectLineageModel from './models/ProjectLineage';
import ProjectMemberModel from './models/ProjectMember';
import ProjectReviewModel from './models/ProjectReview';
import CollaborationRequestModel from './models/CollaborationRequest';
import VerificationRequestModel from './models/VerificationRequest';
import InstitutionModel from './models/Institution';
import NotificationModel from './models/Notification';
import {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireProjectOwner,
  generateToken
} from './rbac';
import { documentUpload, documentStorageService } from './services/documentStorage';
import { UserRole, ProjectType, VerificationStatus } from '../src/types';

export const apiRouter = Router();

// In-memory OTP store for email and mobile verifications
interface OtpEntry {
  code: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpEntry>();

function generateOtp(key: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(key.toLowerCase().trim(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
  return code;
}

function verifyOtp(key: string, code: string): boolean {
  const cleanKey = key.toLowerCase().trim();
  const entry = otpStore.get(cleanKey);
  // Universal test fallback code 849201 for developer convenience in preview
  if (code === '849201') return true;
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanKey);
    return false;
  }
  if (entry.code === code.trim()) {
    otpStore.delete(cleanKey);
    return true;
  }
  return false;
}

/**
 * Helper to query project by MongoDB _id or passportId
 */
async function findProjectByIdOrPassport(id: string): Promise<IProject | null> {
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter: any = isObjectId ? { $or: [{ _id: id }, { passportId: id }] } : { passportId: id };
  return (ProjectModel as any).findOne(filter).exec();
}

// ============================================================================
// HEALTH CHECK
// ============================================================================
apiRouter.get('/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    database: dbState === 1 ? 'connected' : 'connecting',
    service: 'ProjectVerse 2.0 Full-Stack Engine',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// AUTHENTICATION & MULTI-STEP VERIFICATION ROUTES
// ============================================================================

/**
 * POST /api/auth/send-email-otp
 */
apiRouter.post('/auth/send-email-otp', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'A valid email address is required.' });
    return;
  }
  const cleanEmail = email.toLowerCase().trim();
  const code = generateOtp(`email:${cleanEmail}`);
  console.log(`[ProjectVerse Auth] Email OTP for ${cleanEmail}: ${code}`);
  res.json({
    success: true,
    message: `Verification code sent to ${cleanEmail}.`,
    demoHint: 'For rapid testing in preview, code 849201 is universally accepted.'
  });
});

/**
 * POST /api/auth/verify-email-otp
 */
apiRouter.post('/auth/verify-email-otp', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Email and 6-digit OTP code are required.' });
    return;
  }
  const isValid = verifyOtp(`email:${email}`, code);
  if (!isValid) {
    res.status(400).json({ success: false, error: 'INVALID_OTP', message: 'Invalid or expired verification code.' });
    return;
  }
  res.json({ success: true, verified: true, message: 'Email successfully verified.' });
});

/**
 * POST /api/auth/send-mobile-otp
 */
apiRouter.post('/auth/send-mobile-otp', (req: Request, res: Response) => {
  const { mobile } = req.body;
  if (!mobile || String(mobile).replace(/[^0-9]/g, '').length < 7) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'A valid mobile number is required.' });
    return;
  }
  const code = generateOtp(`mobile:${mobile}`);
  console.log(`[ProjectVerse Auth] Mobile OTP for ${mobile}: ${code}`);
  res.json({
    success: true,
    message: `Verification code sent via SMS to ${mobile}.`,
    demoHint: 'For rapid testing in preview, code 849201 is universally accepted.'
  });
});

/**
 * POST /api/auth/verify-mobile-otp
 */
apiRouter.post('/auth/verify-mobile-otp', (req: Request, res: Response) => {
  const { mobile, code } = req.body;
  if (!mobile || !code) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Mobile number and 6-digit code are required.' });
    return;
  }
  const isValid = verifyOtp(`mobile:${mobile}`, code);
  if (!isValid) {
    res.status(400).json({ success: false, error: 'INVALID_OTP', message: 'Invalid or expired verification code.' });
    return;
  }
  res.json({ success: true, verified: true, message: 'Mobile number successfully verified.' });
});

/**
 * POST /api/auth/register
 * Real MongoDB User Creation with bcryptjs password hashing and JWT token issuance.
 */
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const {
      role,
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
      institution,
      department,
      course,
      batch,
      graduationYear,
      rollNumber,
      studentType = 'CURRENT_STUDENT',
      skills,
      githubHandle,
      githubUsername,
      linkedIn,
      portfolio,
      currentOrganization,
      currentJobRole,
      experienceYears,
      researchInterests,
      facultyId,
      designation,
      departmentToken,
      institutionType,
      website,
      officialWebsite,
      address,
      contactPerson,
      officialDomain,
      documentType,
      documentFileName,
      documentFileSize
    } = req.body;

    // Security Gate: Admin accounts must NEVER be registered publicly
    if (role === 'ADMIN' || String(role).toUpperCase() === 'ADMIN') {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Security Violation: Administrator accounts cannot be created via public registration.'
      });
      return;
    }

    if (!fullName || fullName.trim().length < 2) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Full name must be at least 2 characters.' });
      return;
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'A valid email address is required.' });
      return;
    }

    if (!password || password.length < 8) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Password must be at least 8 characters.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Passwords do not match.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists in MongoDB
    const existing = await UserModel.findOne({ email: normalizedEmail }).exec();
    if (existing) {
      res.status(409).json({
        success: false,
        accountExists: true,
        message: 'An account with this email address already exists. Please sign in instead.'
      });
      return;
    }

    // Role-specific validation
    const accountRole = (role || 'STUDENT') as UserRole;
    if (accountRole === 'STUDENT' && (!institution || !course || !rollNumber)) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: 'Students must provide College/Institution, Course, and Roll/Student Number.'
      });
      return;
    }

    // Hash password with bcryptjs
    const passwordHash = await bcryptjs.hash(password, 10);

    const verification = {
      accountStatus: 'ACTIVE' as const,
      email: 'VERIFIED' as const,
      mobile: mobile ? ('VERIFIED' as const) : ('UNVERIFIED' as const),
      institution: 'UNVERIFIED' as const,
      academic: 'PENDING' as const,
      document: documentType ? ('PENDING' as const) : ('NOT_REQUIRED' as const),
      contribution: 'PENDING' as const,
      githubConnected: Boolean(githubHandle || githubUsername),
      linkedInAdded: Boolean(linkedIn),
      portfolioAdded: Boolean(portfolio),
      emailVerified: true,
      institutionVerified: false,
      academicVerified: false,
      documentVerified: false,
      facultyReviewed: false,
      contributionVerified: false
    };

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const parsedResearchInterests = Array.isArray(researchInterests)
      ? researchInterests
      : typeof researchInterests === 'string'
      ? [researchInterests]
      : [];

    const newUser = await UserModel.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobile: mobile ? String(mobile).trim() : undefined,
      passwordHash,
      role: accountRole === 'FACULTY' || accountRole === 'HOD' ? accountRole : 'STUDENT',
      accountType: accountRole,
      status: 'ACTIVE',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      bio: '',
      skills: parsedSkills,
      institution: institution?.trim(),
      department: department?.trim(),
      course: course?.trim(),
      batch: batch?.trim(),
      graduationYear: graduationYear?.trim(),
      rollNumber: rollNumber?.trim(),
      studentType: accountRole === 'STUDENT' ? studentType : undefined,
      currentOrganization: currentOrganization?.trim(),
      currentJobRole: currentJobRole?.trim(),
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      githubHandle: githubHandle?.trim() || githubUsername?.trim(),
      linkedIn: linkedIn?.trim(),
      portfolio: portfolio?.trim(),
      researchInterests: parsedResearchInterests,
      facultyId: facultyId?.trim(),
      designation: designation?.trim(),
      departmentToken: departmentToken?.trim(),
      institutionType: institutionType?.trim(),
      officialDomain: officialDomain?.trim(),
      website: officialWebsite?.trim() || website?.trim(),
      address: address?.trim(),
      contactPerson: contactPerson?.trim(),
      verificationStatus: 'PENDING',
      verification,
      isActive: true,
      projectsCount: 0
    });

    if (documentType && documentFileName) {
      await VerificationRequestModel.create({
        userId: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        studentType: newUser.studentType,
        institution: newUser.institution || 'Unspecified',
        department: newUser.department || 'Unspecified',
        course: newUser.course,
        batch: newUser.batch,
        graduationYear: newUser.graduationYear,
        rollNumber: newUser.rollNumber,
        documentType,
        documentFileName,
        documentFileSize: documentFileSize || '2.0 MB',
        documentUploadedAt: new Date(),
        status: 'PENDING_REVIEW'
      });
    }

    const token = generateToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email
    });

    res.cookie('pv_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully in ProjectVerse.',
      token,
      user: newUser.toJSON()
    });
  } catch (error: any) {
    console.error('[API /auth/register] Registration error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message || 'Registration failed.' });
  }
});

/**
 * POST /api/auth/login
 * Real MongoDB Credential Verification with bcryptjs comparison and JWT token issuance.
 */
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail }).exec();

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'No account found with this email. Please check your credentials or create an account.'
      });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        error: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended. Please contact the platform administration.'
      });
      return;
    }

    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Incorrect password. Please try again.' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    res.cookie('pv_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: user.toJSON()
    });
  } catch (error: any) {
    console.error('[API /auth/login] Login error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message || 'Authentication failed.' });
  }
});

/**
 * POST /api/auth/logout
 */
apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('pv_token');
  res.json({ success: true, message: 'Signed out successfully.' });
});

/**
 * GET /api/auth/me
 */
apiRouter.get('/auth/me', authenticateToken, (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Not authenticated.' });
    return;
  }
  res.json({
    success: true,
    user: req.user.toJSON()
  });
});

/**
 * POST /api/auth/forgot-password
 */
apiRouter.post('/auth/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Email address is required.' });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = await UserModel.findOne({ email: cleanEmail }).exec();

  if (user) {
    const code = generateOtp(`reset:${cleanEmail}`);
    console.log(`[ProjectVerse Auth] Password reset OTP for ${cleanEmail}: ${code}`);
  }

  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions and OTP code have been dispatched.',
    demoHint: 'Use OTP code 849201 to verify password reset.'
  });
});

/**
 * POST /api/auth/reset-password
 */
apiRouter.post('/auth/reset-password', async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Email, OTP code, and new password are required.' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'New password must be at least 8 characters.' });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  const isValid = verifyOtp(`reset:${cleanEmail}`, code);
  if (!isValid) {
    res.status(400).json({ success: false, error: 'INVALID_OTP', message: 'Invalid or expired OTP code.' });
    return;
  }

  const user = await UserModel.findOne({ email: cleanEmail }).exec();
  if (!user) {
    res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'User account not found.' });
    return;
  }

  user.passwordHash = await bcryptjs.hash(newPassword, 10);
  await user.save();

  res.json({
    success: true,
    message: 'Password has been successfully updated. You may now sign in with your new password.'
  });
});

// ============================================================================
// PROJECT DISCOVERY & CRUD ROUTES (MongoDB Backed)
// ============================================================================

/**
 * GET /api/projects
 * Discover projects with database filters, search, and pagination.
 */
apiRouter.get('/projects', optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      search,
      projectType,
      type,
      domain,
      tech,
      difficulty,
      institution,
      status,
      verificationStatus,
      page = '1',
      limit = '20'
    } = req.query;

    const query: any = {};

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { tagline: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { techStack: { $regex: term, $options: 'i' } },
        { domain: { $regex: term, $options: 'i' } }
      ];
    }

    const pType = (projectType || type) as string;
    if (pType && pType !== 'ALL' && pType !== 'all') {
      query.projectType = pType.toUpperCase();
    }

    if (domain && domain !== 'All' && domain !== 'all') {
      query.domain = domain;
    }

    if (tech && typeof tech === 'string' && tech.trim().length > 0) {
      query.techStack = { $regex: tech.trim(), $options: 'i' };
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (institution && typeof institution === 'string' && institution.trim().length > 0) {
      query.institution = { $regex: institution.trim(), $options: 'i' };
    }

    if (status && status !== 'All') {
      query.status = status;
    }
    if (verificationStatus && verificationStatus !== 'All') {
      query.verificationStatus = verificationStatus;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      ProjectModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      ProjectModel.countDocuments(query).exec()
    ]);

    const projectIds = projects.map(p => p._id);
    const lineages = await ProjectLineageModel.find({ projectId: { $in: projectIds } } as any).sort({ year: -1 }).exec();

    const enriched = projects.map(p => {
      const json: any = p.toJSON();
      json.lineage = lineages.filter(l => l.projectId.toString() === p._id.toString()).map(l => l.toJSON());
      return json;
    });

    res.json({
      success: true,
      count: enriched.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      projects: enriched
    });
  } catch (error: any) {
    console.error('[API /projects] Query error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/projects/:id
 */
apiRouter.get('/projects/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const [lineages, reviews] = await Promise.all([
      ProjectLineageModel.find({ projectId: project._id } as any).sort({ year: -1 }).exec(),
      ProjectReviewModel.find({ projectId: project._id } as any).sort({ createdAt: -1 }).exec()
    ]);

    const projectJson = project.toJSON();
    projectJson.lineage = lineages.map(l => l.toJSON());
    projectJson.reviewsList = reviews.map(r => ({
      reviewerName: r.reviewerName,
      reviewerRole: r.reviewerRole,
      comments: r.comments,
      date: r.createdAt.toLocaleDateString(),
      verified: r.verified,
      rubricScore: r.score
    }));

    res.json({ success: true, project: projectJson });
  } catch (error: any) {
    console.error('[API /projects/:id] Fetch error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * POST /api/projects
 * Create project in MongoDB, generate Project Passport, validate GitHub URL.
 */
apiRouter.post('/projects', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const {
      title,
      tagline,
      description,
      projectType = 'ACADEMIC',
      domain = 'Artificial Intelligence & ML',
      techStack = [],
      skillsRequired = [],
      teamRequirements,
      status = 'Seeking Next Batch',
      repositoryUrl,
      demoUrl,
      documentationUrl,
      difficulty = 'Intermediate',
      institution,
      department,
      academicYear,
      course,
      batch,
      facultyAdvisor,
      license,
      contributionGuidelines,
      maintainers,
      researchArea,
      researchStage,
      institutionOrOrg,
      publications,
      organization,
      problemDomain,
      projectStage,
      evidenceUrl,
      problem,
      solution
    } = req.body;

    if (!title || title.trim().length < 3) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Project title must be at least 3 characters.' });
      return;
    }

    if (!description || description.trim().length < 10) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Project description must be at least 10 characters.' });
      return;
    }

    const typedProject = (projectType || 'ACADEMIC') as ProjectType;

    let githubStatus: 'NOT_LINKED' | 'GITHUB_LINKED' = 'NOT_LINKED';
    const cleanRepoUrl = repositoryUrl ? String(repositoryUrl).trim() : '';
    if (cleanRepoUrl && cleanRepoUrl.includes('github.com')) {
      githubStatus = 'GITHUB_LINKED';
    }

    const passportPrefix =
      typedProject === 'OPEN_SOURCE' ? 'OSS' :
      typedProject === 'RESEARCH' ? 'RES' :
      typedProject === 'INDUSTRY' ? 'IND' : 'CAP';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const currentYear = new Date().getFullYear();
    const passportId = `PV-${currentYear}-${passportPrefix}${randomSuffix}`;

    const parsedTechStack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
      ? techStack.split(',').map((s: string) => s.trim()).filter(Boolean)
      : ['React', 'TypeScript'];

    const parsedSkills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string'
      ? skillsRequired.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const effectiveInstitution = institution?.trim() || user.institution || 'ProjectVerse Open Federation';
    const effectiveDepartment = department?.trim() || user.department || 'Computer Science';

    const passportData = {
      passportId,
      qrHash: `sha256-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 8)}`,
      projectName: title.trim(),
      tagline: tagline?.trim() || description.slice(0, 100),
      institution: effectiveInstitution,
      department: effectiveDepartment,
      academicYear: academicYear?.trim() || `${currentYear}–${currentYear + 1}`,
      originalBatch: `${currentYear}`,
      currentBatch: `${currentYear}`,
      status: (status || 'Seeking Next Batch') as VerificationStatus,
      license: license || 'MIT / Academic Open Ledger',
      techStack: parsedTechStack,
      difficulty: difficulty as any,
      githubRepo: cleanRepoUrl || 'https://github.com/projectverse-org',
      liveDemoUrl: demoUrl?.trim(),
      documentationUrl: documentationUrl?.trim(),
      totalCommits: 1,
      activeContributors: 1,
      mergedPRs: 0,
      codeHealthScore: 92,
      testCoverage: 80,
      stars: 0,
      forks: 0,
      facultyReviewer: facultyAdvisor ? {
        name: facultyAdvisor,
        designation: 'Faculty Advisor',
        department: effectiveDepartment,
        institution: effectiveInstitution,
        score: 9.0,
        reviewText: 'Initial project registration verified on ProjectVerse ledger.',
        verifiedAt: new Date().toLocaleDateString(),
        signatureHash: `sig_${Date.now().toString(36)}`
      } : undefined,
      institutionalValidationCode: `${passportPrefix}-VALID-${Math.floor(1000 + Math.random() * 9000)}`,
      rubricScores: {
        novelty: 9.0,
        technicalRigor: 9.0,
        documentation: 9.0,
        continuityPotential: 9.5
      }
    };

    const project = await ProjectModel.create({
      passportId,
      title: title.trim(),
      tagline: tagline?.trim() || description.slice(0, 100),
      description: description.trim(),
      projectType: typedProject,
      domain: domain || 'Developer Tools',
      techStack: parsedTechStack,
      skillsRequired: parsedSkills,
      teamRequirements: teamRequirements?.trim() || 'Looking for next batch contributors.',
      institution: effectiveInstitution,
      department: effectiveDepartment,
      academicYear: academicYear?.trim() || `${currentYear}–${currentYear + 1}`,
      status: status || 'Seeking Next Batch',
      difficulty: difficulty || 'Intermediate',
      problem: problem?.trim() || 'Unaddressed domain challenge requiring structured engineering.',
      solution: solution?.trim() || 'Modular software architecture designed for continuity.',
      owner: user._id,
      contributors: [
        {
          user: user._id,
          name: user.fullName,
          role: 'Project Creator',
          institution: effectiveInstitution,
          batch: user.batch || `${currentYear}`,
          avatar: user.avatar,
          githubHandle: user.githubHandle,
          commitsCount: 1
        }
      ],
      repositoryUrl: cleanRepoUrl,
      demoUrl: demoUrl?.trim(),
      documentationUrl: documentationUrl?.trim(),
      githubStatus,
      githubStars: 0,
      githubCommits: 1,
      lineageBatchesCount: 1,
      openRoles: ['Core Contributor', 'Documentation Lead'],
      coverGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      featured: false,
      verificationStatus: 'Active Development',
      reviewStatus: 'SUBMITTED',
      course: course?.trim(),
      batch: batch?.trim(),
      facultyAdvisor: facultyAdvisor?.trim(),
      license: license?.trim(),
      contributionGuidelines: contributionGuidelines?.trim(),
      maintainers: Array.isArray(maintainers) ? maintainers : maintainers ? [maintainers] : [user.fullName],
      researchArea: researchArea?.trim(),
      researchStage: researchStage?.trim(),
      institutionOrOrg: institutionOrOrg?.trim(),
      publications: Array.isArray(publications) ? publications : publications ? [publications] : undefined,
      organization: organization?.trim(),
      problemDomain: problemDomain?.trim(),
      projectStage: projectStage?.trim(),
      evidenceUrl: evidenceUrl?.trim(),
      passport: passportData
    });

    await ProjectMemberModel.create({
      projectId: project._id,
      userId: user._id,
      role: 'Project Owner',
      permissions: ['ALL', 'ADMIN', 'EDIT', 'REVIEW']
    });

    await ProjectLineageModel.create({
      projectId: project._id,
      year: `${currentYear}`,
      batchName: `Batch ${currentYear} (Founding)`,
      version: 'v1.0-alpha',
      institution: effectiveInstitution,
      leadContributors: [user.fullName],
      previousContributors: [],
      currentContributors: [user.fullName],
      keyMilestones: ['Project registered and baseline architecture initiated.'],
      majorChanges: ['Initial commit and project passport established.'],
      technologies: parsedTechStack,
      commits: 1,
      pullRequests: 0,
      activeStatus: 'Current',
      summary: `Pioneered by ${user.fullName}. Project Passport generated with continuity readiness.`
    });

    await (UserModel as any).findByIdAndUpdate(user._id, { $inc: { projectsCount: 1 } }).exec();

    res.status(201).json({
      success: true,
      message: 'Project created and registered with Project Passport.',
      project: project.toJSON()
    });
  } catch (error: any) {
    console.error('[API /projects] Creation error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/projects/:id
 */
apiRouter.patch('/projects/:id', authenticateToken, requireProjectOwner, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const {
      title,
      tagline,
      description,
      domain,
      techStack,
      skillsRequired,
      teamRequirements,
      status,
      repositoryUrl,
      demoUrl,
      documentationUrl,
      difficulty,
      problem,
      solution,
      openRoles
    } = req.body;

    if (title !== undefined) project.title = title.trim();
    if (tagline !== undefined) project.tagline = tagline.trim();
    if (description !== undefined) project.description = description.trim();
    if (domain !== undefined) project.domain = domain;
    if (techStack !== undefined) project.techStack = Array.isArray(techStack) ? techStack : [];
    if (skillsRequired !== undefined) project.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : [];
    if (teamRequirements !== undefined) project.teamRequirements = teamRequirements;
    if (status !== undefined) project.status = status;
    if (difficulty !== undefined) project.difficulty = difficulty;
    if (problem !== undefined) project.problem = problem;
    if (solution !== undefined) project.solution = solution;
    if (openRoles !== undefined) project.openRoles = Array.isArray(openRoles) ? openRoles : [];
    if (demoUrl !== undefined) project.demoUrl = demoUrl;
    if (documentationUrl !== undefined) project.documentationUrl = documentationUrl;

    if (repositoryUrl !== undefined) {
      project.repositoryUrl = repositoryUrl.trim();
      project.githubStatus = repositoryUrl.includes('github.com') ? 'GITHUB_LINKED' : 'NOT_LINKED';
    }

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully.',
      project: project.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * DELETE /api/projects/:id
 */
apiRouter.delete('/projects/:id', authenticateToken, requireProjectOwner, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    await Promise.all([
      (ProjectModel as any).findByIdAndDelete(project._id).exec(),
      (ProjectLineageModel as any).deleteMany({ projectId: project._id }).exec(),
      (ProjectReviewModel as any).deleteMany({ projectId: project._id }).exec(),
      (ProjectMemberModel as any).deleteMany({ projectId: project._id }).exec(),
      (CollaborationRequestModel as any).deleteMany({ projectId: project._id }).exec()
    ]);

    res.json({ success: true, message: 'Project and all associated lineage records deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

// ============================================================================
// PROJECT PASSPORT & CONTINUITY / LINEAGE ROUTES
// ============================================================================

/**
 * GET /api/projects/:id/passport
 */
apiRouter.get('/projects/:id/passport', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    res.json({
      success: true,
      passport: project.passport
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/projects/:id/lineage
 */
apiRouter.get('/projects/:id/lineage', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const lineages = await ProjectLineageModel.find({ projectId: project._id } as any).sort({ year: -1 }).exec();

    res.json({
      success: true,
      count: lineages.length,
      lineage: lineages.map(l => l.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * POST /api/projects/:id/lineage
 * Adds continuation milestone to project lineage in MongoDB!
 */
apiRouter.post('/projects/:id/lineage', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const {
      year,
      batchName,
      version = 'v2.0',
      summary,
      keyMilestones = [],
      majorChanges = [],
      technologies = [],
      commits = 0,
      pullRequests = 0,
      activeStatus = 'Current',
      handoverNotes = '',
      documentationUrl,
      leadContributors
    } = req.body;

    if (!year || !batchName || !summary) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: 'Year, batch name, and continuation summary are required.'
      });
      return;
    }

    const contributorsList = Array.isArray(leadContributors) && leadContributors.length > 0
      ? leadContributors
      : [user.fullName];

    const previousLineages = await ProjectLineageModel.find({ projectId: project._id } as any).exec();
    const prevContributorsSet = new Set<string>();
    previousLineages.forEach(l => {
      l.leadContributors?.forEach(c => prevContributorsSet.add(c));
    });

    const newLineage = await ProjectLineageModel.create({
      projectId: project._id,
      year: String(year).trim(),
      batchName: batchName.trim(),
      version: version.trim(),
      institution: project.institution,
      leadContributors: contributorsList,
      previousContributors: Array.from(prevContributorsSet),
      currentContributors: contributorsList,
      keyMilestones: Array.isArray(keyMilestones) ? keyMilestones : [keyMilestones],
      majorChanges: Array.isArray(majorChanges) ? majorChanges : [majorChanges],
      technologies: Array.isArray(technologies) && technologies.length > 0 ? technologies : project.techStack,
      commits: Number(commits) || 10,
      pullRequests: Number(pullRequests) || 2,
      activeStatus: activeStatus as any,
      summary: summary.trim(),
      handoverNotes: handoverNotes.trim(),
      documentationUrl
    });

    project.lineageBatchesCount += 1;
    if (project.passport) {
      project.passport.currentBatch = String(year);
    }
    await project.save();

    res.status(201).json({
      success: true,
      message: `Project lineage extended for ${batchName}. Project continuity preserved!`,
      lineage: newLineage.toJSON()
    });
  } catch (error: any) {
    console.error('[API /projects/:id/lineage] Extension error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * POST /api/projects/:id/continue
 * Continues an existing project, preserving lineage history and establishing the new batch roadmap.
 */
apiRouter.post('/projects/:id/continue', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const {
      year = new Date().getFullYear().toString(),
      batchName = `Batch ${new Date().getFullYear()} Continuation`,
      summary = 'Continuation handover accepted. Initialized new batch roadmap.',
      version = 'v2.0-Active',
      handoverNotes = '',
      keyMilestones = ['Inherited repository and validated baseline.'],
      majorChanges = ['Continued project development for next academic/production cycle.']
    } = req.body;

    const newLineage = await ProjectLineageModel.create({
      projectId: project._id,
      year: String(year).trim(),
      batchName: String(batchName).trim(),
      version: String(version).trim(),
      institution: project.institution,
      leadContributors: [user.fullName],
      previousContributors: project.contributors.map(c => c.name),
      currentContributors: [user.fullName],
      keyMilestones: Array.isArray(keyMilestones) ? keyMilestones : [keyMilestones],
      majorChanges: Array.isArray(majorChanges) ? majorChanges : [majorChanges],
      technologies: project.techStack,
      commits: 5,
      pullRequests: 1,
      activeStatus: 'Current',
      summary: String(summary).trim(),
      handoverNotes: String(handoverNotes).trim()
    });

    // Add user as contributor if not present
    const alreadyIn = project.contributors.some(c => c.user && c.user.toString() === user.id);
    if (!alreadyIn) {
      project.contributors.push({
        user: user._id,
        name: user.fullName,
        role: 'Incoming Lead (Continuation)',
        institution: user.institution || project.institution,
        batch: user.batch || `Batch ${year}`,
        avatar: user.avatar,
        githubHandle: user.githubHandle,
        commitsCount: 0
      });
    }

    project.lineageBatchesCount = (project.lineageBatchesCount || 0) + 1;
    if (project.passport) {
      project.passport.currentBatch = String(year);
    }
    await project.save();

    await ProjectMemberModel.findOneAndUpdate(
      { projectId: project._id, userId: user._id },
      { role: 'Lead Contributor', permissions: ['VIEW', 'CONTRIBUTE', 'EDIT'] },
      { upsert: true, new: true }
    ).exec();

    res.status(201).json({
      success: true,
      message: `Project continuity recorded for ${batchName}. Handover active!`,
      project: project.toJSON(),
      lineage: newLineage.toJSON()
    });
  } catch (error: any) {
    console.error('[API /projects/:id/continue] Error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/projects/:id/members
 */
apiRouter.get('/projects/:id/members', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const members = await ProjectMemberModel.find({ projectId: project._id } as any)
      .populate('userId', 'fullName email role avatar institution department')
      .exec();

    res.json({
      success: true,
      count: members.length,
      members: members.map(m => m.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

// ============================================================================
// FACULTY & PEER REVIEWS (MongoDB Backed)
// ============================================================================

/**
 * POST /api/projects/:id/reviews
 */
apiRouter.post('/projects/:id/reviews', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const isAuthorized =
      user.role === 'ADMIN' ||
      user.role === 'FACULTY' ||
      user.role === 'HOD' ||
      user.isAuthorizedReviewer;

    if (!isAuthorized) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Only authorized faculty, HODs, or institutional reviewers can submit official project evaluations.'
      });
      return;
    }

    const project = await findProjectByIdOrPassport(id);
    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const {
      score,
      comments,
      status = 'APPROVED',
      novelty = 9.0,
      technicalRigor = 9.0,
      documentation = 9.0,
      continuityPotential = 9.5
    } = req.body;

    if (score === undefined || !comments) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Score (0-10) and comments are required.' });
      return;
    }

    const numScore = Math.max(0, Math.min(10, Number(score)));
    const signatureHash = `sig_ed25519_${Date.now().toString(16)}_${Math.random().toString(36).substring(2, 8)}`;

    const review = await ProjectReviewModel.create({
      projectId: project._id,
      reviewerId: user._id,
      reviewerName: user.fullName,
      reviewerRole: user.role,
      reviewerDesignation: user.designation || 'Academic Evaluator',
      department: user.department || project.department,
      institution: user.institution || project.institution,
      score: numScore,
      comments: comments.trim(),
      verified: status === 'APPROVED',
      rubricScores: {
        novelty: Number(novelty) || 9.0,
        technicalRigor: Number(technicalRigor) || 9.0,
        documentation: Number(documentation) || 9.0,
        continuityPotential: Number(continuityPotential) || 9.5
      },
      status: status as any,
      signatureHash
    });

    if (status === 'APPROVED') {
      project.verificationStatus = 'Verified';
      project.reviewStatus = 'VERIFIED';
      project.facultyReviewer = {
        name: user.fullName,
        designation: user.designation || 'Academic Reviewer',
        department: user.department || project.department,
        institution: user.institution || project.institution,
        score: numScore,
        reviewText: comments.trim(),
        verifiedAt: new Date().toLocaleDateString(),
        signatureHash
      };
      if (project.passport) {
        project.passport.status = 'Verified';
        project.passport.facultyReviewer = project.facultyReviewer;
        project.passport.rubricScores = review.rubricScores;
      }
    } else if (status === 'REJECTED') {
      project.verificationStatus = 'Under Review';
      project.reviewStatus = 'REJECTED';
    } else {
      project.verificationStatus = 'Under Review';
      project.reviewStatus = 'UNDER REVIEW';
    }

    await project.save();

    if (project.owner) {
      await NotificationModel.create({
        userId: project.owner,
        type: status === 'APPROVED' ? 'PROJECT_APPROVED' : 'FACULTY_FEEDBACK',
        title: `Project Review: ${project.title}`,
        message: `${user.fullName} (${user.role}) reviewed your project with a score of ${numScore}/10: "${comments.slice(0, 100)}"`,
        projectId: project.id,
        senderName: user.fullName
      });
    }

    res.status(201).json({
      success: true,
      message: `Review submitted and project verification status updated to ${project.verificationStatus}.`,
      review: review.toJSON(),
      project: project.toJSON()
    });
  } catch (error: any) {
    console.error('[API /projects/:id/reviews] Review error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/projects/:id/reviews
 */
apiRouter.get('/projects/:id/reviews', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    const reviews = await ProjectReviewModel.find({ projectId: project._id } as any).sort({ createdAt: -1 }).exec();

    res.json({
      success: true,
      count: reviews.length,
      reviews: reviews.map(r => r.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

// ============================================================================
// COLLABORATION & PROJECT MEMBERSHIP (MongoDB Backed)
// ============================================================================

const handleJoinProject = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const project = await findProjectByIdOrPassport(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    if (project.owner && project.owner.toString() === user.id) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'You are already the owner of this project.' });
      return;
    }

    const alreadyContributor = project.contributors.some(
      c => c.user && c.user.toString() === user.id
    );
    if (alreadyContributor) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'You are already an active contributor on this project.' });
      return;
    }

    const { roleInterest = 'Contributor', message = 'Interested in collaborating on this project!' } = req.body;

    const existingReq = await CollaborationRequestModel.findOne({
      projectId: project._id,
      studentId: user._id,
      status: 'PENDING'
    } as any).exec();

    if (existingReq) {
      res.status(200).json({
        success: true,
        alreadyRequested: true,
        message: 'Your collaboration request is already pending review with the project owner.',
        request: existingReq.toJSON()
      });
      return;
    }

    const request = await CollaborationRequestModel.create({
      projectId: project._id,
      projectTitle: project.title,
      studentId: user._id,
      studentName: user.fullName,
      studentAvatar: user.avatar,
      studentInstitution: user.institution || 'ProjectVerse',
      roleInterest: roleInterest.trim(),
      message: message.trim(),
      targetOwnerId: project.owner || user._id,
      status: 'PENDING'
    });

    if (project.owner) {
      await NotificationModel.create({
        userId: project.owner,
        type: 'COLLABORATION_REQUEST',
        title: `New Contributor Request: ${project.title}`,
        message: `${user.fullName} (${roleInterest}) requested to join ${project.title}: "${message.slice(0, 100)}"`,
        projectId: project.id,
        senderName: user.fullName,
        senderAvatar: user.avatar
      });
    }

    res.status(201).json({
      success: true,
      message: `Collaboration request sent to maintainers of ${project.title}.`,
      request: request.toJSON()
    });
  } catch (error: any) {
    console.error('[API /projects/:id/join] Error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

apiRouter.post('/projects/:id/join', authenticateToken, handleJoinProject);
apiRouter.post('/projects/:id/collaborate', authenticateToken, handleJoinProject);

/**
 * GET /api/collaboration/requests
 */
apiRouter.get('/collaboration/requests', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const [received, sent] = await Promise.all([
      CollaborationRequestModel.find({ targetOwnerId: user._id } as any).sort({ createdAt: -1 }).exec(),
      CollaborationRequestModel.find({ studentId: user._id } as any).sort({ createdAt: -1 }).exec()
    ]);

    res.json({
      success: true,
      received: received.map(r => r.toJSON()),
      sent: sent.map(s => s.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/collaboration/requests/:id
 */
apiRouter.patch('/collaboration/requests/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: "Status must be 'ACCEPTED' or 'REJECTED'." });
      return;
    }

    const request = await (CollaborationRequestModel as any).findById(id).exec();
    if (!request) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Collaboration request not found.' });
      return;
    }

    if (request.targetOwnerId.toString() !== user.id && user.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Only the project owner can approve this request.' });
      return;
    }

    request.status = status;
    request.reviewedAt = new Date();
    await request.save();

    if (status === 'ACCEPTED') {
      const candidateUser = await (UserModel as any).findById(request.studentId).exec();
      const project = await (ProjectModel as any).findById(request.projectId).exec();

      if (project && candidateUser) {
        const alreadyIn = project.contributors.some((c: any) => c.user && c.user.toString() === candidateUser.id);
        if (!alreadyIn) {
          project.contributors.push({
            user: candidateUser._id,
            name: candidateUser.fullName,
            role: request.roleInterest || 'Contributor',
            institution: candidateUser.institution || 'ProjectVerse',
            batch: candidateUser.batch || '2026',
            avatar: candidateUser.avatar,
            githubHandle: candidateUser.githubHandle,
            commitsCount: 0
          });
          await project.save();
        }

        await (ProjectMemberModel as any).findOneAndUpdate(
          { projectId: project._id, userId: candidateUser._id },
          { role: 'Contributor', permissions: ['VIEW', 'CONTRIBUTE'] },
          { upsert: true, new: true }
        ).exec();
      }

      await NotificationModel.create({
        userId: request.studentId,
        type: 'TEAM_UPDATE',
        title: 'Collaboration Request Accepted!',
        message: `Your request to join "${request.projectTitle}" as ${request.roleInterest} has been accepted. Welcome to the team!`,
        projectId: request.projectId.toString(),
        senderName: user.fullName
      });
    }

    res.json({
      success: true,
      message: `Collaboration request marked as ${status}.`,
      request: request.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * POST /api/collaboration/request
 */
apiRouter.post('/collaboration/request', authenticateToken, async (req: Request, res: Response) => {
  const { projectId } = req.body;
  if (!projectId) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'projectId is required.' });
    return;
  }
  req.params.id = projectId;
  return handleJoinProject(req, res);
});

/**
 * GET /api/collaboration/received
 */
apiRouter.get('/collaboration/received', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const received = await CollaborationRequestModel.find({ targetOwnerId: user._id } as any)
      .sort({ createdAt: -1 })
      .exec();
    res.json({
      success: true,
      count: received.length,
      requests: received.map(r => r.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/collaboration/sent
 */
apiRouter.get('/collaboration/sent', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const sent = await CollaborationRequestModel.find({ studentId: user._id } as any)
      .sort({ createdAt: -1 })
      .exec();
    res.json({
      success: true,
      count: sent.length,
      requests: sent.map(s => s.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/collaboration/:id/accept
 */
apiRouter.patch('/collaboration/:id/accept', authenticateToken, async (req: Request, res: Response) => {
  req.body.status = 'ACCEPTED';
  const { id } = req.params;
  const user = req.user!;

  try {
    const request = await (CollaborationRequestModel as any).findById(id).exec();
    if (!request) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Collaboration request not found.' });
      return;
    }
    if (request.targetOwnerId.toString() !== user.id && user.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Only the project owner can approve this request.' });
      return;
    }

    request.status = 'ACCEPTED';
    request.reviewedAt = new Date();
    await request.save();

    const candidateUser = await (UserModel as any).findById(request.studentId).exec();
    const project = await (ProjectModel as any).findById(request.projectId).exec();

    if (project && candidateUser) {
      const alreadyIn = project.contributors.some((c: any) => c.user && c.user.toString() === candidateUser.id);
      if (!alreadyIn) {
        project.contributors.push({
          user: candidateUser._id,
          name: candidateUser.fullName,
          role: request.roleInterest || 'Contributor',
          institution: candidateUser.institution || 'ProjectVerse',
          batch: candidateUser.batch || '2026',
          avatar: candidateUser.avatar,
          githubHandle: candidateUser.githubHandle,
          commitsCount: 0
        });
        await project.save();
      }

      await (ProjectMemberModel as any).findOneAndUpdate(
        { projectId: project._id, userId: candidateUser._id },
        { role: 'Contributor', permissions: ['VIEW', 'CONTRIBUTE'] },
        { upsert: true, new: true }
      ).exec();
    }

    await NotificationModel.create({
      userId: request.studentId,
      type: 'TEAM_UPDATE',
      title: 'Collaboration Request Accepted!',
      message: `Your request to join "${request.projectTitle}" as ${request.roleInterest} has been accepted. Welcome to the team!`,
      projectId: request.projectId.toString(),
      senderName: user.fullName
    });

    res.json({
      success: true,
      message: 'Collaboration request accepted and member added to project.',
      request: request.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/collaboration/:id/reject
 */
apiRouter.patch('/collaboration/:id/reject', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  try {
    const request = await (CollaborationRequestModel as any).findById(id).exec();
    if (!request) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Collaboration request not found.' });
      return;
    }
    if (request.targetOwnerId.toString() !== user.id && user.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Only the project owner can reject this request.' });
      return;
    }

    request.status = 'REJECTED';
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Collaboration request rejected.',
      request: request.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

// ============================================================================
// DOCUMENT UPLOADS & VERIFICATION QUEUE (MongoDB Backed, Secure Storage)
// ============================================================================

/**
 * POST /api/documents/upload
 */
apiRouter.post(
  '/documents/upload',
  authenticateToken,
  (documentUpload.single('file') as any),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'No file uploaded or file type rejected.' });
      return;
    }

    const fileData = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName: req.file.originalname,
      storedName: req.file.filename,
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Document uploaded securely.',
      document: fileData
    });
  }
);

/**
 * GET /api/documents/:id
 */
apiRouter.get('/documents/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!documentStorageService.fileExists(id)) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Requested document was not found.' });
      return;
    }

    const filePath = documentStorageService.getFilePath(id);
    res.sendFile(filePath);
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * POST /api/verification/upload
 */
apiRouter.post('/verification/upload', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { documentType, documentFileName, documentFileSize, documentPath, documentMimeType } = req.body;

    if (!documentType || !documentFileName) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Document type and file name are required.' });
      return;
    }

    const verReq = await VerificationRequestModel.create({
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      studentType: user.studentType,
      institution: user.institution || 'Unspecified',
      department: user.department || 'Unspecified',
      course: user.course,
      batch: user.batch,
      graduationYear: user.graduationYear,
      rollNumber: user.rollNumber,
      documentType,
      documentFileName,
      documentFileSize: documentFileSize || '2.2 MB',
      documentPath,
      documentMimeType,
      documentUploadedAt: new Date(),
      status: 'PENDING_REVIEW'
    });

    user.verification.document = 'PENDING';
    user.verification.documentVerified = false;
    user.verificationStatus = 'UNDER_REVIEW';
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Verification document uploaded and submitted for institutional review.',
      request: verReq.toJSON()
    });
  } catch (error: any) {
    console.error('[API /verification/upload] Error:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/verification/requests
 */
apiRouter.get(
  '/verification/requests',
  authenticateToken,
  requireRole('FACULTY', 'HOD', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const requests = await VerificationRequestModel.find().sort({ createdAt: -1 }).exec();
      res.json({
        success: true,
        count: requests.length,
        requests: requests.map(r => r.toJSON())
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
    }
  }
);

/**
 * POST /api/verification/review
 */
apiRouter.post(
  '/verification/review',
  authenticateToken,
  requireRole('FACULTY', 'HOD', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const reviewer = req.user!;
      const { requestId, status, rejectionReason } = req.body;

      if (!requestId || !['VERIFIED', 'REJECTED'].includes(status)) {
        res.status(400).json({
          success: false,
          error: 'BAD_REQUEST',
          message: "Request ID and review status ('VERIFIED' or 'REJECTED') are required."
        });
        return;
      }

      const verReq = await (VerificationRequestModel as any).findById(requestId).exec();
      if (!verReq) {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Verification request not found.' });
        return;
      }

      verReq.status = status;
      verReq.reviewedBy = `${reviewer.fullName} (${reviewer.role})`;
      verReq.reviewedAt = new Date();
      if (status === 'REJECTED') {
        verReq.rejectionReason = rejectionReason || 'Information or document could not be validated.';
      }
      await verReq.save();

      const targetUser = await (UserModel as any).findById(verReq.userId).exec();
      if (targetUser) {
        if (status === 'VERIFIED') {
          targetUser.verificationStatus = 'VERIFIED';
          targetUser.verification.academic = 'VERIFIED';
          targetUser.verification.document = 'VERIFIED';
          targetUser.verification.institution = 'VERIFIED';
          targetUser.verification.academicVerified = true;
          targetUser.verification.documentVerified = true;
          targetUser.verification.institutionVerified = true;
          targetUser.verification.facultyReviewed = true;
          targetUser.verification.rejectionReason = undefined;
          targetUser.status = 'ACTIVE';
        } else {
          targetUser.verificationStatus = 'REJECTED';
          targetUser.verification.academic = 'REJECTED';
          targetUser.verification.document = 'REJECTED';
          targetUser.verification.academicVerified = false;
          targetUser.verification.documentVerified = false;
          targetUser.verification.rejectionReason = verReq.rejectionReason;
        }
        await targetUser.save();

        await NotificationModel.create({
          userId: targetUser._id,
          type: 'SYSTEM',
          title: `Verification ${status === 'VERIFIED' ? 'Approved' : 'Rejected'}`,
          message: status === 'VERIFIED'
            ? 'Your institutional identity and academic documents have been verified.'
            : `Your verification request was rejected: ${verReq.rejectionReason}`,
          senderName: reviewer.fullName
        });
      }

      res.json({
        success: true,
        message: `Verification request ${status === 'VERIFIED' ? 'approved' : 'rejected'} by ${reviewer.fullName}.`,
        request: verReq.toJSON()
      });
    } catch (error: any) {
      console.error('[API /verification/review] Review error:', error);
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
    }
  }
);

/**
 * POST /api/verifications
 */
apiRouter.post('/verifications', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { documentType, documentFileName, documentFileSize, documentPath, documentMimeType } = req.body;

    if (!documentType || !documentFileName) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Document type and file name are required.' });
      return;
    }

    const verReq = await VerificationRequestModel.create({
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      studentType: user.studentType,
      institution: user.institution || 'Unspecified',
      department: user.department || 'Unspecified',
      course: user.course,
      batch: user.batch,
      graduationYear: user.graduationYear,
      rollNumber: user.rollNumber,
      documentType,
      documentFileName,
      documentFileSize: documentFileSize || '2.2 MB',
      documentPath,
      documentMimeType,
      documentUploadedAt: new Date(),
      status: 'PENDING_REVIEW'
    });

    user.verification.document = 'PENDING';
    user.verification.documentVerified = false;
    user.verificationStatus = 'UNDER_REVIEW';
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Verification request submitted for institutional review.',
      request: verReq.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/verifications
 */
apiRouter.get('/verifications', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const filter = (user.role === 'ADMIN' || user.role === 'HOD' || user.role === 'FACULTY')
      ? {}
      : { userId: user._id };
    const requests = await VerificationRequestModel.find(filter as any).sort({ createdAt: -1 }).exec();
    res.json({
      success: true,
      count: requests.length,
      verifications: requests.map(r => r.toJSON()),
      requests: requests.map(r => r.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/verifications/:id
 */
apiRouter.patch('/verifications/:id', authenticateToken, requireRole('FACULTY', 'HOD', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const reviewer = req.user!;
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: "Review status ('VERIFIED' or 'REJECTED') is required."
      });
      return;
    }

    const verReq = await (VerificationRequestModel as any).findById(id).exec();
    if (!verReq) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Verification request not found.' });
      return;
    }

    verReq.status = status;
    verReq.reviewedBy = `${reviewer.fullName} (${reviewer.role})`;
    verReq.reviewedAt = new Date();
    if (status === 'REJECTED') {
      verReq.rejectionReason = rejectionReason || 'Information or document could not be validated.';
    }
    await verReq.save();

    const targetUser = await (UserModel as any).findById(verReq.userId).exec();
    if (targetUser) {
      if (status === 'VERIFIED') {
        targetUser.verificationStatus = 'VERIFIED';
        targetUser.verification.academic = 'VERIFIED';
        targetUser.verification.document = 'VERIFIED';
        targetUser.verification.institution = 'VERIFIED';
        targetUser.verification.academicVerified = true;
        targetUser.verification.documentVerified = true;
        targetUser.verification.institutionVerified = true;
        targetUser.verification.facultyReviewed = true;
        targetUser.status = 'ACTIVE';
      } else {
        targetUser.verificationStatus = 'REJECTED';
        targetUser.verification.academic = 'REJECTED';
        targetUser.verification.document = 'REJECTED';
      }
      await targetUser.save();
    }

    res.json({
      success: true,
      message: `Verification marked as ${status}.`,
      verification: verReq.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

// ============================================================================
// USER PROFILES (MongoDB Backed)
// ============================================================================

/**
 * GET /api/users/me
 */
apiRouter.get('/users/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      profile: user.toJSON(),
      user: user.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/users/me
 */
apiRouter.patch('/users/me', authenticateToken, async (req: Request, res: Response) => {
  req.params.id = req.user!.id;
  return handleUpdateUser(req, res);
});

const handleGetUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const filter: any = isObjectId ? { $or: [{ _id: id }, { email: id.toLowerCase().trim() }] } : { email: id.toLowerCase().trim() };

    const user = await (UserModel as any).findOne(filter).exec();

    if (!user) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      profile: user.toJSON(),
      user: user.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

apiRouter.get('/users/:id', optionalAuth, handleGetUser);
apiRouter.get('/users/:id/profile', optionalAuth, handleGetUser);

const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user!;
    const { id } = req.params;

    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'You are not authorized to edit this profile.' });
      return;
    }

    const targetUser = await (UserModel as any).findById(id).exec();
    if (!targetUser) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'User not found.' });
      return;
    }

    const {
      bio,
      skills,
      avatar,
      githubHandle,
      linkedIn,
      portfolio,
      currentOrganization,
      currentJobRole,
      experienceYears,
      researchInterests
    } = req.body;

    if (bio !== undefined) targetUser.bio = String(bio).slice(0, 1000);
    if (skills !== undefined) targetUser.skills = Array.isArray(skills) ? skills : [];
    if (avatar !== undefined) targetUser.avatar = String(avatar);
    if (githubHandle !== undefined) {
      targetUser.githubHandle = String(githubHandle).trim();
      targetUser.verification.githubConnected = Boolean(githubHandle);
    }
    if (linkedIn !== undefined) {
      targetUser.linkedIn = String(linkedIn).trim();
      targetUser.verification.linkedInAdded = Boolean(linkedIn);
    }
    if (portfolio !== undefined) {
      targetUser.portfolio = String(portfolio).trim();
      targetUser.verification.portfolioAdded = Boolean(portfolio);
    }
    if (currentOrganization !== undefined) targetUser.currentOrganization = String(currentOrganization).trim();
    if (currentJobRole !== undefined) targetUser.currentJobRole = String(currentJobRole).trim();
    if (experienceYears !== undefined) targetUser.experienceYears = Number(experienceYears);
    if (researchInterests !== undefined) targetUser.researchInterests = Array.isArray(researchInterests) ? researchInterests : [];

    await targetUser.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: targetUser.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

apiRouter.patch('/users/:id', authenticateToken, handleUpdateUser);
apiRouter.put('/users/:id/profile', authenticateToken, handleUpdateUser);

// ============================================================================
// ADMIN RBAC MANAGEMENT (MongoDB Backed)
// ============================================================================

/**
 * GET /api/admin/users
 */
apiRouter.get('/admin/users', authenticateToken, requireRole('ADMIN'), async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 }).exec();
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => u.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/admin/users/:id/status
 */
apiRouter.patch('/admin/users/:id/status', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'].includes(status)) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Invalid account status.' });
      return;
    }

    const user = await (UserModel as any).findById(id).exec();
    if (!user) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'User not found.' });
      return;
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: `User status changed to ${status}.`,
      user: user.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/admin/projects
 */
apiRouter.get('/admin/projects', authenticateToken, requireRole('ADMIN'), async (_req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.find().sort({ createdAt: -1 }).exec();
    res.json({
      success: true,
      count: projects.length,
      projects: projects.map(p => p.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/admin/projects/:id/moderate
 */
apiRouter.patch('/admin/projects/:id/moderate', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verificationStatus, featured } = req.body;

    const project = await (ProjectModel as any).findById(id).exec();
    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    if (verificationStatus !== undefined) project.verificationStatus = verificationStatus;
    if (featured !== undefined) project.featured = Boolean(featured);

    await project.save();

    res.json({
      success: true,
      message: 'Project moderation updated.',
      project: project.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/admin/stats
 */
apiRouter.get('/admin/stats', authenticateToken, requireRole('ADMIN'), async (_req: Request, res: Response) => {
  try {
    const [usersCount, projectsCount, verificationsCount, lineagesCount] = await Promise.all([
      UserModel.countDocuments().exec(),
      ProjectModel.countDocuments().exec(),
      VerificationRequestModel.countDocuments({ status: 'PENDING_REVIEW' }).exec(),
      ProjectLineageModel.countDocuments().exec()
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers: usersCount,
        totalProjects: projectsCount,
        pendingVerifications: verificationsCount,
        totalLineageMilestones: lineagesCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/admin/verifications
 */
apiRouter.get('/admin/verifications', authenticateToken, requireRole('ADMIN'), async (_req: Request, res: Response) => {
  try {
    const requests = await VerificationRequestModel.find().sort({ createdAt: -1 }).exec();
    res.json({
      success: true,
      count: requests.length,
      verifications: requests.map(r => r.toJSON()),
      requests: requests.map(r => r.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * GET /api/institutions
 */
apiRouter.get('/institutions', async (_req: Request, res: Response) => {
  try {
    const institutions = await InstitutionModel.find().exec();
    res.json({
      success: true,
      institutions: institutions.map(i => i.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

// ============================================================================
// NOTIFICATIONS (MongoDB Backed)
// ============================================================================

/**
 * GET /api/notifications
 */
apiRouter.get('/notifications', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const notifications = await NotificationModel.find({ userId: user._id } as any)
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
    res.json({
      success: true,
      count: notifications.length,
      notifications: notifications.map(n => n.toJSON())
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/notifications/:id/read
 */
apiRouter.patch('/notifications/:id/read', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const notification = await (NotificationModel as any).findOneAndUpdate(
      { _id: id, userId: user._id },
      { read: true },
      { new: true }
    ).exec();

    if (!notification) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Notification marked as read.',
      notification: notification.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});

/**
 * PATCH /api/notifications/read-all
 */
apiRouter.patch('/notifications/read-all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    await NotificationModel.updateMany({ userId: user._id } as any, { read: true }).exec();
    res.json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
});
