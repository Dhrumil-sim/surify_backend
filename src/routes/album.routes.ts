import { NextFunction, Router } from 'express';
import { verifyJWT } from '@userModule';
import { validateRequest } from '@middlewares';
import {
  uploadAlbum,
  albumSchema,
  AlbumController,
  AuthenticatedRequest,
} from '@albumModule';
import { Response } from 'express';
import { asyncHandler } from '@utils';
import { albumUpdateValidator, albumCreateValidator } from '@albumModule';

const router = Router();

// 🔹 Middleware to parse JSON fields before Joi and controller
const parseAlbumFields = async (req, res, next) => {
  try {
    if (req.body.songs && typeof req.body.songs === 'string') {
      req.body.songs = JSON.parse(req.body.songs);
    }
    if (req.body.genre && typeof req.body.genre === 'string') {
      req.body.genre = JSON.parse(req.body.genre);
    }
    next();
  } catch (err) {
    next(err);
  }
};
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
  asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.body.songs) {
        console.log(req.body);
        console.log(req.files);
        await albumUpdateValidator(req, res, next);
        return;
      }
      next();
    }
  ),
  // Joi-level validation],
  AlbumController.updateAlbum
);

router.get('/', verifyJWT, AlbumController.getArtistAlbums);
router.get('/get/allAlbums', verifyJWT, AlbumController.getAllAlbums);

export default router;
