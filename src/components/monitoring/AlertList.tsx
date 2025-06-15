import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { creditMonitoringService } from '../../services/creditMonitoringService';
import { 
  CreditAlertResponse,
  AlertSeverity,
  AlertType,
  ALERT_SEVERITY_COLORS,
  ALERT_SEVERITY_LABELS,
  ALERT_TYPE_LABELS
} from '../../types/creditMonitoring';
import LoadingSpinner from '../LoadingSpinner';

const AlertList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [alerts, setAlerts] = useState<CreditAlertResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | ''>('');
  const [selectedType, setSelectedType] = useState<AlertType | ''>('');
  const [unreadOnly, setUnreadOnly] = useState(searchParams.get('unread') === 'true');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [currentPage, unreadOnly]);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await creditMonitoringService.getUserAlerts(currentPage, 10, unreadOnly);
      setAlerts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId: number) => {
    try {
      await creditMonitoringService.markAlertAsRead(alertId);
      fetchAlerts(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAcknowledge = async (alertId: number) => {
    const notes = prompt('Enter acknowledgment notes (optional):');
    if (notes !== null) { // User didn't cancel
      try {
        await creditMonitoringService.acknowledgeAlert(alertId, notes);
        fetchAlerts(); // Refresh list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleFilterChange = () => {
    // Apply client-side filtering
    let filteredAlerts = alerts;

    if (selectedSeverity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severityLevel === selectedSeverity);
    }

    if (selectedType) {
      filteredAlerts = filteredAlerts.filter(alert => alert.alertType === selectedType);
    }

    if (searchTerm) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredAlerts;
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

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const alertTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return formatDate(dateString);
  };

  const filteredAlerts = handleFilterChange();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Credit Alerts
          </h1>
          <p className="text-gray-600">
            Manage and track your credit monitoring alerts
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/monitoring"
            className="btn-secondary"
          >
            ← Back to Dashboard
          </Link>
          <Link
            to="/dashboard/monitoring/setup"
            className="btn-primary"
          >
            Setup Monitoring
          </Link>
        </div>
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

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Severity Filter */}
            <div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity | '')}
                className="input-field"
              >
                <option value="">All Severities</option>
                {Object.entries(ALERT_SEVERITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AlertType | '')}
                className="input-field"
              >
                <option value="">All Types</option>
                {Object.entries(ALERT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => {
                    setUnreadOnly(e.target.checked);
                    setSearchParams(e.target.checked ? { unread: 'true' } : {});
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm"
                />
                <span className="ml-2 text-sm text-gray-700">Unread only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalElements}</div>
          <div className="text-sm text-blue-800">Total Alerts</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {alerts.filter(a => !a.isRead).length}
          </div>
          <div className="text-sm text-yellow-800">Unread</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {alerts.filter(a => a.severityLevel === AlertSeverity.HIGH || a.severityLevel === AlertSeverity.CRITICAL).length}
          </div>
          <div className="text-sm text-orange-800">High Priority</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {alerts.filter(a => a.isAcknowledged).length}
          </div>
          <div className="text-sm text-green-800">Acknowledged</div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h5v6z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
              <p className="text-gray-600 mb-4">
                {unreadOnly 
                  ? "You don't have any unread alerts at the moment."
                  : "No alerts match your current filters."
                }
              </p>
              {unreadOnly && (
                <button
                  onClick={() => {
                    setUnreadOnly(false);
                    setSearchParams({});
                  }}
                  className="btn-primary"
                >
                  View All Alerts
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`card transition-all hover:shadow-md ${
              !alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
            }`}>
              <div className="card-body">
                {/* Alert Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ALERT_SEVERITY_COLORS[alert.severityLevel]
                      }`}>
                        {ALERT_SEVERITY_LABELS[alert.severityLevel]}
                      </span>
                      {!alert.isRead && (
                        <span className="inline-flex h-2 w-2 bg-blue-500 rounded-full"></span>
                      )}
                      {alert.isAcknowledged && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📋 {alert.alertNumber}</span>
                      <span>🏢 {alert.businessName}</span>
                      <span>🏷️ {ALERT_TYPE_LABELS[alert.alertType]}</span>
                      <span>🕒 {getRelativeTime(alert.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Alert Description */}
                <div className="mb-4">
                  <p className="text-gray-700">{alert.description}</p>
                </div>

                {/* Change Details */}
                {(alert.previousValue && alert.currentValue) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Change Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Previous Value:</span>
                        <div className="font-medium text-gray-900">{alert.previousValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Value:</span>
                        <div className="font-medium text-gray-900">{alert.currentValue}</div>
                      </div>
                      {alert.changeAmount && (
                        <div>
                          <span className="text-gray-500">Change:</span>
                          <div className={`font-medium ${
                            alert.changeAmount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {alert.changeAmount > 0 ? '+' : ''}{alert.changeAmount}
                            {alert.changePercentage && (
                              <span className="text-gray-600 ml-1">
                                ({alert.changePercentage > 0 ? '+' : ''}{alert.changePercentage.toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Acknowledgment Details */}
                {alert.isAcknowledged && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="text-sm">
                      <div className="font-medium text-green-900 mb-1">
                        Acknowledged by {alert.acknowledgedBy} on {formatDate(alert.acknowledgedDate!)}
                      </div>
                      {alert.acknowledgmentNotes && (
                        <div className="text-green-800">
                          Notes: {alert.acknowledgmentNotes}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-sm text-gray-500">
                    Alert #{alert.alertNumber} • Created {formatDate(alert.createdAt)}
                    {alert.expiresAt && (
                      <span className="ml-2">
                        • Expires {formatDate(alert.expiresAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    {!alert.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as Read
                      </button>
                    )}
                    {!alert.isAcknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        Acknowledge
                      </button>
                    )}
                    <Link
                      to={`/dashboard/monitoring/alerts/${alert.id}`}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      View Details
                    </Link>
                    {alert.relatedEntityType && alert.relatedEntityId && (
                      <Link
                        to={`/dashboard/${alert.relatedEntityType.toLowerCase()}/${alert.relatedEntityId}`}
                        className="text-sm text-purple-600 hover:text-purple-800"
                      >
                        View Related
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(currentPage - 2 + i, totalPages - 1));
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <div className="card mt-6">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Actions</h3>
            <div className="flex space-x-4">
              <button
                onClick={async () => {
                  if (window.confirm('Mark all alerts as read?')) {
                    // Implementation for bulk mark as read would go here
                    alert('Bulk actions not yet implemented');
                  }
                }}
                className="btn-secondary"
              >
                Mark All as Read
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Acknowledge all unacknowledged alerts?')) {
                    // Implementation for bulk acknowledge would go here
                    alert('Bulk actions not yet implemented');
                  }
                }}
                className="btn-secondary"
              >
                Acknowledge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertList;