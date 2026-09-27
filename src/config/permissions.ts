import { UserRole } from '../types';

export interface RolePermissions {
  canSubmitNormalProject: boolean;
  canSubmitFacultyProject: boolean;
  canSubmitProject: boolean;
  canReviewProjects: boolean;
  canVerifyDepartment: boolean;
  canVerifyInstitutional: boolean;
  canManageInstitution: boolean;
  canManageDepartment: boolean;
  canExploreProjects: boolean;
  canRequestMentorship: boolean;
  canProvideMentorship: boolean;
  canCollaborate: boolean;
  canAccessDepartmentAnalytics: boolean;
  canAccessInstitutionAnalytics: boolean;
  canManageProjectArchive: boolean;
  canViewProofOfWork: boolean;
  canSponsorChallenges: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  STUDENT: {
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    canReviewProjects: false,
    canVerifyDepartment: false,
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false,
    canExploreProjects: true,
    canRequestMentorship: true,
    canProvideMentorship: false,
    canCollaborate: true,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: true,
    canSponsorChallenges: false,
  },
  ALUMNI: {
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    canReviewProjects: false,
    canVerifyDepartment: false,
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: true,
    canSponsorChallenges: false,
  },
  DEVELOPER: {
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    canReviewProjects: false,
    canVerifyDepartment: false,
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false,
    canExploreProjects: true,
    canRequestMentorship: true,
    canProvideMentorship: false,
    canCollaborate: true,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: true,
    canSponsorChallenges: false,
  },
  RESEARCHER: {
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true,
    canReviewProjects: true,
    canVerifyDepartment: false,
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false,
    canExploreProjects: true,
    canRequestMentorship: true,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: true,
    canSponsorChallenges: false,
  },
  FACULTY: {
    canSubmitNormalProject: false,
    canSubmitFacultyProject: true,
    canSubmitProject: true, // Only faculty-led academic/research projects
    canReviewProjects: true,
    canVerifyDepartment: true,
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: true,
    canSponsorChallenges: false,
  },
  HOD: {
    canSubmitNormalProject: false,
    canSubmitFacultyProject: false,
    canSubmitProject: false, // Read-only Department Intelligence: NO submit
    canReviewProjects: false, // Read-only: NO reviewing
    canVerifyDepartment: false, // Read-only: NO verification/sign-off
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false, // Read-only: NO editing department data
    canExploreProjects: true, // Only own department
    canRequestMentorship: false,
    canProvideMentorship: false, // HOD is Department Intelligence, not direct mentor
    canCollaborate: false, // Cannot join projects
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: false,
    canSponsorChallenges: false,
  },
  INSTITUTION: {
    canSubmitNormalProject: false,
    canSubmitFacultyProject: false,
    canSubmitProject: false, // Read-only Institution Intelligence: NO submit
    canReviewProjects: false, // Read-only: NO reviewing
    canVerifyDepartment: false, // Read-only: NO verification
    canVerifyInstitutional: false,
    canManageInstitution: false, // Read-only: NO editing data
    canManageDepartment: false,
    canExploreProjects: true, // Within institution
    canRequestMentorship: false,
    canProvideMentorship: false,
    canCollaborate: false,
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: true,
    canManageProjectArchive: false,
    canViewProofOfWork: false,
    canSponsorChallenges: false,
  },
  INDUSTRY_PROFESSIONAL: {
    canSubmitNormalProject: true,
    canSubmitFacultyProject: false,
    canSubmitProject: true, // Industry projects & challenges
    canReviewProjects: true,
    canVerifyDepartment: false,
    canVerifyInstitutional: false,
    canManageInstitution: false,
    canManageDepartment: false,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: true,
    canCollaborate: true,
    canAccessDepartmentAnalytics: false,
    canAccessInstitutionAnalytics: false,
    canManageProjectArchive: false,
    canViewProofOfWork: true,
    canSponsorChallenges: true,
  },
  ADMIN: {
    canSubmitNormalProject: false,
    canSubmitFacultyProject: false,
    canSubmitProject: false,
    canReviewProjects: true,
    canVerifyDepartment: true,
    canVerifyInstitutional: true,
    canManageInstitution: true,
    canManageDepartment: true,
    canExploreProjects: true,
    canRequestMentorship: false,
    canProvideMentorship: false,
    canCollaborate: false,
    canAccessDepartmentAnalytics: true,
    canAccessInstitutionAnalytics: true,
    canManageProjectArchive: true,
    canViewProofOfWork: true,
    canSponsorChallenges: false,
  },
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  const roleConfig = ROLE_PERMISSIONS[role];
  if (!roleConfig) return false;
  return !!roleConfig[permission];
}

/**
 * Check if a role can submit normal or specialized projects
 */
export function canSubmitProject(role: UserRole): boolean {
  return hasPermission(role, 'canSubmitProject');
}

/**
 * Get role primary dashboard actions
 */
export interface RoleAction {
  id: string;
  label: string;
  primary?: boolean;
  onClickAction: string;
}

export function getRolePrimaryActions(role: UserRole): RoleAction[] {
  switch (role) {
    case 'STUDENT':
      return [
        { id: 'submit-project', label: 'Submit Project', primary: true, onClickAction: 'SUBMIT_PROJECT' },
        { id: 'explore-projects', label: 'Explore Projects', primary: false, onClickAction: 'EXPLORE' },
        { id: 'join-project', label: 'Join Project', primary: false, onClickAction: 'EXPLORE' },
        { id: 'find-mentor', label: 'Find Mentor', primary: false, onClickAction: 'AI_MATCHES' },
      ];
    case 'ALUMNI':
      return [
        { id: 'submit-project', label: 'Submit Project', primary: true, onClickAction: 'SUBMIT_PROJECT' },
        { id: 'continue-project', label: 'Continue Project', primary: false, onClickAction: 'SUBMIT_PROJECT' },
        { id: 'mentorship', label: 'Mentorship', primary: false, onClickAction: 'MENTORSHIP' },
        { id: 'collaborate', label: 'Collaborate', primary: false, onClickAction: 'COLLABORATE' },
      ];
    case 'DEVELOPER':
      return [
        { id: 'submit-project', label: 'Submit Project', primary: true, onClickAction: 'SUBMIT_PROJECT' },
        { id: 'explore-projects', label: 'Explore Projects', primary: false, onClickAction: 'EXPLORE' },
        { id: 'collaborate', label: 'Collaborate', primary: false, onClickAction: 'COLLABORATE' },
        { id: 'contributions', label: 'Contributions', primary: false, onClickAction: 'MY_PROJECTS' },
      ];
    case 'RESEARCHER':
      return [
        { id: 'submit-research', label: 'Submit Research Project', primary: true, onClickAction: 'SUBMIT_PROJECT' },
        { id: 'research-projects', label: 'Research Projects', primary: false, onClickAction: 'MY_PROJECTS' },
        { id: 'collaborate', label: 'Collaborate', primary: false, onClickAction: 'COLLABORATE' },
        { id: 'mentorship', label: 'Mentorship', primary: false, onClickAction: 'MENTORSHIP' },
      ];
    case 'FACULTY':
      return [
        { id: 'pending-reviews', label: 'Pending Reviews', primary: true, onClickAction: 'REVIEWS' },
        { id: 'students', label: 'Students', primary: false, onClickAction: 'STUDENTS' },
        { id: 'mentorship', label: 'Mentorship', primary: false, onClickAction: 'MENTORSHIP' },
        { id: 'verification', label: 'Verification', primary: false, onClickAction: 'VERIFICATION' },
      ];
    case 'HOD':
      return [
        { id: 'dashboard', label: 'Dashboard', primary: true, onClickAction: 'DASHBOARD' },
        { id: 'department-projects', label: 'Department Projects', primary: false, onClickAction: 'DEPARTMENT_PROJECTS' },
        { id: 'students', label: 'Students', primary: false, onClickAction: 'STUDENTS' },
        { id: 'faculty', label: 'Faculty', primary: false, onClickAction: 'FACULTY' },
        { id: 'analytics', label: 'Analytics', primary: false, onClickAction: 'ANALYTICS' },
      ];
    case 'INSTITUTION':
      return [
        { id: 'dashboard', label: 'Dashboard', primary: true, onClickAction: 'DASHBOARD' },
        { id: 'institution-projects', label: 'Institution Projects', primary: false, onClickAction: 'PROJECTS' },
        { id: 'departments', label: 'Departments', primary: false, onClickAction: 'DEPARTMENTS' },
        { id: 'students', label: 'Students', primary: false, onClickAction: 'STUDENTS' },
        { id: 'faculty', label: 'Faculty', primary: false, onClickAction: 'FACULTY' },
        { id: 'hods', label: 'HODs', primary: false, onClickAction: 'HODS' },
        { id: 'analytics', label: 'Analytics', primary: false, onClickAction: 'ANALYTICS' },
      ];
    case 'INDUSTRY_PROFESSIONAL':
      return [
        { id: 'industry-project', label: 'Industry Project', primary: true, onClickAction: 'SUBMIT_PROJECT' },
        { id: 'industry-challenges', label: 'Industry Challenges', primary: false, onClickAction: 'CHALLENGES' },
        { id: 'expert-reviews', label: 'Expert Reviews', primary: false, onClickAction: 'REVIEWS' },
        { id: 'mentorship', label: 'Mentorship', primary: false, onClickAction: 'MENTORSHIP' },
        { id: 'collaborate', label: 'Collaborate', primary: false, onClickAction: 'COLLABORATE' },
      ];
    case 'ADMIN':
      return [
        { id: 'users', label: 'Manage Users', primary: true, onClickAction: 'USERS' },
        { id: 'projects', label: 'Project Moderation', primary: false, onClickAction: 'PROJECTS' },
        { id: 'verification', label: 'Verification Queue', primary: false, onClickAction: 'VERIFICATION' },
        { id: 'system', label: 'System Health', primary: false, onClickAction: 'SYSTEM' },
      ];
  }
}
