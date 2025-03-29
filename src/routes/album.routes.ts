import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest.js';
import { albumSchema } from '../modules/album/utils/albumAndSongValidation.js';
import { uploadSong } from '../modules/song/middlewares/songUpload.middleware.js';
import { verifyJWT } from '../middlewares/authHandler/auth.middleware.js';
import AlbumController from '../modules/album/album.controller.js';
import { ApiError } from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../modules/song/song.controller.js';

const router = Router();

router.post(
  '/create',
  verifyJWT,
  uploadSong.fields([
    { name: 'coverPicture', maxCount: 1 }, // Image field
    { name: 'filePath', maxCount: 1 }, // Audio field
  ]),
  (req: AuthenticatedRequest, res, next) => {
    // Check if required files are missing
    if (!req.files || !req.files.coverPicture || !req.files.filePath) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Both coverPicture and filePath are required'
        )
      );
    }

    next(); // Proceed to the next middleware
  },
  validateRequest(albumSchema), // Now properly inside router.post()
  AlbumController.createAlbum // Now properly inside router.post()
);

export default router;
