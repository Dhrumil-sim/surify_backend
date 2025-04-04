import mongoose, { Document } from 'mongoose';

/**
 * Interface representing a Song document in MongoDB.
 */
export interface ISong extends Document {
  artist: mongoose.Types.ObjectId;
  title: string;
  album?: mongoose.Types.ObjectId | null;
  genre: string[];
  releaseDate: Date;
  duration: number;
  coverPicture: string;
  filePath: string;
  fileHash: string;
  deletedAt?: Date | null;
}
