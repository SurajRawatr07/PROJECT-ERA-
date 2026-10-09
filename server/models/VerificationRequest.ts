import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, StudentType, DocumentType } from '../../src/types';

export interface IVerificationRequest extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
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
  documentPath?: string;
  documentMimeType?: string;
  documentUploadedAt: Date;
  status: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema = new Schema<IVerificationRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      required: true
    },
    studentType: {
      type: String
    },
    institution: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    course: {
      type: String
    },
    batch: {
      type: String
    },
    graduationYear: {
      type: String
    },
    rollNumber: {
      type: String
    },
    documentType: {
      type: String,
      required: true
    },
    documentFileName: {
      type: String,
      required: true
    },
    documentFileSize: {
      type: String,
      default: '1.5 MB'
    },
    documentPath: {
      type: String
    },
    documentMimeType: {
      type: String
    },
    documentUploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['NOT_SUBMITTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'],
      default: 'PENDING_REVIEW',
      index: true
    },
    rejectionReason: {
      type: String
    },
    reviewedBy: {
      type: String
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

export const VerificationRequestModel: mongoose.Model<IVerificationRequest> =
  (mongoose.models.VerificationRequest as mongoose.Model<IVerificationRequest>) ||
  mongoose.model<IVerificationRequest>('VerificationRequest', VerificationRequestSchema, 'verifications');
export default VerificationRequestModel;
