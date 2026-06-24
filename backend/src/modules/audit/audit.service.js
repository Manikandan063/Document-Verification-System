const AuditLog = require('./auditLog.model');

exports.getAuditLogs = async () => {
  return await AuditLog.findAll({
    order: [['createdAt', 'DESC']],
    limit: 100
  });
};

exports.logAction = async (user_id, action, entity_type, entity_id, details = {}, options = {}) => {
  try {
    return await AuditLog.create({
      user_id,
      action,
      entity_type,
      entity_id,
      details,
    }, options);
  } catch (error) {
    console.error('Failed to log action to audit trail:', error);
    // Don't throw, we usually don't want audit failures to break main workflows
  }
};
