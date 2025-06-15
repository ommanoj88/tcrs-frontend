import React, { useState, useEffect } from 'react';
import { tradeReferenceService } from '../../services/tradeReferenceService';
import { 
  TradeReferenceResponse, 
  ReferenceVerificationStatus, 
  VerificationMethod,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS,
  VERIFICATION_METHOD_LABELS,
  PAYMENT_BEHAVIOR_LABELS,
  PAYMENT_BEHAVIOR_COLORS,
  RECOMMENDATION_LEVEL_LABELS,
  RECOMMENDATION_LEVEL_COLORS
} from '../../types/tradeReference';
import LoadingSpinner from '../LoadingSpinner';

const ReferenceVerificationInterface: React.FC = () => {
  const [pendingReferences, setPendingReferences] = useState<TradeReferenceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedReference, setSelectedReference] = useState<TradeReferenceResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verification form state
  const [verificationForm, setVerificationForm] = useState({
    status: ReferenceVerificationStatus.VERIFIED,
    method: VerificationMethod.PHONE_CALL,
    notes: '',
    response: ''
  });

  useEffect(() => {
    fetchPendingReferences();
  }, [currentPage]);

  const fetchPendingReferences = async () => {
    try {
      const data = await tradeReferenceService.getPendingVerifications(currentPage, 10);
      setPendingReferences(data.content);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReference = (reference: TradeReferenceResponse) => {
    setSelectedReference(reference);
    setVerificationForm({
      status: ReferenceVerificationStatus.VERIFIED,
      method: VerificationMethod.PHONE_CALL,
      notes: '',
      response: ''
    });
  };

  const handleVerificationFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVerificationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerifyReference = async () => {
    if (!selectedReference) return;

    setIsVerifying(true);
    try {
      await tradeReferenceService.verifyTradeReference(
        selectedReference.id,
        verificationForm.status,
        verificationForm.method,
        verificationForm.notes,
        verificationForm.response
      );

      // Refresh the list
      await fetchPendingReferences();
      setSelectedReference(null);
      
      // Show success message
      alert('Reference verification completed successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMarkContactAttempted = async (referenceId: number) => {
    const notes = prompt('Enter contact attempt notes (optional):');
    
    try {
      await tradeReferenceService.markContactAttempted(referenceId, notes || '');
      await fetchPendingReferences();
      alert('Contact attempt marked successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reference Verification Center
        </h1>
        <p className="text-gray-600">
          Verify pending trade references to maintain data quality and trust
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending References List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">
                Pending Verifications ({pendingReferences.length})
              </h2>
            </div>
            <div className="card-body">
              {pendingReferences.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No pending verifications at the moment.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReferences.map((reference) => (
                    <div 
                      key={reference.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedReference?.id === reference.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectReference(reference)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{reference.companyName}</h3>
                          <p className="text-sm text-gray-600">
                            Business: {reference.businessName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Contact: {reference.contactPerson} ({reference.email})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            VERIFICATION_STATUS_COLORS[reference.verificationStatus]
                          }`}>
                            {VERIFICATION_STATUS_LABELS[reference.verificationStatus]}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Added: {formatDate(reference.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Relationship:</span>
                          <div className="font-medium">{reference.relationshipType}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Business Value:</span>
                          <div className="font-medium">{formatCurrency(reference.totalBusinessValue)}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <div className="flex space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            PAYMENT_BEHAVIOR_COLORS[reference.paymentBehavior]
                          }`}>
                            {PAYMENT_BEHAVIOR_LABELS[reference.paymentBehavior]}
                          </span>
                          {reference.recommendationLevel && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              RECOMMENDATION_LEVEL_COLORS[reference.recommendationLevel]
                            }`}>
                              {RECOMMENDATION_LEVEL_LABELS[reference.recommendationLevel]}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkContactAttempted(reference.id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark Contact Attempted
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Verification Form</h2>
            </div>
            <div className="card-body">
              {!selectedReference ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500">Select a reference to verify</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Reference Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedReference.companyName}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Ref: {selectedReference.referenceNumber}</div>
                      <div>Contact: {selectedReference.contactPerson}</div>
                      <div>Email: {selectedReference.email}</div>
                      <div>Phone: {selectedReference.phone}</div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Status *
                    </label>
                    <select
                      name="status"
                      value={verificationForm.status}
                      onChange={handleVerificationFormChange}
                      className="input-field"
                      required
                    >
                      {Object.entries(VERIFICATION_STATUS_LABELS)
                        .filter(([key]) => key !== 'PENDING')
                        .map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Verification Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Method *
                    </label>
                    <select
                      name="method"
                      value={verificationForm.method}
                      onChange={handleVerificationFormChange}
                      className="input-field"
                      required
                    >
                      {Object.entries(VERIFICATION_METHOD_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Verification Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Notes
                    </label>
                    <textarea
                      name="notes"
                      value={verificationForm.notes}
                      onChange={handleVerificationFormChange}
                      className="input-field"
                      rows={3}
                      placeholder="Enter verification notes, contact details, etc..."
                    />
                  </div>

                  {/* Reference Response */}
                  {(verificationForm.status === ReferenceVerificationStatus.VERIFIED || 
                    verificationForm.status === ReferenceVerificationStatus.PARTIALLY_VERIFIED) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reference Response
                      </label>
                      <textarea
                        name="response"
                        value={verificationForm.response}
                        onChange={handleVerificationFormChange}
                        className="input-field"
                        rows={4}
                        placeholder="Record the reference provider's response, feedback, or confirmation details..."
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleVerifyReference}
                      disabled={isVerifying}
                      className="flex-1 btn-primary"
                    >
                      {isVerifying ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        'Complete Verification'
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedReference(null)}
                      className="btn-secondary"
                      disabled={isVerifying}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => window.open(`mailto:${selectedReference.email}`, '_blank')}
                        className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                      >
                        📧 Send Email to {selectedReference.contactPerson}
                      </button>
                      <button
                        onClick={() => window.open(`tel:${selectedReference.phone}`, '_blank')}
                        className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                      >
                        📞 Call {selectedReference.phone}
                      </button>
                      <button
                        onClick={() => handleMarkContactAttempted(selectedReference.id)}
                        className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                      >
                        ✓ Mark Contact Attempted
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceVerificationInterface;