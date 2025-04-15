import { validateRequest, verifyJWT } from '@middlewares';
import { PlaylistController, updatePlaylistSchema } from '@playlistModule';
import {} from '@playlistModule/validators/playlist.joi.validator';
import { Router } from 'express';

const router = Router();

// Create a new playlist
router.post('/', verifyJWT, PlaylistController.createPlaylist);

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
router.delete('/:id', verifyJWT, PlaylistController.deletePlaylist);

// Add a song to a playlist
router.post(
  '/:id/songs/:songId',
  verifyJWT,
  PlaylistController.addSongPlaylist
);

// Remove a song from a playlist
router.delete(
  '/:id/songs/:songId',
  verifyJWT,
  PlaylistController.deleteSongFromThePlaylist
);

// Get songs in a playlist
router.get('/:id/songs', verifyJWT, PlaylistController.getSongsFromPlaylist);

// Get shared playlists
router.get('/shared', verifyJWT);

// Add a user to a shared playlist
router.post(
  '/:playlistId/shared-users/:userId',
  verifyJWT,
  PlaylistController.addUserToSharedPlaylist
);
export default router;
