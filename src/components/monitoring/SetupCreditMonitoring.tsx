import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { creditMonitoringService } from '../../services/creditMonitoringService';
import { businessSearchService } from '../../services/BusinessSearchService';
import { Business } from '../../types/business';
import { 
  CreditMonitoringRequest, 
  MonitoringType, 
  NotificationFrequency,
  MONITORING_TYPE_LABELS,
  NOTIFICATION_FREQUENCY_LABELS
} from '../../types/creditMonitoring';
import LoadingSpinner from '../LoadingSpinner';

const SetupCreditMonitoring: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showBusinessSearch, setShowBusinessSearch] = useState(!businessId);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState<CreditMonitoringRequest>({
    businessId: 0,
    monitoringName: '',
    monitoringType: MonitoringType.COMPREHENSIVE,
    creditScoreThresholdMin: 300,
    creditScoreThresholdMax: 850,
    creditScoreChangeThreshold: 25,
    paymentDelayThresholdDays: 30,
    overdueAmountThreshold: 50000,
    newTradeReferenceAlert: true,
    newPaymentHistoryAlert: true,
    creditReportGenerationAlert: true,
    businessProfileChangeAlert: true,
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    notificationFrequency: NotificationFrequency.IMMEDIATE,
    notes: ''
  });

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(parseInt(businessId));
    }
  }, [businessId]);

  const fetchBusinessDetails = async (id: number) => {
    try {
      setIsLoading(true);
      const data = await businessSearchService.getBusinessById(id);
      setBusiness(data);
      setFormData(prev => ({
        ...prev,
        businessId: id,
        monitoringName: `${data.businessName} - Credit Monitoring`
      }));
      setShowBusinessSearch(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSearch = async () => {
  if (!searchTerm.trim()) return;

  try {
    setIsSearching(true);
    setError('');
    
    console.log('🔍 Searching for:', searchTerm); // Debug log
    
    // Use the new V3 compatible method
    const results = await businessSearchService.searchBusinessesSimple({
      query: searchTerm,
      page: 0,
      size: 10
    });
    
    console.log('📊 Search results:', results); // Debug log
    console.log('📋 Businesses found:', results.businesses?.length || 0); // Debug log
    
    // Extract businesses from the response
    setSearchResults(results.businesses || []);
  } catch (err: any) {
    console.error('❌ Search error:', err); // Debug log
    setError(err.message);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};

  const handleSelectBusiness = (selectedBusiness: Business) => {
    setBusiness(selectedBusiness);
    setFormData(prev => ({
      ...prev,
      businessId: selectedBusiness.id,
      monitoringName: `${selectedBusiness.businessName} - Credit Monitoring`
    }));
    setShowBusinessSearch(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value
      }));
    }
  };

  const handleMonitoringTypeChange = (type: MonitoringType) => {
    setFormData(prev => {
      const newData = { ...prev, monitoringType: type };
      
      // Set default values based on monitoring type
      switch (type) {
        case MonitoringType.CREDIT_SCORE_ONLY:
          return {
            ...newData,
            newTradeReferenceAlert: false,
            newPaymentHistoryAlert: false,
            businessProfileChangeAlert: false
          };
        case MonitoringType.PAYMENT_BEHAVIOR:
          return {
            ...newData,
            creditScoreThresholdMin: undefined,
            creditScoreThresholdMax: undefined,
            newTradeReferenceAlert: false,
            businessProfileChangeAlert: false
          };
        case MonitoringType.TRADE_REFERENCES:
          return {
            ...newData,
            creditScoreThresholdMin: undefined,
            creditScoreThresholdMax: undefined,
            newPaymentHistoryAlert: false,
            businessProfileChangeAlert: false
          };
        case MonitoringType.BUSINESS_PROFILE:
          return {
            ...newData,
            creditScoreThresholdMin: undefined,
            creditScoreThresholdMax: undefined,
            newTradeReferenceAlert: false,
            newPaymentHistoryAlert: false
          };
        default:
          return newData;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) {
      setError('Please select a business to monitor');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.monitoringName.trim()) {
        throw new Error('Monitoring name is required');
      }

      await creditMonitoringService.setupCreditMonitoring(formData);
      
      // Navigate to monitoring dashboard
      navigate('/dashboard/monitoring');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading only when fetching business details
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Credit Monitoring
        </h1>
        <p className="text-gray-600">
          Configure automated monitoring and alerts for business credit changes
        </p>
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

      {/* Business Selection */}
      {showBusinessSearch ? (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Select Business to Monitor</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBusinessSearch()}
                  placeholder="Search by business name, GSTIN, or PAN..."
                  className="flex-1 input-field"
                />
                <button
                  onClick={handleBusinessSearch}
                  disabled={!searchTerm.trim() || isSearching}
                  className="btn-primary"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((searchBusiness) => (
                    <div
                      key={searchBusiness.id}
                      onClick={() => handleSelectBusiness(searchBusiness)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{searchBusiness.businessName}</h3>
                          <p className="text-sm text-gray-600">GSTIN: {searchBusiness.gstin}</p>
                          <p className="text-sm text-gray-600">
                            {searchBusiness.city}, {searchBusiness.state}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {searchBusiness.businessType}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchTerm && searchResults.length === 0 && !isSearching && (
                <div className="text-center py-8 text-gray-500">
                  No businesses found matching your search.
                  <div className="mt-2">
                    <Link
                      to="/dashboard/businesses/create"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Register a new business instead →
                    </Link>
                  </div>
                </div>
              )}

              {!searchTerm && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-600 mb-4">
                    Search for a business to start monitoring its credit profile
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Link
                      to="/dashboard/search"
                      className="btn-secondary"
                    >
                      Advanced Search
                    </Link>
                    <Link
                      to="/dashboard/businesses/create"
                      className="btn-primary"
                    >
                      Register New Business
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : business && (
        <>
          {/* Selected Business Info */}
          <div className="card mb-6">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Selected Business</h2>
                <button
                  onClick={() => setShowBusinessSearch(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change Business
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{business.businessName}</h3>
                  <p className="text-sm text-gray-600">GSTIN: {business.gstin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">PAN: {business.pan}</p>
                  <p className="text-sm text-gray-600">Type: {business.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{business.city}, {business.state}</p>
                  <p className="text-sm text-gray-600">Industry: {business.industryCategory}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring Configuration Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Monitoring Configuration</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Configuration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monitoring Name *
                      </label>
                      <input
                        type="text"
                        name="monitoringName"
                        value={formData.monitoringName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter monitoring name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monitoring Type *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(MONITORING_TYPE_LABELS).map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleMonitoringTypeChange(value as MonitoringType)}
                            className={`p-3 text-sm border rounded-lg text-left transition-colors ${
                              formData.monitoringType === value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Score Thresholds */}
                {(formData.monitoringType === MonitoringType.COMPREHENSIVE || 
                  formData.monitoringType === MonitoringType.CREDIT_SCORE_ONLY ||
                  formData.monitoringType === MonitoringType.CUSTOM) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Score Monitoring</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Score Threshold
                        </label>
                        <input
                          type="number"
                          name="creditScoreThresholdMin"
                          value={formData.creditScoreThresholdMin || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="300"
                          min="0"
                          max="1000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert when score falls below this value</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Score Threshold
                        </label>
                        <input
                          type="number"
                          name="creditScoreThresholdMax"
                          value={formData.creditScoreThresholdMax || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="850"
                          min="0"
                          max="1000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert when score exceeds this value</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Score Change Threshold
                        </label>
                        <input
                          type="number"
                          name="creditScoreChangeThreshold"
                          value={formData.creditScoreChangeThreshold || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="25"
                          min="1"
                          max="500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert on score changes ≥ this amount</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Monitoring */}
                {(formData.monitoringType === MonitoringType.COMPREHENSIVE || 
                  formData.monitoringType === MonitoringType.PAYMENT_BEHAVIOR ||
                  formData.monitoringType === MonitoringType.CUSTOM) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Monitoring</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Delay Threshold (Days)
                        </label>
                        <input
                          type="number"
                          name="paymentDelayThresholdDays"
                          value={formData.paymentDelayThresholdDays || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="30"
                          min="1"
                          max="365"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert on payment delays exceeding this period</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Overdue Amount Threshold (₹)
                        </label>
                        <input
                          type="number"
                          name="overdueAmountThreshold"
                          value={formData.overdueAmountThreshold || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="50000"
                          min="0"
                          step="1000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alert when overdue amount exceeds this value</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alert Types */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Types</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="newTradeReferenceAlert"
                          checked={formData.newTradeReferenceAlert}
                          onChange={handleInputChange}
                          disabled={formData.monitoringType === MonitoringType.PAYMENT_BEHAVIOR ||
                                   formData.monitoringType === MonitoringType.BUSINESS_PROFILE}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          New Trade Reference Added
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="newPaymentHistoryAlert"
                          checked={formData.newPaymentHistoryAlert}
                          onChange={handleInputChange}
                          disabled={formData.monitoringType === MonitoringType.TRADE_REFERENCES ||
                                   formData.monitoringType === MonitoringType.BUSINESS_PROFILE}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          New Payment History Added
                        </span>
                      </label>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="creditReportGenerationAlert"
                          checked={formData.creditReportGenerationAlert}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Credit Report Generated
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="businessProfileChangeAlert"
                          checked={formData.businessProfileChangeAlert}
                          onChange={handleInputChange}
                          disabled={formData.monitoringType === MonitoringType.CREDIT_SCORE_ONLY ||
                                   formData.monitoringType === MonitoringType.PAYMENT_BEHAVIOR ||
                                   formData.monitoringType === MonitoringType.TRADE_REFERENCES}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Business Profile Changes
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Notification Methods
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={formData.emailNotifications}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            📧 Email Notifications
                          </span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="smsNotifications"
                            checked={formData.smsNotifications}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            📱 SMS Notifications
                          </span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="inAppNotifications"
                            checked={formData.inAppNotifications}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            🔔 In-App Notifications
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Notification Frequency
                      </label>
                      <div className="space-y-2">
                        {Object.entries(NOTIFICATION_FREQUENCY_LABELS).map(([value, label]) => (
                          <label key={value} className="flex items-center">
                            <input
                              type="radio"
                              name="notificationFrequency"
                              value={value}
                              checked={formData.notificationFrequency === value}
                              onChange={handleInputChange}
                              className="border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="Additional notes about this monitoring setup..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/monitoring')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting up Monitoring...
                      </>
                    ) : (
                      'Setup Credit Monitoring'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SetupCreditMonitoring;