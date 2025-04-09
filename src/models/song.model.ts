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
// **Pre Hook for Update**
songSchema.pre('findOneAndUpdate', async function (next) {
  const songId = this.getQuery()._id; // Get the song ID from the query
  const existingSong = await mongoose.model('Song').findById(songId);

  if (existingSong) {
    // Store the previous data before updating
    await SongHistory.create({
      songId: existingSong._id,
      previousData: existingSong.toObject(),
    });
  }

  next();
});
/**
 * Mongoose model for the SongHistory schema.
 */
const SongHistorySchema = new Schema<ISongHistory>(
  {
    songId: { type: Schema.Types.ObjectId, required: true, ref: 'Song' },
    previousData: { type: Schema.Types.Mixed, required: true }, // Stores the full song document before update
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const Song = mongoose.model<ISong>('Song', songSchema);
export const SongHistory = mongoose.model<ISongHistory>(
  'SongHistory',
  SongHistorySchema
);
