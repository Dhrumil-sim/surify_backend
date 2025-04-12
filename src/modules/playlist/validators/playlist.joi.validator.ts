import Joi from 'joi';
import mongoose from 'mongoose';

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'any.required': `"name" is a required field`,
  }),

  description: Joi.string().max(300).allow('', null).optional().messages({
    'string.base': `"description" should be a type of 'text'`,
    'string.max': `"description" should not exceed {#limit} characters`,
  }),

  isShared: Joi.boolean().required().messages({
    'boolean.base': `"isShared" must be a boolean`,
    'any.required': `"isShared" is a required field`,
  }),

  deletedAt: Joi.date().optional().allow(null).messages({
    'date.base': `"deletedAt" must be a valid date`,
  }),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  description: Joi.string().allow('', null),
  isShared: Joi.boolean(),
}).min(1);

const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', {
      message: `"${value}" is not a valid ObjectId`,
    });
  }
  return value;
}, 'ObjectId Validation');

// Schema to validate both 'id' and 'songId' parameters
export const addSongToPlaylistSchema = Joi.object({
  id: objectIdSchema.required(),
  songId: objectIdSchema.required(),
});
