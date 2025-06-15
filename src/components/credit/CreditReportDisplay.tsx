import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { creditReportService } from '../../services/creditReportService';
import { CreditReportResponse, CREDIT_GRADE_LABELS, CREDIT_GRADE_COLORS, RISK_CATEGORY_LABELS, RISK_CATEGORY_COLORS } from '../../types/credit';
import CreditScoreChart from './CreditScoreChart';
import ComponentScores from './ComponentScores';
import LoadingSpinner from '../LoadingSpinner';

const CreditReportDisplay: React.FC = () => {
  const { reportNumber } = useParams<{ reportNumber: string }>();
  const [report, setReport] = useState<CreditReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reportNumber) {
      fetchCreditReport(reportNumber);
    }
  }, [reportNumber]);

  const fetchCreditReport = async (reportNum: string) => {
    try {
      const data = await creditReportService.getCreditReport(reportNum);
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // >= 1 Crore
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // >= 1 Lakh
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isReportExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Credit report not found</h2>
        </div>
      </div>
    );
  }

  const expired = isReportExpired(report.reportValidUntil);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Credit Report
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Report #{report.reportNumber}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {expired ? 'Expired' : 'Valid'}
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
          <button
            onClick={() => window.print()}
            className="btn-outline"
          >
            Print Report
          </button>
        </div>
      </div>

      {/* Expired Notice */}
      {expired && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">This report has expired</p>
          <p className="text-sm">
            This credit report expired on {formatDate(report.reportValidUntil)}. 
            Please generate a new report for the most current assessment.
          </p>
        </div>
      )}

      {/* Business Information */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {report.businessName}
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">GSTIN</dt>
                  <dd className="text-sm text-gray-900">{report.businessGstin}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">PAN</dt>
                  <dd className="text-sm text-gray-900">{report.businessPan}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Years in Business</dt>
                  <dd className="text-sm text-gray-900">{report.yearsInBusiness} years</dd>
                </div>
              </dl>
            </div>
            <div>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Report Generated</dt>
                  <dd className="text-sm text-gray-900">{formatDate(report.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                  <dd className="text-sm text-gray-900">{formatDate(report.reportValidUntil)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Requested By</dt>
                  <dd className="text-sm text-gray-900">{report.requestedByName}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Credit Score */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Credit Score</h3>
          </div>
          <div className="card-body text-center">
            <CreditScoreChart 
              score={report.creditScore} 
              grade={report.creditScoreGrade}
              size="large"
            />
            <div className="mt-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                CREDIT_GRADE_COLORS[report.creditScoreGrade]
              }`}>
                {CREDIT_GRADE_LABELS[report.creditScoreGrade]}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Category */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
          </div>
          <div className="card-body text-center">
            <div className="mb-4">
              <span className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${
                RISK_CATEGORY_COLORS[report.riskCategory]
              }`}>
                {RISK_CATEGORY_LABELS[report.riskCategory]}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">GST Compliance:</span>
                <span className={report.gstComplianceStatus ? 'text-green-600' : 'text-red-600'}>
                  {report.gstComplianceStatus ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PAN Verification:</span>
                <span className={report.panVerificationStatus ? 'text-green-600' : 'text-red-600'}>
                  {report.panVerificationStatus ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Limit */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recommended Credit Limit</h3>
          </div>
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(report.creditLimitRecommendation)}
            </div>
            <p className="text-sm text-gray-600">
              Based on comprehensive risk assessment
            </p>
            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Trade References:</span>
                <span>{report.tradeReferencesCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Positive:</span>
                <span className="text-green-600">{report.positiveReferencesCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Negative:</span>
                <span className="text-red-600">{report.negativeReferencesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Score Breakdown</h3>
        </div>
        <div className="card-body">
          <ComponentScores
            financialStrengthScore={report.financialStrengthScore}
            paymentBehaviorScore={report.paymentBehaviorScore}
            businessStabilityScore={report.businessStabilityScore}
            complianceScore={report.complianceScore}
          />
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Executive Summary</h3>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-700 leading-relaxed">
              {report.summary}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
          </div>
          <div className="card-body">
            <div className="text-sm text-gray-700">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {report.recommendations}
              </pre>
            </div>
          </div>
        </div>

        {/* Positive Indicators */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 text-green-700">
              Positive Indicators
            </h3>
          </div>
          <div className="card-body">
            <div className="text-sm text-gray-700">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {report.positiveIndicators}
              </pre>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 text-red-700">
              Risk Factors
            </h3>
          </div>
          <div className="card-body">
            <div className="text-sm text-gray-700">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {report.riskFactors}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 card">
        <div className="card-body">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Disclaimer</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            This credit report is generated based on available information and should be used as part of your overall credit decision process. 
            The assessment is subject to data availability and accuracy. TCRS does not guarantee the accuracy of third-party data sources. 
            This report is confidential and intended solely for the requesting party's use in making credit decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditReportDisplay;