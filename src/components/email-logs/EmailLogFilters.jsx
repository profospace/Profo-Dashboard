import React from 'react';
import { FiFilter } from 'react-icons/fi';

const EmailLogFilters = ({ currentFilter, onFilterChange }) => {
    const filterOptions = [
        { value: '', label: 'All statuses' },
        { value: 'sent', label: 'Sent' },
        { value: 'opened', label: 'Opened' },
        { value: 'clicked', label: 'Clicked' },
        { value: 'failed', label: 'Failed' }
    ];

    return (
        <div className="relative">
            <select
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="appearance-none bg-white pl-10 pr-10 py-2 border border-gray-300 rounded-md text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
};

export default EmailLogFilters;