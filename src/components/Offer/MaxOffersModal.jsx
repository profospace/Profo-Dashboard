import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Tag } from 'lucide-react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';


const MaxOffersModal = ({ selectedProperties, properties, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [maxOffers, setMaxOffers] = useState(1);
    const [propertyDetails, setPropertyDetails] = useState([]);

    useEffect(() => {
        // Get details of selected properties
        const details = selectedProperties.map(propId => {
            const prop = properties.find(p => p._id === propId);
            const activeOffersCount = prop?.profoOffers?.filter(o => o.isActive).length || 0;
            return {
                id: propId,
                title: prop?.title || prop?.post_title || 'Untitled',
                activeOffersCount,
                currentMaxOffers: prop?.maxProfoOfferAvail || 0
            };
        });
        setPropertyDetails(details);

        // Set default max offers to the minimum active offers count
        const minActiveOffers = Math.min(...details.map(d => d.activeOffersCount));
        setMaxOffers(minActiveOffers > 0 ? minActiveOffers : 1);
    }, [selectedProperties, properties]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate max offers
        const maxActiveOffers = Math.max(...propertyDetails.map(d => d.activeOffersCount));
        if (maxOffers > maxActiveOffers) {
            setError(`Max offers cannot exceed the highest number of active offers (${maxActiveOffers})`);
            return;
        }

        if (maxOffers < 0) {
            setError('Max offers must be at least 0');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${base_url}/api/offers/admin/update-max-offers`,
                {
                    propertyIds: selectedProperties,
                    maxProfoOfferAvail: parseInt(maxOffers)
                },
                getAuthConfig()
            );

            if (response.data.success) {
                onUpdate();
            } else {
                setError(response.data.message || 'Failed to update max offers');
            }
        } catch (err) {
            console.error('Error updating max offers:', err);
            setError(err.response?.data?.message || 'Failed to update max offers');
        } finally {
            setLoading(false);
        }
    };

    const maxActiveOffers = Math.max(...propertyDetails.map(d => d.activeOffersCount), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Set Max Offers Available</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            Set the maximum number of offers that users can avail from all the offers attached to these properties.
                            This value cannot exceed the number of active offers on each property.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Max Offers Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Offers Available per User
                            </label>
                            <input
                                type="number"
                                value={maxOffers}
                                onChange={(e) => setMaxOffers(e.target.value)}
                                min="0"
                                max={maxActiveOffers}
                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Range: 0 to {maxActiveOffers} (based on active offers)
                            </p>
                        </div>

                        {/* Selected Properties Summary */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Selected Properties ({propertyDetails.length})
                            </h3>
                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                {propertyDetails.map((prop, index) => (
                                    <div
                                        key={prop.id}
                                        className={`p-3 ${index !== propertyDetails.length - 1 ? 'border-b border-gray-200' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {prop.title}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs text-gray-600">
                                                        Active Offers: <span className="font-medium">{prop.activeOffersCount}</span>
                                                    </span>
                                                    <span className="text-xs text-gray-600">
                                                        Current Max: <span className="font-medium">{prop.currentMaxOffers}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                            <p className="text-sm text-gray-700">
                                Users will be able to avail up to <span className="font-bold text-blue-600">{maxOffers}</span> offer{maxOffers !== 1 ? 's' : ''} from the offers attached to these properties.
                            </p>
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
                                {loading ? 'Updating...' : 'Update Max Offers'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MaxOffersModal;