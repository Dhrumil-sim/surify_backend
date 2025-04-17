import { ISharedPlaylist } from '@playlistModule';
import mongoose, { Query, Schema } from 'mongoose';

const sharedPlaylist = new Schema<ISharedPlaylist>(
  {
    playlistId: {
      type: Schema.Types.ObjectId,
      ref: 'Playlist',
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
function excludeSoftDeleted<T>(this: Query<T, T>) {
  this.where({ deletedAt: null });
}
sharedPlaylist.pre('find', excludeSoftDeleted);
sharedPlaylist.pre('findOne', excludeSoftDeleted);
sharedPlaylist.pre('findOneAndUpdate', excludeSoftDeleted);
sharedPlaylist.pre('countDocuments', excludeSoftDeleted);

export const SharedPlaylist = mongoose.model<ISharedPlaylist>(
  'SharedPlaylist',
  sharedPlaylist
);
