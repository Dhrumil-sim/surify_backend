import { Request, Response } from 'express';
import { CollaborativeSessionService } from '@collabSessionModule';

export const CollaborativeSessionController = {
  async create(req: Request, res: Response) {
    try {
      const session = await CollaborativeSessionService.createSession(req.body);
      res.status(201).json({ success: true, session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getActiveSession(req: Request, res: Response) {
    try {
      const session = await CollaborativeSessionService.getActiveSessionByHost(
        req.params.hostId
      );
      res.status(200).json({ success: true, session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async endSession(req: Request, res: Response) {
    try {
      const result = await CollaborativeSessionService.endSession(
        req.params.sessionId
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // Add these to the existing controller
  async addToQueue(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { songId } = req.body;
      const updatedSession = await CollaborativeSessionService.addToQueue(
        sessionId,
        songId
      );
      res.status(200).json({ success: true, session: updatedSession });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async addParticipant(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { userId } = req.body;
      const updatedSession = await CollaborativeSessionService.addParticipant(
        sessionId,
        userId
      );
      res.status(200).json({ success: true, session: updatedSession });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
