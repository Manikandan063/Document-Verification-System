import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';
import { FileText, CheckSquare, XCircle, Bot, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, aiAnalyses: 0 });

  useEffect(() => {
    // get('/documents') returns the raw array according to the controller update
    api.get('/documents').then(res => setDocuments(res.data.data || res.data)).catch(console.error);
    
    // get('/dashboard') returns successResponse -> { success, data: { stats, pendingApprovals } }
    api.get('/dashboard').then(res => {
      if (res.data && res.data.data && res.data.data.stats) {
        const s = res.data.data.stats;
        setStats({
          total: s.totalDocuments || 0,
          pending: s.pendingApprovals || 0,
          approved: s.approvedDocuments || 0,
          rejected: s.rejectedDocuments || 0,
          aiAnalyses: s.totalDocuments || 0 // Assuming all docs have AI analysis
        });
      }
    }).catch(console.error);
  }, []);
  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Overview of your document approval workflow" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Documents" value={stats.total} icon={FileText} colorClass="bg-white" />
        <StatCard title="Pending" value={stats.pending} icon={CheckSquare} colorClass="bg-brand-cream/50" />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle} colorClass="bg-brand-brightgreen/20" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircle} colorClass="bg-red-50" />
        <StatCard title="AI Analyses" value={stats.aiAnalyses} icon={Bot} colorClass="bg-brand-purple/20" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">Recent Documents</h2>
          <Link to="/documents" className="text-sm font-medium text-brand-purple hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Document Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Version</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-dark">{doc.title}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.category}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.version}</td>
                  <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 text-gray-500">{doc.date}</td>
                  <td className="px-6 py-4">
                    <Link to={`/documents/${doc.id}`} className="text-brand-purple font-medium hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
