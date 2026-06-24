import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ApprovalHistoryPage() {
  const [historyDocs, setHistoryDocs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/documents').then(res => {
      setHistoryDocs(res.data.filter(d => {
        if (!d.approvals) return false;
        return d.approvals.some(a => a.role === user?.role && (a.status === 'Approved' || a.status === 'Rejected'));
      }));
    }).catch(console.error);
  }, [user]);

  return (
    <div>
      <PageTitle title="Approval History" subtitle="Archive of documents you have previously reviewed." />

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Document</th>
              <th className="px-6 py-4 font-medium">Decision</th>
              <th className="px-6 py-4 font-medium">Date Reviewed</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {historyDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-dark">{doc.title}</td>
                <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                <td className="px-6 py-4 text-gray-500">{doc.date}</td>
                <td className="px-6 py-4">
                  <Link to={`/documents/${doc.id}?view=history`} className="text-brand-purple font-medium hover:underline">View History</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
