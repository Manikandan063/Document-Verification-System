const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

exports.generateDocumentHash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};
