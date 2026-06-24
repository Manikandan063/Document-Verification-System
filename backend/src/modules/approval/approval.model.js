const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Approval = sequelize.define('Approval', {
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
  approver_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Modification Required'),
    defaultValue: 'Pending',
  },
  comments: {
    type: DataTypes.TEXT,
  },
  step: {
    type: DataTypes.INTEGER, // 1: HR Manager, 2: Ops Manager, 3: Director
    allowNull: false,
  }
}, {
  tableName: 'approvals',
  timestamps: true,
});

module.exports = Approval;
