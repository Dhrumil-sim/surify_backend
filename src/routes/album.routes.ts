import { Router } from 'express';
import { validateRequest } from '@middlewares';
import { albumSchema, uploadAlbum, AlbumController } from '@albumModule';
import { verifyJWT } from '@userModule';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '@songModule';

const router = Router();

router.post(
  '/create',
  verifyJWT,
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 }, // Album Cover Image
    { name: 'songFiles', maxCount: 10 }, // Song Files (MP3, WAV, etc.)
    { name: 'songCovers', maxCount: 10 }, // Song Cover Images
  ]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      req.body.songs = JSON.parse(req.body.songs); // Convert string to JSON array

      req.body.coverPicture = req.files.coverPicture[0].path;

      if (!req.body.songs) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, 'Songs data is required')
        );
      }

      next(); // Proceed to validation & controller
    } catch (error) {
      return next(
        new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
      );
    }
  },
  validateRequest(albumSchema),
  AlbumController.createAlbum
);
router.get('/', verifyJWT, AlbumController.getArtistAlbums);
export default router;
