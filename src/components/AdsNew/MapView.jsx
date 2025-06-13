// import React, { useState, useEffect, useRef } from 'react';
// import { Save, X, MapPin, Calendar, Users, Settings, Plus, Trash2, AlertTriangle, Info, Navigation, Loader } from 'lucide-react';

// // MapView Component
// const MapView = ({
//     base_url,
//     getAuthConfig,
//     newAdLocation,
//     newAdRadius,
//     newAdType,
//     onLocationSelect,
//     scheduledStartDate,
//     scheduledEndDate,
//     locationInputs = { lat: '', lng: '' },
//     onInputChange
// }) => {
//     const mapRef = useRef(null);
//     const googleMapRef = useRef(null);
//     const [existingAds, setExistingAds] = useState([]);
//     const [conflicts, setConflicts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [gettingLocation, setGettingLocation] = useState(false);
//     const [locationError, setLocationError] = useState(null);

//     const markersRef = useRef([]);
//     const newAdMarkerRef = useRef(null);
//     const newAdCircleRef = useRef(null);
//     const currentLocationMarkerRef = useRef(null);

//     useEffect(() => {
//         initializeGoogleMap();
//         return () => {
//             if (googleMapRef.current) {
//                 googleMapRef.current = null;
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (googleMapRef.current) {
//             fetchExistingAds();
//         }
//     }, [googleMapRef.current]);

//     useEffect(() => {
//         if (googleMapRef.current && existingAds.length > 0) {
//             updateMapMarkers();
//             checkConflicts();
//         }
//     }, [existingAds, newAdLocation, newAdRadius, newAdType, scheduledStartDate, scheduledEndDate]);

//     useEffect(() => {
//         if (locationInputs.lat && locationInputs.lng && googleMapRef.current) {
//             const lat = parseFloat(locationInputs.lat);
//             const lng = parseFloat(locationInputs.lng);
//             if (!isNaN(lat) && !isNaN(lng)) {
//                 updateNewAdMarker(lat, lng);
//                 googleMapRef.current.setCenter({ lat, lng });
//             }
//         }
//     }, [locationInputs.lat, locationInputs.lng, newAdRadius]);

//     const initializeGoogleMap = () => {
//         if (!window.google) {
//             loadGoogleMapsScript();
//             return;
//         }

//         if (!mapRef.current) return;

//         const map = new window.google.maps.Map(mapRef.current, {
//             center: { lat: 26.8467, lng: 80.9462 },
//             zoom: 13,
//             mapTypeId: 'roadmap'
//         });

//         googleMapRef.current = map;

//         map.addListener('click', (event) => {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();

//             if (onLocationSelect) {
//                 onLocationSelect(lat, lng);
//             }

//             if (onInputChange) {
//                 onInputChange({
//                     lat: lat.toFixed(6),
//                     lng: lng.toFixed(6)
//                 });
//             }

//             updateNewAdMarker(lat, lng);
//         });
//     };

//     const loadGoogleMapsScript = () => {
//         if (window.google) {
//             initializeGoogleMap();
//             return;
//         }

//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
//         script.async = true;
//         script.defer = true;
//         script.onload = initializeGoogleMap;
//         document.head.appendChild(script);
//     };

//     const getCurrentLocation = () => {
//         setGettingLocation(true);
//         setLocationError(null);

//         if (!navigator.geolocation) {
//             setLocationError('Geolocation is not supported by this browser.');
//             setGettingLocation(false);
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lng = position.coords.longitude;

//                 if (onLocationSelect) {
//                     onLocationSelect(lat, lng);
//                 }

//                 if (onInputChange) {
//                     onInputChange({
//                         lat: lat.toFixed(6),
//                         lng: lng.toFixed(6)
//                     });
//                 }

//                 updateCurrentLocationMarker(lat, lng);
//                 updateNewAdMarker(lat, lng);

//                 if (googleMapRef.current) {
//                     googleMapRef.current.setCenter({ lat, lng });
//                     googleMapRef.current.setZoom(15);
//                 }

//                 setGettingLocation(false);
//             },
//             (error) => {
//                 let errorMessage = 'Unable to retrieve your location.';
//                 switch (error.code) {
//                     case error.PERMISSION_DENIED:
//                         errorMessage = 'Location access denied by user.';
//                         break;
//                     case error.POSITION_UNAVAILABLE:
//                         errorMessage = 'Location information is unavailable.';
//                         break;
//                     case error.TIMEOUT:
//                         errorMessage = 'Location request timed out.';
//                         break;
//                 }
//                 setLocationError(errorMessage);
//                 setGettingLocation(false);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 60000
//             }
//         );
//     };

//     const updateCurrentLocationMarker = (lat, lng) => {
//         if (!googleMapRef.current) return;

//         if (currentLocationMarkerRef.current) {
//             currentLocationMarkerRef.current.marker.setMap(null);
//             currentLocationMarkerRef.current.circle.setMap(null);
//             currentLocationMarkerRef.current = null;
//         }

//         const marker = new window.google.maps.Marker({
//             position: { lat, lng },
//             map: googleMapRef.current,
//             icon: {
//                 path: window.google.maps.SymbolPath.CIRCLE,
//                 scale: 12,
//                 fillColor: '#4ade80',
//                 fillOpacity: 1,
//                 strokeColor: '#ffffff',
//                 strokeWeight: 3
//             },
//             title: 'Current Location',
//             zIndex: 1000
//         });

//         const pulseCircle = new window.google.maps.Circle({
//             strokeColor: '#4ade80',
//             strokeOpacity: 0.6,
//             strokeWeight: 2,
//             fillColor: '#4ade80',
//             fillOpacity: 0.1,
//             map: googleMapRef.current,
//             center: { lat, lng },
//             radius: 100,
//             clickable: false
//         });

//         const infoWindow = new window.google.maps.InfoWindow({
//             content: `
//                 <div style="padding: 8px;">
//                     <h4 style="color: #4ade80; margin: 0 0 8px 0;">📍 Current Location</h4>
//                     <p style="margin: 0; font-size: 14px;">Lat: ${lat.toFixed(6)}</p>
//                     <p style="margin: 0; font-size: 14px;">Lng: ${lng.toFixed(6)}</p>
//                 </div>
//             `
//         });

//         marker.addListener('click', () => {
//             infoWindow.open(googleMapRef.current, marker);
//         });

//         currentLocationMarkerRef.current = { marker, circle: pulseCircle, infoWindow };
//     };

//     const fetchExistingAds = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/ads?limit=1000`, getAuthConfig());
//             const data = await response.json();

//             if (data.success) {
//                 const locationBasedAds = data.ads.filter(ad =>
//                     ad.locationTargeting?.isLocationBased &&
//                     ad.locationTargeting.center?.latitude &&
//                     ad.locationTargeting.center?.longitude
//                 );
//                 setExistingAds(locationBasedAds);
//             }
//         } catch (error) {
//             console.error('Error fetching existing ads:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateMapMarkers = () => {
//         if (!googleMapRef.current) return;

//         markersRef.current.forEach(({ marker, circle }) => {
//             marker.setMap(null);
//             circle.setMap(null);
//         });
//         markersRef.current = [];

//         existingAds.forEach(ad => {
//             const { latitude, longitude } = ad.locationTargeting.center;
//             const radius = ad.locationTargeting.radius * 1000;

//             const marker = new window.google.maps.Marker({
//                 position: { lat: latitude, lng: longitude },
//                 map: googleMapRef.current,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: 10,
//                     fillColor: getAdTypeColor(ad.type),
//                     fillOpacity: 0.9,
//                     strokeColor: '#ffffff',
//                     strokeWeight: 2
//                 },
//                 title: ad.name
//             });

//             const circle = new window.google.maps.Circle({
//                 strokeColor: getAdTypeColor(ad.type),
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//                 fillColor: getAdTypeColor(ad.type),
//                 fillOpacity: 0.1,
//                 map: googleMapRef.current,
//                 center: { lat: latitude, lng: longitude },
//                 radius: radius
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: createPopupContent(ad)
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//             });

//             markersRef.current.push({ marker, circle, infoWindow });
//         });
//     };

//     const updateNewAdMarker = (lat, lng) => {
//         if (!googleMapRef.current) return;

//         if (newAdMarkerRef.current) {
//             newAdMarkerRef.current.setMap(null);
//             newAdMarkerRef.current = null;
//         }
//         if (newAdCircleRef.current) {
//             newAdCircleRef.current.setMap(null);
//             newAdCircleRef.current = null;
//         }

//         if (lat && lng && newAdRadius) {
//             const marker = new window.google.maps.Marker({
//                 position: { lat, lng },
//                 map: googleMapRef.current,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: 15,
//                     fillColor: '#3b82f6',
//                     fillOpacity: 1,
//                     strokeColor: '#ffffff',
//                     strokeWeight: 3
//                 },
//                 title: 'New Ad Location',
//                 animation: window.google.maps.Animation.BOUNCE,
//                 zIndex: 999
//             });

//             setTimeout(() => {
//                 if (marker) {
//                     marker.setAnimation(null);
//                 }
//             }, 2000);

//             const circle = new window.google.maps.Circle({
//                 strokeColor: '#3b82f6',
//                 strokeOpacity: 0.8,
//                 strokeWeight: 3,
//                 fillColor: '#3b82f6',
//                 fillOpacity: 0.2,
//                 map: googleMapRef.current,
//                 center: { lat, lng },
//                 radius: newAdRadius * 1000
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: `
//                     <div style="padding: 8px;">
//                         <h4 style="color: #3b82f6; margin: 0 0 8px 0;">🎯 New Ad Location</h4>
//                         <p style="margin: 0; font-size: 14px;">Type: ${newAdType || 'Not selected'}</p>
//                         <p style="margin: 0; font-size: 14px;">Radius: ${newAdRadius} km</p>
//                         <p style="margin: 0; font-size: 12px; color: #6b7280;">Lat: ${lat.toFixed(6)}</p>
//                         <p style="margin: 0; font-size: 12px; color: #6b7280;">Lng: ${lng.toFixed(6)}</p>
//                     </div>
//                 `
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//             });

//             newAdMarkerRef.current = marker;
//             newAdCircleRef.current = circle;
//         }
//     };

//     const getAdTypeColor = (adType) => {
//         const colors = {
//             BANNER: '#3b82f6',
//             POPUP: '#8b5cf6',
//             INTERSTITIAL: '#f59e0b',
//             NATIVE: '#10b981',
//             VIDEO: '#ef4444'
//         };
//         return colors[adType] || '#6b7280';
//     };

//     const createPopupContent = (ad) => {
//         const isActive = ad.isActive;
//         const hasSchedule = ad.scheduling?.isScheduled;

//         return `
//             <div style="padding: 12px; min-width: 200px;">
//                 <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${ad.name}</h4>
//                 <div style="margin-bottom: 8px;">
//                     <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getAdTypeColor(ad.type)}; border-radius: 50%; margin-right: 6px;"></span>
//                     <span style="font-size: 14px; color: #374151;">${ad.type}</span>
//                 </div>
//                 <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
//                     <div><strong>Status:</strong> <span style="color: ${isActive ? '#10b981' : '#ef4444'}">${isActive ? 'Active' : 'Inactive'}</span></div>
//                     <div><strong>Radius:</strong> ${ad.locationTargeting.radius} km</div>
//                     <div><strong>Impressions:</strong> ${(ad.analytics?.impressions || 0).toLocaleString()}</div>
//                     <div><strong>Clicks:</strong> ${(ad.analytics?.clicks || 0).toLocaleString()}</div>
//                     ${hasSchedule ? `
//                         <div style="margin-top: 4px; font-size: 11px;">
//                             <strong>Schedule:</strong><br>
//                             ${new Date(ad.scheduling.startDate).toLocaleDateString()} - 
//                             ${new Date(ad.scheduling.endDate).toLocaleDateString()}
//                         </div>
//                     ` : ''}
//                 </div>
//             </div>
//         `;
//     };

//     const checkConflicts = () => {
//         if (!newAdLocation || !newAdRadius || !newAdType) {
//             setConflicts([]);
//             return;
//         }

//         const newConflicts = [];

//         existingAds.forEach(ad => {
//             if (ad.type !== newAdType) return;
//             if (!ad.isActive) return;

//             const distance = calculateDistance(
//                 newAdLocation.lat,
//                 newAdLocation.lng,
//                 ad.locationTargeting.center.latitude,
//                 ad.locationTargeting.center.longitude
//             );

//             const combinedRadius = newAdRadius + ad.locationTargeting.radius;

//             if (distance < combinedRadius) {
//                 let hasTimeConflict = true;

//                 if (ad.scheduling?.isScheduled && scheduledStartDate && scheduledEndDate) {
//                     const existingStart = new Date(ad.scheduling.startDate);
//                     const existingEnd = new Date(ad.scheduling.endDate);
//                     const newStart = new Date(scheduledStartDate);
//                     const newEnd = new Date(scheduledEndDate);

//                     hasTimeConflict = !(newEnd < existingStart || newStart > existingEnd);
//                 }

//                 if (hasTimeConflict) {
//                     newConflicts.push({
//                         ad,
//                         distance: distance.toFixed(2),
//                         overlap: (combinedRadius - distance).toFixed(2)
//                     });
//                 }
//             }
//         });

//         setConflicts(newConflicts);
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371;
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//     };

//     return (
//         <div className="space-y-4">
//             <div className="relative">
//                 <div
//                     ref={mapRef}
//                     className="w-full h-96 rounded-lg border border-gray-300"
//                     style={{ minHeight: '400px' }}
//                 />

//                 <button
//                     onClick={getCurrentLocation}
//                     disabled={gettingLocation}
//                     className="absolute top-4 right-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     title="Get Current Location"
//                 >
//                     {gettingLocation ? (
//                         <Loader size={20} className="text-blue-600 animate-spin" />
//                     ) : (
//                         <Navigation size={20} className="text-blue-600" />
//                     )}
//                 </button>

//                 {loading && (
//                     <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
//                         <div className="text-center">
//                             <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
//                             <p className="text-sm text-gray-600">Loading existing ads...</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {locationError && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                     <div className="flex items-start space-x-2">
//                         <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
//                         <div>
//                             <p className="text-red-800 font-medium">Location Error</p>
//                             <p className="text-red-700 text-sm mt-1">{locationError}</p>
//                         </div>
//                         <button
//                             onClick={() => setLocationError(null)}
//                             className="text-red-600 hover:text-red-800"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <div className="flex items-start space-x-2">
//                     <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
//                     <div className="text-sm">
//                         <p className="text-blue-800 font-medium">How to use:</p>
//                         <ul className="text-blue-700 mt-1 space-y-1">
//                             <li>• Click the <Navigation size={14} className="inline mx-1" /> button to use your current location</li>
//                             <li>• Click on the map to select a custom location for your new ad</li>
//                             <li>• Existing ads are shown with colored markers and radius circles</li>
//                             <li>• Your new ad location will appear with a blue bouncing circle</li>
//                             <li>• Current location is marked with a green pulsing circle</li>
//                             <li>• Conflicts with same ad types will be highlighted below</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//                 <h4 className="font-medium text-gray-900 mb-3">Map Legend</h4>
//                 <div className="space-y-3">
//                     <div>
//                         <p className="text-sm font-medium text-gray-700 mb-2">Ad Types:</p>
//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
//                             {['BANNER', 'POPUP', 'INTERSTITIAL', 'NATIVE', 'VIDEO'].map(type => (
//                                 <div key={type} className="flex items-center space-x-2">
//                                     <div
//                                         className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
//                                         style={{ backgroundColor: getAdTypeColor(type) }}
//                                     ></div>
//                                     <span className="text-sm text-gray-700">{type}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <p className="text-sm font-medium text-gray-700 mb-2">Special Markers:</p>
//                         <div className="flex flex-wrap gap-4">
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
//                                 <span className="text-sm text-gray-700">🎯 New Ad Location</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
//                                 <span className="text-sm text-gray-700">📍 Current Location</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {conflicts.length > 0 && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                     <div className="flex items-start space-x-2">
//                         <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                             <h4 className="font-medium text-red-800 mb-2">
//                                 Conflicts Detected ({conflicts.length})
//                             </h4>
//                             <p className="text-sm text-red-700 mb-3">
//                                 Your new ad conflicts with existing {newAdType} ads in the same area:
//                             </p>
//                             <div className="space-y-2">
//                                 {conflicts.map((conflict, index) => (
//                                     <div key={index} className="bg-white rounded p-3 text-sm">
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <p className="font-medium text-gray-900">{conflict.ad.name}</p>
//                                                 <p className="text-gray-600">
//                                                     Distance: {conflict.distance} km | Overlap: {conflict.overlap} km
//                                                 </p>
//                                                 {conflict.ad.scheduling?.isScheduled && (
//                                                     <p className="text-gray-500 text-xs">
//                                                         Scheduled: {new Date(conflict.ad.scheduling.startDate).toLocaleDateString()} -
//                                                         {new Date(conflict.ad.scheduling.endDate).toLocaleDateString()}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                             <span className={`px-2 py-1 rounded text-xs ${conflict.ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                                                 {conflict.ad.isActive ? 'Active' : 'Inactive'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {(newAdLocation || (locationInputs.lat && locationInputs.lng)) && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <h4 className="font-medium text-green-800 mb-2">Selected Location</h4>
//                     <div className="text-sm text-green-700">
//                         <p>Latitude: {newAdLocation?.lat?.toFixed(6) || locationInputs.lat}</p>
//                         <p>Longitude: {newAdLocation?.lng?.toFixed(6) || locationInputs.lng}</p>
//                         {newAdRadius && <p>Radius: {newAdRadius} km</p>}
//                         {conflicts.length === 0 && newAdType && (
//                             <p className="text-green-600 font-medium mt-1">✓ No conflicts detected</p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MapView;




// import React, { useState, useEffect, useRef } from 'react';
// import { AlertTriangle, Info, Navigation, Loader, X } from 'lucide-react';

// const MapView = ({
//     base_url,
//     getAuthConfig,
//     newAdLocation,
//     newAdRadius,
//     newAdType,
//     onLocationSelect,
//     scheduledStartDate,
//     scheduledEndDate,
//     locationInputs = { lat: '', lng: '' },
//     onInputChange
// }) => {
//     const mapRef = useRef(null);
//     const googleMapRef = useRef(null);
//     const [existingAds, setExistingAds] = useState([]);
//     const [conflicts, setConflicts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [gettingLocation, setGettingLocation] = useState(false);
//     const [locationError, setLocationError] = useState(null);

//     const markersRef = useRef([]);
//     const newAdMarkerRef = useRef(null);
//     const newAdCircleRef = useRef(null);
//     const currentLocationMarkerRef = useRef(null);

//     useEffect(() => {
//         initializeGoogleMap();
//         return () => {
//             if (googleMapRef.current) {
//                 googleMapRef.current = null;
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (googleMapRef.current) {
//             fetchExistingAds();
//         }
//     }, [googleMapRef.current]);

//     useEffect(() => {
//         if (googleMapRef.current && existingAds.length > 0) {
//             updateMapMarkers();
//             checkConflicts();
//         }
//     }, [existingAds, newAdLocation, newAdRadius, newAdType, scheduledStartDate, scheduledEndDate]);

//     useEffect(() => {
//         if (locationInputs.lat && locationInputs.lng && googleMapRef.current) {
//             const lat = parseFloat(locationInputs.lat);
//             const lng = parseFloat(locationInputs.lng);
//             if (!isNaN(lat) && !isNaN(lng)) {
//                 updateNewAdMarker(lat, lng);
//                 googleMapRef.current.setCenter({ lat, lng });
//             }
//         }
//     }, [locationInputs.lat, locationInputs.lng, newAdRadius]);

//     const initializeGoogleMap = () => {
//         if (!window.google) {
//             loadGoogleMapsScript();
//             return;
//         }

//         if (!mapRef.current) return;

//         const map = new window.google.maps.Map(mapRef.current, {
//             center: { lat: 26.8467, lng: 80.9462 },
//             zoom: 13,
//             mapTypeId: 'roadmap',
//             styles: [
//                 {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'on' }]
//                 },
//                 {
//                     featureType: 'transit',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'on' }]
//                 }
//             ]
//         });

//         googleMapRef.current = map;

//         map.addListener('click', (event) => {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();

//             if (onLocationSelect) {
//                 onLocationSelect(lat, lng);
//             }

//             if (onInputChange) {
//                 onInputChange({
//                     lat: lat.toFixed(6),
//                     lng: lng.toFixed(6)
//                 });
//             }

//             updateNewAdMarker(lat, lng);
//         });
//     };

//     const loadGoogleMapsScript = () => {
//         if (window.google) {
//             initializeGoogleMap();
//             return;
//         }

//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
//         script.async = true;
//         script.defer = true;
//         script.onload = initializeGoogleMap;
//         document.head.appendChild(script);
//     };

//     const getCurrentLocation = () => {
//         setGettingLocation(true);
//         setLocationError(null);

//         if (!navigator.geolocation) {
//             setLocationError('Geolocation is not supported by this browser.');
//             setGettingLocation(false);
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lng = position.coords.longitude;

//                 if (onLocationSelect) {
//                     onLocationSelect(lat, lng);
//                 }

//                 if (onInputChange) {
//                     onInputChange({
//                         lat: lat.toFixed(6),
//                         lng: lng.toFixed(6)
//                     });
//                 }

//                 updateCurrentLocationMarker(lat, lng);
//                 updateNewAdMarker(lat, lng);

//                 if (googleMapRef.current) {
//                     googleMapRef.current.setCenter({ lat, lng });
//                     googleMapRef.current.setZoom(15);
//                 }

//                 setGettingLocation(false);
//             },
//             (error) => {
//                 let errorMessage = 'Unable to retrieve your location.';
//                 switch (error.code) {
//                     case error.PERMISSION_DENIED:
//                         errorMessage = 'Location access denied by user.';
//                         break;
//                     case error.POSITION_UNAVAILABLE:
//                         errorMessage = 'Location information is unavailable.';
//                         break;
//                     case error.TIMEOUT:
//                         errorMessage = 'Location request timed out.';
//                         break;
//                 }
//                 setLocationError(errorMessage);
//                 setGettingLocation(false);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 60000
//             }
//         );
//     };

//     const updateCurrentLocationMarker = (lat, lng) => {
//         if (!googleMapRef.current) return;

//         if (currentLocationMarkerRef.current) {
//             currentLocationMarkerRef.current.marker.setMap(null);
//             currentLocationMarkerRef.current.circle.setMap(null);
//             currentLocationMarkerRef.current = null;
//         }

//         const marker = new window.google.maps.Marker({
//             position: { lat, lng },
//             map: googleMapRef.current,
//             icon: {
//                 path: window.google.maps.SymbolPath.CIRCLE,
//                 scale: 12,
//                 fillColor: '#4ade80',
//                 fillOpacity: 1,
//                 strokeColor: '#ffffff',
//                 strokeWeight: 3
//             },
//             title: 'Current Location',
//             zIndex: 1000
//         });

//         const pulseCircle = new window.google.maps.Circle({
//             strokeColor: '#4ade80',
//             strokeOpacity: 0.6,
//             strokeWeight: 2,
//             fillColor: '#4ade80',
//             fillOpacity: 0.1,
//             map: googleMapRef.current,
//             center: { lat, lng },
//             radius: 100,
//             clickable: false
//         });

//         const infoWindow = new window.google.maps.InfoWindow({
//             content: `
//                 <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
//                     <div style="display: flex; align-items: center; margin-bottom: 8px;">
//                         <span style="font-size: 16px; margin-right: 8px;">📍</span>
//                         <h4 style="color: #065f46; margin: 0; font-size: 14px; font-weight: 600;">Current Location</h4>
//                     </div>
//                     <div style="font-size: 13px; color: #374151; line-height: 1.4;">
//                         <p style="margin: 2px 0;"><strong>Lat:</strong> ${lat.toFixed(6)}</p>
//                         <p style="margin: 2px 0;"><strong>Lng:</strong> ${lng.toFixed(6)}</p>
//                     </div>
//                 </div>
//             `
//         });

//         marker.addListener('click', () => {
//             infoWindow.open(googleMapRef.current, marker);
//         });

//         currentLocationMarkerRef.current = { marker, circle: pulseCircle, infoWindow };
//     };

//     const fetchExistingAds = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/ads?limit=1000`, getAuthConfig());
//             const data = await response.json();

//             if (data.success) {
//                 const locationBasedAds = data.ads.filter(ad =>
//                     ad.locationTargeting?.isLocationBased &&
//                     ad.locationTargeting.center?.latitude &&
//                     ad.locationTargeting.center?.longitude
//                 );
//                 setExistingAds(locationBasedAds);
//             }
//         } catch (error) {
//             console.error('Error fetching existing ads:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateMapMarkers = () => {
//         if (!googleMapRef.current) return;

//         markersRef.current.forEach(({ marker, circle }) => {
//             marker.setMap(null);
//             circle.setMap(null);
//         });
//         markersRef.current = [];

//         existingAds.forEach(ad => {
//             const { latitude, longitude } = ad.locationTargeting.center;
//             const radius = ad.locationTargeting.radius * 1000;

//             const marker = new window.google.maps.Marker({
//                 position: { lat: latitude, lng: longitude },
//                 map: googleMapRef.current,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: 10,
//                     fillColor: getAdTypeColor(ad.type),
//                     fillOpacity: 0.9,
//                     strokeColor: '#ffffff',
//                     strokeWeight: 2
//                 },
//                 title: ad.name
//             });

//             const circle = new window.google.maps.Circle({
//                 strokeColor: getAdTypeColor(ad.type),
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//                 fillColor: getAdTypeColor(ad.type),
//                 fillOpacity: 0.1,
//                 map: googleMapRef.current,
//                 center: { lat: latitude, lng: longitude },
//                 radius: radius
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: createPopupContent(ad)
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//             });

//             markersRef.current.push({ marker, circle, infoWindow });
//         });
//     };

//     const updateNewAdMarker = (lat, lng) => {
//         if (!googleMapRef.current) return;

//         if (newAdMarkerRef.current) {
//             newAdMarkerRef.current.setMap(null);
//             newAdMarkerRef.current = null;
//         }
//         if (newAdCircleRef.current) {
//             newAdCircleRef.current.setMap(null);
//             newAdCircleRef.current = null;
//         }

//         if (lat && lng && newAdRadius) {
//             // Using default Google Maps marker with blue color for new ad location
//             const marker = new window.google.maps.Marker({
//                 position: { lat, lng },
//                 map: googleMapRef.current,
//                 icon: {
//                     url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
//                     scaledSize: new window.google.maps.Size(32, 32),
//                     origin: new window.google.maps.Point(0, 0),
//                     anchor: new window.google.maps.Point(16, 32)
//                 },
//                 title: 'New Ad Location',
//                 animation: window.google.maps.Animation.BOUNCE,
//                 zIndex: 999
//             });

//             // Stop bouncing after 2 seconds
//             setTimeout(() => {
//                 if (marker) {
//                     marker.setAnimation(null);
//                 }
//             }, 2000);

//             const circle = new window.google.maps.Circle({
//                 strokeColor: '#3b82f6',
//                 strokeOpacity: 0.8,
//                 strokeWeight: 3,
//                 fillColor: '#3b82f6',
//                 fillOpacity: 0.15,
//                 map: googleMapRef.current,
//                 center: { lat, lng },
//                 radius: newAdRadius * 1000,
//                 clickable: false
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: `
//                     <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px;">
//                         <div style="display: flex; align-items: center; margin-bottom: 10px;">
//                             <span style="font-size: 18px; margin-right: 8px;">🎯</span>
//                             <h4 style="color: #1e40af; margin: 0; font-size: 15px; font-weight: 600;">New Ad Location</h4>
//                         </div>
//                         <div style="background: #f8fafc; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
//                             <div style="font-size: 13px; color: #475569; line-height: 1.5;">
//                                 <div style="margin: 2px 0;"><strong>Type:</strong> <span style="color: #3b82f6; font-weight: 500;">${newAdType || 'Not selected'}</span></div>
//                                 <div style="margin: 2px 0;"><strong>Radius:</strong> <span style="color: #059669;">${newAdRadius} km</span></div>
//                             </div>
//                         </div>
//                         <div style="font-size: 12px; color: #64748b; line-height: 1.3;">
//                             <div><strong>Coordinates:</strong></div>
//                             <div>Lat: ${lat.toFixed(6)}</div>
//                             <div>Lng: ${lng.toFixed(6)}</div>
//                         </div>
//                     </div>
//                 `
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//             });

//             newAdMarkerRef.current = marker;
//             newAdCircleRef.current = circle;
//         }
//     };

//     const getAdTypeColor = (adType) => {
//         const colors = {
//             BANNER: '#3b82f6',
//             POPUP: '#8b5cf6',
//             INTERSTITIAL: '#f59e0b',
//             NATIVE: '#10b981',
//             VIDEO: '#ef4444'
//         };
//         return colors[adType] || '#6b7280';
//     };

//     const createPopupContent = (ad) => {
//         const isActive = ad.isActive;
//         const hasSchedule = ad.scheduling?.isScheduled;

//         return `
//             <div style="padding: 12px; min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
//                 <h4 style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600; font-size: 15px;">${ad.name}</h4>
//                 <div style="display: flex; align-items: center; margin-bottom: 10px;">
//                     <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getAdTypeColor(ad.type)}; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
//                     <span style="font-size: 14px; color: #374151; font-weight: 500;">${ad.type}</span>
//                 </div>
//                 <div style="background: #f9fafb; border-radius: 6px; padding: 8px; font-size: 12px; color: #6b7280; line-height: 1.5;">
//                     <div style="margin: 2px 0;"><strong>Status:</strong> <span style="color: ${isActive ? '#059669' : '#dc2626'}; font-weight: 500;">${isActive ? '✓ Active' : '✗ Inactive'}</span></div>
//                     <div style="margin: 2px 0;"><strong>Radius:</strong> ${ad.locationTargeting.radius} km</div>
//                     <div style="margin: 2px 0;"><strong>Impressions:</strong> ${(ad.analytics?.impressions || 0).toLocaleString()}</div>
//                     <div style="margin: 2px 0;"><strong>Clicks:</strong> ${(ad.analytics?.clicks || 0).toLocaleString()}</div>
//                     ${hasSchedule ? `
//                         <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
//                             <div style="font-size: 11px;"><strong>Schedule:</strong></div>
//                             <div style="font-size: 11px; color: #9ca3af;">
//                                 ${new Date(ad.scheduling.startDate).toLocaleDateString()} - 
//                                 ${new Date(ad.scheduling.endDate).toLocaleDateString()}
//                             </div>
//                         </div>
//                     ` : ''}
//                 </div>
//             </div>
//         `;
//     };

//     const checkConflicts = () => {
//         if (!newAdLocation || !newAdRadius || !newAdType) {
//             setConflicts([]);
//             return;
//         }

//         const newConflicts = [];

//         existingAds.forEach(ad => {
//             if (ad.type !== newAdType) return;
//             if (!ad.isActive) return;

//             const distance = calculateDistance(
//                 newAdLocation.lat,
//                 newAdLocation.lng,
//                 ad.locationTargeting.center.latitude,
//                 ad.locationTargeting.center.longitude
//             );

//             const combinedRadius = newAdRadius + ad.locationTargeting.radius;

//             if (distance < combinedRadius) {
//                 let hasTimeConflict = true;

//                 if (ad.scheduling?.isScheduled && scheduledStartDate && scheduledEndDate) {
//                     const existingStart = new Date(ad.scheduling.startDate);
//                     const existingEnd = new Date(ad.scheduling.endDate);
//                     const newStart = new Date(scheduledStartDate);
//                     const newEnd = new Date(scheduledEndDate);

//                     hasTimeConflict = !(newEnd < existingStart || newStart > existingEnd);
//                 }

//                 if (hasTimeConflict) {
//                     newConflicts.push({
//                         ad,
//                         distance: distance.toFixed(2),
//                         overlap: (combinedRadius - distance).toFixed(2)
//                     });
//                 }
//             }
//         });

//         setConflicts(newConflicts);
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371;
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//     };

//     return (
//         <div className="space-y-4">
//             {/* Enhanced Map Container */}
//             <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                     ref={mapRef}
//                     className="w-full h-96 rounded-xl"
//                     style={{ minHeight: '400px' }}
//                 />

//                 {/* Enhanced Location Button */}
//                 <button
//                     onClick={getCurrentLocation}
//                     disabled={gettingLocation}
//                     className="absolute top-4 right-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
//                     title="Get Current Location"
//                 >
//                     {gettingLocation ? (
//                         <Loader size={20} className="text-blue-600 animate-spin" />
//                     ) : (
//                         <Navigation size={20} className="text-blue-600" />
//                     )}
//                 </button>

//                 {/* Enhanced Loading Overlay */}
//                 {loading && (
//                     <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center rounded-xl">
//                         <div className="text-center bg-white p-6 rounded-lg shadow-lg">
//                             <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
//                             <p className="text-sm text-gray-600 font-medium">Loading existing ads...</p>
//                             <p className="text-xs text-gray-500 mt-1">Please wait while we fetch location data</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Enhanced Error Message */}
//             {locationError && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
//                     <div className="flex items-start space-x-3">
//                         <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                             <p className="text-red-800 font-semibold">Location Error</p>
//                             <p className="text-red-700 text-sm mt-1">{locationError}</p>
//                         </div>
//                         <button
//                             onClick={() => setLocationError(null)}
//                             className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded-lg transition-colors"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Enhanced Usage Instructions */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
//                 <div className="flex items-start space-x-3">
//                     <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
//                     <div className="text-sm">
//                         <p className="text-blue-800 font-semibold mb-2">How to use this map:</p>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                             <ul className="text-blue-700 space-y-1">
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Click <Navigation size={14} className="inline mx-1" /> for current location
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Click map to set custom location
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Blue marker shows new ad location
//                                 </li>
//                             </ul>
//                             <ul className="text-blue-700 space-y-1">
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Colored circles show existing ads
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Green marker is current location
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Click markers for details
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Map Legend */}
//             <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                 <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                     <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
//                     Map Legend
//                 </h4>
//                 <div className="space-y-4">
//                     <div>
//                         <p className="text-sm font-medium text-gray-700 mb-3">Ad Types:</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
//                             {['BANNER', 'POPUP', 'INTERSTITIAL', 'NATIVE', 'VIDEO'].map(type => (
//                                 <div key={type} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
//                                     <div
//                                         className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
//                                         style={{ backgroundColor: getAdTypeColor(type) }}
//                                     ></div>
//                                     <span className="text-sm text-gray-700 font-medium">{type}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <p className="text-sm font-medium text-gray-700 mb-3">Special Markers:</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                             <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
//                                 <img
//                                     src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//                                     alt="New Ad"
//                                     className="w-4 h-4"
//                                 />
//                                 <span className="text-sm text-gray-700 font-medium">🎯 New Ad Location</span>
//                             </div>
//                             <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
//                                 <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
//                                 <span className="text-sm text-gray-700 font-medium">📍 Current Location</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Conflicts Section */}
//             {conflicts.length > 0 && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
//                     <div className="flex items-start space-x-3">
//                         <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                             <h4 className="font-semibold text-red-800 mb-2">
//                                 ⚠️ Conflicts Detected ({conflicts.length})
//                             </h4>
//                             <p className="text-sm text-red-700 mb-4">
//                                 Your new ad conflicts with existing {newAdType} ads in the same area:
//                             </p>
//                             <div className="space-y-3">
//                                 {conflicts.map((conflict, index) => (
//                                     <div key={index} className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
//                                         <div className="flex justify-between items-start">
//                                             <div className="flex-1">
//                                                 <p className="font-semibold text-gray-900 mb-1">{conflict.ad.name}</p>
//                                                 <div className="text-sm text-gray-600 space-y-1">
//                                                     <p>
//                                                         <span className="font-medium">Distance:</span> {conflict.distance} km |
//                                                         <span className="font-medium ml-2">Overlap:</span> {conflict.overlap} km
//                                                     </p>
//                                                     {conflict.ad.scheduling?.isScheduled && (
//                                                         <p className="text-gray-500">
//                                                             <span className="font-medium">Scheduled:</span> {new Date(conflict.ad.scheduling.startDate).toLocaleDateString()} - {new Date(conflict.ad.scheduling.endDate).toLocaleDateString()}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${conflict.ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                                                 {conflict.ad.isActive ? '✓ Active' : '✗ Inactive'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Enhanced Selected Location Info */}
//             {(newAdLocation || (locationInputs.lat && locationInputs.lng)) && (
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
//                     <h4 className="font-semibold text-green-800 mb-3 flex items-center">
//                         <span className="text-lg mr-2">✅</span>
//                         Selected Location
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-green-700">
//                         <div className="bg-white p-3 rounded-lg border border-green-200">
//                             <p className="font-medium text-green-800">Latitude</p>
//                             <p className="text-green-600 font-mono">{newAdLocation?.lat?.toFixed(6) || locationInputs.lat}</p>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg border border-green-200">
//                             <p className="font-medium text-green-800">Longitude</p>
//                             <p className="text-green-600 font-mono">{newAdLocation?.lng?.toFixed(6) || locationInputs.lng}</p>
//                         </div>
//                         {newAdRadius && (
//                             <div className="bg-white p-3 rounded-lg border border-green-200">
//                                 <p className="font-medium text-green-800">Radius</p>
//                                 <p className="text-green-600">{newAdRadius} km</p>
//                             </div>
//                         )}
//                     </div>
//                     {conflicts.length === 0 && newAdType && (
//                         <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-300">
//                             <p className="text-green-700 font-medium flex items-center">
//                                 <span className="mr-2">🎉</span>
//                                 No conflicts detected - Location is clear for {newAdType} ads!
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MapView;





// import React, { useState, useEffect, useRef } from 'react';
// import { AlertTriangle, Info, Navigation, Loader, X } from 'lucide-react';

// const MapView = ({
//     base_url,
//     getAuthConfig,
//     newAdLocation,
//     newAdRadius,
//     newAdType,
//     onLocationSelect,
//     scheduledStartDate,
//     scheduledEndDate,
//     locationInputs = { lat: '', lng: '' },
//     onInputChange
// }) => {
//     const mapRef = useRef(null);
//     const googleMapRef = useRef(null);
//     const [existingAds, setExistingAds] = useState([]);
//     const [conflicts, setConflicts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [gettingLocation, setGettingLocation] = useState(false);
//     const [locationError, setLocationError] = useState(null);

//     const markersRef = useRef([]);
//     const newAdMarkerRef = useRef(null);
//     const newAdCircleRef = useRef(null);
//     const currentLocationMarkerRef = useRef(null);

//     useEffect(() => {
//         initializeGoogleMap();
//         return () => {
//             if (googleMapRef.current) {
//                 googleMapRef.current = null;
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (googleMapRef.current) {
//             fetchExistingAds();
//         }
//     }, [googleMapRef.current]);

//     useEffect(() => {
//         if (googleMapRef.current && existingAds.length > 0) {
//             updateMapMarkers();
//             checkConflicts();
//         }
//     }, [existingAds, newAdLocation, newAdRadius, newAdType, scheduledStartDate, scheduledEndDate]);

//     useEffect(() => {
//         if (locationInputs.lat && locationInputs.lng && googleMapRef.current) {
//             const lat = parseFloat(locationInputs.lat);
//             const lng = parseFloat(locationInputs.lng);
//             if (!isNaN(lat) && !isNaN(lng)) {
//                 updateNewAdMarker(lat, lng);
//                 googleMapRef.current.setCenter({ lat, lng });
//             }
//         }
//     }, [locationInputs.lat, locationInputs.lng, newAdRadius]);

//     const initializeGoogleMap = () => {
//         if (!window.google) {
//             loadGoogleMapsScript();
//             return;
//         }

//         if (!mapRef.current) return;

//         const map = new window.google.maps.Map(mapRef.current, {
//             center: { lat: 26.8467, lng: 80.9462 },
//             zoom: 13,
//             mapTypeId: 'roadmap',
//             styles: [
//                 {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'on' }]
//                 },
//                 {
//                     featureType: 'transit',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'on' }]
//                 }
//             ]
//         });

//         googleMapRef.current = map;

//         map.addListener('click', (event) => {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();

//             if (onLocationSelect) {
//                 onLocationSelect(lat, lng);
//             }

//             if (onInputChange) {
//                 onInputChange({
//                     lat: lat.toFixed(6),
//                     lng: lng.toFixed(6)
//                 });
//             }

//             updateNewAdMarker(lat, lng);
//         });
//     };

//     const loadGoogleMapsScript = () => {
//         if (window.google) {
//             initializeGoogleMap();
//             return;
//         }

//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
//         script.async = true;
//         script.defer = true;
//         script.onload = initializeGoogleMap;
//         document.head.appendChild(script);
//     };

//     const getCurrentLocation = () => {
//         setGettingLocation(true);
//         setLocationError(null);

//         if (!navigator.geolocation) {
//             setLocationError('Geolocation is not supported by this browser.');
//             setGettingLocation(false);
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lng = position.coords.longitude;

//                 if (onLocationSelect) {
//                     onLocationSelect(lat, lng);
//                 }

//                 if (onInputChange) {
//                     onInputChange({
//                         lat: lat.toFixed(6),
//                         lng: lng.toFixed(6)
//                     });
//                 }

//                 updateCurrentLocationMarker(lat, lng);
//                 updateNewAdMarker(lat, lng);

//                 if (googleMapRef.current) {
//                     googleMapRef.current.setCenter({ lat, lng });
//                     googleMapRef.current.setZoom(15);
//                 }

//                 setGettingLocation(false);
//             },
//             (error) => {
//                 let errorMessage = 'Unable to retrieve your location.';
//                 switch (error.code) {
//                     case error.PERMISSION_DENIED:
//                         errorMessage = 'Location access denied by user.';
//                         break;
//                     case error.POSITION_UNAVAILABLE:
//                         errorMessage = 'Location information is unavailable.';
//                         break;
//                     case error.TIMEOUT:
//                         errorMessage = 'Location request timed out.';
//                         break;
//                 }
//                 setLocationError(errorMessage);
//                 setGettingLocation(false);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 60000
//             }
//         );
//     };

//     const updateCurrentLocationMarker = (lat, lng) => {
//         if (!googleMapRef.current) return;

//         if (currentLocationMarkerRef.current) {
//             currentLocationMarkerRef.current.marker.setMap(null);
//             currentLocationMarkerRef.current.circle.setMap(null);
//             currentLocationMarkerRef.current = null;
//         }

//         // const marker = new window.google.maps.Marker({
//         //     position: { lat, lng },
//         //     map: googleMapRef.current,
//         //     icon: {
//         //         path: window.google.maps.SymbolPath.CIRCLE,
//         //         scale: 12,
//         //         fillColor: '#4ade80',
//         //         fillOpacity: 1,
//         //         strokeColor: '#ffffff',
//         //         strokeWeight: 3
//         //     },
//         //     title: 'Current Location',
//         //     zIndex: 1000
//         // });

//         const pulseCircle = new window.google.maps.Circle({
//             strokeColor: '#4ade80',
//             strokeOpacity: 0.6,
//             strokeWeight: 2,
//             fillColor: '#4ade80',
//             fillOpacity: 0.1,
//             map: googleMapRef.current,
//             center: { lat, lng },
//             radius: 100,
//             clickable: false // Make sure current location circle doesn't block clicks
//         });

//         const infoWindow = new window.google.maps.InfoWindow({
//             content: `
//                 <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
//                     <div style="display: flex; align-items: center; margin-bottom: 8px;">
//                         <span style="font-size: 16px; margin-right: 8px;">📍</span>
//                         <h4 style="color: #065f46; margin: 0; font-size: 14px; font-weight: 600;">Current Location</h4>
//                     </div>
//                     <div style="font-size: 13px; color: #374151; line-height: 1.4;">
//                         <p style="margin: 2px 0;"><strong>Lat:</strong> ${lat.toFixed(6)}</p>
//                         <p style="margin: 2px 0;"><strong>Lng:</strong> ${lng.toFixed(6)}</p>
//                     </div>
//                 </div>
//             `
//         });

//         marker.addListener('click', () => {
//             infoWindow.open(googleMapRef.current, marker);
//         });

//         currentLocationMarkerRef.current = { marker, circle: pulseCircle, infoWindow };
//     };

//     const fetchExistingAds = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/ads?limit=1000`, getAuthConfig());
//             const data = await response.json();

//             if (data.success) {
//                 const locationBasedAds = data.ads.filter(ad =>
//                     ad.locationTargeting?.isLocationBased &&
//                     ad.locationTargeting.center?.latitude &&
//                     ad.locationTargeting.center?.longitude
//                 );
//                 setExistingAds(locationBasedAds);
//             }
//         } catch (error) {
//             console.error('Error fetching existing ads:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateMapMarkers = () => {
//         if (!googleMapRef.current) return;

//         markersRef.current.forEach(({ marker, circle }) => {
//             marker.setMap(null);
//             circle.setMap(null);
//         });
//         markersRef.current = [];

//         existingAds.forEach(ad => {
//             const { latitude, longitude } = ad.locationTargeting.center;
//             const radius = ad.locationTargeting.radius * 1000;

//             const marker = new window.google.maps.Marker({
//                 position: { lat: latitude, lng: longitude },
//                 map: googleMapRef.current,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: 10,
//                     fillColor: getAdTypeColor(ad.type),
//                     fillOpacity: 0.9,
//                     strokeColor: '#ffffff',
//                     strokeWeight: 2
//                 },
//                 title: ad.name
//             });

//             // CRITICAL FIX: Make existing ad circles non-clickable so map clicks pass through
//             const circle = new window.google.maps.Circle({
//                 strokeColor: getAdTypeColor(ad.type),
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//                 fillColor: getAdTypeColor(ad.type),
//                 fillOpacity: 0.1,
//                 map: googleMapRef.current,
//                 center: { lat: latitude, lng: longitude },
//                 radius: radius,
//                 clickable: false // This is the key fix - allows clicks to pass through to the map
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: createPopupContent(ad)
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//             });

//             markersRef.current.push({ marker, circle, infoWindow });
//         });
//     };

//     const updateNewAdMarker = (lat, lng) => {
//         if (!googleMapRef.current) return;

//         if (newAdMarkerRef.current) {
//             newAdMarkerRef.current.setMap(null);
//             newAdMarkerRef.current = null;
//         }
//         if (newAdCircleRef.current) {
//             newAdCircleRef.current.setMap(null);
//             newAdCircleRef.current = null;
//         }

//         if (lat && lng && newAdRadius) {
//             // Using default Google Maps marker with blue color for new ad location
//             const marker = new window.google.maps.Marker({
//                 position: { lat, lng },
//                 map: googleMapRef.current,
//                 icon: {
//                     url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
//                     scaledSize: new window.google.maps.Size(32, 32),
//                     origin: new window.google.maps.Point(0, 0),
//                     anchor: new window.google.maps.Point(16, 32)
//                 },
//                 title: 'New Ad Location',
//                 animation: window.google.maps.Animation.BOUNCE,
//                 zIndex: 999
//             });

//             // Stop bouncing after 2 seconds
//             setTimeout(() => {
//                 if (marker) {
//                     marker.setAnimation(null);
//                 }
//             }, 2000);

//             const circle = new window.google.maps.Circle({
//                 strokeColor: '#3b82f6',
//                 strokeOpacity: 0.8,
//                 strokeWeight: 3,
//                 fillColor: '#3b82f6',
//                 fillOpacity: 0.15,
//                 map: googleMapRef.current,
//                 center: { lat, lng },
//                 radius: newAdRadius * 1000,
//                 clickable: false // Make new ad circle non-clickable too
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: `
//                     <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px;">
//                         <div style="display: flex; align-items: center; margin-bottom: 10px;">
//                             <span style="font-size: 18px; margin-right: 8px;">🎯</span>
//                             <h4 style="color: #1e40af; margin: 0; font-size: 15px; font-weight: 600;">New Ad Location</h4>
//                         </div>
//                         <div style="background: #f8fafc; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
//                             <div style="font-size: 13px; color: #475569; line-height: 1.5;">
//                                 <div style="margin: 2px 0;"><strong>Type:</strong> <span style="color: #3b82f6; font-weight: 500;">${newAdType || 'Not selected'}</span></div>
//                                 <div style="margin: 2px 0;"><strong>Radius:</strong> <span style="color: #059669;">${newAdRadius} km</span></div>
//                             </div>
//                         </div>
//                         <div style="font-size: 12px; color: #64748b; line-height: 1.3;">
//                             <div><strong>Coordinates:</strong></div>
//                             <div>Lat: ${lat.toFixed(6)}</div>
//                             <div>Lng: ${lng.toFixed(6)}</div>
//                         </div>
//                     </div>
//                 `
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//             });

//             newAdMarkerRef.current = marker;
//             newAdCircleRef.current = circle;
//         }
//     };

//     const getAdTypeColor = (adType) => {
//         const colors = {
//             BANNER: '#3b82f6',
//             POPUP: '#8b5cf6',
//             INTERSTITIAL: '#f59e0b',
//             NATIVE: '#10b981',
//             VIDEO: '#ef4444'
//         };
//         return colors[adType] || '#6b7280';
//     };

//     const createPopupContent = (ad) => {
//         const isActive = ad.isActive;
//         const hasSchedule = ad.scheduling?.isScheduled;

//         return `
//             <div style="padding: 12px; min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
//                 <h4 style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600; font-size: 15px;">${ad.name}</h4>
//                 <div style="display: flex; align-items: center; margin-bottom: 10px;">
//                     <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getAdTypeColor(ad.type)}; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
//                     <span style="font-size: 14px; color: #374151; font-weight: 500;">${ad.type}</span>
//                 </div>
//                 <div style="background: #f9fafb; border-radius: 6px; padding: 8px; font-size: 12px; color: #6b7280; line-height: 1.5;">
//                     <div style="margin: 2px 0;"><strong>Status:</strong> <span style="color: ${isActive ? '#059669' : '#dc2626'}; font-weight: 500;">${isActive ? '✓ Active' : '✗ Inactive'}</span></div>
//                     <div style="margin: 2px 0;"><strong>Radius:</strong> ${ad.locationTargeting.radius} km</div>
//                     <div style="margin: 2px 0;"><strong>Impressions:</strong> ${(ad.analytics?.impressions || 0).toLocaleString()}</div>
//                     <div style="margin: 2px 0;"><strong>Clicks:</strong> ${(ad.analytics?.clicks || 0).toLocaleString()}</div>
//                     ${hasSchedule ? `
//                         <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
//                             <div style="font-size: 11px;"><strong>Schedule:</strong></div>
//                             <div style="font-size: 11px; color: #9ca3af;">
//                                 ${new Date(ad.scheduling.startDate).toLocaleDateString()} - 
//                                 ${new Date(ad.scheduling.endDate).toLocaleDateString()}
//                             </div>
//                         </div>
//                     ` : ''}
//                 </div>
//             </div>
//         `;
//     };

//     const checkConflicts = () => {
//         if (!newAdLocation || !newAdRadius || !newAdType) {
//             setConflicts([]);
//             return;
//         }

//         const newConflicts = [];

//         existingAds.forEach(ad => {
//             if (ad.type !== newAdType) return;
//             if (!ad.isActive) return;

//             const distance = calculateDistance(
//                 newAdLocation.lat,
//                 newAdLocation.lng,
//                 ad.locationTargeting.center.latitude,
//                 ad.locationTargeting.center.longitude
//             );

//             const combinedRadius = newAdRadius + ad.locationTargeting.radius;

//             if (distance < combinedRadius) {
//                 let hasTimeConflict = true;

//                 if (ad.scheduling?.isScheduled && scheduledStartDate && scheduledEndDate) {
//                     const existingStart = new Date(ad.scheduling.startDate);
//                     const existingEnd = new Date(ad.scheduling.endDate);
//                     const newStart = new Date(scheduledStartDate);
//                     const newEnd = new Date(scheduledEndDate);

//                     hasTimeConflict = !(newEnd < existingStart || newStart > existingEnd);
//                 }

//                 if (hasTimeConflict) {
//                     newConflicts.push({
//                         ad,
//                         distance: distance.toFixed(2),
//                         overlap: (combinedRadius - distance).toFixed(2)
//                     });
//                 }
//             }
//         });

//         setConflicts(newConflicts);
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371;
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//     };

//     return (
//         <div className="space-y-4">
//             {/* Enhanced Map Container */}
//             <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                     ref={mapRef}
//                     className="w-full h-96 rounded-xl"
//                     style={{ minHeight: '400px' }}
//                 />

//                 {/* Enhanced Location Button */}
//                 <button
//                     onClick={getCurrentLocation}
//                     disabled={gettingLocation}
//                     className="absolute top-4 right-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
//                     title="Get Current Location"
//                 >
//                     {gettingLocation ? (
//                         <Loader size={20} className="text-blue-600 animate-spin" />
//                     ) : (
//                         <Navigation size={20} className="text-blue-600" />
//                     )}
//                 </button>

//                 {/* Enhanced Loading Overlay */}
//                 {loading && (
//                     <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center rounded-xl">
//                         <div className="text-center bg-white p-6 rounded-lg shadow-lg">
//                             <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
//                             <p className="text-sm text-gray-600 font-medium">Loading existing ads...</p>
//                             <p className="text-xs text-gray-500 mt-1">Please wait while we fetch location data</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Enhanced Error Message */}
//             {locationError && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
//                     <div className="flex items-start space-x-3">
//                         <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                             <p className="text-red-800 font-semibold">Location Error</p>
//                             <p className="text-red-700 text-sm mt-1">{locationError}</p>
//                         </div>
//                         <button
//                             onClick={() => setLocationError(null)}
//                             className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded-lg transition-colors"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Enhanced Usage Instructions */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
//                 <div className="flex items-start space-x-3">
//                     <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
//                     <div className="text-sm">
//                         <p className="text-blue-800 font-semibold mb-2">How to use this map:</p>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                             <ul className="text-blue-700 space-y-1">
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Click <Navigation size={14} className="inline mx-1" /> for current location
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Click anywhere on map to set location
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Blue marker shows new ad location
//                                 </li>
//                             </ul>
//                             <ul className="text-blue-700 space-y-1">
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Colored circles show existing ads
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Green marker is current location
//                                 </li>
//                                 <li className="flex items-center">
//                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
//                                     Click markers for details
//                                 </li>
//                             </ul>
//                         </div>
//                         <div className="mt-3 p-2 bg-blue-100 rounded-lg">
//                             <p className="text-blue-800 text-xs font-medium">
//                                 ✨ <strong>Fixed:</strong> You can now click anywhere on the map, even within existing ad radius circles, to place new ads of different types!
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Map Legend */}
//             <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                 <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                     <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
//                     Map Legend
//                 </h4>
//                 <div className="space-y-4">
//                     <div>
//                         <p className="text-sm font-medium text-gray-700 mb-3">Ad Types:</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
//                             {['BANNER', 'POPUP', 'INTERSTITIAL', 'NATIVE', 'VIDEO'].map(type => (
//                                 <div key={type} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
//                                     <div
//                                         className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
//                                         style={{ backgroundColor: getAdTypeColor(type) }}
//                                     ></div>
//                                     <span className="text-sm text-gray-700 font-medium">{type}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <p className="text-sm font-medium text-gray-700 mb-3">Special Markers:</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                             <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
//                                 <img
//                                     src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//                                     alt="New Ad"
//                                     className="w-4 h-4"
//                                 />
//                                 <span className="text-sm text-gray-700 font-medium">🎯 New Ad Location</span>
//                             </div>
//                             <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
//                                 <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
//                                 <span className="text-sm text-gray-700 font-medium">📍 Current Location</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Conflicts Section */}
//             {conflicts.length > 0 && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
//                     <div className="flex items-start space-x-3">
//                         <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                             <h4 className="font-semibold text-red-800 mb-2">
//                                 ⚠️ Conflicts Detected ({conflicts.length})
//                             </h4>
//                             <p className="text-sm text-red-700 mb-4">
//                                 Your new ad conflicts with existing {newAdType} ads in the same area:
//                             </p>
//                             <div className="space-y-3">
//                                 {conflicts.map((conflict, index) => (
//                                     <div key={index} className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
//                                         <div className="flex justify-between items-start">
//                                             <div className="flex-1">
//                                                 <p className="font-semibold text-gray-900 mb-1">{conflict.ad.name}</p>
//                                                 <div className="text-sm text-gray-600 space-y-1">
//                                                     <p>
//                                                         <span className="font-medium">Distance:</span> {conflict.distance} km |
//                                                         <span className="font-medium ml-2">Overlap:</span> {conflict.overlap} km
//                                                     </p>
//                                                     {conflict.ad.scheduling?.isScheduled && (
//                                                         <p className="text-gray-500">
//                                                             <span className="font-medium">Scheduled:</span> {new Date(conflict.ad.scheduling.startDate).toLocaleDateString()} - {new Date(conflict.ad.scheduling.endDate).toLocaleDateString()}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${conflict.ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                                                 {conflict.ad.isActive ? '✓ Active' : '✗ Inactive'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Enhanced Selected Location Info */}
//             {(newAdLocation || (locationInputs.lat && locationInputs.lng)) && (
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
//                     <h4 className="font-semibold text-green-800 mb-3 flex items-center">
//                         <span className="text-lg mr-2">✅</span>
//                         Selected Location
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-green-700">
//                         <div className="bg-white p-3 rounded-lg border border-green-200">
//                             <p className="font-medium text-green-800">Latitude</p>
//                             <p className="text-green-600 font-mono">{newAdLocation?.lat?.toFixed(6) || locationInputs.lat}</p>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg border border-green-200">
//                             <p className="font-medium text-green-800">Longitude</p>
//                             <p className="text-green-600 font-mono">{newAdLocation?.lng?.toFixed(6) || locationInputs.lng}</p>
//                         </div>
//                         {newAdRadius && (
//                             <div className="bg-white p-3 rounded-lg border border-green-200">
//                                 <p className="font-medium text-green-800">Radius</p>
//                                 <p className="text-green-600">{newAdRadius} km</p>
//                             </div>
//                         )}
//                     </div>
//                     {conflicts.length === 0 && newAdType && (
//                         <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-300">
//                             <p className="text-green-700 font-medium flex items-center">
//                                 <span className="mr-2">🎉</span>
//                                 No conflicts detected - Location is clear for {newAdType} ads!
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MapView;



import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Info, Navigation, Loader, X } from 'lucide-react';

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

    // Create custom marker icon for different ad types
    const createCustomMarkerIcon = (color, isNew = false) => {
        const svg = `
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="${color}"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
                ${isNew ? '<circle cx="16" cy="16" r="3" fill="' + color + '"/>' : '<circle cx="16" cy="16" r="3" fill="' + color + '"/>'}
            </svg>
        `;
        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
            scaledSize: new window.google.maps.Size(32, 40),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(16, 40)
        };
    };

    const initializeGoogleMap = () => {
        if (!window.google) {
            loadGoogleMapsScript();
            return;
        }

        if (!mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 26.8467, lng: 80.9462 },
            zoom: 13,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'on' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'labels',
                    stylers: [{ visibility: 'on' }]
                }
            ]
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

        // Use custom green marker for current location
        // const marker = new window.google.maps.Marker({
        //     position: { lat, lng },
        //     map: googleMapRef.current,
        //     icon: createCustomMarkerIcon('#4ade80'),
        //     title: 'Current Location',
        //     zIndex: 1000
        // });

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
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 16px; margin-right: 8px;">📍</span>
                        <h4 style="color: #065f46; margin: 0; font-size: 14px; font-weight: 600;">Current Location</h4>
                    </div>
                    <div style="font-size: 13px; color: #374151; line-height: 1.4;">
                        <p style="margin: 2px 0;"><strong>Lat:</strong> ${lat.toFixed(6)}</p>
                        <p style="margin: 2px 0;"><strong>Lng:</strong> ${lng.toFixed(6)}</p>
                    </div>
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

            // Use custom marker instead of circle marker
            const marker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: googleMapRef.current,
                icon: createCustomMarkerIcon(getAdTypeColor(ad.type)),
                title: ad.name
            });

            // Keep the circle for radius visualization
            const circle = new window.google.maps.Circle({
                strokeColor: getAdTypeColor(ad.type),
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: getAdTypeColor(ad.type),
                fillOpacity: 0.1,
                map: googleMapRef.current,
                center: { lat: latitude, lng: longitude },
                radius: radius,
                clickable: false
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
            // Create draggable marker for new ad location
            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map: googleMapRef.current,
                icon: createCustomMarkerIcon('#3b82f6', true),
                title: 'New Ad Location (Drag to move)',
                animation: window.google.maps.Animation.BOUNCE,
                draggable: true, // Make the marker draggable
                zIndex: 999
            });

            // Stop bouncing after 2 seconds
            setTimeout(() => {
                if (marker) {
                    marker.setAnimation(null);
                }
            }, 2000);

            // Add drag end listener to update location
            marker.addListener('dragend', (event) => {
                const newLat = event.latLng.lat();
                const newLng = event.latLng.lng();

                if (onLocationSelect) {
                    onLocationSelect(newLat, newLng);
                }

                if (onInputChange) {
                    onInputChange({
                        lat: newLat.toFixed(6),
                        lng: newLng.toFixed(6)
                    });
                }

                // Update the circle position
                if (newAdCircleRef.current) {
                    newAdCircleRef.current.setCenter({ lat: newLat, lng: newLng });
                }
            });

            const circle = new window.google.maps.Circle({
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                map: googleMapRef.current,
                center: { lat, lng },
                radius: newAdRadius * 1000,
                clickable: false
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 18px; margin-right: 8px;">🎯</span>
                            <h4 style="color: #1e40af; margin: 0; font-size: 15px; font-weight: 600;">New Ad Location</h4>
                        </div>
                        <div style="background: #f8fafc; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
                            <div style="font-size: 13px; color: #475569; line-height: 1.5;">
                                <div style="margin: 2px 0;"><strong>Type:</strong> <span style="color: #3b82f6; font-weight: 500;">${newAdType || 'Not selected'}</span></div>
                                <div style="margin: 2px 0;"><strong>Radius:</strong> <span style="color: #059669;">${newAdRadius} km</span></div>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #64748b; line-height: 1.3;">
                            <div><strong>Coordinates:</strong></div>
                            <div>Lat: ${lat.toFixed(6)}</div>
                            <div>Lng: ${lng.toFixed(6)}</div>
                        </div>
                        <div style="margin-top: 8px; padding: 6px; background: #dbeafe; border-radius: 4px;">
                            <p style="margin: 0; font-size: 11px; color: #1e40af; font-weight: 500;">
                                💡 Drag this marker to adjust location
                            </p>
                        </div>
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
            <div style="padding: 12px; min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600; font-size: 15px;">${ad.name}</h4>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getAdTypeColor(ad.type)}; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
                    <span style="font-size: 14px; color: #374151; font-weight: 500;">${ad.type}</span>
                </div>
                <div style="background: #f9fafb; border-radius: 6px; padding: 8px; font-size: 12px; color: #6b7280; line-height: 1.5;">
                    <div style="margin: 2px 0;"><strong>Status:</strong> <span style="color: ${isActive ? '#059669' : '#dc2626'}; font-weight: 500;">${isActive ? '✓ Active' : '✗ Inactive'}</span></div>
                    <div style="margin: 2px 0;"><strong>Radius:</strong> ${ad.locationTargeting.radius} km</div>
                    <div style="margin: 2px 0;"><strong>Impressions:</strong> ${(ad.analytics?.impressions || 0).toLocaleString()}</div>
                    <div style="margin: 2px 0;"><strong>Clicks:</strong> ${(ad.analytics?.clicks || 0).toLocaleString()}</div>
                    ${hasSchedule ? `
                        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
                            <div style="font-size: 11px;"><strong>Schedule:</strong></div>
                            <div style="font-size: 11px; color: #9ca3af;">
                                ${new Date(ad.scheduling.startDate).toLocaleDateString()} - 
                                ${new Date(ad.scheduling.endDate).toLocaleDateString()}
                            </div>
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
            {/* Enhanced Map Container */}
            <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div
                    ref={mapRef}
                    className="w-full h-96 rounded-xl"
                    style={{ minHeight: '400px' }}
                />

                {/* Enhanced Location Button */}
                <button
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="absolute top-4 right-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                    title="Get Current Location"
                >
                    {gettingLocation ? (
                        <Loader size={20} className="text-blue-600 animate-spin" />
                    ) : (
                        <Navigation size={20} className="text-blue-600" />
                    )}
                </button>

                {/* Enhanced Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p className="text-sm text-gray-600 font-medium">Loading existing ads...</p>
                            <p className="text-xs text-gray-500 mt-1">Please wait while we fetch location data</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Error Message */}
            {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-800 font-semibold">Location Error</p>
                            <p className="text-red-700 text-sm mt-1">{locationError}</p>
                        </div>
                        <button
                            onClick={() => setLocationError(null)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Enhanced Usage Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                    <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-blue-800 font-semibold mb-2">How to use this map:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <ul className="text-blue-700 space-y-1">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Click <Navigation size={14} className="inline mx-1" /> for current location
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Click anywhere on map to set location
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Drag blue marker to move new ad location
                                </li>
                            </ul>
                            <ul className="text-blue-700 space-y-1">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Colored markers show existing ads
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Green marker is current location
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Click markers for details
                                </li>
                            </ul>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                            <p className="text-blue-800 text-xs font-medium">
                                ✨ <strong>New:</strong> Drag the blue marker to precisely position your new ad location! All markers now have consistent styling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Map Legend */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Map Legend
                </h4>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Ad Types:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                            {['BANNER', 'POPUP', 'INTERSTITIAL', 'NATIVE', 'VIDEO'].map(type => (
                                <div key={type} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-4 h-6 relative flex items-center justify-center">
                                        <svg width="16" height="20" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill={getAdTypeColor(type)} />
                                            <circle cx="16" cy="16" r="6" fill="white" />
                                            <circle cx="16" cy="16" r="3" fill={getAdTypeColor(type)} />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Special Markers:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                <div className="w-4 h-6 relative flex items-center justify-center">
                                    <svg width="16" height="20" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="#3b82f6" />
                                        <circle cx="16" cy="16" r="6" fill="white" />
                                        <circle cx="16" cy="16" r="3" fill="#3b82f6" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700 font-medium">🎯 New Ad Location (Draggable)</span>
                            </div>
                            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                                <div className="w-4 h-6 relative flex items-center justify-center">
                                    <svg width="16" height="20" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="#4ade80" />
                                        <circle cx="16" cy="16" r="6" fill="white" />
                                        <circle cx="16" cy="16" r="3" fill="#4ade80" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700 font-medium">📍 Current Location</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Conflicts Section */}
            {conflicts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-800 mb-2">
                                ⚠️ Conflicts Detected ({conflicts.length})
                            </h4>
                            <p className="text-sm text-red-700 mb-4">
                                Your new ad conflicts with existing {newAdType} ads in the same area:
                            </p>
                            <div className="space-y-3">
                                {conflicts.map((conflict, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 mb-1">{conflict.ad.name}</p>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p>
                                                        <span className="font-medium">Distance:</span> {conflict.distance} km |
                                                        <span className="font-medium ml-2">Overlap:</span> {conflict.overlap} km
                                                    </p>
                                                    {conflict.ad.scheduling?.isScheduled && (
                                                        <p className="text-gray-500">
                                                            <span className="font-medium">Scheduled:</span> {new Date(conflict.ad.scheduling.startDate).toLocaleDateString()} - {new Date(conflict.ad.scheduling.endDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${conflict.ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {conflict.ad.isActive ? '✓ Active' : '✗ Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Selected Location Info */}
            {(newAdLocation || (locationInputs.lat && locationInputs.lng)) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">✅</span>
                        Selected Location
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-green-700">
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                            <p className="font-medium text-green-800">Latitude</p>
                            <p className="text-green-600 font-mono">{newAdLocation?.lat?.toFixed(6) || locationInputs.lat}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                            <p className="font-medium text-green-800">Longitude</p>
                            <p className="text-green-600 font-mono">{newAdLocation?.lng?.toFixed(6) || locationInputs.lng}</p>
                        </div>
                        {newAdRadius && (
                            <div className="bg-white p-3 rounded-lg border border-green-200">
                                <p className="font-medium text-green-800">Radius</p>
                                <p className="text-green-600">{newAdRadius} km</p>
                            </div>
                        )}
                    </div>
                    {conflicts.length === 0 && newAdType && (
                        <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-300">
                            <p className="text-green-700 font-medium flex items-center">
                                <span className="mr-2">🎉</span>
                                No conflicts detected - Location is clear for {newAdType} ads!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MapView;