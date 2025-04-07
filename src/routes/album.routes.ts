import { Router } from 'express';
import { verifyJWT } from '@userModule';
import { validateRequest } from '@middlewares';
import { uploadAlbum, albumSchema, AlbumController } from '@albumModule';
import { albumCreateValidator } from '@utils';

const router = Router();

router.post(
  '/create',
  verifyJWT,
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 },
    { name: 'songFiles', maxCount: 10 },
    { name: 'songCovers', maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      // Lightweight parse step just for schema validation
      req.body.songs = JSON.parse(req.body.songs);
      req.body.genre = JSON.parse(req.body.genre);
      next();
    } catch (err) {
      next(err);
    }
  },
  validateRequest(albumSchema), // Joi-level validation
  albumCreateValidator, // Our custom utility
  AlbumController.createAlbum
);

router.get('/', verifyJWT, AlbumController.getArtistAlbums);
router.get('/get/allAlbums', verifyJWT, AlbumController.getAllAlbums);
export default router;
