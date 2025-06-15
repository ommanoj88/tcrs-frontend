import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { businessSearchService } from '../../services/BusinessSearchService';
import { creditReportService } from '../../services/creditReportService';
import { Business, BUSINESS_TYPE_LABELS, INDUSTRY_CATEGORY_LABELS } from '../../types/business';
import { CreditReportResponse } from '../../types/credit';
import PaymentAnalyticsDashboard from '../payment/PaymentAnalyticsDasboard';
import PaymentHistoryList from '../payment/PaymentHistoryList';
import TradeReferenceAnalytics from '../reference/TradeReferenceAnalytics';
import TradeReferenceList from '../reference/TradeReferenceList';
import LoadingSpinner from '../LoadingSpinner';

const EnhancedBusinessDetailView: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [creditHistory, setCreditHistory] = useState<CreditReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCredit, setIsLoadingCredit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(parseInt(businessId));
    }
  }, [businessId]);

  useEffect(() => {
    if (business && activeTab === 'credit-history') {
      fetchCreditHistory();
    }
  }, [business, activeTab]);

  const fetchBusinessDetails = async (id: number) => {
    try {
      const data = await businessSearchService.getBusinessById(id);
      setBusiness(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditHistory = async () => {
    if (!business) return;
    
    setIsLoadingCredit(true);
    try {
      const data = await creditReportService.getBusinessCreditHistory(business.id);
      setCreditHistory(data);
    } catch (err: any) {
      console.error('Error fetching credit history:', err);
    } finally {
      setIsLoadingCredit(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Business not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {business.businessName}
            </h1>
            <p className="text-gray-600">
              {business.city}, {business.state} • {BUSINESS_TYPE_LABELS[business.businessType]}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/dashboard/search"
              className="btn-secondary"
            >
              Back to Search
            </Link>
            <Link
              to={`/dashboard/search/business/${business.id}/credit-report`}
              className="btn-primary"
            >
              Generate Credit Report
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange('trade-references')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trade-references'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trade References
          </button>
          <button
            onClick={() => handleTabChange('trade-analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trade-analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reference Analytics
          </button>
          <button
            onClick={() => handleTabChange('payment-analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment-analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Analytics
          </button>
          <button
            onClick={() => handleTabChange('payment-history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment-history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => handleTabChange('credit-history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'credit-history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Credit History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
              </div>
              <div className="card-body">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{business.businessName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">GSTIN</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      {business.gstin}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        business.gstinVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {business.gstinVerified ? 'Verified' : 'Pending'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">PAN</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      {business.pan}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        business.panVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {business.panVerified ? 'Verified' : 'Pending'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Business Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {BUSINESS_TYPE_LABELS[business.businessType]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {INDUSTRY_CATEGORY_LABELS[business.industryCategory]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {business.registrationDate ? formatDate(business.registrationDate) : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
              </div>
              <div className="card-body">
                <dl className="space-y-4">
                  {business.address && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {business.address}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900">{business.city}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">State</dt>
                    <dd className="mt-1 text-sm text-gray-900">{business.state}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">PIN Code</dt>
                    <dd className="mt-1 text-sm text-gray-900">{business.pincode}</dd>
                  </div>
                  {business.phoneNumber && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{business.phoneNumber}</dd>
                    </div>
                  )}
                  {business.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{business.email}</dd>
                    </div>
                  )}
                  {business.website && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Website</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {business.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Business Description */}
            {business.businessDescription && (
              <div className="card lg:col-span-2">
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Business Description</h2>
                </div>
                <div className="card-body">
                  <p className="text-sm text-gray-700">{business.businessDescription}</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card lg:col-span-2">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link
                    to={`/dashboard/search/business/${business.id}/credit-report`}
                    className="btn-primary text-center"
                  >
                    Generate Credit Report
                  </Link>
                  <Link
                    to={`/dashboard/reference/add/${business.id}`}
                    className="btn-outline text-center"
                  >
                    Add Trade Reference
                  </Link>
                  <Link
                    to={`/dashboard/payment/add/${business.id}`}
                    className="btn-outline text-center"
                  >
                    Add Payment History
                  </Link>
                  <button
                    onClick={() => handleTabChange('trade-analytics')}
                    className="btn-outline"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trade-references' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Trade References</h2>
              <Link
                to={`/dashboard/reference/add/${business.id}`}
                className="btn-primary"
              >
                Add Trade Reference
              </Link>
            </div>
            <TradeReferenceList businessId={business.id} />
          </div>
        )}

        {activeTab === 'trade-analytics' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Trade Reference Analytics</h2>
              <Link
                to={`/dashboard/reference/add/${business.id}`}
                className="btn-primary"
              >
                Add Trade Reference
              </Link>
            </div>
            <TradeReferenceAnalytics businessId={business.id} business={business} />
          </div>
        )}

        {activeTab === 'payment-analytics' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Analytics</h2>
              <Link
                to={`/dashboard/payment/add/${business.id}`}
                className="btn-primary"
              >
                Add Payment History
              </Link>
            </div>
            <PaymentAnalyticsDashboard businessId={business.id} business={business} />
          </div>
        )}

        {activeTab === 'payment-history' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
              <Link
                to={`/dashboard/payment/add/${business.id}`}
                className="btn-primary"
              >
                Add Payment History
              </Link>
            </div>
            <PaymentHistoryList businessId={business.id} />
          </div>
        )}

        {activeTab === 'credit-history' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Credit History</h2>
              <Link
                to={`/dashboard/search/business/${business.id}/credit-report`}
                className="btn-primary"
              >
                Generate New Report
              </Link>
            </div>
            
            {isLoadingCredit ? (
              <LoadingSpinner />
            ) : creditHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Credit Reports</h3>
                    <p className="text-gray-600 mb-4">
                      No credit reports have been generated for this business yet.
                    </p>
                    <Link
                      to={`/dashboard/search/business/${business.id}/credit-report`}
                      className="btn-primary"
                    >
                      Generate First Credit Report
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {creditHistory.map((report) => (
                  <div key={report.id} className="card hover:shadow-lg transition-shadow">
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Report #{report.reportNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Generated on {formatDate(report.createdAt)}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          new Date(report.reportValidUntil) > new Date() 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {new Date(report.reportValidUntil) > new Date() ? 'Valid' : 'Expired'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {report.creditScore.toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-600">Credit Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Grade: {report.creditScoreGrade}
                          </div>
                          <div className="text-sm text-gray-600">
                            {report.riskCategory} Risk
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-lg font-semibold text-green-600">
                          ₹{(report.creditLimitRecommendation / 100000).toFixed(2)} L
                        </div>
                        <div className="text-sm text-gray-600">Recommended Credit Limit</div>
                      </div>
                      
                      <Link
                        to={`/dashboard/credit/report/${report.reportNumber}`}
                        className="btn-primary w-full text-center"
                      >
                        View Full Report
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBusinessDetailView;