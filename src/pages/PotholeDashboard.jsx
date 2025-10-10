// import React, { useState, useEffect, useRef } from 'react';
// import { Filter, Navigation, List, BarChart3, AlertCircle, Clock, CheckCircle, MapPin } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api';
// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// const PotholeDashboard = () => {
//     const [potholes, setPotholes] = useState([]);
//     const [filteredPotholes, setFilteredPotholes] = useState([]);
//     const [view, setView] = useState('map');
//     const [filters, setFilters] = useState({
//         status: 'all',
//         severity: 'all',
//         position: 'all'
//     });
//     const [selectedPothole, setSelectedPothole] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [stats, setStats] = useState({
//         total: 0,
//         reported: 0,
//         inProgress: 0,
//         resolved: 0,
//         dangerous: 0,
//         severe: 0,
//         mild: 0
//     });

//     const mapRef = useRef(null);
//     const googleMapRef = useRef(null);
//     const markersRef = useRef([]);

//     // Load Google Maps
//     useEffect(() => {
//         if (window.google && window.google.maps) {
//             return;
//         }

//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
//         script.async = true;
//         script.defer = true;
//         document.head.appendChild(script);
//     }, []);

//     // Initialize Google Map
//     useEffect(() => {
//         if (!window.google || !window.google.maps || !mapRef.current || view !== 'map') {
//             return;
//         }

//         if (!googleMapRef.current) {
//             googleMapRef.current = new window.google.maps.Map(mapRef.current, {
//                 center: { lat: 26.4499, lng: 80.3319 },
//                 zoom: 12,
//                 mapTypeControl: true,
//                 streetViewControl: true,
//                 fullscreenControl: true,
//             });
//         }
//     }, [view, mapRef.current, window.google]);

//     // Update markers when filtered potholes change
//     useEffect(() => {
//         if (!googleMapRef.current || !window.google) return;

//         // Clear existing markers
//         markersRef.current.forEach(marker => marker.setMap(null));
//         markersRef.current = [];

//         const bounds = new window.google.maps.LatLngBounds();

//         filteredPotholes.forEach((pothole) => {
//             const position = {
//                 lat: pothole.location.latitude,
//                 lng: pothole.location.longitude
//             };

//             bounds.extend(position);

//             const markerColor = getSeverityMarkerColor(pothole.severity);

//             const marker = new window.google.maps.Marker({
//                 position: position,
//                 map: googleMapRef.current,
//                 title: pothole.location.address,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: 12,
//                     fillColor: markerColor,
//                     fillOpacity: 1,
//                     strokeColor: '#ffffff',
//                     strokeWeight: 3,
//                 },
//                 animation: pothole.status === 'reported' ? window.google.maps.Animation.BOUNCE : null
//             });

//             const infoWindow = new window.google.maps.InfoWindow({
//                 content: `
//           <div style="padding: 10px; min-width: 250px;">
//             <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">${pothole.location.address}</h3>
//             <div style="margin-bottom: 8px;">
//               <span style="
//                 display: inline-block;
//                 padding: 4px 10px;
//                 background-color: ${markerColor};
//                 color: white;
//                 border-radius: 4px;
//                 font-size: 12px;
//                 font-weight: bold;
//                 text-transform: uppercase;
//               ">${pothole.severity}</span>
//             </div>
//             <p style="margin: 6px 0; font-size: 13px;"><strong>Position:</strong> ${pothole.position}</p>
//             <p style="margin: 6px 0; font-size: 13px;"><strong>Status:</strong> ${pothole.status}</p>
//             <p style="margin: 6px 0; font-size: 13px; color: #666;">${pothole.description}</p>
//             <p style="margin: 6px 0 0 0; font-size: 12px; color: #999;">Reported by ${pothole.reportedBy} on ${new Date(pothole.timestamp).toLocaleDateString()}</p>
//           </div>
//         `
//             });

//             marker.addListener('click', () => {
//                 infoWindow.open(googleMapRef.current, marker);
//                 setSelectedPothole(pothole);
//             });

//             markersRef.current.push(marker);
//         });

//         if (filteredPotholes.length > 0) {
//             googleMapRef.current.fitBounds(bounds);
//         }
//     }, [filteredPotholes, googleMapRef.current]);

//     // Focus on selected pothole
//     useEffect(() => {
//         if (googleMapRef.current && selectedPothole) {
//             googleMapRef.current.panTo({
//                 lat: selectedPothole.location.latitude,
//                 lng: selectedPothole.location.longitude
//             });
//             googleMapRef.current.setZoom(16);
//         }
//     }, [selectedPothole]);

