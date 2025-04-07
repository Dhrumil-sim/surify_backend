import { AlbumService, AlbumValidation } from '@albumModule';
import { ApiError, asyncHandler, ApiResponse } from '@utils';
import { StatusCodes } from 'http-status-codes';

import { AuthenticatedRequest } from '@songModule';
import { Response } from 'express';
import mongoose from 'mongoose';

import { AlbumHelperUtility } from '../utils/albumHelper.util';

class AlbumController {
  static createAlbum = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { _id, role } = req.user; // Get the role and ID of the authenticated user
      if (role !== 'artist') {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          'Only artists can create an album'
        );
      }
      const userId = new mongoose.Types.ObjectId(_id);
      const { title, genre, songs } = req.body;

      const albumData = {
        title: title,
        genre: genre,
        songs: songs,
        coverPicture: req.body.coverPicture,
        songFiles: req.body.songFiles,
        songCovers: req.body.songCovers,
        userId,
      };

      // Call the service to create album
      const newAlbum = await AlbumService.createAlbum(albumData);
      const response = new ApiResponse(
        StatusCodes.CREATED,
        newAlbum,
        'Album created successfully'
      );
      res.status(StatusCodes.CREATED).json(response);
    }
  );

  // getAlbum data
  static getArtistAlbums = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      // checking about user should be artist
      const artistId = req?.user?._id;
      const albums = await AlbumService.getArtistAlbum(artistId);
      if (!albums) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          'ALBUM_NOT_FOUND',
          'Album is not created by artist yet'
        );
      } else {
        const response = new ApiResponse(
          StatusCodes.OK,
          albums,
          'Album Fetched Successfully !!!'
        );
        res.status(response.statusCode).json(response);
      }
    }
  );

  // get all albums:
  static getAllAlbums = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const albums = await AlbumService.getAlbums();
      if (!albums) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          'ALBUM_NOT_FOUND',
          'Albums are not found'
        );
      } else {
        const response = new ApiResponse(
          StatusCodes.OK,
          albums,
          'Albums are fetched successfully'
        );
        res.status(response.statusCode).json(response);
      }
    }
  );

  static updateAlbum = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const albumId = new mongoose.Types.ObjectId(req.params.albumId);
      const artistId = req?.user?._id;
      // Parse fields
      const songs: string[] = req?.body?.songs;
      const titles = songs.map((ele) => ele?.title);
      console.log(titles);
      if (songs) {
        await AlbumValidation.isSongDuplicated(
          artistId,
          // eslint-disable-next-line no-unsafe-optional-chaining
          ...req.body.songs?.title
        );
      }
      const album = await AlbumHelperUtility.getAlbumById(albumId);
      await AlbumHelperUtility.validArtist(artistId, album?.artist);

      const updatedAlbum = await AlbumService.updateAlbum(
        albumId,
        req.body,
        album
      );

      const response = new ApiResponse(
        StatusCodes.OK,
        updatedAlbum,
        'Album updated successfully'
      );
      res.status(response.statusCode).json(response);
    }
  );
}

export default AlbumController;
