import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Help from './pages/Dashboard/Help/Help';
import Projects from './pages/Dashboard/Projects';
import Settings from './pages/Dashboard/Settings/Settings';
import { useTheme } from './context/ThemeContext';
import { WorkflowProvider } from './context/WorkflowContext';

import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import AdminSettings from './pages/Dashboard/AdminDashboard/AdminSettings';
import TestingDashboard from './pages/Dashboard/TestingDashboard/TestingDashboard';
import AuditDetailsPage from './pages/Dashboard/AuditDetails/AuditDetailsPage';
import FindingDetailsPage from './pages/Dashboard/AuditDetails/FindingDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-background-dark text-text-dark' : 'bg-gray-300 text-text-light'} transition-colors duration-300`}>
      <WorkflowProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/testing" element={
              <ProtectedRoute>
                <TestingDashboard />
              </ProtectedRoute>
            } />
            <Route path="/audit/:id" element={
              <ProtectedRoute>
                <AuditDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/audit/:auditId/finding/:findingId" element={
              <ProtectedRoute>
                <FindingDetailsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </WorkflowProvider>
    </div>
  );
}

export default App;