//     const fetchPotholes = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const params = new URLSearchParams();
//             if (filters.status !== 'all') params.append('status', filters.status);
//             if (filters.severity !== 'all') params.append('severity', filters.severity);

//             const response = await fetch(`${API_URL}/potholes?${params.toString()}`);
//             const data = await response.json();

//             if (data.success) {
//                 setPotholes(data.data);
//                 setFilteredPotholes(data.data);
//             } else {
//                 setError('Failed to fetch potholes');
//             }
//         } catch (err) {
//             setError('Network error: ' + err.message);
//             console.error('Error fetching potholes:', err);

//             // Demo data fallback
//             const demoData = [
//                 {
//                     _id: '1',
//                     location: { address: 'Mall Road, Kanpur', latitude: 26.4499, longitude: 80.3319 },
//                     severity: 'dangerous',
//                     position: 'middle',
//                     status: 'reported',
//                     description: 'Large pothole causing traffic issues',
//                     reportedBy: 'John Doe',
//                     timestamp: new Date().toISOString()
//                 },
//                 {
//                     _id: '2',
//                     location: { address: 'Civil Lines, Kanpur', latitude: 26.4670, longitude: 80.3500 },
//                     severity: 'severe',
//                     position: 'left',
//                     status: 'in-progress',
//                     description: 'Deep pothole near intersection',
//                     reportedBy: 'Jane Smith',
//                     timestamp: new Date(Date.now() - 86400000).toISOString()
//                 },
//                 {
//                     _id: '3',
//                     location: { address: 'Swaroop Nagar, Kanpur', latitude: 26.4720, longitude: 80.3150 },
//                     severity: 'mild',
//                     position: 'right',
//                     status: 'resolved',
//                     description: 'Small pothole on service road',
//                     reportedBy: 'City Worker',
//                     timestamp: new Date(Date.now() - 172800000).toISOString()
//                 },
//                 {
//                     _id: '4',
//                     location: { address: 'Kakadeo, Kanpur', latitude: 26.4290, longitude: 80.3410 },
//                     severity: 'dangerous',
//                     position: 'full-width',
//                     status: 'reported',
//                     description: 'Major road damage across entire width',
//                     reportedBy: 'Traffic Police',
//                     timestamp: new Date(Date.now() - 3600000).toISOString()
//                 },
//                 {
//                     _id: '5',
//                     location: { address: 'Panki, Kanpur', latitude: 26.4100, longitude: 80.2800 },
//                     severity: 'severe',
//                     position: 'middle',
//                     status: 'in-progress',
//                     description: 'Growing pothole near industrial area',
//                     reportedBy: 'Local Resident',
//                     timestamp: new Date(Date.now() - 259200000).toISOString()
//                 },
//                 {
//                     _id: '6',
//                     location: { address: 'Kalyanpur, Kanpur', latitude: 26.5100, longitude: 80.2300 },
//                     severity: 'mild',
//                     position: 'left',
//                     status: 'reported',
//                     description: 'Small surface damage',
//                     reportedBy: 'Anonymous',
//                     timestamp: new Date(Date.now() - 7200000).toISOString()
//                 }
//             ];

//             setPotholes(demoData);
//             setFilteredPotholes(demoData);

//             // Calculate demo stats
//             const demoStats = {
//                 total: demoData.length,
//                 reported: demoData.filter(p => p.status === 'reported').length,
//                 inProgress: demoData.filter(p => p.status === 'in-progress').length,
//                 resolved: demoData.filter(p => p.status === 'resolved').length,
//                 dangerous: demoData.filter(p => p.severity === 'dangerous').length,
//                 severe: demoData.filter(p => p.severity === 'severe').length,
//                 mild: demoData.filter(p => p.severity === 'mild').length
//             };
//             setStats(demoStats);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchStats = async () => {
//         try {
//             const response = await fetch(`${API_URL}/stats`);
//             const data = await response.json();

//             if (data.success) {
//                 setStats({
//                     total: data.data.total,
//                     reported: data.data.byStatus.reported,
//                     inProgress: data.data.byStatus.inProgress,
//                     resolved: data.data.byStatus.resolved,
//                     dangerous: data.data.bySeverity.dangerous || 0,
//                     severe: data.data.bySeverity.severe || 0,
//                     mild: data.data.bySeverity.mild || 0
//                 });
//             }
//         } catch (err) {
//             console.error('Error fetching stats:', err);
//         }
//     };

