import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout.tsx';
import HelpContent from './HelpContent.tsx';

const Help: React.FC = () => {
  return (
    <DashboardLayout>
      <HelpContent />
    </DashboardLayout>
  );
};

export default Help;