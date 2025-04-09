import { AlbumService } from '@albumModule';
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

  // get album by Id
  static getAlbumById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const albumId = new mongoose.Types.ObjectId(req.params.albumId);
      console.log(albumId);
      const albums = await AlbumService.getAlbumById(albumId);
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
          'Album is fetched successfully'
        );
        res.status(response.statusCode).json(response);
      }
    }
  );

  static updateAlbum = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const albumId = new mongoose.Types.ObjectId(req.params.albumId);
      const artistId = req?.user?._id;
      const existingAlbum = await AlbumHelperUtility.getAlbumById(albumId);
      await AlbumHelperUtility.validArtist(artistId, existingAlbum?.artist);

      const originalAlbum = await AlbumService.getAlbumById(albumId);
      const updatedAlbum = await AlbumService.updateAlbum(
        albumId,
        req.body,
        originalAlbum
      );
      if (updatedAlbum) {
        const response = new ApiResponse(
          StatusCodes.OK,
          updatedAlbum,
          'Album is updated successfully !'
        );
        res.status(response.statusCode).json(response);
      } else {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'FAIL_TO_UPDATE',
          'Album is not updated'
        );
      }
    }
  );

  static deleteAlbum = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const albumId = new mongoose.Types.ObjectId(req.params.albumId);

      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'INVALID_ALBUM_ID',
          'The provided album ID is not valid.',
          [
            {
              field: 'albumId',
              message: 'The albumId in the request parameter is invalid.',
            },
          ]
        );
      }
      if (!albumId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'ALBUM_ID_NOT_FOUND',
          'Album id not found',
          [
            {
              field: 'album id',
              message: 'albumId in request parameter is not there',
            },
          ]
        );
      }
      const deletedAlbum = await AlbumService.deleteAlbum(albumId);
      if (!deletedAlbum) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'ALBUM_IS_NOT_DELETED',
          'error while deleting the record'
        );
      } else {
        const response = new ApiResponse(
          StatusCodes.OK,
          deletedAlbum,
          'Album delete successfully'
        );
        res.status(response.statusCode).json(response);
      }
    }
  );
}

export default AlbumController;
