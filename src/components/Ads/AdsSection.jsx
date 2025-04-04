import React, { useState } from 'react';
import AdForm from '../../pages/Ads Management/AdForm';

const AdsSection = ({ ads, onAddAd, onUpdateAd, onRemoveAd }) => {
    const [isAdFormOpen, setIsAdFormOpen] = useState(false);
    const [editingAdIndex, setEditingAdIndex] = useState(null);
    const [currentAd, setCurrentAd] = useState(null);

    const handleAddAd = () => {
        setEditingAdIndex(null);
        setCurrentAd(null);
        setIsAdFormOpen(true);
    };

    const handleEditAd = (index) => {
        setEditingAdIndex(index);
        setCurrentAd(ads[index]);
        setIsAdFormOpen(true);
    };

    const handleAdFormSubmit = (ad) => {
        if (editingAdIndex !== null) {
            onUpdateAd(editingAdIndex, ad);
        } else {
            onAddAd(ad);
        }
        setIsAdFormOpen(false);
    };

    const handleAdFormCancel = () => {
        setIsAdFormOpen(false);
    };

    const getAdTypeDisplay = (adType) => {
        if (!adType) return 'N/A';

        let display = adType.type || 'Unknown';

        if (adType.type === 'BANNER') {
            display += ` (${adType.width || 0}x${adType.height || 0})`;
        } else if (adType.type === 'POPUP') {
            display += ` (Delay: ${adType.delay || 0}ms)`;
        } else if (adType.type === 'INTERSTITIAL') {
            display += ` (Fullscreen: ${adType.fullscreen ? 'Yes' : 'No'})`;
        }

        return display;
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Ads</h2>
                <button
                    onClick={handleAddAd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                >
                    Add New Ad
                </button>
            </div>

            {ads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No ads configured. Click the "Add New Ad" button to create one.
                </div>
            ) : (
                <div className="space-y-4">
                    {ads.map((ad, index) => (
                        <div key={index} className="border rounded-md p-4 bg-gray-50">
                            <div className="flex justify-between">
                                <h3 className="font-semibold text-lg">{ad.name || `Ad ${index + 1}`}</h3>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEditAd(index)}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onRemoveAd(index)}
                                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Header:</p>
                                    <p className="text-gray-700">{ad.header || 'N/A'}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Type:</p>
                                    <p className="text-gray-700">{getAdTypeDisplay(ad.type)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Page Link:</p>
                                    <p className="text-gray-700 truncate">{ad.pagelink || 'N/A'}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Contact:</p>
                                    <p className="text-gray-700 truncate">
                                        {ad.contact && ad.contact.length > 0
                                            ? ad.contact.join(', ')
                                            : 'N/A'}
                                    </p>
                                </div>

                                {ad.imagelinks && ad.imagelinks.length > 0 && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">Image Links:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {ad.imagelinks.map((url, i) => (
                                                <div key={i} className="relative group w-16 h-16 overflow-hidden rounded border border-gray-300">
                                                    <img
                                                        src={url}
                                                        alt={`Ad image ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/64?text=Error';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-white text-xs"
                                                        >
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAdFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingAdIndex !== null ? 'Edit Ad' : 'Add New Ad'}
                        </h2>
                        <AdForm
                            ad={currentAd}
                            onSubmit={handleAdFormSubmit}
                            onCancel={handleAdFormCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdsSection;