import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const VisibilityToggle = ({
    listId,
    currentVisibility,
    onToggleSuccess = () => { },
    onToggleError = () => { },
    disabled = false,
    showLabel = true,
    size = 'md'
}) => {
    const [isVisible, setIsVisible] = useState(currentVisibility);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Size variants
    const sizeClasses = {
        sm: {
            toggle: 'w-8 h-5',
            thumb: 'w-3 h-3',
            translateX: 'translate-x-3',
            text: 'text-xs'
        },
        md: {
            toggle: 'w-11 h-6',
            thumb: 'w-4 h-4',
            translateX: 'translate-x-5',
            text: 'text-sm'
        },
        lg: {
            toggle: 'w-14 h-7',
            thumb: 'w-5 h-5',
            translateX: 'translate-x-7',
            text: 'text-base'
        }
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    // Update local state when currentVisibility prop changes
    useEffect(() => {
        setIsVisible(currentVisibility);
    }, [currentVisibility]);

    const toggleVisibility = async () => {
        if (!listId || isLoading || disabled) return;

        setIsLoading(true);
        setError(null);

        // Store the previous state in case we need to revert
        const previousVisibility = isVisible;

        try {
            const response = await fetch(`${base_url}/api/list-options/${listId}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Update state with the actual value from backend
                const newVisibility = data.data.visibility;
                setIsVisible(newVisibility);
                setShowSuccess(true);

                // Call the success callback with the updated data
                onToggleSuccess({
                    ...data.data,
                    visibility: newVisibility
                });

                // Hide success indicator after 2 seconds
                setTimeout(() => setShowSuccess(false), 2000);
            } else {
                // Revert to previous state on failure
                setIsVisible(previousVisibility);
                throw new Error(data.message || 'Failed to toggle visibility');
            }
        } catch (err) {
            // Revert to previous state on error
            setIsVisible(previousVisibility);

            const errorMessage = err.message || 'Network error occurred';
            setError(errorMessage);
            onToggleError(errorMessage);

            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Main Toggle Row */}
            <div className="flex items-center gap-3">
                {showLabel && (
                    <div className="flex items-center gap-2">
                        {isVisible ? (
                            <Eye className={`${currentSize.text === 'text-xs' ? 'w-3 h-3' : currentSize.text === 'text-sm' ? 'w-4 h-4' : 'w-5 h-5'} text-emerald-600`} />
                        ) : (
                            <EyeOff className={`${currentSize.text === 'text-xs' ? 'w-3 h-3' : currentSize.text === 'text-sm' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
                        )}
                        <span className={`font-medium ${currentSize.text} ${isVisible ? 'text-gray-900' : 'text-gray-500'}`}>
                            {isVisible ? 'Visible' : 'Hidden'}
                        </span>
                    </div>
                )}

                {/* Toggle Switch Container - Fixed positioning */}
                <div className="flex items-center">
                    <button
                        onClick={toggleVisibility}
                        disabled={isLoading || disabled || !listId}
                        className={`
                            relative inline-flex items-center ${currentSize.toggle} rounded-full 
                            transition-all duration-300 ease-in-out
                            focus:outline-none focus:ring-4 focus:ring-opacity-25
                            ${isVisible
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 focus:ring-emerald-500 shadow-emerald-200'
                                : 'bg-gray-300 focus:ring-gray-300 shadow-gray-100'
                            }
                            ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                            ${isVisible ? 'shadow-lg shadow-emerald-200' : 'shadow-md'}
                            transform transition-transform active:scale-95
                        `}
                        aria-label={`Toggle visibility - currently ${isVisible ? 'visible' : 'hidden'}`}
                    >
                        <span
                            className={`
                                inline-block ${currentSize.thumb} bg-white rounded-full shadow-lg 
                                transform transition-all duration-300 ease-in-out
                                flex items-center justify-center
                                ${isVisible ? currentSize.translateX : 'translate-x-0.5'}
                                ${isLoading ? 'animate-pulse' : ''}
                            `}
                        >
                            {isLoading ? (
                                <Loader2 className="w-2 h-2 animate-spin text-gray-400" />
                            ) : null}
                        </span>
                    </button>
                </div>

                {/* Status Indicators - Aligned properly */}
                <div className="flex items-center gap-1 min-h-[1rem]">
                    {showSuccess && (
                        <div className="animate-fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                        </div>
                    )}

                    {error && !showSuccess && (
                        <div className="animate-fade-in">
                            <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Loading State - Inline with toggle */}
                {isLoading && (
                    <div className="animate-fade-in flex items-center">
                        <span className={`${currentSize.text} text-gray-500 flex items-center gap-1`}>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Updating...
                        </span>
                    </div>
                )}
            </div>

            {/* Error Message - Separate row to avoid layout shift */}
            {error && (
                <div className="animate-slide-down ml-0">
                    <div className={`${currentSize.text} text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200 shadow-sm`}>
                        {error}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { 
                        opacity: 0; 
                        transform: scale(0.9); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                }
                
                @keyframes slide-down {
                    from { 
                        opacity: 0; 
                        transform: translateY(-8px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default VisibilityToggle;