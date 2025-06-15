import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentHistoryService } from '../../services/paymentHistoryService';
import { PaymentHistoryResponse, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS, VERIFICATION_STATUS_LABELS, VERIFICATION_STATUS_COLORS } from '../../types/payment';
import LoadingSpinner from '../LoadingSpinner';

interface PaymentHistoryListProps {
  businessId?: number;
  showBusinessInfo?: boolean;
  maxItems?: number;
}

const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({ 
  businessId, 
  showBusinessInfo = false,
  maxItems 
}) => {
  const [paymentHistories, setPaymentHistories] = useState<PaymentHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPaymentHistories();
  }, [businessId, currentPage]);

  const fetchPaymentHistories = async () => {
    try {
      if (businessId) {
        if (maxItems) {
          // Fetch limited items for preview
          const data = await paymentHistoryService.getBusinessPaymentHistory(businessId);
          setPaymentHistories(data.slice(0, maxItems));
        } else {
          // Fetch paginated results
          const data = await paymentHistoryService.getBusinessPaymentHistoryPaginated(businessId, currentPage, 10);
          setPaymentHistories(data.content);
          setTotalPages(data.totalPages);
        }
      } else {
        // Fetch user's payment histories
        const data = await paymentHistoryService.getUserPaymentHistories(currentPage, 10);
        setPaymentHistories(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm('Are you sure you want to delete this payment history?')) {
      try {
        await paymentHistoryService.deletePaymentHistory(paymentId);
        fetchPaymentHistories(); // Refresh list
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

  if (paymentHistories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
          <p className="text-gray-600 mb-4">
            {businessId 
              ? 'No payment transactions have been recorded for this business yet.'
              : 'You haven\'t recorded any payment transactions yet.'
            }
          </p>
          {businessId && (
            <Link
              to={`/dashboard/payment/add/${businessId}`}
              className="btn-primary"
            >
              Add Payment History
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment History Items */}
      <div className="grid grid-cols-1 gap-4">
        {paymentHistories.map((payment) => (
          <div key={payment.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {payment.transactionReference}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      PAYMENT_STATUS_COLORS[payment.paymentStatus]
                    }`}>
                      {PAYMENT_STATUS_LABELS[payment.paymentStatus]}
                    </span>
                  </div>
                  {showBusinessInfo && (
                    <p className="text-sm text-gray-600">
                      {payment.businessName} • {payment.businessGstin}
                    </p>
                  )}
                  {payment.invoiceNumber && (
                    <p className="text-sm text-gray-600">
                      Invoice: {payment.invoiceNumber}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(payment.transactionAmount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {payment.tradeRelationship}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-500">Due Date:</span>
                  <div className="font-medium">{formatDate(payment.dueDate)}</div>
                </div>
                {payment.paymentDate && (
                  <div>
                    <span className="text-sm text-gray-500">Payment Date:</span>
                    <div className="font-medium">{formatDate(payment.paymentDate)}</div>
                  </div>
                )}
                
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                {payment.paymentMethod && (
                  <div>
                    <span className="text-sm text-gray-500">Payment Method:</span>
                    <div className="text-sm font-medium">{payment.paymentMethod}</div>
                  </div>
                )}
                {payment.paymentTerms && (
                  <div>
                    <span className="text-sm text-gray-500">Payment Terms:</span>
                    <div className="text-sm font-medium">{payment.paymentTerms}</div>
                  </div>
                )}
                {payment.paymentRating && (
                  <div>
                    <span className="text-sm text-gray-500">Rating:</span>
                    <div className="text-sm font-medium">
                      {'⭐'.repeat(payment.paymentRating)} ({payment.paymentRating}/5)
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Verification:</span>
                  <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    VERIFICATION_STATUS_COLORS[payment.verificationStatus]
                  }`}>
                    {VERIFICATION_STATUS_LABELS[payment.verificationStatus]}
                  </span>
                </div>
              </div>

                

              {/* Comments */}
              {payment.comments && (
                <div className="mb-3">
                  <span className="text-sm text-gray-500">Comments:</span>
                  <div className="text-sm text-gray-700 mt-1">{payment.comments}</div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                <div>
                  Reported by {payment.reportedByName} • {formatDate(payment.createdAt)}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/payment/edit/${payment.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeletePayment(payment.id)}
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
      {maxItems && paymentHistories.length === maxItems && (
        <div className="text-center">
          <Link
            to={businessId ? `/dashboard/payment/business/${businessId}` : '/dashboard/payment/my-reports'}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Payment History →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryList;