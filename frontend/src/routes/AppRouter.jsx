import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

// Pages
import Dashboard from '../pages/dashboard/Dashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import UploadDocument from '../pages/documents/UploadDocument';
import AllDocuments from '../pages/documents/AllDocuments';
import DocumentDetails from '../pages/documents/DocumentDetails';
import PendingApprovals from '../pages/approvals/PendingApprovals';
import ApprovalHistoryPage from '../pages/approvals/ApprovalHistoryPage';
import AuditLogs from '../pages/audit/AuditLogs';
import UsersRoles from '../pages/users/UsersRoles';
import Settings from '../pages/settings/Settings';
import Profile from '../pages/profile/Profile';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import GenericAdminPage from '../pages/admin/GenericAdminPage';
import ApprovalWorkflow from '../pages/admin/ApprovalWorkflow';
import AdminAIAnalysis from '../pages/admin/AdminAIAnalysis';

import { useAuth } from '../context/AuthContext';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-brand-offwhite">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function AppRouter() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Base Redirect */}
        <Route index element={user.role === 'Admin' ? <Navigate to="/admin" /> : <Dashboard />} />
        
        {/* Standard Routes */}
        <Route path="upload" element={<UploadDocument />} />
        <Route path="documents" element={<AllDocuments />} />
        <Route path="documents/:id" element={<DocumentDetails />} />
        <Route path="approvals/pending" element={<PendingApprovals />} />
        <Route path="approvals/history" element={<ApprovalHistoryPage />} />
        
        {/* Additional Standard Routes */}
        <Route path="reports" element={<GenericAdminPage title="Team Reports" subtitle="View analytics and productivity reports for your team." />} />
        <Route path="workflows" element={<GenericAdminPage title="Department Workflows" subtitle="Manage and monitor the approval chains for your department." />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        
        <Route path="admin/documents" element={<GenericAdminPage title="All Documents" subtitle="System-wide document repository." />} />
        <Route path="admin/documents/versions" element={<GenericAdminPage title="Document Versions" subtitle="Manage and rollback document histories." />} />
        <Route path="admin/documents/archived" element={<GenericAdminPage title="Archived Documents" subtitle="Access deleted or deprecated documents." />} />
        
        <Route path="admin/users" element={<UsersRoles />} />
        <Route path="admin/roles" element={<GenericAdminPage title="Roles & Permissions" subtitle="Configure granular access control." />} />
        <Route path="admin/departments" element={<GenericAdminPage title="Departments" subtitle="Manage organizational units." />} />
        
        <Route path="admin/workflow" element={<ApprovalWorkflow />} />
        <Route path="admin/workflow/templates" element={<GenericAdminPage title="Workflow Templates" subtitle="Pre-defined approval chains." />} />
        
        <Route path="admin/ai/analysis" element={<AdminAIAnalysis />} />
        <Route path="admin/ai/comparison" element={<GenericAdminPage title="AI Comparison Rules" subtitle="Configure diff logic for document updates." />} />
        <Route path="admin/ai/settings" element={<Settings />} />
        <Route path="admin/ai/prompts" element={<GenericAdminPage title="Prompt Templates" subtitle="System prompts for LLM instructions." />} />
        
        <Route path="admin/reports" element={<GenericAdminPage title="Reports & Analytics" subtitle="Exportable system statistics." />} />
        <Route path="admin/audit" element={<AuditLogs />} />
        <Route path="admin/notifications" element={<GenericAdminPage title="Notifications" subtitle="System-wide alert configurations." />} />
        <Route path="admin/settings" element={<Settings />} />
      </Route>
      
      {/* Fallback redirect for logged in users on invalid URLs like /register */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
