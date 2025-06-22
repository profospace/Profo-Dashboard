// import React, { useState, useEffect, useRef } from 'react';
// import { Upload, User, MapPin, Phone, MessageCircle, Edit2, Save, X, Plus, Trash2, Eye, Search, Filter, BarChart3, Calendar, AlertCircle } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

// const ClientManagementDashboard = () => {
//     const [clients, setClients] = useState([]);
//     const [selectedClient, setSelectedClient] = useState(null);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [extractedData, setExtractedData] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [editingClient, setEditingClient] = useState(null);
//     const [mapLoaded, setMapLoaded] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//     const [analytics, setAnalytics] = useState(null);
//     const [showAnalytics, setShowAnalytics] = useState(false);
//     const mapRef = useRef(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);


//     // Load clients from API
//     const fetchClients = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/clients?search=${searchTerm}&status=${filterStatus}`);
//             if (!response.ok) throw new Error('Failed to fetch clients');
//             const data = await response.json();
//             setClients(data.clients || data);
//         } catch (error) {
//             setError('Failed to load clients: ' + error.message);
//             console.error('Error fetching clients:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load analytics data
//     const fetchAnalytics = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/analytics/dashboard`);
//             if (!response.ok) throw new Error('Failed to fetch analytics');
//             const data = await response.json();
//             setAnalytics(data);
//         } catch (error) {
//             console.error('Error fetching analytics:', error);
//         }
//     };

//     // Initial data load
//     useEffect(() => {
//         fetchClients();
//         fetchAnalytics();
//     }, [searchTerm, filterStatus]);

//     // Mock data for demonstration - Remove this when API is connected
//     useEffect(() => {
//         if (clients.length === 0) {
//             const mockClients = [
//                 {
//                     id: 1,
//                     name: "John Doe",
//                     phone: "+1234567890",
//                     whatsappNumber: "+1234567890",
//                     interests: ["Real Estate", "Investment"],
//                     preferences: "Looking for 2-3 BHK apartments",
//                     interestedAreas: [
//                         { lat: 26.8467, lng: 80.9462, name: "Gomti Nagar, Lucknow" },
//                         { lat: 26.8389, lng: 80.9231, name: "Hazratganj, Lucknow" }
//                     ],
//                     addedDate: "2025-01-15",
//                     lastContact: "2025-01-18",
//                     status: "lead",
//                     priority: "high"
//                 },
//                 {
//                     id: 2,
//                     name: "Jane Smith",
//                     phone: "+0987654321",
//                     whatsappNumber: "+0987654321",
//                     interests: ["Commercial Property"],
//                     preferences: "Office spaces near IT parks",
//                     interestedAreas: [
//                         { lat: 26.8512, lng: 80.9462, name: "IT City, Lucknow" }
//                     ],
//                     addedDate: "2025-01-10",
//                     lastContact: "2025-01-17",
//                     status: "prospect",
//                     priority: "medium"
//                 }
//             ];
//             setClients(mockClients);
//         }
//     }, [clients.length]);

//     // Load Google Maps
//     useEffect(() => {
//         if (window.google && window.google.maps) {
//             setMapLoaded(true);
//             return;
//         }

//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
//         script.async = true;
//         script.onload = () => setMapLoaded(true);
//         document.head.appendChild(script);

//         return () => {
//             document.head.removeChild(script);
//         };
//     }, []);

//     // Initialize map
//     useEffect(() => {
//         if (mapLoaded && mapRef.current && !map) {
//             const googleMap = new window.google.maps.Map(mapRef.current, {
//                 center: { lat: 26.8467, lng: 80.9462 }, // Lucknow coordinates
//                 zoom: 12
//             });
//             setMap(googleMap);
//         }
//     }, [mapLoaded, map]);

//     // Update markers when selected client changes
//     useEffect(() => {
//         if (map && selectedClient) {
//             // Clear existing markers
//             markers.forEach(marker => marker.setMap(null));

//             // Add new markers for selected client
//             const newMarkers = selectedClient.interestedAreas.map(area => {
//                 const marker = new window.google.maps.Marker({
//                     position: { lat: area.lat, lng: area.lng },
//                     map: map,
//                     title: area.name
//                 });

//                 const infoWindow = new window.google.maps.InfoWindow({
//                     content: `<div><strong>${selectedClient.name}</strong><br/>${area.name}</div>`
//                 });

//                 marker.addListener('click', () => {
//                     infoWindow.open(map, marker);
//                 });

//                 return marker;
//             });

//             setMarkers(newMarkers);
//         }
//     }, [map, selectedClient]);

//     // Upload and process WhatsApp screenshot
//     const handleImageUpload = async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         setLoading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('screenshot', file);

//         try {
//             // Show preview immediately
//             const reader = new FileReader();
//             reader.onload = (e) => setUploadedImage(e.target.result);
//             reader.readAsDataURL(file);

//             // Send to backend for OCR processing
//             const response = await fetch(`${base_url}/api/upload/screenshot`, {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) throw new Error('Failed to process screenshot');

//             const result = await response.json();
//             setExtractedData(result.data);
//         } catch (error) {
//             setError('Failed to process screenshot: ' + error.message);
//             console.error('Upload error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Create client from extracted data
//     const addClientFromExtractedData = async () => {
//         if (!extractedData?.suggested) return;

