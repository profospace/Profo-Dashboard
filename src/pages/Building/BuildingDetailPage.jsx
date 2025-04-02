import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBuildingById, deleteBuilding } from '../../../utils/Building/api';

const BuildingDetailPage = () => {
    const { buildingId } = useParams();
    const navigate = useNavigate();

    const [building, setBuilding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        const fetchBuilding = async () => {
            setIsLoading(true);
            try {
                const data = await getBuildingById(buildingId);
                setBuilding(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching building:', err);
                setError('Failed to load building details. Please try again.');
                setBuilding(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuilding();
    }, [buildingId]);

    useEffect(() => {
        // Initialize Google Map if building data is available and has location
        if (building && building.location?.coordinates && window.google && !mapLoaded) {
            const [lng, lat] = building.location.coordinates;
            initializeMap(lat, lng);
            setMapLoaded(true);
        }
    }, [building, mapLoaded]);

    const initializeMap = (lat, lng) => {
        const mapElement = document.getElementById('buildingLocationMap');
        if (!mapElement) return;

        const location = { lat, lng };
        const map = new window.google.maps.Map(mapElement, {
            center: location,
            zoom: 16,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        });

        // Add marker for building location
        new window.google.maps.Marker({
            position: location,
            map: map,
            title: building.name || 'Building Location'
        });
    };

    const handleDelete = async () => {
        if (showConfirmDelete) {
            try {
                await deleteBuilding(building._id);
                alert('Building deleted successfully');
                navigate('/buildings');
            } catch (err) {
                console.error('Error deleting building:', err);
                alert('Failed to delete building');
            }
        } else {
            setShowConfirmDelete(true);
        }
    };

    const cancelDelete = () => {
        setShowConfirmDelete(false);
    };

    const statusColors = {
        'Ready': 'bg-green-100 text-green-800',
        'Under Construction': 'bg-yellow-100 text-yellow-800',
        'Upcoming': 'bg-blue-100 text-blue-800',
        'DEFAULT': 'bg-gray-100 text-gray-800'
    };

    const getStatusClass = (status) => {
        return statusColors[status] || statusColors['DEFAULT'];
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-700">Loading building details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/buildings')}
                                    className="text-sm font-medium text-red-700 hover:text-red-600"
                                >
                                    Go back to buildings list
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!building) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Building not found</h3>
                    <p className="mt-1 text-sm text-gray-500">The building you're looking for might have been removed or doesn't exist.</p>
                    <div className="mt-6">
                        <Link
                            to="/buildings"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Go back to buildings list
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{building.name || 'Building Details'}</h1>
                    <p className="mt-1 text-sm text-gray-500">ID: {building.buildingId}</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <Link
                        to={`/buildings/edit/${buildingId}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </Link>

                    {showConfirmDelete ? (
                        <>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Confirm Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Gallery */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
                            {building.galleryList && building.galleryList.length > 0 ? (
                                <img
                                    src={building.galleryList[activeImageIndex]}
                                    alt={`Building image ${activeImageIndex + 1}`}
                                    className="absolute h-full w-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-gray-500 mt-2">No images available</p>
                                </div>
                            )}

                            {building.galleryList && building.galleryList.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? building.galleryList.length - 1 : prev - 1))}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                                    >
                                        <svg className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex((prev) => (prev === building.galleryList.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                                    >
                                        <svg className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {building.galleryList && building.galleryList.length > 0 && (
                            <div className="p-4 overflow-x-auto">
                                <div className="flex space-x-2">
                                    {building.galleryList.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`relative flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                        <p className="text-gray-700">
                            {building.description || 'No description available for this building.'}
                        </p>
                    </div>

                    {/* Location Map */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

                        {building.location?.coordinates ? (
                            <>
                                <div id="buildingLocationMap" className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                                {building.mapLink && (
                                    <a
                                        href={building.mapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                                    >
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View on Google Maps
                                    </a>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">No location data available for this building.</p>
                        )}
                    </div>

                    {/* Flats Details */}
                    {building.flatsDetails && building.flatsDetails.length > 0 && (
                        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Flats Details</h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Floor
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Flats
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Available Flats
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Occupancy Rate
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {building.flatsDetails.map((floor) => {
                                            const occupancyRate = floor.flatsOnFloor > 0
                                                ? Math.round(((floor.flatsOnFloor - floor.availableFlats) / floor.flatsOnFloor) * 100)
                                                : 0;

                                            return (
                                                <tr key={floor.floorNumber}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        Floor {floor.floorNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {floor.flatsOnFloor}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {floor.availableFlats}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                                                <div
                                                                    className={`h-2.5 rounded-full ${occupancyRate > 80 ? 'bg-green-600' : occupancyRate > 50 ? 'bg-yellow-400' : 'bg-red-400'
                                                                        }`}
                                                                    style={{ width: `${occupancyRate}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="ml-2">{occupancyRate}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Building Details */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
                        <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(building.developmentStatus)}`}>
                                {building.developmentStatus || 'Not specified'}
                            </span>

                            {building.allowPreBooking && (
                                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Pre-booking Available
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Building Details Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Building Details</h2>
                        <dl className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Owner</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.ownerName || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Owner ID</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.ownerId || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Type</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.type || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Storeys</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.storey || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Age</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.age || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Front Road</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.frontRoad || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Parking Area</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.parkingArea || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">LUDA</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.luda || 'Not specified'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Area USP</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.areaUSP || 'Not specified'}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Properties Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Properties</h2>
                        <dl className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Total</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.totalProperties || '0'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Allocated</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.allocatedProperties || '0'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Free</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.freeProperties || '0'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Flats Available</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.numberOfFlatsAvailable || '0'}</dd>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Total Floors</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{building.totalFloors || '0'}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Contact</h2>

                        {building.contactNumber ? (
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href={`tel:${building.contactNumber}`} className="text-blue-600 hover:text-blue-800">
                                    {building.contactNumber}
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-500">No contact information available.</p>
                        )}

                        {building.brochureLink && (
                            <div className="mt-3 flex items-center">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <a
                                    href={building.brochureLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Download Brochure
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildingDetailPage;