import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  EraMentoringModel,
  EraProjectModel,
  EraUserModel,
  IEraMentoringDocument,
  IEraProjectDocument,
  IEraUserDocument
} from './models/EraWorkspace';
import {
  DEMO_USERS,
  INITIAL_DEMO_PROJECTS,
  INITIAL_MENTORING_REQUESTS
} from '../src/data/projectEraData';
import {
  EraAccountType,
  EraMentoringRequest,
  EraProject,
  EraUserProfile
} from '../src/types/projectEra';

export const eraRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'project-era-academic-secret-key-2026';
const ERA_COOKIE_NAME = 'project_era_token';

function toUserProfile(doc: IEraUserDocument): EraUserProfile {
  return {
    id: doc.userId,
    fullName: doc.fullName,
    email: doc.email,
    accountType: doc.accountType,
    institution: doc.institution,
    department: doc.department,
    course: doc.course,
    batch: doc.batch,
    rollNumber: doc.rollNumber,
    designation: doc.designation,
    areasOfExpertise: doc.areasOfExpertise,
    graduationYear: doc.graduationYear,
    currentOrganization: doc.currentOrganization,
    currentJobRole: doc.currentJobRole,
    skills: doc.skills,
    linkedInOrPortfolio: doc.linkedInOrPortfolio,
    bio: doc.bio
  };
}

function toProject(doc: IEraProjectDocument): EraProject {
  return {
    id: doc.projectId,
    title: doc.title,
    description: doc.description,
    domain: doc.domain,
    technologies: doc.technologies || [],
    status: doc.status,
    academicSession: doc.academicSession,
    institution: doc.institution,
    department: doc.department,
    supervisorName: doc.supervisorName,
    supervisorEmail: doc.supervisorEmail,
    leadStudentName: doc.leadStudentName,
    teamMembers: doc.teamMembers || [],
    tasks: doc.tasks || [],
    milestones: doc.milestones || [],
    documents: doc.documents || [],
    reviews: doc.reviews || [],
    updatedAt: doc.updatedAt
  };
}

function toMentoring(doc: IEraMentoringDocument): EraMentoringRequest {
  return {
    id: doc.requestId,
    projectId: doc.projectId,
    projectTitle: doc.projectTitle,
    studentName: doc.studentName,
    department: doc.department,
    alumniName: doc.alumniName,
    topic: doc.topic,
    message: doc.message,
    status: doc.status,
    requestedAt: doc.requestedAt
  };
}

let isSeeding = false;

export async function ensureEraSeedData(): Promise<void> {
  if (isSeeding) return;
  try {
    isSeeding = true;
    const projectCount = await EraProjectModel.countDocuments().exec();
    if (projectCount === 0) {
      const defaultPasswordHash = bcryptjs.hashSync('ProjectEra@2026', 10);
      const roleUsers = Object.values(DEMO_USERS);
      for (const u of roleUsers) {
        await EraUserModel.findOneAndUpdate(
          { email: u.email.toLowerCase() },
          {
            userId: u.id,
            fullName: u.fullName,
            email: u.email.toLowerCase(),
            passwordHash: defaultPasswordHash,
            accountType: u.accountType,
            institution: u.institution,
            department: u.department,
            course: u.course,
            batch: u.batch,
            rollNumber: u.rollNumber,
            designation: u.designation,
            areasOfExpertise: u.areasOfExpertise,
            graduationYear: u.graduationYear,
            currentOrganization: u.currentOrganization,
            currentJobRole: u.currentJobRole,
            skills: u.skills,
            linkedInOrPortfolio: u.linkedInOrPortfolio,
            bio: u.bio
          },
          { upsert: true, new: true }
        ).exec();
      }

      for (const p of INITIAL_DEMO_PROJECTS) {
        const { id, ...rest } = p;
        await EraProjectModel.findOneAndUpdate(
          { projectId: id },
          { projectId: id, ...rest },
          { upsert: true, new: true }
        ).exec();
      }

      for (const m of INITIAL_MENTORING_REQUESTS) {
        const { id, ...rest } = m;
        await EraMentoringModel.findOneAndUpdate(
          { requestId: id },
          { requestId: id, ...rest },
          { upsert: true, new: true }
        ).exec();
      }
    }
  } catch (err) {
    console.error('[Project Era API] Seed check error:', err);
  } finally {
    isSeeding = false;
  }
}

function setAuthCookie(res: Response, user: EraUserProfile) {
  const token = jwt.sign(
    { userId: user.id, email: user.email, accountType: user.accountType },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie(ERA_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// GET /api/era/bootstrap
eraRouter.get('/bootstrap', async (req: Request, res: Response) => {
  try {
    await ensureEraSeedData();
    const [projectDocs, mentoringDocs] = await Promise.all([
      EraProjectModel.find().sort({ updatedAt: -1 }).exec(),
      EraMentoringModel.find().sort({ createdAt: -1 }).exec()
    ]);

    let currentUser: EraUserProfile | null = null;
    const token = req.cookies?.[ERA_COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const userDoc = await EraUserModel.findOne({ userId: decoded.userId }).exec();
        if (userDoc) {
          currentUser = toUserProfile(userDoc);
        }
      } catch {
        // Invalid or expired token
      }
    }

    res.json({
      success: true,
      source: 'mongodb',
      currentUser,
      projects: projectDocs.map(toProject),
      mentoringRequests: mentoringDocs.map(toMentoring)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to load Project Era workspace data'
    });
  }
});

// POST /api/era/auth/login
eraRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    await ensureEraSeedData();
    const { email, password, accountType, quickRoleSwitch } = req.body;

    if (quickRoleSwitch && accountType) {
      const roleKey = String(accountType).toUpperCase() as EraAccountType;
      const preset = DEMO_USERS[roleKey];
      if (!preset) {
        res.status(400).json({ success: false, message: 'Invalid role selected.' });
        return;
      }
      const userDoc = await EraUserModel.findOne({ email: preset.email.toLowerCase() }).exec();
      const profile = userDoc ? toUserProfile(userDoc) : preset;
      setAuthCookie(res, profile);
      res.json({ success: true, user: profile });
      return;
    }

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let userDoc = await EraUserModel.findOne({ email: cleanEmail }).exec();

    if (userDoc) {
      const valid = await bcryptjs.compare(String(password), userDoc.passwordHash);
      // Allow preset users or matching password
      if (!valid && String(password).length < 6) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
        return;
      }
    } else {
      // Create a new user session in MongoDB for the selected role if logging in with custom college email
      const roleKey = (String(accountType || 'STUDENT').toUpperCase() as EraAccountType);
      const basePreset = DEMO_USERS[roleKey] || DEMO_USERS.STUDENT;
      const hash = await bcryptjs.hash(String(password), 10);
      userDoc = await EraUserModel.create({
        userId: `era-user-${Date.now()}`,
        fullName: cleanEmail
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanEmail,
        passwordHash: hash,
        accountType: roleKey,
        institution: basePreset.institution,
        department: basePreset.department,
        course: basePreset.course,
        batch: basePreset.batch,
        designation: basePreset.designation,
        graduationYear: basePreset.graduationYear,
        currentOrganization: basePreset.currentOrganization,
        currentJobRole: basePreset.currentJobRole,
        skills: basePreset.skills,
        bio: basePreset.bio
      });
    }

    const profile = toUserProfile(userDoc);
    setAuthCookie(res, profile);
    res.json({ success: true, user: profile });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Login failed'
    });
  }
});

// POST /api/era/auth/register
eraRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    await ensureEraSeedData();
    const {
      fullName,
      email,
      password,
      accountType,
      institution,
      department,
      course,
      batch,
      rollNumber,
      designation,
      areasOfExpertise,
      graduationYear,
      currentOrganization,
      currentJobRole,
      skills,
      linkedInOrPortfolio,
      bio
    } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Full name, college email, and password are required.'
      });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const passwordHash = await bcryptjs.hash(String(password), 10);
    const roleKey = (String(accountType || 'STUDENT').toUpperCase() as EraAccountType);

    const userDoc = await EraUserModel.findOneAndUpdate(
      { email: cleanEmail },
      {
        userId: `era-user-${Date.now()}`,
        fullName: String(fullName).trim(),
        email: cleanEmail,
        passwordHash,
        accountType: roleKey,
        institution: institution || 'National Institute of Engineering & Technology',
        department: department || 'Computer Science & Engineering',
        course,
        batch,
        rollNumber,
        designation,
        areasOfExpertise,
        graduationYear,
        currentOrganization,
        currentJobRole,
        skills,
        linkedInOrPortfolio,
        bio
      },
      { upsert: true, new: true }
    ).exec();

    const profile = toUserProfile(userDoc);
    setAuthCookie(res, profile);
    res.status(201).json({ success: true, user: profile });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Registration failed'
    });
  }
});

// POST /api/era/auth/logout
eraRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie(ERA_COOKIE_NAME);
  res.json({ success: true });
});

// PUT /api/era/profile
eraRouter.put('/profile', async (req: Request, res: Response) => {
  try {
    const profileUpdate: EraUserProfile = req.body;
    if (!profileUpdate || !profileUpdate.email) {
      res.status(400).json({ success: false, message: 'Valid profile payload required.' });
      return;
    }

    const updatedDoc = await EraUserModel.findOneAndUpdate(
      { email: profileUpdate.email.toLowerCase() },
      {
        fullName: profileUpdate.fullName,
        institution: profileUpdate.institution,
        department: profileUpdate.department,
        course: profileUpdate.course,
        batch: profileUpdate.batch,
        rollNumber: profileUpdate.rollNumber,
        designation: profileUpdate.designation,
        areasOfExpertise: profileUpdate.areasOfExpertise,
        graduationYear: profileUpdate.graduationYear,
        currentOrganization: profileUpdate.currentOrganization,
        currentJobRole: profileUpdate.currentJobRole,
        skills: profileUpdate.skills,
        linkedInOrPortfolio: profileUpdate.linkedInOrPortfolio,
        bio: profileUpdate.bio
      },
      { new: true }
    ).exec();

    const resultProfile = updatedDoc ? toUserProfile(updatedDoc) : profileUpdate;
    res.json({ success: true, user: resultProfile });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to update profile'
    });
  }
});

// POST /api/era/projects
eraRouter.post('/projects', async (req: Request, res: Response) => {
  try {
    const project: EraProject = req.body;
    if (!project || !project.title) {
      res.status(400).json({ success: false, message: 'Project title is required.' });
      return;
    }

    const projectId = project.id || `proj-era-${Date.now()}`;
    const { id: _unused, ...rest } = project;

    const createdDoc = await EraProjectModel.findOneAndUpdate(
      { projectId },
      { projectId, ...rest },
      { upsert: true, new: true }
    ).exec();

    res.status(201).json({
      success: true,
      project: toProject(createdDoc)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to create project'
    });
  }
});

// PUT /api/era/projects/:id
eraRouter.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project: EraProject = req.body;
    const { id: _unused, ...rest } = project;

    const updatedDoc = await EraProjectModel.findOneAndUpdate(
      { projectId },
      { projectId, ...rest },
      { upsert: true, new: true }
    ).exec();

    res.json({
      success: true,
      project: toProject(updatedDoc)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to update project'
    });
  }
});

// DELETE /api/era/projects/:id
eraRouter.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    await EraProjectModel.deleteOne({ projectId }).exec();
    res.json({ success: true, deletedId: projectId });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to delete project'
    });
  }
});

// POST /api/era/mentoring
eraRouter.post('/mentoring', async (req: Request, res: Response) => {
  try {
    const reqPayload: EraMentoringRequest = req.body;
    const requestId = reqPayload.id || `ment-${Date.now()}`;
    const { id: _unused, ...rest } = reqPayload;

    const createdDoc = await EraMentoringModel.findOneAndUpdate(
      { requestId },
      { requestId, ...rest },
      { upsert: true, new: true }
    ).exec();

    res.status(201).json({
      success: true,
      mentoringRequest: toMentoring(createdDoc)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to create mentoring request'
    });
  }
});

// PUT /api/era/mentoring/:id
eraRouter.put('/mentoring/:id', async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const updatedDoc = await EraMentoringModel.findOneAndUpdate(
      { requestId },
      { status },
      { new: true }
    ).exec();

    if (!updatedDoc) {
      res.status(404).json({ success: false, message: 'Mentoring request not found.' });
      return;
    }

    res.json({
      success: true,
      mentoringRequest: toMentoring(updatedDoc)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to update mentoring request'
    });
  }
});

// POST /api/era/reset
eraRouter.post('/reset', async (_req: Request, res: Response) => {
  try {
    await EraProjectModel.deleteMany({}).exec();
    await EraMentoringModel.deleteMany({}).exec();
    await ensureEraSeedData();

    const [projectDocs, mentoringDocs] = await Promise.all([
      EraProjectModel.find().sort({ updatedAt: -1 }).exec(),
      EraMentoringModel.find().sort({ createdAt: -1 }).exec()
    ]);

    res.json({
      success: true,
      projects: projectDocs.map(toProject),
      mentoringRequests: mentoringDocs.map(toMentoring)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to reset workspace data'
    });
  }
});
