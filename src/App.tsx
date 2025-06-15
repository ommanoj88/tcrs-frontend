import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import BusinessList from './components/business/BusinessList';
import CreateBusiness from './components/business/CreateBusiness';
import BusinessSearch from './components/search/BusinessSearch';
import BusinessDetailView from './components/search/BusinessDetailView';
import UserManagement from './components/admin/UserManagement';
import RoleHistory from './components/admin/RoleHistory';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="search" element={<BusinessSearch />} />
              <Route path="search/business/:businessId" element={<BusinessDetailView />} />
              <Route path="businesses" element={<BusinessList />} />
              <Route path="businesses/create" element={<CreateBusiness />} />
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/role-history" element={<RoleHistory />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;