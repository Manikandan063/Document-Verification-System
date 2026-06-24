const { errorResponse } = require('../utils/response.util');
const { ZodError } = require('zod');

exports.errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, statusCode, message, err.stack);
};
