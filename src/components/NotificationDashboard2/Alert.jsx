import React from 'react';

export const Alert = ({ variant = 'default', title, description, className = '' }) => {
    const variantStyles = {
        default: 'bg-blue-50 border-blue-200 text-blue-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    const titleColors = {
        default: 'text-blue-800',
        error: 'text-red-800',
        success: 'text-green-800',
        warning: 'text-yellow-800'
    };

    const descriptionColors = {
        default: 'text-blue-700',
        error: 'text-red-700',
        success: 'text-green-700',
        warning: 'text-yellow-700'
    };

    return (
        <div className={`border rounded-md p-4 ${variantStyles[variant]} ${className} animate-fadeIn`} role="alert">
            {title && <div className={`font-medium ${titleColors[variant]}`}>{title}</div>}
            {description && <div className={`mt-1 text-sm ${descriptionColors[variant]}`}>{description}</div>}
        </div>
    );
};

export default Alert;