import { ApiError, ApiResponse, asyncHandler } from '@utils';
import { Response } from 'express';
import {
  AuthenticatedRequest,
  GetPlaylistData,
  IPlayList,
  IPlayListRequestPayload,
  IPlayListSong,
  ISharedPlaylist,
  PaginationQuery,
  PLaylistPreValidator,
  PlaylistService,
  updatePlaylistSchema,
} from '@playlistModule';
import {
  PLAYLIST_CODES,
  PLAYLIST_MESSAGES,
  SHARED_PLAYLIST_CODES,
  SHARED_PLAYLIST_MESSAGES,
  SONG_CODES,
  SONG_MESSAGES,
} from '@playlistModule/constants/playlist.error.massages.constant';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { validateRequest } from '@middlewares';
import { ISong, SongService } from '@songModule';
import { addSongToPlaylistSchema } from '@playlistModule/validators/playlist.joi.validator';
import { User } from '@models';
export class PlaylistController {
  static createPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const requestBody: IPlayListRequestPayload = req.body;
      const userId = req?.user?._id;
      if (!requestBody) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          PLAYLIST_CODES.INVALID_INPUT,
          PLAYLIST_MESSAGES.INVALID_INPUT
        );
      }
      const isPlaylistExistByName = await PLaylistPreValidator.isPlaylistExist(
        requestBody['name'],
        userId
      );
      if (isPlaylistExistByName) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          PLAYLIST_CODES.ALREADY_EXISTS,
          PLAYLIST_MESSAGES.ALREADY_EXISTS
        );
      }
      const newPlaylist = await PlaylistService.createPlaylist(
        requestBody,
        userId
      );

      if (!newPlaylist) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'PLAYLIST_IS_NOT_CREATED',
          'there might be some issue while creating playlist'
        );
      }

      const response = new ApiResponse(
        StatusCodes.CREATED,
        newPlaylist,
        'Playlist is created'
      );
      res.status(response.statusCode).json(response);
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

      const {
        playlists,
        total,
        sort,
        filter,
        query: returnedQuery,
      } = await PlaylistService.getPlaylist(query);

      const response = new ApiResponse<GetPlaylistData>(
        StatusCodes.OK,
        { playlists, total, sort, filter, query: returnedQuery },
        'Playlists are fetched successfully'
      );

      res.status(response.statusCode).json(response);
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
          PLAYLIST_CODES.UPDATE_FAILED,
          PLAYLIST_MESSAGES.NOT_FOUND
        );
      } else {
        const updatePlayListPayload: Partial<IPlayListRequestPayload> =
          req.body;
        validateRequest(updatePlaylistSchema);
        const updatedPlaylist = await PlaylistService.updatePlayList(
          playlistExistById,
          updatePlayListPayload
        );

        const response = new ApiResponse(
          StatusCodes.OK,
          updatedPlaylist,
          PLAYLIST_MESSAGES.UPDATE_SUCCESS
        );
        res.status(response.statusCode).json(response);
      }
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
          SONG_CODES.GET_SONGS_FAILED,
          SONG_MESSAGES.GET_SONGS_FAILED
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
          PLAYLIST_CODES.NOT_FOUND,
          PLAYLIST_MESSAGES.NOT_FOUND
        );
      }
      const isSongAlreadyExistsInPlaylist =
        await PLaylistPreValidator.isSongExistInPlaylist(playlistId, songId);
      if (isSongAlreadyExistsInPlaylist) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          PLAYLIST_CODES.ADD_SONG_CONFLICT,
          PLAYLIST_MESSAGES.ADD_SONG_CONFLICT
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
      const response = new ApiResponse<IPlayListSong>(
        StatusCodes.CREATED,
        playlistWithSong,
        PLAYLIST_MESSAGES.ADD_SONG_SUCCESS
      );
      res.status(response.statusCode).json(response);
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
          StatusCodes.BAD_REQUEST,
          PLAYLIST_CODES.DELETION_FAILED,
          PLAYLIST_MESSAGES.GET_PLAYLIST_FAILED
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

      const response = new ApiResponse<IPlayList>(
        StatusCodes.OK,
        deletedPlaylist,
        PLAYLIST_MESSAGES.DELETE_PLAYLIST_SUCCESS
      );
      res.status(response.statusCode).json(response);
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
          PLAYLIST_CODES.NOT_FOUND,
          PLAYLIST_MESSAGES.NOT_FOUND
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
      const response = new ApiResponse<ISong[]>(
        StatusCodes.OK,
        getSongsFromPlaylist,
        PLAYLIST_MESSAGES.GET_SONGS_SUCCESS
      );
      res.status(response.statusCode).json(response);
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
          PLAYLIST_CODES.NOT_FOUND,
          PLAYLIST_MESSAGES.NOT_FOUND
        );
      }
      const songExistInPlaylist =
        await PLaylistPreValidator.isSongExistInPlaylist(playlistId, songId);

      if (!songExistInPlaylist) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          PLAYLIST_CODES.DELETION_FAILED,
          PLAYLIST_MESSAGES.GET_SONGS_FAILED
        );
      }
      const deletedSong = await PlaylistService.deleteSongFromPlaylist(
        playlistId,
        songId
      );
      if (!deletedSong) {
        throw new ApiError(
          StatusCodes.OK,
          PLAYLIST_CODES.DELETE_PLAYLIST_SONG,
          PLAYLIST_MESSAGES.DELETE_PLAYLIST_SONG_FAIL
        );
      }
      const response = new ApiResponse<IPlayListSong>(
        StatusCodes.OK,
        deletedSong,
        PLAYLIST_MESSAGES.DELETE_PLAYLIST_SONG_SUCCESS
      );
      res.status(response.statusCode).json(response);
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
          PLAYLIST_MESSAGES.NOT_FOUND
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
      const response = new ApiResponse<ISharedPlaylist>(
        StatusCodes.OK,
        sharedPlaylist,
        SHARED_PLAYLIST_MESSAGES.ADD_USER_TO_PLAYLIST_SUCCESS
      );
      res.status(response.statusCode).json(response);
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
      const response = new ApiResponse(
        StatusCodes.OK,
        sharedPlaylist,
        SHARED_PLAYLIST_MESSAGES.GET_SHARED_PLAYLIST_SUCCESS
      );

      res.status(response.statusCode).json(response);
    }
  );
}
