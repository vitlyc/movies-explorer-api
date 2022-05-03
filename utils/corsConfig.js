require('dotenv').config();

const { ORIGIN_URL = 'http://localhost:3000' } = process.env;

const corsConfig = {
  origin: [ORIGIN_URL],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = { corsConfig };
