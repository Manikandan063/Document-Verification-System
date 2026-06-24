import React from 'react';
import PageTitle from '../../components/common/PageTitle';

export default function Settings() {
  return (
    <div className="max-w-2xl">
      <PageTitle title="System Settings" subtitle="Configure AI models and global workflow preferences." />

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-brand-dark mb-4">AI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Provider</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
                <option>Google Gemini (gemini-2.5-flash)</option>
                <option>Groq (llama3-8b-8192)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fallback Provider</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white" defaultValue="Groq">
                <option value="Groq">Groq (llama3-8b-8192)</option>
                <option value="Gemini">Google Gemini</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-brand-dark mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-brand-purple rounded" defaultChecked />
              <span className="text-sm text-gray-700">Email me when a document needs my approval</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-brand-purple rounded" defaultChecked />
              <span className="text-sm text-gray-700">Email me when my document is approved/rejected</span>
            </label>
          </div>
        </div>
        
        <button className="bg-brand-dark text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-dark/90">
          Save Settings
        </button>
      </div>
    </div>
  );
}
