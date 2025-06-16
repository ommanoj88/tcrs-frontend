import React, { useState, useEffect } from 'react';
import { kycService, KycProfile } from '../../services/kycService';
import LoadingSpinner from '../LoadingSpinner';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentsList from './DocumentsList';

interface KycDashboardProps {
  businessId: number;
  businessName?: string;
}

const KycDashboard: React.FC<KycDashboardProps> = ({ businessId, businessName }) => {
  const [kycProfile, setKycProfile] = useState<KycProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadKycProfile();
  }, [businessId]);

  const loadKycProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const profile = await kycService.getKycProfile(businessId);
      setKycProfile(profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const profile = await kycService.refreshKycProfile(businessId);
      setKycProfile(profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDocumentUploaded = () => {
    setShowUploadModal(false);
    loadKycProfile(); // Refresh to show new document
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      case 'PENDING_REVIEW': return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'EXPIRED': return 'text-orange-600 bg-orange-100';
      case 'ON_HOLD': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'VERY_HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error Loading KYC Profile</h3>
          <p>{error}</p>
          <button onClick={loadKycProfile} className="mt-2 btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!kycProfile) {
    return <div>No KYC profile found</div>;
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📋' },
    { key: 'documents', label: 'Documents', icon: '📄' },
    { key: 'verification', label: 'Verification Status', icon: '✅' },
    { key: 'compliance', label: 'Compliance', icon: '🔐' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🔐 KYC Dashboard
            </h1>
            <p className="text-gray-600">
              {businessName || `Business ID: ${businessId}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
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
                <>🔄 Refresh</>
              )}
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              📤 Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* KYC Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KYC Status</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kycProfile.kycStatus)}`}>
                  {kycProfile.kycStatus.replace('_', ' ')}
                </div>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600">{kycProfile.completionPercentage}%</span>
                  <div className="ml-3 w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${kycProfile.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(kycProfile.riskCategory)}`}>
                  {kycProfile.riskCategory.replace('_', ' ')}
                </div>
                {kycProfile.riskScore && (
                  <p className="text-sm text-gray-500 mt-1">Score: {kycProfile.riskScore.toFixed(1)}</p>
                )}
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
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
        {selectedTab === 'overview' && <OverviewTab kycProfile={kycProfile} />}
        {selectedTab === 'documents' && (
          <DocumentsList 
            businessId={businessId} 
            documents={kycProfile.documents}
            onDocumentChange={loadKycProfile}
          />
        )}
        {selectedTab === 'verification' && <VerificationTab kycProfile={kycProfile} />}
        {selectedTab === 'compliance' && <ComplianceTab kycProfile={kycProfile} />}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          businessId={businessId}
          onClose={() => setShowUploadModal(false)}
          onUploaded={handleDocumentUploaded}
        />
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ kycProfile: KycProfile }> = ({ kycProfile }) => {
  const verificationChecks = [
    { label: 'Business Verification', status: kycProfile.businessVerificationStatus, description: 'Incorporation, GST, PAN documents' },
    { label: 'Director Verification', status: kycProfile.directorVerificationStatus, description: 'Director identity documents' },
    { label: 'Financial Verification', status: kycProfile.financialVerificationStatus, description: 'Bank statements, financial documents' },
    { label: 'Address Verification', status: kycProfile.addressVerificationStatus, description: 'Address proof documents' },
    { label: 'Banking Verification', status: kycProfile.bankingVerificationStatus, description: 'Bank account verification' },
  ];

  return (
    <div className="space-y-6">
      {/* Verification Progress */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Verification Progress</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {verificationChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      check.status ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {check.status ? '✓' : '○'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{check.label}</p>
                      <p className="text-sm text-gray-600">{check.description}</p>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  check.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {check.status ? 'Verified' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Profile created on {new Date(kycProfile.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Last updated on {new Date(kycProfile.updatedAt).toLocaleDateString()}</span>
            </div>
            {kycProfile.lastVerificationDate && (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Last verified on {new Date(kycProfile.lastVerificationDate).toLocaleDateString()}</span>
              </div>
            )}
            {kycProfile.nextReviewDate && (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Next review due on {new Date(kycProfile.nextReviewDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Verification Tab Component
const VerificationTab: React.FC<{ kycProfile: KycProfile }> = ({ kycProfile }) => {
  const documentsByCategory = {
    'Business Documents': kycProfile.documents.filter(doc => 
      ['CERTIFICATE_OF_INCORPORATION', 'GST_CERTIFICATE', 'PAN_CARD'].includes(doc.documentType)
    ),
    'Director Documents': kycProfile.documents.filter(doc => 
      ['DIRECTOR_PAN', 'DIRECTOR_AADHAAR', 'DIRECTOR_PASSPORT'].includes(doc.documentType)
    ),
    'Financial Documents': kycProfile.documents.filter(doc => 
      ['BANK_STATEMENT', 'FINANCIAL_STATEMENTS', 'AUDITED_BALANCE_SHEET'].includes(doc.documentType)
    ),
    'Address Documents': kycProfile.documents.filter(doc => 
      ['UTILITY_BILL', 'RENTAL_AGREEMENT', 'PROPERTY_TAX_RECEIPT'].includes(doc.documentType)
    ),
    'Banking Documents': kycProfile.documents.filter(doc => 
      ['CANCELLED_CHEQUE', 'BANK_ACCOUNT_CERTIFICATE', 'BANK_NOC'].includes(doc.documentType)
    ),
  };

  return (
    <div className="space-y-6">
      {Object.entries(documentsByCategory).map(([category, docs]) => (
        <div key={category} className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">{category}</h3>
          </div>
          <div className="card-body">
            {docs.length > 0 ? (
              <div className="space-y-3">
                {docs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.documentType.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-600">{doc.originalFilename}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      doc.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                      doc.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.verificationStatus}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No documents uploaded for this category</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Compliance Tab Component
const ComplianceTab: React.FC<{ kycProfile: KycProfile }> = ({ kycProfile }) => {
  const complianceFlags = kycProfile.complianceFlags ? JSON.parse(kycProfile.complianceFlags) : [];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Compliance Status</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">KYC Level</h4>
              <p className="text-2xl font-bold text-blue-600">{kycProfile.kycLevel}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Risk Category</h4>
              <p className="text-2xl font-bold text-orange-600">{kycProfile.riskCategory}</p>
            </div>
          </div>

          {kycProfile.verificationNotes && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Verification Notes</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">{kycProfile.verificationNotes}</p>
              </div>
            </div>
          )}

          {complianceFlags.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Compliance Flags</h4>
              <div className="space-y-2">
                {complianceFlags.map((flag: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="text-red-700">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycDashboard;