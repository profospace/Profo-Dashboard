import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        let rangeStart = Math.max(2, currentPage - 1);
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis if needed before range
        if (rangeStart > 2) {
            pages.push('...');
        }

        // Add pages in range
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed after range
        if (rangeEnd < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    // If only 1 page, don't show pagination
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex items-center justify-center">
            <ul className="flex space-x-1">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
              ${currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                    >
                        Previous
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => (
                    <li key={index}>
                        {page === '...' ? (
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                ...
                            </span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${currentPage === page
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
              ${currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;