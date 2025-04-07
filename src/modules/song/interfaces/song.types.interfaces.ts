import mongoose, { Document } from 'mongoose';

/**
 * Interface representing a Song document in MongoDB.
 */
interface ISong extends Document {
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

/**
 * Interface representing a previously version of data before update
 */
// Define the structure of the song history document
interface ISongHistory extends Document {
  songId: mongoose.Types.ObjectId;
  previousData: object;
  updatedAt: Date;
}
export { ISong, ISongHistory };
