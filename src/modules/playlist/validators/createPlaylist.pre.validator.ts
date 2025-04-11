import { PlaylistSong } from '@models';
import { Playlist } from '@playlistModule';
import {
  IPlayList,
  IPlaylistResponse,
  IPlayListSong,
} from '@playlistModule/interfaces/playlist.types.interface';
import { ISong } from '@songModule';
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
  static async isSongExistInPlaylist(
    playlistId: IPlayList['id'],
    songId: ISong['id']
  ): Promise<IPlayListSong> {
    const playlistWithSong = await PlaylistSong.findOne({
      playlistId: playlistId,
      songId: songId,
    });
    return playlistWithSong;
  }

  static async isValidUser(
    reqUserId: IPlayList['createdBy'],
    playlistId: IPlayList['createdBy']
  ): Promise<IPlayList> {
    const playlist = Playlist.findOne({
      _id: playlistId,
      createdBy: reqUserId,
    });
    return playlist;
  }
}
