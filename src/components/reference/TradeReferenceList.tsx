import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tradeReferenceService } from '../../services/tradeReferenceService';
import { 
  TradeReferenceResponse, 
  REFERENCE_TYPE_LABELS,
  RELATIONSHIP_TYPE_LABELS,
  PAYMENT_BEHAVIOR_LABELS,
  PAYMENT_BEHAVIOR_COLORS,
  RECOMMENDATION_LEVEL_LABELS,
  RECOMMENDATION_LEVEL_COLORS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS
} from '../../types/tradeReference';
import LoadingSpinner from '../LoadingSpinner';

interface TradeReferenceListProps {
  businessId?: number;
  showBusinessInfo?: boolean;
  maxItems?: number;
}

const TradeReferenceList: React.FC<TradeReferenceListProps> = ({ 
  businessId, 
  showBusinessInfo = false,
  maxItems 
}) => {
  const [tradeReferences, setTradeReferences] = useState<TradeReferenceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTradeReferences();
  }, [businessId, currentPage]);

  const fetchTradeReferences = async () => {
    try {
      if (businessId) {
        if (maxItems) {
          // Fetch limited items for preview
          const data = await tradeReferenceService.getBusinessTradeReferences(businessId);
          setTradeReferences(data.slice(0, maxItems));
        } else {
          // Fetch paginated results
          const data = await tradeReferenceService.getBusinessTradeReferencesPaginated(businessId, currentPage, 10);
          setTradeReferences(data.content);
          setTotalPages(data.totalPages);
        }
      } else {
        // Fetch user's trade references
        const data = await tradeReferenceService.getUserTradeReferences(currentPage, 10);
        setTradeReferences(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!businessId || !searchTerm.trim()) return;

    try {
      setIsLoading(true);
      const data = await tradeReferenceService.searchTradeReferences(businessId, searchTerm.trim());
      setTradeReferences(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchTradeReferences();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (months?: number) => {
    if (!months) return 'N/A';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
  };

  const handleDeleteReference = async (referenceId: number) => {
    if (window.confirm('Are you sure you want to delete this trade reference?')) {
      try {
        await tradeReferenceService.deleteTradeReference(referenceId);
        fetchTradeReferences(); // Refresh list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar (only for business view) */}
      {businessId && !maxItems && (
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search references by company, contact person, email..."
            className="flex-1 input-field"
          />
          <button
            onClick={handleSearch}
            className="btn-primary"
            disabled={!searchTerm.trim()}
          >
            Search
          </button>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {tradeReferences.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Trade References</h3>
            <p className="text-gray-600 mb-4">
              {businessId 
                ? searchTerm 
                  ? 'No trade references match your search criteria.'
                  : 'No trade references have been added for this business yet.'
                : 'You haven\'t added any trade references yet.'
              }
            </p>
            {businessId && !searchTerm && (
              <Link
                to={`/dashboard/reference/add/${businessId}`}
                className="btn-primary"
              >
                Add Trade Reference
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Trade Reference Items */}
      <div className="grid grid-cols-1 gap-4">
        {tradeReferences.map((reference) => (
          <div key={reference.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reference.companyName}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      VERIFICATION_STATUS_COLORS[reference.verificationStatus]
                    }`}>
                      {VERIFICATION_STATUS_LABELS[reference.verificationStatus]}
                    </span>
                    {reference.isConfidential && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Confidential
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Ref: {reference.referenceNumber}
                  </p>
                  {showBusinessInfo && (
                    <p className="text-sm text-gray-600">
                      Business: {reference.businessName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    {REFERENCE_TYPE_LABELS[reference.referenceType]}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {RELATIONSHIP_TYPE_LABELS[reference.relationshipType]}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Contact Person:</span>
                  <div className="font-medium">
                    {reference.contactPerson}
                    {reference.designation && (
                      <span className="text-sm text-gray-600 ml-1">
                        ({reference.designation})
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Contact Info:</span>
                  <div className="text-sm">
                    <div>{reference.email}</div>
                    <div>{reference.phone}</div>
                  </div>
                </div>
              </div>

              {/* Relationship & Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Relationship Duration:</span>
                  <div className="font-medium">{formatDuration(reference.relationshipDurationMonths)}</div>
                </div>
                {reference.totalBusinessValue && reference.totalBusinessValue > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Total Business Value:</span>
                    <div className="font-medium text-green-600">
                      {formatCurrency(reference.totalBusinessValue)}
                    </div>
                  </div>
                )}
                {reference.creditLimitProvided && reference.creditLimitProvided > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Credit Limit:</span>
                    <div className="font-medium text-blue-600">
                      {formatCurrency(reference.creditLimitProvided)}
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Payment Behavior:</span>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      PAYMENT_BEHAVIOR_COLORS[reference.paymentBehavior]
                    }`}>
                      {PAYMENT_BEHAVIOR_LABELS[reference.paymentBehavior]}
                    </span>
                  </div>
                </div>
                {reference.recommendationLevel && (
                  <div>
                    <span className="text-sm text-gray-500">Recommendation:</span>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        RECOMMENDATION_LEVEL_COLORS[reference.recommendationLevel]
                      }`}>
                        {RECOMMENDATION_LEVEL_LABELS[reference.recommendationLevel]}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ratings */}
              {(reference.paymentRating || reference.overallRating) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {reference.paymentRating && (
                    <div>
                      <span className="text-sm text-gray-500">Payment Rating:</span>
                      <div className="text-sm font-medium">
                        {'⭐'.repeat(reference.paymentRating)} ({reference.paymentRating}/5)
                      </div>
                    </div>
                  )}
                  {reference.overallRating && (
                    <div>
                      <span className="text-sm text-gray-500">Overall Rating:</span>
                      <div className="text-sm font-medium">
                        {'⭐'.repeat(reference.overallRating)} ({reference.overallRating}/5)
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Disputes */}
              {reference.hasDisputes && (
                <div className="mb-4">
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-red-800">Payment Disputes Reported</span>
                    </div>
                    {reference.disputeDetails && (
                      <p className="text-sm text-red-700 mt-1">{reference.disputeDetails}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Comments */}
              {reference.referenceComments && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Comments:</span>
                  <div className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded">
                    {reference.referenceComments}
                  </div>
                </div>
              )}

              {/* Verification Details */}
              {reference.verificationStatus !== 'PENDING' && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">Verification Details</div>
                    {reference.verifiedBy && (
                      <div className="text-blue-800">
                        Verified by: {reference.verifiedBy} on {formatDate(reference.verifiedDate)}
                      </div>
                    )}
                    {reference.verificationMethod && (
                      <div className="text-blue-800">
                        Method: {reference.verificationMethod.replace(/_/g, ' ')}
                      </div>
                    )}
                    {reference.verificationNotes && (
                      <div className="text-blue-800 mt-1">
                        Notes: {reference.verificationNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                <div>
                  Added by {reference.addedByName} • {formatDate(reference.createdAt)}
                  {reference.contactAttemptedDate && (
                    <span className="ml-2">• Contact attempted: {formatDate(reference.contactAttemptedDate)}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/reference/edit/${reference.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/dashboard/reference/view/${reference.id}`}
                    className="text-green-600 hover:text-green-800"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeleteReference(reference.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!maxItems && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
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

      {/* Show More Link for Preview */}
      {maxItems && tradeReferences.length === maxItems && (
        <div className="text-center">
          <Link
            to={businessId ? `/dashboard/reference/business/${businessId}` : '/dashboard/reference/my-references'}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Trade References →
          </Link>
        </div>
      )}
    </div>
  );
};

export default TradeReferenceList;