const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./shared/middlewares/error.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const documentRoutes = require('./modules/document/document.routes');
const approvalRoutes = require('./modules/approval/approval.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const commentRoutes = require('./modules/comment/comment.routes');
const auditRoutes = require('./modules/audit/audit.routes');
const userRoutes = require('./modules/user/user.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically if needed
app.use('/uploads', express.static('uploads'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
// Mount comments inside documents
app.use('/api/documents/:documentId/comments', commentRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
