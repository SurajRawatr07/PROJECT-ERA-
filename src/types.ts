export type UserIdentity = 
  | 'STUDENT'
  | 'ALUMNI'
  | 'DEVELOPER'
  | 'RESEARCHER'
  | 'INDUSTRY_PROFESSIONAL'
  | 'FACULTY'
  | 'HOD'
  | 'INSTITUTION';

export type UserRole = UserIdentity | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';

export type StudentType = 'CURRENT_STUDENT' | 'ALUMNI';

export type DocumentVerificationStatus = 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';

export type DocumentType = 
  | 'Student ID Card' 
  | 'Enrollment Letter' 
  | 'Admission / Enrollment Proof' 
  | 'Degree Certificate / Marksheet' 
  | 'Official Academic Document'
  | 'Institutional Accreditation Document'
  | 'Faculty Employment ID'
  | 'Identity Proof'
  | 'Identity Proof Document'
  | (string & {});

export interface GranularVerificationStates {
  emailVerified: boolean;
  institutionVerified?: boolean;
  academicVerified?: boolean;
  documentVerified?: boolean;
  facultyReviewed?: boolean;
  contributionVerified?: boolean;
}

export type VerificationEmailStatus = 'VERIFIED' | 'UNVERIFIED';
export type VerificationMobileStatus = 'VERIFIED' | 'UNVERIFIED';
export type VerificationInstitutionStatus = 'VERIFIED' | 'UNVERIFIED';
export type VerificationAcademicStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_APPLICABLE';
export type VerificationDocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED';
export type VerificationContributionStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface VerificationStatuses {
  accountStatus?: AccountStatus;
  email: VerificationEmailStatus;
  mobile: VerificationMobileStatus;
  institution: VerificationInstitutionStatus;
  academic: VerificationAcademicStatus;
  document: VerificationDocumentStatus;
  contribution: VerificationContributionStatus;
  rejectionReason?: string;
  githubConnected?: boolean;
  linkedInAdded?: boolean;
  portfolioAdded?: boolean;
}

export interface VerificationSignals extends GranularVerificationStates {
  institutionalDomain: boolean;
  idProofVerified: boolean;
  nodeApproval: boolean;
  rollVerified?: boolean;
  statusVerified?: boolean;
}

export type AccountVerificationStatus = 'Verified' | 'Under Review' | 'Active' | 'Pending Review' | 'Verification Pending' | 'Under Verification' | 'Verification Rejected' | 'Rejected';

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_RESUBMISSION';

export interface RegistrationDocument {
  id: string;
  documentType: DocumentType | string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  url?: string;
}

