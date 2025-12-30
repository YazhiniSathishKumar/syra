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
    const finding = audit?.findings?.find(f => f.id === findingId);

    if (!audit || !finding) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <DashboardLayout>
            <FindingDetailsContent
                finding={finding}
                auditName={audit.auditType === 'web' ? 'Web Audit' : audit.companyName}
            />
        </DashboardLayout>
    );
};

export default FindingDetailsPage;
