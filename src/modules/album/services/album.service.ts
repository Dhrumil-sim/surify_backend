import { Album } from '@models';
import { ISong, SongMetaData, SongService } from '@songModule';
import mongoose from 'mongoose';
import { IAlbum } from '@albumModule';

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
        try {
          const metadata = await SongMetaData.getMetadata(filePath);
          duration = metadata.format.duration || 0;
        } catch {
          console.warn(`Metadata failed for ${filePath}`);
        }

        return {
          title: song.title,
          genre: song.genre,
          coverPicture: coverPath,
          filePath,
          releaseDate: new Date(),
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
        const newSong = await SongService.createSong(
          userId,
          song.title,
          song.genre,
          new Date(),
          song.duration,
          song.coverPicture,
          song.filePath,
          newAlbum._id.toString()
        );
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
    const { title, genre, songs, coverPicture, songFiles, songCovers } =
      updates;

    // Merge existing with new
    const updatedData: Partial<IAlbum> = {
      title: title || existingAlbum.title,
      genre: genre || existingAlbum.genre,
      coverPicture: coverPicture || existingAlbum.coverPicture,
      songFiles: songFiles || existingAlbum.songFiles,
      songCovers: songCovers || existingAlbum.songCovers,
      songs: songs || existingAlbum.songs,
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
}
