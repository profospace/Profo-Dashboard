
import React, { useState, useEffect, useRef } from 'react';
import { Save, X, MapPin, Calendar, Users, Settings, Plus, Trash2, AlertTriangle, Info, Navigation, Loader } from 'lucide-react';

// MapView Component
const MapView = ({
    base_url,
    getAuthConfig,
    newAdLocation,
    newAdRadius,
    newAdType,
    onLocationSelect,
    scheduledStartDate,
    scheduledEndDate,
    locationInputs = { lat: '', lng: '' },
    onInputChange
}) => {
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const [existingAds, setExistingAds] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const markersRef = useRef([]);
    const newAdMarkerRef = useRef(null);
    const newAdCircleRef = useRef(null);
    const currentLocationMarkerRef = useRef(null);

    useEffect(() => {
        initializeGoogleMap();
        return () => {
            if (googleMapRef.current) {
                googleMapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (googleMapRef.current) {
            fetchExistingAds();
        }
    }, [googleMapRef.current]);

    useEffect(() => {
        if (googleMapRef.current && existingAds.length > 0) {
            updateMapMarkers();
            checkConflicts();
        }
    }, [existingAds, newAdLocation, newAdRadius, newAdType, scheduledStartDate, scheduledEndDate]);

    useEffect(() => {
        if (locationInputs.lat && locationInputs.lng && googleMapRef.current) {
            const lat = parseFloat(locationInputs.lat);
            const lng = parseFloat(locationInputs.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                updateNewAdMarker(lat, lng);
                googleMapRef.current.setCenter({ lat, lng });
            }
        }
    }, [locationInputs.lat, locationInputs.lng, newAdRadius]);

    const initializeGoogleMap = () => {
        if (!window.google) {
            loadGoogleMapsScript();
            return;
        }

        if (!mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 26.8467, lng: 80.9462 },
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        googleMapRef.current = map;

        map.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            if (onLocationSelect) {
                onLocationSelect(lat, lng);
            }

            if (onInputChange) {
                onInputChange({
                    lat: lat.toFixed(6),
                    lng: lng.toFixed(6)
                });
            }

            updateNewAdMarker(lat, lng);
        });
    };

    const loadGoogleMapsScript = () => {
        if (window.google) {
            initializeGoogleMap();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleMap;
        document.head.appendChild(script);
    };

    const getCurrentLocation = () => {
        setGettingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                if (onLocationSelect) {
                    onLocationSelect(lat, lng);
                }

                if (onInputChange) {
                    onInputChange({
                        lat: lat.toFixed(6),
                        lng: lng.toFixed(6)
                    });
                }

                updateCurrentLocationMarker(lat, lng);
                updateNewAdMarker(lat, lng);

                if (googleMapRef.current) {
                    googleMapRef.current.setCenter({ lat, lng });
                    googleMapRef.current.setZoom(15);
                }

                setGettingLocation(false);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setLocationError(errorMessage);
                setGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    const updateCurrentLocationMarker = (lat, lng) => {
        if (!googleMapRef.current) return;

        if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.marker.setMap(null);
            currentLocationMarkerRef.current.circle.setMap(null);
            currentLocationMarkerRef.current = null;
        }

        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: googleMapRef.current,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#4ade80',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            },
            title: 'Current Location',
            zIndex: 1000
        });

        const pulseCircle = new window.google.maps.Circle({
            strokeColor: '#4ade80',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#4ade80',
            fillOpacity: 0.1,
            map: googleMapRef.current,
            center: { lat, lng },
            radius: 100,
            clickable: false
        });

        const infoWindow = new window.google.maps.InfoWindow({
            content: `
                <div style="padding: 8px;">
                    <h4 style="color: #4ade80; margin: 0 0 8px 0;">📍 Current Location</h4>
                    <p style="margin: 0; font-size: 14px;">Lat: ${lat.toFixed(6)}</p>
                    <p style="margin: 0; font-size: 14px;">Lng: ${lng.toFixed(6)}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(googleMapRef.current, marker);
        });

        currentLocationMarkerRef.current = { marker, circle: pulseCircle, infoWindow };
    };

    const fetchExistingAds = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/ads?limit=1000`, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                const locationBasedAds = data.ads.filter(ad =>
                    ad.locationTargeting?.isLocationBased &&
                    ad.locationTargeting.center?.latitude &&
                    ad.locationTargeting.center?.longitude
                );
                setExistingAds(locationBasedAds);
            }
        } catch (error) {
            console.error('Error fetching existing ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateMapMarkers = () => {
        if (!googleMapRef.current) return;

        markersRef.current.forEach(({ marker, circle }) => {
            marker.setMap(null);
            circle.setMap(null);
        });
        markersRef.current = [];

        existingAds.forEach(ad => {
            const { latitude, longitude } = ad.locationTargeting.center;
            const radius = ad.locationTargeting.radius * 1000;

            const marker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: googleMapRef.current,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: getAdTypeColor(ad.type),
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                },
                title: ad.name
            });

            const circle = new window.google.maps.Circle({
                strokeColor: getAdTypeColor(ad.type),
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: getAdTypeColor(ad.type),
                fillOpacity: 0.1,
                map: googleMapRef.current,
                center: { lat: latitude, lng: longitude },
                radius: radius
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: createPopupContent(ad)
            });

            marker.addListener('click', () => {
                infoWindow.open(googleMapRef.current, marker);
            });

            markersRef.current.push({ marker, circle, infoWindow });
        });
    };

    const updateNewAdMarker = (lat, lng) => {
        if (!googleMapRef.current) return;

        if (newAdMarkerRef.current) {
            newAdMarkerRef.current.setMap(null);
            newAdMarkerRef.current = null;
        }
        if (newAdCircleRef.current) {
            newAdCircleRef.current.setMap(null);
            newAdCircleRef.current = null;
        }

        if (lat && lng && newAdRadius) {
            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map: googleMapRef.current,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 15,
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3
                },
                title: 'New Ad Location',
                animation: window.google.maps.Animation.BOUNCE,
                zIndex: 999
            });

            setTimeout(() => {
                if (marker) {
                    marker.setAnimation(null);
                }
            }, 2000);

            const circle = new window.google.maps.Circle({
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#3b82f6',
                fillOpacity: 0.2,
                map: googleMapRef.current,
                center: { lat, lng },
                radius: newAdRadius * 1000
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="padding: 8px;">
                        <h4 style="color: #3b82f6; margin: 0 0 8px 0;">🎯 New Ad Location</h4>
                        <p style="margin: 0; font-size: 14px;">Type: ${newAdType || 'Not selected'}</p>
                        <p style="margin: 0; font-size: 14px;">Radius: ${newAdRadius} km</p>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">Lat: ${lat.toFixed(6)}</p>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">Lng: ${lng.toFixed(6)}</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(googleMapRef.current, marker);
            });

            newAdMarkerRef.current = marker;
            newAdCircleRef.current = circle;
        }
    };

    const getAdTypeColor = (adType) => {
        const colors = {
            BANNER: '#3b82f6',
            POPUP: '#8b5cf6',
            INTERSTITIAL: '#f59e0b',
            NATIVE: '#10b981',
            VIDEO: '#ef4444'
        };
        return colors[adType] || '#6b7280';
    };

    const createPopupContent = (ad) => {
        const isActive = ad.isActive;
        const hasSchedule = ad.scheduling?.isScheduled;

        return `
            <div style="padding: 12px; min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${ad.name}</h4>
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getAdTypeColor(ad.type)}; border-radius: 50%; margin-right: 6px;"></span>
                    <span style="font-size: 14px; color: #374151;">${ad.type}</span>
                </div>
                <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
                    <div><strong>Status:</strong> <span style="color: ${isActive ? '#10b981' : '#ef4444'}">${isActive ? 'Active' : 'Inactive'}</span></div>
                    <div><strong>Radius:</strong> ${ad.locationTargeting.radius} km</div>
                    <div><strong>Impressions:</strong> ${(ad.analytics?.impressions || 0).toLocaleString()}</div>
                    <div><strong>Clicks:</strong> ${(ad.analytics?.clicks || 0).toLocaleString()}</div>
                    ${hasSchedule ? `
                        <div style="margin-top: 4px; font-size: 11px;">
                            <strong>Schedule:</strong><br>
                            ${new Date(ad.scheduling.startDate).toLocaleDateString()} - 
                            ${new Date(ad.scheduling.endDate).toLocaleDateString()}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    const checkConflicts = () => {
        if (!newAdLocation || !newAdRadius || !newAdType) {
            setConflicts([]);
            return;
        }

        const newConflicts = [];

        existingAds.forEach(ad => {
            if (ad.type !== newAdType) return;
            if (!ad.isActive) return;

            const distance = calculateDistance(
                newAdLocation.lat,
                newAdLocation.lng,
                ad.locationTargeting.center.latitude,
                ad.locationTargeting.center.longitude
            );

            const combinedRadius = newAdRadius + ad.locationTargeting.radius;

            if (distance < combinedRadius) {
                let hasTimeConflict = true;

                if (ad.scheduling?.isScheduled && scheduledStartDate && scheduledEndDate) {
                    const existingStart = new Date(ad.scheduling.startDate);
                    const existingEnd = new Date(ad.scheduling.endDate);
                    const newStart = new Date(scheduledStartDate);
                    const newEnd = new Date(scheduledEndDate);

                    hasTimeConflict = !(newEnd < existingStart || newStart > existingEnd);
                }

                if (hasTimeConflict) {
                    newConflicts.push({
                        ad,
                        distance: distance.toFixed(2),
                        overlap: (combinedRadius - distance).toFixed(2)
                    });
                }
            }
        });

        setConflicts(newConflicts);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div
                    ref={mapRef}
                    className="w-full h-96 rounded-lg border border-gray-300"
                    style={{ minHeight: '400px' }}
                />

                <button
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="absolute top-4 right-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Get Current Location"
                >
                    {gettingLocation ? (
                        <Loader size={20} className="text-blue-600 animate-spin" />
                    ) : (
                        <Navigation size={20} className="text-blue-600" />
                    )}
                </button>

                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading existing ads...</p>
                        </div>
                    </div>
                )}
            </div>

            {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-red-800 font-medium">Location Error</p>
                            <p className="text-red-700 text-sm mt-1">{locationError}</p>
                        </div>
                        <button
                            onClick={() => setLocationError(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                    <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-blue-800 font-medium">How to use:</p>
                        <ul className="text-blue-700 mt-1 space-y-1">
                            <li>• Click the <Navigation size={14} className="inline mx-1" /> button to use your current location</li>
                            <li>• Click on the map to select a custom location for your new ad</li>
                            <li>• Existing ads are shown with colored markers and radius circles</li>
                            <li>• Your new ad location will appear with a blue bouncing circle</li>
                            <li>• Current location is marked with a green pulsing circle</li>
                            <li>• Conflicts with same ad types will be highlighted below</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Map Legend</h4>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Ad Types:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {['BANNER', 'POPUP', 'INTERSTITIAL', 'NATIVE', 'VIDEO'].map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: getAdTypeColor(type) }}
                                    ></div>
                                    <span className="text-sm text-gray-700">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Special Markers:</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-700">🎯 New Ad Location</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-700">📍 Current Location</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {conflicts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="font-medium text-red-800 mb-2">
                                Conflicts Detected ({conflicts.length})
                            </h4>
                            <p className="text-sm text-red-700 mb-3">
                                Your new ad conflicts with existing {newAdType} ads in the same area:
                            </p>
                            <div className="space-y-2">
                                {conflicts.map((conflict, index) => (
                                    <div key={index} className="bg-white rounded p-3 text-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{conflict.ad.name}</p>
                                                <p className="text-gray-600">
                                                    Distance: {conflict.distance} km | Overlap: {conflict.overlap} km
                                                </p>
                                                {conflict.ad.scheduling?.isScheduled && (
                                                    <p className="text-gray-500 text-xs">
                                                        Scheduled: {new Date(conflict.ad.scheduling.startDate).toLocaleDateString()} -
                                                        {new Date(conflict.ad.scheduling.endDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs ${conflict.ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {conflict.ad.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(newAdLocation || (locationInputs.lat && locationInputs.lng)) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Selected Location</h4>
                    <div className="text-sm text-green-700">
                        <p>Latitude: {newAdLocation?.lat?.toFixed(6) || locationInputs.lat}</p>
                        <p>Longitude: {newAdLocation?.lng?.toFixed(6) || locationInputs.lng}</p>
                        {newAdRadius && <p>Radius: {newAdRadius} km</p>}
                        {conflicts.length === 0 && newAdType && (
                            <p className="text-green-600 font-medium mt-1">✓ No conflicts detected</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;