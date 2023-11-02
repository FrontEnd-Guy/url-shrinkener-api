const { isCelebrateError } = require('celebrate');

module.exports.errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorMessage = err.details.get('body') || err.details.get('params') || err.details.get('query');
    return res.status(400).json({ message: errorMessage.message });
  }

  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : message,
  });
};
