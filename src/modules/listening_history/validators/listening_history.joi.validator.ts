import Joi from 'joi';

export const objectIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Must be a valid MongoDB ObjectId',
    'any.required': 'Field is required',
  });

export const createListeningHistorySchema = Joi.object({
  userId: objectIdSchema,
  songId: objectIdSchema,
  playedAt: Joi.date().required(),
});

export const getListeningHistorySchema = Joi.object({
  userId: objectIdSchema.required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const objectIdParamSchema = Joi.object({
  id: objectIdSchema.required(),
});
