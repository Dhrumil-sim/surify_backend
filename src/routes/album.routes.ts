import { Router } from 'express';
import { verifyJWT } from '@userModule';
import { validateRequest } from '@middlewares';
import {
  uploadAlbum,
  albumSchema,
  AlbumController,
  AlbumFieldParser,
} from '@albumModule';
import { albumUpdateValidator, albumCreateValidator } from '@albumModule';
import { albumUpdateSchema } from 'modules/album/utils/albumAndSongValidation';

const router = Router();

router.post(
  '/create',
  verifyJWT,
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 },
    { name: 'songFiles', maxCount: 10 },
    { name: 'songCovers', maxCount: 10 },
  ]),
  AlbumFieldParser.createParseField,
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

  AlbumFieldParser.updateParseField,
  validateRequest(albumUpdateSchema),
  albumUpdateValidator,

  // Joi-level validation],
  AlbumController.updateAlbum
);

router.get('/', verifyJWT, AlbumController.getArtistAlbums);
router.get('/get/allAlbums', verifyJWT, AlbumController.getAllAlbums);
router.get('/album-by-id/:albumId', verifyJWT, AlbumController.getAlbumById);
router.delete('/:albumId', verifyJWT, AlbumController.deleteAlbum);

export default router;