//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/upload/create-client`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     extractedData,
//                     clientData: extractedData.suggested
//                 })
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to create client');
//             }

//             const result = await response.json();
//             setClients([result.client, ...clients]);
//             setExtractedData(null);
//             setUploadedImage(null);
//             setError(null);
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Update client
//     const updateClient = async (updatedClient) => {
//         try {
//             const response = await fetch(`${base_url}/api/clients/${updatedClient.id || updatedClient._id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(updatedClient)
//             });

//             if (!response.ok) throw new Error('Failed to update client');

//             const result = await response.json();
//             setClients(clients.map(client =>
//                 (client.id || client._id) === (updatedClient.id || updatedClient._id) ? result : client
//             ));
//             setEditingClient(null);

//             if (selectedClient && (selectedClient.id || selectedClient._id) === (updatedClient.id || updatedClient._id)) {
//                 setSelectedClient(result);
//             }
//         } catch (error) {
//             setError('Failed to update client: ' + error.message);
//         }
//     };

//     // Delete client
//     const deleteClient = async (clientId) => {
//         if (!window.confirm('Are you sure you want to delete this client?')) return;

//         try {
//             const response = await fetch(`${base_url}/api/clients/${clientId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) throw new Error('Failed to delete client');

//             setClients(clients.filter(client => (client.id || client._id) !== clientId));

//             if (selectedClient && (selectedClient.id || selectedClient._id) === clientId) {
//                 setSelectedClient(null);
//             }
//         } catch (error) {
//             setError('Failed to delete client: ' + error.message);
//         }
//     };

//     // Add interested area with geocoding
//     const addInterestArea = async (client) => {
//         if (!map) return;

//         const location = prompt("Enter location name:");
//         if (!location) return;

//         try {
//             const geocoder = new window.google.maps.Geocoder();
//             const results = await new Promise((resolve, reject) => {
//                 geocoder.geocode({ address: location }, (results, status) => {
//                     if (status === 'OK') resolve(results);
//                     else reject(new Error('Geocoding failed'));
//                 });
//             });

//             const newArea = {
//                 lat: results[0].geometry.location.lat(),
//                 lng: results[0].geometry.location.lng(),
//                 name: location,
//                 priority: 'medium'
//             };

//             const response = await fetch(`${base_url}/api/clients/${client.id || client._id}/areas`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newArea)
//             });

//             if (!response.ok) throw new Error('Failed to add area');

//             const updatedClient = await response.json();
//             setClients(clients.map(c =>
//                 (c.id || c._id) === (client.id || client._id) ? updatedClient : c
//             ));

//             if (selectedClient && (selectedClient.id || selectedClient._id) === (client.id || client._id)) {
//                 setSelectedClient(updatedClient);
//             }
//         } catch (error) {
//             setError('Failed to add area: ' + error.message);
//         }
//     };

//     // Filter clients based on search and status
//     const filteredClients = clients.filter(client => {
//         const matchesSearch = !searchTerm ||
//             client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             client.phone.includes(searchTerm) ||
//             (client.preferences && client.preferences.toLowerCase().includes(searchTerm.toLowerCase()));

//         const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

//         return matchesSearch && matchesStatus;
//     });

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">Client Management Dashboard</h1>
//                     <div className="flex space-x-4">
//                         <button
//                             onClick={() => setShowAnalytics(!showAnalytics)}
//                             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
//                         >
//                             <BarChart3 size={16} className="mr-2" />
//                             Analytics
//                         </button>
//                         <button
//                             onClick={fetchClients}
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//                         >
//                             Refresh
//                         </button>
//                     </div>
//                 </div>

//                 {/* Error Display */}
//                 {error && (
//                     <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//                         <AlertCircle className="text-red-500 mr-2" size={20} />
//                         <span className="text-red-700">{error}</span>
//                         <button
//                             onClick={() => setError(null)}
//                             className="ml-auto text-red-500 hover:text-red-700"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 )}

//                 {/* Analytics Panel */}
//                 {showAnalytics && analytics && (
//                     <div className="mb-6 bg-white rounded-lg shadow-md p-6">
//                         <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                             <div className="bg-blue-50 p-4 rounded-lg">
//                                 <h3 className="font-semibold text-blue-800">Total Clients</h3>
//                                 <p className="text-2xl font-bold text-blue-900">{analytics.summary?.totalClients || 0}</p>
//                             </div>
//                             <div className="bg-green-50 p-4 rounded-lg">
//                                 <h3 className="font-semibold text-green-800">New This Month</h3>
//                                 <p className="text-2xl font-bold text-green-900">{analytics.summary?.newClients || 0}</p>
//                             </div>
//                             <div className="bg-yellow-50 p-4 rounded-lg">
//                                 <h3 className="font-semibold text-yellow-800">Follow-ups Due</h3>
//                                 <p className="text-2xl font-bold text-yellow-900">{analytics.summary?.followUpsDue || 0}</p>
//                             </div>
//                             <div className="bg-purple-50 p-4 rounded-lg">
//                                 <h3 className="font-semibold text-purple-800">Growth Rate</h3>
//                                 <p className="text-2xl font-bold text-purple-900">{analytics.summary?.growthRate || 0}%</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left Panel - Upload & Client List */}
//                     <div className="lg:col-span-1 space-y-6">
//                         {/* Search and Filter */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             <div className="space-y-4">
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                                     <input
//                                         type="text"
//                                         placeholder="Search clients..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <Filter size={16} className="text-gray-500" />
//                                     <select
//                                         value={filterStatus}
//                                         onChange={(e) => setFilterStatus(e.target.value)}
//                                         className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                         <option value="all">All Status</option>
//                                         <option value="lead">Leads</option>
//                                         <option value="prospect">Prospects</option>
//                                         <option value="client">Clients</option>
//                                         <option value="inactive">Inactive</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* WhatsApp Screenshot Upload */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             <h2 className="text-xl font-semibold mb-4 flex items-center">
//                                 <Upload className="mr-2" size={20} />
//                                 Upload WhatsApp Screenshot
//                             </h2>

