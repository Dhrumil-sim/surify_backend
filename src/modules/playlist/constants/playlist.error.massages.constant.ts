import {
  GLOBAL_ERROR_CODES,
  GLOBAL_SUCCESS_MESSAGES,
  GLOBAL_DELETE_MESSAGES,
} from '../../../constants/global.constants.js';

export const PLAYLIST_CODES = {
  // Playlist-specific error codes
  PLAYLIST_NOT_FOUND: 'PLAYLIST_NOT_FOUND',
  PLAYLIST_ALREADY_EXISTS: 'PLAYLIST_ALREADY_EXISTS',
  PLAYLIST_CREATION_FAILED: 'PLAYLIST_CREATION_FAILED',
  PLAYLIST_UPDATE_FAILED: 'PLAYLIST_UPDATE_FAILED',
  PLAYLIST_DELETION_FAILED: 'PLAYLIST_DELETION_FAILED',
  PLAYLIST_FETCH_FAILED: 'PLAYLIST_FETCH_FAILED',

  // Song-related codes
  SONG_NOT_FOUND: 'SONG_NOT_FOUND',
  SONG_ALREADY_IN_PLAYLIST: 'SONG_ALREADY_IN_PLAYLIST',
  SONG_NOT_IN_PLAYLIST: 'SONG_NOT_IN_PLAYLIST',
  ADD_SONG_FAILED: 'ADD_SONG_TO_PLAYLIST_FAILED',
  REMOVE_SONG_FAILED: 'REMOVE_SONG_FROM_PLAYLIST_FAILED',
  GET_SONGS_FAILED: 'GET_PLAYLIST_SONGS_FAILED',

  // Authorization codes
  UNAUTHORIZED: GLOBAL_ERROR_CODES.UNAUTHORIZED,
  UNAUTHORIZED_OPERATION: 'UNAUTHORIZED_OPERATION',

  // Validation codes
  INVALID_PLAYLIST_INPUT: GLOBAL_ERROR_CODES.VALIDATION_ERROR,
  INVALID_PLAYLIST_ID: 'INVALID_PLAYLIST_ID',
  INVALID_SONG_ID: 'INVALID_SONG_ID',

  // Sharing codes
  SHARING_FAILED: 'SHARING_FAILED',
  GET_SHARED_FAILED: 'GET_SHARED_PLAYLISTS_FAILED',
};

export const PLAYLIST_MESSAGES = {
  // Playlist-specific error messages
  PLAYLIST_NOT_FOUND: 'Playlist not found',
  PLAYLIST_ALREADY_EXISTS: 'Playlist with this title already exists for user',
  PLAYLIST_CREATION_FAILED: 'Failed to create the playlist',
  PLAYLIST_UPDATE_FAILED: 'Failed to update playlist',
  PLAYLIST_DELETION_FAILED: 'Failed to delete the playlist',
  PLAYLIST_FETCH_FAILED: 'Failed to fetch playlist data',

  // Song-related messages
  SONG_NOT_FOUND: 'Song not found',
  SONG_ALREADY_IN_PLAYLIST: 'Song is already present in playlist',
  SONG_NOT_IN_PLAYLIST: 'Song is not present in playlist',
  ADD_SONG_FAILED: 'Failed to add song to playlist',
  REMOVE_SONG_FAILED: 'Failed to remove song from playlist',
  GET_SONGS_FAILED: 'Failed to retrieve songs from playlist',

  // Authorization messages
  UNAUTHORIZED: 'You are not authorized to perform this operation',
  UNAUTHORIZED_OPERATION: 'You are not eligible to perform this operation',

  // Validation messages
  INVALID_PLAYLIST_INPUT: 'Invalid input for playlist',
  INVALID_PLAYLIST_ID: 'Invalid playlist ID provided',
  INVALID_SONG_ID: 'Invalid song ID provided',

  // Sharing messages
  SHARING_FAILED: 'Failed to share playlist',
  GET_SHARED_FAILED: 'Failed to retrieve shared playlists',

  // Success messages
  PLAYLIST_CREATED: GLOBAL_SUCCESS_MESSAGES.CREATED_SUCCESSFULLY,
  PLAYLIST_UPDATED: GLOBAL_SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
  PLAYLIST_DELETED: GLOBAL_DELETE_MESSAGES.PLAYLIST_DELETED,
  PLAYLIST_FETCHED: GLOBAL_SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
  PLAYLISTS_FETCHED: 'Playlists fetched successfully',
  ADD_SONG_SUCCESS: 'Song added successfully to playlist',
  REMOVE_SONG_SUCCESS: 'Song removed from playlist successfully',
  GET_SONGS_SUCCESS: 'Songs fetched successfully from playlist',
  UPDATE_SUCCESS: 'Playlist updated successfully',
};

export const SHARED_PLAYLIST_CODES = {
  ADD_USER_TO_PLAYLIST: 'ADD_USER_TO_PLAYLIST',
  ADD_USER_TO_PLAYLIST_FAILED: 'ADD_USER_TO_PLAYLIST_FAILED',
  GET_SHARED_PLAYLIST: 'GET_SHARED_PLAYLIST',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_USERS: 'CONFLICT_USERS',
  ALREADY_SHARED: 'ALREADY_SHARED',
};

export const SHARED_PLAYLIST_MESSAGES = {
  UNAUTHORIZED: 'You are not eligible to perform this operation',
  USER_NOT_FOUND: "User doesn't exist",
  CONFLICT_USERS: "User can't add themselves to playlist",
  ADD_USER_TO_PLAYLIST_FAILED: 'Unable to add user to playlist',
  ADD_USER_TO_PLAYLIST_SUCCESS: 'Playlist is shared with user',
  ALREADY_SHARED: 'Playlist is already shared with given user',
  GET_SHARED_PLAYLIST_SUCCESS: 'Shared playlist fetched successfully',
  GET_SHARED_PLAYLIST_FAILED: 'Shared playlist not found',
};
