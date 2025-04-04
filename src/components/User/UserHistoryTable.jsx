// import React from 'react';

// const UserHistoryTable = ({ historyType, historyData, onSort, currentSort }) => {
//     const handleSort = (sortBy) => {
//         const sortOrder = currentSort.sortBy === sortBy && currentSort.sortOrder === 'asc' ? 'desc' : 'asc';
//         onSort(sortBy, sortOrder);
//     };

//     const renderSortIcon = (column) => {
//         if (currentSort.sortBy !== column) return null;
//         return currentSort.sortOrder === 'asc'
//             ? <span className="ml-1">↑</span>
//             : <span className="ml-1">↓</span>;
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const date = new Date(dateString);
//         return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     // Render table headers based on history type
//     const renderHeaders = () => {
//         switch (historyType) {
//             case 'viewed':
//                 return (
//                     <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
//                         <th onClick={() => handleSort('propertyId')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
//                             Property ID {renderSortIcon('propertyId')}
//                         </th>
//                         <th onClick={() => handleSort('timestamp')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
//                             Viewed On {renderSortIcon('timestamp')}
//                         </th>
//                         <th onClick={() => handleSort('timeSpent')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
//                             Time Spent (sec) {renderSortIcon('timeSpent')}
//                         </th>
//                     </tr>
//                 );
//             case 'liked':
//                 return (
//                     <tr className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
//                         <th onClick={() => handleSort('propertyId')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-pink-600">
//                             Property ID {renderSortIcon('propertyId')}
//                         </th>
//                         <th onClick={() => handleSort('entityType')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-pink-600">
//                             Entity Type {renderSortIcon('entityType')}
//                         </th>
//                         <th onClick={() => handleSort('savedAt')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-pink-600">
//                             Saved On {renderSortIcon('savedAt')}
//                         </th>
//                     </tr>
//                 );
//             case 'contacted':
//                 return (
//                     <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
//                         <th onClick={() => handleSort('propertyId')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
//                             Property ID {renderSortIcon('propertyId')}
//                         </th>
//                         <th onClick={() => handleSort('contactType')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
//                             Contact Type {renderSortIcon('contactType')}
//                         </th>
//                         <th onClick={() => handleSort('timestamp')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
//                             Contact Time {renderSortIcon('timestamp')}
//                         </th>
//                         <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
//                             Status {renderSortIcon('status')}
//                         </th>
//                         <th onClick={() => handleSort('duration')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
//                             Duration (sec) {renderSortIcon('duration')}
//                         </th>
//                     </tr>
//                 );
//             case 'search':
//                 return (
//                     <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
//                         <th onClick={() => handleSort('query')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-purple-600">
//                             Search Query {renderSortIcon('query')}
//                         </th>
//                         <th onClick={() => handleSort('resultCount')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-purple-600">
//                             Result Count {renderSortIcon('resultCount')}
//                         </th>
//                         <th onClick={() => handleSort('timestamp')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-purple-600">
//                             Search Time {renderSortIcon('timestamp')}
//                         </th>
//                     </tr>
//                 );
//             default:
//                 return (
//                     <tr className="bg-gray-500 text-white">
//                         <th className="px-6 py-3 text-left text-sm font-medium">
//                             No data available
//                         </th>
//                     </tr>
//                 );
//         }
//     };

//     // Render table rows based on history type
//     const renderRows = () => {
//         if (!historyData || historyData.length === 0) {
//             return (
//                 <tr>
//                     <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                         No history data available
//                     </td>
//                 </tr>
//             );
//         }

//         switch (historyType) {
//             case 'viewed':
//                 return historyData.map((item) => (
//                     <tr key={item._id || item.timestamp} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {item.propertyId}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {formatDate(item.timestamp)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item.timeSpent || 'N/A'}
//                         </td>
//                     </tr>
//                 ));
//             case 'liked':
//                 return historyData.map((item) => (
//                     <tr key={item._id || item.savedAt} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {item.propertyId}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.entityType === 'property' ? 'bg-blue-100 text-blue-800' :
//                                     item.entityType === 'project' ? 'bg-green-100 text-green-800' :
//                                         'bg-purple-100 text-purple-800'
//                                 }`}>
//                                 {item.entityType || 'property'}
//                             </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {formatDate(item.savedAt)}
//                         </td>
//                     </tr>
//                 ));
//             case 'contacted':
//                 return historyData.map((item) => (
//                     <tr key={item._id || item.timestamp} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {item.propertyId}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.contactType === 'CALL' ? 'bg-blue-100 text-blue-800' :
//                                     item.contactType === 'WHATSAPP' ? 'bg-green-100 text-green-800' :
//                                         'bg-yellow-100 text-yellow-800'
//                                 }`}>
//                                 {item.contactType}
//                             </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {formatDate(item.timestamp)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${['CONNECTED', 'Viewed', 'Scheduled', 'Visited', 'Negotiating', 'Closed'].includes(item.status)
//                                     ? 'bg-green-100 text-green-800'
//                                     : ['FAILED', 'NO_RESPONSE'].includes(item.status)
//                                         ? 'bg-red-100 text-red-800'
//                                         : 'bg-yellow-100 text-yellow-800'
//                                 }`}>
//                                 {item.status}
//                             </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item.duration || 'N/A'}
//                         </td>
//                     </tr>
//                 ));
//             case 'search':
//                 return historyData.map((item) => (
//                     <tr key={item._id || item.timestamp} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {item.query || 'No query'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item.resultCount || '0'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {formatDate(item.timestamp)}
//                         </td>
//                     </tr>
//                 ));
//             default:
//                 return (
//                     <tr>
//                         <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                             No history data available
//                         </td>
//                     </tr>
//                 );
//         }
//     };