export interface RegistrationRequest {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  mobile?: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  passwordHash?: string;
  institution?: string;
  department?: string;
  course?: string;
  batch?: string;
  graduationYear?: string;
  rollNumber?: string;
  studentType?: StudentType;
  currentOrganization?: string;
  currentJobRole?: string;
  experienceYears?: number;
  githubHandle?: string;
  githubUsername?: string;
  linkedIn?: string;
  portfolio?: string;
  skills?: string[];
  researchInterests?: string[];
  publicationsCount?: number;
  googleScholarUrl?: string;
  facultyId?: string;
  designation?: string;
  researchAreas?: string[];
  departmentToken?: string;
  institutionType?: string;
  officialDomain?: string;
  officialWebsite?: string;
  address?: string;
  contactPerson?: string;
  documents: RegistrationDocument[];
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewerRole?: UserRole;
  reviewedAt?: string;
  rejectionReason?: string;
  resubmissionNotes?: string;
  userId?: string;
  profileId?: string;
  accountActivated?: boolean;
  verificationStatus: 'NOT_STARTED' | 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'NEEDS_RESUBMISSION';
  verifiedAt?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  studentType?: StudentType;
  institution: string;
  department: string;
  course?: string;
  batch?: string;
  graduationYear?: string;
  rollNumber?: string;
  documentType: DocumentType;
  documentFileName: string;
  documentFileSize: string;
  documentUploadedAt: string;
  documentId?: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type ProjectType = 'ACADEMIC' | 'OPEN_SOURCE' | 'RESEARCH' | 'INDUSTRY' | 'PERSONAL' | 'HACKATHON';

export type ProjectReviewStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER REVIEW' | 'REVIEWED' | 'VERIFIED' | 'REJECTED';

export type ProjectDomain = 
  | 'All'
  | 'Artificial Intelligence & ML'
  | 'Healthcare & Biotech'
  | 'Healthcare & Biotechnology'
  | 'Distributed Systems & Cloud'
  | 'Autonomous Systems & Robotics'
  | 'Clean Energy & IoT'
  | 'Energy & Clean Tech'
  | 'Cybersecurity & Cryptography'
  | 'Cybersecurity & Infrastructure'
  | 'Web & Mobile Apps'
  | 'Web3 & Distributed Ledgers'
  | 'Developer Tools'
  | (string & {});

export type VerificationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER REVIEW'
  | 'REVIEWED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'Verified' 
  | 'Under Review' 
  | 'Seeking Next Batch' 
  | 'Active Development';

export interface Contributor {
  name: string;
  role: string;
  institution: string;
  batch: string;
  avatar: string;
  githubHandle?: string;
  commitsCount?: number;
}

export interface FacultyReviewer {
  name: string;
  designation?: string;
  title?: string;
  department: string;
  institution: string;
  score: number; // e.g. 9.4/10
  reviewText: string;
  verifiedAt: string;
  signatureHash: string;
}

export interface LineageBatch {
  year: string;
  batchName: string;
  institution: string;
  leadContributors: string[];
  keyMilestones?: string[];
  commits: number;
  pullRequests: number;
  activeStatus: 'Current' | 'Completed' | 'Upcoming Roadmap' | 'Seeking Next Batch' | 'Continuity Ready';
  summary: string;
  version?: string;
  majorChanges?: string[];
  technologies?: string[];
  mentorName?: string;
  facultyReviewScore?: number;
  evidenceSummary?: string;
}

export interface ProjectDNA {
  domain: string;
  technologies: string[];
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  projectStage: 'Ideation' | 'Prototype' | 'MVP' | 'Production' | 'Seeking Maintainers' | 'Archived';
  requiredRoles: string[];
  goals: string[];
  teamRequirements: string;
  preferredSkills: string[];
}

export interface ProjectHealthScore {
  overallScore: number; // 0-100
  status: 'Active' | 'At Risk' | 'Needs Attention' | 'Healthy' | 'Archived';
  repositoryActivityScore: number;
  recentCommitsCount: number;
  activeContributorsCount: number;
  documentationScore: number;
  openTasksCount: number;
  deploymentStatus: 'Live' | 'Degraded' | 'Offline' | 'Not Deployed';
  reviewStatus: 'Verified' | 'Pending Review' | 'Changes Requested' | 'Under Evaluation';
  completenessScore: number;
  lastActivityDays: number;
  positiveSignals: string[];
  warningSignals: string[];
}

export type EvidenceConfidenceLevel = 'Strong' | 'Moderate' | 'Limited' | 'No evidence available';

export interface ContributorEvidence {
  contributorName: string;
  role: string;
  avatar?: string;
  githubHandle?: string;
  institution?: string;
  batch?: string;
  evidenceLevel: EvidenceConfidenceLevel;
  commitsCount: number;
  pullRequestsMerged: number;
  issuesClosed: number;
  filesChanged: number;
  linesAdded?: number;
  linesDeleted?: number;
  timelineRange: string;
  assignedTasksCount: number;
  completedTasksCount: number;
  facultyReviewCount: number;
  latestCommitDate: string;
  disclaimer: string; // Strictly: Contribution Evidence != Faculty Verification
}

export interface HandoverBug {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

export interface HandoverTask {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  assignee?: string;
  completed?: boolean;
}

export interface TechnicalDecision {
  decision: string;
  rationale: string;
  date: string;
}

export interface ProjectHandoverPackage {
  id: string;
  projectId: string;
  projectTitle: string;
  outgoingBatch: string;
  outgoingLeads: string[];
  targetIncomingBatch: string;
  status: 'Draft' | 'Active Handover' | 'Accepted' | 'Archived';
  createdAt: string;
  updatedAt: string;
  whatHasBeenBuilt: string;
  currentProjectStatus: string;
  architectureOverview: string;
  architectureDiagramUrl?: string;
  setupInstructions: string[];
  knownBugs: HandoverBug[];
  pendingTasks: HandoverTask[];
  technicalDecisions: TechnicalDecision[];
  documentationLinks: Array<{ label: string; url: string; type: string }>;
  futureRoadmap: Array<{ phase: string; description: string; targetQuarter: string }>;
  requiredSkills: string[];
  recommendedImprovements: string[];
  thingsNextTeamShouldKnow: string[]; // Gotchas & insider hints
}

export interface ProjectContinuityData {
  isAtRisk: boolean;
  daysInactive: number;
  riskLevel: 'Healthy' | 'Moderate Risk' | 'Critical Risk';
  riskReasons: string[];
  openTasksCount: number;
  activeContributorCount: number;
  currentMentor?: string;
  suggestedActions: Array<'Continue Project' | 'Find Contributors' | 'Find Mentor' | 'Open Tasks' | 'Open for Next Batch' | 'Archive'>;
  handoverStatus: 'Not Started' | 'In Progress' | 'Completed & Ready';
  hasHandoverPackage: boolean;
}

export interface ProjectReviewActionItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
}

export interface ProofOfWorkTimelineEvent {
  id: string;
  type: 'CREATED_PROJECT' | 'CONTRIBUTED' | 'COMPLETED_TASK' | 'FACULTY_REVIEWED' | 'MENTORED' | 'CONTINUED_PROJECT';
  title: string;
  projectTitle: string;
  projectId: string;
  timestamp: string;
  details: string;
  verified: boolean;
  hash?: string;
}

export interface SmartMatchFactor {
  criteria: string;
  weight: number;
  matched: boolean;
  scoreContribution: number;
  details: string;
}

export interface SmartMatchResult {
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar?: string;
  targetProjectId: string;
  targetProjectTitle: string;
  overallMatchPercentage: number;
  breakdown: SmartMatchFactor[];
  explanation: string;
}

export interface ProjectPassportData {
  passportId: string;
  qrHash: string;
  projectName: string;
  tagline: string;
  institution: string;
  department: string;
  academicYear: string;
  originalBatch: string;
  currentBatch: string;
  status: VerificationStatus;
  license: string;
  techStack: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  currentStage?: 'Ideation' | 'Prototype' | 'MVP' | 'Production' | 'Seeking Maintainers';
  createdDate?: string;
  lastActivityDate?: string;
  
