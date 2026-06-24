const Document = require('../document/document.model');
const Approval = require('../approval/approval.model');

exports.getDashboardStats = async () => {
  const totalDocuments = await Document.count();
  const pendingApprovals = await Document.count({
    where: {
      status: ['Pending HR Manager', 'Pending Operations Manager', 'Pending Director']
    }
  });
  const approvedDocuments = await Document.count({ where: { status: 'Approved' } });
  const rejectedDocuments = await Document.count({ where: { status: 'Rejected' } });

  return {
    totalDocuments,
    pendingApprovals,
    approvedDocuments,
    rejectedDocuments,
  };
};

exports.getPendingApprovalsForUser = async (userId) => {
  return await Approval.findAll({
    where: {
      approver_id: userId,
      status: 'Pending'
    },
    include: [
      {
        model: Document,
        as: 'document'
      }
    ]
  });
};