//                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageUpload}
//                                     className="hidden"
//                                     id="screenshot-upload"
//                                     disabled={loading}
//                                 />
//                                 <label
//                                     htmlFor="screenshot-upload"
//                                     className={`cursor-pointer flex flex-col items-center ${loading ? 'opacity-50' : ''}`}
//                                 >
//                                     <Upload size={40} className="text-gray-400 mb-2" />
//                                     <span className="text-sm text-gray-600">
//                                         {loading ? 'Processing...' : 'Click to upload WhatsApp screenshot'}
//                                     </span>
//                                 </label>
//                             </div>

//                             {uploadedImage && (
//                                 <div className="mt-4">
//                                     <img
//                                         src={uploadedImage}
//                                         alt="Uploaded screenshot"
//                                         className="w-full h-32 object-cover rounded-lg"
//                                     />
//                                     {extractedData ? (
//                                         <div className="mt-4 p-4 bg-green-50 rounded-lg">
//                                             <h3 className="font-semibold text-green-800">Extracted Data:</h3>
//                                             <p><strong>Name:</strong> {extractedData.suggested?.name}</p>
//                                             <p><strong>Phone:</strong> {extractedData.suggested?.phone}</p>
//                                             <p><strong>Preview:</strong> {extractedData.suggested?.chatPreview?.substring(0, 100)}...</p>
//                                             <button
//                                                 onClick={addClientFromExtractedData}
//                                                 disabled={loading}
//                                                 className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
//                                             >
//                                                 {loading ? 'Adding...' : 'Add as Client'}
//                                             </button>
//                                         </div>
//                                     ) : loading ? (
//                                         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                                             <p className="text-blue-800">Processing image with OCR...</p>
//                                         </div>
//                                     ) : null}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Client List */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             <h2 className="text-xl font-semibold mb-4 flex items-center">
//                                 <User className="mr-2" size={20} />
//                                 Clients ({filteredClients.length})
//                             </h2>

//                             {loading && !clients.length ? (
//                                 <div className="text-center py-8 text-gray-500">Loading clients...</div>
//                             ) : (
//                                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                                     {filteredClients.map(client => (
//                                         <div
//                                             key={client.id || client._id}
//                                             className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedClient?.id === client.id || selectedClient?._id === client._id
//                                                     ? 'border-blue-500 bg-blue-50'
//                                                     : 'border-gray-200 hover:border-gray-300'
//                                                 }`}
//                                             onClick={() => setSelectedClient(client)}
//                                         >
//                                             <div className="flex justify-between items-start">
//                                                 <div className="flex-1">
//                                                     <div className="flex items-center space-x-2">
//                                                         <h3 className="font-semibold text-gray-900">{client.name}</h3>
//                                                         {client.status && (
//                                                             <span className={`px-2 py-1 text-xs rounded-full ${client.status === 'client' ? 'bg-green-100 text-green-800' :
//                                                                     client.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
//                                                                         client.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
//                                                                             'bg-gray-100 text-gray-800'
//                                                                 }`}>
//                                                                 {client.status}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     <p className="text-sm text-gray-600 flex items-center mt-1">
//                                                         <Phone size={14} className="mr-1" />
//                                                         {client.phone}
//                                                     </p>
//                                                     <p className="text-xs text-gray-500 mt-1">
//                                                         Added: {new Date(client.addedDate).toLocaleDateString()}
//                                                     </p>
//                                                 </div>
//                                                 <div className="flex space-x-2">
//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             setEditingClient(client);
//                                                         }}
//                                                         className="text-blue-600 hover:text-blue-800"
//                                                     >
//                                                         <Edit2 size={16} />
//                                                     </button>
//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             deleteClient(client.id || client._id);
//                                                         }}
//                                                         className="text-red-600 hover:text-red-800"
//                                                     >
//                                                         <Trash2 size={16} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {filteredClients.length === 0 && (
//                                         <div className="text-center py-8 text-gray-500">
//                                             No clients found matching your criteria
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>Clients ({clients.length})
//                 </h2>

//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {clients.map(client => (
//                         <div
//                             key={client.id}
//                             className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedClient?.id === client.id
//                                     ? 'border-blue-500 bg-blue-50'
//                                     : 'border-gray-200 hover:border-gray-300'
//                                 }`}
//                             onClick={() => setSelectedClient(client)}
//                         >
//                             <div className="flex justify-between items-start">
//                                 <div>
//                                     <h3 className="font-semibold text-gray-900">{client.name}</h3>
//                                     <p className="text-sm text-gray-600 flex items-center">
//                                         <Phone size={14} className="mr-1" />
//                                         {client.phone}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         Added: {client.addedDate}
//                                     </p>
//                                 </div>
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             setEditingClient(client);
//                                         }}
//                                         className="text-blue-600 hover:text-blue-800"
//                                     >
//                                         <Edit2 size={16} />
//                                     </button>
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             deleteClient(client.id);
//                                         }}
//                                         className="text-red-600 hover:text-red-800"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>

//           {/* Right Panel - Client Details & Map */ }
//     <div className="lg:col-span-2 space-y-6">
//         {selectedClient ? (
//             <>
//                 {/* Client Details */}
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                     <div className="flex justify-between items-start mb-6">
//                         <div>
//                             <h2 className="text-2xl font-semibold text-gray-900">
//                                 {selectedClient.name}
//                             </h2>
//                             <div className="flex items-center space-x-2 mt-2">
//                                 <span className={`px-3 py-1 text-sm rounded-full ${selectedClient.status === 'client' ? 'bg-green-100 text-green-800' :
//                                         selectedClient.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
//                                             selectedClient.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
//                                                 'bg-gray-100 text-gray-800'
//                                     }`}>
//                                     {selectedClient.status || 'Lead'}
//                                 </span>
//                                 <span className={`px-3 py-1 text-sm rounded-full ${selectedClient.priority === 'high' ? 'bg-red-100 text-red-800' :
//                                         selectedClient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                                             'bg-green-100 text-green-800'
//                                     }`}>
//                                     {selectedClient.priority || 'Medium'} Priority
//                                 </span>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => setEditingClient(selectedClient)}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
//                         >
//                             <Edit2 size={16} className="mr-2" />
//                             Edit
//                         </button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
//                             <p className="text-gray-600 flex items-center mb-2">
//                                 <Phone size={16} className="mr-2" />
//                                 {selectedClient.phone}
//                             </p>
//                             <p className="text-gray-600 flex items-center mb-2">
//                                 <MessageCircle size={16} className="mr-2" />
//                                 {selectedClient.whatsappNumber || selectedClient.phone}
//                             </p>
//                             {selectedClient.email && (
//                                 <p className="text-gray-600 flex items-center">
//                                     <span className="mr-2">✉</span>
//                                     {selectedClient.email}
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <h3 className="font-semibold text-gray-700 mb-2">Timeline</h3>
//                             <p className="text-sm text-gray-600 flex items-center mb-1">
//                                 <Calendar size={14} className="mr-2" />
//                                 Added: {new Date(selectedClient.addedDate).toLocaleDateString()}
//                             </p>
//                             {selectedClient.lastContact && (
//                                 <p className="text-sm text-gray-600 flex items-center">
//                                     <Calendar size={14} className="mr-2" />
//                                     Last Contact: {new Date(selectedClient.lastContact).toLocaleDateString()}
//                                 </p>
//                             )}
//                             {selectedClient.source && (
//                                 <p className="text-sm text-gray-600 mt-2">
//                                     Source: <span className="capitalize">{selectedClient.source}</span>
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     <div className="mt-6">
//                         <h3 className="font-semibold text-gray-700 mb-2">Interests</h3>
//                         <div className="flex flex-wrap gap-2">
//                             {selectedClient.interests && selectedClient.interests.length > 0 ? (
//                                 selectedClient.interests.map((interest, index) => (
//                                     <span
//                                         key={index}
//                                         className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                                     >
//                                         {interest}
//                                     </span>
//                                 ))
//                             ) : (
//                                 <span className="text-gray-500 text-sm">No interests specified</span>
//                             )}
//                         </div>
//                     </div>

//                     <div className="mt-6">
//                         <h3 className="font-semibold text-gray-700 mb-2">Preferences & Notes</h3>
//                         <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">
//                             {selectedClient.preferences || 'No preferences recorded yet'}
//                         </p>
//                     </div>

