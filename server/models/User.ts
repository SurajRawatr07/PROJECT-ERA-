import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, AccountStatus } from '../../src/types';

export interface IUser extends Document {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  passwordHash: string;
  role: UserRole;
  accountType: string;
  status: AccountStatus;
  avatar: string;
  bio?: string;
  skills: string[];
  
  // Student & Alumni fields
  institution?: string;
  department?: string;
  course?: string;
  batch?: string;
  graduationYear?: string;
  rollNumber?: string;
  studentType?: 'CURRENT_STUDENT' | 'ALUMNI';

  // Developer & Industry fields
  currentOrganization?: string;
  currentJobRole?: string;
  experienceYears?: number;
  githubHandle?: string;
  linkedIn?: string;
  portfolio?: string;

  // Researcher fields
  researchInterests?: string[];
  publicationsCount?: number;

  // Faculty & HOD fields
  facultyId?: string;
  designation?: string;
  departmentToken?: string;

  // Institution Node fields
  institutionType?: string;
  officialDomain?: string;
  contactPerson?: string;
  address?: string;
  website?: string;

  // Reviewer Authorization & Mentorship
  isAuthorizedReviewer?: boolean;
  reviewerCategories?: Array<'ACADEMIC' | 'TECHNICAL' | 'RESEARCH' | 'ORGANIZATION'>;
  availableForMentorship?: boolean;

  // Verification State
  verificationStatus: 'PENDING' | 'EMAIL_VERIFIED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  verification: {
    accountStatus: AccountStatus;
    email: 'VERIFIED' | 'UNVERIFIED';
    mobile: 'VERIFIED' | 'UNVERIFIED';
    institution: 'VERIFIED' | 'UNVERIFIED';
    academic: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_APPLICABLE';
    document: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED';
    contribution: 'PENDING' | 'VERIFIED' | 'REJECTED';
    rejectionReason?: string;
    githubConnected?: boolean;
    linkedInAdded?: boolean;
    portfolioAdded?: boolean;
    emailVerified: boolean;
    institutionVerified: boolean;
    academicVerified: boolean;
    documentVerified: boolean;
    facultyReviewed: boolean;
    contributionVerified: boolean;
  };

  isActive: boolean;
  projectsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    mobile: {
      type: String,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['STUDENT', 'FACULTY', 'HOD', 'ADMIN'],
      default: 'STUDENT',
      index: true
    },
    accountType: {
      type: String,
      enum: [
        'STUDENT',
        'ALUMNI',
        'DEVELOPER',
        'RESEARCHER',
        'FACULTY',
        'HOD',
        'INSTITUTION',
        'INDUSTRY_PROFESSIONAL',
        'ADMIN'
      ],
      default: 'STUDENT',
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: 1000
    },
    skills: {
      type: [String],
      default: []
    },

    // Identity / Academic fields
    institution: { type: String, trim: true, index: true },
    department: { type: String, trim: true, index: true },
    course: { type: String, trim: true },
    batch: { type: String, trim: true },
    graduationYear: { type: String, trim: true },
    rollNumber: { type: String, trim: true },
    studentType: { type: String, enum: ['CURRENT_STUDENT', 'ALUMNI'] },

    // Developer & Industry fields
    currentOrganization: { type: String, trim: true },
    currentJobRole: { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    githubHandle: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    portfolio: { type: String, trim: true },

    // Researcher fields
    researchInterests: { type: [String], default: [] },
    publicationsCount: { type: Number, default: 0 },

    // Faculty & HOD fields
    facultyId: { type: String, trim: true },
    designation: { type: String, trim: true },
    departmentToken: { type: String, trim: true },

    // Institution fields
    institutionType: { type: String, trim: true },
    officialDomain: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    address: { type: String, trim: true },
    website: { type: String, trim: true },

    // Reviewer status
    isAuthorizedReviewer: { type: Boolean, default: false },
    reviewerCategories: { type: [String], default: [] },
    availableForMentorship: { type: Boolean, default: false },

    // Verification state
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'EMAIL_VERIFIED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    verification: {
      accountStatus: { type: String, default: 'ACTIVE' },
      email: { type: String, enum: ['VERIFIED', 'UNVERIFIED'], default: 'UNVERIFIED' },
      mobile: { type: String, enum: ['VERIFIED', 'UNVERIFIED'], default: 'UNVERIFIED' },
      institution: { type: String, enum: ['VERIFIED', 'UNVERIFIED'], default: 'UNVERIFIED' },
      academic: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'NOT_APPLICABLE'], default: 'PENDING' },
      document: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'NOT_REQUIRED'], default: 'PENDING' },
      contribution: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
      rejectionReason: { type: String },
      githubConnected: { type: Boolean, default: false },
      linkedInAdded: { type: Boolean, default: false },
      portfolioAdded: { type: Boolean, default: false },
      emailVerified: { type: Boolean, default: false },
      institutionVerified: { type: Boolean, default: false },
      academicVerified: { type: Boolean, default: false },
      documentVerified: { type: Boolean, default: false },
      facultyReviewed: { type: Boolean, default: false },
      contributionVerified: { type: Boolean, default: false }
    },

    isActive: {
      type: Boolean,
      default: true
    },
    projectsCount: {
      type: Number,
      default: 0
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
        delete ret.passwordHash;
        return ret;
      }
    }
  }
);

// Virtual id
UserSchema.virtual('userId').get(function () {
  return this._id.toHexString();
});

export const UserModel: mongoose.Model<IUser> =
  (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema, 'users');
export default UserModel;
