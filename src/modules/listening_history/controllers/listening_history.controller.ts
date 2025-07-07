import { Response } from 'express';
import { ListeningHistoryService } from '../services/listening_history.service';
import {
  createListeningHistorySchema,
  getListeningHistorySchema,
  objectIdParamSchema,
} from '../validators/listening_history.joi.validator';
import {
  LISTENING_HISTORY_CODES,
  LISTENING_HISTORY_MESSAGES,
} from '../constants/listening_history.error.constants';
import type { AuthenticatedRequest } from '../interfaces/listening_history.types.interface';

export class ListeningHistoryController {
  static async create(req: AuthenticatedRequest, res: Response) {
    const { error } = createListeningHistorySchema.validate({
      ...req.body,
      userId: req.user?._id,
    });
    if (error) {
      return res.status(400).json({
        code: LISTENING_HISTORY_CODES.INVALID_INPUT,
        message: LISTENING_HISTORY_MESSAGES.INVALID_INPUT,
        details: error.details,
      });
    }
    try {
      const record = await ListeningHistoryService.createListeningHistory({
        ...req.body,
        userId: req.user?._id,
      });
      return res.status(201).json({
        code: 201,
        message: LISTENING_HISTORY_MESSAGES.CREATED,
        data: record,
      });
    } catch (err) {
      return res.status(500).json({
        code: LISTENING_HISTORY_CODES.CREATION_FAILED,
        message: LISTENING_HISTORY_MESSAGES.CREATION_FAILED,
        error: err,
      });
    }
  }

  static async getByUser(req: AuthenticatedRequest, res: Response) {
    const { error } = getListeningHistorySchema.validate({
      userId: req.user?._id,
      page: req.query.page,
      limit: req.query.limit,
    });
    if (error) {
      return res.status(400).json({
        code: LISTENING_HISTORY_CODES.INVALID_INPUT,
        message: LISTENING_HISTORY_MESSAGES.INVALID_INPUT,
        details: error.details,
      });
    }
    try {
      const userId = req.user?._id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await ListeningHistoryService.getListeningHistoryByUser(
        userId,
        page,
        limit
      );
      return res.status(200).json({
        code: 200,
        message: LISTENING_HISTORY_MESSAGES.FETCHED,
        ...result,
      });
    } catch (err) {
      return res.status(500).json({
        code: LISTENING_HISTORY_CODES.FETCH_FAILED,
        message: LISTENING_HISTORY_MESSAGES.FETCH_FAILED,
        error: err,
      });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    const { error } = objectIdParamSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        code: LISTENING_HISTORY_CODES.INVALID_INPUT,
        message: LISTENING_HISTORY_MESSAGES.INVALID_INPUT,
        details: error.details,
      });
    }
    try {
      const userId = req.user?._id;
      const deleted = await ListeningHistoryService.deleteListeningHistoryById(
        req.params.id,
        userId
      );
      if (!deleted) {
        return res.status(404).json({
          code: LISTENING_HISTORY_CODES.NOT_FOUND,
          message: LISTENING_HISTORY_MESSAGES.NOT_FOUND,
        });
      }
      return res.status(200).json({
        code: 200,
        message: 'Listening history record deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({
        code: LISTENING_HISTORY_CODES.FETCH_FAILED,
        message: LISTENING_HISTORY_MESSAGES.FETCH_FAILED,
        error: err,
      });
    }
  }
}
