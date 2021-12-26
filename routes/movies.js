const router = require('express').Router();
const {
  createMovieValidator,
  movieIdvalidator,
} = require('../middlewares/validator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', createMovieValidator, createMovie);
router.delete('/:id', movieIdvalidator, deleteMovie);

module.exports = router;
