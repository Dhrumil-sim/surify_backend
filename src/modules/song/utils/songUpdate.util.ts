import SongService from '../services/song.service';

export const isSongExist = (songId: string): boolean => {
  const song = SongService.getSongById(songId);
  if (song) {
    return true;
  }
  return false;
};
