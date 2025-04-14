export const PLAYLIST_CODES = {
  NOT_FOUND: 'PLAYLIST_NOT_FOUND',
  INVALID_INPUT: 'INVALID_PLAYLIST_INPUT',
  CREATION_FAILED: 'PLAYLIST_CREATION_FAILED',
  DELETION_FAILED: 'PLAYLIST_DELETION_FAILED',
  DELETE_PLAYLIST_SONG: 'PLAYLIST_SONG_DELETE',
  ALREADY_EXISTS: 'CONFLICT_PLAYLIST',
  ADD_SONG_FAILED: 'ADD_SONG_TO_PLAYLIST_FAILED',
  ADD_SONG_CONFLICT: 'CONFLICT_SONG_PLAYLIST',
  REMOVE_SONG_FAILED: 'REMOVE_SONG_FROM_PLAYLIST_FAILED',
  UPDATE_FAILED: 'PLAYLIST_UPDATE_FAILED',
  GET_SONGS_FAILED: 'GET_PLAYLIST_SONGS_FAILED',
  GET_SHARED_FAILED: 'GET_SHARED_PLAYLISTS_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED_OPERATION',
};
export const PLAYLIST_MESSAGES = {
  NOT_FOUND: 'Playlist not found.',
  INVALID_INPUT: 'Invalid input for playlist.',
  CREATION_FAILED: 'Failed to create the playlist.',
  DELETION_FAILED: 'Failed to delete the playlist.',
  DELETE_PLAYLIST_SONG_SUCCESS: 'Song deleted from playlist successfully.',
  DELETE_PLAYLIST_SONG_FAIL: 'Song is not deleted from playlist',
  ALREADY_EXISTS: 'Playlist with title already exists for user',
  ADD_SONG_FAILED: 'Failed to add song to playlist.',
  ADD_SONG_CONFLICT: 'Song is already present into playlist',
  ADD_SONG_SUCCESS: 'Song added successfully to playlist',
  UNAUTHORIZED: 'You are not eligible to perform this operation',
  REMOVE_SONG_FAILED: 'Failed to remove song from playlist.',
  UPDATE_FAILED: 'Failed to update playlist.',
  UPDATE_SUCCESS: 'Playlist updated successfully.',
  GET_SONGS_FAILED: 'Failed to retrieve songs from playlist.',
  GET_SONGS_SUCCESS: 'Songs fetched successfully from playlist.',
  GET_PLAYLIST_FAILED: 'Playlist not exists',
  GET_SHARED_FAILED: 'Failed to retrieve shared playlists.',
  DELETE_PLAYLIST_SUCCESS: 'Playlist deleted successfully',
};
export const SONG_CODES = {
  GET_SONGS_FAILED: 'GET_SONG_FAILED',
};
export const SONG_MESSAGES = {
  GET_SONGS_FAILED: 'FAILED to retrieve songs,',
};

export const SHARED_PLAYLIST_CODES = {
  ADD_USER_TO_PLAYLIST: 'ADD_USER_TO_PLAYLIST',
  ADD_USER_TO_PLAYLIST_FAILED: 'ADD_USER_TO_PLAYLIST_FAILED',
};
export const SHARED_PLAYLIST_MESSAGES = {
  USER_NOT_FOUND: "User doesn't exists .",
  CONFLICT_USERS: "User can't add themselves to playlist",
  ADD_USER_TO_PLAYLIST_FAILED: 'Unable to add user to playlist',
  ADD_USER_TO_PLAYLIST_SUCCESS: 'Playlist is shared with user',
  ALREADY_SHARED: 'Playlist is already shared with given user',
};
