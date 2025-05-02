import React from 'react';

const Badge = ({ status, children }) => {
    const statusStyles = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800',
        Paused: 'bg-yellow-100 text-yellow-800',
        Failed: 'bg-red-100 text-red-800',
        Sent: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        default: 'bg-gray-100 text-gray-800'
    };

    const style = statusStyles[status] || statusStyles.default;

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
            {children || status}
        </span>
    );
};

export default Badge;