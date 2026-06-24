const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AiAnalysis = sequelize.define('AiAnalysis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_version_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  document_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: DataTypes.TEXT,
  key_points: DataTypes.JSONB,
  risk_points: DataTypes.JSONB,
  missing_information: DataTypes.JSONB,
  important_changes: DataTypes.JSONB,
  hr_analysis: DataTypes.JSONB,
  ops_analysis: DataTypes.JSONB,
  director_analysis: DataTypes.JSONB,
  added_content: DataTypes.JSONB,
  removed_content: DataTypes.JSONB,
  modified_content: DataTypes.JSONB,
  policy_impact: DataTypes.TEXT,
  risk_impact: DataTypes.TEXT,
  provider: {
    type: DataTypes.STRING, // 'Gemini' or 'Groq'
  }
}, {
  tableName: 'ai_analyses',
  timestamps: true,
});

module.exports = AiAnalysis;
