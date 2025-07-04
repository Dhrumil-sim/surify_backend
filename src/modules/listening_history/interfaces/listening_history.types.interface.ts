import type { Request } from 'express';

export interface IListeningHistory {
  _id?: string;
  userId: string; // MongoDB ObjectId as string
  songId: string; // MongoDB ObjectId as string
  playedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}
