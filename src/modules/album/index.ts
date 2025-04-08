import AlbumController from './controllers/album.controller.js';
import type { IAlbum } from './interfaces/album.type.interface.js';
import {
  saveFilesToDisk,
  uploadAlbum,
} from './middlewares/albumUpload.middleware.js';
import { AlbumService } from './services/album.service.js';
import {
  albumSchema,
  AlbumValidation,
} from './utils/albumAndSongValidation.js';
import type { AuthenticatedRequest } from '@songModule';
import {
  albumCreateValidator,
  albumUpdateValidator,
} from './utils/albumValidator.util.js';
export {
  IAlbum,
  AlbumService,
  AlbumValidation,
  AuthenticatedRequest,
  uploadAlbum,
  albumSchema,
  AlbumController,
  saveFilesToDisk,
  albumCreateValidator,
  albumUpdateValidator,
};
