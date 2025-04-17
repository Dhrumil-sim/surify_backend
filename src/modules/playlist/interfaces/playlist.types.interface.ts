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
  sort: Record<string, 1 | -1>;
  filter: Record<string, unknown>;
  query: PaginationQuery;
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
export interface PaginationQuery {
  page?: number; // Defaults to 1
  limit?: number; // Defaults to 10
  sortBy?: string; // Field to sort by, e.g., 'createdAt'
  total?: number;
  sortOrder?: 'asc' | 'desc'; // Sort order
  search?: string; // Search term for filtering
}

export interface ISharedPlaylist extends Document {
  _id: mongoose.Types.ObjectId;
  playlistId: IPlayList['id'];
  userId: mongoose.Types.ObjectId;
  sharedBy: IPlayList['createdBy'];
  sharedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  __v: number;
}
export interface ISharedPlaylistAddUserRequest {
  playlistId: IPlayList['id'];
  userId: ISharedPlaylist['userId'];
  sharedBy: ISharedPlaylist['sharedBy'];
}
