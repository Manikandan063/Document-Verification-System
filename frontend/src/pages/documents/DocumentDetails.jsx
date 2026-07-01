import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, User, CheckCircle, AlertTriangle, Info, ArrowLeft, Loader2, Sparkles, AlertCircle, FileSearch, CheckCircle2, XCircle } from 'lucide-react';

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Approval states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchDoc = async () => {
    try {
      const res = await api.get(`/documents/${id}`);
      setDoc(res.data.data);
    } catch (error) {
      console.error('Failed to fetch document', error);
      alert('Failed to load document details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [id]);

  const handleViewPdf = () => {
    const latestVersion = doc?.versions?.[0];
    if (latestVersion && latestVersion.file_path) {
      const normalizedPath = latestVersion.file_path.replace(/\\/g, '/');
      window.open(`https://document-verification-system-ai.onrender.com/${normalizedPath}`, '_blank');
    } else {
      alert("PDF file not found.");
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.post(`/documents/${id}/analyze`);
      setDoc(prev => {
        const newDoc = { ...prev };
        if (newDoc.versions && newDoc.versions.length > 0) {
          newDoc.versions[0].ai_analysis = res.data.data;
        }
        return newDoc;
      });
    } catch (error) {
      console.error('AI Analysis failed', error);
      alert(error.response?.data?.message || 'AI Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProcessApproval = async (status) => {
    if (status === 'Rejected' && !rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    const pendingApproval = doc?.approvals?.find(a => a.status === 'Pending' && a.role === user?.role);
    if (!pendingApproval) return;

    setIsProcessing(true);
    try {
      await api.post(`/approvals/${pendingApproval.id}/process`, {
        status,
        comments: status === 'Rejected' ? rejectReason : 'Approved after review.'
      });
      await fetchDoc();
      setShowRejectForm(false);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to process approval', error);
      alert(error.response?.data?.message || 'Failed to process approval.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Document not found.</p>
        <button onClick={() => navigate('/documents')} className="text-brand-purple hover:underline">Go back to all documents</button>
      </div>
    );
  }

  const latestVersion = doc.versions && doc.versions.length > 0 ? doc.versions[0] : null;
  const aiAnalysis = latestVersion ? latestVersion.ai_analysis : null;
  const approvals = doc.approvals || [];
  const pendingApproval = approvals.find(a => a.status === 'Pending' && a.role === user?.role);
  const viewHistory = searchParams.get('view') === 'history';

  // Specific Role Analysis Mapping
  let roleAnalysisData = null;
  let roleAnalysisTitle = '';

  if (user?.role === 'HR Manager') {
    roleAnalysisData = aiAnalysis?.hr_analysis || {};
    roleAnalysisTitle = 'HR Manager Analysis';
  } else if (user?.role === 'Operations Manager') {
    roleAnalysisData = aiAnalysis?.ops_analysis || {};
    roleAnalysisTitle = 'Operations Manager Analysis';
  } else if (user?.role === 'Director') {
    roleAnalysisData = aiAnalysis?.director_analysis || {};
    roleAnalysisTitle = 'Director Analysis';
  }

  const renderList = (items, emptyMsg = "Verified success document is good.") => {
    if (!items || items.length === 0) return <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 py-1"><CheckCircle2 size={14} /> {emptyMsg}</p>;
    return (
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple/70 mt-1.5 shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Documents
      </button>

      {/* Document Information Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
            {doc.title}
            <StatusBadge status={doc.status} />
          </h1>
          <div className="text-gray-500 mt-2 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><FileText size={14} /> v{latestVersion?.version_number || '1'}.0</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(doc.createdAt).toLocaleDateString()}</span>
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
              aiAnalysis?.provider === 'Gemini' 
                ? 'text-sky-700 bg-sky-50 border-sky-200' 
                : aiAnalysis?.provider === 'Groq'
                ? 'text-orange-700 bg-orange-50 border-orange-200'
                : 'text-brand-purple bg-brand-purple/10 border-brand-purple/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                aiAnalysis?.provider === 'Gemini' ? 'bg-sky-500' : 
                aiAnalysis?.provider === 'Groq' ? 'bg-orange-500' : 'bg-brand-purple'
              }`}></div>
              {aiAnalysis?.provider || 'AI Analysed'}
            </span>
          </div>
        </div>
        <button 
          onClick={handleViewPdf}
          className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-dark/90 transition-colors shadow-sm"
        >
          View PDF
        </button>
      </div>

      <div className={viewHistory ? "max-w-2xl mx-auto w-full" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
        {/* Left Column: AI Analysis - Hidden on History View */}
        {!viewHistory && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Common AI Analysis */}
            {aiAnalysis ? (
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gradient-to-r from-brand-purple/10 to-transparent p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                      <Sparkles size={18} />
                    </div>
                    <h2 className="font-semibold text-brand-dark">Common AI Analysis</h2>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {aiAnalysis.createdAt && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(aiAnalysis.createdAt).toLocaleString()}
                      </span>
                    )}
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-medium shadow-[0_4px_12px_rgba(107,70,193,0.25)] hover:shadow-[0_6px_16px_rgba(107,70,193,0.35)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                    >
                      {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Summary */}
                  {aiAnalysis.summary && aiAnalysis.summary.trim() !== '' && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={16} className="text-brand-purple" /> Document Summary
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed p-4 bg-gray-50 rounded-xl border border-gray-100">{aiAnalysis.summary}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Points */}
                    {aiAnalysis.key_points && aiAnalysis.key_points.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-600" /> Key Points
                        </h3>
                        <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 h-full">
                          {renderList(aiAnalysis.key_points)}
                        </div>
                      </div>
                    )}
                    
                    {/* Risks */}
                    {aiAnalysis.risk_points && aiAnalysis.risk_points.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-red-600" /> Risk Factors
                        </h3>
                        <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 h-full">
                          {renderList(aiAnalysis.risk_points)}
                        </div>
                      </div>
                    )}

                    {/* Missing Info */}
                    {aiAnalysis.missing_information && aiAnalysis.missing_information.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <FileSearch size={16} className="text-amber-600" /> Missing Information
                        </h3>
                        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 h-full">
                          {renderList(aiAnalysis.missing_information)}
                        </div>
                      </div>
                    )}

                    {/* Important Changes */}
                    {aiAnalysis.important_changes && aiAnalysis.important_changes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <AlertCircle size={16} className="text-blue-600" /> Important Highlights
                        </h3>
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 h-full">
                          {renderList(aiAnalysis.important_changes)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center relative overflow-hidden">
                {isAnalyzing && (
                  <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                    <Loader2 className="text-brand-purple animate-spin mb-4" size={32} />
                    <h3 className="text-sm font-bold text-brand-dark">Generating AI Analysis...</h3>
                  </div>
                )}
                <Sparkles className="mx-auto text-gray-300 mb-4" size={40} />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No AI Analysis Found</h3>
                <p className="text-sm text-gray-500 mb-6">This document has not been analyzed by the AI engine.</p>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mx-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-purple text-white rounded-xl text-sm font-medium hover:bg-brand-purple/90 transition-colors shadow-sm"
                >
                  <Sparkles size={16} /> Run AI Analysis
                </button>
              </div>
            )}

            {/* Role-Based AI Analysis */}
            {roleAnalysisTitle && (
              <div className="bg-white rounded-2xl shadow-soft border border-brand-purple/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple"></div>
                <div className="border-b border-gray-100 bg-brand-purple/5 p-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <h2 className="font-semibold text-brand-dark text-lg">{roleAnalysisTitle}</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Role-Specific Risks</h4>
                      {renderList(roleAnalysisData.risks)}
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        {user.role === 'HR Manager' ? 'Compliance Issues' : user.role === 'Operations Manager' ? 'Resource / Continuity' : 'Business / Financial Impact'}
                      </h4>
                      {renderList(
                        user.role === 'HR Manager' ? roleAnalysisData.compliance_issues :
                        user.role === 'Operations Manager' ? [...(roleAnalysisData.resource_impact || []), ...(roleAnalysisData.business_continuity || [])] :
                        [...(roleAnalysisData.business_impact || []), ...(roleAnalysisData.financial_impact || [])]
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-brand-purple/5 rounded-xl border border-brand-purple/10">
                      <h4 className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-3">Review Checklist</h4>
                      {renderList(roleAnalysisData.checklist)}
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">AI Suggestions</h4>
                      {renderList(roleAnalysisData.suggestions)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Approval Workflow & Action Buttons */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 sticky top-6">
            <h2 className="font-semibold text-brand-dark mb-4">Approval Workflow</h2>
            
            {approvals.length > 0 ? (
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 py-2">
                {approvals.map((approval, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                      approval.status === 'Approved' ? 'bg-green-500' : 
                      approval.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-400'
                    }`}></span>
                    <h4 className="text-sm font-medium text-brand-dark">{approval.role}</h4>
                    <p className="text-xs text-gray-500 mt-1">Status: <span className="font-medium">{approval.status}</span></p>
                    {approval.comments && approval.status === 'Rejected' && (
                      <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs text-red-700"><span className="font-semibold">Reason:</span> {approval.comments}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Workflow not started.</p>
            )}

            {/* Action Buttons for Current Approver */}
            {pendingApproval && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-brand-dark mb-3">Your Action Required</h3>
                
                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleProcessApproval('Approved')}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      Approve
                    </button>
                    <button 
                      onClick={() => setShowRejectForm(true)}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-medium text-gray-700 block">Reason for Rejection *</label>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please specify errors, missing information, or reasons for rejecting this document..."
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px] resize-none"
                    ></textarea>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleProcessApproval('Rejected')}
                        disabled={isProcessing || !rejectReason.trim()}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? 'Processing...' : 'Confirm'}
                      </button>
                      <button 
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectReason('');
                        }}
                        disabled={isProcessing}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
