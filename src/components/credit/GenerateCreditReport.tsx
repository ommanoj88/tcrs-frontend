import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { creditReportService } from '../../services/creditReportService';
import { businessSearchService } from '../../services/BusinessSearchService';
import { Business } from '../../types/business';
import { CreditReportRequest } from '../../types/credit';
import LoadingSpinner from '../LoadingSpinner';

const GenerateCreditReport: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [purpose, setPurpose] = useState('');
  const [comments, setComments] = useState('');

  React.useEffect(() => {
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

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) return;

    setIsGenerating(true);
    setError('');

    try {
      const request: CreditReportRequest = {
        businessId: business.id,
        purpose: purpose.trim() || undefined,
        comments: comments.trim() || undefined
      };

      const creditReport = await creditReportService.generateCreditReport(request);
      
      // Navigate to the generated report
      navigate(`/dashboard/credit/report/${creditReport.reportNumber}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !business) {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Generate Credit Report
        </h1>
        <p className="text-gray-600">
          Generate a comprehensive credit assessment for trade credit decisions.
        </p>
      </div>

      {/* Business Info Card */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {business.businessName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>GSTIN:</strong> {business.gstin}</p>
                <p><strong>PAN:</strong> {business.pan}</p>
                <p><strong>Type:</strong> {business.businessType}</p>
                <p><strong>Industry:</strong> {business.industryCategory}</p>
              </div>
            </div>
            <div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Location:</strong> {business.city}, {business.state}</p>
                <p><strong>Registration:</strong> {business.registrationDate ? new Date(business.registrationDate).toLocaleDateString() : 'N/A'}</p>
                <div className="flex space-x-2 mt-2">
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
            </div>
          </div>
        </div>
      </div>

      {/* Credit Report Request Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Credit Report Request</h2>
        </div>
        <div className="card-body">
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

          <form onSubmit={handleGenerateReport} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Credit Check (Optional)
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="input-field"
              >
                <option value="">Select purpose</option>
                <option value="Trade Credit Assessment">Trade Credit Assessment</option>
                <option value="New Business Partnership">New Business Partnership</option>
                <option value="Credit Limit Review">Credit Limit Review</option>
                <option value="Vendor Evaluation">Vendor Evaluation</option>
                <option value="Due Diligence">Due Diligence</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Any specific requirements or notes for this credit assessment..."
              />
            </div>

            {/* Credit Report Features */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                This credit report will include:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Comprehensive credit score and grade</li>
                <li>• Risk category assessment</li>
                <li>• Credit limit recommendation</li>
                <li>• Component score breakdown (Financial, Payment, Stability, Compliance)</li>
                <li>• Trade reference analysis</li>
                <li>• Risk factors and positive indicators</li>
                <li>• Professional recommendations for credit decisions</li>
              </ul>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">
                Important Notice:
              </h3>
              <p className="text-sm text-yellow-800">
                Credit reports are valid for 30 days from generation date. 
                This assessment is based on available data and should be used as part of your overall credit decision process.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="btn-primary"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  'Generate Credit Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateCreditReport;