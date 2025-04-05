import { Request, Response, NextFunction } from 'express';

import { ApiError } from '@utils';
import { SongService } from '@songModule';
import { StatusCodes } from 'http-status-codes';
import { Song } from '@models';
import { ISong } from '@songModule';
import { SongFileHash, SongMetaData } from '@songModule';
import { asyncHandler } from '@utils';
import { ApiResponse } from '@utils';
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
      const { role, _id: artistId } = req.user; // Extract user details
      const { title } = req.body;
      // Check if the user is an artist
      if (role !== 'artist') {
        return res
          .status(403)
          .json({ message: 'Access denied: Only artists can upload songs' });
      }
      const existingSong = await Song.find({ title: title, artist: artistId });

      if (existingSong.length > 0) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'SONG_ALREADY_EXIST',
          'Song with given title is already exist'
        );
      }
      // Add the artist ID to the request body
      req.body.artist = artistId;

      const coverFile = req.files?.coverPicture?.[0]?.path;
      const songFile = req.files?.filePath?.[0]?.path; // Get the song file path
      // Ensure the file exists before trying to get metadata
      if (!songFile) {
        return res.status(400).json({ message: 'No song file uploaded' });
      }
      const fileHash = await SongFileHash.fileHash(songFile);

      // Call the getMetadata function with path of songFile
      const songMetadata = await SongMetaData.getMetadata(songFile);
      const {
        format: { duration },
      } = songMetadata;
      const duplicate = await Song.findOne({
        fileHash: fileHash,
        artist: artistId,
        duration: duration,
      });
      if (duplicate) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'SONG_DUPLICATION',
          'Song file is already exists with the given file content'
        );
      }
      try {
        const { title, genre } = req.body;
        const genreArray = JSON.parse(genre);
        const releaseDate = new Date();

        const newSong = await SongService.createSong(
          artistId,
          title,
          genreArray,
          releaseDate,
          duration!,
          coverFile!,
          songFile,
          fileHash
        );

        // Proceed with song creation (e.g., saving to the database)
        res
          .status(201)
          .json({ message: 'Song created successfully', data: newSong });
      } catch (error) {
        return next(error);
      }
    }
  );

  static getAllSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const allSongs = await SongService.getAllSongs();

      if (!allSongs) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No music Founded');
      } else {
        res.status(200).json({
          allSongs,
        });
      }
    }
  );

  static getSongById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const songId = '' + req.params.songId;

      const song = await SongService.getSongById(songId);
      console.log(song);
      res.status(200).json({ song });
    }
  );

  static updateSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const { role, _id: artistId } = req.user;
      const songId = req.params.songId;
      // check for existing song
      const existingSong = await SongService.getSongById(songId);

      if (!existingSong) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Song not found');
      }
      if (role !== 'artist' && !existingSong.artist.equals(artistId)) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          'Only Artist can update their own song'
        );
      }
      // Handle updated files
      const updatedCoverPicture = req.files?.coverPicture?.[0]?.path;
      const updatedFilePath = req.files?.filePath?.[0]?.path;

      // Extract metadata if a new song file is uploaded
      let updatedDuration = existingSong.duration; // Default to existing duration
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

      console.log(updatedFields);

      try {
        // Update the song in the database
        const updatedSong = await SongService.updateSong(songId, updatedFields);

        res.status(200).json({
          message: 'Song updated successfully',
          data: updatedSong,
        });
      } catch (error) {
        return next(error);
      }
    }
  );

  // soft delete
  static deleteSong = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const songId = req.params.songId;
      const { role, id: artistId } = req.user;
      console.log('Artist id :', artistId);
      const song = await SongService.getSongById(songId);
      if (role !== 'artist' && !song.artist.equals(artistId)) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          'Only Artist can delete their own song'
        );
      }
      try {
        await SongService.deleteSong(songId);
        return res
          .status(200)
          .json(
            new ApiResponse(StatusCodes.OK, {}, 'Song Deleted Successfully')
          );
      } catch (error) {
        return next(error);
      }
    }
  );
}

export default SongController;
