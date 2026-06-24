const { errorResponse } = require('../utils/response.util');

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden: You do not have permission to access this resource');
    }
    next();
  };
};
