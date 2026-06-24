const User = require('./auth.model');
const { hashPassword, comparePassword } = require('../../shared/utils/hash.util');
const { generateToken } = require('../../shared/utils/jwt.util');

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = generateToken({ id: user.id, role: user.role });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token
  };
};

exports.register = async (name, email, password, role = 'HR Executive') => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, role });

  const token = generateToken({ id: user.id, role: user.role });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token
  };
};
