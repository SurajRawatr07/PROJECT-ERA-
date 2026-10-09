import mongoose, { Schema, Document } from 'mongoose';
import { ProjectType, VerificationStatus, ProjectReviewStatus } from '../../src/types';

export interface IProjectContributor {
  user?: mongoose.Types.ObjectId;
  name: string;
  role: string;
  institution: string;
  batch: string;
  avatar: string;
  githubHandle?: string;
  commitsCount?: number;
}

export interface IProjectPassport {
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
  githubRepo: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  totalCommits: number;
  activeContributors: number;
  mergedPRs: number;
  codeHealthScore: number;
  testCoverage: number;
  stars: number;
  forks: number;
  facultyReviewer?: {
    name: string;
    designation?: string;
    department: string;
    institution: string;
    score: number;
    reviewText: string;
    verifiedAt: string;
    signatureHash: string;
  };
  institutionalValidationCode: string;
  rubricScores: {
    novelty: number;
    technicalRigor: number;
    documentation: number;
    continuityPotential: number;
  };
}

export interface IProject extends Document {
  id: string;
  passportId: string;
  title: string;
  tagline: string;
  description: string;
  projectType: ProjectType;
  domain: string;
  techStack: string[];
  skillsRequired: string[];
  teamRequirements: string;
  institution: string;
  department: string;
  academicYear: string;
  status: VerificationStatus;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problem: string;
  solution: string;
  owner: mongoose.Types.ObjectId;
  contributors: IProjectContributor[];
  repositoryUrl: string;
  demoUrl?: string;
  documentationUrl?: string;
  screenshots: string[];
  mentor?: mongoose.Types.ObjectId;
  facultyAdvisor?: string;
  facultyReviewer?: {
    name: string;
    designation?: string;
    department: string;
    institution: string;
    score: number;
    reviewText: string;
    verifiedAt: string;
    signatureHash: string;
  };
  verificationStatus: VerificationStatus;
  reviewStatus: ProjectReviewStatus;
  githubStatus: 'NOT_LINKED' | 'GITHUB_LINKED';
  githubStars: number;
  githubCommits: number;
  lineageBatchesCount: number;
  openRoles: string[];
  featured: boolean;
  coverGradient: string;

  // Type specific fields
  course?: string;
  batch?: string;
  license?: string;
  contributionGuidelines?: string;
  maintainers?: string[];
  researchArea?: string;
  researchStage?: string;
  institutionOrOrg?: string;
  publications?: string[];
  organization?: string;
  problemDomain?: string;
  projectStage?: string;
  evidenceUrl?: string;

  passport: IProjectPassport;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectContributorSchema = new Schema<IProjectContributor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    role: { type: String, required: true },
    institution: { type: String, default: '' },
    batch: { type: String, default: '' },
    avatar: { type: String, default: '' },
    githubHandle: { type: String },
    commitsCount: { type: Number, default: 0 }
  },
  { _id: false }
);

const ProjectPassportSchema = new Schema<IProjectPassport>(
  {
    passportId: { type: String, required: true },
    qrHash: { type: String, required: true },
    projectName: { type: String, required: true },
    tagline: { type: String, default: '' },
    institution: { type: String, default: '' },
    department: { type: String, default: '' },
    academicYear: { type: String, default: '' },
    originalBatch: { type: String, default: '' },
    currentBatch: { type: String, default: '' },
    status: { type: String, default: 'Seeking Next Batch' },
    license: { type: String, default: 'MIT' },
    techStack: { type: [String], default: [] },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    githubRepo: { type: String, default: '' },
    liveDemoUrl: { type: String },
    documentationUrl: { type: String },
    totalCommits: { type: Number, default: 0 },
    activeContributors: { type: Number, default: 1 },
    mergedPRs: { type: Number, default: 0 },
    codeHealthScore: { type: Number, default: 90 },
    testCoverage: { type: Number, default: 85 },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    facultyReviewer: {
      name: String,
      designation: String,
      department: String,
      institution: String,
      score: Number,
      reviewText: String,
      verifiedAt: String,
      signatureHash: String
    },
    institutionalValidationCode: { type: String, default: '' },
    rubricScores: {
      novelty: { type: Number, default: 9.0 },
      technicalRigor: { type: Number, default: 9.0 },
      documentation: { type: Number, default: 9.0 },
      continuityPotential: { type: Number, default: 9.5 }
    }
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    passportId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    tagline: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    projectType: {
      type: String,
      enum: ['ACADEMIC', 'OPEN_SOURCE', 'RESEARCH', 'INDUSTRY', 'PERSONAL', 'HACKATHON'],
      default: 'ACADEMIC',
      index: true
    },
    domain: {
      type: String,
      default: 'Developer Tools',
      index: true
    },
    techStack: {
      type: [String],
      default: [],
      index: true
    },
    skillsRequired: {
      type: [String],
      default: []
    },
    teamRequirements: {
      type: String,
      default: ''
    },
    institution: {
      type: String,
      default: 'ProjectVerse Open Federation',
      index: true
    },
    department: {
      type: String,
      default: 'Computer Science',
      index: true
    },
    academicYear: {
      type: String,
      default: '2026'
    },
    status: {
      type: String,
      default: 'Active Development',
      index: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    problem: {
      type: String,
      default: ''
    },
    solution: {
      type: String,
      default: ''
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    contributors: {
      type: [ProjectContributorSchema],
      default: []
    },
    repositoryUrl: {
      type: String,
      default: ''
    },
    demoUrl: {
      type: String
    },
    documentationUrl: {
      type: String
    },
    screenshots: {
      type: [String],
      default: []
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    facultyAdvisor: {
      type: String
    },
    facultyReviewer: {
      name: String,
      designation: String,
      department: String,
      institution: String,
      score: Number,
      reviewText: String,
      verifiedAt: String,
      signatureHash: String
    },
    verificationStatus: {
      type: String,
      default: 'Active Development',
      index: true
    },
    reviewStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER REVIEW', 'REVIEWED', 'VERIFIED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true
    },
    githubStatus: {
      type: String,
      enum: ['NOT_LINKED', 'GITHUB_LINKED'],
      default: 'NOT_LINKED'
    },
    githubStars: {
      type: Number,
      default: 0
    },
    githubCommits: {
      type: Number,
      default: 0
    },
    lineageBatchesCount: {
      type: Number,
      default: 1
    },
    openRoles: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    coverGradient: {
      type: String,
      default: 'from-blue-600/20 via-indigo-600/10 to-transparent'
    },

    // Sub-type specific fields
    course: String,
    batch: String,
    license: String,
    contributionGuidelines: String,
    maintainers: [String],
    researchArea: String,
    researchStage: String,
    institutionOrOrg: String,
    publications: [String],
    organization: String,
    problemDomain: String,
    projectStage: String,
    evidenceUrl: String,

    passport: {
      type: ProjectPassportSchema,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual id
ProjectSchema.virtual('projectId').get(function () {
  return this._id.toHexString();
});

export const ProjectModel: mongoose.Model<IProject> =
  (mongoose.models.Project as mongoose.Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema, 'projects');
export default ProjectModel;
