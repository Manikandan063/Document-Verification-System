const { sequelize } = require('../config/db');
const User = require('../modules/auth/auth.model');
const Document = require('../modules/document/document.model');
const DocumentVersion = require('../modules/document/documentVersion.model');
const AiAnalysis = require('../modules/ai/aiAnalysis.model');
const Approval = require('../modules/approval/approval.model');
const Comment = require('../modules/comment/comment.model');
const AuditLog = require('../modules/audit/auditLog.model');

const initModels = async () => {
  // User associations
  User.hasMany(Document, { foreignKey: 'created_by_id', as: 'documents' });
  Document.belongsTo(User, { foreignKey: 'created_by_id', as: 'creator' });

  User.hasMany(DocumentVersion, { foreignKey: 'uploaded_by_id', as: 'uploads' });
  DocumentVersion.belongsTo(User, { foreignKey: 'uploaded_by_id', as: 'uploader' });

  User.hasMany(Approval, { foreignKey: 'approver_id', as: 'approvals' });
  Approval.belongsTo(User, { foreignKey: 'approver_id', as: 'approver' });

  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
  AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Document associations
  Document.hasMany(DocumentVersion, { foreignKey: 'document_id', as: 'versions' });
  DocumentVersion.belongsTo(Document, { foreignKey: 'document_id', as: 'document' });

  // Link current version directly if needed, but we can just query latest version
  Document.belongsTo(DocumentVersion, { foreignKey: 'current_version_id', as: 'currentVersion', constraints: false });

  Document.hasMany(Approval, { foreignKey: 'document_id', as: 'approvals' });
  Approval.belongsTo(Document, { foreignKey: 'document_id', as: 'document' });

  Document.hasMany(Comment, { foreignKey: 'document_id', as: 'comments' });
  Comment.belongsTo(Document, { foreignKey: 'document_id', as: 'document' });

  // DocumentVersion associations
  DocumentVersion.hasOne(AiAnalysis, { foreignKey: 'document_version_id', as: 'ai_analysis' });
  AiAnalysis.belongsTo(DocumentVersion, { foreignKey: 'document_version_id', as: 'version' });

  DocumentVersion.hasMany(Approval, { foreignKey: 'document_version_id', as: 'approvals' });
  Approval.belongsTo(DocumentVersion, { foreignKey: 'document_version_id', as: 'version' });

  DocumentVersion.hasMany(Comment, { foreignKey: 'document_version_id', as: 'comments' });
  Comment.belongsTo(DocumentVersion, { foreignKey: 'document_version_id', as: 'version' });

  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = { initModels };
