import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Info,
    FileText,
    Zap,
    Target,
    Clipboard,
    ShieldAlert
} from 'lucide-react';
import { Finding } from '../../../context/WorkflowContext';

interface FindingDetailsContentProps {
    finding: Finding;
    auditName: string;
    nextFindingId?: string;
    auditId?: string;
    severityIndex?: number;
    severityCount?: number;
}

const FindingDetailsContent: React.FC<FindingDetailsContentProps> = ({ finding, auditName, nextFindingId, auditId, severityIndex, severityCount }) => {
    const navigate = useNavigate();

    const getSeverityStyles = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return {
                bg: 'from-red-500 to-rose-600',
                text: 'text-red-600 dark:text-red-400',
                light: 'bg-red-50 dark:bg-red-900/20',
                border: 'border-red-100 dark:border-red-800/30'
            };
            case 'high': return {
                bg: 'from-orange-500 to-amber-600',
                text: 'text-orange-600 dark:text-orange-400',
                light: 'bg-orange-50 dark:bg-orange-900/20',
                border: 'border-orange-100 dark:border-orange-800/30'
            };
            case 'medium': return {
                bg: 'from-yellow-400 to-orange-500',
                text: 'text-yellow-600 dark:text-yellow-400',
                light: 'bg-yellow-50 dark:bg-yellow-900/20',
                border: 'border-yellow-100 dark:border-yellow-800/30'
            };
            case 'low': return {
                bg: 'from-emerald-400 to-teal-600',
                text: 'text-emerald-600 dark:text-emerald-400',
                light: 'bg-emerald-50 dark:bg-emerald-900/20',
                border: 'border-emerald-100 dark:border-emerald-800/30'
            };
            default: return {
                bg: 'from-blue-500 to-indigo-600',
                text: 'text-blue-600 dark:text-blue-400',
                light: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-100 dark:border-blue-800/30'
            };
        }
    };

    const styles = getSeverityStyles(finding.severity);

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#030712] font-sans pb-20">
            {/* Top Background Gradient Overlay */}
            <div className={`absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b ${styles.bg} opacity-[0.07] dark:opacity-[0.15]`} />

            <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 relative z-10">
                {/* Navigation & Header */}
                <div className="flex flex-col gap-6 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all w-fit group"
                    >
                        <div className="p-1.5 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4 max-w-3xl"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white dark:bg-gray-900 border ${styles.border} ${styles.text} shadow-sm`}>
                                    {finding.severity} {severityIndex && severityCount ? `${severityIndex} of ${severityCount}` : 'Severity'}
                                </span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                                    {auditName}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                                {finding.title}
                            </h1>
                        </motion.div>

                        {finding.score !== undefined && finding.score > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
                            >
                                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${styles.bg} flex flex-col items-center justify-center text-white shadow-lg`}>
                                    <span className="text-2xl font-black leading-none">{finding.score}</span>
                                    <span className="text-[10px] font-bold opacity-70">/10</span>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Risk Score</div>
                                    <div className={`text-sm font-black ${styles.text} capitalize`}>{finding.severity}</div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Description Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    <FileText size={20} className="font-bold" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Overview</h2>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-semibold whitespace-pre-wrap">
                                {finding.fullDescription || finding.description}
                            </p>
                        </motion.div>

                        {/* Impact Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                    <ShieldAlert size={20} />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Vulnerability Impact</h2>
                            </div>
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-bold bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 whitespace-pre-wrap">
                                {finding.impact}
                            </div>
                        </motion.div>

                        {/* Recommendation Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                    <Zap size={20} />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Remediation Steps</h2>
                            </div>
                            <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-bold space-y-2 whitespace-pre-wrap">
                                {finding.recommendation}
                            </div>
                        </motion.div>

                        {/* References Card */}
                        {finding.references && finding.references.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                        <Info size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">References</h2>
                                </div>
                                <ul className="list-disc list-inside text-base text-gray-600 dark:text-gray-400 leading-relaxed font-bold space-y-2">
                                    {finding.references.map((ref, idx) => (
                                        <li key={idx}>
                                            <a href={ref.includes('http') ? ref : '#'} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                                                {ref}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Technical Details</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <Target size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Status</div>
                                        <div className="text-sm font-black text-orange-500 uppercase">{finding.status}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <Clipboard size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Finding ID</div>
                                        <div className="text-xs font-mono font-bold text-gray-900 dark:text-white truncate">{finding.id}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Detection Date</div>
                                        <div className="text-sm font-black text-gray-900 dark:text-white uppercase">
                                            {new Date(finding.foundAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {finding.vectorString && (
                                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">CVSS Vector</div>
                                    <div className="bg-gray-950 p-4 rounded-2xl relative">
                                        <code className="text-[11px] font-mono font-bold text-blue-400 break-all">
                                            {finding.vectorString}
                                        </code>
                                    </div>
                                </div>
                            )}

                            {nextFindingId && auditId && (
                                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <button
                                        onClick={() => {
                                            navigate(`/audit/${auditId}/finding/${nextFindingId}`);
                                            window.scrollTo(0, 0);
                                        }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl ${styles.light} ${styles.text} font-black hover:opacity-80 transition-all group border ${styles.border}`}
                                    >
                                        <span className="text-sm">Click to see next vulnerability</span>
                                        <ArrowLeft className="rotate-180 transform group-hover:translate-x-1 transition-transform" size={18} />
                                    </button>
                                </div>
                            )}
                        </motion.div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindingDetailsContent;
