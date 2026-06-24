import { LayoutDashboard, FileText, CheckSquare, FileCheck, Users, Settings, LogOut, Activity, Database, Shield, GitMerge, Bot, BarChart2, Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const standardLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Document', path: '/upload', icon: FileText, roles: ['HR Executive'] },
    { name: 'All Documents', path: '/documents', icon: FileText, roles: ['HR Executive', 'HR Manager', 'Operations Manager', 'Director'] },
    { name: 'Pending Approvals', path: '/approvals/pending', icon: CheckSquare, roles: ['HR Manager', 'Operations Manager', 'Director'] },
    { name: 'Approval History', path: '/approvals/history', icon: FileCheck, roles: ['HR Manager', 'Operations Manager', 'Director'] },
    { name: 'Team Reports', path: '/reports', icon: BarChart2, roles: ['HR Manager', 'Operations Manager', 'Director'] },
    { name: 'Workflows', path: '/workflows', icon: GitMerge, roles: ['Operations Manager', 'Director'] },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminCategories = [
    {
      title: "Document Management",
      links: [
        { name: 'All Documents', path: '/admin/documents', icon: Database },
        { name: 'Document Versions', path: '/admin/documents/versions', icon: FileText },
        { name: 'Archived Documents', path: '/admin/documents/archived', icon: FileText },
      ]
    },
    {
      title: "User Management",
      links: [
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
        { name: 'Departments', path: '/admin/departments', icon: Users },
      ]
    },
    {
      title: "Workflow Management",
      links: [
        { name: 'Approval Workflow', path: '/admin/workflow', icon: GitMerge },
        { name: 'Workflow Templates', path: '/admin/workflow/templates', icon: FileCheck },
      ]
    },
    {
      title: "AI Management",
      links: [
        { name: 'AI Analysis', path: '/admin/ai/analysis', icon: Bot },
        { name: 'AI Comparison', path: '/admin/ai/comparison', icon: GitMerge },
        { name: 'AI Settings', path: '/admin/ai/settings', icon: Settings },
        { name: 'Prompt Templates', path: '/admin/ai/prompts', icon: FileText },
      ]
    },
    {
      title: "System",
      links: [
        { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart2 },
        { name: 'Audit Logs', path: '/admin/audit', icon: Activity },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'System Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const renderLink = (link) => (
    <NavLink
      key={link.path}
      to={link.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
          isActive 
            ? "bg-brand-purple/20 text-brand-purple" 
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )
      }
    >
      <link.icon size={18} />
      <span className="font-medium text-sm">{link.name}</span>
    </NavLink>
  );

  return (
    <div className="w-72 h-screen bg-brand-dark text-white flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wider text-brand-cream">
          {user?.company || 'Xtown'} DVS<span className="text-brand-purple">.AI</span>
        </h1>
        <p className="text-xs text-brand-green mt-1">{user?.role === 'Admin' ? 'System Administrator' : 'Document Approval'}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {user?.role === 'Admin' ? (
          <>
            {renderLink({ name: 'System Dashboard', path: '/admin', icon: LayoutDashboard })}
            {adminCategories.map(cat => (
              <div key={cat.title} className="pt-4">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{cat.title}</p>
                <div className="space-y-1">
                  {cat.links.map(renderLink)}
                </div>
              </div>
            ))}
          </>
        ) : (
          standardLinks.filter(link => !link.roles || link.roles.includes(user?.role)).map(renderLink)
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-brand-green">{user?.role}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
