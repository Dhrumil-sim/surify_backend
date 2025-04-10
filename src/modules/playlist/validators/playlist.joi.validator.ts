import Joi from 'joi';

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
