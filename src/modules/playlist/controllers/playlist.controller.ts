import { ApiError, ApiResponse, asyncHandler } from '@utils';
import { Response } from 'express';
import {
  AuthenticatedRequest,
  GetPlaylistData,
  IPlayListRequestPayload,
  Playlist,
  PLaylistPreValidator,
  PlaylistService,
  updatePlaylistSchema,
} from '@playlistModule';
import {
  PLAYLIST_CODES,
  PLAYLIST_MESSAGES,
} from '@playlistModule/constants/playlist.error.massages.constant';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { validateRequest } from '@middlewares';
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
      const playlists = await PlaylistService.getPlaylist();

      if (playlists) {
        const total = await Playlist.countDocuments({});
        const response = new ApiResponse<GetPlaylistData>(
          StatusCodes.OK,
          { playlists, total },
          'Playlists are fetched successfully'
        );

        res.status(response.statusCode).json(response);
      } else {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          'PLAYLIST_NOT_FOUND',
          'playlist not found'
        );
      }
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
}
