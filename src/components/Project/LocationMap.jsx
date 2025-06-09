
// import React, { useEffect, useRef, useState } from 'react';
// import { toast } from 'react-hot-toast';

// const LocationMap = ({
//     initialLocation = { lat: 20.5937, lng: 78.9629 }, // Default center of India
//     zoom = 5,
//     onLocationSelect
// }) => {
//     const mapRef = useRef(null);
//     const markerRef = useRef(null);
//     const mapContainerRef = useRef(null);
//     const [mapLoaded, setMapLoaded] = useState(false);
//     const initialLocationRef = useRef(initialLocation);

//     // Initialize the map when the component mounts
//     useEffect(() => {
//         // Store the updated initialLocation in a ref to avoid infinite re-renders
//         initialLocationRef.current = initialLocation;

//         const initMap = () => {
//             if (!window.google || !window.google.maps || !mapContainerRef.current) return;

//             // Don't reinitialize if the map is already created
//             if (mapRef.current) return;

//             // Create the map instance
//             const map = new window.google.maps.Map(mapContainerRef.current, {
//                 center: initialLocationRef.current,
//                 zoom,
//                 mapTypeControl: true,
//                 streetViewControl: false,
//                 zoomControl: true
//             });

//             // Create the marker
//             const marker = new window.google.maps.Marker({
//                 map,
//                 draggable: true
//             });

//             // If we have initial coordinates, set the marker
//             if (initialLocationRef.current.lat && initialLocationRef.current.lng) {
//                 marker.setPosition(initialLocationRef.current);
//                 map.setCenter(initialLocationRef.current);
//                 if (initialLocationRef.current.lat !== 20.5937) { // If not the default location
//                     map.setZoom(15);
//                 }
//             }

//             // Add click event for map
//             map.addListener('click', function (event) {
//                 marker.setPosition(event.latLng);
//                 if (onLocationSelect) {
//                     onLocationSelect({
//                         lat: event.latLng.lat(),
//                         lng: event.latLng.lng()
//                     });
//                 }
//             });

//             // Add dragend event for marker
//             marker.addListener('dragend', function () {
//                 if (onLocationSelect) {
//                     onLocationSelect({
//                         lat: marker.getPosition().lat(),
//                         lng: marker.getPosition().lng()
//                     });
//                 }
//             });

//             // Store references
//             mapRef.current = map;
//             markerRef.current = marker;

//             // Set mapLoaded state only once after initialization
//             setMapLoaded(true);
//         };

//         // Check if Google Maps is already loaded
//         if (window.google && window.google.maps) {
//             initMap();
//         } else {
//             // Wait for the Google Maps script to load
//             const handleScriptLoad = () => initMap();
//             window.addEventListener('google-maps-loaded', handleScriptLoad);
//             return () => window.removeEventListener('google-maps-loaded', handleScriptLoad);
//         }

//         // No dependencies to prevent re-initialization on every render
//         // The map should only initialize once
//     }, []);

//     // Update marker position when initialLocation changes
//     useEffect(() => {
//         if (mapLoaded && markerRef.current && initialLocation.lat && initialLocation.lng) {
//             const position = new window.google.maps.LatLng(initialLocation.lat, initialLocation.lng);
//             markerRef.current.setPosition(position);
//             mapRef.current.setCenter(position);
//             if (initialLocation.lat !== 20.5937) {
//                 mapRef.current.setZoom(15);
//             }
//         }
//     }, [initialLocation, mapLoaded]);

//     // Function to get current location
//     const getCurrentLocation = () => {
//         if (!navigator.geolocation) {
//             toast.error('Geolocation is not supported by your browser');
//             return;
//         }

//         toast.loading('Getting your current location...', { id: 'location' });

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const location = {
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude
//                 };

//                 // Update map and marker
//                 if (mapRef.current && markerRef.current) {
//                     const pos = new window.google.maps.LatLng(location.lat, location.lng);
//                     markerRef.current.setPosition(pos);
//                     mapRef.current.setCenter(pos);
//                     mapRef.current.setZoom(15);

//                     // Callback
//                     if (onLocationSelect) {
//                         onLocationSelect(location);
//                     }

//                     toast.success('Location set successfully', { id: 'location' });

//                     // Try to get address with reverse geocoding
//                     const geocoder = new window.google.maps.Geocoder();
//                     geocoder.geocode({ location: pos }, (results, status) => {
//                         if (status === 'OK' && results[0]) {
//                             toast.success('Address found: ' + results[0].formatted_address, { duration: 3000 });
//                         }
//                     });
//                 }
//             },
//             (error) => {
//                 toast.error(`Error getting location: ${error.message}`, { id: 'location' });
//             },
//             { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//         );
//     };

//     return (
//         <div className="w-full space-y-2">
//             <div
//                 ref={mapContainerRef}
//                 className="w-full h-72 rounded-md border border-gray-300 bg-gray-100"
//             ></div>

//             <button
//                 type="button"
//                 onClick={getCurrentLocation}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//                 Get Current Location
//             </button>

//             {initialLocation && initialLocation.lat !== 20.5937 && (
//                 <p className="text-sm text-gray-600">
//                     Selected coordinates: {initialLocation.lat.toFixed(6)}, {initialLocation.lng.toFixed(6)}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default LocationMap;


import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const LocationMap = ({
    initialLocation = { lat: 20.5937, lng: 78.9629 },
    zoom = 5,
    onLocationSelect
}) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [coordinates, setCoordinates] = useState({
        lat: initialLocation.lat || 20.5937,
        lng: initialLocation.lng || 78.9629
    });
    const initialLocationRef = useRef(initialLocation);

    // Initialize the map when the component mounts
    useEffect(() => {
        initialLocationRef.current = initialLocation;
        setCoordinates({
            lat: initialLocation.lat || 20.5937,
            lng: initialLocation.lng || 78.9629
        });

        const initMap = () => {
            if (!window.google || !window.google.maps || !mapContainerRef.current) return;
            if (mapRef.current) return;

            const map = new window.google.maps.Map(mapContainerRef.current, {
                center: initialLocationRef.current,
                zoom,
                mapTypeControl: true,
                streetViewControl: false,
                zoomControl: true
            });

            const marker = new window.google.maps.Marker({
                map,
                draggable: true
            });

            if (initialLocationRef.current.lat && initialLocationRef.current.lng) {
                marker.setPosition(initialLocationRef.current);
                map.setCenter(initialLocationRef.current);
                if (initialLocationRef.current.lat !== 20.5937) {
                    map.setZoom(15);
                }
            }

            map.addListener('click', function (event) {
                const newPosition = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                marker.setPosition(event.latLng);
                setCoordinates(newPosition);
                if (onLocationSelect) {
                    onLocationSelect(newPosition);
                }
            });

            marker.addListener('dragend', function () {
                const newPosition = {
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng()
                };
                setCoordinates(newPosition);
                if (onLocationSelect) {
                    onLocationSelect(newPosition);
                }
            });

            mapRef.current = map;
            markerRef.current = marker;
            setMapLoaded(true);
        };

        if (window.google && window.google.maps) {
            initMap();
        } else {
            const handleScriptLoad = () => initMap();
            window.addEventListener('google-maps-loaded', handleScriptLoad);
            return () => window.removeEventListener('google-maps-loaded', handleScriptLoad);
        }
    }, []);

    // Update marker position when coordinates change manually
    const handleCoordinateChange = (field, value) => {
        const numValue = parseFloat(value) || 0;
        const newCoordinates = {
            ...coordinates,
            [field]: numValue
        };

        setCoordinates(newCoordinates);

        if (mapLoaded && markerRef.current && mapRef.current) {
            const position = new window.google.maps.LatLng(newCoordinates.lat, newCoordinates.lng);
            markerRef.current.setPosition(position);
            mapRef.current.setCenter(position);

            if (onLocationSelect) {
                onLocationSelect(newCoordinates);
            }
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        toast.loading('Getting your current location...', { id: 'location' });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                setCoordinates(location);

                if (mapRef.current && markerRef.current) {
                    const pos = new window.google.maps.LatLng(location.lat, location.lng);
                    markerRef.current.setPosition(pos);
                    mapRef.current.setCenter(pos);
                    mapRef.current.setZoom(15);

                    if (onLocationSelect) {
                        onLocationSelect(location);
                    }

                    toast.success('Location set successfully', { id: 'location' });

                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: pos }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            toast.success('Address found: ' + results[0].formatted_address, { duration: 3000 });
                        }
                    });
                }
            },
            (error) => {
                toast.error(`Error getting location: ${error.message}`, { id: 'location' });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const centerMapToCoordinates = () => {
        if (mapRef.current && coordinates.lat && coordinates.lng) {
            const position = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);
            mapRef.current.setCenter(position);
            mapRef.current.setZoom(15);

            if (markerRef.current) {
                markerRef.current.setPosition(position);
            }
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Manual Coordinate Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={coordinates.lat}
                        onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter latitude"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={coordinates.lng}
                        onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter longitude"
                    />
                </div>
            </div>

            {/* Map Container */}
            <div
                ref={mapContainerRef}
                className="w-full h-72 rounded-md border border-gray-300 bg-gray-100"
            ></div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                    📍 Get Current Location
                </button>
                <button
                    type="button"
                    onClick={centerMapToCoordinates}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                    🎯 Center Map
                </button>
            </div>

            {/* Coordinates Display */}
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Current Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </div>
        </div>
    );
};

export default LocationMap;