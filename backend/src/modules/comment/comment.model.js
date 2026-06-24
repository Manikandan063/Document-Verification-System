const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  document_version_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'comments',
  timestamps: true,
});

module.exports = Comment;
