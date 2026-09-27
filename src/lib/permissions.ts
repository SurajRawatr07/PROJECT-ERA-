import { UserRole } from '../types';

/**
 * Centralized Permission Engine for ProjectVerse
 * Strictly implements Role -> Identity -> Profile -> Dashboard -> Permissions -> Actions
 */

export interface RolePermissionConfig {
  role: UserRole;
  displayName: string;
  description: string;
  category: 'CREATOR' | 'MENTOR_REVIEWER' | 'ACADEMIC_AUTHORITY' | 'INSTITUTIONAL' | 'GOVERNANCE';
  
  // Submission Permissions
  canSubmitNormalProject: boolean;
  canSubmitFacultyProject: boolean;
  canSubmitProject: boolean; // Computed: normal or faculty-led
  submitActionLabel: string;
  
  // Review & Verification
  canReviewProjects: boolean;
  canVerifyDepartment: boolean;
  canSignVerificationSeal: boolean;
  
  // Management & Authority
  canManageDepartment: boolean;
  canManageInstitution: boolean;
  canManageArchive: boolean;
  canAccessDepartmentAnalytics: boolean;
  canAccessInstitutionAnalytics: boolean;
  
  // Social & Ecosystem
  canExploreProjects: boolean;
  canRequestMentorship: boolean;
  canProvideMentorship: boolean;
  canCollaborate: boolean;
  canAccessProofOfWork: boolean;
  
