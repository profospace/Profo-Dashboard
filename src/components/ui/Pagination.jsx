import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startItem}</span> to{' '}
                        <span className="font-medium">{endItem}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage <= 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${currentPage <= 1
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                            let pageNumber;

                            // Calculate which page numbers to show
                            if (totalPages <= 5) {
                                pageNumber = idx + 1;
                            } else if (currentPage <= 3) {
                                pageNumber = idx + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + idx;
                            } else {
                                pageNumber = currentPage - 2 + idx;
                            }

                            // Skip rendering if page number is out of range
                            if (pageNumber <= 0 || pageNumber > totalPages) return null;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => onPageChange(pageNumber)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNumber
                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            onClick={handleNext}
                            disabled={currentPage >= totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${currentPage >= totalPages
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>

            {/* Mobile pagination */}
            <div className="flex sm:hidden items-center justify-between w-full">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage <= 1}
                    className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${currentPage <= 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Previous
                </button>
                <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                </p>
                <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages}
                    className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${currentPage >= totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;