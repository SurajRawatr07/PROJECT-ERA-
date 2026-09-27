export type ProjectType = 'ACADEMIC' | 'OPEN_SOURCE' | 'RESEARCH' | 'INDUSTRY';

export type ProjectStatus = 'DRAFT' | 'SUBMITTED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type ProjectVerificationStatus =
  | 'COMMUNITY'
  | 'EVIDENCE_VERIFIED'
  | 'EXPERT_REVIEWED'
  | 'ACADEMIC_VERIFIED'
  | 'INSTITUTION_VERIFIED';

export interface ProjectContributor {
  id?: string;
  name: string;
  role: string;
  institution?: string;
  avatar?: string;
  githubHandle?: string;
  commitsCount?: number;
}

export interface ProjectReview {
  id?: string;
  reviewerName: string;
  reviewerRole: string;
  comments: string;
  score?: number;
  date: string;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;

  ownerId: string;
  ownerName?: string;
  contributors: string[] | ProjectContributor[];

  type: ProjectType;

  domain?: string;
  technologies: string[];

  status: ProjectStatus;

  verificationStatus: ProjectVerificationStatus;

  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;

  // Academic / Institutional Context
  institution?: string;
  department?: string;
  academicYear?: string;
  mentor?: string;
  passportId?: string;

  // Metrics
  githubStars?: number;
  githubCommits?: number;

  createdAt: string;
  updatedAt: string;

  // Extended Profile Attributes
  reviews?: ProjectReview[];
  lineage?: any[];
  contributions?: any[];
  coverGradient?: string;
}
