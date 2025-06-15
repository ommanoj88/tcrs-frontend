import React, { useState, useEffect } from 'react';
import { businessSearchService } from '../../services/BusinessSearchService';
import { BusinessSearchRequest, BusinessSearchResponse } from '../../types/search';
import { BusinessType, IndustryCategory, BUSINESS_TYPE_LABELS, INDUSTRY_CATEGORY_LABELS } from '../../types/business';
import BusinessSearchResults from './BusinessSearchResults';
import LoadingSpinner from '../LoadingSpinner';

const BusinessSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<BusinessSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalBusinesses, setTotalBusinesses] = useState<number>(0);

  // Advanced search filters
  const [filters, setFilters] = useState<BusinessSearchRequest>({
    query: '',
    businessName: '',
    gstin: '',
    pan: '',
    city: '',
    state: '',
    businessType: undefined,
    industryCategory: undefined,
    page: 0,
    size: 12,
    sortBy: 'businessName',
    sortDirection: 'asc'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const total = await businessSearchService.getTotalBusinesses();
      setTotalBusinesses(total);
      
      // Load recent businesses
      await performSearch({ page: 0, size: 12 });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const performSearch = async (searchRequest: BusinessSearchRequest = {}) => {
    setIsLoading(true);
    setError('');

    try {
      const request: BusinessSearchRequest = {
        ...filters,
        ...searchRequest,
        query: searchQuery.trim() || undefined
      };

      const results = await businessSearchService.searchBusinesses(request);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch({ 
        query: searchQuery.trim(),
        page: 0 
      });
    }
  };

  const handleAdvancedSearch = () => {
    performSearch({ page: 0 });
  };

  const handleFilterChange = (key: keyof BusinessSearchRequest, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (page: number) => {
    performSearch({ page });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      query: '',
      businessName: '',
      gstin: '',
      pan: '',
      city: '',
      state: '',
      businessType: undefined,
      industryCategory: undefined,
      page: 0,
      size: 12,
      sortBy: 'businessName',
      sortDirection: 'asc'
    });
    loadInitialData();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Search</h1>
        <p className="text-gray-600">
          Search and discover businesses for trade credit evaluation. 
          {totalBusinesses > 0 && (
            <span className="font-medium"> {totalBusinesses.toLocaleString()} businesses available.</span>
          )}
        </p>
      </div>

      {/* Quick Search */}
      <div className="card mb-6">
        <div className="card-body">
          <form onSubmit={handleQuickSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                placeholder="Search by business name, GSTIN, PAN, or location..."
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
              className="btn-outline"
            >
              {isAdvancedSearch ? 'Simple Search' : 'Advanced Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Advanced Search Filters */}
      {isAdvancedSearch && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Advanced Search Filters</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={filters.businessName || ''}
                  onChange={(e) => handleFilterChange('businessName', e.target.value)}
                  className="input-field"
                  placeholder="Enter business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={filters.gstin || ''}
                  onChange={(e) => handleFilterChange('gstin', e.target.value)}
                  className="input-field"
                  placeholder="Enter GSTIN"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN
                </label>
                <input
                  type="text"
                  value={filters.pan || ''}
                  onChange={(e) => handleFilterChange('pan', e.target.value)}
                  className="input-field"
                  placeholder="Enter PAN"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input-field"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={filters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="input-field"
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  value={filters.businessType || ''}
                  onChange={(e) => handleFilterChange('businessType', e.target.value || undefined)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Category
                </label>
                <select
                  value={filters.industryCategory || ''}
                  onChange={(e) => handleFilterChange('industryCategory', e.target.value || undefined)}
                  className="input-field"
                >
                  <option value="">All Industries</option>
                  {Object.entries(INDUSTRY_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'businessName'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field"
                >
                  <option value="businessName">Business Name</option>
                  <option value="createdAt">Registration Date</option>
                  <option value="city">City</option>
                  <option value="state">State</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <select
                  value={filters.sortDirection || 'asc'}
                  onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                  className="input-field"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleAdvancedSearch}
                disabled={isLoading}
                className="btn-primary"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
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

      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Search Results */}
      {!isLoading && searchResults && (
        <BusinessSearchResults
          searchResults={searchResults}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default BusinessSearch;