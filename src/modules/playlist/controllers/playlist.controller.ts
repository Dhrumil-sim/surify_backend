import { ApiError, ApiResponse, asyncHandler } from '@utils';
import { Response } from 'express';
import {
  AuthenticatedRequest,
  GetPlaylistData,
  IPlayList,
  IPlayListRequestPayload,
  IPlayListSong,
  PaginationQuery,
  PLaylistPreValidator,
  PlaylistService,
  updatePlaylistSchema,
} from '@playlistModule';
import {
  PLAYLIST_CODES,
  PLAYLIST_MESSAGES,
  SONG_CODES,
  SONG_MESSAGES,
} from '@playlistModule/constants/playlist.error.massages.constant';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { validateRequest } from '@middlewares';
import { ISong, SongService } from '@songModule';
import { addSongToPlaylistSchema } from '@playlistModule/validators/playlist.joi.validator';
export class PlaylistController {
  static createPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const requestBody = req.body as unknown as IPlayListRequestPayload;
      const userId = req?.user?._id;
      if (!requestBody) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          PLAYLIST_CODES.INVALID_INPUT,
          PLAYLIST_MESSAGES.INVALID_INPUT
        );
      } else {
        const isPlaylistExistByName =
          await PLaylistPreValidator.isPlaylistExist(
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
        if (newPlaylist) {
          const response = new ApiResponse(
            StatusCodes.CREATED,
            newPlaylist,
            'Playlist is created'
          );
          res.status(response.statusCode).json(response);
        } else {
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'PLAYLIST_IS_NOT_CREATED',
            'there might be some issue while creating playlist'
          );
        }
      }
    }
  );

  static getPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const query: PaginationQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        search: req.query.search as string,
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
        '',
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
        if (updatedPlaylist) {
          const response = new ApiResponse(
            StatusCodes.OK,
            updatedPlaylist,
            PLAYLIST_MESSAGES.UPDATE_SUCCESS
          );
          res.status(response.statusCode).json(response);
        }
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
        '',
        '',
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
      if (playlistWithSong) {
        const response = new ApiResponse<IPlayListSong>(
          StatusCodes.CREATED,
          playlistWithSong,
          PLAYLIST_MESSAGES.ADD_SONG_SUCCESS
        );
        res.status(response.statusCode).json(response);
      } else {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          PLAYLIST_CODES.ADD_SONG_FAILED,
          PLAYLIST_MESSAGES.ADD_SONG_FAILED
        );
      }
    }
  );

  static deletePlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const playlistId = new mongoose.Types.ObjectId(req?.params?.id);
      const userId = new mongoose.Types.ObjectId(req?.user?._id);
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

      if (!playlistId.equals(isValidUser?._id)) {
        throw new ApiError(
          StatusCodes.OK,
          PLAYLIST_CODES.DELETION_FAILED,
          PLAYLIST_MESSAGES.DELETION_FAILED
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
        '',
        '',
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
}