//     useEffect(() => {
//         fetchPotholes();
//         fetchStats();

//         const interval = setInterval(() => {
//             fetchPotholes();
//             fetchStats();
//         }, 30000);

//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         applyFilters();
//     }, [filters, potholes]);

//     const applyFilters = () => {
//         let filtered = [...potholes];

//         if (filters.status !== 'all') {
//             filtered = filtered.filter(p => p.status === filters.status);
//         }
//         if (filters.severity !== 'all') {
//             filtered = filtered.filter(p => p.severity === filters.severity);
//         }
//         if (filters.position !== 'all') {
//             filtered = filtered.filter(p => p.position === filters.position);
//         }

//         setFilteredPotholes(filtered);
//     };

//     const updatePotholeStatus = async (id, newStatus) => {
//         try {
//             const response = await fetch(`${API_URL}/potholes/${id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ status: newStatus }),
//             });

//             const data = await response.json();

//             if (data.success) {
//                 fetchPotholes();
//                 fetchStats();
//             } else {
//                 alert('Failed to update status');
//             }
//         } catch (err) {
//             console.error('Error updating pothole:', err);
//             alert('Error updating pothole status');
//         }
//     };

//     const getSeverityColor = (severity) => {
//         switch (severity) {
//             case 'dangerous': return 'bg-red-500';
//             case 'severe': return 'bg-orange-500';
//             case 'mild': return 'bg-yellow-500';
//             default: return 'bg-gray-500';
//         }
//     };

//     const getSeverityMarkerColor = (severity) => {
//         switch (severity) {
//             case 'dangerous': return '#ef4444';
//             case 'severe': return '#f97316';
//             case 'mild': return '#eab308';
//             default: return '#6b7280';
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'reported': return 'text-red-600 bg-red-100';
//             case 'in-progress': return 'text-blue-600 bg-blue-100';
//             case 'resolved': return 'text-green-600 bg-green-100';
//             default: return 'text-gray-600 bg-gray-100';
//         }
//     };

//     const getStatusIcon = (status) => {
//         switch (status) {
//             case 'reported': return <AlertCircle className="w-4 h-4" />;
//             case 'in-progress': return <Clock className="w-4 h-4" />;
//             case 'resolved': return <CheckCircle className="w-4 h-4" />;
//             default: return null;
//         }
//     };

