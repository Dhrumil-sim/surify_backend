import Joi from 'joi';
// Album validation schema
export const albumSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  genre: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()).min(1), // Accept array directly
      Joi.string()
        .custom((value, helpers) => {
          // Try to parse JSON string into an array
          try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
              throw new Error();
            }
            return parsed;
          } catch {
            return helpers.error('string.invalid');
          }
        })
        .messages({
          'string.invalid': `"genre" must be a valid JSON array`,
        })
    )
    .required()
    .messages({
      'array.base': `"genre" should be an array`,
      'array.min': `"genre" must contain at least one item`,
      'any.required': `"genre" is required`,
    }),
});

// Song validation schema
export const songSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  genre: Joi.array().items(Joi.string()).min(1).required(),
  filePath: Joi.string().uri().required(),
  coverPicture: Joi.string().uri().required(),
  albumId: Joi.string().hex().length(24).required(), // MongoDB ObjectId validation
});