//                     <div className="mt-6">
//                         <div className="flex justify-between items-center mb-2">
//                             <h3 className="font-semibold text-gray-700">Interested Areas</h3>
//                             <button
//                                 onClick={() => addInterestArea(selectedClient)}
//                                 className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center text-sm"
//                                 disabled={!map}
//                             >
//                                 <Plus size={14} className="mr-1" />
//                                 Add Area
//                             </button>
//                         </div>
//                         <div className="space-y-2">
//                             {selectedClient.interestedAreas && selectedClient.interestedAreas.length > 0 ? (
//                                 selectedClient.interestedAreas.map((area, index) => (
//                                     <div
//                                         key={index}
//                                         className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
//                                     >
//                                         <span className="text-sm text-gray-700 flex items-center">
//                                             <MapPin size={14} className="mr-2" />
//                                             {area.name}
//                                         </span>
//                                         {area.priority && (
//                                             <span className={`px-2 py-1 text-xs rounded-full ${area.priority === 'high' ? 'bg-red-100 text-red-700' :
//                                                     area.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                                                         'bg-green-100 text-green-700'
//                                                 }`}>
//                                                 {area.priority}
//                                             </span>
//                                         )}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="text-gray-500 text-sm text-center py-4">
//                                     No interested areas added yet
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Quick Actions */}
//                     <div className="mt-6 pt-6 border-t border-gray-200">
//                         <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
//                         <div className="flex flex-wrap gap-2">
//                             <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center">
//                                 <MessageCircle size={14} className="mr-1" />
//                                 WhatsApp
//                             </button>
//                             <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center">
//                                 <Phone size={14} className="mr-1" />
//                                 Call
//                             </button>
//                             <button
//                                 onClick={() => setEditingClient(selectedClient)}
//                                 className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm flex items-center"
//                             >
//                                 <Edit2 size={14} className="mr-1" />
//                                 Add Note
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Google Map */}
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                     <h2 className="text-xl font-semibold mb-4 flex items-center">
//                         <MapPin className="mr-2" size={20} />
//                         Interested Areas Map
//                         {selectedClient.interestedAreas && selectedClient.interestedAreas.length > 0 && (
//                             <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
//                                 {selectedClient.interestedAreas.length} areas
//                             </span>
//                         )}
//                     </h2>
//                     {mapLoaded ? (
//                         <div
//                             ref={mapRef}
//                             className="w-full h-96 rounded-lg border border-gray-200"
//                             style={{ minHeight: '400px' }}
//                         />
//                     ) : (
//                         <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
//                             <div className="text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//                                 <p className="text-gray-600">Loading Google Maps...</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </>
//         ) : (
//             <div className="bg-white rounded-lg shadow-md p-12 text-center">
//                 <User size={48} className="mx-auto text-gray-400 mb-4" />
//                 <h2 className="text-xl font-semibold text-gray-700 mb-2">
//                     Select a Client
//                 </h2>
//                 <p className="text-gray-600 mb-4">
//                     Choose a client from the list to view their details and manage their preferences.
//                 </p>
//                 <div className="text-sm text-gray-500">
//                     <p>✨ Upload WhatsApp screenshots to automatically extract client information</p>
//                     <p>📍 Add interested areas and view them on the map</p>
//                     <p>📊 Track client interactions and preferences</p>
//                 </div>
//             </div>
//         )}
//     </div>
//         </div >

//     {/* Edit Client Modal */ }
// {
//     editingClient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold">Edit Client</h3>
//                     <button
//                         onClick={() => setEditingClient(null)}
//                         className="text-gray-500 hover:text-gray-700"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name *
//                         </label>
//                         <input
//                             type="text"
//                             value={editingClient.name || ''}
//                             onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Phone *
//                         </label>
//                         <input
//                             type="text"
//                             value={editingClient.phone || ''}
//                             onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             WhatsApp Number
//                         </label>
//                         <input
//                             type="text"
//                             value={editingClient.whatsappNumber || ''}
//                             onChange={(e) => setEditingClient({ ...editingClient, whatsappNumber: e.target.value })}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             value={editingClient.email || ''}
//                             onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Status
//                         </label>
//                         <select
//                             value={editingClient.status || 'lead'}
//                             onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             <option value="lead">Lead</option>
//                             <option value="prospect">Prospect</option>
//                             <option value="client">Client</option>
//                             <option value="inactive">Inactive</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Priority
//                         </label>
//                         <select
//                             value={editingClient.priority || 'medium'}
//                             onChange={(e) => setEditingClient({ ...editingClient, priority: e.target.value })}
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             <option value="low">Low</option>
//                             <option value="medium">Medium</option>
//                             <option value="high">High</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Interests (comma-separated)
//                     </label>
//                     <input
//                         type="text"
//                         value={editingClient.interests ? editingClient.interests.join(', ') : ''}
//                         onChange={(e) => setEditingClient({
//                             ...editingClient,
//                             interests: e.target.value.split(',').map(i => i.trim()).filter(i => i)
//                         })}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Real Estate, Investment, Commercial..."
//                     />
//                 </div>

//                 <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Preferences & Notes
//                     </label>
//                     <textarea
//                         value={editingClient.preferences || ''}
//                         onChange={(e) => setEditingClient({ ...editingClient, preferences: e.target.value })}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Client preferences, requirements, notes..."
//                     />
//                 </div>

//                 <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Source
//                     </label>
//                     <select
//                         value={editingClient.source || 'whatsapp'}
//                         onChange={(e) => setEditingClient({ ...editingClient, source: e.target.value })}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value="whatsapp">WhatsApp</option>
//                         <option value="referral">Referral</option>
//                         <option value="website">Website</option>
//                         <option value="social_media">Social Media</option>
//                         <option value="advertisement">Advertisement</option>
//                         <option value="other">Other</option>
//                     </select>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-6">
//                     <button
//                         onClick={() => setEditingClient(null)}
//                         className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                         disabled={loading}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={() => updateClient(editingClient)}
//                         disabled={loading || !editingClient.name || !editingClient.phone}
//                         className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                         <Save size={16} className="mr-2" />
//                         {loading ? 'Saving...' : 'Save Changes'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// {/* Loading Overlay */ }
// {
//     loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
//             <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                 <span className="text-gray-700">Processing...</span>
//             </div>
//         </div>
//     )
// }
//       </div >
//     </div >
//   );
// };