  // Primary Dashboard Actions
  primaryActions: Array<{
    id: string;
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'outline';
  }>;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissionConfig> = {
  STUDENT: {
    role: 'STUDENT',
    displayName: 'Student Builder',
    description: 'Build projects, collaborate, find mentors, and generate proof of work.',
    category: 'CREATOR',
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    submitActionLabel: 'Submit Project',
    canReviewProjects: false,
    canVerifyDepartment: false,
    canSignVerificationSeal: false,
    canManageDepartment: false,
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: true,
    canProvideMentorship: false,
    canCollaborate: true,
    canAccessProofOfWork: true,
    primaryActions: [
      { id: 'submit-proj', label: 'Submit Project', action: 'submit_project', variant: 'primary' },
      { id: 'explore-proj', label: 'Explore Projects', action: 'explore_projects', variant: 'secondary' },
      { id: 'join-proj', label: 'Join Project', action: 'collaboration', variant: 'outline' },
      { id: 'find-mentor', label: 'Find Mentor', action: 'mentorship', variant: 'outline' }
    ]
  },

  ALUMNI: {
    role: 'ALUMNI',
    displayName: 'Alumni Contributor',
    description: 'Continue projects, mentor junior cohorts, and contribute industry expertise.',
    category: 'CREATOR',
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    submitActionLabel: 'Submit / Continue Project',
    canReviewProjects: true,
    canVerifyDepartment: false,
    canSignVerificationSeal: false,
    canManageDepartment: false,
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessProofOfWork: true,
    primaryActions: [
      { id: 'submit-proj', label: 'Submit Project', action: 'submit_project', variant: 'primary' },
      { id: 'continue-proj', label: 'Continue Project', action: 'continue_project', variant: 'secondary' },
      { id: 'mentorship', label: 'Mentorship', action: 'mentorship', variant: 'outline' },
      { id: 'collaborate', label: 'Collaborate', action: 'collaboration', variant: 'outline' }
    ]
  },

  DEVELOPER: {
    role: 'DEVELOPER',
    displayName: 'Software Architect & Developer',
    description: 'Build open-source systems, showcase technical repositories, and collaborate.',
    category: 'CREATOR',
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    submitActionLabel: 'Submit Project',
    canReviewProjects: true,
    canVerifyDepartment: false,
    canSignVerificationSeal: false,
    canManageDepartment: false,
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: true,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessProofOfWork: true,
    primaryActions: [
      { id: 'submit-proj', label: 'Submit Project', action: 'submit_project', variant: 'primary' },
      { id: 'explore-proj', label: 'Explore Projects', action: 'explore_projects', variant: 'secondary' },
      { id: 'collaborate', label: 'Collaborate', action: 'collaboration', variant: 'outline' },
      { id: 'contributions', label: 'Contributions', action: 'contributions', variant: 'outline' }
    ]
  },

  RESEARCHER: {
    role: 'RESEARCHER',
    displayName: 'Domain Researcher',
    description: 'Share research papers, benchmark architectures, and collaborate across institutions.',
    category: 'CREATOR',
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    submitActionLabel: 'Submit Research Project',
    canReviewProjects: true,
    canVerifyDepartment: false,
    canSignVerificationSeal: false,
    canManageDepartment: false,
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessProofOfWork: true,
    primaryActions: [
      { id: 'submit-research', label: 'Submit Research Project', action: 'submit_project', variant: 'primary' },
      { id: 'research-proj', label: 'Research Projects', action: 'my_projects', variant: 'secondary' },
      { id: 'collaborate', label: 'Collaborate', action: 'collaboration', variant: 'outline' },
      { id: 'mentorship', label: 'Mentorship', action: 'mentorship', variant: 'outline' }
    ]
  },

  INDUSTRY_PROFESSIONAL: {
    role: 'INDUSTRY_PROFESSIONAL',
    displayName: 'Industry Professional & Tech Lead',
    description: 'Sponsor industrial challenges, provide expert code reviews, and mentor talent.',
    category: 'CREATOR',
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    submitActionLabel: 'Submit Industry Project',
    canReviewProjects: true,
    canVerifyDepartment: false,
    canSignVerificationSeal: false,
    canManageDepartment: false,
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessProofOfWork: true,
    primaryActions: [
      { id: 'industry-proj', label: 'Industry Project', action: 'submit_project', variant: 'primary' },
      { id: 'industry-challenges', label: 'Industry Challenges', action: 'challenges', variant: 'secondary' },
      { id: 'expert-reviews', label: 'Expert Reviews', action: 'reviews', variant: 'outline' },
      { id: 'mentorship', label: 'Mentorship', action: 'mentorship', variant: 'outline' }
    ]
  },

  FACULTY: {
    role: 'FACULTY',
    displayName: 'Faculty Reviewer & Mentor',
    description: 'Mentor students, review capstone rubrics, and certify academic project passports.',
    category: 'MENTOR_REVIEWER',
    canSubmitNormalProject: false,
    canSubmitFacultyProject: true, // Only faculty-led academic research
    canSubmitProject: true, // Contextual
    submitActionLabel: 'Submit Faculty-Led Project',
    canReviewProjects: true,
    canVerifyDepartment: true,
    canSignVerificationSeal: true,
    canManageDepartment: false,
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessProofOfWork: true,
    primaryActions: [
      { id: 'pending-reviews', label: 'Pending Reviews', action: 'reviews', variant: 'primary' },
      { id: 'students', label: 'Students', action: 'students', variant: 'secondary' },
      { id: 'mentorship', label: 'Mentorship', action: 'mentorship', variant: 'outline' },
      { id: 'verification', label: 'Verification', action: 'verification', variant: 'outline' }
    ]
  },

  HOD: {
    role: 'HOD',
    displayName: 'Head of Department (HOD)',
    description: 'Read-only departmental intelligence, student and faculty directory access, and project oversight.',
    category: 'ACADEMIC_AUTHORITY',
    canSubmitNormalProject: false, // STRICTLY FALSE
    canSubmitFacultyProject: false,
    canSubmitProject: false, // STRICTLY FALSE: NO Submit Project button
    submitActionLabel: '',
    canReviewProjects: false, // Read-only Department Intelligence: NO reviewing
    canVerifyDepartment: false, // Read-only: NO verification
    canSignVerificationSeal: false,
    canManageDepartment: false, // Read-only: NO editing data
    canManageInstitution: false,
    canManageArchive: false,
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: false,
    canCollaborate: false,
    canAccessProofOfWork: false,
    primaryActions: [
      { id: 'dashboard', label: 'Dashboard', action: 'dashboard', variant: 'primary' },
      { id: 'students', label: 'Students', action: 'students', variant: 'secondary' },
      { id: 'faculty', label: 'Faculty', action: 'faculty', variant: 'outline' },
      { id: 'dept-projects', label: 'Department Projects', action: 'department-projects', variant: 'outline' },
      { id: 'analytics', label: 'Analytics', action: 'analytics', variant: 'outline' }
    ]
  },

  INSTITUTION: {
    role: 'INSTITUTION',
    displayName: 'Institution & University Node',
    description: 'Read-only institutional intelligence, cross-department analytics, and campus directory.',
    category: 'INSTITUTIONAL',
    canSubmitNormalProject: false, // STRICTLY FALSE
    canSubmitFacultyProject: false,
    canSubmitProject: false, // STRICTLY FALSE: NO Submit Project button
    submitActionLabel: '',
    canReviewProjects: false, // Read-only Institution Intelligence: NO reviewing
    canVerifyDepartment: false, // Read-only: NO verification
    canSignVerificationSeal: false,
    canManageDepartment: false,
    canManageInstitution: false, // Read-only: NO editing data
    canManageArchive: false,
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: true,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: false,
    canCollaborate: false,
    canAccessProofOfWork: false,
    primaryActions: [
      { id: 'dashboard', label: 'Dashboard', action: 'dashboard', variant: 'primary' },
      { id: 'students', label: 'Students', action: 'students', variant: 'secondary' },
      { id: 'faculty', label: 'Faculty', action: 'faculty', variant: 'outline' },
      { id: 'hods', label: 'HODs', action: 'hods', variant: 'outline' },
      { id: 'departments', label: 'Departments', action: 'departments', variant: 'outline' },
      { id: 'inst-projects', label: 'Institution Projects', action: 'institution-projects', variant: 'outline' },
      { id: 'analytics', label: 'Analytics', action: 'analytics', variant: 'outline' }
    ]
  },

  ADMIN: {
    role: 'ADMIN',
    displayName: 'Platform Administrator',
    description: 'System-controlled platform governance, node verification, moderation, and audit logs.',
    category: 'GOVERNANCE',
    canSubmitNormalProject: false,
    canSubmitFacultyProject: false,
    canSubmitProject: false,
    submitActionLabel: '',
    canReviewProjects: true,
    canVerifyDepartment: true,
    canSignVerificationSeal: true,
    canManageDepartment: true,
    canManageInstitution: true,
    canManageArchive: true,
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: true,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: false,
    canCollaborate: false,
    canAccessProofOfWork: false,
    primaryActions: [
      { id: 'users', label: 'Manage Users', action: 'users', variant: 'primary' },
      { id: 'projects', label: 'All Projects', action: 'projects', variant: 'secondary' },
      { id: 'verifications', label: 'Verification Queue', action: 'verification-queue', variant: 'outline' },
      { id: 'system', label: 'System Logs', action: 'system', variant: 'outline' }
    ]
  }
};

/**
 * Check if a role has permission to submit normal projects
 */
export function canRoleSubmitProject(role?: UserRole): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.canSubmitProject ?? false;
}

/**
 * Check if role is an organizational authority that should NOT create individual student projects
 */
export function isOrganizationalAuthorityRole(role?: UserRole): boolean {
  return role === 'INSTITUTION' || role === 'HOD' || role === 'ADMIN';
}

/**
 * Get the contextual button label for project creation
 */
export function getSubmitProjectButtonLabel(role?: UserRole): string {
  if (!role) return 'Submit Project';
  return ROLE_PERMISSIONS[role]?.submitActionLabel || 'Submit Project';
}
