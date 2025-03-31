import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Copy, RefreshCw, Calendar, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { base_url } from "../../utils/base_url";

const AwsS3ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const fileInputRef = useRef(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [imagesPerPage, setImagesPerPage] = useState(12);

    // Filtering state
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Sorting state
    const [sortBy, setSortBy] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

    useEffect(() => {
        // Filter and sort images whenever dependencies change
        filterAndSortImages();
    }, [images, searchTerm, startDate, endDate, sortBy, sortDirection]);

    const filterAndSortImages = () => {
        let result = [...images];

        // Filter by search term (filename)
        if (searchTerm) {
            result = result.filter(imgUrl => {
                const filename = imgUrl.split('/').pop().toLowerCase();
                return filename.includes(searchTerm.toLowerCase());
            });
        }

        // Filter by date range if we have image metadata with dates
        // This depends on your backend returning date information
        if (startDate || endDate) {
            // In a real implementation, you would filter based on the last-modified date
            // For now, we'll assume the images array has metadata with dates
            // This would need to be implemented in your backend
        }

        // Sort images
        result.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = a.split('/').pop().toLowerCase();
                const nameB = b.split('/').pop().toLowerCase();
                return sortDirection === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            } else if (sortBy === 'date') {
                // In a real implementation, you would sort based on the last-modified date
                // For this example, we'll use the URL as a proxy for date (which isn't accurate but shows the mechanism)
                return sortDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
            }
            return 0;
        });

        setFilteredImages(result);
    };

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${base_url}/api/list-images`);
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const data = await response.json();
            setImages(data);
            setFilteredImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            showNotification('Failed to fetch images. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file) => {
        if (!file) {
            showNotification('Please select a file to upload', 'error');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('uploadedFileName', file);

            const response = await fetch(`${base_url}/upload/imageUpload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            const imageUrl = result.response_data.Location;

            setUploadedUrl(imageUrl);
            showNotification('Image uploaded successfully!', 'success');

            // Automatically refresh the images list after upload - fixes the bug
            fetchImages();
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification(`Failed to upload image: ${error.message}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            showNotification('URL copied to clipboard!', 'success');
        } catch (err) {
            console.error('Could not copy text: ', err);
            showNotification('Failed to copy URL', 'error');
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });

        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const selectImage = (url) => {
        copyToClipboard(url);
    };

    // Pagination logic
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredImages.length / imagesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Get current images for pagination
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

    // Toggle sort direction
    const toggleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    // Load images on initial component mount
    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">AWS S3 Image Gallery</h1>

            {/* Upload Section */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload New Image</h2>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileInputChange}
                        accept="image/*"
                    />
                    <button
                        onClick={triggerFileInput}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Upload className="w-5 h-5" />
                        )}
                        {uploading ? 'Uploading...' : 'Select Image'}
                    </button>

                    {uploadedUrl && (
                        <div className="flex-1 mt-2 sm:mt-0">
                            <div className="font-medium text-sm text-gray-600 mb-1">Uploaded Image URL:</div>
                            <div className="flex items-center bg-white p-2 rounded border">
                                <span className="text-sm text-gray-800 truncate flex-1">{uploadedUrl}</span>
                                <button
                                    onClick={() => copyToClipboard(uploadedUrl)}
                                    className="ml-2 text-gray-600 hover:text-blue-500"
                                    title="Copy URL"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter and Search Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Filter & Sort</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search by filename */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by filename..."
                            className="pl-10 pr-4 py-2 w-full border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Date range filter */}
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center gap-1 border p-2 rounded-md"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="text-sm">Date Filter</span>
                            </button>

                            {(startDate || endDate) && (
                                <div className="text-xs text-gray-600">
                                    {startDate && <span>From: {startDate}</span>}
                                    {startDate && endDate && <span> - </span>}
                                    {endDate && <span>To: {endDate}</span>}
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => {
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>

                        {showDatePicker && (
                            <div className="absolute z-10 mt-1 p-4 bg-white rounded-md shadow-lg border">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full border rounded p-1 text-sm"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full border rounded p-1 text-sm"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                                        onClick={() => setShowDatePicker(false)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort options */}
                    <div className="flex gap-2">
                        <button
                            className={`flex items-center gap-1 border px-3 py-2 rounded-md ${sortBy === 'date' ? 'bg-blue-50 border-blue-200' : ''}`}
                            onClick={() => toggleSort('date')}
                        >
                            <span className="text-sm">Date</span>
                            <ArrowUpDown className="h-3 w-3 text-gray-600" />
                            {sortBy === 'date' && (
                                <span className="text-xs ml-1">
                                    {sortDirection === 'asc' ? '(Oldest)' : '(Newest)'}
                                </span>
                            )}
                        </button>
                        <button
                            className={`flex items-center gap-1 border px-3 py-2 rounded-md ${sortBy === 'name' ? 'bg-blue-50 border-blue-200' : ''}`}
                            onClick={() => toggleSort('name')}
                        >
                            <span className="text-sm">Name</span>
                            <ArrowUpDown className="h-3 w-3 text-gray-600" />
                            {sortBy === 'name' && (
                                <span className="text-xs ml-1">
                                    {sortDirection === 'asc' ? '(A-Z)' : '(Z-A)'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Existing Images Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Existing Images
                        <span className="text-sm font-normal ml-2 text-gray-500">
                            ({filteredImages.length} total)
                        </span>
                    </h2>
                    <button
                        onClick={fetchImages}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors text-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        {loading ? 'Loading...' : 'Refresh Images'}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentImages.length > 0 ? (
                                currentImages.map((imageUrl, index) => (
                                    <div key={index} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-40 overflow-hidden bg-gray-100">
                                            <img
                                                src={imageUrl}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <div className="text-xs text-gray-500 truncate mb-2">{imageUrl.split('/').pop()}</div>
                                            <div className="flex justify-between">
                                                <button
                                                    onClick={() => selectImage(imageUrl)}
                                                    className="text-xs text-gray-600 hover:text-blue-500"
                                                >
                                                    Select
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(imageUrl)}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                                                >
                                                    Copy URL
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    {filteredImages.length === 0 ? 'No images found. Click "Refresh Images" to reload or upload a new image.' : 'No images match your search criteria.'}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredImages.length > imagesPerPage && (
                            <div className="mt-6 flex justify-center items-center space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {Array.from({ length: Math.min(5, Math.ceil(filteredImages.length / imagesPerPage)) }, (_, i) => {
                                    // Show pages around current page
                                    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
                                    let pageNum;

                                    if (totalPages <= 5) {
                                        // If 5 or fewer pages, show all
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        // If near the start
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        // If near the end
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        // If in the middle
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`w-8 h-8 rounded-md ${currentPage === pageNum
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === Math.ceil(filteredImages.length / imagesPerPage)}
                                    className={`p-2 rounded-md ${currentPage === Math.ceil(filteredImages.length / imagesPerPage)
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' :
                        notification.type === 'error' ? 'bg-red-500 text-white' :
                            'bg-blue-500 text-white'
                    }`}>
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification({ ...notification, show: false })} className="text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AwsS3ImageGallery;