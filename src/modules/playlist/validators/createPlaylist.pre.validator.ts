import { Playlist } from '@playlistModule';
import { IPlaylistResponse } from '@playlistModule/interfaces/playlist.types.interface';
import mongoose from 'mongoose';

export class PLaylistPreValidator {
  static async isPlaylistExist(
    name?: string,
    userId?: mongoose.Types.ObjectId | string,
    id?: mongoose.Types.ObjectId
  ): Promise<IPlaylistResponse> {
    const query: Record<string, unknown> = {
      deletedAt: null,
    };

    if (name) {
      query.name = name.toLowerCase();
    }

    if (id) {
      query._id = id;
    }
    if (userId) {
      query.createdBy = userId;
    }
    const playlist = await Playlist.findOne(query);
    return playlist;
  }
}
