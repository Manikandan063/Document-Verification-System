const Comment = require('./comment.model');

exports.getCommentsByDocument = async (documentId) => {
  return await Comment.findAll({
    where: { document_id: documentId },
    order: [['createdAt', 'DESC']]
  });
};
