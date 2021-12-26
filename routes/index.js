const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const {
  createUserValidator,
  loginUserValidator,
} = require('../middlewares/validator');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFound = require('../errors/NotFound');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginUserValidator, login);
router.use(auth);
router.post('/signout', logout);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFound('Не найдено'));
});

module.exports = router;
