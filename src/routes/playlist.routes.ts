import { validateRequest, verifyJWT } from '@middlewares';
import {
  addSongToPlaylistSchemaPreField,
  PlaylistController,
  updatePlaylistSchema,
} from '@playlistModule';
import {
  addSongToPlaylistSchema,
  addOrDeleteUserToSharedPlaylistSchema,
  deletePlaylistSchema,
  deleteSongFromPlaylistSchema,
  getSongsFromPlaylistSchema,
} from '@playlistModule/validators/playlist.joi.validator';
import {
  addOrDeleteUserToSharedPlaylistSchemaPreField,
  deletePlaylistSchemaPreField,
  deleteSongToPlaylistSchemaPreField,
  getSongFromPlaylistSchemaPreField,
} from '@playlistModule/validators/playlistFields.pre.validator';
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

// Get shared playlists
router.get('/shared', verifyJWT, PlaylistController.getSharedPlaylistsWithUser);

// Add a user to a shared playlist
router.post(
  '/:playlistId/shared-users/:userId',
  verifyJWT,
  addOrDeleteUserToSharedPlaylistSchemaPreField,
  validateRequest(addOrDeleteUserToSharedPlaylistSchema),
  PlaylistController.addUserToSharedPlaylist
);

router.delete(
  '/:playlistId/shared-users/:userId',
  verifyJWT,
  addOrDeleteUserToSharedPlaylistSchemaPreField,
  validateRequest(addOrDeleteUserToSharedPlaylistSchema)
);
export default router;
