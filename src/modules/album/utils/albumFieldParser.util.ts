// utils/AlbumFieldParser.ts
import { AuthenticatedRequest } from '@albumModule';
import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { SongService } from '@songModule';
import { AlbumService } from '@albumModule';
import { asyncHandler } from '@utils';

export class AlbumFieldParser {
  static createParseField = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (req.body.songs && typeof req.body.songs === 'string') {
          req.body.songs = JSON.parse(req.body.songs);
        }

        if (req.body.genre && typeof req.body.genre === 'string') {
          req.body.genre = JSON.parse(req.body.genre);
        }

        // Do not assign defaults from DB in create mode
        next();
      } catch (err) {
        next(err);
      }
    }
  );

  static updateParseField = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const albumId = new mongoose.Types.ObjectId(req.params.albumId);
      const originalSong = await SongService.getSongByAlbumId(
        albumId.toString()
      );
      const originalAlbum = await AlbumService.getAlbumById(albumId);

      if (!originalAlbum) {
        return res.status(404).json({ message: 'Album not found' });
      }

      try {
        if (req.body.songs && typeof req.body.songs === 'string') {
          req.body.songs = JSON.parse(req.body.songs);
        } else {
          req.body.songs = originalSong['genre'] || [];
        }

        if (req.body.genre && typeof req.body.genre === 'string') {
          req.body.genre = JSON.parse(req.body.genre);
        } else {
          req.body.genre = originalAlbum.genre || [];
        }

        if (!req.files?.coverPicture) {
          req.body.coverPicture = originalAlbum.coverPicture;
        }

        next();
      } catch (err) {
        next(err);
      }
    }
  );
}
