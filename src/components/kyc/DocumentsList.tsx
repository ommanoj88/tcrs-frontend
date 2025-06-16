import React, { useState } from 'react';
import { kycService, KycDocument } from '../../services/kycService';

interface DocumentsListProps {
  businessId: number;
  documents: KycDocument[];
  onDocumentChange: () => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  businessId,
  documents,
  onDocumentChange,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<KycDocument | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📋';
  };

  const formatFileSize = (sizeStr: string) => {
    const size = parseInt(sizeStr);
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDelete = async (documentId: number) => {
    try {
      setIsDeleting(true);
      await kycService.deleteDocument(documentId);
      onDocumentChange();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry < thirtyDaysFromNow && expiry > new Date();
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
          <p className="text-gray-600">Upload your first KYC document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl">{getDocumentIcon(document.mimeType)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {formatDocumentType(document.documentType)}
                      </h4>
                      {document.isPrimary && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Primary
                        </span>
                      )}
                      {isExpired(document.expiryDate) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Expired
                        </span>
                      )}
                      {isExpiringSoon(document.expiryDate) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">{document.originalFilename}</p>
                    <p className="text-sm text-gray-500">
                      Document No: {document.documentNumber} • {formatFileSize(document.fileSize)}
                    </p>
                    
                    {document.expiryDate && (
                      <p className="text-sm text-gray-500">
                        Expires: {new Date(document.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.verificationStatus)}`}>
                        {document.verificationStatus}
                      </span>
                      
                      <span className="text-xs text-gray-500">
                        Uploaded {new Date(document.createdAt).toLocaleDateString()} by {document.uploadedBy}
                      </span>
                    </div>
                    
                    {document.verificationNotes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>Notes:</strong> {document.verificationNotes}
                      </div>
                    )}
                    
                    {document.verificationStatus === 'VERIFIED' && document.verifiedBy && (
                      <div className="mt-2 text-sm text-gray-500">
                        Verified by {document.verifiedBy} on {new Date(document.verifiedAt!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedDocument(document)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(document.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Document Details</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document Type</label>
                  <p className="text-sm text-gray-900">{formatDocumentType(selectedDocument.documentType)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document Number</label>
                  <p className="text-sm text-gray-900">{selectedDocument.documentNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Name</label>
                  <p className="text-sm text-gray-900">{selectedDocument.originalFilename}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Size</label>
                  <p className="text-sm text-gray-900">{formatFileSize(selectedDocument.fileSize)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.verificationStatus)}`}>
                    {selectedDocument.verificationStatus}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Uploaded</label>
                  <p className="text-sm text-gray-900">{new Date(selectedDocument.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedDocument.expiryDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedDocument.expiryDate).toLocaleDateString()}</p>
                </div>
              )}

              {selectedDocument.verificationNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verification Notes</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{selectedDocument.verificationNotes}</p>
                  </div>
                </div>
              )}

              {selectedDocument.confidenceScore && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confidence Score</label>
                  <p className="text-sm text-gray-900">{(selectedDocument.confidenceScore * 100).toFixed(1)}%</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedDocument(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="text-center">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Document</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;