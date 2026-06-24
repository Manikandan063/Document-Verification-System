const User = require('../auth/auth.model');
const authService = require('../auth/auth.service');
const { successResponse } = require('../../shared/utils/response.util');
const { hashPassword } = require('../../shared/utils/hash.util');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    return successResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    const result = await authService.register(name, email, password, role);
    return successResponse(res, 201, 'User created successfully', result.user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    if (password) {
      user.password = await hashPassword(password);
    }
    
    await user.save();
    
    // Create safe user object to return
    const safeUser = user.toJSON();
    delete safeUser.password;
    
    return successResponse(res, 200, 'User updated successfully', safeUser);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.destroy();
    return successResponse(res, 200, 'User deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
