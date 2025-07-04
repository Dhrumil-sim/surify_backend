// Global Error Codes
export const GLOBAL_ERROR_CODES = {
  // Common Error Codes
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // CRUD Operation Error Codes
  CREATION_FAILED: 'CREATION_FAILED',
  UPDATE_FAILED: 'UPDATE_FAILED',
  DELETION_FAILED: 'DELETION_FAILED',
  FETCH_FAILED: 'FETCH_FAILED',

  // Authentication Error Codes
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',

  // File Upload Error Codes
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',

  // Resource Specific Error Codes
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_ACCESS_DENIED: 'RESOURCE_ACCESS_DENIED',
};

// Global Success Messages
export const GLOBAL_SUCCESS_MESSAGES = {
  // CRUD Operation Success Messages
  CREATED_SUCCESSFULLY: 'Resource created successfully',
  UPDATED_SUCCESSFULLY: 'Resource updated successfully',
  DELETED_SUCCESSFULLY: 'Resource deleted successfully',
  FETCHED_SUCCESSFULLY: 'Resource fetched successfully',

  // Authentication Success Messages
  LOGIN_SUCCESSFUL: 'User logged in successfully',
  LOGOUT_SUCCESSFUL: 'User logged out successfully',
  REGISTRATION_SUCCESSFUL: 'User registered successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',

  // File Upload Success Messages
  FILE_UPLOADED_SUCCESSFULLY: 'File uploaded successfully',

  // Generic Success Messages
  OPERATION_SUCCESSFUL: 'Operation completed successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
};

// Global Delete Messages
export const GLOBAL_DELETE_MESSAGES = {
  // Soft Delete Messages
  SOFT_DELETED: 'Resource has been soft deleted successfully',
  PERMANENTLY_DELETED: 'Resource has been permanently deleted',

  // Specific Resource Delete Messages
  USER_DELETED: 'User account deleted successfully',
  SONG_DELETED: 'Song deleted successfully',
  ALBUM_DELETED: 'Album deleted successfully',
  PLAYLIST_DELETED: 'Playlist deleted successfully',
  PLAYLIST_SONG_DELETED: 'Song removed from playlist successfully',

  // Bulk Delete Messages
  MULTIPLE_RESOURCES_DELETED: 'Multiple resources deleted successfully',
  ALL_RESOURCES_DELETED: 'All resources deleted successfully',
};

// HTTP Status Code Mappings
export const HTTP_STATUS_MESSAGES = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
};

// Resource Types for Dynamic Messages
export const RESOURCE_TYPES = {
  USER: 'user',
  SONG: 'song',
  ALBUM: 'album',
  PLAYLIST: 'playlist',
  PLAYLIST_SONG: 'playlist song',
  NOTIFICATION: 'notification',
  SESSION: 'session',
};

// Helper function to generate dynamic success messages
export const generateSuccessMessage = (
  operation: string,
  resourceType: string
): string => {
  const operations = {
    created: 'created successfully',
    updated: 'updated successfully',
    deleted: 'deleted successfully',
    fetched: 'fetched successfully',
    added: 'added successfully',
    removed: 'removed successfully',
  };

  return `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} ${operations[operation as keyof typeof operations] || 'operation completed successfully'}`;
};

// Helper function to generate dynamic error messages
export const generateErrorMessage = (
  operation: string,
  resourceType: string
): string => {
  const operations = {
    create: 'Failed to create',
    update: 'Failed to update',
    delete: 'Failed to delete',
    fetch: 'Failed to fetch',
    add: 'Failed to add',
    remove: 'Failed to remove',
  };

  return `${operations[operation as keyof typeof operations] || 'Failed to perform operation on'} ${resourceType}`;
};
