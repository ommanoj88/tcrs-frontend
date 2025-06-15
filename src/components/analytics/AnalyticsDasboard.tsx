import React, { useState, useEffect } from 'react';
import { analyticsService, DashboardAnalytics } from '../../services/analyticsService';
import { TrendLineChart, DistributionDoughnutChart, VerticalBarChart, HorizontalBarChart } from './charts/ChartComponents';
import LoadingSpinner from '../LoadingSpinner';

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await analyticsService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error Loading Analytics</h3>
          <p>{error}</p>
          <button 
            onClick={loadAnalytics}
            className="mt-2 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'business', label: 'Business Analytics', icon: '🏢' },
    { key: 'credit', label: 'Credit Analytics', icon: '💳' },
    { key: 'payments', label: 'Payment Analytics', icon: '💰' },
    { key: 'alerts', label: 'Alerts Analytics', icon: '🚨' },
    { key: 'geographic', label: 'Geographic', icon: '🌍' },
    { key: 'industry', label: 'Industry', icon: '🏭' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into your credit reference system
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {new Date(analytics.overview.lastUpdated).toLocaleString()}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  🔄 Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {selectedTab === 'overview' && <OverviewTab analytics={analytics} />}
        {selectedTab === 'business' && <BusinessTab analytics={analytics.businessAnalytics} />}
        {selectedTab === 'credit' && <CreditTab analytics={analytics.creditAnalytics} />}
        {selectedTab === 'payments' && <PaymentsTab analytics={analytics.paymentAnalytics} />}
        {selectedTab === 'alerts' && <AlertsTab analytics={analytics.alertAnalytics} />}
        {selectedTab === 'geographic' && <GeographicTab data={analytics.geographicDistribution} />}
        {selectedTab === 'industry' && <IndustryTab data={analytics.industryDistribution} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ analytics: DashboardAnalytics }> = ({ analytics }) => {
  const { overview } = analytics;

  const overviewCards = [
    {
      title: 'Total Businesses',
      value: overview.totalBusinesses.toLocaleString(),
      icon: '🏢',
      color: 'bg-blue-500',
      change: '+12% from last month',
      changeType: 'positive'
    },
    {
      title: 'Credit Reports',
      value: overview.totalCreditReports.toLocaleString(),
      icon: '📋',
      color: 'bg-green-500',
      change: '+8% from last month',
      changeType: 'positive'
    },
    {
      title: 'Payment Records',
      value: overview.totalPaymentRecords.toLocaleString(),
      icon: '💰',
      color: 'bg-yellow-500',
      change: '+15% from last month',
      changeType: 'positive'
    },
    {
      title: 'Trade References',
      value: overview.totalTradeReferences.toLocaleString(),
      icon: '🤝',
      color: 'bg-purple-500',
      change: '+5% from last month',
      changeType: 'positive'
    },
    {
      title: 'Active Alerts',
      value: overview.totalAlerts.toLocaleString(),
      icon: '🚨',
      color: 'bg-red-500',
      change: '-3% from last month',
      changeType: 'negative'
    },
    {
      title: 'System Health',
      value: `${overview.systemHealth}%`,
      icon: '💚',
      color: 'bg-emerald-500',
      change: '+2% from last month',
      changeType: 'positive'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewCards.map((card, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`${card.color} rounded-lg p-3 mr-4`}>
                  <span className="text-white text-2xl">{card.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-xs ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Business Growth Trend</h3>
          </div>
          <div className="card-body">
            <TrendLineChart
              data={analytics.trends.businessRegistrations}
              title="Monthly Business Registrations"
              dataKey="count"
              color="#3B82F6"
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Alert Activity</h3>
          </div>
          <div className="card-body">
            <TrendLineChart
              data={analytics.trends.alertActivity}
              title="Monthly Alert Generation"
              dataKey="count"
              color="#EF4444"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Business Tab Component
const BusinessTab: React.FC<{ analytics: any }> = ({ analytics }) => {
  const businessTypeColors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(239, 68, 68, 0.8)',
  ];

  const industryColors = [
    'rgba(99, 102, 241, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(251, 191, 36, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(244, 63, 94, 0.8)',
    'rgba(6, 182, 212, 0.8)',
  ];

  return (
    <div className="space-y-6">
      {/* Business Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.totalBusinesses?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Businesses</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.newBusinessesThisMonth?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">New This Month</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-purple-600">{analytics.verifiedBusinesses?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-indigo-600">{analytics.verificationRate?.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Verification Rate</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Business Type Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.businessTypeDistribution || {}}
              title="Business Types"
              colors={businessTypeColors}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Industry Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.industryDistribution || {}}
              title="Industries"
              colors={industryColors}
            />
          </div>
        </div>
      </div>

      {/* Business Growth Trend */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Business Registration Trend</h3>
        </div>
        <div className="card-body">
          <TrendLineChart
            data={analytics.businessGrowthTrend || []}
            title="Monthly Business Registrations"
            dataKey="count"
            color="#3B82F6"
          />
        </div>
      </div>
    </div>
  );
};

// Credit Tab Component
const CreditTab: React.FC<{ analytics: any }> = ({ analytics }) => {
  const scoreDistributionColors = [
    'rgba(239, 68, 68, 0.8)',   // 300-400 (Red)
    'rgba(245, 158, 11, 0.8)',  // 400-500 (Orange)
    'rgba(251, 191, 36, 0.8)',  // 500-600 (Yellow)
    'rgba(59, 130, 246, 0.8)',  // 600-700 (Blue)
    'rgba(16, 185, 129, 0.8)',  // 700-800 (Green)
    'rgba(34, 197, 94, 0.8)',   // 800+ (Dark Green)
  ];

  const riskColors = [
    'rgba(34, 197, 94, 0.8)',   // LOW
    'rgba(59, 130, 246, 0.8)',  // MODERATE
    'rgba(251, 191, 36, 0.8)',  // MEDIUM
    'rgba(245, 158, 11, 0.8)',  // HIGH
    'rgba(239, 68, 68, 0.8)',   // VERY_HIGH
  ];

  return (
    <div className="space-y-6">
      {/* Credit Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.averageCreditScore?.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Average Credit Score</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.medianCreditScore?.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Median Score</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-red-600">{analytics.highRiskBusinesses?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-emerald-600">{analytics.lowRiskBusinesses?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Low Risk</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Credit Score Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.creditScoreDistribution || {}}
              title="Score Ranges"
              colors={scoreDistributionColors}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Risk Category Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.riskCategoryDistribution || {}}
              title="Risk Categories"
              colors={riskColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Payments Tab Component
const PaymentsTab: React.FC<{ analytics: any }> = ({ analytics }) => {
  const paymentStatusColors = [
    'rgba(34, 197, 94, 0.8)',   // PAID
    'rgba(251, 191, 36, 0.8)',  // PENDING
    'rgba(239, 68, 68, 0.8)',   // OVERDUE
    'rgba(127, 29, 29, 0.8)',   // DEFAULTED
    'rgba(168, 85, 247, 0.8)',  // PARTIALLY_PAID
    'rgba(75, 85, 99, 0.8)',    // DISPUTED
  ];

  return (
    <div className="space-y-6">
      {/* Payment Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.onTimePaymentRate?.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">On-time Payment Rate</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-orange-600">{analytics.averagePaymentDelay?.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Avg Delay (Days)</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-red-600">₹{(analytics.totalOverdueAmount / 100000)?.toFixed(1)}L</div>
            <div className="text-sm text-gray-600">Total Overdue</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-purple-600">{analytics.overduePayments?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Overdue Payments</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Payment Status Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.paymentStatusDistribution || {}}
              title="Payment Status"
              colors={paymentStatusColors}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Top Defaulters</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(analytics.topDefaulters || []).map((defaulter: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{defaulter.businessName}</div>
                    <div className="text-sm text-gray-600">Score: {defaulter.creditScore?.toFixed(0)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">₹{(defaulter.overdueAmount / 100000)?.toFixed(1)}L</div>
                    <div className="text-sm text-gray-600">{defaulter.daysPastDue} days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alerts Tab Component
const AlertsTab: React.FC<{ analytics: any }> = ({ analytics }) => {
  const alertTypeColors = [
    'rgba(239, 68, 68, 0.8)',   // CREDIT_SCORE_CHANGE
    'rgba(251, 191, 36, 0.8)',  // PAYMENT_DELAY
    'rgba(59, 130, 246, 0.8)',  // NEW_TRADE_REFERENCE
    'rgba(16, 185, 129, 0.8)',  // CREDIT_REPORT_GENERATED
    'rgba(168, 85, 247, 0.8)',  // BUSINESS_PROFILE_CHANGE
  ];

  const severityColors = [
    'rgba(75, 85, 99, 0.8)',    // INFO
    'rgba(59, 130, 246, 0.8)',  // LOW
    'rgba(251, 191, 36, 0.8)',  // MEDIUM
    'rgba(245, 158, 11, 0.8)',  // HIGH
    'rgba(239, 68, 68, 0.8)',   // CRITICAL
  ];

  return (
    <div className="space-y-6">
      {/* Alert Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.totalAlertsGenerated?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Alerts</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-orange-600">{analytics.unreadAlerts?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-red-600">{analytics.criticalAlerts?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600">{analytics.alertAcknowledgmentRate?.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Acknowledgment Rate</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Alert Type Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.alertTypeDistribution || {}}
              title="Alert Types"
              colors={alertTypeColors}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Alert Severity Distribution</h3>
          </div>
          <div className="card-body">
            <DistributionDoughnutChart
              data={analytics.alertSeverityDistribution || {}}
              title="Severity Levels"
              colors={severityColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Geographic Tab Component
const GeographicTab: React.FC<{ data: any[] }> = ({ data }) => {
  const topStates = data
    .sort((a, b) => b.businessCount - a.businessCount)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Business Distribution by State</h3>
        </div>
        <div className="card-body">
          <HorizontalBarChart
            data={topStates}
            title="Businesses by State"
            dataKey="businessCount"
            labelKey="state"
            color="#3B82F6"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Average Credit Score by State</h3>
        </div>
        <div className="card-body">
          <HorizontalBarChart
            data={topStates.filter(s => s.averageCreditScore > 0)}
            title="Credit Score by State"
            dataKey="averageCreditScore"
            labelKey="state"
            color="#10B981"
          />
        </div>
      </div>
    </div>
  );
};

// Industry Tab Component
const IndustryTab: React.FC<{ data: any[] }> = ({ data }) => {
  const sortedIndustries = data
    .sort((a, b) => b.businessCount - a.businessCount)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Business Count by Industry</h3>
          </div>
          <div className="card-body">
            <VerticalBarChart
              data={sortedIndustries}
              title="Businesses by Industry"
              dataKey="businessCount"
              labelKey="industry"
              color="#8B5CF6"
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Average Credit Score by Industry</h3>
          </div>
          <div className="card-body">
            <VerticalBarChart
              data={sortedIndustries.filter(i => i.averageCreditScore > 0)}
              title="Credit Score by Industry"
              dataKey="averageCreditScore"
              labelKey="industry"
              color="#F59E0B"
            />
          </div>
        </div>
      </div>

      {/* Industry Risk Analysis Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Industry Risk Analysis</h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Businesses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Credit Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Payment Delay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedIndustries.map((industry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {industry.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {industry.businessCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {industry.averageCreditScore?.toFixed(0) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {industry.averagePaymentDelay?.toFixed(1) || 'N/A'} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        industry.riskLevel <= 2 ? 'bg-green-100 text-green-800' :
                        industry.riskLevel === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {industry.riskLevel <= 2 ? 'Low' : industry.riskLevel === 3 ? 'Medium' : 'High'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;