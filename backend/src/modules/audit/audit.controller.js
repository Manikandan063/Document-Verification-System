const auditService = require('./audit.service');
const { successResponse } = require('../../shared/utils/response.util');

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await auditService.getAuditLogs();
    return successResponse(res, 200, 'Audit logs fetched', logs);
  } catch (error) {
    next(error);
  }
};
