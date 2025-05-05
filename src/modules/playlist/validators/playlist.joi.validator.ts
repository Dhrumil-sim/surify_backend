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

// Custom ObjectId validation using Joi for URL parameters
export const objectIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/) // Ensures 24-character hex string format for ObjectId
  .required()
  .messages({
    'string.pattern.base': '"{#label}" must be a valid MongoDB ObjectId',
    'any.required': '"{#label}" is required',
  });

// Schema to validate 'id' and 'songId' URL parameters
export const addSongToPlaylistSchema = Joi.object({
  id: objectIdSchema,
  songId: objectIdSchema,
});

// delete song from playlist
export const deleteSongFromPlaylistSchema = Joi.object({
  id: objectIdSchema.required(),
  songId: objectIdSchema.required(),
});

export const deletePlaylistSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const getSongsFromPlaylistSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const addOrDeleteUserToSharedPlaylistSchema = Joi.object({
  playlistId: objectIdSchema.required(),
  userId: objectIdSchema.required(),
});
