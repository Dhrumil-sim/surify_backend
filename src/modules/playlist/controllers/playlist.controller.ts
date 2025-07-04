import { ApiError, asyncHandler, ResponseHandler } from '@utils';
import { Response } from 'express';
import {
  AuthenticatedRequest,
  IPlayListRequestPayload,
  PaginationQuery,
  PLaylistPreValidator,
  PlaylistService,
} from '@playlistModule';
import {
  PLAYLIST_CODES,
  PLAYLIST_MESSAGES,
  SHARED_PLAYLIST_CODES,
  SHARED_PLAYLIST_MESSAGES,
} from '../constants/playlist.error.massages.constant.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { validateRequest } from '@middlewares';
import { SongService } from '@songModule';
import { addSongToPlaylistSchema } from '../validators/playlist.joi.validator.js';
import { User } from '@models';

export class PlaylistController {
  static createPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const requestBody: IPlayListRequestPayload = req.body;
      const userId = req?.user?._id;

      if (!requestBody) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          PLAYLIST_CODES.INVALID_PLAYLIST_INPUT,
          PLAYLIST_MESSAGES.INVALID_PLAYLIST_INPUT
        );
      }

      const isPlaylistExistByName = await PLaylistPreValidator.isPlaylistExist(
        requestBody['name'],
        userId
      );

      if (isPlaylistExistByName) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          PLAYLIST_CODES.PLAYLIST_ALREADY_EXISTS,
          PLAYLIST_MESSAGES.PLAYLIST_ALREADY_EXISTS
        );
      }

      const newPlaylist = await PlaylistService.createPlaylist(
        requestBody,
        userId
      );

      if (!newPlaylist) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          PLAYLIST_CODES.PLAYLIST_CREATION_FAILED,
          PLAYLIST_MESSAGES.PLAYLIST_CREATION_FAILED
        );
      }

      return ResponseHandler.created(
        res,
        newPlaylist,
        PLAYLIST_MESSAGES.PLAYLIST_CREATED
      );
    }
  );

  static getPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      enum sortEnum {
        asc = 'asc',
        desc = 'desc',
      }

      const query: PaginationQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
        sortOrder: req.query.sortBy
          ? sortEnum[String(req.query.sortOrder)]
          : undefined,
        search: req.query.search ? String(req.query.search) : undefined,
      };

      const { playlists, total } = await PlaylistService.getPlaylist(query);

      if (!playlists.length) {
        return ResponseHandler.paginated(
          res,
          [],
          total,
          query.page,
          query.limit,
          'No playlists found'
        );
      }

      return ResponseHandler.paginated(
        res,
        playlists,
        total,
        query.page,
        query.limit,
        'Playlists fetched successfully'
      );
    }
  );

  static updatePlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const playlistId = new mongoose.Types.ObjectId(req?.params?.id);
      const userId = new mongoose.Types.ObjectId(req?.user?._id);

      const playlistExistById = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        userId,
        playlistId
      );

      if (!playlistExistById) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.PLAYLIST_NOT_FOUND,
          PLAYLIST_MESSAGES.PLAYLIST_NOT_FOUND
        );
      }

      const updatePlayListPayload: Partial<IPlayListRequestPayload> = req.body;

      const updatedPlaylist = await PlaylistService.updatePlayList(
        playlistExistById,
        updatePlayListPayload
      );

      return ResponseHandler.success(
        res,
        updatedPlaylist,
        PLAYLIST_MESSAGES.PLAYLIST_UPDATED
      );
    }
  );

  static addSongPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const songId = new mongoose.Types.ObjectId(req?.params?.songId);
      const song = await SongService.getSongById(req?.params?.songId);
      const playlistId = new mongoose.Types.ObjectId(req?.params?.id);

      req.body.songId = songId;
      req.body.id = playlistId;
      validateRequest(addSongToPlaylistSchema);

      if (!song) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.SONG_NOT_FOUND,
          'Song not found'
        );
      }

      const playlistExistById = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        undefined,
        playlistId
      );

      if (!playlistExistById) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.PLAYLIST_NOT_FOUND,
          PLAYLIST_MESSAGES.PLAYLIST_NOT_FOUND
        );
      }

      const isSongAlreadyExistsInPlaylist =
        await PLaylistPreValidator.isSongExistInPlaylist(playlistId, songId);

      if (isSongAlreadyExistsInPlaylist) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          PLAYLIST_CODES.SONG_ALREADY_IN_PLAYLIST,
          PLAYLIST_MESSAGES.SONG_ALREADY_IN_PLAYLIST
        );
      }

      const playlistWithSong = await PlaylistService.addSongInPlaylist(
        playlistId,
        songId
      );

      if (!playlistWithSong) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          PLAYLIST_CODES.ADD_SONG_FAILED,
          PLAYLIST_MESSAGES.ADD_SONG_FAILED
        );
      }

      return ResponseHandler.created(
        res,
        playlistWithSong,
        PLAYLIST_MESSAGES.ADD_SONG_SUCCESS
      );
    }
  );

  static deletePlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const playlistId = new mongoose.Types.ObjectId(req?.params?.id);
      const userId = new mongoose.Types.ObjectId(req?.user?._id);

      const isPlaylistExist = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        userId,
        playlistId
      );

      if (!isPlaylistExist) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.PLAYLIST_NOT_FOUND,
          PLAYLIST_MESSAGES.PLAYLIST_NOT_FOUND
        );
      }

      const isValidUser = await PLaylistPreValidator.isValidUser(
        userId,
        playlistId
      );

      if (!isValidUser) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          PLAYLIST_CODES.UNAUTHORIZED,
          PLAYLIST_MESSAGES.UNAUTHORIZED
        );
      }

      const deletedPlaylist = await PlaylistService.deletePlaylist(playlistId);

      return ResponseHandler.deleted(
        res,
        deletedPlaylist,
        PLAYLIST_MESSAGES.PLAYLIST_DELETED
      );
    }
  );

  static getSongsFromPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const playlistId = new mongoose.Types.ObjectId(req?.params?.id);

      const playlistExistById = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        undefined,
        playlistId
      );

      if (!playlistExistById) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.PLAYLIST_NOT_FOUND,
          PLAYLIST_MESSAGES.PLAYLIST_NOT_FOUND
        );
      }

      const getSongsFromPlaylist =
        await PlaylistService.getSongsFromPlaylist(playlistId);

      if (!getSongsFromPlaylist.length) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.GET_SONGS_FAILED,
          PLAYLIST_MESSAGES.GET_SONGS_FAILED
        );
      }

      return ResponseHandler.success(
        res,
        getSongsFromPlaylist,
        PLAYLIST_MESSAGES.GET_SONGS_SUCCESS
      );
    }
  );

  static deleteSongFromThePlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const playlistId = new mongoose.Types.ObjectId(req?.params?.id);
      const songId = new mongoose.Types.ObjectId(req?.params?.songId);

      const playlistExistById = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        undefined,
        playlistId
      );

      if (!playlistExistById) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.PLAYLIST_NOT_FOUND,
          PLAYLIST_MESSAGES.PLAYLIST_NOT_FOUND
        );
      }

      const songExistInPlaylist =
        await PLaylistPreValidator.isSongExistInPlaylist(playlistId, songId);

      if (!songExistInPlaylist) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.SONG_NOT_IN_PLAYLIST,
          PLAYLIST_MESSAGES.SONG_NOT_IN_PLAYLIST
        );
      }

      const deletedSong = await PlaylistService.deleteSongFromPlaylist(
        playlistId,
        songId
      );

      if (!deletedSong) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          PLAYLIST_CODES.REMOVE_SONG_FAILED,
          PLAYLIST_MESSAGES.REMOVE_SONG_FAILED
        );
      }

      return ResponseHandler.deleted(
        res,
        deletedSong,
        PLAYLIST_MESSAGES.REMOVE_SONG_SUCCESS
      );
    }
  );

  static addUserToSharedPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const playlistId = new mongoose.Types.ObjectId(req?.params?.playlistId);
      const creatorId = new mongoose.Types.ObjectId(req?.user?._id);
      const userId = new mongoose.Types.ObjectId(req?.params?.userId);

      const isPlaylistAlreadyShared =
        await PLaylistPreValidator.isPlaylistAlreadyShared(
          userId,
          playlistId,
          creatorId
        );

      if (isPlaylistAlreadyShared) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          SHARED_PLAYLIST_MESSAGES.ALREADY_SHARED
        );
      }

      const isValidUser = await PLaylistPreValidator.isValidUser(
        creatorId,
        playlistId
      );

      if (!isValidUser) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          PLAYLIST_MESSAGES.UNAUTHORIZED
        );
      }

      const isPlaylistExist = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        undefined,
        playlistId
      );

      if (!isPlaylistExist) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          PLAYLIST_MESSAGES.PLAYLIST_NOT_FOUND
        );
      }

      const creatorIdFromPlaylist = isPlaylistExist['createdBy'];
      if (creatorIdFromPlaylist.equals(userId)) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          SHARED_PLAYLIST_MESSAGES.CONFLICT_USERS
        );
      }

      const isPlaylistShared = await PLaylistPreValidator.isPlaylistExist(
        undefined,
        undefined,
        playlistId,
        true
      );

      if (!isPlaylistShared) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          PLAYLIST_MESSAGES.GET_SHARED_FAILED
        );
      }

      const playlistCreator = isPlaylistShared.createdBy;
      const currentUser = creatorId;

      if (!playlistCreator.equals(currentUser)) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          SHARED_PLAYLIST_MESSAGES.UNAUTHORIZED
        );
      }

      const isUserExist = await User.findOne(userId);
      if (!isUserExist) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST,
          SHARED_PLAYLIST_MESSAGES.USER_NOT_FOUND
        );
      }

      const sharedPlaylist = await PlaylistService.sharePlaylistWithUser(
        playlistId,
        userId,
        creatorId
      );

      if (!sharedPlaylist) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          SHARED_PLAYLIST_CODES.ADD_USER_TO_PLAYLIST_FAILED,
          SHARED_PLAYLIST_MESSAGES.ADD_USER_TO_PLAYLIST_FAILED
        );
      }

      return ResponseHandler.success(
        res,
        sharedPlaylist,
        SHARED_PLAYLIST_MESSAGES.ADD_USER_TO_PLAYLIST_SUCCESS
      );
    }
  );

  static getSharedPlaylistsWithUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = new mongoose.Types.ObjectId(req?.user?._id);
      const sharedPlaylist =
        await PlaylistService.getSharedPlaylistWithUser(userId);

      if (!sharedPlaylist.length) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SHARED_PLAYLIST_CODES.GET_SHARED_PLAYLIST,
          SHARED_PLAYLIST_MESSAGES.GET_SHARED_PLAYLIST_FAILED
        );
      }

      return ResponseHandler.success(
        res,
        sharedPlaylist,
        SHARED_PLAYLIST_MESSAGES.GET_SHARED_PLAYLIST_SUCCESS
      );
    }
  );
}
