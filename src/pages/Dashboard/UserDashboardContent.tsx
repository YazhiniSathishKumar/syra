import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  ArrowRight,
  Globe,
  Shield
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

const UserDashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    getUserRequests,
    auditRequests
  } = useWorkflow();

  const [userRequests, setUserRequests] = useState(getUserRequests(currentUser.id));

  useEffect(() => {
    setUserRequests(getUserRequests(currentUser.id));
  }, [currentUser.id, getUserRequests, auditRequests]);

  const filteredRequests = userRequests;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'in-progress': return 'bg-blue-50 text-blue-500 border-blue-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high': return 'bg-red-50 text-red-500 border-red-100';
      case 'medium': return 'bg-yellow-50 text-yellow-500 border-yellow-100';
      default: return 'bg-green-50 text-green-500 border-green-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/audit/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Your Audits Section */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Web Audit</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Filter size={20} />
            </button>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleViewDetails(request.id)}
                className="group cursor-pointer bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-800">
                      {request.auditType === 'web' ? <Globe size={24} /> : <Shield size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white capitalize text-lg">
                        Web Audit
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient Progress Bar - only show if not completed/scheduled or if specific progress exists */}
                {request.progress > 0 && request.status !== 'approved' && (
                  <div className="relative mt-6">
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${request.progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                      <span className="text-[10px] font-bold text-gray-900 dark:text-white">{request.progress}% Complete</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Web Audit Label for New Request */}
          <div className="pt-8 pb-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-3 px-1">
              Web Audit
            </h4>
          </div>

          {/* Request New Audit Button */}
          <button
            onClick={() => navigate('/request-audit')}
            className="w-full py-6 rounded-2xl border-2 border-dashed border-blue-100 dark:border-gray-800 flex items-center justify-center gap-2 text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Request New Audit
          </button>
        </div>
      </div>

      {/* Other components if needed... */}
    </div>
  );
};

export default UserDashboardContent;