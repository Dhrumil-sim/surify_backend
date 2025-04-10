import { ApiError, ApiResponse, asyncHandler } from '@utils';
import { Response } from 'express';
import { AuthenticatedRequest, IPlayListRequestPayload } from '@playlistModule';
import { StatusCodes } from 'http-status-codes';
import { PlaylistService } from '../services/playlist.service';
import { PLaylistPreValidator } from '../validators/createPlaylist.pre.validator';

export class PlaylistController {
  static createPlaylist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const requestBody = req.body as unknown as IPlayListRequestPayload;
      const userId = req?.user?._id;
      if (!requestBody) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'INVALID_DATA',
          'Invalid Data found'
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
            'CONFLICT_PLAYLIST',
            `Playlist is already created with given title ${requestBody['name']} for ${req.user?.username} `
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
}
