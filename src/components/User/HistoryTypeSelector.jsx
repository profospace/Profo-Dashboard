import React from 'react';

const HistoryTypeSelector = ({ activeType, onTypeChange }) => {
    const historyTypes = [
        { id: 'all', label: 'All History', icon: 'history', color: 'blue' },
        { id: 'viewed', label: 'Viewed Properties', icon: 'eye', color: 'indigo' },
        { id: 'liked', label: 'Liked Properties', icon: 'heart', color: 'pink' },
        { id: 'contacted', label: 'Contacted Properties', icon: 'phone', color: 'green' },
        { id: 'search', label: 'Search History', icon: 'search', color: 'purple' }
    ];

    // Icons for different history types
    const getIcon = (icon) => {
        switch (icon) {
            case 'history':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'eye':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                );
            case 'heart':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            case 'phone':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case 'search':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Color classes for active and inactive tabs
    const getColorClasses = (type, active, color) => {
        if (active) {
            switch (color) {
                case 'blue':
                    return 'bg-blue-600 text-white';
                case 'indigo':
                    return 'bg-indigo-600 text-white';
                case 'pink':
                    return 'bg-pink-600 text-white';
                case 'green':
                    return 'bg-green-600 text-white';
                case 'purple':
                    return 'bg-purple-600 text-white';
                default:
                    return 'bg-gray-600 text-white';
            }
        } else {
            switch (color) {
                case 'blue':
                    return 'text-blue-600 hover:bg-blue-50';
                case 'indigo':
                    return 'text-indigo-600 hover:bg-indigo-50';
                case 'pink':
                    return 'text-pink-600 hover:bg-pink-50';
                case 'green':
                    return 'text-green-600 hover:bg-green-50';
                case 'purple':
                    return 'text-purple-600 hover:bg-purple-50';
                default:
                    return 'text-gray-600 hover:bg-gray-50';
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="sm:hidden">
                <select
                    id="historyTypesMobile"
                    value={activeType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                    {historyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                <nav className="flex space-x-4" aria-label="History Types">
                    {historyTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onTypeChange(type.id)}
                            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${getColorClasses(type.id, activeType === type.id, type.color)
                                } transition-colors duration-150`}
                            aria-current={activeType === type.id ? 'page' : undefined}
                        >
                            <span className="mr-2">{getIcon(type.icon)}</span>
                            {type.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default HistoryTypeSelector;