import {
  GLOBAL_ERROR_CODES,
  GLOBAL_SUCCESS_MESSAGES,
  GLOBAL_DELETE_MESSAGES,
} from '../../../constants/global.constants.js';

export const SONG_CODES = {
  // Song-specific error codes
  SONG_NOT_FOUND: 'SONG_NOT_FOUND',
  SONG_ALREADY_EXISTS: 'SONG_ALREADY_EXISTS',
  SONG_CREATION_FAILED: 'SONG_CREATION_FAILED',
  SONG_UPDATE_FAILED: 'SONG_UPDATE_FAILED',
  SONG_DELETION_FAILED: 'SONG_DELETION_FAILED',
  SONG_FETCH_FAILED: 'SONG_FETCH_FAILED',

  // Artist-specific codes
  ARTIST_NOT_FOUND: 'ARTIST_NOT_FOUND',
  UNAUTHORIZED_ARTIST: 'UNAUTHORIZED_ARTIST',
  ONLY_ARTIST_CAN_PERFORM: 'ONLY_ARTIST_CAN_PERFORM',
  ONLY_ARTIST_CAN_UPDATE: 'ONLY_ARTIST_CAN_UPDATE',
  ONLY_ARTIST_CAN_DELETE: 'ONLY_ARTIST_CAN_DELETE',

  // File-related codes
  FILE_UPLOAD_FAILED: GLOBAL_ERROR_CODES.FILE_UPLOAD_FAILED,
  INVALID_AUDIO_FILE: 'INVALID_AUDIO_FILE',
  INVALID_COVER_IMAGE: 'INVALID_COVER_IMAGE',
  FILE_TOO_LARGE: GLOBAL_ERROR_CODES.FILE_TOO_LARGE,

  // Metadata codes
  METADATA_EXTRACTION_FAILED: 'METADATA_EXTRACTION_FAILED',
  INVALID_DURATION: 'INVALID_DURATION',

  // Validation codes
  INVALID_SONG_INPUT: GLOBAL_ERROR_CODES.VALIDATION_ERROR,
  INVALID_GENRE: 'INVALID_GENRE',
  INVALID_TITLE: 'INVALID_TITLE',
  INVALID_RELEASE_DATE: 'INVALID_RELEASE_DATE',

  // Search and filter codes
  NO_SONGS_FOUND: 'NO_SONGS_FOUND',
  NO_SONGS_IN_PAGE: 'NO_SONGS_IN_PAGE',
  SEARCH_FAILED: 'SEARCH_FAILED',
};

export const SONG_MESSAGES = {
  // Song-specific error messages
  SONG_NOT_FOUND: 'Song not found',
  SONG_ALREADY_EXISTS: 'Song with this title already exists for this artist',
  SONG_CREATION_FAILED: 'Failed to create song',
  SONG_UPDATE_FAILED: 'Failed to update song',
  SONG_DELETION_FAILED: 'Failed to delete song',
  SONG_FETCH_FAILED: 'Failed to fetch song data',

  // Artist-specific messages
  ARTIST_NOT_FOUND: 'Artist not found',
  UNAUTHORIZED_ARTIST:
    'You are not authorized to perform this operation on this song',
  ONLY_ARTIST_CAN_PERFORM: 'Only artists can perform this operation',
  ONLY_ARTIST_CAN_DELETE: 'Only artists can delete their own songs',
  ONLY_ARTIST_CAN_UPDATE: 'Only artists can update their own songs',

  // File-related messages
  FILE_UPLOAD_FAILED: 'Failed to upload song file',
  INVALID_AUDIO_FILE: 'Please provide a valid audio file (MP3, WAV, FLAC)',
  INVALID_COVER_IMAGE: 'Please provide a valid image file for cover picture',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',

  // Metadata messages
  METADATA_EXTRACTION_FAILED: 'Failed to extract metadata from audio file',
  INVALID_DURATION: 'Invalid song duration',

  // Validation messages
  INVALID_SONG_INPUT: 'Invalid song input provided',
  INVALID_GENRE: 'Please provide valid genre(s)',
  INVALID_TITLE: 'Song title must be between 1 and 100 characters',
  INVALID_RELEASE_DATE: 'Please provide a valid release date',

  // Search and filter messages
  NO_SONGS_FOUND: 'No songs found matching your criteria',
  NO_SONGS_IN_PAGE: 'No songs found in the requested page',
  SEARCH_FAILED: 'Failed to search songs',

  // Success messages
  SONG_CREATED: GLOBAL_SUCCESS_MESSAGES.CREATED_SUCCESSFULLY,
  SONG_UPDATED: GLOBAL_SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
  SONG_DELETED: GLOBAL_DELETE_MESSAGES.SONG_DELETED,
  SONG_FETCHED: GLOBAL_SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
  SONGS_FETCHED: 'Songs fetched successfully',
  SONGS_SEARCHED: 'Songs searched successfully',
  SONG_HISTORY_FETCHED: 'Song history fetched successfully',
  METADATA_EXTRACTED: 'Song metadata extracted successfully',
  FILE_UPLOADED: GLOBAL_SUCCESS_MESSAGES.FILE_UPLOADED_SUCCESSFULLY,
};

// Album-related codes for songs
export const ALBUM_SONG_CODES = {
  ALBUM_NOT_FOUND: 'ALBUM_NOT_FOUND',
  SONG_NOT_IN_ALBUM: 'SONG_NOT_IN_ALBUM',
  ALBUM_SONG_FETCH_FAILED: 'ALBUM_SONG_FETCH_FAILED',
};

export const ALBUM_SONG_MESSAGES = {
  ALBUM_NOT_FOUND: 'Album not found',
  SONG_NOT_IN_ALBUM: 'Song not found in this album',
  ALBUM_SONG_FETCH_FAILED: 'Failed to fetch songs from album',
  ALBUM_SONGS_FETCHED: 'Album songs fetched successfully',
};
