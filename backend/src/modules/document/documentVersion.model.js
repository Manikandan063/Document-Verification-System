const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const DocumentVersion = sequelize.define('DocumentVersion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  version_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  document_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extracted_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  uploaded_by_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'document_versions',
  timestamps: true,
});

module.exports = DocumentVersion;
