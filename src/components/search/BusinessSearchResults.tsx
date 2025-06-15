import React from 'react';
import { Link } from 'react-router-dom';
import { BusinessSearchResponse } from '../../types/search';
import { BUSINESS_TYPE_LABELS, INDUSTRY_CATEGORY_LABELS } from '../../types/business';

interface BusinessSearchResultsProps {
  searchResults: BusinessSearchResponse;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const BusinessSearchResults: React.FC<BusinessSearchResultsProps> = ({
  searchResults,
  onPageChange,
  isLoading
}) => {
  const { businesses, currentPage, totalPages, totalElements, hasNext, hasPrevious } = searchResults;

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results
          </h2>
          <p className="text-sm text-gray-600">
            Showing {businesses.length} of {totalElements.toLocaleString()} businesses
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {businesses.map((business) => (
          <div key={business.id} className="card hover:shadow-lg transition-shadow">
            <div className="card-body">
              {/* Business Name */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {business.businessName}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  business.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {business.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Business Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GSTIN:</span>
                  <span className="font-medium">{business.gstin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PAN:</span>
                  <span className="font-medium">{business.pan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">
                    {BUSINESS_TYPE_LABELS[business.businessType]}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Industry:</span>
                  <span className="font-medium">
                    {INDUSTRY_CATEGORY_LABELS[business.industryCategory]}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="text-sm text-gray-600 mb-4">
                <p>{business.city}, {business.state} - {business.pincode}</p>
                {business.registrationDate && (
                  <p>Registered: {new Date(business.registrationDate).toLocaleDateString()}</p>
                )}
              </div>

              {/* Verification Status */}
              <div className="flex space-x-2 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  business.gstinVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  GST {business.gstinVerified ? 'Verified' : 'Pending'}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  business.panVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  PAN {business.panVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              {/* Description */}
              {business.businessDescription && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {business.businessDescription}
                </p>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/dashboard/search/business/${business.id}`}
                  className="flex-1 btn-primary text-center text-sm"
                >
                  View Details
                </Link>
                <Link
                  to={`/dashboard/search/business/${business.id}/credit-report`}
                  className="flex-1 btn-outline text-center text-sm"
                >
                  Credit Report
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevious || isLoading}
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
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessSearchResults;