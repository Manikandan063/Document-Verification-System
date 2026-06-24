import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PendingApprovals() {
  const [pendingDocs, setPendingDocs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/documents').then(res => {
      setPendingDocs(res.data.filter(d => {
        if (!d.approvals) return false;
        return d.approvals.some(a => a.role === user?.role && a.status === 'Pending');
      }));
    }).catch(console.error);
  }, [user]);

  return (
    <div>
      <PageTitle title="Pending Approvals" subtitle="Documents that are currently waiting for your review." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingDocs.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 hover:border-brand-purple/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-cream/50 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <StatusBadge status={doc.status} />
            </div>
            
            <h3 className="text-lg font-bold text-brand-dark mb-1">{doc.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{doc.category} • {doc.version}</p>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">Uploaded {doc.date}</span>
              <Link to={`/documents/${doc.id}`} className="text-sm font-medium bg-brand-dark text-white px-4 py-2 rounded-lg hover:bg-brand-dark/90">
                Review Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
