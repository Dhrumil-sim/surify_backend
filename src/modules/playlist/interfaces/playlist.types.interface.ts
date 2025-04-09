import mongoose, { Document } from 'mongoose';
export interface IPlayList extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  isShared: boolean;
  deletedAt?: Date | null;
  __v?: number;
}

export interface IPlayListRequest extends Document {
  name: string;
  description?: string;
  isShared: boolean;
  deletedAt?: Date | null;
}
