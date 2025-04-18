import { IPlayListSong } from '@playlistModule';
import mongoose, { Query, Schema } from 'mongoose';
/**
 * @typedef PlaylistSong
 * @property {mongoose.Types.ObjectId} playlistId - The playlist this song belongs to (References Playlist model).
 * @property {mongoose.Types.ObjectId} songId - The song in the playlist (References Song model).
 * @property {Date} addedAt - Timestamp when the song was added to the playlist.
 */
const playlistSongSchema = new Schema<IPlayListSong>({
  playlistId: { type: Schema.Types.ObjectId, ref: 'Playlist', required: true },
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  addedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

function excludeSoftDeleted<T>(this: Query<T, T>) {
  this.where({ deletedAt: null });
}
playlistSongSchema.pre('find', excludeSoftDeleted);
playlistSongSchema.pre('findOne', excludeSoftDeleted);
playlistSongSchema.pre('findOneAndUpdate', excludeSoftDeleted);
playlistSongSchema.pre('countDocuments', excludeSoftDeleted);

export const PlaylistSong = mongoose.model(
  'PlaylistSong',
  playlistSongSchema
)<IPlayListSong>;
