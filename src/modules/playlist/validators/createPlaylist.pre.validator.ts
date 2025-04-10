import { Playlist } from '@playlistModule';
import mongoose from 'mongoose';

export class PLaylistPreValidator {
  static async isPlaylistExistByName(
    name: string,
    userId?: mongoose.Types.ObjectId | string
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      name: name.toLowerCase(),
    };
    if (userId) {
      query.createdBy = userId;
    }
    const playlist = await Playlist.findOne(query).lean();
    if (playlist) {
      return true;
    }
    return false;
  }
}
