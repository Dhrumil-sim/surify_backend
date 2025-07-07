import {
  GLOBAL_ERROR_CODES,
  GLOBAL_SUCCESS_MESSAGES,
  GLOBAL_DELETE_MESSAGES,
} from '../../../constants/global.constants.js';

export const USER_CODES = {
  // User-specific error codes
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  USER_UPDATE_FAILED: 'USER_UPDATE_FAILED',
  USER_DELETION_FAILED: 'USER_DELETION_FAILED',
  USER_FETCH_FAILED: 'USER_FETCH_FAILED',

  // Authentication specific codes
  INVALID_CREDENTIALS: GLOBAL_ERROR_CODES.INVALID_CREDENTIALS,
  TOKEN_EXPIRED: GLOBAL_ERROR_CODES.TOKEN_EXPIRED,
  TOKEN_INVALID: GLOBAL_ERROR_CODES.TOKEN_INVALID,
  UNAUTHORIZED: GLOBAL_ERROR_CODES.UNAUTHORIZED,

  // Profile specific codes
  PROFILE_UPDATE_FAILED: 'PROFILE_UPDATE_FAILED',
  PASSWORD_UPDATE_FAILED: 'PASSWORD_UPDATE_FAILED',
  PROFILE_PICTURE_UPLOAD_FAILED: 'PROFILE_PICTURE_UPLOAD_FAILED',

  // Validation codes
  INVALID_USER_INPUT: GLOBAL_ERROR_CODES.VALIDATION_ERROR,
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  INVALID_USERNAME_FORMAT: 'INVALID_USERNAME_FORMAT',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
};

export const USER_MESSAGES = {
  // User-specific error messages
  USER_NOT_FOUND: 'User not found or not registered',
  USER_ALREADY_EXISTS: 'User with this email or username already exists',
  USER_CREATION_FAILED: 'Failed to create user account',
  USER_UPDATE_FAILED: 'Failed to update user profile',
  USER_DELETION_FAILED: 'Failed to delete user account',
  USER_FETCH_FAILED: 'Failed to fetch user data',

  // Authentication messages
  INVALID_CREDENTIALS: 'Invalid email/username or password',
  TOKEN_EXPIRED: 'Access token has expired',
  TOKEN_INVALID: 'Invalid or malformed token',
  UNAUTHORIZED: 'You are not authorized to perform this operation',

  // Profile messages
  PROFILE_UPDATE_FAILED: 'Failed to update user profile',
  PASSWORD_UPDATE_FAILED: 'Failed to update password',
  PROFILE_PICTURE_UPLOAD_FAILED: 'Failed to upload profile picture',

  // Validation messages
  INVALID_USER_INPUT: 'Invalid user input provided',
  INVALID_EMAIL_FORMAT: 'Please provide a valid email address',
  INVALID_USERNAME_FORMAT:
    'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  WEAK_PASSWORD:
    'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',

  // Success messages
  USER_CREATED: GLOBAL_SUCCESS_MESSAGES.CREATED_SUCCESSFULLY,
  USER_UPDATED: GLOBAL_SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
  USER_DELETED: GLOBAL_DELETE_MESSAGES.USER_DELETED,
  USER_FETCHED: GLOBAL_SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
  LOGIN_SUCCESSFUL: GLOBAL_SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
  LOGOUT_SUCCESSFUL: GLOBAL_SUCCESS_MESSAGES.LOGOUT_SUCCESSFUL,
  REGISTRATION_SUCCESSFUL: GLOBAL_SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL,
  TOKEN_REFRESHED: GLOBAL_SUCCESS_MESSAGES.TOKEN_REFRESHED,
  PROFILE_UPDATED: 'User profile updated successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  PROFILE_PICTURE_UPLOADED: 'Profile picture uploaded successfully',
};

// Legacy support - keeping these for backward compatibility
export const SONG_CODES = {
  GET_SONGS_FAILED: 'GET_SONG_FAILED',
};

export const SONG_MESSAGES = {
  GET_SONGS_FAILED: 'Failed to retrieve songs',
};
