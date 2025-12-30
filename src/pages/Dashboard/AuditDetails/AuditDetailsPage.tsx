import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import AuditDetailsContent from './AuditDetailsContent';
import { useWorkflow } from '../../../context/WorkflowContext';

const AuditDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserRequests, currentUser } = useWorkflow();

  const audits = getUserRequests(currentUser.id);
  const audit = audits.find(a => a.id === id);

  if (!audit) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl shadow-xl m-6">
          <div className="text-red-500 text-6xl mb-4 text-center justify-center flex">⚠️</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Audit Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn't find the audit with ID: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{id}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AuditDetailsContent audit={audit} />
    </DashboardLayout>
  );
};

export default AuditDetailsPage;