import {
  AuthResult,
  AuthServiceContract,
  AuthUser,
  RegisterData
} from '../types/auth';
import { sessionService } from './sessionService';
import { isValidEmail, normalizeEmail } from '../utils/validation';
import { validatePassword } from '../utils/password';
import { storageAdapter } from './storageAdapter';

function mapApiUserToAuthUser(apiUser: any): AuthUser {
  return {
    id: apiUser.id || apiUser._id,
    name: apiUser.fullName || apiUser.name || 'User',
    email: apiUser.email,
    role: apiUser.role,
    avatar: apiUser.avatar,
    profile: {
      institution: apiUser.institution,
      department: apiUser.department,
      designation: apiUser.designation,
      course: apiUser.course,
      program: apiUser.course,
      batch: apiUser.batch,
      academicYear: apiUser.academicYear || apiUser.batch,
      rollNumber: apiUser.rollNumber,
      accountType: apiUser.studentType,
      employeeId: apiUser.facultyId,
      skills: apiUser.skills || [],
      bio: apiUser.bio || '',
      github: apiUser.githubHandle ? `https://github.com/${apiUser.githubHandle}` : undefined,
      githubHandle: apiUser.githubHandle,
      linkedin: apiUser.linkedIn,
      portfolio: apiUser.portfolio,
      verifiedStatus: apiUser.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending Verification',
      projectsCount: apiUser.projectsCount || 0,
      commitsCount: apiUser.commitsCount || 0,
      rubricScore: 9.0
    },
    createdAt: apiUser.createdAt || new Date().toISOString(),
    updatedAt: apiUser.updatedAt || new Date().toISOString()
  };
}

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

      // 2. Prevent public ADMIN registration
      if ((data.role as string) === 'ADMIN') {
        return {
          success: false,
          error: 'Administrator accounts cannot be registered publicly.'
        };
      }

      // 3. Password validation
      const passResult = validatePassword(data.password);
      if (!passResult.isValid) {
        return {
          success: false,
          error: passResult.error || 'Password does not meet the security requirements.'
        };
      }

      // Prepare API payload
      const payload: any = {
        fullName: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
        role: data.role,
        bio: data.bio || '',
        avatar: data.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
      };

      if (data.role === 'STUDENT' && data.studentProfile) {
        payload.institution = data.studentProfile.institution;
        payload.course = data.studentProfile.course || data.studentProfile.program;
        payload.rollNumber = data.studentProfile.rollNumber;
        payload.batch = (data.studentProfile as any).batch || data.studentProfile.academicYear;
        payload.skills = data.studentProfile.skills;
        payload.githubHandle = data.studentProfile.github;
        payload.linkedIn = data.studentProfile.linkedin;
      } else if (data.role === 'FACULTY' && data.facultyProfile) {
        payload.institution = data.facultyProfile.institution;
        payload.department = data.facultyProfile.department;
        payload.designation = data.facultyProfile.designation;
        payload.facultyId = data.facultyProfile.employeeId;
        payload.skills = data.facultyProfile.skills;
        payload.githubHandle = data.facultyProfile.github;
        payload.linkedIn = data.facultyProfile.linkedin;
      } else if (data.role === 'RESEARCHER' && data.researcherProfile) {
        payload.institution = data.researcherProfile.institution;
        payload.designation = data.researcherProfile.designation;
        payload.researchInterests = [data.researcherProfile.researchDomain];
        payload.skills = data.researcherProfile.skills;
      } else if (data.role === 'ALUMNI' && data.alumniProfile) {
        payload.institution = data.alumniProfile.previousInstitution;
        payload.course = data.alumniProfile.degreeCourse;
        payload.graduationYear = data.alumniProfile.graduationYear;
        payload.currentOrganization = data.alumniProfile.currentOrganization;
        payload.currentJobRole = data.alumniProfile.currentJobRole;
        payload.skills = data.alumniProfile.skills;
      } else if (data.role === 'DEVELOPER' && data.developerProfile) {
        payload.currentJobRole = data.developerProfile.specialization;
        payload.skills = data.developerProfile.skills;
        payload.githubHandle = data.developerProfile.github;
        payload.portfolio = data.developerProfile.portfolio;
      } else if (data.role === 'HOD' && data.hodProfile) {
        payload.institution = data.hodProfile.institution;
        payload.department = data.hodProfile.department;
        payload.designation = data.hodProfile.designation;
        payload.facultyId = data.hodProfile.employeeId;
      } else if (data.role === 'INDUSTRY_PROFESSIONAL' && data.industryProfile) {
        payload.currentOrganization = data.industryProfile.company;
        payload.currentJobRole = data.industryProfile.jobTitle;
        payload.skills = data.industryProfile.skills;
        payload.linkedIn = data.industryProfile.linkedin;
      } else if (data.role === 'INSTITUTION' && data.institutionProfile) {
        payload.institution = data.institutionProfile.institutionName;
        payload.institutionType = data.institutionProfile.institutionType;
        payload.contactPerson = data.institutionProfile.representativeName;
        payload.designation = data.institutionProfile.representativeDesignation;
        payload.officialDomain = data.institutionProfile.officialEmail;
        payload.website = data.institutionProfile.website;
      }

      if (data.documents && data.documents.length > 0) {
        payload.documentType = data.documents[0].documentType;
        payload.documentFileName = data.documents[0].fileName;
        payload.documentFileSize = data.documents[0].fileSize;
      }

      // Call REST API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return {
          success: false,
          error: resData.message || resData.error || 'Failed to complete registration.'
        };
      }

      const authUser = mapApiUserToAuthUser(resData.user);

      // Establish active session with complete profile fields
      const sessionUser = {
        id: authUser.id,
        role: authUser.role,
        fullName: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        ...authUser.profile
      };

      const session = sessionService.setSession(
        authUser.id,
        authUser.role,
        resData.token,
        sessionUser
      );

      // Sync legacy storage
      try {
        localStorage.setItem('pv_auth_token', resData.token);
        const dbUsers = storageAdapter.getItem<any[]>('pv_user_database_v4', []);
        dbUsers.push(sessionUser);
        storageAdapter.setItem('pv_user_database_v4', dbUsers);
      } catch {
        // ignore
      }

      return {
        success: true,
        user: authUser,
        role: authUser.role,
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

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: passwordInput })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return {
          success: false,
          error: resData.message || resData.error || 'Authentication failed. Please verify your credentials.'
        };
      }

      const authUser = mapApiUserToAuthUser(resData.user);

      // Create session with complete profile fields
      const sessionUser = {
        id: authUser.id,
        role: authUser.role,
        fullName: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        ...authUser.profile
      };

      const session = sessionService.setSession(
        authUser.id,
        authUser.role,
        resData.token,
        sessionUser
      );

      try {
        localStorage.setItem('pv_auth_token', resData.token);
      } catch {
        // ignore
      }

      return {
        success: true,
        user: authUser,
        role: authUser.role,
        token: session.token,
        message: `Welcome back, ${authUser.name}!`
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Authentication failed.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    sessionService.clearSession();
    try {
      localStorage.removeItem('pv_auth_session');
      localStorage.removeItem('pv_active_session_role');
      localStorage.removeItem('pv_auth_token');
    } catch {
      // ignore
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const session = sessionService.getSession();
    if (!session || !session.token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });

      if (!res.ok) {
        sessionService.clearSession();
        return null;
      }

      const resData = await res.json();
      if (resData.success && resData.user) {
        return mapApiUserToAuthUser(resData.user);
      }

      return null;
    } catch (err) {
      console.warn('[authService] Error fetching current user:', err);
      // Fallback to local session user if offline
      if (session.user) {
        return {
          id: session.userId,
          name: session.user.fullName || 'User',
          email: session.user.email || '',
          role: session.role,
          avatar: session.user.avatar || '',
          profile: session.user,
          createdAt: new Date().toISOString()
        };
      }
      return null;
    }
  }
}

export const authService = new FrontendAuthService();
