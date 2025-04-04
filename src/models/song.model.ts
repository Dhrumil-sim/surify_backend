import { ISong } from 'modules/song/interfaces/song.types.interfaces.js';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Song model.
 */
const songSchema = new Schema<ISong>(
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
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
    },
    genre: {
      type: [String],
      required: true,
    },
    fileHash: {
      type: String,
      required: true,
      unique: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    coverPicture: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null, // Ensures the field is present by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

/**
 * Mongoose model for the Song schema.
 */
export const Song = mongoose.model<ISong>('Song', songSchema);
