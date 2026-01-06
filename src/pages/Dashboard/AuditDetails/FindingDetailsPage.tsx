import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { useWorkflow } from '../../../context/WorkflowContext';
import FindingDetailsContent from './FindingDetailsContent';

const FindingDetailsPage: React.FC = () => {
    const { auditId, findingId } = useParams();
    const { currentUser, getUserRequests } = useWorkflow();

    const audits = getUserRequests(currentUser.id);
    const audit = audits.find(a => a.id === auditId);
    const findings = audit?.findings || [];
    const findingIndex = findings.findIndex(f => f.id === findingId);
    const finding = findings[findingIndex];

    // Find next finding of the same severity
    const sameSeverityFindings = findings.filter(f => f.severity === finding?.severity);
    const severityIndex = sameSeverityFindings.findIndex(f => f.id === findingId) + 1;
    const severityCount = sameSeverityFindings.length;

    const nextFinding = findings.slice(findingIndex + 1).find(f => f.severity === finding?.severity);
    const nextFindingId = nextFinding?.id;

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!audit || !finding) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <DashboardLayout>
            <FindingDetailsContent
                finding={finding}
                auditName={audit.auditType === 'web' ? 'Web Audit' : audit.companyName}
                nextFindingId={nextFindingId}
                auditId={auditId}
                severityIndex={severityIndex}
                severityCount={severityCount}
            />
        </DashboardLayout>
    );
};

export default FindingDetailsPage;
