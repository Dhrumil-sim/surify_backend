import { CollaborativeSessionModel } from 'models/collaborative_sessions.model';
import { ICollaborativeSession } from '../interfaces/collaboration.interface';

export const CollaborativeSessionService = {
  async createSession(data: ICollaborativeSession) {
    return CollaborativeSessionModel.create(data);
  },

  async getActiveSessionByHost(hostId: string) {
    return CollaborativeSessionModel.findOne({ hostId, isActive: true });
  },

  async endSession(sessionId: string) {
    return CollaborativeSessionModel.findByIdAndUpdate(
      sessionId,
      { isActive: false, expiredAt: new Date() },
      { new: true }
    );
  },

  async addParticipant(sessionId: string, userId: string) {
    return CollaborativeSessionModel.findByIdAndUpdate(
      sessionId,
      {
        $addToSet: { participantIds: userId },
      },
      { new: true }
    );
  },

  async addToQueue(sessionId: string, songId: string) {
    return CollaborativeSessionModel.findByIdAndUpdate(
      sessionId,
      {
        $push: { songQueue: songId },
      },
      { new: true }
    );
  },
};
