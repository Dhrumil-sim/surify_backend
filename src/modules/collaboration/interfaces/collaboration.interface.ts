import { Types } from 'mongoose';

export interface ICollaborativeSession {
  _id?: Types.ObjectId;
  hostId: Types.ObjectId;
  participantIds: Types.ObjectId[];
  songQueue: Types.ObjectId[];
  isActive: boolean;
  expiredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
