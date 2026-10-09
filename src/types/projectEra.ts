export type EraAccountType = 'STUDENT' | 'FACULTY' | 'HOD' | 'ALUMNI';

export type EraProjectStatus =
  | 'Idea'
  | 'Planning'
  | 'Development'
  | 'Review'
  | 'Completed';

export type EraTaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface EraTask {
  id: string;
  title: string;
  assigneeName: string;
  responsibility: string;
  dueDate: string; // YYYY-MM-DD
  status: EraTaskStatus;
  milestoneTitle: string;
}

export interface EraMilestone {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  status: 'On Track' | 'Delayed' | 'Completed';
}

export interface EraTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  responsibility: string;
  status: 'Active' | 'Pending Request' | 'Invited';
}

export interface EraDocumentRecord {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  category: 'Proposal' | 'Architecture & Design' | 'Milestone Report' | 'Final Submission';
  uploadedBy: string;
  uploadedAt: string;
}

export type EraReviewStatus =
  | 'Pending Review'
  | 'Revisions Requested'
  | 'Approved'
  | 'Completed';

export interface EraFacultyReview {
  id: string;
  projectId: string;
  projectTitle: string;
  reviewerName: string;
  reviewerRole: 'Faculty' | 'HOD';
  status: EraReviewStatus;
  feedback: string;
  submittedAt: string;
}

export interface EraMentoringRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  studentName: string;
  department: string;
  alumniName: string;
  topic: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Completed';
  requestedAt: string;
}

export interface EraProject {
  id: string;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  status: EraProjectStatus;
  academicSession: string;
  institution: string;
  department: string;
  supervisorName: string;
  supervisorEmail: string;
  leadStudentName: string;
  teamMembers: EraTeamMember[];
  tasks: EraTask[];
  milestones: EraMilestone[];
  documents: EraDocumentRecord[];
  reviews: EraFacultyReview[];
  updatedAt: string;
}

export interface EraUserProfile {
  id: string;
  fullName: string;
  email: string;
  accountType: EraAccountType;
  institution: string;
  department: string;
  // Student fields
  course?: string;
  batch?: string;
  rollNumber?: string;
  // Faculty & HOD fields
  designation?: string;
  areasOfExpertise?: string[];
  // Alumni fields
  graduationYear?: string;
  currentOrganization?: string;
  currentJobRole?: string;
  skills?: string[];
  linkedInOrPortfolio?: string;
  bio?: string;
}

export type EraRoute =
  | 'home'
  | 'features'
  | 'how-it-works'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'projects'
  | 'project-details'
  | 'profile'
  | 'settings';
