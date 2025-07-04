import { Router } from 'express';
import { ListeningHistoryController } from '../modules/listening_history/controllers/listening_history.controller';
import { verifyJWT } from '../middlewares';

const listeningHistoryRouter = Router();

// @route   POST /api/listening-history
// @desc    Add a listening history record
// @access  Private
listeningHistoryRouter.post(
  '/',
  verifyJWT,
  ListeningHistoryController.create.bind(ListeningHistoryController)
);

// @route   GET /api/listening-history
// @desc    Get listening history for the current user
// @access  Private
listeningHistoryRouter.get(
  '/',
  verifyJWT,
  ListeningHistoryController.getByUser.bind(ListeningHistoryController)
);

// @route   DELETE /api/listening-history/:id
// @desc    Delete a listening history record by id (only if owned by user)
// @access  Private
listeningHistoryRouter.delete(
  '/:id',
  verifyJWT,
  ListeningHistoryController.delete.bind(ListeningHistoryController)
);

export default listeningHistoryRouter;
