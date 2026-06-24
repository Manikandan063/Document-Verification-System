const { verifyToken } = require('../utils/jwt.util');
const { errorResponse } = require('../utils/response.util');
const User = require('../../modules/auth/auth.model');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return errorResponse(res, 401, 'Unauthorized: Invalid token');
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return errorResponse(res, 401, 'Unauthorized: User not found');
  }

  req.user = user;
  next();
};
