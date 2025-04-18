import Joi from 'joi';
import { ApiError, asyncHandler } from '@utils';
import { StatusCodes } from 'http-status-codes';

import { AuthenticatedRequest } from '@albumModule';
import { NextFunction, Response } from 'express';
import { IAlbum } from '@albumModule';
import { ISong } from '@songModule';
import { Song } from '@models';

// Album validation schema
export const albumSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': `"title" should be a string`,
    'string.min': `"title" must be at least 3 characters`,
    'string.max': `"title" must be at most 100 characters`,
    'any.required': `"title" is required`,
  }),

  genre: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()).min(1),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error();
          return parsed;
        } catch {
          return helpers.error('string.invalid');
        }
      })
    )
    .required()
    .messages({
      'array.base': `"genre" should be an array`,
      'array.min': `"genre" must contain at least one item`,
      'any.required': `"genre" is required`,
      'string.invalid': `"genre" must be a valid JSON array`,
    }),

  songs: Joi.array()
    .items(
      Joi.object({
        artist: Joi.string().hex().length(24).optional().messages({
          'string.base': `"artist" should be a string`,
          'string.hex': `"artist" must be a valid ObjectId`,
        }),

        title: Joi.string().trim().required().messages({
          'string.base': `"title" should be a string`,
          'string.trim': `"title" should not have leading or trailing spaces`,
          'any.required': `"title" is required`,
        }),

        album: Joi.string().hex().length(24).allow(null).optional().messages({
          'string.base': `"album" should be a string`,
          'string.hex': `"album" must be a valid ObjectId`,
        }),

        genre: Joi.alternatives()
          .try(
            Joi.array().items(Joi.string()).min(1),
            Joi.string().custom((value, helpers) => {
              try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) throw new Error();
                return parsed;
              } catch {
                return helpers.error('string.invalid');
              }
            })
          )
          .required()
          .messages({
            'array.base': `"genre" should be an array`,
            'array.min': `"genre" must contain at least one item`,
            'any.required': `"genre" is required`,
            'string.invalid': `"genre" must be a valid JSON array`,
          }),
      })
    )
    .min(1)
    .required()
    .custom((value, helpers) => {
      const seenTitles = new Set();
      for (const song of value) {
        if (seenTitles.has(song.title)) {
          return helpers.error('array.duplicateTitle', {
            title: song.title,
          });
        }
        seenTitles.add(song.title);
      }
      return value;
    })
    .messages({
      'array.base': `"songs" should be an array`,
      'array.min': `"songs" must contain at least one song`,
      'any.required': `"songs" is required`,
      'array.uniqueTitle': `"songs" contains duplicate title: '{#title}'`,
    }),
});

export const albumUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),

  genre: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()).min(1),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error();
          return parsed;
        } catch {
          return helpers.error('string.invalid');
        }
      })
    )
    .optional()
    .messages({
      'array.base': `"genre" should be an array`,
      'array.min': `"genre" must contain at least one item`,
      'string.invalid': `"genre" must be a valid JSON array`,
    }),

  songs: Joi.array().items(
    Joi.object({
      _id: Joi.string().hex().length(24).optional().messages({
        'string.hex': `"songId" must be a valid ObjectId`,
      }),

      artist: Joi.string().hex().length(24).optional().messages({
        'string.hex': `"artist" must be a valid ObjectId`,
      }),

      title: Joi.string().trim().required().messages({
        'any.required': `"title" is required`,
        'string.trim': `"title" should not have leading or trailing spaces`,
      }),

      album: Joi.string().hex().length(24).allow(null).optional().messages({
        'string.hex': `"album" must be a valid ObjectId`,
      }),

      genre: Joi.alternatives()
        .try(
          Joi.array().items(Joi.string()).min(1),
          Joi.string().custom((value, helpers) => {
            try {
              const parsed = JSON.parse(value);
              if (!Array.isArray(parsed)) throw new Error();
              return parsed;
            } catch {
              return helpers.error('string.invalid');
            }
          })
        )
        .required()
        .messages({
          'array.min': `"genre" must contain at least one item`,
          'string.invalid': `"genre" must be a valid JSON array`,
        }),
    })
  ),
});

export class AlbumValidation {
  /**
   * Validate required fields in album creation.
   */
  static validateRequiredFields(albumData: {
    title?: string;
    genre?: string[];
    songs?: string | { title: string; genre: string[] }[];
    coverPicture?: string;
    songFiles?: string[];
    songCovers?: string[];
  }) {
    const { songs } = albumData;

    if (!songs) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'SONGS_MISSING',
        'Songs data is required'
      );
    }
  }

  /**
   * Parse JSON fields safely.
   */
  static parseJsonField<T>(data: string | T): T {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'INVALID_JSON',
        'Invalid JSON format provided'
      );
    }
  }

  /**
   * Validate song, file, and cover counts match.
   */
  static validateSongFileCoverMatch(
    parsedSongs: { title: string; genre: string[] }[],
    songFiles: string[],
    songCovers: string[]
  ) {
    if (
      parsedSongs.length !== songFiles.length ||
      parsedSongs.length !== songCovers.length
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'SONG_FILE_MISMATCH',
        'Each song must have a corresponding file and cover',
        [
          {
            field: 'songs',
            message: 'Mismatch between songs and uploaded files',
          },
          { field: 'songFiles', message: 'Ensure each song has a file' },
          { field: 'songCovers', message: 'Ensure each song has a cover' },
        ],
        [
          {
            expectedField: 'songs',
            description: `Expected ${parsedSongs.length} songs, but received ${songFiles.length} song files and ${songCovers.length} song covers`,
          },
          {
            expectedField: 'songFiles',
            description: `Expected ${parsedSongs.length} song files, but received ${songFiles.length}`,
          },
          {
            expectedField: 'songCovers',
            description: `Expected ${parsedSongs.length} song covers, but received ${songCovers.length}`,
          },
        ]
      );
    }
  }

  /**
   * Validate file existence.
   */
  static validateFileExistence(
    file: Express.Multer.File | undefined,
    fieldName: string,
    errorMessage: string
  ) {
    if (!file) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'FILE_MISSING',
        errorMessage,
        [{ field: fieldName, message: errorMessage }]
      );
    }
  }

  static async isSongDuplicated(
    artistId: IAlbum['artist'],
    songTitle: ISong['title']
  ): Promise<boolean> {
    const isSongDuplicated = await Song.find({
      artist: artistId,
      title: songTitle,
    });
    if (isSongDuplicated.length > 0) {
      return true;
    }
    return false;
  }

  // checking user is artist or not
  static isArtist = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const role = req.user?.role;
      if (role !== 'artist') {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          'INVALID_USER',
          'Only Artist can get their Data',
          [],
          [
            {
              expectedField: 'artistRole',
              description:
                'Record which you want to get.. is meant to Artist Only .. !!!',
            },
          ]
        );
      }

      next();
    }
  );
}