//     const focusOnPothole = (pothole) => {
//         setSelectedPothole(pothole);
//         setView('map');
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="bg-white shadow-sm border-b">
//                 <div className="px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Pothole Tracker Dashboard</h1>
//                             <p className="text-sm text-gray-600 mt-1">City Infrastructure Management System</p>
//                         </div>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setView('map')}
//                                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${view === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                     }`}
//                             >
//                                 <Navigation className="w-4 h-4" />
//                                 Map
//                             </button>
//                             <button
//                                 onClick={() => setView('list')}
//                                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                     }`}
//                             >
//                                 <List className="w-4 h-4" />
//                                 List
//                             </button>
//                             <button
//                                 onClick={() => setView('stats')}
//                                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${view === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                     }`}
//                             >
//                                 <BarChart3 className="w-4 h-4" />
//                                 Stats
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {error && (
//                 <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                     <p className="font-semibold">Error</p>
//                     <p className="text-sm">{error}</p>
//                     <button
//                         onClick={fetchPotholes}
//                         className="mt-2 text-sm underline hover:no-underline"
//                     >
//                         Try again
//                     </button>
//                 </div>
//             )}

//             <div className="px-6 py-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="bg-white p-4 rounded-lg shadow">
//                         <div className="text-sm text-gray-600">Total Reports</div>
//                         <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
//                     </div>
//                     <div className="bg-white p-4 rounded-lg shadow">
//                         <div className="text-sm text-gray-600">Reported</div>
//                         <div className="text-2xl font-bold text-red-600 mt-1">{stats.reported}</div>
//                     </div>
//                     <div className="bg-white p-4 rounded-lg shadow">
//                         <div className="text-sm text-gray-600">In Progress</div>
//                         <div className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</div>
//                     </div>
//                     <div className="bg-white p-4 rounded-lg shadow">
//                         <div className="text-sm text-gray-600">Resolved</div>
//                         <div className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</div>
//                     </div>
//                 </div>
//             </div>

//             <div className="px-6 py-4">
//                 <div className="bg-white p-4 rounded-lg shadow">
//                     <div className="flex items-center gap-2 mb-3">
//                         <Filter className="w-5 h-5 text-gray-600" />
//                         <h3 className="font-semibold text-gray-900">Filters</h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <select
//                             value={filters.status}
//                             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                             className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="all">All Status</option>
//                             <option value="reported">Reported</option>
//                             <option value="in-progress">In Progress</option>
//                             <option value="resolved">Resolved</option>
//                         </select>
//                         <select
//                             value={filters.severity}
//                             onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
//                             className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="all">All Severity</option>
//                             <option value="mild">Mild</option>
//                             <option value="severe">Severe</option>
//                             <option value="dangerous">Dangerous</option>
//                         </select>
//                         <select
//                             value={filters.position}
//                             onChange={(e) => setFilters({ ...filters, position: e.target.value })}
//                             className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="all">All Positions</option>
//                             <option value="left">Left</option>
//                             <option value="middle">Middle</option>
//                             <option value="right">Right</option>
//                             <option value="full-width">Full Width</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             <div className="px-6 pb-6">
//                 {loading && (
//                     <div className="bg-white rounded-lg shadow p-8 text-center">
//                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <p className="mt-4 text-gray-600">Loading potholes...</p>
//                     </div>
//                 )}

//                 {!loading && view === 'map' && (
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="p-4 border-b bg-gray-50">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <MapPin className="w-4 h-4" />
//                                 <span>Showing {filteredPotholes.length} potholes on map</span>
//                             </div>
//                         </div>
//                         <div className="relative">
//                             <div
//                                 ref={mapRef}
//                                 style={{ height: '600px', width: '100%' }}
//                             />

//                             <div className="absolute right-4 top-4 bottom-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
//                                 <div className="p-4 bg-blue-600 text-white font-semibold">
//                                     Pothole Locations ({filteredPotholes.length})
//                                 </div>
//                                 <div className="overflow-y-auto h-full pb-20">
//                                     {filteredPotholes.length === 0 ? (
//                                         <div className="p-4 text-center text-gray-500">
//                                             No potholes found with current filters
//                                         </div>
//                                     ) : (
//                                         filteredPotholes.map((pothole) => (
//                                             <div
//                                                 key={pothole._id}
//                                                 onClick={() => setSelectedPothole(pothole)}
//                                                 className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedPothole?._id === pothole._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
//                                                     }`}
//                                             >
//                                                 <div className="flex items-start justify-between gap-2">
//                                                     <div className="flex-1">
//                                                         <div className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white mb-2 ${getSeverityColor(pothole.severity)}`}>
//                                                             {pothole.severity.toUpperCase()}
//                                                         </div>
//                                                         <p className="font-semibold text-sm">{pothole.location.address}</p>
//                                                         <p className="text-xs text-gray-600 mt-1">
//                                                             Position: <span className="font-medium capitalize">{pothole.position}</span>
//                                                         </p>
//                                                         <p className="text-xs text-gray-600 mt-1">{pothole.description}</p>
//                                                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mt-2 ${getStatusColor(pothole.status)}`}>
//                                                             {getStatusIcon(pothole.status)}
//                                                             {pothole.status}
//                                                         </div>
//                                                     </div>
//                                                     <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                                                 </div>
//                                                 <div className="text-xs text-gray-500 mt-2">
//                                                     {new Date(pothole.timestamp).toLocaleString()}
//                                                 </div>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {!loading && view === 'list' && (
//                     <div className="bg-white rounded-lg shadow">
//                         {filteredPotholes.length === 0 ? (
//                             <div className="p-8 text-center text-gray-500">
//                                 No potholes found with current filters
//                             </div>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50 border-b">
//                                         <tr>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Position</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reporter</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y">
//                                         {filteredPotholes.map((pothole) => (
//                                             <tr key={pothole._id} className="hover:bg-gray-50">
//                                                 <td className="px-4 py-3 text-sm font-mono text-gray-600">#{pothole._id.slice(-6)}</td>
//                                                 <td className="px-4 py-3 text-sm">
//                                                     <div className="flex items-center gap-2">
//                                                         <MapPin className="w-4 h-4 text-gray-400" />
//                                                         <div className="font-medium">{pothole.location.address}</div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${getSeverityColor(pothole.severity)}`}>
//                                                         {pothole.severity}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 py-3 text-sm capitalize">{pothole.position}</td>
//                                                 <td className="px-4 py-3">
//                                                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(pothole.status)}`}>
//                                                         {getStatusIcon(pothole.status)}
//                                                         {pothole.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 py-3 text-sm">{pothole.reportedBy}</td>
//                                                 <td className="px-4 py-3 text-sm">{new Date(pothole.timestamp).toLocaleDateString()}</td>
//                                                 <td className="px-4 py-3">
//                                                     <div className="flex gap-2">
//                                                         <select
//                                                             value={pothole.status}
//                                                             onChange={(e) => updatePotholeStatus(pothole._id, e.target.value)}
//                                                             className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                         >
//                                                             <option value="reported">Reported</option>
//                                                             <option value="in-progress">In Progress</option>
//                                                             <option value="resolved">Resolved</option>
//                                                         </select>
//                                                         <button
//                                                             onClick={() => focusOnPothole(pothole)}
//                                                             className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
//                                                         >
//                                                             View
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {!loading && view === 'stats' && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="bg-white p-6 rounded-lg shadow">
//                             <h3 className="font-semibold text-lg mb-4">Severity Distribution</h3>
//                             <div className="space-y-4">
//                                 <div>
//                                     <div className="flex justify-between mb-2">
//                                         <span className="text-sm font-medium">Dangerous</span>
//                                         <span className="text-sm text-gray-600">{stats.dangerous} ({stats.total > 0 ? Math.round((stats.dangerous / stats.total) * 100) : 0}%)</span>
//                                     </div>
//                                     <div className="w-full bg-gray-200 rounded-full h-3">
//                                         <div className="bg-red-500 h-3 rounded-full transition-all" style={{ width: `${stats.total > 0 ? (stats.dangerous / stats.total) * 100 : 0}%` }}></div>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="flex justify-between mb-2">
//                                         <span className="text-sm font-medium">Severe</span>
//                                         <span className="text-sm text-gray-600">{stats.severe} ({stats.total > 0 ? Math.round((stats.severe / stats.total) * 100) : 0}%)</span>
//                                     </div>
//                                     <div className="w-full bg-gray-200 rounded-full h-3">
//                                         <div className="bg-orange-500 h-3 rounded-full transition-all" style={{ width: `${stats.total > 0 ? (stats.severe / stats.total) * 100 : 0}%` }}></div>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="flex justify-between mb-2">
//                                         <span className="text-sm font-medium">Mild</span>
//                                         <span className="text-sm text-gray-600">{stats.mild} ({stats.total > 0 ? Math.round((stats.mild / stats.total) * 100) : 0}%)</span>
//                                     </div>
//                                     <div className="w-full bg-gray-200 rounded-full h-3">
//                                         <div className="bg-yellow-500 h-3 rounded-full transition-all" style={{ width: `${stats.total > 0 ? (stats.mild / stats.total) * 100 : 0}%` }}></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white p-6 rounded-lg shadow">
//                             <h3 className="font-semibold text-lg mb-4">Status Overview</h3>
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
//                                     <div className="flex items-center gap-3">
//                                         <AlertCircle className="w-6 h-6 text-red-600" />
//                                         <div>
//                                             <div className="font-medium text-gray-900">Reported</div>
//                                             <div className="text-xs text-gray-600">Awaiting action</div>
//                                         </div>
//                                     </div>
//                                     <span className="text-2xl font-bold text-red-600">{stats.reported}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                     <div className="flex items-center gap-3">
//                                         <Clock className="w-6 h-6 text-blue-600" />
//                                         <div>
//                                             <div className="font-medium text-gray-900">In Progress</div>
//                                             <div className="text-xs text-gray-600">Being fixed</div>
//                                         </div>
//                                     </div>
//                                     <span className="text-2xl font-bold text-blue-600">{stats.inProgress}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
//                                     <div className="flex items-center gap-3">
//                                         <CheckCircle className="w-6 h-6 text-green-600" />
//                                         <div>
//                                             <div className="font-medium text-gray-900">Resolved</div>
//                                             <div className="text-xs text-gray-600">Completed</div>
//                                         </div>
//                                     </div>
//                                     <span className="text-2xl font-bold text-green-600">{stats.resolved}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
//                             <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
//                             <div className="space-y-3">
//                                 {potholes.slice(0, 5).map((pothole) => (
//                                     <div key={pothole._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-2 h-2 rounded-full ${getSeverityColor(pothole.severity)}`}></div>
//                                             <div>
//                                                 <div className="text-sm font-medium">{pothole.location.address}</div>
//                                                 <div className="text-xs text-gray-600">
//                                                     Reported by {pothole.reportedBy} • {new Date(pothole.timestamp).toLocaleString()}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(pothole.status)}`}>
//                                             {getStatusIcon(pothole.status)}
//                                             {pothole.status}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PotholeDashboard;


import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Upload, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const API_URL = 'https://zeropits.onrender.com/api';

function PotholeDashboard() {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [severity, setSeverity] = useState('mild');
    const [position, setPosition] = useState('middle');
    const [description, setDescription] = useState('');
    const [reportedBy, setReportedBy] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);

    // Get current location
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setLocation(coords);

                // Reverse geocode to get address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
                    );
                    const data = await response.json();
                    setAddress(data.display_name || 'Unknown location');
                } catch (err) {
                    setAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
                }

                setLocationLoading(false);
            },
            (err) => {
                setError('Unable to retrieve location: ' + err.message);
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Handle file input
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please select a valid image file');
        }
    };

    // Open camera
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraStream(stream);
                setCameraOpen(true);
            }
        } catch (err) {
            setError('Unable to access camera: ' + err.message);
        }
    };

    // Capture photo from camera
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                setImageFile(blob);
                setImage(canvas.toDataURL('image/jpeg'));
                closeCamera();
            }, 'image/jpeg', 0.8);
        }
    };

    // Close camera
    const closeCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setCameraOpen(false);
    };

    // Submit report
    const submitReport = async () => {
        // Validation
        if (!image) {
            setError('Please capture or upload a photo');
            return;
        }
        if (!location) {
            setError('Please capture your location');
            return;
        }
        if (!description.trim()) {
            setError('Please provide a description');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', imageFile, 'pothole.jpg');
            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());
            formData.append('address', address);
            formData.append('severity', severity);
            formData.append('position', position);
            formData.append('description', description);
            formData.append('reportedBy', reportedBy || 'Anonymous');

            const response = await fetch(`${API_URL}/potholes`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    resetForm();
                }, 3000);
            } else {
                setError(result.message || 'Failed to submit report');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setImage(null);
        setImageFile(null);
        setLocation(null);
        setAddress('');
        setSeverity('mild');
        setPosition('middle');
        setDescription('');
        setReportedBy('');
        setSuccess(false);
        setError('');
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Pothole Reporter</h1>
                    <p className="text-sm text-gray-600 mt-1">Report road issues and help improve infrastructure</p>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-900">Report Submitted Successfully!</p>
                            <p className="text-sm text-green-700">Thank you for helping improve our roads.</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-900">Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Camera Modal */}
                {cameraOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-lg"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                <button
                                    onClick={capturePhoto}
                                    className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition"
                                >
                                    Capture Photo
                                </button>
                                <button
                                    onClick={closeCamera}
                                    className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <div className="space-y-6">
                    {/* Photo Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Photo *
                        </h2>

                        {image ? (
                            <div className="space-y-4">
                                <img
                                    src={image}
                                    alt="Pothole"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => {
                                        setImage(null);
                                        setImageFile(null);
                                    }}
                                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Remove Photo
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={openCamera}
                                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    Open Camera
                                </button>
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-6 py-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-5 h-5" />
                                        Upload from Device
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Location *
                        </h2>

                        {location ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-900 mb-1">📍 {address}</p>
                                    <p className="text-xs text-green-700">
                                        Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                                    </p>
                                </div>
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={locationLoading}
                                    className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                >
                                    Update Location
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                {locationLoading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Getting Location...
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-5 h-5" />
                                        Capture Current Location
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Severity Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Severity Level *</h2>
                        <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="mild">🟡 Mild - Small pothole</option>
                            <option value="severe">🟠 Severe - Medium pothole</option>
                            <option value="dangerous">🔴 Dangerous - Large pothole</option>
                        </select>
                    </div>

                    {/* Position Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Position on Road *</h2>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="left">⬅️ Left side of road</option>
                            <option value="middle">🎯 Middle of road</option>
                            <option value="right">➡️ Right side of road</option>
                            <option value="full-width">↔️ Full width (entire road)</option>
                        </select>
                    </div>

                    {/* Description Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Description *</h2>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the pothole and its impact (e.g., causing traffic issues, near bus stop, etc.)"
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Reporter Name Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Name (Optional)</h2>
                        <input
                            type="text"
                            value={reportedBy}
                            onChange={(e) => setReportedBy(e.target.value)}
                            placeholder="Enter your name or leave blank for anonymous"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={submitReport}
                        disabled={loading}
                        className="w-full px-6 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Report
                            </>
                        )}
                    </button>

                    {/* Footer */}
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-600">Help make our roads safer! 🛣️</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PotholeDashboard;