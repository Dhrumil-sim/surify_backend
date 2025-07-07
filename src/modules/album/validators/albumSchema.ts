import Joi from 'joi';

const albumSchema = Joi.object({
  genre: Joi.array().items(Joi.string()).required(),
  language: Joi.string().trim().required().messages({
    'string.base': `"language" should be a string`,
    'string.trim': `"language" should not have leading or trailing spaces`,
    'any.required': `"language" is required`,
  }),
});

module.exports = albumSchema;
