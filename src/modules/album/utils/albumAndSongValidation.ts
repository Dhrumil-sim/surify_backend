import Joi from 'joi';
// Album validation schema
export const albumSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  genre: Joi.array().items(Joi.string()).min(1).required(),
  coverPicture: Joi.string().uri().required(),
});

// Song validation schema
export const songSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  genre: Joi.array().items(Joi.string()).min(1).required(),
  filePath: Joi.string().uri().required(),
  coverPicture: Joi.string().uri().required(),
  albumId: Joi.string().hex().length(24).required(), // MongoDB ObjectId validation
});
