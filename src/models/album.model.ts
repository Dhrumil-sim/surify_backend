import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing an Album document in MongoDB.
 */
export interface IAlbum extends Document {
  id: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  title: string;
  genre: string[];
  releaseDate: Date;
  coverPicture: string;
  songs: mongoose.Types.ObjectId[];
  deletedAt?: Date | null;
}

/**
 * Mongoose schema for the Album model.
 */
const albumSchema = new Schema<IAlbum>(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    coverPicture: {
      type: String,
      required: true,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Song', // Reference to the 'Song' model
      },
    ],
    deletedAt: {
      type: Date,
      default: null, // Ensures soft deletion functionality
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

/**
 * Mongoose model for the Album schema.
 */
export const Album = mongoose.model<IAlbum>('Album', albumSchema);
