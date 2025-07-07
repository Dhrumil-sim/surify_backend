import { ListeningHistory } from '../../../models/listening_history.model';
import { IListeningHistory } from '../interfaces/listening_history.types.interface';

export class ListeningHistoryService {
  static async createListeningHistory(payload: Omit<IListeningHistory, '_id'>) {
    return ListeningHistory.create(payload);
  }

  static async getListeningHistoryByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      ListeningHistory.find({ userId })
        .sort({ playedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('songId'),
      ListeningHistory.countDocuments({ userId }),
    ]);
    return { records, total, page, limit };
  }

  static async deleteListeningHistoryById(id: string, userId: string) {
    return ListeningHistory.findOneAndDelete({ _id: id, userId });
  }
}
