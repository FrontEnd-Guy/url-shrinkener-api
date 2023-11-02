/**
 * Main Application File: Configures and starts the Express application.
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {  errors } = require('celebrate');
const cors = require('cors');

const urlRouter = require('./routes/urls');
const {NotFoundError }= require('./errors')
const { errorHandler } = require('./middlewares/errors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(`Error during MongoDB connection: ${error}`));

app.use(bodyParser.json());
app.use(requestLogger);

const corsOptions = {
  origin: process.env.CORS_WHITELIST.split(','),
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/s', urlRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('404. Такой страницы не существует.'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
