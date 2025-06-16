import Joi from 'joi';

export const createSessionSchema = Joi.object({
  hostId: Joi.string().required(),
  participantIds: Joi.array().items(Joi.string()),
  songQueue: Joi.array().items(Joi.string()),
  isActive: Joi.boolean().default(true),
  expiredAt: Joi.date().required(),
});
export const updateQueueSchema = Joi.object({
  songId: Joi.string().required(),
});

export const addParticipantSchema = Joi.object({
  userId: Joi.string().required(),
});
