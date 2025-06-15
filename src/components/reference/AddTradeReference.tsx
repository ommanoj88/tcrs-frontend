import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tradeReferenceService } from '../../services/tradeReferenceService';
import { businessSearchService } from '../../services/BusinessSearchService';
import { Business } from '../../types/business';
import { 
  TradeReferenceRequest, 
  ReferenceType, 
  RelationshipType, 
  PaymentBehavior, 
  RecommendationLevel,
  REFERENCE_TYPE_LABELS,
  RELATIONSHIP_TYPE_LABELS,
  PAYMENT_BEHAVIOR_LABELS,
  RECOMMENDATION_LEVEL_LABELS 
} from '../../types/tradeReference';
import LoadingSpinner from '../LoadingSpinner';

const AddTradeReference: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<TradeReferenceRequest>({
    businessId: 0,
    companyName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    companyAddress: '',
    companyGstin: '',
    referenceType: ReferenceType.TRADE_REFERENCE,
    relationshipType: RelationshipType.CUSTOMER,
    relationshipDurationMonths: 0,
    relationshipStartDate: '',
    relationshipEndDate: '',
    averageMonthlyBusiness: 0,
    totalBusinessValue: 0,
    creditLimitProvided: 0,
    paymentTerms: 'Net 30',
    paymentBehavior: PaymentBehavior.GOOD,
    paymentRating: 4,
    overallRating: 4,
    hasDisputes: false,
    disputeDetails: '',
    referenceComments: '',
    recommendationLevel: RecommendationLevel.RECOMMENDED,
    isConfidential: false
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
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
      }));
    }
  };

  const calculateRelationshipDuration = () => {
    if (formData.relationshipStartDate && formData.relationshipEndDate) {
      const startDate = new Date(formData.relationshipStartDate);
      const endDate = new Date(formData.relationshipEndDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      
      if (diffMonths > 0) {
        setFormData(prev => ({ ...prev, relationshipDurationMonths: diffMonths }));
      }
    } else if (formData.relationshipStartDate) {
      const startDate = new Date(formData.relationshipStartDate);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - startDate.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      
      if (diffMonths > 0) {
        setFormData(prev => ({ ...prev, relationshipDurationMonths: diffMonths }));
      }
    }
  };

  useEffect(() => {
    calculateRelationshipDuration();
  }, [formData.relationshipStartDate, formData.relationshipEndDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.companyName.trim()) {
        throw new Error('Company name is required');
      }
      if (!formData.contactPerson.trim()) {
        throw new Error('Contact person is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone number is required');
      }

      await tradeReferenceService.addTradeReference(formData);
      
      // Navigate back to business detail page
      navigate(`/dashboard/search/business/${business.id}?tab=trade-references`);
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
          Add Trade Reference
        </h1>
        <p className="text-gray-600">
          Add a trade reference for {business.businessName}
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

      {/* Trade Reference Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Trade Reference Details</h2>
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
            {/* Reference Type and Relationship Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Type *
                </label>
                <select
                  name="referenceType"
                  value={formData.referenceType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {Object.entries(REFERENCE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Type *
                </label>
                <select
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {Object.entries(RELATIONSHIP_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Company Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company GSTIN
                  </label>
                  <input
                    type="text"
                    name="companyGstin"
                    value={formData.companyGstin}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter GSTIN"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address
                </label>
                <textarea
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  className="input-field"
                  rows={3}
                  placeholder="Enter company address"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter designation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Relationship Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Relationship Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship Start Date
                  </label>
                  <input
                    type="date"
                    name="relationshipStartDate"
                    value={formData.relationshipStartDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship End Date
                  </label>
                  <input
                    type="date"
                    name="relationshipEndDate"
                    value={formData.relationshipEndDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    name="relationshipDurationMonths"
                    value={formData.relationshipDurationMonths}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    readOnly={formData.relationshipStartDate ? true : false}
                  />
                  {formData.relationshipStartDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically calculated based on dates
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Value Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Value Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Business Value (₹)
                  </label>
                  <input
                    type="number"
                    name="totalBusinessValue"
                    value={formData.totalBusinessValue}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Monthly Business (₹)
                  </label>
                  <input
                    type="number"
                    name="averageMonthlyBusiness"
                    value={formData.averageMonthlyBusiness}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Limit Provided (₹)
                  </label>
                  <input
                    type="number"
                    name="creditLimitProvided"
                    value={formData.creditLimitProvided}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="mt-4">
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
                  <option value="Advance">Advance Payment</option>
                </select>
              </div>
            </div>

            {/* Assessment */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Behavior *
                  </label>
                  <select
                    name="paymentBehavior"
                    value={formData.paymentBehavior}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {Object.entries(PAYMENT_BEHAVIOR_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recommendation Level
                  </label>
                  <select
                    name="recommendationLevel"
                    value={formData.recommendationLevel}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {Object.entries(RECOMMENDATION_LEVEL_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Rating (1-5)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      name="overallRating"
                      value={formData.overallRating}
                      onChange={handleInputChange}
                      className="flex-1"
                      min="1"
                      max="5"
                      step="1"
                    />
                    <span className="text-sm font-medium text-gray-700 w-8">
                      {formData.overallRating}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disputes and Comments */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasDisputes"
                    checked={formData.hasDisputes}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    This business has had payment disputes
                  </span>
                </label>
              </div>

              {formData.hasDisputes && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dispute Details
                  </label>
                  <textarea
                    name="disputeDetails"
                    value={formData.disputeDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="Describe the disputes that occurred..."
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Comments
                </label>
                <textarea
                  name="referenceComments"
                  value={formData.referenceComments}
                  onChange={handleInputChange}
                  className="input-field"
                  rows={4}
                  placeholder="Additional comments about this trade reference..."
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isConfidential"
                    checked={formData.isConfidential}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Mark this reference as confidential
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
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
                    Adding Trade Reference...
                  </>
                ) : (
                  'Add Trade Reference'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTradeReference;