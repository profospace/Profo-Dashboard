import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { MapPin, Navigation, Clock, Filter, Trash2, Download, RefreshCw } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
import { base_url } from '../../../utils/base_url'

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090
};

const UserLocationHistory = ({ userId }) => {
    const [locationHistory, setLocationHistory] = useState([]);
    const [locationStats, setLocationStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [filters, setFilters] = useState({
        limit: 25,
        page: 1,
        startDate: '',
        endDate: '',
        source: ''
    });
    const [pagination, setPagination] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);


    // Fetch location history
    const fetchLocationHistory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${base_url}/api/user/${userId}/location-history`, {
                params: filters,
            });

            console.log("response", response)

            if (response.data.success) {
                setLocationHistory(response.data.data.locationHistory || []);
                setPagination(response.data.data.pagination);

                // Set map center to most recent location or current location
                if (response.data.data.currentLocation) {
                    setMapCenter({
                        lat: response.data.data.currentLocation.latitude,
                        lng: response.data.data.currentLocation.longitude
                    });
                } else if (response.data.data.locationHistory && response.data.data.locationHistory.length > 0) {
                    const firstLocation = response.data.data.locationHistory[0];
                    setMapCenter({
                        lat: firstLocation.latitude,
                        lng: firstLocation.longitude
                    });
                }
            } else {
                setError('Failed to fetch location history');
            }
        } catch (err) {
            console.error('Error fetching location history:', err);
            setError('Failed to load location history. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [userId, filters]);

    // Fetch location statistics
    const fetchLocationStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const response = await axios.get(`${base_url}/api/user/${userId}/location-stats`, {
                params: { days: 30 },
            });

            if (response.data.success) {
                setLocationStats(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching location stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchLocationHistory();
        fetchLocationStats();
    }, [fetchLocationHistory, fetchLocationStats]);

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Clear all location history
    const handleDeleteHistory = async () => {
        if (!window.confirm('Are you sure you want to delete all location history? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleteLoading(true);
            await axios.delete(`${base_url}/api/user/${userId}/location-history`, {
                params: { keepCurrent: true },
            });
            fetchLocationHistory();
            fetchLocationStats();
            alert('Location history deleted successfully');
        } catch (err) {
            console.error('Error deleting location history:', err);
            alert('Failed to delete location history');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Export location data
    const handleExportData = () => {
        const dataStr = JSON.stringify(locationHistory, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `user_${userId}_location_history_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get marker color based on source
    const getMarkerColor = (source) => {
        const colors = {
            'HOME_FEED': '#3B82F6', // Blue
            'SEARCH': '#10B981', // Green
            'MANUAL': '#F59E0B', // Yellow
            'AUTO': '#8B5CF6' // Purple
        };
        return colors[source] || '#6B7280'; // Default gray
    };

    // Create marker icon
    const createMarkerIcon = (color) => ({
        path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z',
        fillColor: color,
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 0.5,
        anchor: { x: 12, y: 12 }
    });

    // Handle marker click
    const handleMarkerClick = (location) => {
        setSelectedMarker(location);
    };

    // Handle map click (close info window)
    const handleMapClick = () => {
        setSelectedMarker(null);
    };

    // Loading state
    if (loading && locationHistory.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading location history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Location History</h3>
                        <p className="text-gray-600">Track user movement patterns and location updates</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                        <button
                            onClick={fetchLocationHistory}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>

                        <button
                            onClick={handleExportData}
                            disabled={locationHistory.length === 0}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </button>

                        <button
                            onClick={handleDeleteHistory}
                            disabled={deleteLoading || locationHistory.length === 0}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>{deleteLoading ? 'Deleting...' : 'Clear History'}</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {locationStats && !statsLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Locations</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {locationStats.statistics?.totalLocationsEver || 0}
                                    </p>
                                </div>
                                <MapPin className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Recent (30 days)</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {locationStats.statistics?.locationsInPeriod || 0}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Distance Traveled</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {((locationStats.statistics?.totalDistanceTraveled || 0) / 1000).toFixed(1)}km
                                    </p>
                                </div>
                                <Navigation className="h-8 w-8 text-purple-500" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg/Day</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {((locationStats.statistics?.averageDistancePerDay || 0) / 1000).toFixed(1)}km
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 font-bold text-sm">AVG</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h4 className="text-lg font-medium text-gray-900">Filters</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                        <select
                            value={filters.source}
                            onChange={(e) => handleFilterChange('source', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Sources</option>
                            <option value="HOME_FEED">Home Feed</option>
                            <option value="SEARCH">Search</option>
                            <option value="MANUAL">Manual</option>
                            <option value="AUTO">Auto</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
                        <select
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={25}>25 locations</option>
                            <option value={50}>50 locations</option>
                            <option value={100}>100 locations</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {locationHistory.length === 0 && !loading ? (
                // Empty State
                <div className="bg-white rounded-lg border p-12 text-center">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Location History</h3>
                    <p className="text-gray-600 mb-6">This user hasn't shared their location yet or all history has been cleared.</p>
                    <button
                        onClick={fetchLocationHistory}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border overflow-hidden">
                            <div className="p-4 border-b">
                                <h4 className="text-lg font-medium text-gray-900">Location Map</h4>
                                <p className="text-sm text-gray-600">Click on markers to see location details</p>
                            </div>

                            <div className="h-96 lg:h-[500px]">
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={mapCenter}
                                        zoom={12}
                                        onClick={handleMapClick}
                                    >
                                        {locationHistory.map((location, index) => (
                                            <Marker
                                                key={`${location.latitude}-${location.longitude}-${location.timestamp}-${index}`}
                                                position={{ lat: location.latitude, lng: location.longitude }}
                                                onClick={() => handleMarkerClick(location)}
                                                icon={createMarkerIcon(getMarkerColor(location.source))}
                                            />
                                        ))}

                                        {selectedMarker && (
                                            <InfoWindow
                                                position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                                                onCloseClick={() => setSelectedMarker(null)}
                                            >
                                                <div className="p-2 max-w-xs">
                                                    <div className="font-medium text-gray-900 mb-2">Location Details</div>
                                                    <div className="space-y-1 text-sm">
                                                        <div>
                                                            <span className="font-medium">Time:</span> {formatDate(selectedMarker.timestamp)}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Source:</span>
                                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedMarker.source === 'HOME_FEED' ? 'bg-blue-100 text-blue-800' :
                                                                    selectedMarker.source === 'SEARCH' ? 'bg-green-100 text-green-800' :
                                                                        selectedMarker.source === 'MANUAL' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-purple-100 text-purple-800'
                                                                }`}>
                                                                {selectedMarker.source}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Coordinates:</span>
                                                            {selectedMarker.latitude.toFixed(6)}, {selectedMarker.longitude.toFixed(6)}
                                                        </div>
                                                        {selectedMarker.address && (
                                                            <div>
                                                                <span className="font-medium">Address:</span> {selectedMarker.address}
                                                            </div>
                                                        )}
                                                        {selectedMarker.distanceFromPrevious && (
                                                            <div>
                                                                <span className="font-medium">Distance from previous:</span> {selectedMarker.distanceFromPrevious}m
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </GoogleMap>
                            </div>
                        </div>
                    </div>

                    {/* Location List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border">
                            <div className="p-4 border-b">
                                <h4 className="text-lg font-medium text-gray-900">Recent Locations</h4>
                                <p className="text-sm text-gray-600">
                                    Showing {locationHistory.length} of {pagination?.total || 0} locations
                                </p>
                            </div>

                            <div className="max-h-96 lg:max-h-[500px] overflow-y-auto">
                                {locationHistory.map((location, index) => (
                                    <div
                                        key={`${location.latitude}-${location.longitude}-${location.timestamp}-${index}`}
                                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setSelectedMarker(location);
                                            setMapCenter({ lat: location.latitude, lng: location.longitude });
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: getMarkerColor(location.source) }}
                                                    ></div>
                                                    <span className="text-xs font-medium text-gray-500">
                                                        {formatDate(location.timestamp)}
                                                    </span>
                                                </div>

                                                <div className="text-sm text-gray-900 mb-1">
                                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                </div>

                                                {location.address && (
                                                    <div className="text-xs text-gray-600 mb-2">
                                                        {location.address}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${location.source === 'HOME_FEED' ? 'bg-blue-100 text-blue-800' :
                                                            location.source === 'SEARCH' ? 'bg-green-100 text-green-800' :
                                                                location.source === 'MANUAL' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {location.source}
                                                    </span>

                                                    {location.distanceFromPrevious && (
                                                        <span className="text-xs text-gray-500">
                                                            {location.distanceFromPrevious}m
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="p-4 border-t bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Page {pagination.page} of {pagination.totalPages}
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={!pagination.hasPrev || loading}
                                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            <button
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={!pagination.hasNext || loading}
                                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserLocationHistory;