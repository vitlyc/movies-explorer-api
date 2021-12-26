const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest'); // 400
const Forbidden = require('../errors/Forbidden'); // 403
const NotFound = require('../errors/NotFound'); // 404

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])

    .then((movies) => res.send(movies.map((movie) => movie)))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    trailer: req.body.trailer,
    thumbnail: req.body.thumbnail,
    image: req.body.image,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })

    .catch((err) => {
      if (err.code === 11000) {
        next(new BadRequest('Ошибка базы'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Фильм не найден');
    })
    .then((movie) => {
      if (!movie.owner.toString() === req.user._id) {
        throw new Forbidden('Нельзя удалить чужой фильм');
      }
      Movie.findByIdAndRemove(req.params.id).then(() => res.send({
        message: 'Фильм удален',
      }));
    })
    .catch(next);
};
