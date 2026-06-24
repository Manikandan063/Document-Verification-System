import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { Bot, AlertTriangle, ListChecks, FileText } from 'lucide-react';

export default function AdminAIAnalysis() {
  return (
    <div className="max-w-5xl">
      <PageTitle title="AI Analysis Management" subtitle="Monitor and configure the AI summaries and risk detection rules." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-brand-dark">Summary Configuration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">The AI currently generates a 3-paragraph summary and extracts exactly 5 key points per document.</p>
          <button className="text-sm font-medium text-brand-purple hover:underline">Edit Summary Rules →</button>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-brand-dark">Risk Detection</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">AI flags documents containing unapproved budgets, policy conflicts, or missing mandatory compliance clauses.</p>
          <button className="text-sm font-medium text-brand-purple hover:underline">Manage Risk Keywords →</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <ListChecks size={20} className="text-brand-green" /> 
            Role-Based AI Suggestions
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold text-brand-dark mb-1">HR Manager Checklist</p>
              <p className="text-sm text-gray-500">AI automatically suggests checking employment law compliance and employee benefit impact.</p>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100">Configure</button>
          </div>
          <div className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold text-brand-dark mb-1">Operations Manager Checklist</p>
              <p className="text-sm text-gray-500">AI evaluates operational feasibility, timeline risks, and resource requirements.</p>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100">Configure</button>
          </div>
          <div className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold text-brand-dark mb-1">Director Checklist</p>
              <p className="text-sm text-gray-500">AI highlights total budget impact, enterprise risk, and strategic alignment.</p>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100">Configure</button>
          </div>
        </div>
      </div>
    </div>
  );
}
