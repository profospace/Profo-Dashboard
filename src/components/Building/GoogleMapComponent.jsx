import React, { useState, useEffect, useRef } from 'react';

const GoogleMapComponent = ({
    latitude,
    longitude,
    onLocationChange,
    height = '400px'
}) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize map
    useEffect(() => {
        if (!window.google || !mapRef.current) return;

        const initialLocation = {
            lat: latitude || 20.5937,
            lng: longitude || 78.9629
        };

        const newMap = new window.google.maps.Map(mapRef.current, {
            center: initialLocation,
            zoom: latitude && longitude ? 15 : 5,
            mapTypeControl: true,
            streetViewControl: false,
            zoomControl: true,
            fullscreenControl: true,
        });

        const newMarker = new window.google.maps.Marker({
            position: initialLocation,
            map: newMap,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
        });

        // Add click event listener to map
        newMap.addListener('click', (event) => {
            newMarker.setPosition(event.latLng);
            updateCoordinates(event.latLng);
        });

        // Add drag event listener to marker
        newMarker.addListener('dragend', () => {
            updateCoordinates(newMarker.getPosition());
        });

        setMap(newMap);
        setMarker(newMarker);

        // If initial coordinates are provided, set marker position
        if (latitude && longitude) {
            const initialPos = new window.google.maps.LatLng(latitude, longitude);
            newMarker.setPosition(initialPos);
            newMap.setCenter(initialPos);
        }
    }, [mapRef, window.google]);

    // Update map and marker when lat/lng props change
    useEffect(() => {
        if (!map || !marker) return;

        if (latitude && longitude) {
            const position = new window.google.maps.LatLng(latitude, longitude);
            marker.setPosition(position);
            map.setCenter(position);
            map.setZoom(15);
        }
    }, [latitude, longitude, map, marker]);

    // Update coordinates function
    const updateCoordinates = (location) => {
        const lat = location.lat();
        const lng = location.lng();
        onLocationChange(lat, lng);

        // Optional: Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                console.log('Address:', results[0].formatted_address);
            }
        });
    };

    // Get current location
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                if (map && marker) {
                    marker.setPosition(currentLocation);
                    map.setCenter(currentLocation);
                    map.setZoom(15);
                    updateCoordinates(new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng));
                }
                setIsLoading(false);
            },
            (error) => {
                console.error('Error getting current location:', error);
                alert(`Error getting location: ${error.message}`);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    return (
        <div className="w-full space-y-2">
            <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg border border-gray-300"></div>
            <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Getting Location...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Get Current Location
                    </>
                )}
            </button>
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                        type="text"
                        value={latitude || ''}
                        onChange={(e) => onLocationChange(e.target.value, longitude)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Latitude"
                    />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                        type="text"
                        value={longitude || ''}
                        onChange={(e) => onLocationChange(latitude, e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Longitude"
                    />
                </div>
            </div>
        </div>
    );
};

export default GoogleMapComponent;