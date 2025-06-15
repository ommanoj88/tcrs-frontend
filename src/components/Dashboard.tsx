import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isDashboardHome = location.pathname === '/dashboard';
  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-2xl font-bold text-gray-900">
                TCRS
              </Link>
              <nav className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isDashboardHome
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/search"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard/search')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Search Businesses
                </Link>
                <Link
                  to="/dashboard/businesses"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard/businesses')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Businesses
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/dashboard/admin/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/dashboard/admin/users')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      User Management
                    </Link>
                    <Link
                      to="/dashboard/admin/role-history"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/dashboard/admin/role-history')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Role History
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span>Welcome, {user?.firstName} {user?.lastName}</span>
                {isAdmin && (
                  <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {isDashboardHome ? (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Welcome Card */}
              <div className="card mb-6">
                <div className="card-body">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Welcome to Trade Credit Reference System
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Search and evaluate businesses for trade credit decisions.
                  </p>
                  <div className="flex space-x-4">
                    <Link to="/dashboard/search" className="btn-primary">
                      Search Businesses
                    </Link>
                    <Link to="/dashboard/businesses" className="btn-outline">
                      Manage My Businesses
                    </Link>
                    <Link to="/dashboard/businesses/create" className="btn-outline">
                      Add New Business
                    </Link>
                    {isAdmin && (
                      <Link to="/dashboard/admin/users" className="btn-secondary">
                        Admin Panel
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info Card */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
                </div>
                <div className="card-body">
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
                      <dd className="mt-1 text-sm text-gray-900">{user?.phone}</dd>
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
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;