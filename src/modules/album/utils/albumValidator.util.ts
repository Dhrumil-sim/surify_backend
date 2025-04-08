import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@utils';
import { AlbumValidation, saveFilesToDisk } from '@albumModule';
import { AuthenticatedRequest } from '@songModule';

export const albumCreateValidator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, body, user } = req;

    if (!files?.coverPicture || !files?.songFiles) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required files');
    }

    // Preprocess fields
    const parsedSongs =
      typeof body.songs === 'string' ? JSON.parse(body.songs) : body.songs;
    const parsedGenre =
      typeof body.genre === 'string' ? JSON.parse(body.genre) : body.genre;

    const songFileNames = files.songFiles.map((f) => f.originalname);
    const songCoverNames = (files.songCovers || []).map((f) => f.originalname);
    const albumCoverName = files.coverPicture[0].originalname;

    const albumData = {
      title: body.title,
      genre: parsedGenre,
      songs: parsedSongs,
      coverPicture: albumCoverName,
      songFiles: songFileNames,
      songCovers: songCoverNames,
      userId: user._id,
    };

    // Validations
    AlbumValidation.validateRequiredFields(albumData);
    AlbumValidation.validateSongFileCoverMatch(
      parsedSongs,
      songFileNames,
      songCoverNames
    );

    for (const song of parsedSongs) {
      const isDuplicate = await AlbumValidation.isSongDuplicated(
        user._id,
        song.title
      );
      if (isDuplicate) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'SONG_ALREADY_EXIST',
          `Song "${song.title}" already exists.`
        );
      }
    }

    // Save files to disk only after all validations passed
    const savedSongPaths = saveFilesToDisk(files.songFiles, 'songFiles');
    const savedCoverPaths = saveFilesToDisk(
      files.songCovers || [],
      'songCovers'
    );
    const savedAlbumCover = saveFilesToDisk(
      files.coverPicture,
      'coverPicture'
    )[0];

    // Overwrite request body
    req.body = {
      ...req.body,
      songs: parsedSongs,
      genre: parsedGenre,
      songFiles: savedSongPaths,
      songCovers: savedCoverPaths,
      coverPicture: savedAlbumCover,
      userId: user._id,
    };

    next();
  } catch (err) {
    next(err);
  }
};
export const albumUpdateValidator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, user } = req;

    const savedAlbumCover = files?.coverPicture
      ? saveFilesToDisk(files.coverPicture, 'coverPicture')[0]
      : undefined;

    // Overwrite request body
    req.body = {
      ...req.body,

      coverPicture: savedAlbumCover,
      userId: user._id,
    };

    next();
  } catch (err) {
    next(err);
  }
};
