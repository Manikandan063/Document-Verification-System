import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';
import { FileText, CheckSquare, XCircle, Bot, CheckCircle, Users, GitMerge, Activity, ServerCrash } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingApprovals: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0
  });
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Fetch dashboard stats
    api.get('/dashboard')
      .then(res => {
        if (res.data?.data?.stats) {
          setStats(res.data.data.stats);
        }
      })
      .catch(console.error);
    
    // Fetch users for total users count
    api.get('/users')
      .then(res => {
        if (res.data?.data) {
          setTotalUsers(res.data.data.length);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <PageTitle title="System Admin Dashboard" subtitle="Platform overview, metrics, and global health status." />
        <div className="bg-brand-brightgreen/20 text-green-800 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold border border-brand-brightgreen">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Gemini AI Online
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Documents" value={stats.totalDocuments} icon={FileText} />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={CheckSquare} colorClass="bg-brand-cream/80" />
        <StatCard title="Approved Documents" value={stats.approvedDocuments} icon={CheckCircle} colorClass="bg-brand-brightgreen/30" />
        <StatCard title="Rejected Documents" value={stats.rejectedDocuments} icon={XCircle} colorClass="bg-brand-purple/20" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} colorClass="bg-brand-green/20" />
        <StatCard title="Total Departments" value="0" icon={GitMerge} />
        <StatCard title="Total AI Analyses" value={stats.totalDocuments} icon={Bot} />
        <StatCard title="System Health" value="100%" icon={Activity} colorClass="bg-brand-brightgreen/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-400 font-medium">Analytics pending new data...</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-gray-400 font-medium mb-2">Distribution pending</p>
          <div className="w-40 h-40 rounded-full border-8 border-gray-100 mt-4"></div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">Latest System Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <p className="text-sm text-gray-500 italic">No recent activity found. Configure workflows or create users to populate audit logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
