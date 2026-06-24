const commentService = require('./comment.service');
const { successResponse } = require('../../shared/utils/response.util');

exports.getDocumentComments = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const comments = await commentService.getCommentsByDocument(documentId);
    return successResponse(res, 200, 'Comments fetched', comments);
  } catch (error) {
    next(error);
  }
};
