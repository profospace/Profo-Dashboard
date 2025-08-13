// src/components/users/UserHistory.jsx
import React, { useState } from 'react';
import Modal from '../common/Modal';

const UserHistory = ({ history }) => {
    const [activeTab, setActiveTab] = useState('viewed'); // 'viewed', 'liked', 'contacted'
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    if (!history) {
        return (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-yellow-700">No history data available for this user.</p>
            </div>
        );
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Format time duration (from seconds)
    const formatDuration = (seconds) => {
        if (!seconds || seconds < 1) return 'Less than a second';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes < 1) {
            return `${remainingSeconds} seconds`;
        }

        return `${minutes} minutes, ${remainingSeconds} seconds`;
    };

    // Render property card (common for all entity types)
    const renderPropertyCard = (item) => {
        // console.log("item" , item)
        if (!item || !item.propertyId) return null;

        const entity = item.propertyId;
        const entityType = item.entityType || 'property';

        // Determine what data to display based on entity type
        let title, address, imageUrl, details = [];

        switch (entityType) {
            case 'property':
            case 'PROPERTY':
                title = entity.post_title || 'Unnamed Property';
                address = entity.address || (entity.city && entity.locality ? `${entity.locality}, ${entity.city}` : 'No address');
                imageUrl = entity.post_images && entity.post_images.length > 0
                    ? entity.post_images[0].url
                    : (entity.galleryList && entity.galleryList.length > 0 ? entity.galleryList[0] : null);

                if (entity.price) details.push(`Price: ₹${entity.price} Lakhs`);
                if (entity.area) details.push(`Area: ${entity.area} sq.ft`);
                if (entity.bedrooms) details.push(`${entity.bedrooms} BHK`);
                if (entity.bathrooms) details.push(`${entity.bathrooms} Bath`);
                break;

            case 'project':
            case 'PROJECT':
                title = entity.name || 'Unnamed Project';
                address = entity.location?.address || (entity.location?.city ? `${entity.location.city}, ${entity.location.state}` : 'No address');
                imageUrl = entity.galleryNow && entity.galleryNow.length > 0
                    ? entity.galleryNow[0]
                    : null;

                if (entity.type) details.push(`Type: ${entity.type}`);
                if (entity.status) details.push(`Status: ${entity.status}`);
                if (entity.overview?.totalUnits) details.push(`Units: ${entity.overview.totalUnits}`);
                if (entity.overview?.priceRange?.min && entity.overview?.priceRange?.max) {
                    details.push(`Price: ₹${entity.overview.priceRange.min / 1000000}-${entity.overview.priceRange.max / 1000000} Lakhs`);
                }
                break;

            case 'building':
            case 'BUILDING':
                title = entity.name || 'Unnamed Building';
                address = entity.location?.address || 'No address';
                imageUrl = entity.galleryList && entity.galleryList.length > 0
                    ? entity.galleryList[0]
                    : null;

                if (entity.type) details.push(`Type: ${entity.type}`);
                if (entity.totalProperties) details.push(`Total Properties: ${entity.totalProperties}`);
                break;

            default:
                title = 'Unknown Item';
                address = 'No address';
        }

        return (
            <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => {
                setSelectedItem({ ...item, title, address, imageUrl, details, entityType });
                setModalOpen(true);
            }}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{address}</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                                {entityType}
                            </span>
                        </div>

                        {details.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {details.map((detail, index) => (
                                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                                        {detail}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Timestamp and additional info */}
                        <div className="mt-3 flex flex-wrap items-center justify-between text-sm text-gray-500">
                            <div>
                                {item.timestamp || item.savedAt ? (
                                    <span>
                                        {activeTab === 'viewed' ? 'Viewed' : activeTab === 'liked' ? 'Saved' : 'Contacted'} on {formatDate(item.timestamp || item.savedAt)}
                                    </span>
                                ) : (
                                    <span>No timestamp available</span>
                                )}
                            </div>

                            {activeTab === 'viewed' && item.timeSpent && (
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Spent {formatDuration(item.timeSpent)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const renderContactCard = (item) => {
        console.log("contact info", item);

        if (!item || !item.entityId) return null;

        const entity = item.entityId;
        const entityType = item.entityType || 'property';

        // Determine what data to display based on entity type
        let title, address, imageUrl, details = [];

        switch (entityType) {
            case 'property':
            case 'PROPERTY':
                title = entity.post_title || 'Unnamed Property';
                address = entity.address || (entity.city && entity.locality ? `${entity.locality}, ${entity.city}` : 'No address');
                imageUrl = entity.post_images && entity.post_images.length > 0
                    ? entity.post_images[0].url
                    : (entity.galleryList && entity.galleryList.length > 0 ? entity.galleryList[0] : null);

                if (entity.price) details.push(`Price: ₹${(entity.price / 100000).toFixed(1)} Lakhs`);
                if (entity.area) details.push(`Area: ${entity.area}`);
                if (entity.bedrooms) details.push(`${entity.bedrooms} BHK`);
                if (entity.bathrooms) details.push(`${entity.bathrooms} Bath`);
                break;

            case 'project':
            case 'PROJECT':
                title = entity.name || 'Unnamed Project';
                address = entity.location?.address || (entity.location?.city ? `${entity.location.city}, ${entity.location.state}` : 'No address');
                imageUrl = entity.galleryNow && entity.galleryNow.length > 0
                    ? entity.galleryNow[0]
                    : null;

                if (entity.type) details.push(`Type: ${entity.type}`);
                if (entity.status) details.push(`Status: ${entity.status}`);
                if (entity.overview?.totalUnits) details.push(`Units: ${entity.overview.totalUnits}`);
                if (entity.overview?.priceRange?.min && entity.overview?.priceRange?.max) {
                    details.push(`Price: ₹${entity.overview.priceRange.min / 1000000}-${entity.overview.priceRange.max / 1000000} Lakhs`);
                }
                break;

            case 'building':
            case 'BUILDING':
                title = entity.name || 'Unnamed Building';
                address = entity.location?.address || 'No address';
                imageUrl = entity.galleryList && entity.galleryList.length > 0
                    ? entity.galleryList[0]
                    : null;

                if (entity.type) details.push(`Type: ${entity.type}`);
                if (entity.totalProperties) details.push(`Total Properties: ${entity.totalProperties}`);
                break;

            default:
                title = 'Unknown Item';
                address = 'No address';
        }

        return (
            <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => {
                setSelectedItem({ ...item, title, address, imageUrl, details, entityType });
                setModalOpen(true);
            }}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{address}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                                    {entityType}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${item.inquiryStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        item.inquiryStatus === 'RESPONDED' ? 'bg-green-100 text-green-800' :
                                            item.inquiryStatus === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                    {item.inquiryStatus || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        {details.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {details.map((detail, index) => (
                                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                                        {detail}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Contact timestamps and status */}
                        <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 2.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>First contacted: {formatDate(item.firstContactedAt)}</span>
                                </div>
                            </div>

                            {item.lastContactedAt !== item.firstContactedAt && (
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Last contacted: {formatDate(item.lastContactedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Prepare data for each tab
    const viewedProperties = history.viewedProperties || [];
    const likedProperties = history.likedProperties || [];
    const contactedProperties = history.contactedProperties || [];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User History</h2>

                {/* Tab Navigation */}
                <div className="flex border-b">
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'viewed'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('viewed')}
                    >
                        Viewed Properties ({viewedProperties.length})
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'liked'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('liked')}
                    >
                        Liked Properties ({likedProperties.length})
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'contacted'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('contacted')}
                    >
                        Contacted Properties ({contactedProperties.length})
                    </button>
                </div>
            </div>

            {/* Content based on active tab */}
            <div className="space-y-4">
                {activeTab === 'viewed' && (
                    viewedProperties.length > 0 ? (
                        viewedProperties.map((item) => (
                            <div key={item._id}>
                                {renderPropertyCard(item)}
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                            <p className="text-gray-500">No viewed properties found</p>
                        </div>
                    )
                )}

                {activeTab === 'liked' && (
                    likedProperties.length > 0 ? (
                        likedProperties.map((item) => (
                            <div key={item._id}>
                                {renderPropertyCard(item)}
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                            <p className="text-gray-500">No liked properties found</p>
                        </div>
                    )
                )}

                {activeTab === 'contacted' && (
                    contactedProperties.length > 0 ? (
                        contactedProperties.map((item) => (
                            <div key={item._id}>
                                {renderContactCard(item)}
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                            <p className="text-gray-500">No contacted properties found</p>
                        </div>
                    )
                )}
            </div>

            {/* Property Detail Modal */}
            {selectedItem && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={selectedItem.title || 'Property Details'}
                    size="lg"
                >
                    <div className="space-y-4">
                        {/* Property Image */}
                        <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-md overflow-hidden">
                            {selectedItem.imageUrl ? (
                                <img
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Property Details */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-900">{selectedItem.title}</h3>
                            <p className="text-gray-600 mt-1">{selectedItem.address}</p>

                            {selectedItem.details && selectedItem.details.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedItem.details.map((detail, index) => (
                                        <span key={index} className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md">
                                            {detail}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Additional information based on event type */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">User Interaction</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <span className="text-sm text-gray-500">Entity Type:</span>
                                    <p className="font-medium text-gray-800 capitalize">{selectedItem.entityType}</p>
                                </div>

                                {activeTab === 'viewed' && (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <span className="text-sm text-gray-500">Viewed On:</span>
                                            <p className="font-medium text-gray-800">{formatDate(selectedItem.timestamp)}</p>
                                        </div>

                                        {selectedItem.timeSpent && (
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <span className="text-sm text-gray-500">Time Spent:</span>
                                                <p className="font-medium text-gray-800">{formatDuration(selectedItem.timeSpent)}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'liked' && (
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-500">Saved On:</span>
                                        <p className="font-medium text-gray-800">{formatDate(selectedItem.savedAt)}</p>
                                    </div>
                                )}

                                {activeTab === 'contacted' && (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <span className="text-sm text-gray-500">Contact Method:</span>
                                            <p className="font-medium text-gray-800">{selectedItem.contactType || 'N/A'}</p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <span className="text-sm text-gray-500">Status:</span>
                                            <p className="font-medium text-gray-800">{selectedItem.status || 'N/A'}</p>
                                        </div>

                                        {selectedItem.notes && (
                                            <div className="p-3 bg-gray-50 rounded-md md:col-span-2">
                                                <span className="text-sm text-gray-500">Notes:</span>
                                                <p className="font-medium text-gray-800">{selectedItem.notes}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserHistory;