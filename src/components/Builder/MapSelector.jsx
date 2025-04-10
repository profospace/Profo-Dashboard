// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// const MapSelector = ({ onLocationSelect, initialPosition }) => {
//     const [markerPosition, setMarkerPosition] = useState(initialPosition);

//     // Update marker when initialPosition changes
//     useEffect(() => {
//         setMarkerPosition(initialPosition);
//     }, [initialPosition]);

//     const mapContainerStyle = {
//         width: '100%',
//         height: '400px'
//     };

//     const handleMapClick = (event) => {
//         const lat = event.latLng.lat();
//         const lng = event.latLng.lng();
//         const newPosition = { lat, lng };
//         setMarkerPosition(newPosition);
//         onLocationSelect(newPosition);
//     };

//     return (
//             <div className="w-full h-[400px] border rounded-md overflow-hidden">
//                 <GoogleMap
//                     mapContainerStyle={mapContainerStyle}
//                     center={markerPosition}
//                     zoom={14}
//                     onClick={handleMapClick}
//                 >
//                     <Marker
//                         position={markerPosition}
//                         draggable={true}
//                         onDragEnd={(e) => {
//                             const lat = e.latLng.lat();
//                             const lng = e.latLng.lng();
//                             const newPosition = { lat, lng };
//                             setMarkerPosition(newPosition);
//                             onLocationSelect(newPosition);
//                         }}
//                     />
//                 </GoogleMap>
//             </div>
//     );
// };

// export default MapSelector;

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaSearch, FaSpinner } from 'react-icons/fa';

// Default map options
const defaultMapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
};

const libraries = ['places'];

const MapSelector = ({ onLocationSelect, initialPosition }) => {
    const [marker, setMarker] = useState(initialPosition);
    const [map, setMap] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
        libraries,
    });

    // Update marker when initialPosition changes
    useEffect(() => {
        if (initialPosition && initialPosition.lat && initialPosition.lng) {
            setMarker(initialPosition);
        }
    }, [initialPosition]);

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    const handleMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newPosition = { lat, lng };
        setMarker(newPosition);
        onLocationSelect(newPosition);
    }, [onLocationSelect]);

    const handleMarkerDrag = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newPosition = { lat, lng };
        setMarker(newPosition);
        onLocationSelect(newPosition);
    }, [onLocationSelect]);

    const handleSearchLocation = useCallback(() => {
        if (!searchInput || !map || !window.google) return;

        setIsSearching(true);
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address: searchInput }, (results, status) => {
            setIsSearching(false);

            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const newPosition = {
                    lat: location.lat(),
                    lng: location.lng()
                };

                setMarker(newPosition);
                onLocationSelect(newPosition);
                map.panTo(location);
                map.setZoom(15);
            } else {
                alert('Location not found. Please try again with a different search term.');
            }
        });
    }, [map, searchInput, onLocationSelect]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearchLocation();
        }
    };

    if (loadError) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                Error loading Google Maps. Please check your API key and internet connection.
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                <span className="ml-2 text-gray-600">Loading Maps...</span>
            </div>
        );
    }

    return (
        <div className="map-selector">
            {/* Search Bar */}
            <div className="flex mb-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search for location..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    type="button"
                    onClick={handleSearchLocation}
                    disabled={isSearching}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
                >
                    {isSearching ? (
                        <FaSpinner className="animate-spin" />
                    ) : (
                        <FaSearch />
                    )}
                </button>
            </div>

            {/* Map Container */}
            <div className="relative rounded-lg overflow-hidden border border-gray-300">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={marker}
                    zoom={13}
                    options={defaultMapOptions}
                    onClick={handleMapClick}
                    onLoad={map => setMap(map)}
                >
                    {marker && (
                        <Marker
                            position={marker}
                            draggable={true}
                            onDragEnd={handleMarkerDrag}
                            animation={window.google.maps.Animation.DROP}
                        />
                    )}
                </GoogleMap>

                {/* Coordinates Display */}
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 text-xs text-gray-700">
                    Lat: {marker?.lat.toFixed(6)}, Lng: {marker?.lng.toFixed(6)}
                </div>
            </div>
        </div>
    );
};

export default MapSelector;