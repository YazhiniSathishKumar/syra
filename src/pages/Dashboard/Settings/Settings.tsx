import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import SettingsPage from './SettingsContent';

const Settings: React.FC = () => {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  );
};

export default Settings;