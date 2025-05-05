import mongoose, { FilterQuery } from 'mongoose';
import { Song, User } from '@models';
import { ISong, ISongHistory, ISongQuery, paginateQuery } from '@songModule';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';
import { SongHistory } from 'models/song.model';
import { normalizeGenre } from '../utils/normalizeGenre.util';

class SongService {
  /**
   * Creates a new song document in the database.
   * @param artist - The ID of the artist uploading the song.
   * @param title - The title of the song.
   * @param genre - An array of genres associated with the song.
   * @param releaseDate - The release date of the song.
   * @param duration - The duration of the song in seconds.
   * @param coverPicture - The URL or path to the cover picture.
   * @param filePath - The path to the song file.
   * @returns The created song document.
   */
  static async createSong(
    artist: mongoose.Types.ObjectId,
    title: string,
    genre: string[],
    releaseDate: Date,
    duration: number,
    coverPicture: string,
    filePath: string,
    fileHash: string,
    album?: mongoose.Types.ObjectId
  ): Promise<ISong> {
    const newSong = await Song.create({
      artist,
      title,
      genre,
      releaseDate,
      duration,
      coverPicture,
      filePath,
      ...album,
      fileHash,
    });
    return newSong;
  }
  static async getAllSongs(
    filters: ISongQuery
  ): Promise<{ data: ISong[]; total: number; page: number; limit: number }> {
    const {
      title,
      genre,
      artist,
      sortBy = 'createdAt',
      page = 1,
      limit = 10,
    } = filters;

    const query: FilterQuery<ISong> = { deletedAt: null };

    // Apply title filter
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Apply genre filter
    if (genre) {
      const genreFilter = filters.genre?.split(',') ?? [];
      if (genreFilter.length > 0) {
        query.genre = { $in: genreFilter };
      }
    }

    // Apply artist name filter
    // Apply artist name filter
    if (artist) {
      const isObjectId = mongoose.Types.ObjectId.isValid(artist);

      if (isObjectId) {
        query.artist = new mongoose.Types.ObjectId(artist);
      } else {
        const artistUsers = await User.find({
          username: { $regex: artist, $options: 'i' },
          role: 'artist',
        });

        const artistIds = artistUsers.map((u) => u._id);
        if (artistIds.length) {
          query.artist = { $in: artistIds };
        } else {
          return { data: [], page: 0, limit: 0, total: 0 };
        }
      }
    }

    const total = await Song.countDocuments(query);

    let songQuery = Song.find(query)
      .populate('artist', 'username')
      .sort({ [sortBy]: -1 });

    // Pagination
    songQuery = paginateQuery(songQuery, { page, limit });
    const songs = await songQuery.lean();
    const normalizedSongs = songs.map((song) => ({
      ...song,
      genre: normalizeGenre(song.genre),
    }));
    return { data: normalizedSongs, total: total, page, limit };
  }

  static async getSongById(songId: string): Promise<ISong> {
    try {
      const objectId = new mongoose.Types.ObjectId(songId);
      const song = await Song.findById(objectId).where({ deletedAt: null });
      if (!song) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Music not found');
      }
      return song;
    } catch (error) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Music not found' + error);
    }
  }

  static async getSongByAlbumId(albumId: string): Promise<ISong[]> {
    try {
      const objectId = new mongoose.Types.ObjectId(albumId);
      const song = await Song.find({ deletedAt: null, album: objectId });
      if (!song) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Music not found');
      }
      return song;
    } catch (error) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Music not found' + error);
    }
  }

  static async updateSong(
    songId: string,
    updateData: Partial<ISong>
  ): Promise<ISong> {
    try {
      const objectId = new mongoose.Types.ObjectId(songId);

      // Find the song by ID and update it with the new data
      const updatedSong = await Song.findByIdAndUpdate(objectId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is applied to updated fields
      });

      if (!updatedSong) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Music not found');
      }

      return updatedSong;
    } catch {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update music');
    }
  }
  static async deleteSong(songId: string): Promise<void> {
    const songExists = await this.getSongById(songId);
    if (!songExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Song is not found');
    }
    await Song.findByIdAndUpdate(songId, {
      deletedAt: new Date(),
    });
  }

  static async createMultipleSongs(
    artist: mongoose.Types.ObjectId,
    album: mongoose.Types.ObjectId,
    songs: {
      title: string;
      genre: string[];
      releaseDate: Date;
      duration: number;
      coverPicture: string;
      filePath: string;
      fileHash: string;
    }[]
  ): Promise<ISong[]> {
    try {
      // Use `map` to create an array of song creation promises
      const createdSongs = await Promise.all(
        songs.map((song) =>
          this.createSong(
            artist,
            song.title,
            song.genre,
            song.releaseDate,
            song.duration,
            song.coverPicture,
            song.filePath,
            song.fileHash,
            album

            // Pass the albumId to the createSong function
          )
        )
      );
      return createdSongs;
    } catch (error) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create songs: ' + error
      );
    }
  }
  static async getSongHistory(songId: string): Promise<ISongHistory[]> {
    return await SongHistory.find({ songId }).sort({ updatedAt: -1 });
  }
}

export default SongService;
