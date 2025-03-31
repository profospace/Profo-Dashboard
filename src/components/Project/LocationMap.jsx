import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const LocationMap = ({
    initialLocation = { lat: 20.5937, lng: 78.9629 }, // Default center of India
    zoom = 5,
    onLocationSelect
}) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Initialize the map when the component mounts
    useEffect(() => {
        const initMap = () => {
            if (!window.google || !window.google.maps || !mapContainerRef.current) return;

            // Create the map instance
            const map = new window.google.maps.Map(mapContainerRef.current, {
                center: initialLocation,
                zoom,
                mapTypeControl: true,
                streetViewControl: false,
                zoomControl: true
            });

            // Create the marker
            const marker = new window.google.maps.Marker({
                map,
                draggable: true
            });

            // If we have initial coordinates, set the marker
            if (initialLocation.lat && initialLocation.lng) {
                marker.setPosition(initialLocation);
                map.setCenter(initialLocation);
                if (initialLocation.lat !== 20.5937) { // If not the default location
                    map.setZoom(15);
                }
            }

            // Add click event for map
            map.addListener('click', function (event) {
                marker.setPosition(event.latLng);
                if (onLocationSelect) {
                    onLocationSelect({
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    });
                }
            });

            // Add dragend event for marker
            marker.addListener('dragend', function () {
                if (onLocationSelect) {
                    onLocationSelect({
                        lat: marker.getPosition().lat(),
                        lng: marker.getPosition().lng()
                    });
                }
            });

            // Store references
            mapRef.current = map;
            markerRef.current = marker;
            setMapLoaded(true);
        };

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
            initMap();
        } else {
            // Wait for the Google Maps script to load
            const handleScriptLoad = () => initMap();
            window.addEventListener('google-maps-loaded', handleScriptLoad);
            return () => window.removeEventListener('google-maps-loaded', handleScriptLoad);
        }
    }, [initialLocation, zoom, onLocationSelect]);

    // Update marker position when initialLocation changes
    useEffect(() => {
        if (mapLoaded && markerRef.current && initialLocation.lat && initialLocation.lng) {
            const position = new window.google.maps.LatLng(initialLocation.lat, initialLocation.lng);
            markerRef.current.setPosition(position);
            mapRef.current.setCenter(position);
            if (initialLocation.lat !== 20.5937) {
                mapRef.current.setZoom(15);
            }
        }
    }, [initialLocation, mapLoaded]);

    // Function to get current location
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

                // Update map and marker
                if (mapRef.current && markerRef.current) {
                    const pos = new window.google.maps.LatLng(location.lat, location.lng);
                    markerRef.current.setPosition(pos);
                    mapRef.current.setCenter(pos);
                    mapRef.current.setZoom(15);

                    // Callback
                    if (onLocationSelect) {
                        onLocationSelect(location);
                    }

                    toast.success('Location set successfully', { id: 'location' });

                    // Try to get address with reverse geocoding
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

    return (
        <div className="w-full space-y-2">
            <div
                ref={mapContainerRef}
                className="w-full h-72 rounded-md border border-gray-300 bg-gray-100"
            ></div>

            <button
                type="button"
                onClick={getCurrentLocation}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Get Current Location
            </button>

            {initialLocation && initialLocation.lat !== 20.5937 && (
                <p className="text-sm text-gray-600">
                    Selected coordinates: {initialLocation.lat.toFixed(6)}, {initialLocation.lng.toFixed(6)}
                </p>
            )}
        </div>
    );
};

export default LocationMap;