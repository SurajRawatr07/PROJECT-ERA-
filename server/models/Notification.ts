import mongoose, { Schema, Document } from 'mongoose';
import { AppNotificationType } from '../../src/types';

export interface INotification extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  type: AppNotificationType;
  title: string;
  message: string;
  projectId?: string;
  relatedId?: string;
  senderName?: string;
  senderAvatar?: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      default: 'SYSTEM'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    projectId: {
      type: String
    },
    relatedId: {
      type: String
    },
    senderName: {
      type: String
    },
    senderAvatar: {
      type: String
    },
    actionUrl: {
      type: String
    },
    read: {
      type: Boolean,
      default: false,
      index: true
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

export const NotificationModel: mongoose.Model<INotification> =
  (mongoose.models.Notification as mongoose.Model<INotification>) || mongoose.model<INotification>('Notification', NotificationSchema, 'notifications');
export default NotificationModel;
