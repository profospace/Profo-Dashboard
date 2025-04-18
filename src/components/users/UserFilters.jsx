// src/components/users/UserFilters.jsx
import React, { useState } from 'react';
import Button from '../common/Button';

const UserFilters = ({ onApplyFilters, onResetFilters }) => {
    const [filters, setFilters] = useState({
        loginType: [],
        verificationStatus: {
            email: null,
            phone: null,
            government: null,
        },
        activityStatus: '',
        dateRange: {
            start: '',
            end: '',
        },
    });

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const handleLoginTypeChange = (type) => {
        setFilters((prev) => {
            const loginType = [...prev.loginType];

            if (loginType.includes(type)) {
                // Remove if already selected
                return {
                    ...prev,
                    loginType: loginType.filter((t) => t !== type),
                };
            } else {
                // Add if not selected
                return {
                    ...prev,
                    loginType: [...loginType, type],
                };
            }
        });
    };

    const handleVerificationChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            verificationStatus: {
                ...prev.verificationStatus,
                [field]: value,
            },
        }));
    };

    const handleActivityStatusChange = (status) => {
        setFilters((prev) => ({
            ...prev,
            activityStatus: prev.activityStatus === status ? '' : status,
        }));
    };

    const handleDateChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value,
            },
        }));
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
    };

    const handleResetFilters = () => {
        setFilters({
            loginType: [],
            verificationStatus: {
                email: null,
                phone: null,
                government: null,
            },
            activityStatus: '',
            dateRange: {
                start: '',
                end: '',
            },
        });

        onResetFilters();
    };

    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Filters</h3>
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                    {isFiltersOpen ? 'Collapse Filters' : 'Expand Filters'}
                </button>
            </div>

            {isFiltersOpen && (
                <div className="p-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Login Type */}
                        <div>
                            <h4 className="font-medium mb-2">Login Type</h4>
                            <div className="space-y-2">
                                {['EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'PHONE'].map((type) => (
                                    <label key={type} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.loginType.includes(type)}
                                            onChange={() => handleLoginTypeChange(type)}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div>
                            <h4 className="font-medium mb-2">Verification Status</h4>
                            <div className="space-y-3">
                                {['email', 'phone', 'government'].map((field) => (
                                    <div key={field} className="space-y-1">
                                        <label className="block text-sm text-gray-700 capitalize">
                                            {field}
                                        </label>
                                        <div className="flex space-x-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`verification-${field}`}
                                                    checked={filters.verificationStatus[field] === true}
                                                    onChange={() => handleVerificationChange(field, true)}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">Verified</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`verification-${field}`}
                                                    checked={filters.verificationStatus[field] === false}
                                                    onChange={() => handleVerificationChange(field, false)}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">Not Verified</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`verification-${field}`}
                                                    checked={filters.verificationStatus[field] === null}
                                                    onChange={() => handleVerificationChange(field, null)}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">Any</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity Status */}
                        <div>
                            <h4 className="font-medium mb-2">Activity Status</h4>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="activity"
                                        checked={filters.activityStatus === 'active'}
                                        onChange={() => handleActivityStatusChange('active')}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Active (Last 30 days)</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="activity"
                                        checked={filters.activityStatus === 'inactive'}
                                        onChange={() => handleActivityStatusChange('inactive')}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Inactive</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="activity"
                                        checked={filters.activityStatus === ''}
                                        onChange={() => handleActivityStatusChange('')}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Any</span>
                                </label>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <h4 className="font-medium mb-2">Registration Date</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-700">From</label>
                                    <input
                                        type="date"
                                        value={filters.dateRange.start}
                                        onChange={(e) => handleDateChange('start', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">To</label>
                                    <input
                                        type="date"
                                        value={filters.dateRange.end}
                                        onChange={(e) => handleDateChange('end', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <Button variant="secondary" onClick={handleResetFilters}>
                            Reset Filters
                        </Button>
                        <Button onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFilters;