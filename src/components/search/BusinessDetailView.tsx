import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessSearchService } from '../../services/BusinessSearchService';
import { Business, BUSINESS_TYPE_LABELS, INDUSTRY_CATEGORY_LABELS } from '../../types/business';
import LoadingSpinner from '../LoadingSpinner';

const BusinessDetailView: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(parseInt(businessId));
    }
  }, [businessId]);

  const fetchBusinessDetails = async (id: number) => {
    try {
      const data = await businessSearchService.getBusinessById(id);
      setBusiness(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Business not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {business.businessName}
          </h1>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              business.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {business.isActive ? 'Active Business' : 'Inactive Business'}
            </span>
            <span className="text-sm text-gray-500">
              ID: {business.id}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/search"
            className="btn-secondary"
          >
            Back to Search
          </Link>
          <Link
            to={`/dashboard/search/business/${business.id}/credit-report`}
            className="btn-primary"
          >
            Generate Credit Report
          </Link>
        </div>
      </div>

      {/* Business Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="card-body">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.businessName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">GSTIN</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  {business.gstin}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    business.gstinVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {business.gstinVerified ? 'Verified' : 'Pending'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">PAN</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  {business.pan}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    business.panVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {business.panVerified ? 'Verified' : 'Pending'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {BUSINESS_TYPE_LABELS[business.businessType]}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry Category</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {INDUSTRY_CATEGORY_LABELS[business.industryCategory]}
                </dd>
              </div>
              {business.registrationDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(business.registrationDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
          </div>
          <div className="card-body">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Registered Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.registeredAddress}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {business.city}, {business.state} - {business.pincode}
                </dd>
              </div>
              {business.businessPhone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{business.businessPhone}</dd>
                </div>
              )}
              {business.businessEmail && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{business.businessEmail}</dd>
                </div>
              )}
              {business.website && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {business.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Business Description */}
      {business.businessDescription && (
        <div className="card mt-6">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Business Description</h2>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-900">{business.businessDescription}</p>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="card mt-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">System Information</h2>
        </div>
        <div className="card-body">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Registered By</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(business.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(business.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailView;