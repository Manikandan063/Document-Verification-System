import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { GitMerge, Plus, ArrowDown, Settings } from 'lucide-react';

export default function ApprovalWorkflow() {
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-start mb-8">
        <PageTitle title="Approval Workflow Configuration" subtitle="Define the mandatory approval steps for document categories." />
        <button className="bg-brand-dark text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-dark/90 flex items-center gap-2 text-sm">
          <Plus size={16} /> Create Workflow
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <GitMerge size={20} className="text-brand-purple" /> 
            Leave Policy Workflow
          </h3>
          <button className="text-gray-400 hover:text-brand-dark"><Settings size={18} /></button>
        </div>
        
        <div className="p-8 bg-brand-offwhite/50 flex flex-col items-center">
          <div className="w-64 bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Step 1</p>
            <p className="font-bold text-brand-dark">HR Executive</p>
            <p className="text-xs text-brand-green mt-1">Uploads Document</p>
          </div>
          
          <ArrowDown size={24} className="text-gray-300 my-3" />
          
          <div className="w-64 bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center border-l-4 border-l-brand-purple">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Step 2</p>
            <p className="font-bold text-brand-dark">HR Manager</p>
            <p className="text-xs text-gray-500 mt-1">Review & Checklist</p>
          </div>
          
          <ArrowDown size={24} className="text-gray-300 my-3" />
          
          <div className="w-64 bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center border-l-4 border-l-brand-purple">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Step 3</p>
            <p className="font-bold text-brand-dark">Operations Manager</p>
            <p className="text-xs text-gray-500 mt-1">Operational Review</p>
          </div>
          
          <ArrowDown size={24} className="text-gray-300 my-3" />
          
          <div className="w-64 bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center border-l-4 border-l-brand-brightgreen">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Step 4 (Final)</p>
            <p className="font-bold text-brand-dark">Director</p>
            <p className="text-xs text-gray-500 mt-1">Final Approval</p>
          </div>
        </div>
      </div>
    </div>
  );
}
