import { Response } from 'express';
import { AlbumService } from './services/album.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../song/song.controller.js';

class AlbumController {
  static createAlbum = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { userId, role } = req.user; // Get the role and ID of the authenticated user
      if (role !== 'artist') {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          'Only artists can create an album'
        );
      }

      const { title, genre, songs } = req.body;

      const albumData = {
        title,
        genre,
        songs,
        coverPicture: req.files?.coverPicture?.[0]?.path,
        songFiles: req.files?.songFiles,
        songCovers: req.files?.songCovers,
        userId,
      };

      // Call the service to create album
      const newAlbum = await AlbumService.createAlbum(albumData);

      res.status(StatusCodes.CREATED).json({
        message: 'Album created successfully',
        album: newAlbum,
      });
    }
  );
}

export default AlbumController;
