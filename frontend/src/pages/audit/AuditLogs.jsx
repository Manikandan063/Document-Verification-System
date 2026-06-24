import React from 'react';
import PageTitle from '../../components/common/PageTitle';

export default function AuditLogs() {
  const logs = [
    { id: 1, action: 'UPLOAD_DOCUMENT', user: 'HR Exec', details: 'Uploaded Employee Handbook v2', time: '2 mins ago' },
    { id: 2, action: 'PROCESS_APPROVAL', user: 'HR Manager', details: 'Approved Q3 Vendor Agreement', time: '1 hr ago' },
    { id: 3, action: 'PROCESS_APPROVAL', user: 'Ops Manager', details: 'Rejected Expense Guidelines', time: '3 hrs ago' },
    { id: 4, action: 'UPLOAD_DOCUMENT', user: 'HR Exec', details: 'Uploaded Remote Work Policy v3', time: '1 day ago' },
  ];

  return (
    <div className="max-w-4xl">
      <PageTitle title="System Audit Logs" subtitle="Tamper-proof record of all actions performed in the system." />

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-2">
        {logs.map((log, i) => (
          <div key={log.id} className={`flex items-start p-4 ${i !== logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="w-32 flex-shrink-0 text-sm text-gray-400 font-medium pt-1">
              {log.time}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{log.action}</span>
                <span className="text-sm font-medium text-brand-dark">{log.user}</span>
              </div>
              <p className="text-sm text-gray-600">{log.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
