import { Album, IAlbum } from '../../../models/album.model.js';
import { Song, ISong } from '../../../models/song.model.js';
import SongMetaData from '../../song/utils/songMetadata.util.js';
import mongoose from 'mongoose';
import { AlbumValidation } from '../utils/albumAndSongValidation.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../../song/song.controller.js';
import { NextFunction } from 'express';
import { Response } from 'express';
export class AlbumService {
  static async createAlbum(albumData: {
    title: string;
    genre: string;
    songs: string | { title: string; genre: string[] }[];
    coverPicture: string;
    songFiles: Express.Multer.File[];
    songCovers: Express.Multer.File[];
    userId: mongoose.Types.ObjectId;
  }): Promise<IAlbum> {
    const { title, genre, songs, coverPicture, songFiles, songCovers, userId } =
      albumData;

    // ✅ Step 1: Validate required fields
    AlbumValidation.validateRequiredFields(albumData);

    // ✅ Step 2: Parse JSON fields
    const parsedGenre: string = AlbumValidation.parseJsonField(genre);
    const parsedSongs: { title: string; genre: string[] }[] =
      AlbumValidation.parseJsonField(songs);

    // ✅ Step 3: Validate song-file-cover count
    AlbumValidation.validateSongFileCoverMatch(
      parsedSongs,
      songFiles,
      songCovers
    );

    // ✅ Step 4: Process each song and extract metadata
    const songsWithFiles: Partial<ISong>[] = await Promise.all(
      parsedSongs.map(async (song, index) => {
        const songFile = songFiles[index]?.path;
        const songCover = songCovers[index]?.path;

        // ✅ Step 5: Validate each song has a file and cover
        AlbumValidation.validateFileExistence(
          songFiles[index],
          'songFiles',
          `Missing file for song: ${song.title}`
        );
        AlbumValidation.validateFileExistence(
          songCovers[index],
          'songCovers',
          `Missing cover for song: ${song.title}`
        );

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

    // ✅ Step 6: Create album in database
    const newAlbum = await Album.create({
      artist: new mongoose.Types.ObjectId(userId),
      title,
      genre: parsedGenre,
      releaseDate: new Date(),
      coverPicture,
    });

    // ✅ Step 7: Create songs and link them to the album
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

    // ✅ Step 8: Update album with song IDs
    newAlbum.songs = createdSongs as IAlbum['songs'];
    await newAlbum.save();

    return newAlbum;
  }

  static getArtistAlbum = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      AlbumValidation.isArtist(req, res, next);
      const artistId = req.user?._id;
      const artistAlbums = await Album.find().where({ artist: artistId });
      console.log(artistAlbums);
    }
  );
}
