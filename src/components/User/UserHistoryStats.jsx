// import React from 'react';
// import { Link } from 'react-router-dom';

// const UserHistoryStats = ({ counts, recent }) => {
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const date = new Date(dateString);
//         return date.toLocaleDateString();
//     };

//     // Create stats cards
//     const statsCards = [
//         {
//             title: 'Properties Viewed',
//             count: counts.viewed || 0,
//             icon: (
//                 <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//             ),
//             color: 'indigo',
//             type: 'viewed'
//         },
//         {
//             title: 'Properties Liked',
//             count: counts.liked || 0,
//             icon: (
//                 <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//             ),
//             color: 'pink',
//             type: 'liked'
//         },
//         {
//             title: 'Properties Contacted',
//             count: counts.contacted || 0,
//             icon: (
//                 <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                 </svg>
//             ),
//             color: 'green',
//             type: 'contacted'
//         },
//         {
//             title: 'Searches Performed',
//             count: counts.search || 0,
//             icon: (
//                 <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//             ),
//             color: 'purple',
//             type: 'search'
//         },
//     ];

//     // Render recent activity items
//     const renderRecentItems = (type, data) => {
//         if (!data || data.length === 0) {
//             return (
//                 <div className="py-4 text-center text-gray-500">
//                     No recent {type} activity
//                 </div>
//             );
//         }

