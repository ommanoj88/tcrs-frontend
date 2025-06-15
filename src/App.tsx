import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import BusinessList from './components/business/BusinessList';
import CreateBusiness from './components/business/CreateBusiness';
import BusinessSearch from './components/search/BusinessSearch';
import EnhancedBusinessDetailView from './components/search/EnhancedBusinessDetailView';
import GenerateCreditReport from './components/credit/GenerateCreditReport';
import CreditReportDisplay from './components/credit/CreditReportDisplay';
import MyCreditReports from './components/credit/MyCreditReports';
import AddPaymentHistory from './components/payment/AddPaymentHistory';
import PaymentHistoryList from './components/payment/PaymentHistoryList';
import PaymentAnalyticsDashboard from './components/payment/PaymentAnalyticsDasboard';
import AddTradeReference from './components/reference/AddTradeReference';
import TradeReferenceList from './components/reference/TradeReferenceList';
import TradeReferenceAnalytics from './components/reference/TradeReferenceAnalytics';
import ReferenceVerificationInterface from './components/reference/ReferenceVerificationInterface';
import UserManagement from './components/admin/UserManagement';
import RoleHistory from './components/admin/RoleHistory';
import ProtectedRoute from './components/ProtectedRoute';

// Create wrapper components for specific routes
const MyPaymentReports: React.FC = () => {
  return <PaymentHistoryList showBusinessInfo={true} />;
};

const MyTradeReferences: React.FC = () => {
  return <TradeReferenceList showBusinessInfo={true} />;
};

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
              {/* Search Routes */}
              <Route path="search" element={<BusinessSearch />} />
              <Route path="search/business/:businessId" element={<EnhancedBusinessDetailView />} />
              
              {/* Credit Report Routes */}
              <Route path="search/business/:businessId/credit-report" element={<GenerateCreditReport />} />
              <Route path="credit/report/:reportNumber" element={<CreditReportDisplay />} />
              <Route path="credit/my-reports" element={<MyCreditReports />} />
              
              {/* Payment History Routes */}
              <Route path="payment/add/:businessId" element={<AddPaymentHistory />} />
              <Route path="payment/business/:businessId" element={<PaymentHistoryList />} />
              <Route path="payment/analytics/:businessId" element={<PaymentAnalyticsDashboard />} />
              <Route path="payment/my-reports" element={<MyPaymentReports />} />
              
              {/* Trade Reference Routes */}
              <Route path="reference/add/:businessId" element={<AddTradeReference />} />
              <Route path="reference/business/:businessId" element={<TradeReferenceList />} />
              <Route path="reference/analytics/:businessId" element={<TradeReferenceAnalytics />} />
              <Route path="reference/my-references" element={<MyTradeReferences />} />
              <Route path="reference/verify" element={<ReferenceVerificationInterface />} />
              
              {/* Business Routes */}
              <Route path="businesses" element={<BusinessList />} />
              <Route path="businesses/create" element={<CreateBusiness />} />
              
              {/* Admin Routes */}
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