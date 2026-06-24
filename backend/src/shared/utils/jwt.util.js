const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_key', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');
  } catch (err) {
    return null;
  }
};
