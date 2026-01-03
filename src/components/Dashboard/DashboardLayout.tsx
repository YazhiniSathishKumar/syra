import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  FolderOpen,
  Settings,
  HelpCircle,
  Shield,
  Users,
  TestTube
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'user' | 'admin' | 'tester';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole = 'user' }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification state matching Header expectations
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Audit Request Approved',
      description: 'Your security audit request has been approved and assigned to a tester',
      time: '2 hours ago',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'New Vulnerability Found',
      description: 'Critical vulnerability detected in your web application',
      time: '1 day ago',
      type: 'warning',
      unread: true
    }
  ]);

  // const [user, setUser] = useState<{ id: string, fullName: string, email: string } | null>(null);

  useEffect(() => {
    // const storedUser = localStorage.getItem('user');
    // if (storedUser) {
    //   try {
    //     setUser(JSON.parse(storedUser));
    //   } catch (e) {
    //     console.error('Failed to parse user from localStorage', e);
    //   }
    // }
  }, []);

  // Define navigation items based on user role
  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { id: 'admin', label: 'Admin Panel', icon: Shield, path: '/admin' },
          { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
          { id: 'audit-requests', label: 'Audit Requests', icon: FolderOpen, path: '/admin/requests' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
          { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
        ];
      case 'tester':
        return [
          { id: 'testing', label: 'Testing Dashboard', icon: TestTube, path: '/testing' },
          { id: 'assigned-audits', label: 'Assigned Audits', icon: FolderOpen, path: '/testing/audits' },
          { id: 'tools', label: 'Testing Tools', icon: Scan, path: '/testing/tools' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
          { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
          { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },

          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
          { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
        ];
    }
  };

  const navigationItems = getNavigationItems();
  const currentPath = location.pathname;
  const activeItem = navigationItems.find(item => item.path === currentPath)?.id || 'dashboard';

  const handleNavigation = (id: string) => {
    const item = navigationItems.find(i => i.id === id);
    if (item && item.path) {
      navigate(item.path);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserDropdownOpen(false);
      setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColorClasses = (_color: string, variant: string = 'default') => {
    const colorMap: Record<string, string> = {
      default: theme === 'dark' ? 'text-white' : 'text-black',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    };
    return colorMap[variant] || colorMap.default;
  };


  return (
    <div
      className={`min-h-screen transition-all duration-300 ${theme === 'dark'
        ? 'bg-background-dark text-text-dark'
        : 'bg-background-light text-text-light'
        }`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeItem}
        setActiveTab={() => { }} // Navigation handled by handleNavigation
        handleNavigation={handleNavigation}
        theme={theme}
        navItems={navigationItems}
      />

      {/* Main Content Wrapper - Includes Header */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-[70px]' : 'lg:ml-[70px] ml-0'}`}>

        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          toggleTheme={toggleTheme}
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAsRead={markAsRead}
          removeNotification={removeNotification}
          getColorClasses={getColorClasses}
        />

        {/* Page Content */}
        <main className="transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;