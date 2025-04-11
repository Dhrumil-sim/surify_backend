import mongoose, { Document } from 'mongoose';
import { Request } from 'express';
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
  createdBy?: mongoose.Types.ObjectId;
}
export interface IPlayListRequestPayload {
  name: string;
  description?: string;
  isShared: boolean;
  deletedAt?: Date | null;
}
export interface AuthenticatedRequest extends Request {
  // User payload added after authentication middleware
  user?: {
    _id: string;
    email: string;
    username: string;
    role: 'user' | 'Artist';
  }; // optionally use JwtPayload if you're decoding the full token
}
export interface IPlaylistResponse extends IPlayList {
  createdAt?: string;
  updatedAt?: string;
}
export interface GetPlaylistData {
  playlists: IPlaylistResponse[];
  total: number;
}

export interface IPlayListSong extends Document {
  _id: mongoose.Types.ObjectId;
  playlistId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
  deletedAt: null | Date;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPlayListSongRequestPayload {
  playlistId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
}
