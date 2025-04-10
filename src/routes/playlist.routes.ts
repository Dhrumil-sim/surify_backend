import { validateRequest, verifyJWT } from '@middlewares';
import { createPlaylistSchema, PlaylistController } from '@playlistModule';
import { Router } from 'express';

const router = Router();

// create playlist

router.post(
  '/create',
  verifyJWT,
  validateRequest(createPlaylistSchema),
  PlaylistController.createPlaylist
);

// get all playlist
router.get('/');

// update playlist
router.patch('/:id');

// delete playlist
router.delete('/:id');

// add songs to playlist
router.post('/:id/songs');

// remove song from playlist
router.delete('/:id/songs/:songId');

// get songs in the playlist
router.get('/:id/songs');

// get shared playlist of the current user
router.get('/shared');
export default router;
