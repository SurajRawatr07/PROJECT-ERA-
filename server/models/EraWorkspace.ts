import mongoose, { Schema, Document } from 'mongoose';
import {
  EraAccountType,
  EraDocumentRecord,
  EraFacultyReview,
  EraMentoringRequest,
  EraMilestone,
  EraProject,
  EraProjectStatus,
  EraTask,
  EraTeamMember,
  EraUserProfile
} from '../../src/types/projectEra';

export interface IEraUserDocument extends Document, Omit<EraUserProfile, 'id'> {
  userId: string;
  passwordHash: string;
}

const EraUserSchema = new Schema<IEraUserDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    accountType: {
      type: String,
      enum: ['STUDENT', 'FACULTY', 'HOD', 'ALUMNI'],
      required: true
    },
    institution: { type: String, required: true },
    department: { type: String, required: true },
    course: { type: String },
    batch: { type: String },
    rollNumber: { type: String },
    designation: { type: String },
    areasOfExpertise: [{ type: String }],
    graduationYear: { type: String },
    currentOrganization: { type: String },
    currentJobRole: { type: String },
    skills: [{ type: String }],
    linkedInOrPortfolio: { type: String },
    bio: { type: String }
  },
  { timestamps: true }
);

export interface IEraProjectDocument extends Document, Omit<EraProject, 'id'> {
  projectId: string;
}

const EraTaskSchema = new Schema<EraTask>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    assigneeName: { type: String, required: true },
    responsibility: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo' },
    milestoneTitle: { type: String, required: true }
  },
  { _id: false }
);

const EraMilestoneSchema = new Schema<EraMilestone>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['On Track', 'Delayed', 'Completed'], default: 'On Track' }
  },
  { _id: false }
);

const EraTeamMemberSchema = new Schema<EraTeamMember>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    responsibility: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Pending Request', 'Invited'], default: 'Active' }
  },
  { _id: false }
);

const EraDocumentRecordSchema = new Schema<EraDocumentRecord>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: String, required: true },
    mimeType: { type: String, required: true },
    category: {
      type: String,
      enum: ['Proposal', 'Architecture & Design', 'Milestone Report', 'Final Submission'],
      default: 'Milestone Report'
    },
    uploadedBy: { type: String, required: true },
    uploadedAt: { type: String, required: true }
  },
  { _id: false }
);

const EraFacultyReviewSchema = new Schema<EraFacultyReview>(
  {
    id: { type: String, required: true },
    projectId: { type: String, required: true },
    projectTitle: { type: String, required: true },
    reviewerName: { type: String, required: true },
    reviewerRole: { type: String, enum: ['Faculty', 'HOD'], default: 'Faculty' },
    status: {
      type: String,
      enum: ['Pending Review', 'Revisions Requested', 'Approved', 'Completed'],
      default: 'Pending Review'
    },
    feedback: { type: String, required: true },
    submittedAt: { type: String, required: true }
  },
  { _id: false }
);

const EraProjectSchema = new Schema<IEraProjectDocument>(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    technologies: [{ type: String }],
    status: {
      type: String,
      enum: ['Idea', 'Planning', 'Development', 'Review', 'Completed'] satisfies EraProjectStatus[],
      default: 'Planning'
    },
    academicSession: { type: String, required: true },
    institution: { type: String, required: true },
    department: { type: String, required: true },
    supervisorName: { type: String, required: true },
    supervisorEmail: { type: String, required: true },
    leadStudentName: { type: String, required: true },
    teamMembers: [EraTeamMemberSchema],
    tasks: [EraTaskSchema],
    milestones: [EraMilestoneSchema],
    documents: [EraDocumentRecordSchema],
    reviews: [EraFacultyReviewSchema],
    updatedAt: { type: String, required: true }
  },
  { timestamps: false }
);

export interface IEraMentoringDocument extends Document, Omit<EraMentoringRequest, 'id'> {
  requestId: string;
}

const EraMentoringSchema = new Schema<IEraMentoringDocument>(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true },
    projectTitle: { type: String, required: true },
    studentName: { type: String, required: true },
    department: { type: String, required: true },
    alumniName: { type: String, required: true },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Completed'], default: 'Pending' },
    requestedAt: { type: String, required: true }
  },
  { timestamps: true }
);

export const EraUserModel: mongoose.Model<IEraUserDocument> =
  (mongoose.models.EraUser as mongoose.Model<IEraUserDocument>) ||
  mongoose.model<IEraUserDocument>('EraUser', EraUserSchema);

export const EraProjectModel: mongoose.Model<IEraProjectDocument> =
  (mongoose.models.EraProject as mongoose.Model<IEraProjectDocument>) ||
  mongoose.model<IEraProjectDocument>('EraProject', EraProjectSchema);

export const EraMentoringModel: mongoose.Model<IEraMentoringDocument> =
  (mongoose.models.EraMentoring as mongoose.Model<IEraMentoringDocument>) ||
  mongoose.model<IEraMentoringDocument>('EraMentoring', EraMentoringSchema);
