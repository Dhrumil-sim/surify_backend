import { validateRequest } from '@middlewares';
import { PlaylistSong } from '@models';
import {
  createPlaylistSchema,
  IPlayList,
  IPlayListRequest,
  IPlayListRequestPayload,
  Playlist,
} from '@playlistModule';
import { PLAYLIST_CODES } from '@playlistModule/constants/playlist.error.massages.constant';
import {
  IPlaylistResponse,
  IPlayListSong,
} from '@playlistModule/interfaces/playlist.types.interface';
import { ISong } from '@songModule';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

export class PlaylistService {
  static async createPlaylist(
    createPlaylistPayload: IPlayListRequestPayload,
    userId: IPlayListRequest['createdBy'] | string
  ): Promise<IPlayList> {
    validateRequest(createPlaylistSchema);
    const { name, description, isShared } = createPlaylistPayload;
    const newPlaylist = Playlist.create({
      name: name,
      description: description,
      isShared: isShared,
      createdBy: userId,
      deletedAt: null,
    });
    return newPlaylist;
  }
  static async getPlaylist(): Promise<IPlayList[]> {
    const playlists = await Playlist.find({ deletedAt: null });
    return playlists;
  }

  static async updatePlayList(
    playlistExistById: IPlaylistResponse,
    body: Partial<IPlayListRequestPayload>
  ) {
    // Check if name is being updated and is unique
    if (
      body.name &&
      body.name.toLowerCase() !== playlistExistById.name.toLowerCase()
    ) {
      const isNameTaken = await Playlist.findOne({
        name: body.name.toLowerCase(),
        createdBy: playlistExistById.createdBy,
        deletedAt: null,
        _id: { $ne: playlistExistById._id }, // exclude self
      });

      if (isNameTaken) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          PLAYLIST_CODES.ALREADY_EXISTS,
          'Playlist name already exists'
        );
      }
    }
    // Merge the new updates
    Object.assign(playlistExistById, body);
    // Save regardless of whether name changed or not
    return await playlistExistById.save();
  }

  static async addSongInPlaylist(
    playlistId: IPlayList['id'],
    songId: ISong['id'] | ISong['id'][]
  ): Promise<IPlayListSong> {
    const playlistWithSong = await PlaylistSong.create({
      playlistId: playlistId,
      songId: songId,
      deletedAt: null,
      addedAt: Date.now(),
    });
    return playlistWithSong;
  }
}
