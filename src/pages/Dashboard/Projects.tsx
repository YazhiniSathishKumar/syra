
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FolderOpen,
  MoreVertical,
  Eye,
  Archive,
  Trash2,
  Globe
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';

const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [projects] = useState([
    {
      id: 'audit-web-001',
      name: 'Corporate Website Security Audit',
      client: 'Scomode',
      type: 'Web Audit',
      status: 'completed',
      date: '2025-10-16',
      score: 7.0,
      icon: Globe,
      vulnerabilities: {
        critical: 0,
        high: 1,
        medium: 1,
        low: 0,
        informational: 1
      }
    }
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).filter) {
      const filter = (location.state as any).filter;
      if (['web', 'network', 'mobile', 'cloud'].includes(filter)) {
        setFilterType(filter);
      } else if (['completed', 'in-progress', 'scheduled'].includes(filter)) {
        setFilterStatus(filter);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    if (activeDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdownId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'scheduled':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      case 'scheduled':
        return Calendar;
      default:
        return XCircle;
    }
  };

  const filteredProjects = projects.filter(({ name, client, type, status }: any) => {
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout userRole="user">
      <div className="pt-8 pb-8 px-4">
        {/* Mobile Header */}
        <div className="block sm:hidden mb-6">
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
            }`}>Manage and track all your security audit projects</p>
        </div>

        {/* Page Title */}
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and track all your security audit projects
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 w-full sm:w-auto gap-3">
              <div className="relative flex-1 min-w-0">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } pointer-events-none`}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme === 'dark'
                    ? 'bg-surface-dark/50 border-surface-secondary-dark/30 text-text-dark placeholder:text-text-secondary-dark'
                    : 'bg-white border-gray-200 text-text-light placeholder:text-text-secondary-light'
                    }`}
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                  ? 'bg-surface-dark/50 border-surface-secondary-dark/30 text-text-dark'
                  : 'bg-white border-gray-200 text-text-light'
                  }`}
              >
                <option value="all">All Types</option>
                <option value="web">Web Application</option>
                <option value="network">Network Security</option>
                <option value="mobile">Mobile Security</option>
                <option value="cloud">Cloud Infrastructure</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                  ? 'bg-surface-dark/50 border-surface-secondary-dark/30 text-text-dark'
                  : 'bg-white border-gray-200 text-text-light'
                  }`}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => {
              const StatusIcon = getStatusIcon(project.status);
              const ProjectIcon = project.icon;
              const scoreValue = project.score ?? 0;

              return (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`group relative ${theme === 'dark'
                    ? 'bg-surface-dark/70 border-surface-secondary-dark/30 hover:border-accent-dark/30'
                    : 'bg-white border border-gray-200 hover:border-blue-300'
                    } backdrop-blur-sm rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                  onClick={() => navigate(`/audit/${project.id}`)}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                          } shrink-0`
                        }
                      >
                        <ProjectIcon
                          className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            } group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}
                        >
                          {project.name}
                        </h3>
                        <p
                          className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}
                        >
                          {project.client}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === project.id ? null : project.id);
                        }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 rounded-lg ${theme === 'dark' ? 'hover:bg-surface-secondary-dark/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                          } ${activeDropdownId === project.id ? 'opacity-100' : ''}`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      <AnimatePresence>
                        {activeDropdownId === project.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className={`absolute right-0 top-full mt-2 w-48 z-50 rounded-xl border shadow-2xl backdrop-blur-xl ${theme === 'dark'
                              ? 'bg-surface-dark/95 border-surface-secondary-dark/30'
                              : 'bg-white border-gray-100'
                              }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-1.5">
                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  navigate(`/audit/${project.id}`);
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'dark' ? 'hover:bg-surface-secondary-dark/50' : 'hover:bg-gray-50'
                                  }`}
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  alert(`Archiving project ${project.name}`);
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'dark' ? 'hover:bg-surface-secondary-dark/50' : 'hover:bg-gray-50'
                                  }`}
                              >
                                <Archive className="w-4 h-4" />
                                <span>Archive</span>
                              </button>
                              <div className={`my-1.5 border-t ${theme === 'dark' ? 'border-surface-secondary-dark/20' : 'border-gray-100'}`} />
                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  alert(`Deleting project ${project.name}`);
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors text-red-500 ${theme === 'dark' ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                                  }`}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Project</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Type</span>
                      <span className={`text-sm font-medium truncate max-w-[50%] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        {project.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                      <div className="flex items-center space-x-2">
                        <StatusIcon
                          className={`w-4 h-4 ${getStatusColor(project.status)} shrink-0`}
                        />
                        <span
                          className={`text-sm font-medium capitalize ${getStatusColor(project.status)
                            } max-w-[70%]`}
                        >
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Reporting Date</span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} truncate max-w-[50%]`}>
                        {new Date(project.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Security Score</span>
                      <div className="flex items-center space-x-2 min-w-[120px]">
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${scoreValue >= 90
                              ? 'bg-green-500'
                              : scoreValue >= 70
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              }`}
                            style={{ width: `${(scoreValue / 10) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                          {scoreValue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vulnerability Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs">
                    <div className="flex items-center space-x-1 min-w-[20px]">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{project.vulnerabilities.critical}</span>
                    </div>
                    <div className="flex items-center space-x-1 min-w-[20px]">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{project.vulnerabilities.high}</span>
                    </div>
                    <div className="flex items-center space-x-1 min-w-[20px]">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{project.vulnerabilities.medium}</span>
                    </div>
                    <div className="flex items-center space-x-1 min-w-[20px]">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{project.vulnerabilities.low}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium mt-4">
                {filterStatus === 'in-progress' ? 'No active audits found' :
                  filterStatus !== 'all' ? `No ${filterStatus.replace('-', ' ')} audits found` :
                    'No audits found'}
              </h3>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchQuery ? `We couldn't find any results matching "${searchQuery}"` : 'Try adjusting your filters to see more results'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;