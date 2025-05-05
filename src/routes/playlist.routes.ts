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

// Get all playlists
router.get('/', verifyJWT, PlaylistController.getPlaylist);

// Update a playlist
router.patch(
  '/:id',
  verifyJWT,
  validateRequest(updatePlaylistSchema),
  PlaylistController.updatePlaylist
);

// Delete a playlist
router.delete(
  '/:id',
  verifyJWT,
  deletePlaylistSchemaPreField,
  validateRequest(deletePlaylistSchema),
  PlaylistController.deletePlaylist
);

// Add a song to a playlist
router.post(
  '/:id/songs/:songId',
  verifyJWT,
  addSongToPlaylistSchemaPreField,
  validateRequest(addSongToPlaylistSchema),
  PlaylistController.addSongPlaylist
);

// Remove a song from a playlist
router.delete(
  '/:id/songs/:songId',
  verifyJWT,
  deleteSongToPlaylistSchemaPreField,
  validateRequest(deleteSongFromPlaylistSchema),
  PlaylistController.deleteSongFromThePlaylist
);

// Get songs in a playlist
router.get(
  '/:id/songs',
  verifyJWT,
  getSongFromPlaylistSchemaPreField,
  validateRequest(getSongsFromPlaylistSchema),
  PlaylistController.getSongsFromPlaylist
);

// get shared playlist of the current user
router.get('/shared');
export default router;
