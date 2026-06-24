import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Briefcase, Building } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <PageTitle title="My Profile" subtitle="View and manage your account details." />

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mt-6">
        <div className="h-32 bg-gradient-to-r from-brand-purple to-indigo-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-brand-purple -mt-12 mb-6">
            <User size={48} />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">{user?.name}</h2>
            <p className="text-brand-purple font-medium">{user?.role}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-gray-500">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-medium text-brand-dark">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-gray-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Access Role</p>
                <p className="font-medium text-brand-dark">{user?.role || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-gray-500">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</p>
                <p className="font-medium text-brand-dark">{user?.department || 'General'}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-gray-500">
                <Building size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Organization</p>
                <p className="font-medium text-brand-dark">{user?.company || 'Xtown DVS'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
