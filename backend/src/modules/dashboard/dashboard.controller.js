const dashboardService = require('./dashboard.service');
const { successResponse } = require('../../shared/utils/response.util');

exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    let pendingApprovals = [];
    
    // If the user is an approver, get their pending approvals
    if (['HR Manager', 'Operations Manager', 'Director'].includes(req.user.role)) {
      pendingApprovals = await dashboardService.getPendingApprovalsForUser(req.user.id);
    }

    return successResponse(res, 200, 'Dashboard data fetched', { stats, pendingApprovals });
  } catch (error) {
    next(error);
  }
};
