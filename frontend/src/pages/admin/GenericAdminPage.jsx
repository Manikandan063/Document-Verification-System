import React from 'react';
import PageTitle from '../../components/common/PageTitle';
import { Hammer } from 'lucide-react';

export default function GenericAdminPage({ title, subtitle }) {
  return (
    <div className="max-w-5xl h-full flex flex-col">
      <PageTitle title={title} subtitle={subtitle} />
      
      <div className="flex-1 bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center justify-center p-12 text-center mt-4 min-h-[400px]">
        <div className="w-20 h-20 bg-brand-cream/50 text-yellow-600 rounded-full flex items-center justify-center mb-6">
          <Hammer size={32} />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">{title} Module</h2>
        <p className="text-gray-500 max-w-md">
          This system administration module is currently being configured. Future updates will include advanced controls and data grids for this section.
        </p>
      </div>
    </div>
  );
}
