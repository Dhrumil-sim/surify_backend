import Joi from 'joi';

// Album validation schema
export const albumSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': `"title" should be a string`,
    'string.min': `"title" must be at least 3 characters`,
    'string.max': `"title" must be at most 100 characters`,
    'any.required': `"title" is required`,
  }),

  genre: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()).min(1),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error();
          return parsed;
        } catch {
          return helpers.error('string.invalid');
        }
      })
    )
    .required()
    .messages({
      'array.base': `"genre" should be an array`,
      'array.min': `"genre" must contain at least one item`,
      'any.required': `"genre" is required`,
      'string.invalid': `"genre" must be a valid JSON array`,
    }),

  coverPicture: Joi.string().required().messages({
    'string.base': `"coverPicture" should be a string`,
    'any.required': `"coverPicture" is required`,
  }),

  songs: Joi.array()
    .items(
      Joi.object({
        artist: Joi.string().hex().length(24).optional().messages({
          'string.base': `"artist" should be a string`,
          'string.hex': `"artist" must be a valid ObjectId`,
        }),

        title: Joi.string().trim().required().messages({
          'string.base': `"title" should be a string`,
          'string.trim': `"title" should not have leading or trailing spaces`,
          'any.required': `"title" is required`,
        }),

        album: Joi.string().hex().length(24).allow(null).optional().messages({
          'string.base': `"album" should be a string`,
          'string.hex': `"album" must be a valid ObjectId`,
        }),

        genre: Joi.alternatives()
          .try(
            Joi.array().items(Joi.string()).min(1),
            Joi.string().custom((value, helpers) => {
              try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) throw new Error();
                return parsed;
              } catch {
                return helpers.error('string.invalid');
              }
            })
          )
          .required()
          .messages({
            'array.base': `"genre" should be an array`,
            'array.min': `"genre" must contain at least one item`,
            'any.required': `"genre" is required`,
            'string.invalid': `"genre" must be a valid JSON array`,
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': `"songs" should be an array`,
      'array.min': `"songs" must contain at least one song`,
      'any.required': `"songs" is required`,
    }),
});
