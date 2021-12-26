require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsConfig = require('./utils/corsConfig');
const { limiter } = require('./middlewares/limiter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const { PORT = 3000, MONGO_DB = 'mongodb://localhost:27017/default_db' } = process.env;

const app = express();
mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});
app.use('*', cors(corsConfig));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
