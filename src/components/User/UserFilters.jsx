import React, { useState } from 'react';

const UserFilters = ({ filters, onSubmit }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Basic filters */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={localFilters.name}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={localFilters.email}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by email"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={localFilters.phone}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by phone"
                        />
                    </div>
                </div>

                {/* Advanced filters toggle */}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        {isAdvancedOpen ? (
                            <>
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Hide Advanced Filters
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Show Advanced Filters
                            </>
                        )}
                    </button>
                </div>

                {/* Advanced filters */}
                {isAdvancedOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="loginType" className="block text-sm font-medium text-gray-700 mb-1">
                                Login Type
                            </label>
                            <select
                                id="loginType"
                                name="loginType"
                                value={localFilters.loginType}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">All</option>
                                <option value="EMAIL">Email</option>
                                <option value="GOOGLE">Google</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="APPLE">Apple</option>
                                <option value="PHONE">Phone</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="isPhoneVerified" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Verified
                            </label>
                            <select
                                id="isPhoneVerified"
                                name="isPhoneVerified"
                                value={localFilters.isPhoneVerified}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">All</option>
                                <option value="true">Verified</option>
                                <option value="false">Not Verified</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="createdAfter" className="block text-sm font-medium text-gray-700 mb-1">
                                Created After
                            </label>
                            <input
                                type="date"
                                id="createdAfter"
                                name="createdAfter"
                                value={localFilters.createdAfter}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="createdBefore" className="block text-sm font-medium text-gray-700 mb-1">
                                Created Before
                            </label>
                            <input
                                type="date"
                                id="createdBefore"
                                name="createdBefore"
                                value={localFilters.createdBefore}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastLoginAfter" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Login After
                            </label>
                            <input
                                type="date"
                                id="lastLoginAfter"
                                name="lastLoginAfter"
                                value={localFilters.lastLoginAfter}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastLoginBefore" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Login Before
                            </label>
                            <input
                                type="date"
                                id="lastLoginBefore"
                                name="lastLoginBefore"
                                value={localFilters.lastLoginBefore}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                )}

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

export default UserFilters;