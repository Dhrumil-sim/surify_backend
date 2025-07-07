import { Router } from 'express';
import { verifyJWT } from '@userModule';
import { validateRequest } from '@middlewares';
import {
  uploadAlbum,
  albumSchema,
  AlbumController,
  saveFilesToDisk,
  AuthenticatedRequest,
} from '@albumModule';
import { Album, Song } from '@models';
import { asyncHandler, ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

const router = Router();

// Middleware to parse and validate form fields
const parseAlbumFields = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    // Defensive parse for songs
    if (!req.body.songs || req.body.songs === 'undefined') {
      throw new ApiError(400, 'Songs data is required and must be valid JSON');
    }
    try {
      req.body.songs = JSON.parse(req.body.songs);
    } catch {
      throw new ApiError(400, 'Songs field must be valid JSON');
    }
    // Defensive parse for genre if needed
    if (typeof req.body.genre === 'string') {
      try {
        req.body.genre = JSON.parse(req.body.genre);
      } catch {
        req.body.genre = [req.body.genre];
      }
    }
    // Defensive check for language
    if (!req.body.language) {
      throw new ApiError(400, 'Language is required');
    }
    next();
  }
);

// Middleware to track files for cleanup
const trackAlbumFiles = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    // For memory storage, files don't have paths yet, so we'll track them after saving
    req['cleanupFiles'] = [];
    next();
  }
);

// Middleware to save files to disk after validation
const saveAlbumFiles = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    // Debug log to verify files
    console.log(req.file);
    const savedPaths = [];
    if (req.files) {
      if (
        Array.isArray(req.files.coverPicture) &&
        req.files.coverPicture.length > 0
      ) {
        const coverPaths = saveFilesToDisk(
          req.files.coverPicture,
          'coverPicture'
        );
        req.body.coverPicture = coverPaths[0];
        savedPaths.push(...coverPaths);
      }
      if (
        Array.isArray(req.files.songFiles) &&
        req.files.songFiles.length > 0
      ) {
        const songPaths = saveFilesToDisk(req.files.songFiles, 'songFiles');
        req.body.songFiles = songPaths;
        savedPaths.push(...songPaths);
      }
      if (
        Array.isArray(req.files.songCovers) &&
        req.files.songCovers.length > 0
      ) {
        const coverPaths = saveFilesToDisk(req.files.songCovers, 'songCovers');
        req.body.songCovers = coverPaths;
        savedPaths.push(...coverPaths);
      }
    }
    req['cleanupFiles'] = savedPaths;
    next();
  }
);

router.post(
  '/create',
  verifyJWT,
  uploadAlbum.fields([
    { name: 'coverPicture', maxCount: 1 },
    { name: 'songFiles', maxCount: 10 },
    { name: 'songCovers', maxCount: 10 },
  ]),
  trackAlbumFiles, // Track files for cleanup
  parseAlbumFields,
  validateRequest(albumSchema),
  saveAlbumFiles, // Save files after validation
  AlbumController.createAlbum
);
router.get('/', verifyJWT, AlbumController.getArtistAlbums);
router.get('/get/allAlbums', verifyJWT, AlbumController.getAllAlbums);
router.get('/album-by-id/:albumId', verifyJWT, AlbumController.getAlbumById);
router.delete('/:albumId', verifyJWT, AlbumController.deleteAlbum);
router.delete(
  '/:albumId/song/:songId',
  verifyJWT,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { albumId, songId } = req.params;
    const userId = req.user._id;
    const album = await Album.findById(albumId);
    if (!album) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Album not found');
    }
    if (album.artist.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Unauthorized');
    }
    // Remove songId from album.songs
    album.songs = album.songs.filter((id) => id.toString() !== songId);
    await album.save();
    // Set song's album field to null
    await Song.findByIdAndUpdate(songId, { album: null });
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Song removed from album' });
  })
);

export default router;
