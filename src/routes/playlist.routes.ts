import { validateRequest, verifyJWT } from '@middlewares';
import { PlaylistController, updatePlaylistSchema } from '@playlistModule';
import {
  addSongToPlaylistSchema,
  deletePlaylistSchema,
  deleteSongFromPlaylistSchema,
  getSongsFromPlaylistSchema,
  sharePlaylistSchema,
  removeUserFromSharedPlaylistSchema,
  getUsersWithPlaylistAccessSchema,
} from '@playlistModule/validators/playlist.joi.validator';
import {
  addSongToPlaylistSchemaPreField,
  deletePlaylistSchemaPreField,
  deleteSongToPlaylistSchemaPreField,
  getSongFromPlaylistSchemaPreField,
  sharePlaylistSchemaPreField,
  removeUserFromSharedPlaylistSchemaPreField,
  getUsersWithPlaylistAccessSchemaPreField,
} from '@playlistModule/validators/playlistFields.pre.validator';
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
router.get('/shared', verifyJWT, PlaylistController.getSharedPlaylistsWithUser);

// Share playlist with user
router.post(
  '/:playlistId/share/:userId',
  verifyJWT,
  sharePlaylistSchemaPreField,
  validateRequest(sharePlaylistSchema),
  PlaylistController.addUserToSharedPlaylist
);

// Remove user from shared playlist
router.delete(
  '/:playlistId/share/:userId',
  verifyJWT,
  removeUserFromSharedPlaylistSchemaPreField,
  validateRequest(removeUserFromSharedPlaylistSchema),
  PlaylistController.removeUserFromSharedPlaylist
);

// Get users with access to playlist
router.get(
  '/:playlistId/share',
  verifyJWT,
  getUsersWithPlaylistAccessSchemaPreField,
  validateRequest(getUsersWithPlaylistAccessSchema),
  PlaylistController.getUsersWithPlaylistAccess
);

export default router;
