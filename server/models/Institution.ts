import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  id: string;
  name: string;
  code: string;
  domain?: string;
  institutionType?: string;
  departments: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  contactEmail?: string;
  website?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    domain: {
      type: String,
      trim: true
    },
    institutionType: {
      type: String,
      default: 'University'
    },
    departments: {
      type: [String],
      default: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication']
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'VERIFIED'
    },
    contactEmail: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
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

export const InstitutionModel: mongoose.Model<IInstitution> =
  (mongoose.models.Institution as mongoose.Model<IInstitution>) || mongoose.model<IInstitution>('Institution', InstitutionSchema, 'institutions');
export default InstitutionModel;