//     return (
//         <div className="overflow-x-auto rounded-lg shadow">
//             <table className="min-w-full bg-white">
//                 <thead>
//                     {renderHeaders()}
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                     {renderRows()}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default UserHistoryTable;

import React from 'react';

const UserHistoryTable = ({ historyType, historyData, onSort, currentSort }) => {
    const handleSort = (sortBy) => {
        const sortOrder = currentSort.sortBy === sortBy && currentSort.sortOrder === 'asc' ? 'desc' : 'asc';
        onSort(sortBy, sortOrder);
    };

    const renderSortIcon = (column) => {
        if (currentSort.sortBy !== column) return null;
        return currentSort.sortOrder === 'asc'
            ? <span className="ml-1">↑</span>
            : <span className="ml-1">↓</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Render table headers based on history type
    const renderHeaders = () => {
        switch (historyType) {
            case 'viewed':
                return (
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <th onClick={() => handleSort('propertyId')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Property ID {renderSortIcon('propertyId')}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium">
                            Property Details
                        </th>
                        <th onClick={() => handleSort('timestamp')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Viewed On {renderSortIcon('timestamp')}
                        </th>
                        <th onClick={() => handleSort('timeSpent')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Time Spent (sec) {renderSortIcon('timeSpent')}
                        </th>
                    </tr>
                );
            case 'liked':
                return (
                    <tr className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
                        <th onClick={() => handleSort('propertyId')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-pink-600">
                            Entity ID {renderSortIcon('propertyId')}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium">
                            Entity Details
                        </th>
                        <th onClick={() => handleSort('entityType')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-pink-600">
                            Entity Type {renderSortIcon('entityType')}
                        </th>
                        <th onClick={() => handleSort('savedAt')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-pink-600">
                            Saved On {renderSortIcon('savedAt')}
                        </th>
                    </tr>
                );
            case 'contacted':
                return (
                    <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        <th onClick={() => handleSort('propertyId')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
                            Property ID {renderSortIcon('propertyId')}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium">
                            Property Details
                        </th>
                        <th onClick={() => handleSort('contactType')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
                            Contact Type {renderSortIcon('contactType')}
                        </th>
                        <th onClick={() => handleSort('timestamp')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
                            Contact Time {renderSortIcon('timestamp')}
                        </th>
                        <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
                            Status {renderSortIcon('status')}
                        </th>
                        <th onClick={() => handleSort('duration')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-green-600">
                            Duration (sec) {renderSortIcon('duration')}
                        </th>
                    </tr>
                );
            case 'search':
                return (
                    <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                        <th onClick={() => handleSort('query')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-purple-600">
                            Search Query {renderSortIcon('query')}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium">
                            Filters
                        </th>
                        <th onClick={() => handleSort('resultCount')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-purple-600">
                            Result Count {renderSortIcon('resultCount')}
                        </th>
                        <th onClick={() => handleSort('timestamp')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-purple-600">
                            Search Time {renderSortIcon('timestamp')}
                        </th>
                    </tr>
                );
            default:
                return (
                    <tr className="bg-gray-500 text-white">
                        <th className="px-6 py-3 text-left text-sm font-medium">
                            No data available
                        </th>
                    </tr>
                );
        }
    };

    // Render property/entity details
    const renderPropertyDetails = (item) => {
        const details = historyType === 'liked' ? item.entityDetails : item.propertyDetails;

        if (!details) {
            return <span className="text-gray-500 italic">No details available</span>;
        }

        // For liked items, entity details depend on the type
        if (historyType === 'liked') {
            const entityType = item.entityType || 'property';

            if (entityType === 'building' && details) {
                return (
                    <div>
                        <p className="font-medium">{details.name || 'Unnamed Building'}</p>
                        <p className="text-xs text-gray-500">
                            {details.address && <span>{details.address}</span>}
                            {details.totalProperties && <span> • {details.totalProperties} properties</span>}
                        </p>
                    </div>
                );
            } else if (entityType === 'project' && details) {
                return (
                    <div>
                        <p className="font-medium">{details.name || 'Unnamed Project'}</p>
                        <p className="text-xs text-gray-500">
                            {details.location?.address && <span>{details.location.address}</span>}
                        </p>
                    </div>
                );
            }
        }

        // Default property details display (for property types or viewed/contacted)
        return (
            <div>
                <p className="font-medium">{details.post_title || 'Unnamed Property'}</p>
                <div className="text-xs text-gray-500 flex flex-wrap gap-x-2">
                    <span>{details.bedrooms || '0'} BHK</span>
                    {details.area && <span>• {details.area} sq.ft</span>}
                    {details.price && <span>• {formatCurrency(details.price)}</span>}
                </div>
                <div className="text-xs text-gray-500">
                    {details.address || `${details.locality || ''}, ${details.city || ''}`}
                    {details.building?.name && <span> • {details.building.name}</span>}
                    {details.project?.name && <span> • {details.project.name}</span>}
                </div>
            </div>
        );
    };

    // Render filters for search history
    const renderSearchFilters = (filters) => {
        if (!filters || Object.keys(filters).length === 0) {
            return <span className="text-gray-500 italic">No filters applied</span>;
        }

        // Extract key filters to display
        const keyFilters = [];

        if (filters.propertyType) {
            keyFilters.push(`Type: ${Array.isArray(filters.propertyType) ? filters.propertyType.join(', ') : filters.propertyType}`);
        }

        if (filters.bedrooms) {
            keyFilters.push(`BHK: ${Array.isArray(filters.bedrooms) ? filters.bedrooms.join(', ') : filters.bedrooms}`);
        }

        if (filters.priceMin || filters.priceMax) {
            const priceRange = `Price: ${filters.priceMin || 0} - ${filters.priceMax || '∞'}`;
            keyFilters.push(priceRange);
        }

        if (filters.location || filters.city) {
            keyFilters.push(`Location: ${filters.location || filters.city || ''}`);
        }

        return (
            <div className="text-sm">
                {keyFilters.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {keyFilters.map((filter, index) => (
                            <li key={index} className="text-xs">{filter}</li>
                        ))}
                    </ul>
                ) : (
                    <span className="text-gray-500 italic">Basic search</span>
                )}
            </div>
        );
    };

    // Render table rows based on history type
    const renderRows = () => {
        if (!historyData || historyData.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No history data available
                    </td>
                </tr>
            );
        }

        switch (historyType) {
            case 'viewed':
                return historyData?.map((item) => (
                    <tr key={item._id || item.timestamp} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.propertyId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                            {renderPropertyDetails(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.timeSpent || 'N/A'}
                        </td>
                    </tr>
                ));
            case 'liked':
                return historyData?.map((item) => (
                    <tr key={item._id || item.savedAt} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.propertyId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                            {renderPropertyDetails(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.entityType === 'property' ? 'bg-blue-100 text-blue-800' :
                                    item.entityType === 'project' ? 'bg-green-100 text-green-800' :
                                        item.entityType === 'building' ? 'bg-purple-100 text-purple-800' :
                                            'bg-blue-100 text-blue-800'
                                }`}>
                                {item.entityType || 'property'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.savedAt)}
                        </td>
                    </tr>
                ));
            case 'contacted':
                return historyData?.map((item) => (
                    <tr key={item._id || item.timestamp} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.propertyId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                            {renderPropertyDetails(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.contactType === 'CALL' ? 'bg-blue-100 text-blue-800' :
                                    item.contactType === 'WHATSAPP' ? 'bg-green-100 text-green-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {item.contactType}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${['CONNECTED', 'Viewed', 'Scheduled', 'Visited', 'Negotiating', 'Closed'].includes(item.status)
                                    ? 'bg-green-100 text-green-800'
                                    : ['FAILED', 'NO_RESPONSE'].includes(item.status)
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {item.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.duration || 'N/A'}
                        </td>
                    </tr>
                ));
            case 'search':
                return historyData?.map((item) => (
                    <tr key={item._id || item.timestamp} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.query || 'No query'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            {renderSearchFilters(item.filters)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.resultCount || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.timestamp)}
                        </td>
                    </tr>
                ));
            default:
                return (
                    <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                            No history data available
                        </td>
                    </tr>
                );
        }
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
                <thead>
                    {renderHeaders()}
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {renderRows()}
                </tbody>
            </table>
        </div>
    );
};

export default UserHistoryTable;