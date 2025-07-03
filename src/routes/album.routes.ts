import { Router } from 'express';
import { verifyJWT } from '@userModule';
import { validateRequest } from '@middlewares';
import {
  uploadAlbum,
  albumSchema,
  AlbumController,
  AuthenticatedRequest,
} from '@albumModule';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@utils';

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
router.get('/get/allAlbums', verifyJWT, AlbumController.getAllAlbums);
router.get('/album-by-id/:albumId', verifyJWT, AlbumController.getAlbumById);
router.delete('/:albumId', verifyJWT, AlbumController.deleteAlbum);

export default router;
