const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'Draft',
      'Pending HR Manager',
      'Pending Operations Manager',
      'Pending Director',
      'Approved',
      'Rejected',
      'Modification Required'
    ),
    defaultValue: 'Draft',
  },
  created_by_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'documents',
  timestamps: true,
});

module.exports = Document;
