import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kycService, KycAnalytics } from '../../services/kycService';
import { businessService } from '../../services/businessService';
// Import the existing Business type from your types
import { Business } from '../../types/business';
import LoadingSpinner from '../LoadingSpinner';

const KycOverview: React.FC = () => {
  const [analytics, setAnalytics] = useState<KycAnalytics | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [analyticsData, businessData] = await Promise.all([
        kycService.getKycAnalytics().catch(() => ({
          totalDocuments: 0,
          pendingDocuments: 0,
          verifiedDocuments: 0,
          rejectedDocuments: 0,
          totalProfiles: 0,
          completedProfiles: 0,
          inProgressProfiles: 0,
          pendingReviewProfiles: 0,
          lowRiskProfiles: 0,
          mediumRiskProfiles: 0,
          highRiskProfiles: 0,
          veryHighRiskProfiles: 0,
          averageCompletionPercentage: 0,
          averageRiskScore: 0,
        })),
        businessService.getMyBusinesses().catch(() => [])
      ]);
      
      setAnalytics(analyticsData);
      setBusinesses(businessData.slice(0, 10)); // Show first 10 businesses
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error Loading KYC Data</h3>
          <p>{error}</p>
          <button onClick={loadData} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Safe calculation for verification rate
  const calculateVerificationRate = () => {
    if (!analytics || !analytics.totalDocuments || analytics.totalDocuments === 0) {
      return 0;
    }
    return Math.round(((analytics.verifiedDocuments || 0) / analytics.totalDocuments) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔐 KYC Management
        </h1>
        <p className="text-gray-600">
          Manage document verification and compliance for all businesses
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📄</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.totalDocuments || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-yellow-600 font-medium">
                {analytics?.pendingDocuments || 0} pending verification
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Verified Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.verifiedDocuments || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                {calculateVerificationRate()}% verification rate
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🏢</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    KYC Profiles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.totalProfiles || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-blue-600 font-medium">
                {analytics?.completedProfiles || 0} completed
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Completion
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(analytics?.averageCompletionPercentage || 0)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className={`font-medium ${getCompletionColor(analytics?.averageCompletionPercentage || 0)}`}>
                System-wide average
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-2xl mr-4">⏳</div>
              <div>
                <h4 className="font-medium text-gray-900">Review Pending Documents</h4>
                <p className="text-sm text-gray-600">{analytics?.pendingDocuments || 0} documents awaiting verification</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-2xl mr-4">⚠️</div>
              <div>
                <h4 className="font-medium text-gray-900">High Risk Profiles</h4>
                <p className="text-sm text-gray-600">{(analytics?.highRiskProfiles || 0) + (analytics?.veryHighRiskProfiles || 0)} profiles need attention</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-2xl mr-4">📈</div>
              <div>
                <h4 className="font-medium text-gray-900">KYC Analytics</h4>
                <p className="text-sm text-gray-600">View detailed compliance reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Businesses */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Your Businesses</h3>
            <Link
              to="/dashboard/businesses"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          {businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((business) => (
                <div key={business.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{business.businessName}</h4>
                    <span className="text-xs text-gray-500">{business.businessType}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{business.gstin}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/dashboard/kyc/${business.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View KYC →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first business</p>
              <Link
                to="/dashboard/businesses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Manage Businesses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycOverview;