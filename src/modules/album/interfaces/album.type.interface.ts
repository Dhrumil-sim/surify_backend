import mongoose, { Document } from 'mongoose';

/**
 * Interface representing an Album document in MongoDB.
 */
export interface IAlbum extends Document {
  songFiles: string[];
  songCovers: string[];
  __id: mongoose.Types.ObjectId;
  id: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  title: string;
  genre: string[];
  releaseDate: Date;
  coverPicture: string;
  songs: mongoose.Types.ObjectId[];
  deletedAt?: Date | null;
  __v?: number;
}
