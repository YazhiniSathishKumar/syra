import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  X,
  Calendar,
  FileText,
  Settings,
  Activity,
  CheckCircle,
  Circle,
  RefreshCw,
  Info,
  AlertCircle,
  Globe
} from 'lucide-react';
import { AuditRequest } from '../../../context/WorkflowContext';

interface AuditDetailsContentProps {
  audit: AuditRequest;
}

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, subtitle?: string, progress?: number, colorClass?: string }> = ({
  icon: Icon, title, value, subtitle, progress, colorClass = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
}) => (
  <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</span>
    </div>
    <div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{subtitle}</div>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{progress}% of tests complete</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const StatusItem: React.FC<{ label: string, description: string, status: 'completed' | 'current' | 'upcoming' }> = ({ label, description, status }) => {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
          isCurrent ? 'bg-white dark:bg-gray-800 border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
            'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}>
          {isCompleted ? <CheckCircle size={14} strokeWidth={3} /> : <Circle size={isCurrent ? 10 : 8} strokeWidth={isCurrent ? 3 : 2} fill={isCurrent ? "currentColor" : "none"} />}
        </div>
        <div className={`w-0.5 h-10 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-700'} last:hidden`} />
      </div>
      <div className="pb-6">
        <div className={`text-sm font-bold tracking-tight ${isCompleted || isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
          {label}
        </div>
        <div className={`text-xs mt-0.5 font-medium ${isCompleted || isCurrent ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {description}
        </div>
      </div>
    </div>
  );
};

const VulnerabilityChart: React.FC<{ vulnerabilities: AuditRequest['vulnerabilities'], onSelectSeverity: (severity: string | null) => void, selectedSeverity: string | null }> = ({ vulnerabilities, onSelectSeverity, selectedSeverity }) => {
  const vuln = vulnerabilities || { critical: 0, high: 0, medium: 0, low: 0, informational: 0, total: 0 };
  const total = vuln.total || 1;
  const categories = [
    { label: 'Critical', value: 'critical', count: vuln.critical || 0, color: '#EF4444' },
    { label: 'High', value: 'high', count: vuln.high || 0, color: '#F97316' },
    { label: 'Medium', value: 'medium', count: vuln.medium || 0, color: '#EAB308' },
    { label: 'Low', value: 'low', count: vuln.low || 0, color: '#10B981' },
    { label: 'Info', value: 'informational', count: vuln.informational || 0, color: '#3B82F6' }
  ];

  let cumulativeOffset = 0;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Reported Vulnerabilities</h3>
        <button
          onClick={() => onSelectSeverity(null)}
          className={`text-xs font-bold hover:underline ${selectedSeverity ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
        >
          {selectedSeverity ? 'Clear Filter' : 'View all'}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-44 h-44 mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {categories.map((cat, i) => {
              const percentage = (cat.count || 0) / total;
              const strokeDasharray = `${percentage * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeOffset;
              cumulativeOffset += percentage * circumference;

              if (cat.count === 0) return null;

              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={selectedSeverity === cat.value ? "14" : "10"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 ease-out cursor-pointer hover:stroke-[12px]"
                  onClick={() => onSelectSeverity(cat.value === selectedSeverity ? null : cat.value)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => onSelectSeverity(null)}>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{selectedSeverity ? "Filtered" : "Reported"}</span>
            <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">
              {selectedSeverity ? (categories.find(c => c.value === selectedSeverity)?.count || 0) : (vuln.total || 0)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 w-full">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`text-center cursor-pointer p-1 rounded-lg transition-all ${selectedSeverity === cat.value ? 'bg-gray-100 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}
              onClick={() => onSelectSeverity(cat.value === selectedSeverity ? null : cat.value)}
            >
              <div
                className="h-2 rounded-full mb-2"
                style={{ backgroundColor: cat.color, opacity: !selectedSeverity || selectedSeverity === cat.value ? 1 : 0.3 }}
              />
              <div className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-tighter uppercase">{cat.label}</div>
              <div className="text-lg font-black text-gray-900 dark:text-white">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecommendationItem: React.FC<{
  finding: any;
  severity: string;
  auditId: string;
  index: number;
}> = ({ finding, severity, auditId, index }) => {
  const navigate = useNavigate();
  const { title, description, score } = finding;
  const colors = {
    critical: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10 text-red-800 dark:text-red-400',
    high: 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10 text-orange-800 dark:text-orange-400',
    medium: 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-400',
    low: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400',
    informational: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-400',
  };

  const colorClass = colors[severity as keyof typeof colors] || colors.low;
  return (
    <div
      className={`p-4 rounded-xl border-l-[6px] shadow-sm transition-all duration-300 ${colorClass} hover:scale-[1.01] cursor-pointer`}
      onClick={() => navigate(`/audit/${auditId}/finding/${finding.id}`)}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2 flex-1">
          <span className="w-5 h-5 rounded-md bg-white/50 dark:bg-black/20 border border-current flex items-center justify-center text-[10px] font-black shrink-0">
            {index}
          </span>
          <h4 className="text-sm font-black">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {score !== undefined && score > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/50 dark:bg-black/20 border border-current whitespace-nowrap">
              {score}/10
            </span>
          )}
          <div className="text-[10px] font-bold uppercase tracking-tighter opacity-50 font-black">Details →</div>
        </div>
      </div>

      <p className="text-xs opacity-90 leading-relaxed font-black line-clamp-2">
        {description}
      </p>
    </div>
  );
};

const AuditDetailsContent: React.FC<AuditDetailsContentProps> = ({ audit }) => {
  const navigate = useNavigate();
  const [selectedSeverity, setSelectedSeverity] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (audit?.auditType === 'web') {
      document.title = 'Web Audit | SYRA';
    }
  }, [audit]);

  console.log('Rendering AuditDetailsContent with audit:', audit);

  if (!audit) {
    return (
      <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-black text-gray-900 dark:text-white">No Audit Data Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 font-black hover:underline">Go Back</button>
      </div>
    );
  }

  const formatDateRange = (start?: string, end?: string) => {
    if (!start) return 'N/A';
    try {
      const s = new Date(start);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const startStr = `${months[s.getMonth()]} ${s.getDate()}`;

      if (!end) return `${startStr} - TBD`;
      const e = new Date(end);
      const endStr = `${months[e.getMonth()]} ${e.getDate()}`;
      return `${startStr} - ${endStr}`;
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const getStatus = (phase: string) => {
    const phases = ['Draft', 'Launching', 'In progress', 'Finalizing', 'Completed'];
    const currentPhase = (audit.testingPhase || '').toLowerCase();
    const currentIndex = phases.findIndex(p => p.toLowerCase() === currentPhase);
    const phaseIndex = phases.indexOf(phase);

    if (audit.status === 'completed' && phase === 'Completed') return 'completed';
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStatusDesc = (label: string) => {
    const descs: Record<string, string> = {
      'Draft': 'Bugcrowd is setting up your pen test',
      'Launching': 'Your pen test is scheduled for launch',
      'In progress': 'Pen testers are testing and validating',
      'Finalizing': 'Bugcrowd is preparing reports',
      'Completed': 'Your report is ready for review'
    };
    return descs[label] || '';
  };

  return (
    <div className="w-full p-4 md:p-6 bg-[#F8FAFC] dark:bg-gray-950 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 flex justify-between items-start border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              {audit.auditType === 'web' ? <Globe size={24} strokeWidth={2.5} /> : <Shield size={24} strokeWidth={2.5} />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
                Web Audit
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-bold">Detailed audit information and results</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-all hover:rotate-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 space-y-8 rounded-b-3xl shadow-sm border-x border-b border-gray-100 dark:border-gray-800">
          {/* Top Row: Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              title="Testing Period"
              value={audit.testingPeriod || formatDateRange(audit.preferredStartDate, audit.completedAt)}
              subtitle={audit.completedAt ? 'Expired 2 weeks ago' : 'Scheduled'}
              colorClass="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              icon={FileText}
              title="Report Delivery"
              value={audit.reportDelivery || (audit.completedAt ? formatDateRange(audit.completedAt).split(' - ')[0] + ', 2021' : 'Pending')}
              subtitle={audit.completedAt ? 'Delivered 3 days ago' : 'Estimated: TBD'}
              colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
            />
            <StatCard
              icon={Settings}
              title="Methodology"
              value={audit.auditType === 'web' ? 'Web Audit' : (audit.methodology || 'Security Audit')}
              colorClass="text-sky-600 bg-sky-50 dark:bg-sky-900/20"
            />
            <StatCard
              icon={Activity}
              title="Testing Progress"
              value={`${audit.progress || 0}% tests complete`}
              progress={audit.progress || 0}
              colorClass="text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20"
            />
          </div>

          {/* Middle Row: Status and Vulnerabilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Status Tracker */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-8">Status</h3>
              <div className="relative pl-1 flex-1">
                <StatusItem label="Draft" description={getStatusDesc('Draft')} status={getStatus('Draft')} />
                <StatusItem label="Launching" description={getStatusDesc('Launching')} status={getStatus('Launching')} />
                <StatusItem label="In progress" description={getStatusDesc('In progress')} status={getStatus('In progress')} />
                <StatusItem label="Finalizing" description={getStatusDesc('Finalizing')} status={getStatus('Finalizing')} />
                <StatusItem label="Completed" description={getStatusDesc('Completed')} status={getStatus('Completed')} />
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1 hover:underline mt-4">
                View reports
              </button>
            </div>

            {/* Right: Vulnerabilities Chart */}
            <VulnerabilityChart
              vulnerabilities={audit.vulnerabilities}
              onSelectSeverity={setSelectedSeverity}
              selectedSeverity={selectedSeverity}
            />
          </div>

          {/* Bottom Row: Remediation Recommendations */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                {selectedSeverity ? `${selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)} Severity ` : ''}Remediation Recommendations
              </h3>
              {selectedSeverity && (
                <button
                  onClick={() => setSelectedSeverity(null)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Show all
                </button>
              )}
            </div>
            <div className="space-y-4">
              {!selectedSeverity ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  <Info size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">Please select a severity category above to view specific findings.</p>
                </div>
              ) : audit.findings && audit.findings.length > 0 ? (
                (() => {
                  const filteredFindings = audit.findings.filter(f => f.severity.toLowerCase() === selectedSeverity);

                  if (filteredFindings.length === 0) {
                    return (
                      <div className="text-center py-12 text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        <Info size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-bold">No {selectedSeverity} severity findings reported.</p>
                      </div>
                    );
                  }

                  return filteredFindings.map((finding, idx) => (
                    <RecommendationItem
                      key={idx}
                      finding={finding}
                      severity={finding.severity}
                      auditId={audit.id}
                      index={idx + 1}
                    />
                  ));
                })()
              ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  <Info size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">No findings reported for this audit.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
            <button
              onClick={() => navigate(-1)}
              className="px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Close
            </button>
            <button
              className="px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <RefreshCw size={14} strokeWidth={3} />
              Re-audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsContent;