  // Technical Evidence
  githubRepo: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  totalCommits: number;
  activeContributors: number;
  mergedPRs: number;
  codeHealthScore: number; // e.g. 98%
  testCoverage: number; // e.g. 94%
  stars: number;
  forks: number;

  // Academic Evidence
  facultyReviewer: FacultyReviewer;
  mentorName?: string;
  institutionalValidationCode: string;
  rubricScores: {
    novelty: number; // out of 10
    technicalRigor: number; // out of 10
    documentation: number; // out of 10
    continuityPotential: number; // out of 10
  };

  // Upgraded Ecosystem Engines
  health?: ProjectHealthScore;
  dna?: ProjectDNA;
  continuity?: ProjectContinuityData;
  handover?: ProjectHandoverPackage;
  evidences?: ContributorEvidence[];
}

export interface ProjectItem {
  id: string;
  passportId: string;
  title: string;
  tagline: string;
  description: string;
  projectType?: ProjectType;
  problem?: string;
  solution?: string;
  domain: ProjectDomain;
  techStack: string[];
  skillsRequired?: string[];
  teamRequirements?: string;
  institution: string;
  department: string;
  institution_id?: string;
  department_id?: string;
  institutionId?: string;
  departmentId?: string;
  academicYear: string;
  status: VerificationStatus;
  contributors: Contributor[];
  lineageBatchesCount: number;
  githubStars: number;
  githubCommits: number;
  openRoles: string[];
  lineage: LineageBatch[];
  passport: ProjectPassportData;
  coverGradient: string;
  featured?: boolean;
  
  // Links & Artifacts
  projectUrl?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  screenshots?: string[];
  supportingDocuments?: Array<{ name: string; url?: string; type?: string; size?: string }>;
  teamInformation?: string;
  creator?: { name: string; role: string; avatar?: string; githubHandle?: string };
  reviewStatus?: ProjectReviewStatus;
  reviewsList?: Array<{ reviewerName: string; reviewerRole: string; comments: string; date: string; verified: boolean; rubricScore?: number }>;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';

  // Type-specific fields
  // Academic:
  course?: string;
  batch?: string;
  facultyAdvisor?: string;

  // Open Source:
  license?: string;
  contributionGuidelines?: string;
  maintainers?: string[];

  // Research:
  researchArea?: string;
  researchStage?: string;
  institutionOrOrg?: string;
  publications?: string[];

  // Industry:
  organization?: string;
  problemDomain?: string;
  projectStage?: string;
  evidenceUrl?: string;

  // UI & display convenience helpers
  verificationStatus?: VerificationStatus;
  stars?: number;
  commits?: number;
  facultyGuide?: string;
  lastUpdated?: string;

