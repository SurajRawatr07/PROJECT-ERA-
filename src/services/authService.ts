import {
  AuthResult,
  AuthServiceContract,
  AuthUser,
  RegisterData
} from '../types/auth';
import { userService } from './userService';
import { sessionService } from './sessionService';
import { isValidEmail, normalizeEmail } from '../utils/validation';
import { validatePassword } from '../utils/password';

export class FrontendAuthService implements AuthServiceContract {
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      // 1. Basic field presence
      if (!data.name || data.name.trim().length < 2) {
        return { success: false, error: 'Please enter your full name (at least 2 characters).' };
      }

      const normalizedEmail = normalizeEmail(data.email);
      if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      // 2. Prevent duplicate email (case-insensitive)
      if (userService.emailExists(normalizedEmail)) {
        return {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.'
        };
      }

      // 3. Prevent public ADMIN registration
      if ((data.role as string) === 'ADMIN') {
        return {
          success: false,
          error: 'Administrator accounts cannot be registered publicly. System admin accounts are provisioned directly by the platform authority.'
        };
      }

      // 4. Password validation
      const passResult = validatePassword(data.password);
      if (!passResult.isValid) {
        return {
          success: false,
          error: passResult.error || 'Password does not meet the security requirements.'
        };
      }

      // 5. Role-specific validation
      if (data.role === 'STUDENT') {
        const p = data.studentProfile;
        if (!p?.institution || p.institution.trim().length < 2) {
          return { success: false, error: 'Please specify your institution or university.' };
        }
        if (!p?.course && !p?.program) {
          return { success: false, error: 'Please specify your course or academic degree.' };
        }
        if (!p?.rollNumber || p.rollNumber.trim().length < 2) {
          return { success: false, error: 'Please provide your roll number or student ID.' };
        }
      } else if (data.role === 'FACULTY') {
        const p = data.facultyProfile;
        if (!p?.institution || p.institution.trim().length < 2) {
          return { success: false, error: 'Please specify your institution or university.' };
        }
        if (!p?.department || p.department.trim().length < 2) {
          return { success: false, error: 'Please specify your department.' };
        }
        if (!p?.designation || p.designation.trim().length < 2) {
          return { success: false, error: 'Please specify your academic designation.' };
        }
        if (!p?.employeeId || p.employeeId.trim().length < 2) {
          return { success: false, error: 'Please provide your Faculty / Employee ID.' };
        }
      } else if (data.role === 'RESEARCHER') {
        const p = data.researcherProfile;
        if (!p?.institution || p.institution.trim().length < 2) {
          return { success: false, error: 'Please specify your institution or research organization.' };
        }
        if (!p?.researchDomain || p.researchDomain.trim().length < 2) {
          return { success: false, error: 'Please specify your research domain or field.' };
        }
      } else if (data.role === 'ALUMNI') {
        const p = data.alumniProfile;
        if (!p?.previousInstitution || p.previousInstitution.trim().length < 2) {
          return { success: false, error: 'Please specify your graduating college or university.' };
        }
        if (!p?.degreeCourse || p.degreeCourse.trim().length < 2) {
          return { success: false, error: 'Please specify your completed degree.' };
        }
      } else if (data.role === 'DEVELOPER') {
        const p = data.developerProfile;
        if (!p?.specialization || p.specialization.trim().length < 2) {
          return { success: false, error: 'Please specify your specialization or current role.' };
        }
        if (!p?.github || p.github.trim().length < 3) {
          return { success: false, error: 'Please provide your GitHub profile URL.' };
        }
      } else if (data.role === 'HOD') {
        const p = data.hodProfile;
        if (!p?.institution || p.institution.trim().length < 2) {
          return { success: false, error: 'Please specify your institution or university.' };
        }
        if (!p?.department || p.department.trim().length < 2) {
          return { success: false, error: 'Please specify your department.' };
        }
        if (!p?.employeeId || p.employeeId.trim().length < 2) {
          return { success: false, error: 'Please provide your HOD Employee ID.' };
        }
      } else if (data.role === 'INSTITUTION') {
        const p = data.institutionProfile;
        if (!p?.institutionName || p.institutionName.trim().length < 2) {
          return { success: false, error: 'Please specify your institution or university name.' };
        }
        if (!p?.website || p.website.trim().length < 4) {
          return { success: false, error: 'Please provide your official institution website.' };
        }
        if (!p?.representativeName || p.representativeName.trim().length < 2) {
          return { success: false, error: 'Please provide the authorized representative name.' };
        }
      } else if (data.role === 'INDUSTRY_PROFESSIONAL') {
        const p = data.industryProfile;
        if (!p?.company || p.company.trim().length < 2) {
          return { success: false, error: 'Please specify your company or organization.' };
        }
        if (!p?.jobTitle || p.jobTitle.trim().length < 2) {
          return { success: false, error: 'Please specify your job title.' };
        }
        if (!p?.linkedin || p.linkedin.trim().length < 4) {
          return { success: false, error: 'Please provide your LinkedIn profile URL.' };
        }
      }

      // 6. Create account locally
      const createdUser = userService.createUserFromRegistration(data);

      const userProfilePayload = {
        id: createdUser.id,
        email: createdUser.email,
        fullName: createdUser.name,
        role: createdUser.role,
        avatar: createdUser.avatar,
        institution: createdUser.profile.institution,
        department: createdUser.profile.department,
        course: createdUser.profile.course,
        batch: createdUser.profile.batch,
        rollNumber: createdUser.profile.rollNumber,
        designation: createdUser.profile.designation,
        facultyId: createdUser.profile.employeeId,
        skills: createdUser.profile.skills || [],
        bio: createdUser.profile.bio || '',
        githubHandle: createdUser.profile.githubHandle,
        verifiedStatus: 'Verified',
        verificationSignals: {
          emailVerified: true,
          institutionalDomain: true,
          idProofVerified: true,
          nodeApproval: true
        },
        projectsCount: 0,
        commitsCount: 0,
        rubricScore: 9.0
      };

      // 7. Establish active session automatically
      const session = sessionService.setSession(
        createdUser.id,
        createdUser.role,
        undefined,
        userProfilePayload
      );

      return {
        success: true,
        user: createdUser,
        role: createdUser.role,
        token: session.token,
        message: 'Account registered successfully!'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to complete registration.'
      };
    }
  }

  async login(emailInput: string, passwordInput: string): Promise<AuthResult> {
    try {
      const normalizedEmail = normalizeEmail(emailInput);
      if (!normalizedEmail) {
        return { success: false, error: 'Please enter your email address.' };
      }

      if (!passwordInput) {
        return { success: false, error: 'Please enter your password.' };
      }

      // Find user strictly by email
      const user = userService.getByEmail(normalizedEmail);
      if (!user) {
        return {
          success: false,
          error: 'No account found with this email address. Please check your credentials or create an account.'
        };
      }

      // Verify password
      const storedPassword = user.password || '';
      const isPasswordMatch =
        storedPassword === passwordInput ||
        storedPassword.toLowerCase() === passwordInput.toLowerCase();

      if (!isPasswordMatch) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const userProfilePayload = {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.role,
        avatar: user.avatar,
        institution: user.profile.institution,
        department: user.profile.department,
        course: user.profile.course,
        batch: user.profile.batch,
        rollNumber: user.profile.rollNumber,
        designation: user.profile.designation,
        facultyId: user.profile.employeeId,
        skills: user.profile.skills || [],
        bio: user.profile.bio || '',
        githubHandle: user.profile.githubHandle,
        verifiedStatus: 'Verified',
        verificationSignals: {
          emailVerified: true,
          institutionalDomain: true,
          idProofVerified: true,
          nodeApproval: true
        },
        projectsCount: user.profile.projectsCount || 0,
        commitsCount: user.profile.commitsCount || 0,
        rubricScore: user.profile.rubricScore || 9.0
      };

      // Create session
      const session = sessionService.setSession(
        user.id,
        user.role,
        undefined,
        userProfilePayload
      );

      return {
        success: true,
        user,
        role: user.role,
        token: session.token,
        message: `Welcome back, ${user.name}!`
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Authentication failed.'
      };
    }
  }

  async logout(): Promise<void> {
    sessionService.clearSession();
    try {
      // Clear legacy storage keys if any
      localStorage.removeItem('pv_auth_session');
      localStorage.removeItem('pv_active_session_role');
    } catch {
      // ignore
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const session = sessionService.getSession();
    if (!session) return null;

    const user = userService.getById(session.userId);
    if (!user) {
      sessionService.clearSession();
      return null;
    }

    return user;
  }
}

export const authService = new FrontendAuthService();
