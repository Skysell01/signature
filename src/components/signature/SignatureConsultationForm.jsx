import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, MessageSquare } from 'lucide-react';

const SignatureConsultationForm = ({ onSubmit, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.profession.trim()) newErrors.profession = 'Profession is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 via-black/20 to-gray-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Personal Information
              </h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Please provide your details for personalized signature design
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone and Profession Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Briefcase className="w-4 h-4" />
                  <span>Profession *</span>
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${errors.profession ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Enter your profession"
                />
                {errors.profession && (
                  <p className="text-red-500 text-xs">{errors.profession}</p>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MessageSquare className="w-4 h-4" />
                <span>Remarks or Any Specific Requirement</span>
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows="4"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Any specific requirements or remarks for your signature design..."
              />
              <p className="text-xs text-gray-500">
                Optional: Let us know any specific requirements for your signature
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignatureConsultationForm; 