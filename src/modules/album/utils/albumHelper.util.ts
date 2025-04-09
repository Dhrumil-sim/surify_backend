import { ApiError } from '@utils';
import { IAlbum } from '../interfaces/album.type.interface';
import { StatusCodes } from 'http-status-codes';
import { Album } from '@models';

export class AlbumHelperUtility {
  static async validArtist(
    artistId: IAlbum['artist'],
    albumArtistId: IAlbum['artist']
  ) {
    if (!artistId.equals(albumArtistId)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'UNAUTHORIZED',
        'You are not authorized to update this song data'
      );
    }
  }
  static async getAlbumById(albumId: IAlbum['id']): Promise<IAlbum> {
    const album = await Album.findById(albumId);
    if (!album) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Album_Not_Found',
        'There is no any album with given id'
      );
    }
    return album;
  }
}
