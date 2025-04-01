import { StatusCodes } from 'http-status-codes';
import { Album, IAlbum } from '../../../models/album.model.js';
import { Song, ISong } from '../../../models/song.model.js';
import { ApiError } from '../../../utils/ApiError.js';
import SongMetaData from '../../song/utils/songMetadata.util.js';

import mongoose from 'mongoose';

export class AlbumService {
  static async createAlbum(albumData: {
    title: string;
    genre: string;
    songs: string | { title: string; genre: string[] }[];
    coverPicture: string;
    songFiles: Express.Multer.File[];
    songCovers: Express.Multer.File[];
    userId: string;
  }): Promise<IAlbum> {
    const { title, genre, songs, coverPicture, songFiles, songCovers, userId } =
      albumData;

    if (!coverPicture) throw new Error('Album cover picture is required');
    if (!songs) throw new Error('Songs data is required');

    // Parse genre and songs data if needed
    const parsedGenre: string[] = Array.isArray(genre)
      ? genre
      : JSON.parse(genre);
    const parsedSongs: { title: string; genre: string[] }[] = Array.isArray(
      songs
    )
      ? songs
      : JSON.parse(songs);

    if (
      parsedSongs.length !== songFiles.length ||
      parsedSongs.length !== songCovers.length
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'SONG_MISSING',
        'Each song must have a corresponding file and cover'
      );
    }

    // Process each song and extract metadata
    const songsWithFiles: Partial<ISong>[] = await Promise.all(
      parsedSongs.map(async (song, index) => {
        const songFile = songFiles[index]?.path;
        const songCover = songCovers[index]?.path;

        if (!songFile || !songCover) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'FILE_COVER_MISSING',
            `Missing file or cover for song: ${song.title}`
          );
        }

        let duration = 0;
        try {
          const metadata = await SongMetaData.getMetadata(songFile);
          duration = metadata.format.duration || 0;
        } catch (error) {
          console.warn(`Failed to retrieve metadata for ${songFile}:`, error);
        }

        return {
          title: song.title,
          genre: song.genre,
          coverPicture: songCover,
          filePath: songFile,
          releaseDate: new Date(),
          duration,
        };
      })
    );

    // Create the album in the database
    const newAlbum = await Album.create({
      artist: new mongoose.Types.ObjectId(userId),
      title,
      genre: parsedGenre,
      releaseDate: new Date(),
      coverPicture,
    });

    // Create songs and link them to the album
    const createdSongs = await Promise.all(
      songsWithFiles.map(async (song) => {
        const newSong = await Song.create({
          ...song,
          artist: new mongoose.Types.ObjectId(userId),
          album: newAlbum._id,
        });
        return newSong._id;
      })
    );

    // Update album with song IDs
    newAlbum.songs = createdSongs as IAlbum['songs'];
    await newAlbum.save();

    return newAlbum;
  }
}
