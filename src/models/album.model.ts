import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for Album Document
 */
export interface IAlbum extends Document {
  artist: mongoose.Types.ObjectId;
  title: string;
  genre: string[];
  releaseDate: Date;
  coverPicture: string;
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to Artist (User)
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
        ref: 'Song', // Reference to Songs in Album
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export const Album = mongoose.model<IAlbum>('Album', albumSchema);
