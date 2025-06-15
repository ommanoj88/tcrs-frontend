import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { paymentHistoryService } from '../../services/paymentHistoryService';
import { businessSearchService } from '../../services/BusinessSearchService';
import { PaymentAnalyticsResponse } from '../../types/payment';
import { Business } from '../../types/business';
import LoadingSpinner from '../LoadingSpinner';

interface PaymentAnalyticsDashboardProps {
  businessId?: number;
  business?: Business;
}

const PaymentAnalyticsDashboard: React.FC<PaymentAnalyticsDashboardProps> = ({ 
  businessId: propBusinessId, 
  business: propBusiness 
}) => {
  const { businessId: paramBusinessId } = useParams<{ businessId: string }>();
  const businessId = propBusinessId || (paramBusinessId ? parseInt(paramBusinessId) : 0);
  
  const [analytics, setAnalytics] = useState<PaymentAnalyticsResponse | null>(null);
  const [business, setBusiness] = useState<Business | null>(propBusiness || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (businessId) {
      fetchAnalytics();
      if (!business) {
        fetchBusinessDetails();
      }
    }
  }, [businessId]);

  const fetchAnalytics = async () => {
    try {
      const data = await paymentHistoryService.getPaymentAnalytics(businessId);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinessDetails = async () => {
    try {
      const data = await businessSearchService.getBusinessById(businessId);
      setBusiness(data);
    } catch (err: any) {
      console.error('Error fetching business details:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  if (!analytics || analytics.totalTransactions === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
          <p className="text-gray-600 mb-4">
            No payment transactions have been recorded for this business yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Analytics</h2>
          <p className="text-gray-600">{business?.businessName || analytics.businessName}</p>
        </div>
        <div className="text-sm text-gray-500">
          Based on {analytics.totalTransactions} transactions
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Transaction Value */}
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(analytics.totalTransactionValue)}
            </div>
            <div className="text-sm text-gray-600">Total Transaction Value</div>
          </div>
        </div>

        {/* On-Time Payment Percentage */}
        <div className="card">
          <div className="card-body text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(analytics.onTimePaymentPercentage)}`}>
              {analytics.onTimePaymentPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">On-Time Payments</div>
          </div>
        </div>

        {/* Average Payment Delay */}
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.averagePaymentDelay.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg. Delay (Days)</div>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {formatCurrency(analytics.totalOverdueAmount)}
            </div>
            <div className="text-sm text-gray-600">Overdue Amount</div>
          </div>
        </div>
      </div>

      {/* Payment Behavior Scores */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Payment Behavior Scores</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reliability Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Reliability</span>
                <span className={`text-sm font-bold ${getScoreColor(analytics.paymentReliabilityScore)}`}>
                  {analytics.paymentReliabilityScore.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(analytics.paymentReliabilityScore)}`}
                  style={{ width: `${Math.min(analytics.paymentReliabilityScore, 100)}%` }}
                />
              </div>
            </div>

            {/* Speed Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Speed</span>
                <span className={`text-sm font-bold ${getScoreColor(analytics.paymentSpeedScore)}`}>
                  {analytics.paymentSpeedScore.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(analytics.paymentSpeedScore)}`}
                  style={{ width: `${Math.min(analytics.paymentSpeedScore, 100)}%` }}
                />
              </div>
            </div>

            {/* Dispute Frequency Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Dispute Management</span>
                <span className={`text-sm font-bold ${getScoreColor(analytics.disputeFrequencyScore)}`}>
                  {analytics.disputeFrequencyScore.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(analytics.disputeFrequencyScore)}`}
                  style={{ width: `${Math.min(analytics.disputeFrequencyScore, 100)}%` }}
                />
              </div>
            </div>

            {/* Overall Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Payment Score</span>
                <span className={`text-sm font-bold ${getScoreColor(analytics.overallPaymentScore)}`}>
                  {analytics.overallPaymentScore.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(analytics.overallPaymentScore)}`}
                  style={{ width: `${Math.min(analytics.overallPaymentScore, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Payment Status Distribution</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {Object.entries(analytics.paymentStatusDistribution).map(([status, count]) => {
                const percentage = (count / analytics.totalTransactions) * 100;
                const statusColor = getStatusColor(status);
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {formatStatusLabel(status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trade Relationship Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Trade Relationships</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {Object.entries(analytics.relationshipTypeBreakdown).map(([relationship, count]) => {
                const percentage = (count / analytics.totalTransactions) * 100;
                const avgRating = analytics.averageRatingByRelationship[relationship] || 0;
                
                return (
                  <div key={relationship} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {relationship}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}% • ⭐ {avgRating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Risk Indicators</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">
                {analytics.longestPaymentDelay}
              </div>
              <div className="text-sm text-gray-600">Longest Delay (Days)</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">
                {analytics.totalDisputes}
              </div>
              <div className="text-sm text-gray-600">Total Disputes</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(analytics.largestOverdueAmount)}
              </div>
              <div className="text-sm text-gray-600">Largest Overdue</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {analytics.totalOverdueTransactions}
              </div>
              <div className="text-sm text-gray-600">Overdue Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      {Object.keys(analytics.monthlyPaymentTrends).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Payment Trends (Last 6 Months)</h3>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Month</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Transactions</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Avg. Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.monthlyPaymentTrends)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 6)
                    .map(([month, avgDelay]) => {
                      const transactionCount = analytics.monthlyTransactionCounts[month] || 0;
                      const monthDate = new Date(month + '-01');
                      const monthName = monthDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short' 
                      });
                      
                      return (
                        <tr key={month} className="border-b border-gray-100">
                          <td className="py-2 text-sm text-gray-900">{monthName}</td>
                          <td className="py-2 text-sm text-gray-900 text-right">{transactionCount}</td>
                          <td className={`py-2 text-sm text-right ${
                            avgDelay > 30 ? 'text-red-600' : 
                            avgDelay > 15 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {avgDelay.toFixed(1)} days
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID': return 'bg-green-500';
    case 'PENDING': return 'bg-yellow-500';
    case 'OVERDUE': return 'bg-red-500';
    case 'PARTIAL': return 'bg-orange-500';
    case 'DISPUTED': return 'bg-purple-500';
    case 'DEFAULTED': return 'bg-red-700';
    case 'WRITTEN_OFF': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const formatStatusLabel = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export default PaymentAnalyticsDashboard;