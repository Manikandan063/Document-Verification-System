const approvalService = require('./approval.service');
const { successResponse, errorResponse } = require('../../shared/utils/response.util');
const { approvalSchema } = require('./approval.validation');

exports.processApproval = async (req, res, next) => {
  try {
    const { approvalId } = approvalSchema.parse({ 
      body: req.body,
      params: req.params 
    }).params;
    
    const { status, comments } = req.body;

    const result = await approvalService.processApproval(
      approvalId,
      req.user.id,
      req.user.role,
      status,
      comments
    );

    return successResponse(res, 200, 'Approval processed successfully', result);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
        return errorResponse(res, 403, error.message);
    }
    next(error);
  }
};
