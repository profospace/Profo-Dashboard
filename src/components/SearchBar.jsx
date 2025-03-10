import React, { useState } from 'react';

const SearchBar = ({ filters, onSearch }) => {
    // Local state to track input values before submitting search
    const [inputValues, setInputValues] = useState({
        name: filters.name || '',
        email: filters.email || '',
        phone: filters.phone || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSubmit = (field) => {
        onSearch(field, inputValues[field]);
    };

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            handleSubmit(field);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 mb-6">
            {/* Name Search */}
            <div className="relative flex-1 min-w-0">
                <input
                    type="text"
                    name="name"
                    value={inputValues.name}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleKeyPress(e, 'name')}
                    placeholder="Search by name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                    onClick={() => handleSubmit('name')}
                    className="absolute inset-y-0 right-0 flex items-center px-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            {/* Email Search */}
            <div className="relative flex-1 min-w-0">
                <input
                    type="text"
                    name="email"
                    value={inputValues.email}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleKeyPress(e, 'email')}
                    placeholder="Search by email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                    onClick={() => handleSubmit('email')}
                    className="absolute inset-y-0 right-0 flex items-center px-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            {/* Phone Search */}
            <div className="relative flex-1 min-w-0">
                <input
                    type="text"
                    name="phone"
                    value={inputValues.phone}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleKeyPress(e, 'phone')}
                    placeholder="Search by phone"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                    onClick={() => handleSubmit('phone')}
                    className="absolute inset-y-0 right-0 flex items-center px-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;