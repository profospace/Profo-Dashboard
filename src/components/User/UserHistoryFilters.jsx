import React, { useState } from 'react';

const UserHistoryFilters = ({ historyType, filters, onSubmit }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(localFilters);
    };

    const handleReset = () => {
        const resetFilters = Object.keys(localFilters).reduce(
            (acc, key) => ({ ...acc, [key]: '' }),
            {}
        );
        setLocalFilters(resetFilters);
        onSubmit(resetFilters);
    };

    // Render different filters based on history type
    const renderTypeSpecificFilters = () => {
        switch (historyType) {
            case 'viewed':
            case 'liked':
                return (
                    <div>
                        <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-1">
                            Property ID
                        </label>
                        <input
                            type="text"
                            id="propertyId"
                            name="propertyId"
                            value={localFilters.propertyId}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Filter by property ID"
                        />
                    </div>
                );
            case 'contacted':
                return (
                    <>
                        <div>
                            <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-1">
                                Property ID
                            </label>
                            <input
                                type="text"
                                id="propertyId"
                                name="propertyId"
                                value={localFilters.propertyId}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Filter by property ID"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={localFilters.status}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="INITIATED">Initiated</option>
                                <option value="CONNECTED">Connected</option>
                                <option value="FAILED">Failed</option>
                                <option value="NO_RESPONSE">No Response</option>
                                <option value="Pending">Pending</option>
                                <option value="Viewed">Viewed</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Visited">Visited</option>
                                <option value="Negotiating">Negotiating</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </>
                );
            case 'search':
                return (
                    <div>
                        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Query
                        </label>
                        <input
                            type="text"
                            id="query"
                            name="query"
                            value={localFilters.query}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Filter by search query"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Date range filters for all history types */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={localFilters.startDate}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={localFilters.endDate}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* History type specific filters */}
                    {renderTypeSpecificFilters()}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserHistoryFilters;