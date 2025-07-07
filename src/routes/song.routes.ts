import { Router } from 'express';
import { validateRequest } from '@middlewares';
import {
  songValidationSchema,
  SongController,
  uploadSong,
  cleanupUploadedFiles,
} from '@songModule';
import { verifyJWT } from '@middlewares';
const router = Router();

router.post(
  '/create',
  verifyJWT,
  uploadSong.fields([
    { name: 'coverPicture', maxCount: 1 }, // Image field
    { name: 'filePath', maxCount: 1 }, // Audio field
  ]),
  cleanupUploadedFiles,
  validateRequest(songValidationSchema),
  SongController.createSong
);
router.put(
  '/update/:songId',
  verifyJWT,
  uploadSong.fields([
    { name: 'coverPicture', maxCount: 1 }, // Image field
    { name: 'filePath', maxCount: 1 }, // Audio field
  ]),
  cleanupUploadedFiles,
  validateRequest(songValidationSchema),
  SongController.updateSong
);
router.get('/:songId', verifyJWT, SongController.getSongById);
router.get('/', verifyJWT, SongController.getAllSong);
router.get('/artist/:artistId', verifyJWT, SongController.getSongsByArtistId);
router.delete('/:songId', verifyJWT, SongController.deleteSong);
router.get('/stream/:songId', SongController.streamSong);

export default router;
