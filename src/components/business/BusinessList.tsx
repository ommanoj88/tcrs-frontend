import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessService } from '../../services/businessService';
import { Business, BUSINESS_TYPE_LABELS, INDUSTRY_CATEGORY_LABELS } from '../../types/business';
import LoadingSpinner from '../LoadingSpinner';

const BusinessList: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const data = await businessService.getMyBusinesses();
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>
          <p className="text-gray-600">Manage your business profiles</p>
        </div>
        <Link to="/dashboard/businesses/create" className="btn-primary">
          Add New Business
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-4">
                You haven't created any business profiles yet.
              </p>
              <Link to="/dashboard/businesses/create" className="btn-primary">
                Create Your First Business Profile
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div key={business.id} className="card">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
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

                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
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
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  <p>{business.city}, {business.state}</p>
                  <p>Created: {new Date(business.createdAt).toLocaleDateString()}</p>
                </div>

                <Link
                  to={`/dashboard/businesses/${business.id}`}
                  className="block w-full text-center btn-outline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessList;