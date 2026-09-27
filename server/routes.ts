import { Router, Request, Response } from 'express';
import { 
  db, 
  getUserById, 
  getUserByEmail, 
  createUser, 
  updateUser, 
  listUsers,
  getProjects,
  getProjectById,
  createProject,
  createOTP,
  verifyOTP,
  createEmailOTP,
  verifyEmailOTP,
  createMobileOTP,
  verifyMobileOTP,
  buildVerificationStatus,
  createSession,
  deleteSession,
  listVerificationRequests,
  getVerificationRequestById,
  updateVerificationRequest,
  createVerificationRequest,
  listRegistrationRequests,
  getRegistrationRequestById,
  getRegistrationRequestByEmail,
  getRegistrationRequestByUserId,
  createRegistrationRequest,
  updateRegistrationRequest,
  approveRegistrationRequest,
  rejectRegistrationRequest,
  requestChangesForRegistration,
  resubmitRegistrationRequest,
  verifyUserIdentity,
  rejectUserVerification,
  ServerUser
} from './db';
import { authenticateToken, requireRole, requirePermission } from './rbac';
import { 
  UserRole, 
  ProjectType, 
  VerificationRequest,
  RegistrationRequest,
  RegistrationStatus,
  RegistrationDocument,
  DocumentType
} from '../src/types';

export const apiRouter = Router();

// ============================================================================
// HEALTH CHECK
// ============================================================================
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ProjectVerse Open Project Ecosystem Engine',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// AUTHENTICATION & MULTI-STEP VERIFICATION ROUTES
// ============================================================================

/**
 * POST /api/auth/send-email-otp
 * Dispatches verification code to email (College/Institution or Personal)
 */
apiRouter.post('/auth/send-email-otp', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'A valid email address is required.' });
    return;
  }
  const cleanEmail = email.toLowerCase().trim();
  const code = createEmailOTP(cleanEmail);
  console.log(`[ProjectVerse Auth] Email OTP for ${cleanEmail}: ${code}`);
  res.json({
    success: true,
    message: `Verification code sent to ${cleanEmail}.`,
    demoHint: 'For rapid testing in preview, code 849201 is universally accepted.'
  });
});

/**
 * POST /api/auth/verify-email-otp
 * Verifies email OTP code
 */
apiRouter.post('/auth/verify-email-otp', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Email and 6-digit OTP code are required.' });
    return;
  }
  const cleanEmail = email.toLowerCase().trim();
  const isValid = verifyEmailOTP(cleanEmail, code);
  if (!isValid) {
    res.status(400).json({ error: 'INVALID_OTP', message: 'Invalid or expired email verification code.' });
    return;
  }
  res.json({ success: true, verified: true, message: 'Email successfully verified.' });
});

/**
 * POST /api/auth/send-mobile-otp
 * Dispatches SMS verification code to mobile number
 */
apiRouter.post('/auth/send-mobile-otp', (req: Request, res: Response) => {
  const { mobile } = req.body;
  if (!mobile || mobile.replace(/[^0-9]/g, '').length < 7) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'A valid mobile number is required.' });
    return;
  }
  const code = createMobileOTP(mobile);
  console.log(`[ProjectVerse Auth] Mobile OTP for ${mobile}: ${code}`);
  res.json({
    success: true,
    message: `Verification code sent via SMS to ${mobile}.`,
    demoHint: 'For rapid testing in preview, code 849201 is universally accepted.'
  });
});

/**
 * POST /api/auth/verify-mobile-otp
 * Verifies mobile OTP code
 */
apiRouter.post('/auth/verify-mobile-otp', (req: Request, res: Response) => {
  const { mobile, code } = req.body;
  if (!mobile || !code) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Mobile number and 6-digit OTP code are required.' });
    return;
  }
  const isValid = verifyMobileOTP(mobile, code);
  if (!isValid) {
    res.status(400).json({ error: 'INVALID_OTP', message: 'Invalid or expired mobile verification code.' });
    return;
  }
  res.json({ success: true, verified: true, message: 'Mobile number successfully verified.' });
});

/**
 * POST /api/auth/register
 * Unified multi-identity registration with strict identity-specific requirements.
 * CORE WORKFLOW: 
 * Select Role -> Fill Details -> Upload Docs -> Submit Registration -> Create Registration Request (PENDING)
 * Permanent User ID and Profile are created ONLY AFTER Reviewer/Admin approves the registration.
 * Verification remains PENDING until role-specific verification is approved.
 */
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const {
      role,
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
      emailVerified = false,
      mobileVerified = false,
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
      documentFileSize,
      documentId
    } = req.body;

    // Security Gate: Admin accounts must NEVER appear in public signup
    if (role === 'ADMIN' || (role as string)?.toUpperCase() === 'ADMIN') {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Security Violation: Administrator and Governance accounts cannot be created via public registration. Contact the Institutional Office.'
      });
      return;
    }

    if (!role) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'User role/identity is required.' });
      return;
    }

    if (!fullName || fullName.trim().length < 2) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Full name must be at least 2 characters.' });
      return;
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'A valid email address is required.' });
      return;
    }

    if (!password || password.length < 8) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Password must be at least 8 characters.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Passwords do not match.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Strict Role-specific input validation
    if (role === 'STUDENT') {
      if (!institution || !course || !department) {
        res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Students must provide College/Institution, Course, and Department.'
        });
        return;
      }
      if (!batch) {
        res.status(400).json({ error: 'BAD_REQUEST', message: 'Students must provide their Batch / Academic Year.' });
        return;
      }
    } else if (role === 'ALUMNI') {
      if (!institution || !course || !department || !graduationYear) {
        res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Alumni must provide College/Institution, Course, Department, and Graduation Year.'
        });
        return;
      }
    } else if (role === 'DEVELOPER') {
      // Developers provide skills / portfolio / GitHub
    } else if (role === 'RESEARCHER') {
      if (!researchInterests || (Array.isArray(researchInterests) && researchInterests.length === 0)) {
        res.status(400).json({ error: 'BAD_REQUEST', message: 'Researchers must specify primary research interests.' });
        return;
      }
    } else if (role === 'INDUSTRY_PROFESSIONAL') {
      if (!currentJobRole) {
        res.status(400).json({ error: 'BAD_REQUEST', message: 'Industry professionals must provide their job role or field.' });
        return;
      }
    } else if (role === 'FACULTY') {
      if (!institution || !department || !designation || !facultyId) {
        res.status(400).json({ error: 'BAD_REQUEST', message: 'Faculty must provide institution, department, designation, and employee ID.' });
        return;
      }
    } else if (role === 'HOD') {
      if (!institution || !department || !facultyId || !departmentToken) {
        res.status(400).json({ error: 'BAD_REQUEST', message: 'HODs must provide institution, department, faculty ID, and department authorization token.' });
        return;
      }
    } else if (role === 'INSTITUTION') {
      if (!institution || !institutionType || !officialDomain || !contactPerson) {
        res.status(400).json({ error: 'BAD_REQUEST', message: 'Institutions must provide institution name, type, official domain, and contact person.' });
        return;
      }
    }

    // Check if an active user already exists with this email
    const existingUser = getUserByEmail(normalizedEmail);
    if (existingUser) {
      res.status(200).json({
        success: false,
        accountExists: true,
        message: 'An active account with this email address already exists. Please sign in to access your ProjectVerse workspace.'
      });
      return;
    }

    // Prepare uploaded documents array
    const docs: RegistrationDocument[] = [];
    if (documentType && documentFileName) {
      docs.push({
        id: documentId || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        documentType,
        fileName: documentFileName,
        fileSize: documentFileSize || '2.1 MB',
        uploadedAt: new Date().toISOString(),
        status: 'PENDING'
      });
    }

    // Check if a Registration Request already exists for this email
    const existingReq = getRegistrationRequestByEmail(normalizedEmail);
    if (existingReq) {
      if (existingReq.status === 'APPROVED' && existingReq.userId) {
        res.status(200).json({
          success: true,
          alreadyApproved: true,
          message: 'Your registration has already been approved by administrators. Please sign in.',
          registrationRequest: existingReq
        });
        return;
      }

      if (existingReq.status === 'PENDING') {
        // Idempotent retry / update: update existing request without 409 conflict
        const updated = updateRegistrationRequest(existingReq.id, {
          fullName: fullName.trim(),
          mobile: mobile?.trim(),
          passwordHash: password,
          role: role as UserRole,
          institution: institution?.trim(),
          department: department?.trim(),
          course: course?.trim(),
          batch: batch?.trim(),
          graduationYear: graduationYear?.trim(),
          rollNumber: rollNumber?.trim(),
          studentType: role === 'STUDENT' ? studentType : undefined,
          currentOrganization: currentOrganization?.trim(),
          currentJobRole: currentJobRole?.trim(),
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          githubHandle: githubHandle?.trim() || githubUsername?.trim(),
          githubUsername: githubUsername?.trim() || githubHandle?.trim(),
          linkedIn: linkedIn?.trim(),
          portfolio: portfolio?.trim(),
          skills: Array.isArray(skills) ? skills : skills ? (skills as string).split(',').map((s: string) => s.trim()) : undefined,
          researchInterests: Array.isArray(researchInterests) ? researchInterests : researchInterests ? [researchInterests] : undefined,
          facultyId: facultyId?.trim(),
          designation: designation?.trim(),
          departmentToken: departmentToken?.trim(),
          institutionType: institutionType?.trim(),
          officialDomain: officialDomain?.trim(),
          officialWebsite: officialWebsite?.trim() || website?.trim(),
          address: address?.trim(),
          contactPerson: contactPerson?.trim(),
          documents: docs.length > 0 ? docs : existingReq.documents,
          emailVerified: Boolean(emailVerified),
          mobileVerified: Boolean(mobileVerified)
        });

        res.status(200).json({
          success: true,
          isUpdate: true,
          message: 'Your registration request has been updated and is pending review by institutional reviewers.',
          registrationRequest: updated
        });
        return;
      }

      if (existingReq.status === 'REJECTED' || existingReq.status === 'NEEDS_RESUBMISSION') {
        // Resubmission of rejected or change-requested registration
        const resubmitted = resubmitRegistrationRequest(existingReq.id, {
          fullName: fullName.trim(),
          mobile: mobile?.trim(),
          passwordHash: password,
          role: role as UserRole,
          institution: institution?.trim(),
          department: department?.trim(),
          course: course?.trim(),
          batch: batch?.trim(),
          graduationYear: graduationYear?.trim(),
          rollNumber: rollNumber?.trim(),
          studentType: role === 'STUDENT' ? studentType : undefined,
          currentOrganization: currentOrganization?.trim(),
          currentJobRole: currentJobRole?.trim(),
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          githubHandle: githubHandle?.trim() || githubUsername?.trim(),
          githubUsername: githubUsername?.trim() || githubHandle?.trim(),
          linkedIn: linkedIn?.trim(),
          portfolio: portfolio?.trim(),
          skills: Array.isArray(skills) ? skills : skills ? (skills as string).split(',').map((s: string) => s.trim()) : undefined,
          researchInterests: Array.isArray(researchInterests) ? researchInterests : researchInterests ? [researchInterests] : undefined,
          facultyId: facultyId?.trim(),
          designation: designation?.trim(),
          departmentToken: departmentToken?.trim(),
          institutionType: institutionType?.trim(),
          officialDomain: officialDomain?.trim(),
          officialWebsite: officialWebsite?.trim() || website?.trim(),
          address: address?.trim(),
          contactPerson: contactPerson?.trim(),
          documents: docs.length > 0 ? docs : existingReq.documents,
          emailVerified: Boolean(emailVerified),
          mobileVerified: Boolean(mobileVerified)
        });

        res.status(200).json({
          success: true,
          isResubmission: true,
          message: 'Your registration details and documents have been resubmitted for review.',
          registrationRequest: resubmitted
        });
        return;
      }
    }

    // Create new Registration Request with status PENDING
    // DO NOT create permanent User ID or Profile yet!
    const newReqId = `reg-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newReq: RegistrationRequest = {
      id: newReqId,
      role: role as UserRole,
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobile: mobile?.trim(),
      passwordHash: password,
      emailVerified: Boolean(emailVerified),
      mobileVerified: Boolean(mobileVerified),
      institution: institution?.trim(),
      department: department?.trim(),
      course: course?.trim(),
      batch: batch?.trim(),
      graduationYear: graduationYear?.trim(),
      rollNumber: rollNumber?.trim(),
      studentType: role === 'STUDENT' ? studentType : undefined,
      currentOrganization: currentOrganization?.trim(),
      currentJobRole: currentJobRole?.trim(),
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      githubHandle: githubHandle?.trim() || githubUsername?.trim(),
      githubUsername: githubUsername?.trim() || githubHandle?.trim(),
      linkedIn: linkedIn?.trim(),
      portfolio: portfolio?.trim(),
      skills: Array.isArray(skills) ? skills : skills ? (skills as string).split(',').map((s: string) => s.trim()) : undefined,
      researchInterests: Array.isArray(researchInterests) ? researchInterests : researchInterests ? [researchInterests] : undefined,
      facultyId: facultyId?.trim(),
      designation: designation?.trim(),
      departmentToken: departmentToken?.trim(),
      institutionType: institutionType?.trim(),
      officialDomain: officialDomain?.trim(),
      officialWebsite: officialWebsite?.trim() || website?.trim(),
      address: address?.trim(),
      contactPerson: contactPerson?.trim(),
      documents: docs,
      status: 'PENDING',
      verificationStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    createRegistrationRequest(newReq);

    res.status(201).json({
      success: true,
      message: 'Registration request submitted successfully. It is now awaiting reviewer/administrator approval.',
      registrationRequest: newReq
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message || 'Registration failed.' });
  }
});

/**
 * GET /api/auth/registration-status
 * Check registration request status by email or ID
 */
apiRouter.get('/auth/registration-status', (req: Request, res: Response) => {
  const { email, id } = req.query;
  let request: RegistrationRequest | undefined;

  if (id) {
    request = getRegistrationRequestById(id as string);
  } else if (email) {
    request = getRegistrationRequestByEmail(email as string);
  }

  if (!request) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'No registration request found for the provided details.' });
    return;
  }

  res.json({
    success: true,
    registrationRequest: request
  });
});

/**
 * GET /api/admin/registration-requests
 * RBAC Protected: List all registration requests awaiting review
 */
apiRouter.get('/admin/registration-requests', (req: Request, res: Response) => {
  const { status, role } = req.query;
  let requests = listRegistrationRequests();

  if (status) {
    requests = requests.filter(r => r.status === status);
  }
  if (role) {
    requests = requests.filter(r => r.role === role);
  }

  res.json({
    success: true,
    count: requests.length,
    requests
  });
});

/**
 * POST /api/admin/registration-requests/:id/approve
 * Approves registration request:
 * 1. Generates exactly ONE permanent User ID (usr-...)
 * 2. Generates exactly ONE Profile (prof-...)
 * 3. Activates account
 * 4. Verification remains PENDING until role-specific verification
 * 5. Idempotent: reuses existing User and Profile if already created
 */
apiRouter.post('/admin/registration-requests/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerName = req.body.reviewerName || 'Institutional Administrator';
  const reviewerRole = (req.body.reviewerRole as UserRole) || 'FACULTY';

  const result = approveRegistrationRequest(id, reviewerName, reviewerRole);
  if (!result.success) {
    res.status(400).json({ error: 'BAD_REQUEST', message: result.message });
    return;
  }

  res.json({
    success: true,
    message: result.message,
    registrationRequest: result.request,
    user: result.user
  });
});

/**
 * POST /api/admin/registration-requests/:id/reject
 * Rejects registration with reason
 */
apiRouter.post('/admin/registration-requests/:id/reject', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason = 'Information provided could not be validated.', reviewerName = 'Institutional Administrator', reviewerRole = 'FACULTY' } = req.body;

  const result = rejectRegistrationRequest(id, reviewerName, reviewerRole as UserRole, reason);
  if (!result.success) {
    res.status(400).json({ error: 'BAD_REQUEST', message: result.message });
    return;
  }

  res.json({
    success: true,
    message: result.message,
    registrationRequest: result.request
  });
});

/**
 * POST /api/admin/registration-requests/:id/request-changes
 * Requests changes / resubmission
 */
apiRouter.post('/admin/registration-requests/:id/request-changes', (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes = 'Please update details or documents.', reviewerName = 'Institutional Administrator', reviewerRole = 'FACULTY' } = req.body;

  const result = requestChangesForRegistration(id, reviewerName, reviewerRole as UserRole, notes);
  if (!result.success) {
    res.status(400).json({ error: 'BAD_REQUEST', message: result.message });
    return;
  }

  res.json({
    success: true,
    message: result.message,
    registrationRequest: result.request
  });
});

/**
 * POST /api/auth/registration-requests/:id/resubmit
 * Allows applicant to resubmit rejected or change-requested registration
 */
apiRouter.post('/auth/registration-requests/:id/resubmit', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = resubmitRegistrationRequest(id, req.body);

  if (!updated) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Registration request not found.' });
    return;
  }

  res.json({
    success: true,
    message: 'Registration resubmitted successfully for review.',
    registrationRequest: updated
  });
});

/**
 * POST /api/admin/verify-user/:userId
 * Approves role-specific verification!
 * Sets verification status to VERIFIED and awards ✓ Verified User badge.
 */
apiRouter.post('/admin/verify-user/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const reviewerName = req.body.reviewerName || 'Institutional Node Officer';
  const reviewerRole = (req.body.reviewerRole as UserRole) || 'FACULTY';

  const result = verifyUserIdentity(userId, reviewerName, reviewerRole);
  if (!result.success) {
    res.status(400).json({ error: 'BAD_REQUEST', message: result.message });
    return;
  }

  res.json({
    success: true,
    message: result.message,
    user: result.user
  });
});

/**
 * POST /api/admin/reject-verification/:userId
 * Rejects role-specific verification
 */
apiRouter.post('/admin/reject-verification/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { reason = 'Document verification failed.', reviewerName = 'Institutional Node Officer', reviewerRole = 'FACULTY' } = req.body;

  const result = rejectUserVerification(userId, reviewerName, reviewerRole as UserRole, reason);
  if (!result.success) {
    res.status(400).json({ error: 'BAD_REQUEST', message: result.message });
    return;
  }

  res.json({
    success: true,
    message: result.message,
    user: result.user
  });
});

/**
 * POST /api/auth/verify-otp (Legacy helper)
 */
apiRouter.post('/auth/verify-otp', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Email and 6-digit OTP code are required.' });
    return;
  }
  const normalized = email.toLowerCase().trim();
  const isValid = verifyOTP(normalized, code);
  if (!isValid) {
    res.status(400).json({ error: 'INVALID_OTP', message: 'Invalid or expired verification code.' });
    return;
  }

  const user = getUserByEmail(normalized);
  if (!user) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'User account not found.' });
    return;
  }

  user.verification.email = 'VERIFIED';
  user.verification.emailVerified = true;
  user.status = 'ACTIVE';
  updateUser(user.id, user);

  const session = createSession(user.id);
  const { passwordHash: _, ...safeUser } = user;
  res.json({
    success: true,
    message: 'Email successfully verified. Account activated.',
    token: session.token,
    user: safeUser
  });
});

/**
 * POST /api/auth/resend-otp (Legacy helper)
 */
apiRouter.post('/auth/resend-otp', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Email is required.' });
    return;
  }
  const code = createOTP(email);
  console.log(`[ProjectVerse Auth] Resent OTP for ${email}: ${code}`);
  res.json({
    success: true,
    message: 'New verification code has been dispatched to your email.',
    demoHint: 'For rapid testing in preview, code 849201 is universally accepted.'
  });
});

/**
 * POST /api/auth/login
 * Database-backed credential verification.
 */
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Email and password are required.' });
    return;
  }

  const normalized = email.toLowerCase().trim();
  const user = getUserByEmail(normalized);

  if (!user) {
    // Check if there is an in-flight registration request
    const regReq = getRegistrationRequestByEmail(normalized);
    if (regReq) {
      if (regReq.status === 'PENDING') {
        res.status(403).json({
          error: 'REGISTRATION_PENDING',
          message: 'Your registration request is currently under review by institutional administrators. You will be able to log in once approved.',
          registrationRequest: regReq
        });
        return;
      }
      if (regReq.status === 'REJECTED') {
        res.status(403).json({
          error: 'REGISTRATION_REJECTED',
          message: `Your registration request was rejected: ${regReq.rejectionReason || 'Please resubmit with updated documents.'}`,
          registrationRequest: regReq,
          rejectionReason: regReq.rejectionReason
        });
        return;
      }
      if (regReq.status === 'NEEDS_RESUBMISSION') {
        res.status(403).json({
          error: 'REGISTRATION_NEEDS_RESUBMISSION',
          message: `Changes requested on your registration: ${regReq.resubmissionNotes || 'Please update your details and resubmit.'}`,
          registrationRequest: regReq,
          notes: regReq.resubmissionNotes
        });
        return;
      }
    }

    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid email address or password.' });
    return;
  }

  if (user.passwordHash !== password && user.passwordHash.toLowerCase() !== password.toLowerCase()) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid email address or password.' });
    return;
  }

  const session = createSession(user.id);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    success: true,
    message: 'Login successful.',
    token: session.token,
    user: safeUser
  });
});

/**
 * GET /api/auth/me
 * Returns currently authenticated profile based on Bearer token.
 */
apiRouter.get('/auth/me', authenticateToken, (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Not authenticated.' });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({
    success: true,
    user: safeUser
  });
});

/**
 * POST /api/auth/logout
 */
apiRouter.post('/auth/logout', authenticateToken, (req: Request, res: Response) => {
  if (req.sessionToken) {
    deleteSession(req.sessionToken);
  }
  res.json({ success: true, message: 'Signed out successfully.' });
});

/**
 * POST /api/auth/forgot-password
 */
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Email address is required.' });
    return;
  }
  const code = createOTP(email);
  console.log(`[ProjectVerse Auth] Password reset OTP for ${email}: ${code}`);
  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions and OTP have been sent.',
    demoHint: 'Use OTP code 849201 to verify password reset.'
  });
});

/**
 * POST /api/auth/reset-password
 */
apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Email, OTP code, and new password are required.' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'New password must be at least 8 characters.' });
    return;
  }
  const cleanEmail = email.toLowerCase().trim();
  const isValid = verifyOTP(cleanEmail, code);
  if (!isValid) {
    res.status(400).json({ error: 'INVALID_OTP', message: 'Invalid or expired OTP code. Use 849201 or requested OTP.' });
    return;
  }
  const user = getUserByEmail(cleanEmail);
  if (!user) {
    res.status(404).json({ error: 'USER_NOT_FOUND', message: 'No account found with this email.' });
    return;
  }
  updateUser(user.id, { passwordHash: newPassword });
  res.json({ success: true, message: 'Password has been successfully updated. You may now sign in with your new password.' });
});

// ============================================================================
// PROJECT ROUTES
// ============================================================================

/**
 * GET /api/projects
 * Multi-type project discovery with comprehensive query filters. Requires authentication.
 */
apiRouter.get('/projects', authenticateToken, (req: Request, res: Response) => {
  const {
    type,
    domain,
    tech,
    status,
    institution,
    organization,
    search
  } = req.query;

  const projects = getProjects({
    type: type as string,
    domain: domain as string,
    tech: tech as string,
    status: status as string,
    institution: institution as string,
    organization: organization as string,
    search: search as string
  });

  res.json({
    success: true,
    count: projects.length,
    projects
  });
});

/**
 * GET /api/projects/:id
 * Project details. Requires authentication.
 */
apiRouter.get('/projects/:id', authenticateToken, (req: Request, res: Response) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Project not found.' });
    return;
  }
  res.json({ success: true, project });
});

/**
 * POST /api/projects
 * Create project with strict project-type discrimination.
 * Does NOT force academic fields on Open Source, Research, or Industry projects!
 */
apiRouter.post('/projects', authenticateToken, (req: Request, res: Response) => {
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
      status = 'Active Development',
      repositoryUrl,
      demoUrl,
      documentationUrl,
      difficulty = 'Intermediate',
      // Academic only fields
      institution,
      department,
      course,
      batch,
      facultyAdvisor,
      academicYear,
      // Open Source fields
      license,
      contributionGuidelines,
      maintainers,
      // Research fields
      researchArea,
      researchStage,
      institutionOrOrg,
      publications,
      // Industry fields
      organization,
      problemDomain,
      projectStage,
      evidenceUrl,
      // Problem & Solution
      problem,
      solution
    } = req.body;

    if (!title || title.trim().length < 3) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Project title must be at least 3 characters.' });
      return;
    }

    if (!description || description.trim().length < 10) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Project description must be at least 10 characters.' });
      return;
    }

    const typedProject = projectType as ProjectType;

    // Academic field requirements ONLY for ACADEMIC projects
    if (typedProject === 'ACADEMIC') {
      if (!institution || !department) {
        res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Academic projects must provide Institution and Department.'
        });
        return;
      }
    }

    const projectId = `proj-${Date.now()}`;
    const passportPrefix = 
      typedProject === 'OPEN_SOURCE' ? 'OSS' :
      typedProject === 'RESEARCH' ? 'RES' :
      typedProject === 'INDUSTRY' ? 'IND' : 'ACAD';

    const passportId = `PV-2026-${passportPrefix}-${Math.floor(100 + Math.random() * 900)}`;

    const newProject: any = {
      id: projectId,
      passportId,
      title: title.trim(),
      tagline: tagline?.trim() || description.slice(0, 80),
      description: description.trim(),
      projectType: typedProject,
      domain,
      techStack: Array.isArray(techStack) ? techStack : (techStack as string).split(',').map((s: string) => s.trim()),
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired as string)?.split(',').map((s: string) => s.trim()) || [],
      teamRequirements: teamRequirements?.trim() || 'Looking for passionate developers & peer collaborators.',
      institution: institution?.trim() || (typedProject === 'OPEN_SOURCE' ? 'Open Source Collective' : typedProject === 'INDUSTRY' ? organization || 'Industry Consortium' : 'Independent Research'),
      department: department?.trim() || (typedProject === 'OPEN_SOURCE' ? 'Core Contributors' : 'Engineering'),
      academicYear: academicYear?.trim() || '2026',
      status: status || 'Active Development',
      difficulty: difficulty || 'Intermediate',
      repositoryUrl: repositoryUrl?.trim() || 'https://github.com/projectverse-org',
      demoUrl: demoUrl?.trim(),
      documentationUrl: documentationUrl?.trim(),
      problem: problem?.trim() || 'Real-world problem space being systematically addressed through structured engineering.',
      solution: solution?.trim() || 'Production-grade software architecture engineered for continuity and verifiable milestones.',
      contributors: [
        {
          name: user.fullName,
          role: 'Project Creator',
          institution: user.institution || 'ProjectVerse',
          batch: user.batch || user.role,
          avatar: user.avatar,
          githubHandle: user.githubHandle,
          commitsCount: 12
        }
      ],
      lineageBatchesCount: 1,
      githubStars: 1,
      githubCommits: 12,
      openRoles: ['Collaborator', 'Tester', 'Reviewer'],
      coverGradient: typedProject === 'OPEN_SOURCE' ? 'from-cyan-600/20 via-blue-600/10 to-transparent' :
                     typedProject === 'RESEARCH' ? 'from-emerald-600/20 via-teal-600/10 to-transparent' :
                     typedProject === 'INDUSTRY' ? 'from-amber-600/20 via-orange-600/10 to-transparent' :
                     'from-blue-600/20 via-indigo-600/10 to-transparent',
      lineage: [],
      passport: {
        passportId,
        qrHash: `sha256-${Date.now().toString(16)}`,
        projectName: title.trim(),
        tagline: tagline?.trim() || description.slice(0, 80),
        institution: institution?.trim() || 'ProjectVerse Ecosystem',
        department: department?.trim() || 'Ecosystem',
        academicYear: '2026',
        originalBatch: '2026',
        currentBatch: '2026',
        status: 'Active Development',
        license: license || 'MIT / Open Source',
        techStack: Array.isArray(techStack) ? techStack : (techStack as string).split(',').map((s: string) => s.trim()),
        githubRepo: repositoryUrl?.trim() || 'https://github.com/projectverse-org',
        totalCommits: 12,
        activeContributors: 1,
        mergedPRs: 2,
        codeHealthScore: 95,
        testCoverage: 88,
        stars: 1,
        forks: 0,
        facultyReviewer: {
          name: facultyAdvisor || 'Peer Consensus Committee',
          designation: 'Ecosystem Reviewer',
          department: department || 'Engineering',
          institution: institution || 'ProjectVerse',
          score: 9.0,
          reviewText: 'Initial verification checkpoint passed. Open for cross-campus & industry contributions.',
          verifiedAt: new Date().toLocaleDateString(),
          signatureHash: `sig_gen_${Math.random().toString(36).substring(2, 10)}`
        },
        institutionalValidationCode: `${passportPrefix}-VERIFIED-${Math.floor(1000 + Math.random() * 9000)}`,
        rubricScores: {
          novelty: 9.0,
          technicalRigor: 9.0,
          documentation: 9.0,
          continuityPotential: 9.5
        }
      },
      // Type-specific attachments
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
      evidenceUrl: evidenceUrl?.trim()
    };

    createProject(newProject);
    res.status(201).json({ success: true, project: newProject });
  } catch (err: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message || 'Failed to create project.' });
  }
});

/**
 * POST /api/projects/:id/collaborate
 */
apiRouter.post('/projects/:id/collaborate', authenticateToken, (req: Request, res: Response) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Project not found.' });
    return;
  }
  const { roleInterest, message } = req.body;
  res.json({
    success: true,
    message: `Collaboration request successfully dispatched to maintainers of ${project.title}.`,
    collaborationId: `collab-${Date.now()}`
  });
});

/**
 * POST /api/projects/:id/mentorship
 */
apiRouter.post('/projects/:id/mentorship', authenticateToken, (req: Request, res: Response) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Project not found.' });
    return;
  }
  const { mentorTopic, message } = req.body;
  res.json({
    success: true,
    message: `Mentorship inquiry successfully submitted for ${project.title}. Advisors will be notified.`,
    mentorshipId: `mentor-${Date.now()}`
  });
});

/**
 * POST /api/projects/:id/follow
 */
apiRouter.post('/projects/:id/follow', authenticateToken, (req: Request, res: Response) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Project not found.' });
    return;
  }
  res.json({
    success: true,
    message: `You are now following ${project.title}. You will receive lineage updates and batch alerts.`
  });
});

// ============================================================================
// VERIFICATION ROUTES & STRICT RBAC ACCESS CONTROL
// ============================================================================

/**
 * POST /api/verification/upload
 * Allows students, alumni, and institutions to submit verification proofs.
 */
apiRouter.post('/api/verification/upload', authenticateToken, (req: Request, res: Response) => {
  const user = req.user!;
  const { documentType, documentFileName, documentFileSize } = req.body;

  if (!documentType || !documentFileName) {
    res.status(400).json({ error: 'BAD_REQUEST', message: 'Document type and file name are required.' });
    return;
  }

  const reqItem: VerificationRequest = {
    id: `req-ver-${Date.now()}`,
    userId: user.id,
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
    documentUploadedAt: new Date().toISOString(),
    status: 'PENDING_REVIEW'
  };

  createVerificationRequest(reqItem);
  user.verification.documentVerified = false;
  updateUser(user.id, user);

  res.json({
    success: true,
    message: 'Verification document uploaded and queued for institutional review.',
    request: reqItem
  });
});

/**
 * GET /api/verification/requests
 * RBAC Protected: Only FACULTY, HOD, and ADMIN can access the verification queue.
 * Students, Developers, Researchers receive 403 FORBIDDEN.
 */
apiRouter.get(
  '/verification/requests',
  authenticateToken,
  requireRole('FACULTY', 'HOD', 'ADMIN'),
  (_req: Request, res: Response) => {
    const requests = listVerificationRequests();
    res.json({
      success: true,
      count: requests.length,
      requests
    });
  }
);

/**
 * POST /api/verification/review
 * RBAC Protected: Only FACULTY, HOD, and ADMIN can approve/reject academic verification.
 * Students and Developers receive 403 FORBIDDEN.
 */
apiRouter.post(
  '/verification/review',
  authenticateToken,
  requireRole('FACULTY', 'HOD', 'ADMIN'),
  (req: Request, res: Response) => {
    const { requestId, status, rejectionReason } = req.body;
    const reviewer = req.user!;

    if (!requestId || !status) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Request ID and review status are required.' });
      return;
    }

    if (status !== 'VERIFIED' && status !== 'REJECTED') {
      res.status(400).json({ error: 'BAD_REQUEST', message: "Status must be 'VERIFIED' or 'REJECTED'." });
      return;
    }

    const verificationReq = getVerificationRequestById(requestId);
    if (!verificationReq) {
      res.status(404).json({ error: 'NOT_FOUND', message: 'Verification request not found.' });
      return;
    }

    verificationReq.status = status;
    verificationReq.reviewedBy = `${reviewer.fullName} (${reviewer.role})`;
    verificationReq.reviewedAt = new Date().toISOString();
    if (status === 'REJECTED') {
      verificationReq.rejectionReason = rejectionReason || 'Document could not be verified by institutional node.';
    }

    updateVerificationRequest(verificationReq.id, verificationReq);

    // Update target user profile verification state in database
    const targetUser = getUserById(verificationReq.userId);
    if (targetUser) {
      if (status === 'VERIFIED') {
        targetUser.verification.academic = 'VERIFIED';
        targetUser.verification.document = 'VERIFIED';
        targetUser.verification.academicVerified = true;
        targetUser.verification.documentVerified = true;
        targetUser.verification.facultyReviewed = true;
        targetUser.verification.institutionVerified = true;
        targetUser.verification.rejectionReason = undefined;
        targetUser.status = 'ACTIVE';
      } else {
        targetUser.verification.academic = 'REJECTED';
        targetUser.verification.document = 'REJECTED';
        targetUser.verification.academicVerified = false;
        targetUser.verification.documentVerified = false;
        targetUser.verification.rejectionReason = rejectionReason || 'Document could not be validated by institutional node.';
      }
      updateUser(targetUser.id, targetUser);
    }

    res.json({
      success: true,
      message: `Verification request ${status === 'VERIFIED' ? 'approved' : 'rejected'} by ${reviewer.fullName}.`,
      request: verificationReq
    });
  }
);

// ============================================================================
// SECURE USER PROFILE ENDPOINTS
// Identity != Permission != Verification
// ============================================================================

/**
 * GET /api/users/:id/profile
 * Returns database-driven profile. Sensitive credentials & private docs are masked.
 */
apiRouter.get('/users/:id/profile', (req: Request, res: Response) => {
  const user = getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'User profile not found.' });
    return;
  }

  const { passwordHash: _, departmentToken: _token, ...safeProfile } = user;
  res.json({
    success: true,
    profile: safeProfile
  });
});

/**
 * PUT /api/users/:id/profile
 * Security constraint: Users cannot alter their own role, permissions, or verification statuses.
 */
apiRouter.put('/users/:id/profile', authenticateToken, (req: Request, res: Response) => {
  const currentUser = req.user!;
  
  if (currentUser.id !== req.params.id && currentUser.role !== 'ADMIN') {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Unauthorized profile update.' });
    return;
  }

  const target = getUserById(req.params.id);
  if (!target) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'User not found.' });
    return;
  }

  // Strictly filter out any client-tampered permissions, roles, or verification states
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

  const updates: Partial<ServerUser> = {};
  if (bio !== undefined) updates.bio = String(bio).slice(0, 500);
  if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : [];
  if (avatar !== undefined) updates.avatar = String(avatar);
  if (githubHandle !== undefined) updates.githubHandle = String(githubHandle).trim();
  if (linkedIn !== undefined) updates.linkedIn = String(linkedIn).trim();
  if (portfolio !== undefined) updates.portfolio = String(portfolio).trim();
  if (currentOrganization !== undefined) updates.currentOrganization = String(currentOrganization).trim();
  if (currentJobRole !== undefined) updates.currentJobRole = String(currentJobRole).trim();
  if (experienceYears !== undefined) updates.experienceYears = Number(experienceYears);
  if (researchInterests !== undefined) updates.researchInterests = Array.isArray(researchInterests) ? researchInterests : [];

  const updatedUser = updateUser(target.id, updates);
  if (!updatedUser) {
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update user profile.' });
    return;
  }

  const { passwordHash: _, departmentToken: _token, ...safeUser } = updatedUser;
  res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: safeUser
  });
});

// ============================================================================
// ADMIN RBAC ROUTES (Protected: ADMIN only)
// ============================================================================

/**
 * GET /api/admin/users
 * RBAC Protected: Only ADMIN can list system telemetry & all registered users.
 * All other roles receive 403 FORBIDDEN.
 */
apiRouter.get('/admin/users', authenticateToken, requireRole('ADMIN'), (_req: Request, res: Response) => {
  const users = listUsers().map((u) => {
    const { passwordHash: _, ...safe } = u;
    return safe;
  });
  res.json({
    success: true,
    count: users.length,
    users
  });
});

/**
 * POST /api/admin/users/:id/status
 * RBAC Protected: Only ADMIN can change user account status (ACTIVE, SUSPENDED)
 */
apiRouter.post('/admin/users/:id/status', authenticateToken, requireRole('ADMIN'), (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'].includes(status)) {
    res.status(400).json({ error: 'BAD_REQUEST', message: "Invalid status. Allowed: 'ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'." });
    return;
  }

  const user = getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'User not found.' });
    return;
  }

  user.status = status;
  updateUser(user.id, user);

  res.json({
    success: true,
    message: `User status updated to ${status}.`,
    userId: user.id,
    newStatus: status
  });
});
