import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tradeReferenceService } from '../../services/tradeReferenceService';
import { businessSearchService } from '../../services/BusinessSearchService';
import { TradeReferenceAnalyticsResponse } from '../../types/tradeReference';
import { Business } from '../../types/business';
import LoadingSpinner from '../LoadingSpinner';

interface TradeReferenceAnalyticsProps {
  businessId?: number;
  business?: Business;
}

const TradeReferenceAnalytics: React.FC<TradeReferenceAnalyticsProps> = ({ 
  businessId: propBusinessId, 
  business: propBusiness 
}) => {
  const { businessId: paramBusinessId } = useParams<{ businessId: string }>();
  const businessId = propBusinessId || (paramBusinessId ? parseInt(paramBusinessId) : 0);
  
  const [analytics, setAnalytics] = useState<TradeReferenceAnalyticsResponse | null>(null);
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
      const data = await tradeReferenceService.getTradeReferenceAnalytics(businessId);
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
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-blue-600';
    if (score >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
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

  if (!analytics || analytics.totalReferences === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Trade References</h3>
          <p className="text-gray-600 mb-4">
            No trade references have been added for this business yet.
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
          <h2 className="text-xl font-semibold text-gray-900">Trade Reference Analytics</h2>
          <p className="text-gray-600">{business?.businessName || analytics.businessName}</p>
        </div>
        <div className="text-sm text-gray-500">
          Based on {analytics.totalReferences} references
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.totalReferences}
            </div>
            <div className="text-sm text-gray-600">Total References</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.verifiedReferences} verified
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className={`text-2xl font-bold mb-1 ${getPercentageColor(analytics.verificationRate)}`}>
              {analytics.verificationRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Verification Rate</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(analytics.averageOverallRating)}`}>
              {analytics.averageOverallRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-xs text-gray-500 mt-1">out of 5.0</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(analytics.totalBusinessValue)}
            </div>
            <div className="text-sm text-gray-600">Total Business Value</div>
          </div>
        </div>
      </div>

      {/* Reference Quality Metrics */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Reference Quality</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive References Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Positive References</span>
                <span className={`text-sm font-bold ${getPercentageColor(analytics.positiveReferenceRate)}`}>
                  {analytics.positiveReferenceRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressBarColor(analytics.positiveReferenceRate)}`}
                  style={{ width: `${Math.min(analytics.positiveReferenceRate, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.positiveReferences} out of {analytics.totalReferences} references
              </div>
            </div>

            {/* Payment Rating */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Rating</span>
                <span className={`text-sm font-bold ${getScoreColor(analytics.averagePaymentRating)}`}>
                  {analytics.averagePaymentRating.toFixed(1)}/5.0
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreColor(analytics.averagePaymentRating) === 'text-green-600' ? 'bg-green-500' : 
                    getScoreColor(analytics.averagePaymentRating) === 'text-blue-600' ? 'bg-blue-500' :
                    getScoreColor(analytics.averagePaymentRating) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${(analytics.averagePaymentRating / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Value Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Business Value Metrics</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average per Reference</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(analytics.averageBusinessValuePerReference)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Business Total</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(analytics.averageMonthlyBusinessTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credit Limits Provided</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(analytics.totalCreditLimitProvided || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Relationship Insights</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Long-term Relationships</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.longTermRelationships} ({'>'}2 years)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High-value Relationships</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.highValueRelationships} ({'>'}₹1 Cr)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Duration</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.averageRelationshipDuration.toFixed(1)} months
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reference Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Reference Types</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {Object.entries(analytics.referenceTypeDistribution).map(([type, count]) => {
                const percentage = (count / analytics.totalReferences) * 100;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {type.replace(/_/g, ' ')}
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

        {/* Relationship Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Relationship Types</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {Object.entries(analytics.relationshipTypeDistribution).map(([type, count]) => {
                const percentage = (count / analytics.totalReferences) * 100;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {type.replace(/_/g, ' ')}
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
      </div>

      {/* Payment Behavior & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Behavior Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Payment Behavior</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {Object.entries(analytics.paymentBehaviorDistribution).map(([behavior, count]) => {
                const percentage = analytics.verifiedReferences > 0 ? (count / analytics.verifiedReferences) * 100 : 0;
                const behaviorColor = behavior === 'EXCELLENT' ? 'text-green-600' :
                                   behavior === 'GOOD' ? 'text-blue-600' :
                                   behavior === 'SATISFACTORY' ? 'text-yellow-600' : 'text-red-600';
                return (
                  <div key={behavior} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${behaviorColor}`}>
                        {behavior.replace(/_/g, ' ')}
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

        {/* Recommendation Level Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {Object.entries(analytics.recommendationLevelDistribution).map(([level, count]) => {
                const percentage = analytics.verifiedReferences > 0 ? (count / analytics.verifiedReferences) * 100 : 0;
                const levelColor = level === 'HIGHLY_RECOMMENDED' ? 'text-green-600' :
                                 level === 'RECOMMENDED' ? 'text-blue-600' :
                                 level === 'CONDITIONALLY_RECOMMENDED' ? 'text-yellow-600' : 'text-red-600';
                return (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${levelColor}`}>
                        {level.replace(/_/g, ' ')}
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
      </div>

      {/* Excellence Indicators */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Excellence Indicators</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {analytics.excellentPaymentBehaviorCount}
              </div>
              <div className="text-sm text-gray-600">Excellent Payment Behavior</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {analytics.highlyRecommendedCount}
              </div>
              <div className="text-sm text-gray-600">Highly Recommended</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {analytics.confidentialReferences}
              </div>
              <div className="text-sm text-gray-600">Confidential References</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">
                {analytics.recentVerifications}
              </div>
              <div className="text-sm text-gray-600">Recent Verifications</div>
              <div className="text-xs text-gray-500">(Last 30 days)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      {(analytics.referencesWithDisputes > 0 || analytics.disputeRate > 0) && (
        <div className="card border-red-200">
          <div className="card-header bg-red-50">
            <h3 className="text-lg font-medium text-red-900">Risk Indicators</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {analytics.referencesWithDisputes}
                </div>
                <div className="text-sm text-gray-600">References with Disputes</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {analytics.disputeRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Dispute Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeReferenceAnalytics;