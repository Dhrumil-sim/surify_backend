import { validateRequest } from '@middlewares';
import { PlaylistSong, Song } from '@models';
import {
  createPlaylistSchema,
  IPlayList,
  IPlayListRequest,
  IPlayListRequestPayload,
  Playlist,
} from '@playlistModule';
import {
  PLAYLIST_CODES,
  PLAYLIST_MESSAGES,
} from '@playlistModule/constants/playlist.error.massages.constant';
import {
  GetPlaylistData,
  IPlaylistResponse,
  IPlayListSong,
  PaginationQuery,
} from '@playlistModule/interfaces/playlist.types.interface';
import { getPaginationOptions } from '@playlistModule/utils/pagination.util';
import { ISong } from '@songModule';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

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
  static async getPlaylist(query: PaginationQuery): Promise<GetPlaylistData> {
    const { skip, limit, sort } = getPaginationOptions(query);
    const filter: Record<string, unknown> = { deletedAt: null };

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    const playlists = await Playlist.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Playlist.countDocuments(filter);

    return { playlists, total, sort, filter, query };
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

  static async deletePlaylist(playlistId: IPlayList['id']): Promise<IPlayList> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Soft delete the playlist
      const deletedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { deletedAt: new Date() },
        { new: true, session, runValidators: true }
      );

      if (!deletedPlaylist) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.DELETION_FAILED,
          PLAYLIST_MESSAGES.DELETION_FAILED
        );
      }

      // Soft delete associated PlaylistSong entries
      await PlaylistSong.updateMany(
        { playlistId },
        { deletedAt: new Date() },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      return deletedPlaylist;
    } catch (error) {
      // Abort the transaction in case of error
      await session.abortTransaction();
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        PLAYLIST_CODES.DELETION_FAILED,
        PLAYLIST_MESSAGES.DELETION_FAILED + '' + error
      );
    } finally {
      // End the session
      session.endSession();
    }
  }

  static async getSongsFromPlaylist(playlistId: IPlayList['id']) {
    const getPlaylistSong = await PlaylistSong.find(
      {
        playlistId: playlistId,
        deletedAt: null,
      },
      { songId: 1 }
    );
    const getSongIds = getPlaylistSong.map((ele) => {
      return ele?.songId;
    });

    const songs = await Song.find({
      _id: { $in: getSongIds },
      deletedAt: null,
    });
    return songs;
  }
}