  // Ecosystem Engines & State
  dna?: ProjectDNA;
  health?: ProjectHealthScore;
  handover?: ProjectHandoverPackage;
  continuity?: ProjectContinuityData;
  evidences?: ContributorEvidence[];
  createdDate?: string;
  lastActivityDate?: string;
  currentStage?: 'Ideation' | 'Prototype' | 'MVP' | 'Production' | 'Seeking Maintainers';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  studentType?: StudentType;
  institution?: string;
  department?: string;
  institution_id?: string;
  department_id?: string;
  institutionId?: string;
  departmentId?: string;
  course?: string;
  batch?: string;
  rollNumber?: string;
  graduationYear?: string;
  phoneNumber?: string;
  mobile?: string;
  currentOrganization?: string;
  currentJobRole?: string;
  experienceYears?: number;
  linkedIn?: string;
  portfolio?: string;
  githubUsername?: string;
  githubHandle?: string;
  githubConnected?: boolean;
  linkedInAdded?: boolean;
  portfolioAdded?: boolean;
  primaryTechStack?: string[];
  publicationsCount?: number;
  googleScholarUrl?: string;
  facultyId?: string;
  designation?: string;
  researchAreas?: string[];
  researchInterests?: string[];
  departmentToken?: string;
  institutionType?: string;
  officialDomain?: string;
  website?: string;
  address?: string;
  contactPerson?: string;
  avatar: string;
  verifiedStatus: AccountVerificationStatus;
  verificationStatuses?: VerificationStatuses;
  documentStatus?: DocumentVerificationStatus;
  documentName?: string;
  documentType?: DocumentType;
  documentSize?: string;
  documentSubmittedAt?: string;
  documentId?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  verificationSignals?: VerificationSignals;
  projectsCount: number;
  commitsCount?: number;
  rubricScore?: number;
  bio: string;
  skills?: string[];
  githubVerified?: boolean;
  linkedinUrl?: string;
  portfolioUrl?: string;
  verifiedProjectsCount?: number;
  contributionsCount?: number;
}

export interface AIMatchCandidate {
  id: string;
  title: string;
  domain: string;
  institution: string;
  matchScore: number;
  reasons: string[];
  requiredSkills: string[];
  openRole: string;
}

export interface MentorRecommendation {
  name: string;
  title: string;
  institution: string;
  domains: string[];
  verifiedProjectsCount: number;
  matchScore: number;
  avatar: string;
}

export interface PeerCandidate {
  name: string;
  institution: string;
  batch: string;
  skills: string[];
  matchScore: number;
  role: string;
  avatar: string;
}

export type ProjectLifecycleStatus = 
  | 'DRAFT' 
  | 'IN_PROGRESS' 
  | 'UNDER_REVIEW' 
  | 'CHANGES_REQUIRED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'COMPLETED';

export type AppNotificationType = 
  | 'FACULTY_FEEDBACK' 
  | 'PROJECT_APPROVED' 
  | 'PROJECT_REJECTED' 
  | 'REVIEW_UPDATED' 
  | 'COLLABORATION_REQUEST' 
  | 'PROJECT_STATUS_UPDATE' 
  | 'TEAM_UPDATE' 
  | 'REPOSITORY_UPDATE'
  | 'SYSTEM'
  | 'PROPOSAL';

export interface ProjectFeedback {
  id: string;
  projectId: string;
  studentId: string;
  facultyId: string;
  message: string;
  createdAt: string;
  read: boolean;
  // Optional metadata for display
  feedbackId?: string;
  projectTitle?: string;
  facultyName?: string;
  facultyDesignation?: string;
  facultyAvatar?: string;
}

export interface StudentNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  projectId?: string;
  relatedId?: string;
  createdAt: string;
  read: boolean;
  userId?: string;
  projectTitle?: string;
  feedbackId?: string;
  feedbackMessage?: string;
  facultyName?: string;
  senderName?: string;
  senderAvatar?: string;
  actionUrl?: string;
}

export type AppNotification = StudentNotification;

export type CollaborationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CollaborationRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentInstitution?: string;
  roleInterest: string;
  message: string;
  status: CollaborationStatus;
  createdAt: string;
  reviewedAt?: string;
  targetOwnerId?: string;
}

export interface ProjectActivityItem {
  id: string;
  projectId: string;
  type: 'CREATED' | 'TEAM_ADDED' | 'REPO_CONNECTED' | 'FACULTY_REVIEW' | 'FEEDBACK_RECEIVED' | 'PROJECT_UPDATED' | 'STATUS_CHANGED';
  title: string;
  description: string;
  actorName?: string;
  actorRole?: string;
  actorAvatar?: string;
  createdAt: string;
  statusIndicator: 'completed' | 'in_progress' | 'pending' | 'verified';
}
