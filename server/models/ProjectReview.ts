import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectReview extends Document {
  id: string;
  projectId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  reviewerName: string;
  reviewerRole: string;
  reviewerDesignation?: string;
  department?: string;
  institution?: string;
  score: number;
  comments: string;
  verified: boolean;
  rubricScores: {
    novelty: number;
    technicalRigor: number;
    documentation: number;
    continuityPotential: number;
  };
  status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  signatureHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectReviewSchema = new Schema<IProjectReview>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reviewerName: {
      type: String,
      required: true
    },
    reviewerRole: {
      type: String,
      required: true
    },
    reviewerDesignation: {
      type: String
    },
    department: {
      type: String
    },
    institution: {
      type: String
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    comments: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: true
    },
    rubricScores: {
      novelty: { type: Number, default: 9.0 },
      technicalRigor: { type: Number, default: 9.0 },
      documentation: { type: Number, default: 9.0 },
      continuityPotential: { type: Number, default: 9.5 }
    },
    status: {
      type: String,
      enum: ['APPROVED', 'REJECTED', 'CHANGES_REQUESTED'],
      default: 'APPROVED'
    },
    signatureHash: {
      type: String,
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

export const ProjectReviewModel: mongoose.Model<IProjectReview> =
  (mongoose.models.ProjectReview as mongoose.Model<IProjectReview>) ||
  mongoose.model<IProjectReview>('ProjectReview', ProjectReviewSchema, 'projectReviews');
export default ProjectReviewModel;
