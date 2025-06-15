import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentHistoryService } from '../../services/paymentHistoryService';
import { businessSearchService } from '../../services/BusinessSearchService';
import { Business } from '../../types/business';
import { PaymentHistoryRequest, PaymentStatus, TransactionType, DisputeStatus, PAYMENT_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '../../types/payment';
import LoadingSpinner from '../LoadingSpinner';

const AddPaymentHistory: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<PaymentHistoryRequest>({
    businessId: 0,
    transactionReference: '',
    invoiceNumber: '',
    transactionAmount: 0,
    dueDate: '',
    paymentDate: '',
    paymentStatus: PaymentStatus.PENDING,
    transactionType: TransactionType.INVOICE_PAYMENT,
    daysOverdue: 0,
    penaltyAmount: 0,
    settledAmount: 0,
    paymentMethod: '',
    paymentTerms: 'Net 30',
    tradeRelationship: 'Customer',
    paymentRating: 5,
    comments: '',
    disputeStatus: DisputeStatus.NO_DISPUTE,
    disputeReason: ''
  });

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(parseInt(businessId));
    }
  }, [businessId]);

  const fetchBusinessDetails = async (id: number) => {
    try {
      const data = await businessSearchService.getBusinessById(id);
      setBusiness(data);
      setFormData(prev => ({ ...prev, businessId: id }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const calculateDaysOverdue = () => {
    if (formData.dueDate && formData.paymentDate) {
      const dueDate = new Date(formData.dueDate);
      const paymentDate = new Date(formData.paymentDate);
      const diffTime = paymentDate.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setFormData(prev => ({ ...prev, daysOverdue: diffDays }));
      } else {
        setFormData(prev => ({ ...prev, daysOverdue: 0 }));
      }
    }
  };

  useEffect(() => {
    calculateDaysOverdue();
  }, [formData.dueDate, formData.paymentDate]);

  const generateTransactionReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  };

  const handleGenerateReference = () => {
    setFormData(prev => ({
      ...prev,
      transactionReference: generateTransactionReference()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.transactionReference) {
        throw new Error('Transaction reference is required');
      }
      if (formData.transactionAmount <= 0) {
        throw new Error('Transaction amount must be greater than 0');
      }
      if (!formData.dueDate) {
        throw new Error('Due date is required');
      }

      await paymentHistoryService.addPaymentHistory(formData);
      
      // Navigate back to business detail page
      navigate(`/dashboard/search/business/${business.id}?tab=payment-history`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
          Add Payment History
        </h1>
        <p className="text-gray-600">
          Record payment transaction for {business.businessName}
        </p>
      </div>

      {/* Business Info Card */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">{business.businessName}</h3>
              <p className="text-sm text-gray-600">GSTIN: {business.gstin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN: {business.pan}</p>
              <p className="text-sm text-gray-600">Type: {business.businessType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{business.city}, {business.state}</p>
              <p className="text-sm text-gray-600">Industry: {business.industryCategory}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Payment Transaction Details</h2>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Reference *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="transactionReference"
                    value={formData.transactionReference}
                    onChange={handleInputChange}
                    className="flex-1 input-field"
                    placeholder="Enter transaction reference"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerateReference}
                    className="btn-outline text-sm px-3"
                  >
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter invoice number"
                />
              </div>
            </div>

            {/* Transaction Amount and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Amount (₹) *
                </label>
                <input
                  type="number"
                  name="transactionAmount"
                  value={formData.transactionAmount}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type *
                </label>
                <select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Payment Status and Days Overdue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status *
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Overdue
                </label>
                <input
                  type="number"
                  name="daysOverdue"
                  value={formData.daysOverdue}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                  readOnly={formData.dueDate && formData.paymentDate ? true : false}
                />
                {formData.dueDate && formData.paymentDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically calculated based on due date and payment date
                  </p>
                )}
              </div>
            </div>

            {/* Additional Amounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penalty Amount (₹)
                </label>
                <input
                  type="number"
                  name="penaltyAmount"
                  value={formData.penaltyAmount}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settled Amount (₹)
                </label>
                <input
                  type="number"
                  name="settledAmount"
                  value={formData.settledAmount}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Net 7">Net 7</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Net 90">Net 90</option>
                  <option value="Immediate">Immediate</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trade Relationship *
                </label>
                <select
                  name="tradeRelationship"
                  value={formData.tradeRelationship}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Partner">Partner</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
            </div>

            {/* Payment Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Rating (1-5)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  name="paymentRating"
                  value={formData.paymentRating}
                  onChange={handleInputChange}
                  className="flex-1"
                  min="1"
                  max="5"
                  step="1"
                />
                <span className="text-sm font-medium text-gray-700 w-8">
                  {formData.paymentRating}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="Additional notes about this payment transaction..."
              />
            </div>

            {/* Dispute Information */}
            {formData.disputeStatus !== DisputeStatus.NO_DISPUTE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispute Reason
                </label>
                <textarea
                  name="disputeReason"
                  value={formData.disputeReason}
                  onChange={handleInputChange}
                  className="input-field"
                  rows={2}
                  placeholder="Describe the reason for dispute..."
                />
              </div>
            )}

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
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Payment History...
                  </>
                ) : (
                  'Add Payment History'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentHistory;