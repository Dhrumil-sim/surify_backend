import { Album } from '@models';
import { ISong, SongMetaData, SongService } from '@songModule';
import mongoose from 'mongoose';
import { AlbumValidation, IAlbum } from '@albumModule';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

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
        // Refactor here to use the `createSong` method correctly
        const songDuplication = await AlbumValidation.isSongDuplicated(
          userId,
          song.title
        );
        console.log(songDuplication);
        if (songDuplication) {
          throw new ApiError(
            StatusCodes.CONFLICT,
            'SONG_ALREADY_EXIST',
            `Song is already exist with the given title: ${song.title} and artist`
          );
        }
        const newSong = await SongService.createSong(
          new mongoose.Types.ObjectId(userId), // artist
          song.title, // title
          song.genre, // genre
          new Date(), // releaseDate
          song.duration, // duration
          song.coverPicture, // coverPicture
          song.filePath, // filePath
          '' + new mongoose.Types.ObjectId(newAlbum.artist) // album ID
        );
        return newSong._id;
      })
    );

    // ✅ Step 8: Update album with song IDs
    newAlbum.songs = createdSongs as IAlbum['songs'];
    await newAlbum.save();

    return newAlbum;
  }

  static async getArtistAlbum(artistId: IAlbum['id']): Promise<IAlbum[]> {
    const album = await Album.find({ artist: artistId });
    return album;
  }
  static async getAlbums(): Promise<IAlbum[]> {
    const albums = await Album.find({ deletedAt: null });

    return albums;
  }
}
