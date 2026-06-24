import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Search, Filter, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AllDocuments() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/documents').then(res => setDocuments(res.data.data || res.data)).catch(console.error);
  }, []);

  const filteredDocuments = documents.filter(doc => 
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageTitle title="All Documents" subtitle="Browse and manage all uploaded documents in the system." />

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-sm" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter by Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-gray-500 text-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Document Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Version</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Uploaded By</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-dark flex items-center gap-3">
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{doc.category}</td>
                  <td className="px-6 py-4 text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{doc.version}</span></td>
                  <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 text-gray-500">{doc.uploader}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.date}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <Link to={`/documents/${doc.id}`} className="text-brand-purple font-medium hover:underline">View Details</Link>
                    {doc.status === 'Rejected' && user?.role === 'HR Executive' && (
                      <Link to="/upload" className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors border border-red-100">
                        <UploadCloud size={14} /> Reupload
                      </Link>
                    )}
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
