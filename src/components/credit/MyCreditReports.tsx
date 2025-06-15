import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { creditReportService } from '../../services/creditReportService';
import { CreditReportResponse, CREDIT_GRADE_LABELS, CREDIT_GRADE_COLORS, RISK_CATEGORY_LABELS, RISK_CATEGORY_COLORS } from '../../types/credit';
import LoadingSpinner from '../LoadingSpinner';

const MyCreditReports: React.FC = () => {
  const [reports, setReports] = useState<CreditReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const fetchReports = async () => {
    try {
      const data = await creditReportService.getUserCreditReports(currentPage, 10);
      setReports(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const isReportExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Credit Reports</h1>
        <p className="text-gray-600">
          View and manage all credit reports you've generated.
          {totalElements > 0 && (
            <span className="font-medium"> {totalElements.toLocaleString()} reports found.</span>
          )}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="card mb-6">
        <div className="card-body">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <Link
              to="/dashboard/search"
              className="btn-primary"
            >
              Search Businesses
            </Link>
            <Link
              to="/dashboard/businesses"
              className="btn-outline"
            >
              My Businesses
            </Link>
          </div>
        </div>
      </div>

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

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No credit reports found</h3>
              <p className="text-gray-600 mb-4">
                You haven't generated any credit reports yet.
              </p>
              <Link
                to="/dashboard/search"
                className="btn-primary"
              >
                Start Searching Businesses
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {reports.map((report) => {
              const expired = isReportExpired(report.reportValidUntil);
              
              return (
                <div key={report.id} className="card hover:shadow-lg transition-shadow">
                  <div className="card-body">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {report.businessName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Report #{report.reportNumber}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {expired ? 'Expired' : 'Valid'}
                      </span>
                    </div>

                    {/* Business Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">GSTIN:</span>
                        <span className="ml-1 font-medium">{report.businessGstin}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">PAN:</span>
                        <span className="ml-1 font-medium">{report.businessPan}</span>
                      </div>
                    </div>

                    {/* Credit Score & Risk */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {report.creditScore.toFixed(0)}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          CREDIT_GRADE_COLORS[report.creditScoreGrade]
                        }`}>
                          {report.creditScoreGrade}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Risk Level
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          RISK_CATEGORY_COLORS[report.riskCategory]
                        }`}>
                          {RISK_CATEGORY_LABELS[report.riskCategory]}
                        </span>
                      </div>
                    </div>

                    {/* Credit Limit */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">Recommended Credit Limit</div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(report.creditLimitRecommendation)}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500">
                      <div>
                        <span>Generated:</span>
                        <div className="font-medium">{formatDate(report.createdAt)}</div>
                      </div>
                      <div>
                        <span>Valid Until:</span>
                        <div className={`font-medium ${expired ? 'text-red-600' : 'text-green-600'}`}>
                          {formatDate(report.reportValidUntil)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/credit/report/${report.reportNumber}`}
                        className="flex-1 btn-primary text-center text-sm"
                      >
                        View Report
                      </Link>
                      <Link
                        to={`/dashboard/search/business/${report.businessId}`}
                        className="flex-1 btn-outline text-center text-sm"
                      >
                        View Business
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
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
        </>
      )}
    </div>
  );
};

export default MyCreditReports;