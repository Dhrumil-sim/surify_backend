import { IPlayList } from '@playlistModule';
import mongoose, { Query, Schema } from 'mongoose';

/**
 * @typedef Playlist
 * @property {string} name - Name of the playlist.
 * @property {string} description - Description of the playlist.
 * @property {mongoose.Types.ObjectId} createdBy - User ID of the creator (References User model).
 * @property {Date} dateCreated - Timestamp when the playlist was created.
 * @property {boolean} isShared - Whether the playlist is shared or private.
 */
const playlistSchema = new Schema<IPlayList>(
  {
    name: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isShared: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
function excludeSoftDeleted<T>(this: Query<T, T>) {
  this.where({ deletedAt: null });
}
playlistSchema.pre('find', excludeSoftDeleted);
playlistSchema.pre('findOne', excludeSoftDeleted);
playlistSchema.pre('findOneAndUpdate', excludeSoftDeleted);
playlistSchema.pre('countDocuments', excludeSoftDeleted);

export const Playlist = mongoose.model<IPlayList>('Playlist', playlistSchema);
