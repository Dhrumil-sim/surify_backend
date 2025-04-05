import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest.js';
import { albumSchema } from '../modules/album/utils/albumAndSongValidation.js';
import { uploadAlbum } from '../modules/album/middlewares/albumUpload.middleware.js';
import { verifyJWT } from '../middlewares/authHandler/auth.middleware.js';
import AlbumController from '../modules/album/album.controller.js';
import { ApiError } from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../modules/song/song.controller.js';

const router = Router();

// Middleware to handle the non-file data validation
const validateAlbumData = async (req, res, next) => {
  try {
    // Step 1: Parse and validate the songs data (non-file data)
    req.body.songs = JSON.parse(req.body.songs); // Convert string to JSON array

    // Validate the songs field after parsing
    if (!req.body.songs) {
      return next(
        new ApiError(StatusCodes.BAD_REQUEST, 'Songs data is required')
      );
    }

    // You can add more validation here if needed
    // E.g., validate that coverPicture and songs are not empty
    if (!req.body.coverPicture) {
      return next(
        new ApiError(StatusCodes.BAD_REQUEST, 'Album coverPicture is required')
      );
    }

    // Proceed to the next middleware (to handle file upload)
    next();
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

// Apply validation and file handling separately in the route
router.post(
  '/create',
  verifyJWT,
  validateAlbumData, // First validate non-file data
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 }, // Album Cover Image
    { name: 'songFiles', maxCount: 10 }, // Song Files (MP3, WAV, etc.)
    { name: 'songCovers', maxCount: 10 }, // Song Cover Images
  ]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // After file upload validation, you can now proceed with further logic
      req.body.coverPicture = req.files.coverPicture[0].path;

      // Additional validation if needed after files are uploaded
      if (
        !req.files.songFiles ||
        req.files.songFiles.length !== req.body.songs.length
      ) {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Mismatch between number of songs and song files'
          )
        );
      }

      // Proceed to the controller
      next();
    } catch (error) {
      return next(
        new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
      );
    }
  },
  validateRequest(albumSchema), // Validate the schema after file handling
  AlbumController.createAlbum
);

router.get('/', verifyJWT, AlbumController.getArtistAlbums);
export default router;
