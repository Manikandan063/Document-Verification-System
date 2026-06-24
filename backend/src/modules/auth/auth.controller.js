const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../shared/utils/response.util');
const { loginSchema } = require('./auth.validation');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse({ body: req.body }).body;
    const result = await authService.login(email, password);
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register(name, email, password, role);
    return successResponse(res, 201, 'Registration successful', result);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return errorResponse(res, 409, error.message);
    }
    next(error);
  }
};
