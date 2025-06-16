import { validateRequest, verifyJWT } from '@middlewares';
import { AuthenticatedRequest } from '@playlistModule/interfaces/playlist.types.interface';
import { asyncHandler } from '@utils';
import { NextFunction, Router } from 'express';
import { CollaborativeSessionController } from 'modules/collaboration/controllers/collaboration.controller';
import {
  addParticipantSchema,
  createSessionSchema,
  updateQueueSchema,
} from 'modules/collaboration/validators/collaboration.validator';

const router = Router();

// Create a new session
router.post(
  '/',
  verifyJWT,
  asyncHandler(async (req: AuthenticatedRequest, next: NextFunction) => {
    req.body.hostId = req.user?._id;
    next();
  }),
  validateRequest(createSessionSchema),
  CollaborativeSessionController.create
);

// Get active session by hostId
router.get('/active/:hostId', CollaborativeSessionController.getActiveSession);

// End a session by sessionId
router.patch('/end/:sessionId', CollaborativeSessionController.endSession);

// Add a song to queue
router.post(
  '/:sessionId/queue',
  validateRequest(updateQueueSchema),
  CollaborativeSessionController.addToQueue
);

// Add a participant to the session
router.post(
  '/:sessionId/participants',
  validateRequest(addParticipantSchema),
  CollaborativeSessionController.addParticipant
);

export default router;
