import SongController from './controllers/song.controller.js';
import SongService from './services/song.service.js';
import SongMetaData from './utils/songMetadata.util.js';
import { songValidationSchema } from './validators/songValidator.util.js';
import { uploadSong } from './middlewares/songUpload.middleware';
import type { AuthenticatedRequest } from './controllers/song.controller.js';
import { SongFileHash } from './utils/songFilehash.util.js';
import { paginateQuery } from './utils/pagination.util.js';
import type {
  ISong,
  ISongHistory,
  ISongQuery,
} from './interfaces/song.types.interfaces.js';
export {
  SongController,
  SongMetaData,
  SongService,
  songValidationSchema,
  uploadSong,
  SongFileHash,
  ISong,
  AuthenticatedRequest,
  ISongHistory,
  ISongQuery,
  paginateQuery,
};
