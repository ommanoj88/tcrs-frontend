import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationItem {
  name: string;
  path: string;
  icon: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
      description: 'Overview and quick actions'
    },
    {
      name: 'Business Search',
      path: '/dashboard/search',
      icon: '🔍',
      description: 'Search and discover businesses'
    },
    {
      name: 'Business Management',
      path: '/dashboard/businesses',
      icon: '🏢',
      description: 'Manage business profiles'
    },
    {
      name: 'Credit Reports',
      path: '/dashboard/reports',
      icon: '📋',
      description: 'Generate and view credit reports'
    },
    {
      name: 'Payment History',
      path: '/dashboard/payments',
      icon: '💰',
      description: 'Track payment records'
    },
    {
      name: 'Trade References',
      path: '/dashboard/references',
      icon: '🤝',
      description: 'Manage trade references'
    },
    {
      name: 'Credit Monitoring',
      path: '/dashboard/monitoring',
      icon: '📊',
      description: 'Monitor credit changes and alerts',
      badge: 'New',
      badgeColor: 'bg-green-500'
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: '📈',
      description: 'View system analytics and insights',
      badge: 'New',
      badgeColor: 'bg-blue-500'
    },
    {
      name: 'Alerts',
      path: '/dashboard/alerts',
      icon: '🚨',
      description: 'View and manage alerts'
    }
  ];

  // Admin-only navigation items
  const adminNavigationItems: NavigationItem[] = [
    {
      name: 'User Management',
      path: '/dashboard/admin/users',
      icon: '👥',
      description: 'Manage system users'
    },
    {
      name: 'System Settings',
      path: '/dashboard/admin/settings',
      icon: '⚙️',
      description: 'Configure system settings'
    },
    {
      name: 'Audit Logs',
      path: '/dashboard/admin/audit',
      icon: '📝',
      description: 'View system audit logs'
    }
  ];

  // Helper functions to get user info
  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0]; // Use email prefix as display name
    }
    return 'User';
  };

  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const isAdmin = () => {
    // Check if user has admin role - adjust this based on your User entity structure
    return user?.roles?.includes('ADMIN') || 
           user?.roles?.includes('admin') || 
           false; // Default to false if no admin role found
  };

  const getUserRole = () => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0]; // Return first role
    }
    return 'USER';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const currentItem = [...navigationItems, ...adminNavigationItems]
      .find(item => isActivePath(item.path));
    return currentItem?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo and Brand */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">TC</span>
            </div>
            <span className="text-white font-semibold text-lg">TCRS</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`ml-2 px-2 py-1 text-xs font-medium text-white rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin() && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="px-3 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              <div className="space-y-1">
                {adminNavigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User Section */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <div className="space-y-1">
              <Link
                to="/dashboard/profile"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActivePath('/dashboard/profile')
                    ? 'bg-gray-50 text-gray-900 border-r-2 border-gray-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">👤</span>
                <span className="flex-1">Profile</span>
              </Link>
              <Link
                to="/dashboard/settings"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActivePath('/dashboard/settings')
                    ? 'bg-gray-50 text-gray-900 border-r-2 border-gray-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">⚙️</span>
                <span className="flex-1">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <span className="mr-3 text-lg">🚪</span>
                <span className="flex-1 text-left">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Info Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {getUserInitial()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {getUserRole()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title */}
            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Link
                to="/dashboard/alerts"
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 7v5m0 0l-3-3m3 3l3-3M9 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-3" />
                </svg>
                {/* Notification badge - you can make this dynamic */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {getUserInitial()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getUserRole()}
                    </p>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-1">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        <span className="mr-3">👤</span>
                        View Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        <span className="mr-3">⚙️</span>
                        Settings
                      </Link>
                      {isAdmin() && (
                        <Link
                          to="/dashboard/admin"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                        >
                          <span className="mr-3">👑</span>
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                      >
                        <span className="mr-3">🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 Trade Credit Reference System (TCRS). All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/help" className="text-sm text-gray-500 hover:text-gray-900">
                Help
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Quick Actions FAB (Floating Action Button) */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {/* Quick actions menu */}
          <div className="absolute bottom-16 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2 space-y-2">
              <Link
                to="/dashboard/businesses/create"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap"
              >
                <span className="mr-2">🏢</span>
                Add Business
              </Link>
              <Link
                to="/dashboard/reports/generate"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap"
              >
                <span className="mr-2">📋</span>
                Generate Report
              </Link>
              <Link
                to="/dashboard/payments/add"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap"
              >
                <span className="mr-2">💰</span>
                Add Payment
              </Link>
              <Link
                to="/dashboard/monitoring/setup"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap"
              >
                <span className="mr-2">📊</span>
                Setup Monitoring
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation (optional - for mobile-first design) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-1 ${
                isActivePath(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;