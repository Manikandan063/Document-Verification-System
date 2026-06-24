const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('./comment.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');

router.get('/', authenticate, commentController.getDocumentComments);

module.exports = router;
