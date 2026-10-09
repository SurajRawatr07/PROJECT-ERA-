import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationRequest extends Document {
  id: string;
  projectId: mongoose.Types.ObjectId;
  projectTitle: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentAvatar?: string;
  studentInstitution?: string;
  roleInterest: string;
  message: string;
  targetOwnerId: mongoose.Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CollaborationRequestSchema = new Schema<ICollaborationRequest>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    projectTitle: {
      type: String,
      required: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    studentName: {
      type: String,
      required: true
    },
    studentAvatar: {
      type: String
    },
    studentInstitution: {
      type: String
    },
    roleInterest: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    targetOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    reviewedAt: {
      type: Date
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

export const CollaborationRequestModel: mongoose.Model<ICollaborationRequest> =
  (mongoose.models.CollaborationRequest as mongoose.Model<ICollaborationRequest>) ||
  mongoose.model<ICollaborationRequest>('CollaborationRequest', CollaborationRequestSchema, 'collaborationRequests');
export default CollaborationRequestModel;
