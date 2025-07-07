import { AuthenticatedRequest } from '@playlistModule/interfaces/playlist.types.interface';
import { asyncHandler } from '@utils';
import { NextFunction, Response } from 'express';

export const addSongToPlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.id = req?.params?.id;
    req.body.songId = req?.params?.songId;
    next();
  }
);

export const deleteSongToPlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.id = req?.params?.id;
    req.body.songId = req?.params?.songId;
    next();
  }
);

export const deletePlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.id = req?.params?.id;
    next();
  }
);

export const getSongFromPlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.id = req?.params?.id;
    next();
  }
);

export const addOrDeleteUserToSharedPlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.playlistId = req?.params?.id;
    req.body.userId = req?.params?.userId;
    next();
  }
);

export const sharePlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.playlistId = req?.params?.playlistId;
    req.body.userId = req?.params?.userId;
    next();
  }
);

export const removeUserFromSharedPlaylistSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.playlistId = req?.params?.playlistId;
    req.body.userId = req?.params?.userId;
    next();
  }
);

export const getUsersWithPlaylistAccessSchemaPreField = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.playlistId = req?.params?.playlistId;
    next();
  }
);
