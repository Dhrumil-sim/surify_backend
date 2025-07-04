import {
  GLOBAL_ERROR_CODES,
  GLOBAL_SUCCESS_MESSAGES,
  GLOBAL_DELETE_MESSAGES,
} from '../../../constants/global.constants.js';

export const ALBUM_CODES = {
  // Album-specific error codes
  ALBUM_NOT_FOUND: 'ALBUM_NOT_FOUND',
  ALBUM_ALREADY_EXISTS: 'ALBUM_ALREADY_EXISTS',
  ALBUM_CREATION_FAILED: 'ALBUM_CREATION_FAILED',
  ALBUM_UPDATE_FAILED: 'ALBUM_UPDATE_FAILED',
  ALBUM_DELETION_FAILED: 'ALBUM_DELETION_FAILED',
  ALBUM_FETCH_FAILED: 'ALBUM_FETCH_FAILED',

  // Artist-specific codes
  ARTIST_NOT_FOUND: 'ARTIST_NOT_FOUND',
  UNAUTHORIZED_ARTIST: 'UNAUTHORIZED_ARTIST',
  ONLY_ARTIST_CAN_PERFORM: 'ONLY_ARTIST_CAN_PERFORM',

  // File-related codes
  FILE_UPLOAD_FAILED: GLOBAL_ERROR_CODES.FILE_UPLOAD_FAILED,
  INVALID_COVER_IMAGE: 'INVALID_COVER_IMAGE',
  INVALID_SONG_FILES: 'INVALID_SONG_FILES',
  INVALID_SONG_COVERS: 'INVALID_SONG_COVERS',
  FILE_TOO_LARGE: GLOBAL_ERROR_CODES.FILE_TOO_LARGE,

  // Song-related codes
  SONGS_REQUIRED: 'SONGS_REQUIRED',
  INVALID_SONGS_DATA: 'INVALID_SONGS_DATA',
  SONG_CREATION_FAILED: 'SONG_CREATION_FAILED',

  // Validation codes
  INVALID_ALBUM_INPUT: GLOBAL_ERROR_CODES.VALIDATION_ERROR,
  INVALID_GENRE: 'INVALID_GENRE',
  INVALID_TITLE: 'INVALID_TITLE',
  INVALID_RELEASE_DATE: 'INVALID_RELEASE_DATE',
  INVALID_ALBUM_ID: 'INVALID_ALBUM_ID',

  // Search and filter codes
  NO_ALBUMS_FOUND: 'NO_ALBUMS_FOUND',
  NO_ALBUMS_IN_PAGE: 'NO_ALBUMS_IN_PAGE',
  SEARCH_FAILED: 'SEARCH_FAILED',
};

export const ALBUM_MESSAGES = {
  // Album-specific error messages
  ALBUM_NOT_FOUND: 'Album not found',
  ALBUM_ALREADY_EXISTS: 'Album with this title already exists for this artist',
  ALBUM_CREATION_FAILED: 'Failed to create album',
  ALBUM_UPDATE_FAILED: 'Failed to update album',
  ALBUM_DELETION_FAILED: 'Failed to delete album',
  ALBUM_FETCH_FAILED: 'Failed to fetch album data',

  // Artist-specific messages
  ARTIST_NOT_FOUND: 'Artist not found',
  UNAUTHORIZED_ARTIST:
    'You are not authorized to perform this operation on this album',
  ONLY_ARTIST_CAN_PERFORM: 'Only artists can perform this operation',
  ONLY_ARTIST_CAN_CREATE: 'Only artists can create albums',
  ONLY_ARTIST_CAN_DELETE: 'Only artists can delete their own albums',
  ONLY_ARTIST_CAN_UPDATE: 'Only artists can update their own albums',

  // File-related messages
  FILE_UPLOAD_FAILED: 'Failed to upload album files',
  INVALID_COVER_IMAGE: 'Please provide a valid image file for album cover',
  INVALID_SONG_FILES: 'Please provide valid audio files for songs',
  INVALID_SONG_COVERS: 'Please provide valid image files for song covers',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',

  // Song-related messages
  SONGS_REQUIRED: 'Songs data is required',
  INVALID_SONGS_DATA: 'Invalid songs data provided',
  SONG_CREATION_FAILED: 'Failed to create songs for album',

  // Validation messages
  INVALID_ALBUM_INPUT: 'Invalid album input provided',
  INVALID_GENRE: 'Please provide valid genre(s)',
  INVALID_TITLE: 'Album title must be between 1 and 100 characters',
  INVALID_RELEASE_DATE: 'Please provide a valid release date',
  INVALID_ALBUM_ID: 'The provided album ID is not valid',
  ALBUM_ID_NOT_FOUND: 'Album ID not found in request parameters',

  // Search and filter messages
  NO_ALBUMS_FOUND: 'No albums found matching your criteria',
  NO_ALBUMS_IN_PAGE: 'No albums found in the requested page',
  SEARCH_FAILED: 'Failed to search albums',
  NO_ALBUMS_BY_ARTIST: 'No albums found for this artist',

  // Success messages
  ALBUM_CREATED: GLOBAL_SUCCESS_MESSAGES.CREATED_SUCCESSFULLY,
  ALBUM_UPDATED: GLOBAL_SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
  ALBUM_DELETED: GLOBAL_DELETE_MESSAGES.ALBUM_DELETED,
  ALBUM_FETCHED: GLOBAL_SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
  ALBUMS_FETCHED: 'Albums fetched successfully',
  ALBUMS_SEARCHED: 'Albums searched successfully',
  ALBUM_SONGS_FETCHED: 'Album songs fetched successfully',
  FILE_UPLOADED: GLOBAL_SUCCESS_MESSAGES.FILE_UPLOADED_SUCCESSFULLY,
};
