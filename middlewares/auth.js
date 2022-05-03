require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;
// для куки
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) throw new Unauthorized('Куки не переданы');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
    );
  } catch (err) {
    throw new Unauthorized('Нужна авторизация');
  }
  req.user = payload;
  next();
};