// export default ClientManagementDashboard;


import React, { useState, useEffect, useRef } from 'react';
import { Upload, User, MapPin, Phone, MessageCircle, Edit2, Save, X, Plus, Trash2, Eye, Search, Filter, BarChart3, Calendar, AlertCircle } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

const base_url = 'http://localhost:5000' // new backend base url

const ClientManagementDashboard = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [analytics, setAnalytics] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    // Load clients from API
    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/clients?search=${searchTerm}&status=${filterStatus}`);
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data.clients || data);
        } catch (error) {
            setError('Failed to load clients: ' + error.message);
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load analytics data
    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`${base_url}/api/analytics/dashboard`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchClients();
        fetchAnalytics();
    }, [searchTerm, filterStatus]);

    // Mock data for demonstration - Remove this when API is connected
    // useEffect(() => {
    //     if (clients.length === 0) {
    //         const mockClients = [
    //             {
    //                 id: 1,
    //                 name: "John Doe",
    //                 phone: "+1234567890",
    //                 whatsappNumber: "+1234567890",
    //                 interests: ["Real Estate", "Investment"],
    //                 preferences: "Looking for 2-3 BHK apartments",
    //                 interestedAreas: [
    //                     { lat: 26.8467, lng: 80.9462, name: "Gomti Nagar, Lucknow" },
    //                     { lat: 26.8389, lng: 80.9231, name: "Hazratganj, Lucknow" }
    //                 ],
    //                 addedDate: "2025-01-15",
    //                 lastContact: "2025-01-18",
    //                 status: "lead",
    //                 priority: "high"
    //             },
    //             {
    //                 id: 2,
    //                 name: "Jane Smith",
    //                 phone: "+0987654321",
    //                 whatsappNumber: "+0987654321",
    //                 interests: ["Commercial Property"],
    //                 preferences: "Office spaces near IT parks",
    //                 interestedAreas: [
    //                     { lat: 26.8512, lng: 80.9462, name: "IT City, Lucknow" }
    //                 ],
    //                 addedDate: "2025-01-10",
    //                 lastContact: "2025-01-17",
    //                 status: "prospect",
    //                 priority: "medium"
    //             }
    //         ];
    //         setClients(mockClients);
    //     }
    // }, [clients.length]);

    // Load Google Maps
    useEffect(() => {
        if (window.google && window.google.maps) {
            setMapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // Initialize map
    useEffect(() => {
        if (mapLoaded && mapRef.current && !map) {
            const googleMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: 26.8467, lng: 80.9462 }, // Lucknow coordinates
                zoom: 12
            });
            setMap(googleMap);
        }
    }, [mapLoaded, map]);

    // Update markers when selected client changes
    useEffect(() => {
        if (map && selectedClient) {
            // Clear existing markers
            markers.forEach(marker => marker.setMap(null));

            // Add new markers for selected client
            const newMarkers = selectedClient.interestedAreas.map(area => {
                const marker = new window.google.maps.Marker({
                    position: { lat: area.lat, lng: area.lng },
                    map: map,
                    title: area.name
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div><strong>${selectedClient.name}</strong><br/>${area.name}</div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                return marker;
            });

            setMarkers(newMarkers);
        }
    }, [map, selectedClient]);

    // Upload and process WhatsApp screenshot
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('screenshot', file);

        try {
            // Show preview immediately
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target.result);
            reader.readAsDataURL(file);

            // Send to backend for OCR processing
            const response = await fetch(`${base_url}/api/upload/screenshot`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to process screenshot');

            const result = await response.json();
            setExtractedData(result.data);
        } catch (error) {
            setError('Failed to process screenshot: ' + error.message);
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create client from extracted data
    const addClientFromExtractedData = async () => {
        if (!extractedData?.suggested) return;

        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/upload/create-client`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    extractedData,
                    clientData: extractedData.suggested
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create client');
            }

            const result = await response.json();
            setClients([result.client, ...clients]);
            setExtractedData(null);
            setUploadedImage(null);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Update client
    const updateClient = async (updatedClient) => {
        try {
            const response = await fetch(`${base_url}/api/clients/${updatedClient.id || updatedClient._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedClient)
            });

            if (!response.ok) throw new Error('Failed to update client');

            const result = await response.json();
            setClients(clients.map(client =>
                (client.id || client._id) === (updatedClient.id || updatedClient._id) ? result : client
            ));
            setEditingClient(null);

            if (selectedClient && (selectedClient.id || selectedClient._id) === (updatedClient.id || updatedClient._id)) {
                setSelectedClient(result);
            }
        } catch (error) {
            setError('Failed to update client: ' + error.message);
        }
    };

    // Delete client
    const deleteClient = async (clientId) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;

        try {
            const response = await fetch(`${base_url}/api/clients/${clientId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete client');

            setClients(clients.filter(client => (client.id || client._id) !== clientId));

            if (selectedClient && (selectedClient.id || selectedClient._id) === clientId) {
                setSelectedClient(null);
            }
        } catch (error) {
            setError('Failed to delete client: ' + error.message);
        }
    };

    // Add interested area with geocoding
    const addInterestArea = async (client) => {
        if (!map) return;

        const location = prompt("Enter location name:");
        if (!location) return;

        try {
            const geocoder = new window.google.maps.Geocoder();
            const results = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: location }, (results, status) => {
                    if (status === 'OK') resolve(results);
                    else reject(new Error('Geocoding failed'));
                });
            });

            const newArea = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
                name: location,
                priority: 'medium'
            };

            const response = await fetch(`${base_url}/api/clients/${client.id || client._id}/areas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArea)
            });

            if (!response.ok) throw new Error('Failed to add area');

            const updatedClient = await response.json();
            setClients(clients.map(c =>
                (c.id || c._id) === (client.id || client._id) ? updatedClient : c
            ));

            if (selectedClient && (selectedClient.id || selectedClient._id) === (client.id || client._id)) {
                setSelectedClient(updatedClient);
            }
        } catch (error) {
            setError('Failed to add area: ' + error.message);
        }
    };

    // Filter clients based on search and status
    const filteredClients = clients.filter(client => {
        const matchesSearch = !searchTerm ||
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm) ||
            (client.preferences && client.preferences.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Client Management Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                        >
                            <BarChart3 size={16} className="mr-2" />
                            Analytics
                        </button>
                        <button
                            onClick={fetchClients}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                        <AlertCircle className="text-red-500 mr-2" size={20} />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Analytics Panel */}
                {showAnalytics && analytics && (
                    <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800">Total Clients</h3>
                                <p className="text-2xl font-bold text-blue-900">{analytics.summary?.totalClients || 0}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-800">New This Month</h3>
                                <p className="text-2xl font-bold text-green-900">{analytics.summary?.newClients || 0}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-yellow-800">Follow-ups Due</h3>
                                <p className="text-2xl font-bold text-yellow-900">{analytics.summary?.followUpsDue || 0}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-800">Growth Rate</h3>
                                <p className="text-2xl font-bold text-purple-900">{analytics.summary?.growthRate || 0}%</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Upload & Client List */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Search and Filter */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search clients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter size={16} className="text-gray-500" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="lead">Leads</option>
                                        <option value="prospect">Prospects</option>
                                        <option value="client">Clients</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Screenshot Upload */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Upload className="mr-2" size={20} />
                                Upload WhatsApp Screenshot
                            </h2>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="screenshot-upload"
                                    disabled={loading}
                                />
                                <label
                                    htmlFor="screenshot-upload"
                                    className={`cursor-pointer flex flex-col items-center ${loading ? 'opacity-50' : ''}`}
                                >
                                    <Upload size={40} className="text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        {loading ? 'Processing...' : 'Click to upload WhatsApp screenshot'}
                                    </span>
                                </label>
                            </div>

                            {uploadedImage && (
                                <div className="mt-4">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded screenshot"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    {extractedData ? (
                                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                            <h3 className="font-semibold text-green-800">Extracted Data:</h3>
                                            <p><strong>Name:</strong> {extractedData.suggested?.name}</p>
                                            <p><strong>Phone:</strong> {extractedData.suggested?.phone}</p>
                                            <p><strong>Preview:</strong> {extractedData.suggested?.chatPreview?.substring(0, 100)}...</p>
                                            <button
                                                onClick={addClientFromExtractedData}
                                                disabled={loading}
                                                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {loading ? 'Adding...' : 'Add as Client'}
                                            </button>
                                        </div>
                                    ) : loading ? (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-blue-800">Processing image with OCR...</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Client List */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <User className="mr-2" size={20} />
                                Clients ({filteredClients.length})
                            </h2>

                            {loading && !clients.length ? (
                                <div className="text-center py-8 text-gray-500">Loading clients...</div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {filteredClients.map(client => (
                                        <div
                                            key={client.id || client._id}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedClient?.id === client.id || selectedClient?._id === client._id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                                                        {client.status && (
                                                            <span className={`px-2 py-1 text-xs rounded-full ${client.status === 'client' ? 'bg-green-100 text-green-800' :
                                                                client.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                                                                    client.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {client.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                                        <Phone size={14} className="mr-1" />
                                                        {client.phone}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Added: {new Date(client.addedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingClient(client);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteClient(client.id || client._id);
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredClients.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No clients found matching your criteria
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Client Details & Map */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedClient ? (
                            <>
                                {/* Client Details */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-900">
                                                {selectedClient.name}
                                            </h2>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <span className={`px-3 py-1 text-sm rounded-full ${selectedClient.status === 'client' ? 'bg-green-100 text-green-800' :
                                                    selectedClient.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                                                        selectedClient.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {selectedClient.status || 'Lead'}
                                                </span>
                                                <span className={`px-3 py-1 text-sm rounded-full ${selectedClient.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    selectedClient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {selectedClient.priority || 'Medium'} Priority
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEditingClient(selectedClient)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                        >
                                            <Edit2 size={16} className="mr-2" />
                                            Edit
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                                            <p className="text-gray-600 flex items-center mb-2">
                                                <Phone size={16} className="mr-2" />
                                                {selectedClient.phone}
                                            </p>
                                            <p className="text-gray-600 flex items-center mb-2">
                                                <MessageCircle size={16} className="mr-2" />
                                                {selectedClient.whatsappNumber || selectedClient.phone}
                                            </p>
                                            {selectedClient.email && (
                                                <p className="text-gray-600 flex items-center">
                                                    <span className="mr-2">✉</span>
                                                    {selectedClient.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Timeline</h3>
                                            <p className="text-sm text-gray-600 flex items-center mb-1">
                                                <Calendar size={14} className="mr-2" />
                                                Added: {new Date(selectedClient.addedDate).toLocaleDateString()}
                                            </p>
                                            {selectedClient.lastContact && (
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <Calendar size={14} className="mr-2" />
                                                    Last Contact: {new Date(selectedClient.lastContact).toLocaleDateString()}
                                                </p>
                                            )}
                                            {selectedClient.source && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Source: <span className="capitalize">{selectedClient.source}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="font-semibold text-gray-700 mb-2">Interests</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedClient.interests && selectedClient.interests.length > 0 ? (
                                                selectedClient.interests.map((interest, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No interests specified</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="font-semibold text-gray-700 mb-2">Preferences & Notes</h3>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                                            {selectedClient.preferences || 'No preferences recorded yet'}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-gray-700">Interested Areas</h3>
                                            <button
                                                onClick={() => addInterestArea(selectedClient)}
                                                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center text-sm"
                                                disabled={!map}
                                            >
                                                <Plus size={14} className="mr-1" />
                                                Add Area
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedClient.interestedAreas && selectedClient.interestedAreas.length > 0 ? (
                                                selectedClient.interestedAreas.map((area, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                                    >
                                                        <span className="text-sm text-gray-700 flex items-center">
                                                            <MapPin size={14} className="mr-2" />
                                                            {area.name}
                                                        </span>
                                                        {area.priority && (
                                                            <span className={`px-2 py-1 text-xs rounded-full ${area.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                                area.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-green-100 text-green-700'
                                                                }`}>
                                                                {area.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-500 text-sm text-center py-4">
                                                    No interested areas added yet
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center">
                                                <MessageCircle size={14} className="mr-1" />
                                                WhatsApp
                                            </button>
                                            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center">
                                                <Phone size={14} className="mr-1" />
                                                Call
                                            </button>
                                            <button
                                                onClick={() => setEditingClient(selectedClient)}
                                                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm flex items-center"
                                            >
                                                <Edit2 size={14} className="mr-1" />
                                                Add Note
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Google Map */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <MapPin className="mr-2" size={20} />
                                        Interested Areas Map
                                        {selectedClient.interestedAreas && selectedClient.interestedAreas.length > 0 && (
                                            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {selectedClient.interestedAreas.length} areas
                                            </span>
                                        )}
                                    </h2>
                                    {mapLoaded ? (
                                        <div
                                            ref={mapRef}
                                            className="w-full h-96 rounded-lg border border-gray-200"
                                            style={{ minHeight: '400px' }}
                                        />
                                    ) : (
                                        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                <p className="text-gray-600">Loading Google Maps...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <User size={48} className="mx-auto text-gray-400 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                    Select a Client
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Choose a client from the list to view their details and manage their preferences.
                                </p>
                                <div className="text-sm text-gray-500">
                                    <p>✨ Upload WhatsApp screenshots to automatically extract client information</p>
                                    <p>📍 Add interested areas and view them on the map</p>
                                    <p>📊 Track client interactions and preferences</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Client Modal */}
                {editingClient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Edit Client</h3>
                                <button
                                    onClick={() => setEditingClient(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={editingClient.name || ''}
                                        onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="text"
                                        value={editingClient.phone || ''}
                                        onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="text"
                                        value={editingClient.whatsappNumber || ''}
                                        onChange={(e) => setEditingClient({ ...editingClient, whatsappNumber: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editingClient.email || ''}
                                        onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={editingClient.status || 'lead'}
                                        onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="lead">Lead</option>
                                        <option value="prospect">Prospect</option>
                                        <option value="client">Client</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={editingClient.priority || 'medium'}
                                        onChange={(e) => setEditingClient({ ...editingClient, priority: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Interests (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={editingClient.interests ? editingClient.interests.join(', ') : ''}
                                    onChange={(e) => setEditingClient({
                                        ...editingClient,
                                        interests: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                                    })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Real Estate, Investment, Commercial..."
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferences & Notes
                                </label>
                                <textarea
                                    value={editingClient.preferences || ''}
                                    onChange={(e) => setEditingClient({ ...editingClient, preferences: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Client preferences, requirements, notes..."
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Source
                                </label>
                                <select
                                    value={editingClient.source || 'whatsapp'}
                                    onChange={(e) => setEditingClient({ ...editingClient, source: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="referral">Referral</option>
                                    <option value="website">Website</option>
                                    <option value="social_media">Social Media</option>
                                    <option value="advertisement">Advertisement</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setEditingClient(null)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateClient(editingClient)}
                                    disabled={loading || !editingClient.name || !editingClient.phone}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Save size={16} className="mr-2" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
                        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700">Processing...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientManagementDashboard;