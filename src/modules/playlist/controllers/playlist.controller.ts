import { ApiError, ApiResponse, asyncHandler } from '@utils';
import { Response } from 'express';
import {
  AuthenticatedRequest,
  GetPlaylistData,
  IPlayListRequestPayload,
  Playlist,
  PLaylistPreValidator,
  PlaylistService,
} from '@playlistModule';
import {
  PLAYLIST_CODES,
  PLAYLIST_MESSAGES,
} from '@playlistModule/constants/playlist.error.massages.constant';
import { StatusCodes } from 'http-status-codes';
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
          await PLaylistPreValidator.isPlaylistExistByName(
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
}
