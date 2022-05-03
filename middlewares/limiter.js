const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 50, // можно совершить максимум 50 запросов с одного IP
});

module.exports = {
  limiter,
};
