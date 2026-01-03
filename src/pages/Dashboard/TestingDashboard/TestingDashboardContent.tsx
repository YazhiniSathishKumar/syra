import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  Calendar,
  Target,
  Activity,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Server,
  Cloud
} from 'lucide-react';
import apiClient from '../../../lib/api';

interface AssignedAudit {
  id: string;
  companyName: string;
  auditType: string;
  targetUrl: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'assigned' | 'in-progress' | 'testing' | 'reporting' | 'completed';
  assignedAt: string;
  deadline: string;
  progress?: number;
  testingPhase?: string;
  vulnerabilitiesFound?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const TestingDashboardContent: React.FC = () => {
  const [assignedAudits, setAssignedAudits] = useState<AssignedAudit[]>([]);
  const [filteredAudits, setFilteredAudits] = useState<AssignedAudit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and normalize audit data
  useEffect(() => {
    const fetchAssignedAudits = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get('/tester/projects');
        console.log(response);
        const normalizedAudits = response.data.map((audit: any) => ({
          id: audit.id,
          companyName: audit.companyName || 'Unknown Company',
          auditType: audit.auditType || 'web',
          targetUrl: audit.targetUrl || '',
          description: audit.description || '',
          priority: audit.priority || 'medium',
          status: audit.status || 'assigned',
          assignedAt: audit.assignedAt || new Date().toISOString(),
          deadline: audit.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          progress: audit.progress || 0,
          testingPhase: audit.testingPhase || 'Not started',
          vulnerabilitiesFound: audit.vulnerabilitiesFound || {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
          }
        }));

        setAssignedAudits(normalizedAudits);
        setFilteredAudits(normalizedAudits);
      } catch (err) {
        console.error('Failed to fetch assigned audits:', err);
        setError('Failed to load audits. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedAudits();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = assignedAudits;

    if (searchQuery) {
      filtered = filtered.filter(audit =>
        audit.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.auditType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(audit => audit.status === statusFilter);
    }

    setFilteredAudits(filtered);
  }, [searchQuery, statusFilter, assignedAudits]);

  // Update audit status
  const updateAuditStatus = async (auditId: string, newStatus: AssignedAudit['status']) => {
    try {
      const response = await apiClient.patch(`/tester/projects/${auditId}/status`, {
        status: newStatus,
      });

      setAssignedAudits(prev =>
        prev.map(audit =>
          audit.id === auditId ? { ...audit, status: response.data.status } : audit
        )
      );
    } catch (err) {
      console.error('Failed to update audit status:', err);
      setError('Failed to update audit status');
    }
  };

  // UI helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'testing': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'reporting': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getAuditTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'web': return Globe;
      case 'mobile': return Smartphone;
      case 'network': return Server;
      case 'cloud': return Cloud;
      default: return Shield;
    }
  };

  // Dashboard statistics
  const stats = [
    {
      label: 'Assigned Audits',
      value: assignedAudits.length.toString(),
      icon: FileText,
      change: `${assignedAudits.filter(a => a.status === 'assigned').length} new`
    },
    {
      label: 'In Progress',
      value: assignedAudits.filter(a => a.status === 'in-progress').length.toString(),
      icon: Activity,
      change: 'Active testing'
    },
    {
      label: 'Completed',
      value: assignedAudits.filter(a => a.status === 'completed').length.toString(),
      icon: CheckCircle,
      change: `${assignedAudits.filter(a => a.status === 'completed' &&
        new Date(a.assignedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month`
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-medium">{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testing Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your assigned security audits and testing tasks</p>
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
                  <p className="text-sm text-blue-600 dark:text-blue-400">{stat.change}</p>
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
              placeholder="Search audits..."
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
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="testing">Testing</option>
            <option value="reporting">Reporting</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Assigned Audits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAudits.map((audit, index) => {
          const TypeIcon = getAuditTypeIcon(audit.auditType);
          return (
            <motion.div
              key={audit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Web Audit</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{audit.auditType} Audit</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(audit.priority)}`}>
                    {audit.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(audit.status)}`}>
                    {audit.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Target className="w-4 h-4" />
                  <span>{audit.targetUrl}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {new Date(audit.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Phase: {audit.testingPhase}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{audit.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${audit.progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Vulnerabilities Found</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {audit.vulnerabilitiesFound?.critical || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {audit.vulnerabilitiesFound?.high || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {audit.vulnerabilitiesFound?.medium || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {audit.vulnerabilitiesFound?.low || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {audit.status === 'assigned' && (
                  <button
                    onClick={() => updateAuditStatus(audit.id, 'in-progress')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Audit
                  </button>
                )}
                {audit.status === 'in-progress' && (
                  <>
                    <button
                      onClick={() => updateAuditStatus(audit.id, 'testing')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      Begin Testing
                    </button>
                    <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
                      <Pause className="w-4 h-4" />
                    </button>
                  </>
                )}
                {audit.status === 'testing' && (
                  <button
                    onClick={() => updateAuditStatus(audit.id, 'reporting')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </button>
                )}
                {audit.status === 'reporting' && (
                  <button
                    onClick={() => updateAuditStatus(audit.id, 'completed')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Audit
                  </button>
                )}
                {audit.status === 'completed' && (
                  <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredAudits.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No audits found</h3>
          <p className="text-gray-600 dark:text-gray-400">No audits match your current filters</p>
          {searchQuery || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Clear filters
            </button>
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default TestingDashboardContent;