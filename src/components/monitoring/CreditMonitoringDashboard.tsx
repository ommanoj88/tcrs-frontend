import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { creditMonitoringService } from '../../services/creditMonitoringService';
import { 
  CreditMonitoringResponse, 
  CreditAlertResponse, 
  AlertStatistics,
  MONITORING_TYPE_LABELS,
  ALERT_SEVERITY_COLORS,
  ALERT_SEVERITY_LABELS
} from '../../types/creditMonitoring';
import LoadingSpinner from '../LoadingSpinner';

const CreditMonitoringDashboard: React.FC = () => {
  const [monitoringSetups, setMonitoringSetups] = useState<CreditMonitoringResponse[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<CreditAlertResponse[]>([]);
  const [statistics, setStatistics] = useState<AlertStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch monitoring setups
      const monitoringData = await creditMonitoringService.getUserCreditMonitoring(0, 10);
      setMonitoringSetups(monitoringData.content);
      
      // Fetch recent alerts
      const alertsData = await creditMonitoringService.getUserAlerts(0, 5, false);
      setRecentAlerts(alertsData.content);
      
      // Fetch statistics
      const statsData = await creditMonitoringService.getUserAlertStatistics();
      setStatistics(statsData);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Credit Monitoring Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor credit changes and receive automated alerts for your businesses
          </p>
        </div>
        <Link
          to="/dashboard/monitoring/setup"
          className="btn-primary"
        >
          + Setup New Monitoring
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {statistics.activeMonitoring}
              </div>
              <div className="text-sm text-gray-600">Active Monitoring</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {statistics.unreadAlerts}
              </div>
              <div className="text-sm text-gray-600">Unread Alerts</div>
              <div className="text-xs text-gray-500 mt-1">
                {statistics.totalAlerts} total
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {statistics.criticalAlerts + statistics.highAlerts}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
              <div className="text-xs text-gray-500 mt-1">
                {statistics.criticalAlerts} critical
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {statistics.recentAlerts}
              </div>
              <div className="text-sm text-gray-600">Recent Alerts</div>
              <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Monitoring Setups */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Active Monitoring</h2>
              <Link
                to="/dashboard/monitoring/list"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="card-body">
            {monitoringSetups.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h5v6z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Monitoring Setup</h3>
                  <p className="text-gray-600 mb-4">Start monitoring your businesses to receive automated alerts.</p>
                  <Link
                    to="/dashboard/monitoring/setup"
                    className="btn-primary"
                  >
                    Setup Monitoring
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {monitoringSetups.map((monitoring) => (
                  <div key={monitoring.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{monitoring.monitoringName}</h3>
                        <p className="text-sm text-gray-600">{monitoring.businessName}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        monitoring.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {monitoring.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium">{MONITORING_TYPE_LABELS[monitoring.monitoringType]}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Alerts Sent:</span>
                        <div className="font-medium">{monitoring.totalAlertsSent}</div>
                      </div>
                    </div>
                    
                    {monitoring.lastAlertDate && (
                      <div className="text-xs text-gray-500 mt-2">
                        Last alert: {formatDate(monitoring.lastAlertDate)}
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-3">
                      <Link
                        to={`/dashboard/monitoring/edit/${monitoring.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Configure
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Alerts</h2>
              <Link
                to="/dashboard/monitoring/alerts"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="card-body">
            {recentAlerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h5v6z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Alerts</h3>
                  <p className="text-gray-600">You'll see alerts here when monitoring detects changes.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            ALERT_SEVERITY_COLORS[alert.severityLevel]
                          }`}>
                            {ALERT_SEVERITY_LABELS[alert.severityLevel]}
                          </span>
                          {!alert.isRead && (
                            <span className="inline-flex h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{alert.businessName}</p>
                        <p className="text-sm text-gray-700">{alert.description}</p>
                      </div>
                    </div>
                    
                    {(alert.previousValue && alert.currentValue) && (
                      <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <span className="text-gray-500">Previous:</span>
                          <div className="font-medium">{alert.previousValue}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Current:</span>
                          <div className="font-medium">{alert.currentValue}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>{formatDate(alert.createdAt)}</span>
                      <div className="flex space-x-2">
                        {!alert.isRead && (
                          <button
                            onClick={async () => {
                              try {
                                await creditMonitoringService.markAlertAsRead(alert.id);
                                fetchDashboardData(); // Refresh data
                              } catch (err) {
                                console.error('Error marking alert as read:', err);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Mark as Read
                          </button>
                        )}
                        <Link
                          to={`/dashboard/monitoring/alerts/${alert.id}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Type Distribution */}
      {statistics && statistics.alertTypeDistribution && (
        <div className="card mt-8">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Alert Distribution (Last 30 Days)</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(statistics.alertTypeDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700">
                    {type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatNumber(count)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mt-8">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/dashboard/monitoring/setup"
              className="btn-outline text-center"
            >
              Setup New Monitoring
            </Link>
            <Link
              to="/dashboard/monitoring/alerts?unread=true"
              className="btn-outline text-center"
            >
              View Unread Alerts
            </Link>
            <Link
              to="/dashboard/search"
              className="btn-outline text-center"
            >
              Find Business to Monitor
            </Link>
            <Link
              to="/dashboard/monitoring/settings"
              className="btn-outline text-center"
            >
              Notification Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditMonitoringDashboard;