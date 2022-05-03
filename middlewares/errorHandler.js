module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // 500 - по умолчанию
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка по умолчанию' : message,
  });
  next();
};
