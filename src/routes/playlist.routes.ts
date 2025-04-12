import { validateRequest, verifyJWT } from '@middlewares';
import { PlaylistController, updatePlaylistSchema } from '@playlistModule';
import {} from '@playlistModule/validators/playlist.joi.validator';
import { Router } from 'express';

const router = Router();

// create playlist

router.post(
  '/create',
  verifyJWT,

  PlaylistController.createPlaylist
);

// get all playlist
router.get('/', verifyJWT, PlaylistController.getPlaylist);

// update playlist
router.patch(
  '/:id',
  verifyJWT,
  validateRequest(updatePlaylistSchema),
  PlaylistController.updatePlaylist
);

// delete playlist
router.delete('/:id', verifyJWT, PlaylistController.deletePlaylist);

// add songs to playlist
router.post(
  '/:id/songs/:songId',
  verifyJWT,
  PlaylistController.addSongPlaylist
);

// remove song from playlist
router.delete(
  '/:id/songs/:songId',
  verifyJWT,
  PlaylistController.deleteSongFromThePlaylist
);

// get songs in the playlist
router.get('/:id/songs', verifyJWT, PlaylistController.getSongsFromPlaylist);

// get shared playlist of the current user
router.get('/shared');
export default router;
