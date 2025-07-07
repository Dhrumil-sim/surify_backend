import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ISong, SongService } from '@songModule';
import { SongMetaData } from '@songModule';
import { ApiError, asyncHandler, ResponseHandler } from '@utils';
import { ApiResponse } from '@utils';
import {
  SONG_CODES,
  SONG_MESSAGES,
} from '../constants/song.error.massages.constant';
import { AudioStreamingUtil, StreamingRequest } from '../utils/streaming.utils';
export interface AuthenticatedRequest extends Request {
  cookies: { accessToken?: string; refreshToken?: string }; // Define cookies with accessToken
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  files: {
    coverPicture?: Express.Multer.File[]; // Array of image files
    filePath?: Express.Multer.File[]; // Array of audio files (filePath as array of files)
    songCovers?: Express.Multer.File[];
    songFiles?: Express.Multer.File[];
  };
}

class SongController {
  static createSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const { role, _id: artistId } = req.user;
      if (role !== 'artist') {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          SONG_CODES.ONLY_ARTIST_CAN_PERFORM,
          SONG_MESSAGES.ONLY_ARTIST_CAN_PERFORM
        );
      }

      try {
        // Extract song data from request
        const { title, genre, language } = req.body;
        const coverFile = req.files?.coverPicture?.[0]?.path;
        const songFile = req.files?.filePath?.[0]?.path;

        if (!songFile) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            SONG_CODES.FILE_UPLOAD_FAILED,
            SONG_MESSAGES.FILE_UPLOAD_FAILED
          );
        }

        // Extract metadata for duration
        const songMetadata = await SongMetaData.getMetadata(songFile);
        const duration = songMetadata.format?.duration || 0;

        const newSong = await SongService.createSong(
          artistId,
          title,
          JSON.parse(genre),
          language,
          new Date(),
          duration,
          coverFile || '',
          songFile
        );

        return ResponseHandler.created(
          res,
          newSong,
          SONG_MESSAGES.SONG_CREATED
        );
      } catch (error) {
        return next(error);
      }
    }
  );

  static getSongsByArtistId = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const artistId = req.params.artistId;
      const { title, genre, sortBy, page, limit } = req.query;

      const filters = {
        title: title?.toString(),
        genre: genre?.toString(),
        artist: artistId,
        sortBy: sortBy?.toString(),
        page: page ? parseInt(page.toString()) : undefined,
        limit: limit ? parseInt(limit.toString()) : undefined,
      };

      const {
        data,
        total,
        page: currentPage,
        limit: pageSize,
      } = await SongService.getAllSongs(filters);

      if (total === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.NO_SONGS_FOUND,
          SONG_MESSAGES.NO_SONGS_FOUND
        );
      } else if (data.length === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.NO_SONGS_IN_PAGE,
          SONG_MESSAGES.NO_SONGS_IN_PAGE
        );
      }

      return ResponseHandler.paginated(
        res,
        data,
        total,
        currentPage,
        pageSize,
        'Songs fetched by artist successfully'
      );
    }
  );

  static getAllSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { title, genre, artist, sortBy, page, limit } = req.query;

      const filters = {
        title: title?.toString(),
        genre: genre?.toString(),
        artist: artist?.toString(),
        sortBy: sortBy?.toString(),
        page: page ? parseInt(page.toString()) : undefined,
        limit: limit ? parseInt(limit.toString()) : undefined,
      };

      const {
        data,
        total,
        page: currentPage,
        limit: pageSize,
      } = await SongService.getAllSongs(filters);

      if (!total) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.NO_SONGS_FOUND,
          SONG_MESSAGES.NO_SONGS_FOUND
        );
      } else if (!data.length) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.NO_SONGS_IN_PAGE,
          SONG_MESSAGES.NO_SONGS_IN_PAGE
        );
      } else {
        const response = new ApiResponse(
          StatusCodes.OK,
          { songs: data, total, page: currentPage, limit: pageSize },
          'Songs are searched!'
        );
        res.status(response.statusCode).json(response);
      }
    }
  );

  static getSongById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const songId = req.params.songId;
      const song = await SongService.getSongById(songId);

      if (!song) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.SONG_NOT_FOUND,
          SONG_MESSAGES.SONG_NOT_FOUND
        );
      }

      return ResponseHandler.success(res, song, SONG_MESSAGES.SONG_FETCHED);
    }
  );

  static getSongByAlbumId = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const albumId = req.params.albumId;
      const songs = await SongService.getSongByAlbumId(albumId);

      if (!songs || songs.length === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.NO_SONGS_FOUND,
          'No songs found in this album'
        );
      }

      return ResponseHandler.success(
        res,
        songs,
        'Album songs fetched successfully'
      );
    }
  );

  static updateSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const { role, _id: artistId } = req.user;
      const songId = req.params.songId;

      const existingSong = await SongService.getSongById(songId);
      if (!existingSong) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.SONG_NOT_FOUND,
          SONG_MESSAGES.SONG_NOT_FOUND
        );
      }

      if (role !== 'artist' && !existingSong.artist.equals(artistId)) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          SONG_CODES.ONLY_ARTIST_CAN_UPDATE,
          SONG_MESSAGES.ONLY_ARTIST_CAN_UPDATE
        );
      }

      // Handle updated files
      const updatedCoverPicture = req.files?.coverPicture?.[0]?.path;
      const updatedFilePath = req.files?.filePath?.[0]?.path;

      // Extract metadata if a new song file is uploaded
      let updatedDuration = existingSong.duration;
      if (updatedFilePath) {
        const songMetadata = await SongMetaData.getMetadata(updatedFilePath);
        updatedDuration =
          songMetadata.format?.duration ?? existingSong.duration;
      }

      const { title, genre } = req.body;
      const updatedFields: Partial<ISong> = {
        title: title || existingSong.title,
        genre: genre ? JSON.parse(genre) : existingSong.genre,
        coverPicture: updatedCoverPicture || existingSong.coverPicture,
        filePath: updatedFilePath || existingSong.filePath,
        duration: updatedDuration,
      };

      try {
        const updatedSong = await SongService.updateSong(songId, updatedFields);
        return ResponseHandler.success(
          res,
          updatedSong,
          SONG_MESSAGES.SONG_UPDATED
        );
      } catch (error) {
        return next(error);
      }
    }
  );

  static deleteSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const songId = req.params.songId;
      const { role, _id: artistId } = req.user;

      const song = await SongService.getSongById(songId);
      if (!song) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SONG_CODES.SONG_NOT_FOUND,
          SONG_MESSAGES.SONG_NOT_FOUND
        );
      }

      if (role !== 'artist' && !song.artist.equals(artistId)) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          SONG_CODES.ONLY_ARTIST_CAN_DELETE,
          SONG_MESSAGES.ONLY_ARTIST_CAN_DELETE
        );
      }

      try {
        await SongService.deleteSong(songId);
        return ResponseHandler.deleted(res, null, SONG_MESSAGES.SONG_DELETED);
      } catch (error) {
        return next(error);
      }
    }
  );

  static streamSong = asyncHandler(
    async (req: StreamingRequest, res: Response, next: NextFunction) => {
      try {
        const { songId } = req.params;

        // Validate song ID
        if (!songId) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Song ID is required');
        }

        // Get song from database
        const song = await SongService.getSongById(songId);

        if (!song) {
          throw new ApiError(StatusCodes.NOT_FOUND, 'Song not found');
        }

        // Check if file path exists
        if (!song.filePath) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Audio file path not found'
          );
        }

        // Validate audio format
        if (!AudioStreamingUtil.isSupportedAudioFormat(song.filePath)) {
          throw new ApiError(
            StatusCodes.UNSUPPORTED_MEDIA_TYPE,
            'Unsupported audio format'
          );
        }

        // Log streaming activity (optional - for analytics)

        // Stream the audio file
        await AudioStreamingUtil.streamAudio(song.filePath, req, res);
      } catch (error) {
        console.error('Streaming error:', error);
        return next(error);
      }
    }
  );

  /**
   * Get streaming metadata for a song
   * Returns file information without streaming the actual audio
   */
  static getStreamingMetadata = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { songId } = req.params;

      if (!songId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Song ID is required');
      }

      // Get song from database
      const song = await SongService.getSongById(songId);

      if (!song) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Song not found');
      }

      // Get file metadata
      const metadata = await AudioStreamingUtil.getStreamingMetadata(
        song.filePath
      );

      res.status(200).json({
        success: true,
        data: {
          songId: song._id,
          title: song.title,
          artist: song.artist,
          duration: song.duration,
          fileMetadata: metadata,
          streamingUrl: `/api/songs/stream/${songId}`,
        },
        message: 'Streaming metadata retrieved successfully',
      });
    }
  );
}

export default SongController;
