import { validateRequest } from '@middlewares';
import {
  createPlaylistSchema,
  IPlayList,
  IPlayListRequest,
  IPlayListRequestPayload,
  Playlist,
} from '@playlistModule';

export class PlaylistService {
  static async createPlaylist(
    createPlaylistPayload: IPlayListRequestPayload,
    userId: IPlayListRequest['createdBy'] | string
  ): Promise<IPlayList> {
    validateRequest(createPlaylistSchema);
    const { name, description, isShared } = createPlaylistPayload;
    const newPlaylist = Playlist.create({
      name: name,
      description: description,
      isShared: isShared,
      createdBy: userId,
      deletedAt: null,
    });
    return newPlaylist;
  }
  static async getPlaylist(): Promise<IPlayList[]> {
    const playlists = await Playlist.find({ deletedAt: null });
    return playlists;
  }
}
