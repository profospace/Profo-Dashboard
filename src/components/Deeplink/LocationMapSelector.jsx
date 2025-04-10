import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Target, Crosshair } from 'lucide-react';

// A component that uses Google Maps to select a location
const LocationMapSelector = ({
    latitude,
    longitude,
    onLocationChange,
    radius = 500,
    onRadiusChange
}) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [circle, setCircle] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Initialize the map
    useEffect(() => {
        // Check if the Google Maps script is already loaded
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCAxLPWJ3If855zICuSdKNWCYrSDhPauVM&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
            return () => {
                document.head.removeChild(script);
            };
        } else {
            initializeMap();
        }
    }, []);

    // Update marker and circle when lat/lng change externally
    useEffect(() => {
        if (map && marker) {
            const position = new window.google.maps.LatLng(latitude || 0, longitude || 0);
            marker.setPosition(position);
            map.panTo(position);

            if (circle) {
                circle.setCenter(position);
                circle.setRadius(radius);
            }
        }
    }, [latitude, longitude, radius, map, marker, circle]);

    const initializeMap = () => {
        if (!mapRef.current) return;

        // Default to a central location if no coordinates provided
        const defaultLat = latitude || 28.6139;
        const defaultLng = longitude || 77.2090;
        const position = new window.google.maps.LatLng(defaultLat, defaultLng);

        const mapOptions = {
            center: position,
            zoom: 12,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: true,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        };

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions);

        // Create marker
        const newMarker = new window.google.maps.Marker({
            position,
            map: newMap,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4F46E5",
                fillOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: "#FFFFFF"
            }
        });

        // Create circle
        const newCircle = new window.google.maps.Circle({
            strokeColor: "#4F46E5",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#4F46E5",
            fillOpacity: 0.1,
            map: newMap,
            center: position,
            radius: radius
        });

        // Add click handler to map
        window.google.maps.event.addListener(newMap, 'click', (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            newMarker.setPosition(event.latLng);
            newCircle.setCenter(event.latLng);

            if (onLocationChange) {
                onLocationChange(newLat, newLng);
            }
        });

        // Add drag handler to marker
        window.google.maps.event.addListener(newMarker, 'dragend', () => {
            const position = newMarker.getPosition();
            const newLat = position.lat();
            const newLng = position.lng();

            newCircle.setCenter(position);

            if (onLocationChange) {
                onLocationChange(newLat, newLng);
            }
        });

        setMap(newMap);
        setMarker(newMarker);
        setCircle(newCircle);
    };

    const handleSearch = () => {
        if (!searchQuery.trim() || !map) return;

        setIsLoading(true);
        setShowResults(false);

        const placesService = new window.google.maps.places.PlacesService(map);

        placesService.textSearch({
            query: searchQuery
        }, (results, status) => {
            setIsLoading(false);

            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setSearchResults(results.slice(0, 5));
                setShowResults(true);
            } else {
                setSearchResults([]);
            }
        });
    };

    const handleSearchResultClick = (place) => {
        if (!map || !marker || !circle) return;

        const location = place.geometry.location;
        const newLat = location.lat();
        const newLng = location.lng();

        marker.setPosition(location);
        circle.setCenter(location);
        map.panTo(location);
        map.setZoom(14);

        setShowResults(false);
        setSearchQuery(place.name);

        if (onLocationChange) {
            onLocationChange(newLat, newLng);
        }
    };

    const handleRadiusChange = (e) => {
        const newRadius = parseInt(e.target.value, 10);
        if (circle) {
            circle.setRadius(newRadius);
        }
        if (onRadiusChange) {
            onRadiusChange(newRadius);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLat = position.coords.latitude;
                const newLng = position.coords.longitude;

                if (map && marker && circle) {
                    const newPos = new window.google.maps.LatLng(newLat, newLng);
                    marker.setPosition(newPos);
                    circle.setCenter(newPos);
                    map.panTo(newPos);
                    map.setZoom(15);
                }

                if (onLocationChange) {
                    onLocationChange(newLat, newLng);
                }
            },
            (error) => {
                alert(`Error getting location: ${error.message}`);
            }
        );
    };

    return (
        <div className="relative h-full">
            {/* Search Section */}
            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-white rounded-lg shadow-lg p-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a location..."
                            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute inset-y-0 right-0 px-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Search"
                            )}
                        </button>
                    </div>

                    {/* Search Results */}
                    {showResults && searchResults.length > 0 && (
                        <div className="mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <ul>
                                {searchResults.map((place, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSearchResultClick(place)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    >
                                        <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-800">{place.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{place.formatted_address}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div ref={mapRef} className="h-full rounded-xl overflow-hidden border border-gray-300 shadow-md" />

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleUseCurrentLocation}
                            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none flex items-center"
                        >
                            <Target className="h-4 w-4 mr-2" />
                            <span>Use my location</span>
                        </button>
                        <button
                            onClick={() => {
                                if (map && marker) {
                                    map.setCenter(marker.getPosition());
                                    map.setZoom(15);
                                }
                            }}
                            className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none flex items-center"
                        >
                            <Crosshair className="h-4 w-4 mr-2" />
                            <span>Center map</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Radius (meters): {radius}m
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="5000"
                            step="100"
                            value={radius}
                            onChange={handleRadiusChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span className="font-medium">Latitude:</span> {latitude ? latitude.toFixed(6) : "Not set"}
                        </div>
                        <div>
                            <span className="font-medium">Longitude:</span> {longitude ? longitude.toFixed(6) : "Not set"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationMapSelector;