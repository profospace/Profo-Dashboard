import React from 'react';

const FilterSection = ({ loginType, onLoginTypeChange, onResetFilters }) => {
    return (
        <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-grow-0">
                <label htmlFor="loginType" className="block text-sm font-medium text-gray-700 mb-1">
                    Login Type
                </label>
                <select
                    id="loginType"
                    value={loginType}
                    onChange={(e) => onLoginTypeChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                    <option value="">All Login Types</option>
                    <option value="EMAIL">Email</option>
                    <option value="GOOGLE">Google</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="APPLE">Apple</option>
                    <option value="PHONE">Phone</option>
                </select>
            </div>

            <div className="flex items-end">
                <button
                    onClick={onResetFilters}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                </button>
            </div>

            {/* You can add more filters here as needed */}
        </div>
    );
};

export default FilterSection;