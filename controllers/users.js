const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequest = require('../errors/BadRequest'); // 400
const Unauthorized = require('../errors/Unauthorized'); // 401
const NotFound = require('../errors/NotFound'); // 404
// 409
const parseDataUser = (data) => ({
  email: data.email,
  name: data.name,
  _id: data._id,
});

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send(parseDataUser(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      }
      if (err.code === 11000) {
        next(new BadRequest('Этот email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль1'));
      }
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new Unauthorized('Неправильные почта или пароль2'));
          }
          const token = jwt.sign(
            { _id: user.id },
            NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
            {
              expiresIn: '7d',
            },
          );
          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            })
            .send({
              token,
              user: parseDataUser(user),
            });
        })
        .catch(() => {
          next(new Unauthorized('Неправильные почта или пароль3'));
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Куки удалены' });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((item) => {
      if (!item) next(new NotFound('Пользователь не найден'));

      res.status(200).send(parseDataUser(item));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет такого пользователя'));
      }
      next(err);
    });
};
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((item) => res.send({ data: item }))
    .catch(next);
};
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(parseDataUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};