//         switch (type) {
//             case 'viewed':
//                 return data.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
//                         <div className="flex-1">
//                             <p className="text-sm font-medium">Property: {item.propertyId}</p>
//                             <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
//                         </div>
//                         {item.timeSpent && (
//                             <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
//                                 {item.timeSpent}s
//                             </span>
//                         )}
//                     </div>
//                 ));
//             case 'liked':
//                 return data.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
//                         <div className="flex-1">
//                             <p className="text-sm font-medium">Property: {item.propertyId}</p>
//                             <p className="text-xs text-gray-500">{formatDate(item.savedAt)}</p>
//                         </div>
//                         {item.entityType && (
//                             <span className="text-xs bg-pink-100 text-pink-800 rounded-full px-2 py-1">
//                                 {item.entityType}
//                             </span>
//                         )}
//                     </div>
//                 ));
//             case 'contacted':
//                 return data.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
//                         <div className="flex-1">
//                             <p className="text-sm font-medium">Property: {item.propertyId}</p>
//                             <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                             <span className={`text-xs rounded-full px-2 py-1 ${item.contactType === 'CALL' ? 'bg-blue-100 text-blue-800' :
//                                     item.contactType === 'WHATSAPP' ? 'bg-green-100 text-green-800' :
//                                         'bg-yellow-100 text-yellow-800'
//                                 }`}>
//                                 {item.contactType}
//                             </span>
//                             <span className={`text-xs rounded-full px-2 py-1 ${['CONNECTED', 'Viewed', 'Scheduled', 'Visited', 'Negotiating', 'Closed'].includes(item.status)
//                                     ? 'bg-green-100 text-green-800'
//                                     : ['FAILED', 'NO_RESPONSE'].includes(item.status)
//                                         ? 'bg-red-100 text-red-800'
//                                         : 'bg-yellow-100 text-yellow-800'
//                                 }`}>
//                                 {item.status}
//                             </span>
//                         </div>
//                     </div>
//                 ));
//             case 'search':
//                 return data.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
//                         <div className="flex-1">
//                             <p className="text-sm font-medium">{item.query || 'No query'}</p>
//                             <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
//                         </div>
//                         <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1">
//                             {item.resultCount || 0} results
//                         </span>
//                     </div>
//                 ));
//             default:
//                 return (
//                     <div className="py-4 text-center text-gray-500">
//                         No data available
//                     </div>
//                 );
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {statsCards.map((card) => (
//                     <div
//                         key={card.title}
//                         className={`bg-white rounded-lg shadow overflow-hidden border-t-4 ${card.color === 'indigo' ? 'border-indigo-500' :
//                                 card.color === 'pink' ? 'border-pink-500' :
//                                     card.color === 'green' ? 'border-green-500' :
//                                         'border-purple-500'
//                             }`}
//                     >
//                         <div className="p-5">
//                             <div className="flex items-center">
//                                 <div className={`rounded-full p-3 ${card.color === 'indigo' ? 'bg-indigo-100' :
//                                         card.color === 'pink' ? 'bg-pink-100' :
//                                             card.color === 'green' ? 'bg-green-100' :
//                                                 'bg-purple-100'
//                                     }`}>
//                                     {card.icon}
//                                 </div>
//                                 <div className="ml-5">
//                                     <p className="text-gray-500 text-sm">{card.title}</p>
//                                     <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className={`px-5 py-2 border-t ${card.color === 'indigo' ? 'bg-indigo-50' :
//                                 card.color === 'pink' ? 'bg-pink-50' :
//                                     card.color === 'green' ? 'bg-green-50' :
//                                         'bg-purple-50'
//                             }`}>
//                             <Link to={`?type=${card.type}`} className={`text-sm font-medium hover:underline ${card.color === 'indigo' ? 'text-indigo-600 hover:text-indigo-800' :
//                                     card.color === 'pink' ? 'text-pink-600 hover:text-pink-800' :
//                                         card.color === 'green' ? 'text-green-600 hover:text-green-800' :
//                                             'text-purple-600 hover:text-purple-800'
//                                 }`}>
//                                 View Details →
//                             </Link>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Recent Activity */}
//             <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Recent Activity</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Recent Viewed */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-indigo-500 px-4 py-2">
//                         <h3 className="text-white font-medium">Recently Viewed Properties</h3>
//                     </div>
//                     <div className="p-4">
//                         {renderRecentItems('viewed', recent.viewed)}
//                     </div>
//                     <div className="bg-indigo-50 px-4 py-2 border-t">
//                         <Link to="?type=viewed" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
//                             View All Viewed Properties →
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Recent Liked */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-pink-500 px-4 py-2">
//                         <h3 className="text-white font-medium">Recently Liked Properties</h3>
//                     </div>
//                     <div className="p-4">
//                         {renderRecentItems('liked', recent.liked)}
//                     </div>
//                     <div className="bg-pink-50 px-4 py-2 border-t">
//                         <Link to="?type=liked" className="text-pink-600 text-sm font-medium hover:text-pink-800">
//                             View All Liked Properties →
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Recent Contacted */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-green-500 px-4 py-2">
//                         <h3 className="text-white font-medium">Recently Contacted Properties</h3>
//                     </div>
//                     <div className="p-4">
//                         {renderRecentItems('contacted', recent.contacted)}
//                     </div>
//                     <div className="bg-green-50 px-4 py-2 border-t">
//                         <Link to="?type=contacted" className="text-green-600 text-sm font-medium hover:text-green-800">
//                             View All Contacted Properties →
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Recent Searches */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="bg-purple-500 px-4 py-2">
//                         <h3 className="text-white font-medium">Recent Search Queries</h3>
//                     </div>
//                     <div className="p-4">
//                         {renderRecentItems('search', recent.search)}
//                     </div>
//                     <div className="bg-purple-50 px-4 py-2 border-t">
//                         <Link to="?type=search" className="text-purple-600 text-sm font-medium hover:text-purple-800">
//                             View All Search History →
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserHistoryStats;

import React from 'react';
import { Link } from 'react-router-dom';

const UserHistoryStats = ({ counts, recent }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Create stats cards
    const statsCards = [
        {
            title: 'Properties Viewed',
            count: counts.viewed || 0,
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            color: 'indigo',
            type: 'viewed'
        },
        {
            title: 'Properties Liked',
            count: counts.liked || 0,
            icon: (
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            color: 'pink',
            type: 'liked'
        },
        {
            title: 'Properties Contacted',
            count: counts.contacted || 0,
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            color: 'green',
            type: 'contacted'
        },
        {
            title: 'Searches Performed',
            count: counts.search || 0,
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            color: 'purple',
            type: 'search'
        },
    ];

    // Render property details
    const renderPropertyDetails = (item, type) => {
        if (type === 'viewed' || type === 'contacted') {
            const details = item.propertyDetails;

            if (!details) {
                return (
                    <div>
                        <p className="text-sm font-medium">Property: {item.propertyId}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.timestamp || item.savedAt)}</p>
                    </div>
                );
            }

            return (
                <div>
                    <div className="flex items-center">
                        <p className="text-sm font-medium">{details.post_title || `Property ${item.propertyId}`}</p>
                        {details.price && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5">
                                {formatCurrency(details.price)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                        {details.bedrooms && <span>{details.bedrooms} BHK</span>}
                        {details.area && <span>• {details.area} sq.ft</span>}
                        {(details.locality || details.city) && (
                            <span>• {details.locality || ''}{details.locality && details.city ? ', ' : ''}{details.city || ''}</span>
                        )}
                    </div>
                    {(details.building?.name || details.project?.name) && (
                        <div className="text-xs text-gray-500">
                            {details.building?.name && <span>Building: {details.building.name}</span>}
                            {details.building?.name && details.project?.name && <span> • </span>}
                            {details.project?.name && <span>Project: {details.project.name}</span>}
                        </div>
                    )}
                </div>
            );
        } else if (type === 'liked') {
            const details = item.entityDetails;
            const entityType = item.entityType || 'property';

            if (!details) {
                return (
                    <div>
                        <p className="text-sm font-medium">{entityType}: {item.propertyId}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.savedAt)}</p>
                    </div>
                );
            }

            if (entityType === 'building') {
                return (
                    <div>
                        <div className="flex items-center">
                            <p className="text-sm font-medium">{details.name || `Building ${item.propertyId}`}</p>
                            <span className="ml-2 text-xs bg-purple-100 text-purple-800 rounded px-1.5 py-0.5">
                                Building
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {details.address || 'No address available'}
                            {details.totalProperties && ` • ${details.totalProperties} properties`}
                        </p>
                    </div>
                );
            } else if (entityType === 'project') {
                return (
                    <div>
                        <div className="flex items-center">
                            <p className="text-sm font-medium">{details.name || `Project ${item.propertyId}`}</p>
                            <span className="ml-2 text-xs bg-green-100 text-green-800 rounded px-1.5 py-0.5">
                                Project
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {details.location?.address || 'No address available'}
                        </p>
                    </div>
                );
            } else { // Default to property
                return (
                    <div>
                        <div className="flex items-center">
                            <p className="text-sm font-medium">{details.post_title || `Property ${item.propertyId}`}</p>
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5">
                                {details.price ? formatCurrency(details.price) : 'Property'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                            {details.bedrooms && <span>{details.bedrooms} BHK</span>}
                            {details.area && <span>• {details.area} sq.ft</span>}
                            {(details.locality || details.city) && (
                                <span>• {details.locality || ''}{details.locality && details.city ? ', ' : ''}{details.city || ''}</span>
                            )}
                        </div>
                    </div>
                );
            }
        } else {
            // Search history
            return (
                <div>
                    <p className="text-sm font-medium">{item.query || 'No query'}</p>
                    <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                </div>
            );
        }
    };

    // Render recent activity items
    const renderRecentItems = (type, data) => {
        if (!data || data.length === 0) {
            return (
                <div className="py-4 text-center text-gray-500">
                    No recent {type} activity
                </div>
            );
        }

        switch (type) {
            case 'viewed':
                return data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                            {renderPropertyDetails(item, 'viewed')}
                        </div>
                        {item.timeSpent && (
                            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 whitespace-nowrap">
                                {item.timeSpent}s
                            </span>
                        )}
                    </div>
                ));
            case 'liked':
                return data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                            {renderPropertyDetails(item, 'liked')}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(item.savedAt)}
                        </span>
                    </div>
                ));
            case 'contacted':
                return data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                            {renderPropertyDetails(item, 'contacted')}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`text-xs rounded-full px-2 py-1 whitespace-nowrap ${item.contactType === 'CALL' ? 'bg-blue-100 text-blue-800' :
                                    item.contactType === 'WHATSAPP' ? 'bg-green-100 text-green-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {item.contactType}
                            </span>
                            <span className={`text-xs rounded-full px-2 py-1 whitespace-nowrap ${['CONNECTED', 'Viewed', 'Scheduled', 'Visited', 'Negotiating', 'Closed'].includes(item.status)
                                    ? 'bg-green-100 text-green-800'
                                    : ['FAILED', 'NO_RESPONSE'].includes(item.status)
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ));
            case 'search':
                return data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                            <p className="text-sm font-medium">{item.query || 'No query'}</p>
                            <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1 whitespace-nowrap">
                            {item.resultCount || 0} results
                        </span>
                    </div>
                ));
            default:
                return (
                    <div className="py-4 text-center text-gray-500">
                        No data available
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card) => (
                    <div
                        key={card.title}
                        className={`bg-white rounded-lg shadow overflow-hidden border-t-4 ${card.color === 'indigo' ? 'border-indigo-500' :
                                card.color === 'pink' ? 'border-pink-500' :
                                    card.color === 'green' ? 'border-green-500' :
                                        'border-purple-500'
                            }`}
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 ${card.color === 'indigo' ? 'bg-indigo-100' :
                                        card.color === 'pink' ? 'bg-pink-100' :
                                            card.color === 'green' ? 'bg-green-100' :
                                                'bg-purple-100'
                                    }`}>
                                    {card.icon}
                                </div>
                                <div className="ml-5">
                                    <p className="text-gray-500 text-sm">{card.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
                                </div>
                            </div>
                        </div>
                        <div className={`px-5 py-2 border-t ${card.color === 'indigo' ? 'bg-indigo-50' :
                                card.color === 'pink' ? 'bg-pink-50' :
                                    card.color === 'green' ? 'bg-green-50' :
                                        'bg-purple-50'
                            }`}>
                            <Link to={`?type=${card.type}`} className={`text-sm font-medium hover:underline ${card.color === 'indigo' ? 'text-indigo-600 hover:text-indigo-800' :
                                    card.color === 'pink' ? 'text-pink-600 hover:text-pink-800' :
                                        card.color === 'green' ? 'text-green-600 hover:text-green-800' :
                                            'text-purple-600 hover:text-purple-800'
                                }`}>
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Viewed */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-indigo-500 px-4 py-2">
                        <h3 className="text-white font-medium">Recently Viewed Properties</h3>
                    </div>
                    <div className="p-4">
                        {renderRecentItems('viewed', recent.viewed)}
                    </div>
                    <div className="bg-indigo-50 px-4 py-2 border-t">
                        <Link to="?type=viewed" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                            View All Viewed Properties →
                        </Link>
                    </div>
                </div>

                {/* Recent Liked */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-pink-500 px-4 py-2">
                        <h3 className="text-white font-medium">Recently Liked Properties</h3>
                    </div>
                    <div className="p-4">
                        {renderRecentItems('liked', recent.liked)}
                    </div>
                    <div className="bg-pink-50 px-4 py-2 border-t">
                        <Link to="?type=liked" className="text-pink-600 text-sm font-medium hover:text-pink-800">
                            View All Liked Properties →
                        </Link>
                    </div>
                </div>

                {/* Recent Contacted */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-green-500 px-4 py-2">
                        <h3 className="text-white font-medium">Recently Contacted Properties</h3>
                    </div>
                    <div className="p-4">
                        {renderRecentItems('contacted', recent.contacted)}
                    </div>
                    <div className="bg-green-50 px-4 py-2 border-t">
                        <Link to="?type=contacted" className="text-green-600 text-sm font-medium hover:text-green-800">
                            View All Contacted Properties →
                        </Link>
                    </div>
                </div>

                {/* Recent Searches */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-purple-500 px-4 py-2">
                        <h3 className="text-white font-medium">Recent Search Queries</h3>
                    </div>
                    <div className="p-4">
                        {renderRecentItems('search', recent.search)}
                    </div>
                    <div className="bg-purple-50 px-4 py-2 border-t">
                        <Link to="?type=search" className="text-purple-600 text-sm font-medium hover:text-purple-800">
                            View All Search History →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHistoryStats;