import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectMember extends Document {
  id: string;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'Project Owner' | 'Lead Contributor' | 'Contributor' | 'Advisor' | 'Reviewer';
  permissions: string[];
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMemberSchema = new Schema<IProjectMember>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['Project Owner', 'Lead Contributor', 'Contributor', 'Advisor', 'Reviewer'],
      default: 'Contributor'
    },
    permissions: {
      type: [String],
      default: ['VIEW', 'CONTRIBUTE']
    },
    joinedAt: {
      type: Date,
      default: Date.now
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

ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectMemberModel: mongoose.Model<IProjectMember> =
  (mongoose.models.ProjectMember as mongoose.Model<IProjectMember>) ||
  mongoose.model<IProjectMember>('ProjectMember', ProjectMemberSchema, 'projectMembers');
export default ProjectMemberModel;
