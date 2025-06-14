import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../../services/businessService';
import {
  BusinessCreateRequest,
  BusinessType,
  IndustryCategory,
  BUSINESS_TYPE_LABELS,
  INDUSTRY_CATEGORY_LABELS
} from '../../types/business';

const CreateBusiness: React.FC = () => {
  const [formData, setFormData] = useState<BusinessCreateRequest>({
    businessName: '',
    gstin: '',
    pan: '',
    businessType: BusinessType.PRIVATE_LIMITED,
    industryCategory: IndustryCategory.MANUFACTURING,
    registrationDate: '',
    businessDescription: '',
    registeredAddress: '',
    city: '',
    state: '',
    pincode: '',
    businessPhone: '',
    businessEmail: '',
    website: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await businessService.createBusiness(formData);
      navigate('/dashboard/businesses');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Business Profile</h1>
        <p className="text-gray-600">Add your business details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                required
                className="input-field"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN *
                </label>
                <input
                  type="text"
                  name="gstin"
                  required
                  className="input-field"
                  placeholder="22AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN *
                </label>
                <input
                  type="text"
                  name="pan"
                  required
                  className="input-field"
                  placeholder="AAAAA0000A"
                  value={formData.pan}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  required
                  className="input-field"
                  value={formData.businessType}
                  onChange={handleChange}
                >
                  {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Category *
                </label>
                <select
                  name="industryCategory"
                  required
                  className="input-field"
                  value={formData.industryCategory}
                  onChange={handleChange}
                >
                  {Object.entries(INDUSTRY_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Date
              </label>
              <input
                type="date"
                name="registrationDate"
                className="input-field"
                value={formData.registrationDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                name="businessDescription"
                rows={3}
                className="input-field"
                placeholder="Brief description of your business..."
                value={formData.businessDescription}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Address Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Address *
              </label>
              <textarea
                name="registeredAddress"
                required
                rows={2}
                className="input-field"
                value={formData.registeredAddress}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="input-field"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  className="input-field"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  className="input-field"
                  placeholder="110001"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  className="input-field"
                  value={formData.businessPhone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  className="input-field"
                  value={formData.businessEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                className="input-field"
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Creating...' : 'Create Business Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBusiness;