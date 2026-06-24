const express = require('express');
const router = express.Router();
const approvalController = require('./approval.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorizeRoles } = require('../../shared/middlewares/role.middleware');

router.post(
  '/:approvalId/process',
  authenticate,
  authorizeRoles('HR Manager', 'Operations Manager', 'Director'),
  approvalController.processApproval
);

module.exports = router;
