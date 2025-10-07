import React , {useState} from 'react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import { Search, Filter, X, CheckCircle2, AlertCircle ,  Building2, Bed, Home, Plus, Edit, Tag } from 'lucide-react';


const CreateOfferModal = ({ onClose, onOfferCreated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        validFrom: '',
        validUntil: '',
        maxUsageCount: '1',
        minTokenAmount: '',
        applicableForNewBookingsOnly: true,
        offerImage: '',
        notificationTitle: '',
        notificationMessage: '',
        notificationImage: '',
        isGlobalOffer: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!formData.discountValue || formData.discountValue <= 0) {
            setError('Valid discount value is required');
            return false;
        }
        if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
            setError('Percentage discount cannot exceed 100%');
            return false;
        }
        if (!formData.validFrom) {
            setError('Valid from date is required');
            return false;
        }
        if (!formData.validUntil) {
            setError('Valid until date is required');
            return false;
        }
        if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
            setError('Valid until date must be after valid from date');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${base_url}/api/offers/admin/create`,
                {
                    ...formData,
                    discountValue: parseFloat(formData.discountValue),
                    maxUsageCount: parseInt(formData.maxUsageCount) || 1,
                    minTokenAmount: formData.minTokenAmount ? parseFloat(formData.minTokenAmount) : 0
                },
                getAuthConfig()
            );

            if (response.data.success) {
                onOfferCreated();
            } else {
                setError(response.data.message || 'Failed to create offer');
            }
        } catch (err) {
            console.error('Error creating offer:', err);
            setError(err.response?.data?.message || 'Failed to create offer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Create New Offer</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Offer Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Summer Special Discount"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the offer details..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Discount Type and Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FLAT">Flat Amount (₹)</option>
                                    <option value="FREE_SERVICE">Free Service</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    placeholder={formData.discountType === 'PERCENTAGE' ? '0-100' : 'Amount'}
                                    min="0"
                                    max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Validity Period */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Validity Period</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid From <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="validFrom"
                                    value={formData.validFrom}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid Until <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="validUntil"
                                    value={formData.validUntil}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Usage Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Usage Settings</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Usage Count
                                </label>
                                <input
                                    type="number"
                                    name="maxUsageCount"
                                    value={formData.maxUsageCount}
                                    onChange={handleChange}
                                    placeholder="e.g., 100"
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Token Amount
                                </label>
                                <input
                                    type="number"
                                    name="minTokenAmount"
                                    value={formData.minTokenAmount}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="applicableForNewBookingsOnly"
                                    checked={formData.applicableForNewBookingsOnly}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Applicable for new bookings only</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isGlobalOffer"
                                    checked={formData.isGlobalOffer}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Make this a global offer (available to all users)</span>
                            </label>
                        </div>
                    </div>

                    {/* Images and Notifications */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Images & Notifications (Optional)</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Offer Image URL
                            </label>
                            <input
                                type="url"
                                name="offerImage"
                                value={formData.offerImage}
                                onChange={handleChange}
                                placeholder="https://example.com/offer-image.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notification Title
                            </label>
                            <input
                                type="text"
                                name="notificationTitle"
                                value={formData.notificationTitle}
                                onChange={handleChange}
                                placeholder="e.g., New Offer Available!"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notification Message
                            </label>
                            <textarea
                                name="notificationMessage"
                                value={formData.notificationMessage}
                                onChange={handleChange}
                                placeholder="Message to be sent to users..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notification Image URL
                            </label>
                            <input
                                type="url"
                                name="notificationImage"
                                value={formData.notificationImage}
                                onChange={handleChange}
                                placeholder="https://example.com/notification-image.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOfferModal;