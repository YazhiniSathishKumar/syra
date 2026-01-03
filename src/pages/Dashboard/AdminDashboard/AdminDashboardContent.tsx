import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Check,
  X,
  Calendar,
  Mail,
  Phone,
  Building,
  Globe,
  DollarSign
} from 'lucide-react';
import apiClient from '../../../lib/api';

interface AuditRequest {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  auditServices: string;
  targetUrl: string;
  description: string;
  budget: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  submittedAt: string;
}

const AdminDashboardContent: React.FC = () => {
  const [auditRequests, setAuditRequests] = useState<AuditRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AuditRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<AuditRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statsData, setStatsData] = useState<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    activeAudits: number;
  }>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    activeAudits: 0,
  });

  // api call
  useEffect(() => {
    const fetchAuditRequests = async () => {
      try {
        const response = await apiClient.get('companies/pending');
        setAuditRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch audit requests:', error);
      }
    };

    fetchAuditRequests();
  }, []);

  useEffect(() => {
    const fetchAuditRequests = async () => {
      try {
        let url = 'companies/pending';

        // Only add query param if status is not 'all'
        const params = statusFilter !== 'all' ? { status: statusFilter } : {};

        const response = await apiClient.get(url, { params });
        setAuditRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch audit requests:', error);
      }
    };

    fetchAuditRequests();
  }, [statusFilter]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('companies/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = auditRequests;

    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchQuery, statusFilter, auditRequests]);

  const handleStatusUpdate = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setAuditRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'approved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'rejected': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'completed': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };



  const stats = [
    {
      label: 'Total Requests',
      value: statsData.totalRequests.toString(),
      icon: FileText,
      color: 'info',
      change: '+12%',
    },
    {
      label: 'Pending Review',
      value: statsData.pendingRequests.toString(),
      icon: Clock,
      color: 'warning',
      change: '+5%',
    },
    {
      label: 'Approved',
      value: '2',
      icon: CheckCircle,
      color: 'success',
      change: '+18%',
    },
    {
      label: 'Active Audits',
      value: '0',
      icon: Shield,
      color: 'info',
      change: '+8%',
    },
  ];

  const handleApprove = async () => {
    try {
      if (selectedRequest) {
        const res = await apiClient.post('companies/verify', {
          companyId: selectedRequest.id,
          action: 'approve',
          notes: ''
        });

        handleStatusUpdate(selectedRequest.id, 'approved');
        setShowDetails(false);
      }
    }
    catch (error) {
      console.error('Failed to fetch audit requests:', error);
    }
  }

  const handleReject = async () => {
    try {
      if (selectedRequest) {
        const res = await apiClient.post('companies/verify', {
          companyId: selectedRequest.id,
          action: 'reject',
          notes: ''
        });

        handleStatusUpdate(selectedRequest.id, 'rejected');
        setShowDetails(false);
      }
    }
    catch (error) {
      console.error('Failed to fetch audit requests:', error);
    }
  }



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage audit requests and oversee security operations</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{stat.change}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Audit Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Audit Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Company</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{request.companyName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{request.targetUrl}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{request.contactName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{request.contactEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-900 dark:text-white">{request.auditServices}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {/* {request.status === 'pending' && (
                        // <>
                        //   <button
                        //     onClick={() => handleStatusUpdate(request.id, 'approved')}
                        //     className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        //   >
                        //     <Check className="w-4 h-4" />
                        //   </button>
                        //   <button
                        //     onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        //     className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        //   >
                        //     <X className="w-4 h-4" />
                        //   </button>
                        // </>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Request Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedRequest.companyName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedRequest.targetUrl}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedRequest.budget}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedRequest.contactName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedRequest.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedRequest.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audit Details</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{selectedRequest.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Preferred Start:{" "}
                    {new Date(selectedRequest.createdAt).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={
                      handleApprove
                    }
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={
                      handleReject
                    }
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboardContent;