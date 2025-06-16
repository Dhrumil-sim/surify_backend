import { ICollaborativeSession } from '@collabSessionModule';
import mongoose, { Schema } from 'mongoose';

const collaborativeSessionSchema = new Schema<ICollaborativeSession>({
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  songQueue: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  isActive: { type: Boolean, default: true },
  expiredAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});

export const CollaborativeSessionModel = mongoose.model<ICollaborativeSession>(
  'CollaborativeSession',
  collaborativeSessionSchema
);
