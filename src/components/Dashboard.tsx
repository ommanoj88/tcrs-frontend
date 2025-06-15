import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { creditMonitoringService } from '../services/creditMonitoringService';
import { AlertStatistics } from '../types/creditMonitoring';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [alertStats, setAlertStats] = useState<AlertStatistics | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAlertStatistics();
    // Refresh alert stats every 5 minutes
    const interval = setInterval(fetchAlertStatistics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertStatistics = async () => {
    try {
      const stats = await creditMonitoringService.getUserAlertStatistics();
      setAlertStats(stats);
    } catch (error) {
      console.error('Error fetching alert statistics:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isDashboardHome = location.pathname === '/dashboard';
  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } lg:w-64`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center space-x-3 ${!isSidebarOpen ? 'lg:flex hidden' : ''}`}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl text-gray-900">TCRS</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Dashboard</span>
            </Link>

            <Link
              to="/dashboard/search"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/search')
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Search Business</span>
            </Link>

            <Link
              to="/dashboard/monitoring"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/monitoring')
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h5v6z" />
              </svg>
              <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Credit Monitoring</span>
              {alertStats && alertStats.unreadAlerts > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                  {alertStats.unreadAlerts > 99 ? '99+' : alertStats.unreadAlerts}
                </span>
              )}
            </Link>

            <Link
              to="/dashboard/credit/my-reports"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/credit')
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Credit Reports</span>
            </Link>

            <Link
              to="/dashboard/businesses"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/businesses')
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>My Businesses</span>
            </Link>

            {/* My Data Submenu */}
            <div className="space-y-1">
              <div className={`px-3 py-2 text-sm font-medium text-gray-500 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                My Data
              </div>
              <Link
                to="/dashboard/payment/my-reports"
                className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors text-sm ${
                  isActive('/dashboard/payment/my-reports')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Payment Reports</span>
              </Link>
              <Link
                to="/dashboard/reference/my-references"
                className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors text-sm ${
                  isActive('/dashboard/reference/my-references')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Trade References</span>
              </Link>
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="space-y-1 pt-4 border-t">
                <div className={`px-3 py-2 text-sm font-medium text-gray-500 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                  Administration
                </div>
                <Link
                  to="/dashboard/admin/users"
                  className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors text-sm ${
                    isActive('/dashboard/admin/users')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>User Management</span>
                </Link>
                <Link
                  to="/dashboard/admin/role-history"
                  className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors text-sm ${
                    isActive('/dashboard/admin/role-history')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Role History</span>
                </Link>
                <Link
                  to="/dashboard/reference/verify"
                  className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors text-sm ${
                    isActive('/dashboard/reference/verify')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={isSidebarOpen ? 'block' : 'hidden lg:block'}>Verify References</span>
                </Link>
              </div>
            )}
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-300 rounded-full p-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className={`flex-1 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 text-gray-400 hover:text-gray-600 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Alert Notifications */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Trade Credit Reference System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Alert Notification Bell */}
              <div className="relative group">
                <Link
                  to="/dashboard/monitoring/alerts?unread=true"
                  className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h5v6z" />
                  </svg>
                  {alertStats && alertStats.unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                      {alertStats.unreadAlerts > 99 ? '99+' : alertStats.unreadAlerts}
                    </span>
                  )}
                </Link>
                
                {/* Alert Dropdown Preview */}
                {alertStats && alertStats.unreadAlerts > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Recent Alerts</h3>
                        <Link
                          to="/dashboard/monitoring/alerts"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      <div className="text-sm text-gray-600 p-2">
                        {alertStats.unreadAlerts} unread alerts waiting for your attention
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <div className="bg-gray-300 rounded-full p-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{user?.firstName}</span>
                  {isAdmin && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Admin
                    </span>
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b">
                      <div className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/dashboard/monitoring"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Monitoring Settings
                    </Link>
                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {isDashboardHome ? (
            // Dashboard Home Content
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName}!</h2>
                <p className="text-gray-600">Here's what's happening with your credit monitoring today.</p>
              </div>

              {/* Alert Statistics Cards */}
              {alertStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h5v6z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Monitoring</p>
                        <p className="text-2xl font-semibold text-gray-900">{alertStats.activeMonitoring}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Unread Alerts</p>
                        <p className="text-2xl font-semibold text-gray-900">{alertStats.unreadAlerts}</p>
                      </div>
                    </div>
                    {alertStats.unreadAlerts > 0 && (
                      <div className="mt-2">
                        <Link
                          to="/dashboard/monitoring/alerts?unread=true"
                          className="text-sm text-yellow-600 hover:text-yellow-800"
                        >
                          View unread alerts →
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">High Priority</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {(alertStats.criticalAlerts || 0) + (alertStats.highAlerts || 0)}
                        </p>
                      </div>
                    </div>
                    {((alertStats.criticalAlerts || 0) + (alertStats.highAlerts || 0)) > 0 && (
                      <div className="mt-2">
                        <Link
                          to="/dashboard/monitoring/alerts"
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Review urgently →
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                        <p className="text-2xl font-semibold text-gray-900">{alertStats.recentAlerts || 0}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Last 7 days</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                      to="/dashboard/search"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Search Business</div>
                        <div className="text-sm text-gray-500">Find businesses to analyze</div>
                      </div>
                    </Link>

                    <Link
                      to="/dashboard/monitoring/setup"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                    >
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Setup Monitoring</div>
                        <div className="text-sm text-gray-500">Monitor credit changes</div>
                      </div>
                    </Link>

                    <Link
                      to="/dashboard/businesses/create"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Add Business</div>
                        <div className="text-sm text-gray-500">Register new business</div>
                      </div>
                    </Link>

                    <Link
                      to="/dashboard/credit/my-reports"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
                    >
                      <div className="p-2 bg-orange-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">View Reports</div>
                        <div className="text-sm text-gray-500">Access credit reports</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Alert Type Distribution */}
              {alertStats && alertStats.alertTypeDistribution && Object.keys(alertStats.alertTypeDistribution).length > 0 && (
                <div className="bg-white rounded-lg shadow mb-8">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Alert Activity (Last 30 Days)</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(alertStats.alertTypeDistribution).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-700">
                            {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* User Profile Card */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.roles?.join(', ')}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Getting Started Guide for New Users */}
              {alertStats && alertStats.activeMonitoring === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-blue-900">Get Started with Credit Monitoring</h3>
                      <p className="mt-2 text-blue-700">
                        You haven't set up any credit monitoring yet. Start by searching for a business and setting up automated alerts.
                      </p>
                      <div className="mt-4 flex space-x-3">
                        <Link
                          to="/dashboard/search"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Find a Business
                        </Link>
                        <Link
                          to="/dashboard/monitoring/setup"
                          className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Route-specific content
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;