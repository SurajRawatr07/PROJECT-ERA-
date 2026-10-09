import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectLineage extends Document {
  id: string;
  projectId: mongoose.Types.ObjectId;
  originalProjectId?: mongoose.Types.ObjectId;
  year: string;
  batchName: string;
  version?: string;
  institution: string;
  leadContributors: string[];
  previousContributors: string[];
  currentContributors: string[];
  keyMilestones: string[];
  majorChanges: string[];
  technologies: string[];
  commits: number;
  pullRequests: number;
  activeStatus: 'Current' | 'Completed' | 'Upcoming Roadmap' | 'Seeking Next Batch' | 'Continuity Ready';
  summary: string;
  handoverNotes?: string;
  documentationUrl?: string;
  evidenceSummary?: string;
  facultyReviewScore?: number;
  mentorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectLineageSchema = new Schema<IProjectLineage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    originalProjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true
    },
    year: {
      type: String,
      required: true
    },
    batchName: {
      type: String,
      required: true
    },
    version: {
      type: String,
      default: 'v1.0'
    },
    institution: {
      type: String,
      default: 'ProjectVerse Open Federation'
    },
    leadContributors: {
      type: [String],
      default: []
    },
    previousContributors: {
      type: [String],
      default: []
    },
    currentContributors: {
      type: [String],
      default: []
    },
    keyMilestones: {
      type: [String],
      default: []
    },
    majorChanges: {
      type: [String],
      default: []
    },
    technologies: {
      type: [String],
      default: []
    },
    commits: {
      type: Number,
      default: 0
    },
    pullRequests: {
      type: Number,
      default: 0
    },
    activeStatus: {
      type: String,
      enum: ['Current', 'Completed', 'Upcoming Roadmap', 'Seeking Next Batch', 'Continuity Ready'],
      default: 'Current'
    },
    summary: {
      type: String,
      required: true
    },
    handoverNotes: {
      type: String,
      default: ''
    },
    documentationUrl: {
      type: String
    },
    evidenceSummary: {
      type: String
    },
    facultyReviewScore: {
      type: Number
    },
    mentorName: {
      type: String
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

export const ProjectLineageModel: mongoose.Model<IProjectLineage> =
  (mongoose.models.ProjectLineage as mongoose.Model<IProjectLineage>) ||
  mongoose.model<IProjectLineage>('ProjectLineage', ProjectLineageSchema, 'projectLineages');
export default ProjectLineageModel;
