const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');

router.get('/', authenticate, dashboardController.getDashboard);

module.exports = router;
