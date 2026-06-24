const Approval = require('./approval.model');
const Document = require('../document/document.model');
const Comment = require('../comment/comment.model');
const { logAction } = require('../audit/audit.service');
const { sequelize } = require('../../config/db');
const User = require('../auth/auth.model');

exports.processApproval = async (approvalId, userId, userRole, status, commentsText) => {
  const transaction = await sequelize.transaction();
  try {
    const approval = await Approval.findByPk(approvalId, { transaction });
    
    if (!approval) throw new Error('Approval not found');
    if (approval.approver_id !== userId) throw new Error('Unauthorized approver');
    if (approval.status !== 'Pending') throw new Error('Approval already processed');

    const document = await Document.findByPk(approval.document_id, { transaction });

    // Update approval status
    approval.status = status;
    approval.comments = commentsText;
    await approval.save({ transaction });

    if (commentsText) {
      await Comment.create({
        document_id: document.id,
        document_version_id: approval.document_version_id,
        user_id: userId,
        text: commentsText,
      }, { transaction });
    }

    if (status === 'Rejected' || status === 'Modification Required') {
      document.status = status;
      await document.save({ transaction });
    } else if (status === 'Approved') {
      // Move to next step
      let nextStep = approval.step + 1;
      let nextRole = null;
      let nextDocStatus = null;

      if (nextStep === 2) {
        nextRole = 'Operations Manager';
        nextDocStatus = 'Pending Operations Manager';
      } else if (nextStep === 3) {
        nextRole = 'Director';
        nextDocStatus = 'Pending Director';
      }

      if (nextRole) {
        const nextApprovers = await User.findAll({ where: { role: nextRole }, transaction });
        if (nextApprovers.length > 0) {
          await Approval.create({
            document_id: document.id,
            document_version_id: approval.document_version_id,
            approver_id: nextApprovers[0].id,
            role: nextRole,
            status: 'Pending',
            step: nextStep
          }, { transaction });
          document.status = nextDocStatus;
        } else {
           throw new Error(`No ${nextRole} found in the system`);
        }
      } else {
        // Final approval step completed
        document.status = 'Approved';
      }
      await document.save({ transaction });
    }

    await logAction(userId, 'PROCESS_APPROVAL', 'Approval', approval.id, { status, commentsText });

    await transaction.commit();
    return { approval, documentStatus: document.status };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
