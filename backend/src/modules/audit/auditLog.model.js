const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSONB,
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
});

module.exports = AuditLog;
