import { NextFunction, Router } from 'express';
import { verifyJWT } from '@userModule';
import { validateRequest } from '@middlewares';
import {
  uploadAlbum,
  albumSchema,
  AlbumController,
  AuthenticatedRequest,
  AlbumService,
} from '@albumModule';
import { Response } from 'express';
import { asyncHandler } from '@utils';
import { albumUpdateValidator, albumCreateValidator } from '@albumModule';
import mongoose from 'mongoose';
import { SongService } from '@songModule';
import { albumUpdateSchema } from 'modules/album/utils/albumAndSongValidation';

const router = Router();

// 🔹 Middleware to parse JSON fields before Joi and controller
export const parseAlbumFields = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const albumId = new mongoose.Types.ObjectId(req.params.albumId);
    const originalSong = await SongService.getSongByAlbumId('' + albumId);
    const originalAlbum = await AlbumService.getAlbumById(albumId);
    console.log(originalAlbum);
    if (req.body.songs && typeof req.body.songs === 'string') {
      req.body.songs = JSON.parse(req.body.songs);
    } else {
      const simplifiedSongs = originalSong['genre'];

      req.body.songs = simplifiedSongs;
    }

    if (req.body.genre && typeof req.body.genre === 'string') {
      req.body.genre = JSON.parse(req.body.genre);
    } else {
      const originalGenre = originalAlbum['genre'];
      req.body.genre = originalGenre;
    }
    if (!req.files?.coverPicture) {
      req.body.coverPicture = originalAlbum['coverPicture'];
    }

    next(); // manually call next after all async ops
  }
);
router.post(
  '/create',
  verifyJWT,
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 },
    { name: 'songFiles', maxCount: 10 },
    { name: 'songCovers', maxCount: 10 },
  ]),
  parseAlbumFields,
  validateRequest(albumSchema), // Joi-level validation
  albumCreateValidator, // Our custom utility
  AlbumController.createAlbum
);

router.put(
  '/update/:albumId',
  verifyJWT,
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 },
    { name: 'songFiles', maxCount: 10 },
    { name: 'songCovers', maxCount: 10 },
  ]),

  parseAlbumFields,
  validateRequest(albumUpdateSchema),
  albumUpdateValidator,

  // Joi-level validation],
  AlbumController.updateAlbum
);

router.get('/', verifyJWT, AlbumController.getArtistAlbums);
router.get('/get/allAlbums', verifyJWT, AlbumController.getAllAlbums);
router.get('/album-by-id/:albumId', verifyJWT, AlbumController.getAlbumById);

export default router;
