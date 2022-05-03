const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isValidUrl = (url) => {
  const valided = validator.isURL(url);
  if (valided) {
    return url;
  }
  throw new Error('Неверный URL');
};
const createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
});
const loginUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
});
const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isValidUrl),
    trailer: Joi.string().required().custom(isValidUrl),
    thumbnail: Joi.string().required().custom(isValidUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdvalidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
  createMovieValidator,
  movieIdvalidator,
};
