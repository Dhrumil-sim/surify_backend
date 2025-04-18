import { PlaylistSong, SharedPlaylist } from '@models';
import { Playlist } from '@playlistModule';
import {
  IPlayList,
  IPlaylistResponse,
  ISharedPlaylist,
} from '@playlistModule/interfaces/playlist.types.interface';
import { ISong } from '@songModule';
import mongoose from 'mongoose';

export class PLaylistPreValidator {
  static async isPlaylistExist(
    name?: string,
    userId?: mongoose.Types.ObjectId | string,
    id?: mongoose.Types.ObjectId,
    isShared?: boolean
  ): Promise<IPlaylistResponse> {
    const query: Record<string, unknown> = {
      deletedAt: null,
    };

    if (isShared) {
      query.isShared = isShared;
    }
    if (name) {
      query.name = name.toLowerCase();
    }

    if (id) {
      query._id = id;
    }
    if (userId) {
      query.createdBy = userId;
    }
    console.log(query);
    const playlist = await Playlist.findOne(query);
    return playlist;
  }
  static async isSongExistInPlaylist(
    playlistId: IPlayList['id'],
    songId: ISong['id']
  ): Promise<boolean> {
    const exists = await PlaylistSong.exists({
      playlistId: new mongoose.Types.ObjectId(playlistId),
      songId: new mongoose.Types.ObjectId(songId),
      deletedAt: null,
    });
    return !!exists;
  }

  static async isValidUser(
    reqUserId: IPlayList['createdBy'],
    playlistId: IPlayList['createdBy']
  ): Promise<boolean> {
    const playlist = Playlist.findOne({
      _id: playlistId,
      createdBy: reqUserId,
    });
    if (playlist) {
      return true;
    }
    return false;
  }

  static async isPlaylistAlreadyShared(
    userId: ISharedPlaylist['userId'],
    playlistId: ISharedPlaylist['playlistId'],
    creatorId: ISharedPlaylist['sharedBy']
  ): Promise<boolean> {
    const isSharedPlaylistExist = await SharedPlaylist.findOne({
      userId: userId,
      playlistId: playlistId,
      sharedBy: creatorId,
    });
    if (isSharedPlaylistExist) {
      return true;
    }
    return false;
  }
}
