const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');
const upload = require('../../shared/middlewares/upload.middleware');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorizeRoles } = require('../../shared/middlewares/role.middleware');

router.post(
  '/',
  authenticate,
  authorizeRoles('HR Executive', 'Admin', 'Operations Manager', 'HR Manager', 'Director'),
  upload.single('file'),
  documentController.uploadDocument
);

router.get(
  '/',
  authenticate,
  documentController.getAllDocuments
);

router.get(
  '/:id',
  authenticate,
  documentController.getDocumentDetails
);

router.post(
  '/:id/analyze',
  authenticate,
  authorizeRoles('HR Executive', 'HR Manager', 'Operations Manager', 'Director', 'Admin'),
  documentController.analyzeDocument
);

module.exports = router;
