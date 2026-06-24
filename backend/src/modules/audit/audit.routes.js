const express = require('express');
const router = express.Router();
const auditController = require('./audit.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorizeRoles } = require('../../shared/middlewares/role.middleware');

router.get('/', authenticate, authorizeRoles('Admin', 'Director'), auditController.getLogs);

module.exports = router;
