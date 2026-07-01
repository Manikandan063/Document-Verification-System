import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import api from '../../services/api';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Employee Document');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !title) {
      alert('Please provide a document title and select a file.');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('version', version);
      formData.append('description', description);
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch('https://document-verification-system-ai.onrender.com/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const detailMsg = errorData.errors ? errorData.errors.map(e => e.message).join(', ') : '';
        throw new Error(detailMsg ? `${errorData.message}: ${detailMsg}` : errorData.message || 'Failed to upload document.');
      }
      
      alert('Document uploaded successfully!');
      navigate('/documents');
    } catch (error) {
      console.error('Upload failed', error);
      alert(error.message || 'Failed to upload document.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <PageTitle title="Upload Document" subtitle="Upload a new PDF to initiate the approval workflow." />

      <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Document File (PDF)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-brand-purple/5 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
            {file ? (
              <div className="flex flex-col items-center">
                <File className="text-brand-purple mb-3" size={40} />
                <p className="text-sm font-medium text-brand-dark">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <UploadCloud className="text-gray-400 mb-4" size={48} />
                <p className="text-base font-medium text-brand-dark">Drag & drop your PDF here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse from your computer</p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/50 focus:outline-none" 
              placeholder="e.g. Employee Handbook 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/50 focus:outline-none bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Employee Document</option>
              <option>Office Document</option>
              <option>HR Policy</option>
              <option>Legal</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/50 focus:outline-none" 
              placeholder="e.g. v2.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description / Notes</label>
          <textarea 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/50 focus:outline-none" 
            rows="4" 
            placeholder="Add any specific context or notes for the reviewers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-3 rounded-xl font-medium bg-brand-dark text-white hover:bg-brand-dark/90 transition-colors flex items-center gap-2 disabled:opacity-70"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            {loading ? 'Uploading Document...' : 'Upload Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
