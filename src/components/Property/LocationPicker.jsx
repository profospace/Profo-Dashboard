import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px', // Increased height for better UX
    borderRadius: '12px' // More rounded corners
};

const defaultCenter = {
    lat: 28.6139, // Default to New Delhi, India
    lng: 77.2090
};

const LocationPicker = ({ address, city, onLocationSelect, onAddressChange, mapStyles }) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [center, setCenter] = useState(defaultCenter);
    const [isLoading, setIsLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [infoWindowData, setInfoWindowData] = useState(null);
    const [mapType, setMapType] = useState('roadmap');
    const [recentLocations, setRecentLocations] = useState([]);
    const [zoom, setZoom] = useState(14);
    const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);

    // Check if Google Maps API is available
    useEffect(() => {
        const checkGoogleMapsLoaded = () => {
            if (window.google && window.google.maps) {
                setGoogleApiLoaded(true);
            }
        };

        // Check immediately
        checkGoogleMapsLoaded();

        // Also set up an interval to check in case it loads after component mounts
        const intervalId = setInterval(() => {
            if (window.google && window.google.maps) {
                setGoogleApiLoaded(true);
                clearInterval(intervalId);
            }
        }, 500);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Initialize services when map loads and Google API is available
    useEffect(() => {
        if (googleApiLoaded && map && window.google.maps.places) {
            try {
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
                placesService.current = new window.google.maps.places.PlacesService(map);
            } catch (error) {
                console.error("Failed to initialize Google Places services:", error);
            }
        }
    }, [map, googleApiLoaded]);

    // Load recent locations from local storage
    useEffect(() => {
        try {
            const storedLocations = localStorage.getItem('recentLocations');
            if (storedLocations) {
                setRecentLocations(JSON.parse(storedLocations).slice(0, 5));
            }
        } catch (e) {
            console.error("Failed to parse recent locations from localStorage", e);
        }
    }, []);

    // Save a location to recent locations
    const saveToRecentLocations = useCallback((locationData) => {
        if (!locationData || !locationData.address) return;

        setRecentLocations(prevLocations => {
            try {
                // Remove duplicates and add new location at the beginning
                const newLocations = [
                    locationData,
                    ...prevLocations.filter(loc => loc.address !== locationData.address)
                ].slice(0, 5);

                localStorage.setItem('recentLocations', JSON.stringify(newLocations));
                return newLocations;
            } catch (e) {
                console.error("Failed to save recent locations", e);
                return prevLocations;
            }
        });
    }, []);

    // Geocode the address when it changes
    useEffect(() => {
        if (address && city && googleApiLoaded) {
            geocodeAddress(`${address}, ${city}`);
        }
    }, [address, city, googleApiLoaded]);

    // Handle click outside search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to geocode address to coordinates
    const geocodeAddress = useCallback((fullAddress) => {
        if (!fullAddress || !googleApiLoaded) return;

        setIsLoading(true);
        try {
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address: fullAddress }, (results, status) => {
                setIsLoading(false);

                if (status === 'OK' && results[0]) {
                    const position = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };

                    setCenter(position);
                    setMarker(position);
                    setZoom(16); // Zoom in closer when address is found

                    // Extract and display address components
                    const addressData = {
                        position,
                        address: results[0].formatted_address,
                        placeId: results[0].place_id
                    };

                    setInfoWindowData(addressData);
                    saveToRecentLocations(addressData);

                    if (onLocationSelect) {
                        onLocationSelect(position, results[0].formatted_address);
                    }
                }
            });
        } catch (error) {
            console.error("Geocoding error:", error);
            setIsLoading(false);
            setLocationError("Error finding the address. Please try again.");
        }
    }, [googleApiLoaded, onLocationSelect, saveToRecentLocations]);

    // Handle search input change
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (!value) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        if (value.length > 2 && autocompleteService.current && googleApiLoaded) {
            try {
                autocompleteService.current.getPlacePredictions(
                    {
                        input: value,
                        types: ['geocode', 'establishment'], // Include both addresses and points of interest
                    },
                    (predictions, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                            setSearchResults(predictions);
                            setShowSearchResults(true);
                        } else {
                            setSearchResults([]);
                        }
                    }
                );
            } catch (error) {
                console.error("Place autocomplete error:", error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    // Handle search result selection
    const handleSelectSearchResult = (placeId) => {
        if (!placesService.current || !googleApiLoaded) return;

        setIsLoading(true);
        try {
            placesService.current.getDetails(
                {
                    placeId: placeId,
                    fields: ['geometry', 'formatted_address', 'name', 'place_id']
                },
                (place, status) => {
                    setIsLoading(false);
                    setShowSearchResults(false);

                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                        const position = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        };

                        setCenter(position);
                        setMarker(position);
                        setZoom(16);
                        setSearchQuery(place.formatted_address);

                        const addressData = {
                            position,
                            address: place.formatted_address,
                            placeId: place.place_id
                        };

                        setInfoWindowData(addressData);
                        saveToRecentLocations(addressData);

                        if (onLocationSelect) {
                            onLocationSelect(position, place.formatted_address);
                        }

                        if (onAddressChange) {
                            onAddressChange(place.formatted_address);
                        }
                    }
                }
            );
        } catch (error) {
            console.error("Place details error:", error);
            setIsLoading(false);
            setLocationError("Error fetching location details. Please try again.");
        }
    };

    // Handle map click to set marker position
    const handleMapClick = useCallback((event) => {
        if (!googleApiLoaded) return;

        const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        setMarker(position);
        setInfoWindowData(null);

        if (onLocationSelect) {
            onLocationSelect(position);
        }

        // Reverse geocode to get address
        try {
            const geocoder = new window.google.maps.Geocoder();
            setIsLoading(true);

            geocoder.geocode({ location: position }, (results, status) => {
                setIsLoading(false);

                if (status === 'OK' && results[0]) {
                    const addressData = {
                        position,
                        address: results[0].formatted_address,
                        placeId: results[0].place_id
                    };

                    setInfoWindowData(addressData);
                    setSearchQuery(results[0].formatted_address);

                    if (onAddressChange) {
                        onAddressChange(results[0].formatted_address);
                    }

                    saveToRecentLocations(addressData);
                }
            });
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setIsLoading(false);
        }
    }, [googleApiLoaded, onLocationSelect, onAddressChange, saveToRecentLocations]);

    // Function to handle map load
    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    // Function to handle map unmount
    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Function to get current location
    const getCurrentLocation = () => {
        setIsLoading(true);
        setLocationError('');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    setCenter(currentPosition);
                    setMarker(currentPosition);
                    setZoom(16);

                    if (onLocationSelect) {
                        onLocationSelect(currentPosition);
                    }

                    setIsLoading(false);

                    // Reverse geocode to get address
                    if (googleApiLoaded) {
                        try {
                            const geocoder = new window.google.maps.Geocoder();
                            geocoder.geocode({ location: currentPosition }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                    setSearchQuery(results[0].formatted_address);
                                    setInfoWindowData({
                                        position: currentPosition,
                                        address: results[0].formatted_address,
                                        placeId: results[0].place_id
                                    });

                                    if (onAddressChange) {
                                        onAddressChange(results[0].formatted_address);
                                    }
                                }
                            });
                        } catch (error) {
                            console.error("Geocoding error:", error);
                        }
                    }
                },
                (error) => {
                    setIsLoading(false);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setLocationError("Location access was denied. Please enable location services.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setLocationError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            setLocationError("The request to get location timed out.");
                            break;
                        default:
                            setLocationError("An unknown error occurred while getting location.");
                            break;
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setIsLoading(false);
            setLocationError("Geolocation is not supported by this browser.");
        }
    };

    const handleMarkerDragEnd = (e) => {
        if (!googleApiLoaded) return;

        const position = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };

        setMarker(position);
        setInfoWindowData(null);

        if (onLocationSelect) {
            onLocationSelect(position);
        }

        // Reverse geocode for new address
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setSearchQuery(results[0].formatted_address);
                    setInfoWindowData({
                        position,
                        address: results[0].formatted_address,
                        placeId: results[0].place_id
                    });

                    if (onAddressChange) {
                        onAddressChange(results[0].formatted_address);
                    }
                }
            });
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    // Change map type
    const handleMapTypeChange = (type) => {
        setMapType(type);
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="flex flex-col space-y-4">
                <div className="relative">
                    <div className="flex items-center">
                        <div className="relative flex-grow">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                                placeholder="Search for a location or address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="ml-2 inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin mr-2 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Locating...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>My Location</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div
                            ref={searchResultsRef}
                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                        >
                            {searchResults.map((result) => (
                                <div
                                    key={result.place_id}
                                    onClick={() => handleSelectSearchResult(result.place_id)}
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-start"
                                >
                                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <div className="font-medium">{result.structured_formatting.main_text}</div>
                                        <div className="text-sm text-gray-500">{result.structured_formatting.secondary_text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Locations */}
                {recentLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Recent:</span>
                        {recentLocations.map((location, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCenter(location.position);
                                    setMarker(location.position);
                                    setSearchQuery(location.address);
                                    setInfoWindowData(location);
                                    setZoom(16);
                                    if (onLocationSelect) {
                                        onLocationSelect(location.position, location.address);
                                    }
                                    if (onAddressChange) {
                                        onAddressChange(location.address);
                                    }
                                }}
                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full truncate max-w-xs"
                            >
                                {location.address.split(',')[0]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {locationError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                    {locationError}
                </div>
            )}

            <div className="relative">
                {/* Map Type Controls */}
                <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-md">
                    <div className="flex">
                        <button
                            onClick={() => handleMapTypeChange('roadmap')}
                            className={`px-3 py-1.5 text-xs ${mapType === 'roadmap' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
                first:rounded-l-lg last:rounded-r-lg border-r border-gray-200`}
                        >
                            Map
                        </button>
                        <button
                            onClick={() => handleMapTypeChange('satellite')}
                            className={`px-3 py-1.5 text-xs ${mapType === 'satellite' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
                first:rounded-l-lg last:rounded-r-lg`}
                        >
                            Satellite
                        </button>
                    </div>
                </div>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    onClick={handleMapClick}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        streetViewControl: true,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        zoomControl: true,
                        styles: mapStyles || [],
                        mapTypeId: mapType,
                    }}
                >
                    {marker && (
                        <Marker
                            position={marker}
                            draggable={true}
                            animation={googleApiLoaded && window.google?.maps?.Animation?.DROP}
                            onDragEnd={handleMarkerDragEnd}
                        />
                    )}

                    {infoWindowData && (
                        <InfoWindow
                            position={marker}
                            onCloseClick={() => setInfoWindowData(null)}
                        >
                            <div className="max-w-xs">
                                <p className="font-medium text-gray-900 mb-1">{infoWindowData.address}</p>
                                <p className="text-xs text-gray-500">
                                    {marker?.lat.toFixed(6)}, {marker?.lng.toFixed(6)}
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>

            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                <div>
                    {marker && (
                        <div>
                            <span className="font-medium">Coordinates:</span> {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                        </div>
                    )}
                </div>
                <div className="text-xs">
                    Click on the map to set location or drag the marker to adjust position
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;