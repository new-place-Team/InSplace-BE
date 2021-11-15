const customizedError = (err, statusCode) => {
  const error = new Error(err);
  error.status = statusCode;
  return error;
};

module.exports = customizedError;
