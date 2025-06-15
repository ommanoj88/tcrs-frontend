import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { creditMonitoringService } from '../../services/creditMonitoringService';
import { 
  CreditAlertResponse,
  ALERT_SEVERITY_COLORS,
  ALERT_SEVERITY_LABELS,
  ALERT_TYPE_LABELS
} from '../../types/creditMonitoring';
import LoadingSpinner from '../LoadingSpinner';

const AlertDetail: React.FC = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<CreditAlertResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [acknowledgmentNotes, setAcknowledgmentNotes] = useState('');

  useEffect(() => {
    if (alertId) {
      fetchAlertDetails(parseInt(alertId));
    }
  }, [alertId]);

  const fetchAlertDetails = async (id: number) => {
    try {
      // Note: This would need to be implemented in the service
      // For now, we'll get it from the alerts list
      const alertsData = await creditMonitoringService.getUserAlerts(0, 100, false);
      const foundAlert = alertsData.content.find(a => a.id === id);
      
      if (foundAlert) {
        setAlert(foundAlert);
        
        // Mark as read if not already read
        if (!foundAlert.isRead) {
          await creditMonitoringService.markAlertAsRead(id);
          setAlert({ ...foundAlert, isRead: true });
        }
      } else {
        setError('Alert not found');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!alert) return;
    
    setIsAcknowledging(true);
    try {
      const updatedAlert = await creditMonitoringService.acknowledgeAlert(alert.id, acknowledgmentNotes);
      setAlert(updatedAlert);
      setAcknowledgmentNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const parseDetails = (detailsJson?: string) => {
    if (!detailsJson) return null;
    try {
      return JSON.parse(detailsJson);
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Alert not found</h2>
        </div>
      </div>
    );
  }

  const details = parseDetails(alert.details);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{alert.title}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              ALERT_SEVERITY_COLORS[alert.severityLevel]
            }`}>
              {ALERT_SEVERITY_LABELS[alert.severityLevel]}
            </span>
            {alert.isAcknowledged && (
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                Acknowledged
              </span>
            )}
          </div>
          <p className="text-gray-600">Alert #{alert.alertNumber}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/monitoring/alerts"
            className="btn-secondary"
          >
            ← Back to Alerts
          </Link>
          {alert.relatedEntityType && alert.relatedEntityId && (
            <Link
              to={`/dashboard/${alert.relatedEntityType.toLowerCase()}/${alert.relatedEntityId}`}
              className="btn-primary"
            >
              View Related Item
            </Link>
          )}
        </div>
      </div>

      {/* Alert Information */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Alert Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business</dt>
                  <dd className="mt-1 text-sm text-gray-900">{alert.businessName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Alert Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ALERT_TYPE_LABELS[alert.alertType]}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Severity Level</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ALERT_SEVERITY_COLORS[alert.severityLevel]
                    }`}>
                      {ALERT_SEVERITY_LABELS[alert.severityLevel]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(alert.createdAt)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <div className="flex space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.isRead ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.isRead ? 'Read' : 'Unread'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.isAcknowledged ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.isAcknowledged ? 'Acknowledged' : 'Pending'}
                      </span>
                    </div>
                  </dd>
                </div>
                {alert.expiresAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expires At</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(alert.expiresAt)}</dd>
                  </div>
                )}
                {alert.relatedEntityType && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Related Entity</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {alert.relatedEntityType} #{alert.relatedEntityId}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Description */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Description</h2>
        </div>
        <div className="card-body">
          <p className="text-gray-700 leading-relaxed">{alert.description}</p>
        </div>
      </div>

      {/* Change Details */}
      {(alert.previousValue || alert.currentValue) && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Change Details</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alert.previousValue && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Previous Value</div>
                  <div className="text-lg font-semibold text-gray-900">{alert.previousValue}</div>
                </div>
              )}
              {alert.currentValue && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-600 mb-1">Current Value</div>
                  <div className="text-lg font-semibold text-blue-900">{alert.currentValue}</div>
                </div>
              )}
              {alert.changeAmount && (
                <div className={`rounded-lg p-4 ${
                  alert.changeAmount > 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className={`text-sm font-medium mb-1 ${
                    alert.changeAmount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Change Amount
                  </div>
                  <div className={`text-lg font-semibold ${
                    alert.changeAmount > 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {alert.changeAmount > 0 ? '+' : ''}{alert.changeAmount}
                    {alert.changePercentage && (
                      <span className="text-sm ml-2">
                        ({alert.changePercentage > 0 ? '+' : ''}{alert.changePercentage.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {alert.thresholdValue && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-600 mb-1">Threshold Value</div>
                <div className="text-lg font-semibold text-yellow-900">{alert.thresholdValue}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Details */}
      {details && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Additional Details</h2>
          </div>
          <div className="card-body">
            <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Acknowledgment Section */}
      {alert.isAcknowledged ? (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Acknowledgment Details</h2>
          </div>
          <div className="card-body">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-800">
                    Acknowledged by {alert.acknowledgedBy} on {formatDate(alert.acknowledgedDate!)}
                  </div>
                  {alert.acknowledgmentNotes && (
                    <div className="mt-2 text-sm text-green-700">
                      <strong>Notes:</strong> {alert.acknowledgmentNotes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Acknowledge Alert</h2>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Acknowledge this alert to indicate that you have reviewed it and taken any necessary action.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acknowledgment Notes (Optional)
                </label>
                <textarea
                  value={acknowledgmentNotes}
                  onChange={(e) => setAcknowledgmentNotes(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Enter any notes about your response to this alert..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAcknowledge}
                  disabled={isAcknowledging}
                  className="btn-primary"
                >
                  {isAcknowledging ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Acknowledging...
                    </>
                  ) : (
                    'Acknowledge Alert'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action History */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Action History</h2>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Alert Created</span>
                <span className="text-gray-500 ml-2">{formatDate(alert.createdAt)}</span>
              </div>
            </div>
            
            {alert.isRead && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">Alert Read</span>
                  <span className="text-gray-500 ml-2">Recently</span>
                </div>
              </div>
            )}
            
            {alert.isAcknowledged && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">Alert Acknowledged</span>
                  <span className="text-gray-500 ml-2">{formatDate(alert.acknowledgedDate!)}</span>
                  <span className="text-gray-500 ml-2">by {alert.acknowledgedBy}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;