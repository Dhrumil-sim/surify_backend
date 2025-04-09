import { Album, Song } from '@models';
import { ISong, SongFileHash, SongMetaData, SongService } from '@songModule';
import mongoose from 'mongoose';
import { IAlbum } from '@albumModule';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

export class AlbumService {
  static async createAlbum(albumData: {
    title: string;
    genre: string[]; // already parsed
    songs: { title: string; genre: string[] }[]; // already parsed
    coverPicture: string;
    songFiles: string[];
    songCovers: string[];
    userId: mongoose.Types.ObjectId;
  }): Promise<IAlbum> {
    const { title, genre, songs, coverPicture, songFiles, songCovers, userId } =
      albumData;

    const songsWithFiles: Partial<ISong>[] = await Promise.all(
      songs.map(async (song, index) => {
        const filePath = songFiles[index];
        const coverPath = songCovers[index];

        let duration = 0;
        let fileHashVal = '';
        try {
          const metadata = await SongMetaData.getMetadata(filePath);
          const fileHash = await SongFileHash.fileHash(filePath);
          duration = metadata.format.duration || 0;
          fileHashVal = fileHash;
        } catch {
          console.warn(`Metadata failed for ${filePath}`);
        }

        return {
          title: song.title,
          genre: song.genre,
          coverPicture: coverPath,
          filePath,
          releaseDate: new Date(),
          fileHash: fileHashVal,
          duration,
        };
      })
    );

    const newAlbum = await Album.create({
      artist: new mongoose.Types.ObjectId(userId),
      title,
      genre,
      releaseDate: new Date(),
      coverPicture,
    });

    const createdSongs = await Promise.all(
      songsWithFiles.map(async (song) => {
        const newSong = await Song.create({
          ...song,
          artist: new mongoose.Types.ObjectId(userId),

          album: newAlbum._id.toString(),
        });
        return newSong._id;
      })
    );

    newAlbum.songs = createdSongs as IAlbum['songs'];
    await newAlbum.save();

    return newAlbum;
  }

  static async updateAlbum(
    albumId: mongoose.Types.ObjectId,
    updates: Partial<IAlbum>,
    existingAlbum: IAlbum
  ): Promise<IAlbum> {
    const { title, genre, coverPicture } = updates;

    // Merge existing with new
    const updatedData: Partial<IAlbum> = {
      title: title || existingAlbum.title,
      genre: genre || existingAlbum.genre,
      coverPicture: coverPicture || existingAlbum.coverPicture,
    };

    const updatedAlbum = await Album.findByIdAndUpdate(albumId, updatedData, {
      new: true,
    });

    return updatedAlbum as IAlbum;
  }

  static async getArtistAlbum(artistId: IAlbum['id']): Promise<IAlbum[]> {
    const album = await Album.find({ artist: artistId });
    return album;
  }

  static async getAlbums(): Promise<IAlbum[]> {
    const albums = await Album.find({ deletedAt: null });
    return albums;
  }

  static async getAlbumById(albumId: IAlbum['id']): Promise<IAlbum> {
    const album = await Album.findOne({ _id: albumId, deletedAt: null });
    return album;
  }

  static async deleteAlbum(albumId: IAlbum['id']): Promise<IAlbum> {
    const album = await this.getAlbumById(albumId);
    if (!album) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'ALBUM_NOT_FOUND',
        'Album not found'
      );
    }
    const songs = album?.songs;
    console.log(songs);
    await Promise.all(
      songs.map((songId) => SongService.deleteSong(songId.toString()))
    );
    const deletedAlbum = await Album.findByIdAndUpdate(albumId, {
      deletedAt: Date.now(),
    });
    return deletedAlbum;
  }
}
