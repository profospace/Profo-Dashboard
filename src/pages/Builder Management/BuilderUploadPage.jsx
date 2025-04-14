// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';
// import PrefillOptions from '../../components/Builder/PrefillOptions';
// import MapSelector from '../../components/Builder/MapSelector';
// import {
//     FaBuilding, FaCloudUploadAlt, FaTimes, FaMapMarkerAlt,
//     FaPlus, FaImage, FaCheck, FaGlobe, FaPhone, FaCity,
//     FaChartBar, FaInfoCircle, FaSave, FaSpinner
// } from 'react-icons/fa';

// const BuilderUploadPage = () => {
//     const navigate = useNavigate();
//     const logoInputRef = useRef(null);
//     const [contactInput, setContactInput] = useState('');
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [logoFile, setLogoFile] = useState(null);
//     const [logoPreview, setLogoPreview] = useState(null);

//     const [operatingLocationInput, setOperatingLocationInput] = useState({
//         city: '',
//         state: ''
//     });

//     const [formData, setFormData] = useState({
//         name: '',
//         username: '',
//         company: '',
//         experience: 0,
//         establishedYear: new Date().getFullYear(),
//         status: 'ACTIVE',
//         description: '',
//         website: '',
//         contacts: [],
//         address: {
//             street: '',
//             city: '',
//             state: '',
//             pincode: ''
//         },
//         latitude: null,
//         longitude: null,
//         statistics: {
//             completedProjects: 0,
//             ongoingProjects: 0,
//             totalBuildings: 0,
//             totalProperties: 0
//         },
//         operatingLocations: [],
//         access: false
//     });

//     // Initialize with current location
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const location = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude
//                     };
//                     setFormData(prev => ({
//                         ...prev,
//                         latitude: location.lat,
//                         longitude: location.lng
//                     }));
//                     setIsLoading(false);
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                     // Default to India's center if geolocation fails
//                     setFormData(prev => ({
//                         ...prev,
//                         latitude: 20.5937,
//                         longitude: 78.9629
//                     }));
//                     setIsLoading(false);
//                 }
//             );
//         } else {
//             // Default to India's center if geolocation not supported
//             setFormData(prev => ({
//                 ...prev,
//                 latitude: 20.5937,
//                 longitude: 78.9629
//             }));
//             setIsLoading(false);
//         }
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         // Handle nested object inputs
//         if (name.includes('.')) {
//             const [parent, child] = name.split('.');
//             setFormData(prev => ({
//                 ...prev,
//                 [parent]: {
//                     ...prev[parent],
//                     [child]: value
//                 }
//             }));
//         } else if (name === 'experience' || name === 'establishedYear') {
//             // Convert to number for numeric inputs
//             setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleLatLngChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleLogoUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setLogoFile(file);
//             const previewUrl = URL.createObjectURL(file);
//             setLogoPreview(previewUrl);
//         }
//     };

//     const addContact = () => {
//         if (contactInput.trim()) {
//             setFormData(prev => ({
//                 ...prev,
//                 contacts: [...prev.contacts, contactInput.trim()]
//             }));
//             setContactInput('');
//         }
//     };

//     const removeContact = (index) => {
//         setFormData(prev => ({
//             ...prev,
//             contacts: prev.contacts.filter((_, i) => i !== index)
//         }));
//     };

//     const addOperatingLocation = () => {
//         const { city, state } = operatingLocationInput;
//         if (city.trim() && state.trim()) {
//             setFormData(prev => ({
//                 ...prev,
//                 operatingLocations: [
//                     ...prev.operatingLocations,
//                     { city: city.trim(), state: state.trim() }
//                 ]
//             }));
//             // Reset input
//             setOperatingLocationInput({ city: '', state: '' });
//         }
//     };

//     const removeOperatingLocation = (index) => {
//         setFormData(prev => ({
//             ...prev,
//             operatingLocations: prev.operatingLocations.filter((_, i) => i !== index)
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             // Create FormData for multipart/form-data submission
//             const formDataToSend = new FormData();

//             // Add the form data as JSON
//             formDataToSend.append('data', JSON.stringify(formData));

//             // Add the logo file if selected
//             if (logoFile) {
//                 formDataToSend.append('logo', logoFile);
//             }

//             // Send request
//             const response = await fetch(`${base_url}/builders`, {
//                 method: 'POST',
//                 headers: {
//                     // Add authorization if needed
//                     ...(localStorage.getItem('token') && {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     })
//                 },
//                 body: formDataToSend
//             });

//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.error || 'Failed to create builder');
//             }

//             // Navigate to the new builder page
//             navigate(`/builders/${result.builder._id}`);
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Failed to create builder: ' + error.message);
//             setIsSubmitting(false);
//         }
//     };

//     const handlePrefillData = (data) => {
//         setFormData(data);

//         // If logo is a URL, set as preview
//         if (data.logo && data.logo.startsWith('http')) {
//             setLogoPreview(data.logo);
//             setLogoFile(null); // Clear any file selection
//         }
//     };

//     const fetchCurrentLocation = () => {
//         setIsLoading(true);
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const location = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude
//                     };
//                     setFormData(prev => ({
//                         ...prev,
//                         latitude: location.lat,
//                         longitude: location.lng
//                     }));
//                     setIsLoading(false);
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                     alert("Unable to retrieve your location");
//                     setIsLoading(false);
//                 }
//             );
//         } else {
//             alert("Geolocation is not supported by this browser.");
//             setIsLoading(false);
//         }
//     };

//     const handleLocationSelect = (location) => {
//         setFormData(prev => ({
//             ...prev,
//             latitude: location.lat,
//             longitude: location.lng
//         }));
//     };

//     // Clean up object URLs to avoid memory leaks
//     useEffect(() => {
//         return () => {
//             if (logoPreview && logoPreview.startsWith('blob:')) {
//                 URL.revokeObjectURL(logoPreview);
//             }
//         };
//     }, [logoPreview]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//                 <span className="ml-4 text-lg text-gray-700">Loading...</span>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto px-4 py-8">
//             <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//                         <FaBuilding className="mr-3 text-blue-600" />
//                         Create New Builder
//                     </h1>

//                     <PrefillOptions onSelect={handlePrefillData} />
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Basic Information Section */}
//                     <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                             <FaInfoCircle className="mr-2 text-blue-500" />
//                             Basic Information
//                         </h2>

//                         <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Builder Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     required
//                                     placeholder="Enter builder name"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Company Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="company"
//                                     value={formData.company}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     placeholder="Enter company name"
//                                 />
//                             </div>
//                         </div>

//                         {/* Description */}
//                         <div className="mt-6">
//                             <label className="block text-gray-700 font-medium mb-2">
//                                 Description
//                             </label>
//                             <textarea
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 rows="3"
//                                 placeholder="Enter a description of the builder"
//                             ></textarea>
//                         </div>

//                         {/* Logo Upload */}
//                         <div className="mt-6">
//                             <label className="block text-gray-700 font-medium mb-2">
//                                 Company Logo
//                             </label>
//                             <div className="flex items-center">
//                                 <input
//                                     type="file"
//                                     ref={logoInputRef}
//                                     onChange={handleLogoUpload}
//                                     className="hidden"
//                                     accept="image/*"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => logoInputRef.current.click()}
//                                     className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
//                                 >
//                                     <FaImage className="mr-2" />
//                                     {logoFile ? "Change Logo" : "Upload Logo"}
//                                 </button>
//                                 {logoPreview && (
//                                     <div className="ml-4 flex items-center">
//                                         <img
//                                             src={logoPreview}
//                                             alt="Logo Preview"
//                                             className="w-16 h-16 object-cover rounded-lg border border-gray-300"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setLogoPreview(null);
//                                                 setLogoFile(null);
//                                             }}
//                                             className="ml-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
//                                         >
//                                             <FaTimes />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                             <p className="text-sm text-gray-500 mt-2">
//                                 Recommended: Square image (1:1 ratio), max 2MB in size
//                             </p>
//                         </div>
//                     </div>

//                     {/* Contact Information Section */}
//                     <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                             <FaPhone className="mr-2 text-blue-500" />
//                             Contact Information
//                         </h2>

//                         <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Website
//                                 </label>
//                                 <div className="flex items-center">
//                                     <FaGlobe className="text-gray-500 mr-2" />
//                                     <input
//                                         type="url"
//                                         name="website"
//                                         value={formData.website}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                         placeholder="https://example.com"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Contacts
//                                 </label>
//                                 <div className="flex">
//                                     <input
//                                         type="text"
//                                         value={contactInput}
//                                         onChange={(e) => setContactInput(e.target.value)}
//                                         className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                         placeholder="Enter phone or email"
//                                         onKeyPress={(e) => {
//                                             if (e.key === 'Enter') {
//                                                 e.preventDefault();
//                                                 addContact();
//                                             }
//                                         }}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={addContact}
//                                         className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-all"
//                                     >
//                                         <FaPlus />
//                                     </button>
//                                 </div>

//                                 <div className="mt-3 flex flex-wrap gap-2">
//                                     {formData.contacts.map((contact, index) => (
//                                         <span
//                                             key={index}
//                                             className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
//                                         >
//                                             {contact}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeContact(index)}
//                                                 className="ml-2 text-blue-600 hover:text-blue-800"
//                                             >
//                                                 <FaTimes />
//                                             </button>
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Location Section */}
//                     <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                             <FaMapMarkerAlt className="mr-2 text-blue-500" />
//                             Location Information
//                         </h2>

//                         {/* Address Fields */}
//                         <div className="grid md:grid-cols-2 gap-6 mb-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Street
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="address.street"
//                                     value={formData.address.street}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     placeholder="Enter street address"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     City
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="address.city"
//                                     value={formData.address.city}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     placeholder="Enter city"
//                                 />
//                             </div>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-6 mb-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     State
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="address.state"
//                                     value={formData.address.state}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     placeholder="Enter state"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Pincode
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="address.pincode"
//                                     value={formData.address.pincode}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     placeholder="Enter pincode"
//                                 />
//                             </div>
//                         </div>

//                         {/* Map Coordinates */}
//                         <div className="mb-6">
//                             <div className="flex justify-between items-center mb-2">
//                                 <label className="text-gray-700 font-medium">
//                                     Map Location
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={fetchCurrentLocation}
//                                     className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 transition-all flex items-center"
//                                 >
//                                     <FaMapMarkerAlt className="mr-1" />
//                                     Use My Location
//                                 </button>
//                             </div>

//                             <div className="grid md:grid-cols-2 gap-6 mb-4">
//                                 <div>
//                                     <input
//                                         type="number"
//                                         value={formData.latitude || ''}
//                                         onChange={(e) => handleLatLngChange('latitude', parseFloat(e.target.value))}
//                                         step="any"
//                                         placeholder="Latitude"
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     />
//                                 </div>
//                                 <div>
//                                     <input
//                                         type="number"
//                                         value={formData.longitude || ''}
//                                         onChange={(e) => handleLatLngChange('longitude', parseFloat(e.target.value))}
//                                         step="any"
//                                         placeholder="Longitude"
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Map Selector */}
//                             <div className="border border-gray-300 rounded-lg overflow-hidden">
//                                 <MapSelector
//                                     onLocationSelect={handleLocationSelect}
//                                     initialPosition={{
//                                         lat: formData.latitude,
//                                         lng: formData.longitude
//                                     }}
//                                 />
//                             </div>
//                             <p className="text-sm text-gray-500 mt-2">
//                                 Click on the map to set the builder's location or drag the marker to adjust
//                             </p>
//                         </div>

//                         {/* Operating Locations */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2">
//                                 Operating Locations
//                             </label>
//                             <div className="flex space-x-2 mb-4">
//                                 <input
//                                     type="text"
//                                     placeholder="City"
//                                     value={operatingLocationInput.city}
//                                     onChange={(e) => setOperatingLocationInput(prev => ({
//                                         ...prev,
//                                         city: e.target.value
//                                     }))}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="State"
//                                     value={operatingLocationInput.state}
//                                     onChange={(e) => setOperatingLocationInput(prev => ({
//                                         ...prev,
//                                         state: e.target.value
//                                     }))}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={addOperatingLocation}
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
//                                 >
//                                     <FaPlus />
//                                 </button>
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                                 {formData.operatingLocations.map((location, index) => (
//                                     <span
//                                         key={index}
//                                         className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm"
//                                     >
//                                         {`${location.city}, ${location.state}`}
//                                         <button
//                                             type="button"
//                                             onClick={() => removeOperatingLocation(index)}
//                                             className="ml-2 text-green-600 hover:text-green-800"
//                                         >
//                                             <FaTimes />
//                                         </button>
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Experience & Statistics Section */}
//                     <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                             <FaChartBar className="mr-2 text-blue-500" />
//                             Experience & Statistics
//                         </h2>

//                         <div className="grid md:grid-cols-2 gap-6 mb-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Experience (Years)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="experience"
//                                     value={formData.experience}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Established Year
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="establishedYear"
//                                     value={formData.establishedYear}
//                                     onChange={handleInputChange}
//                                     min="1900"
//                                     max={new Date().getFullYear()}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-6 mb-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Completed Projects
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="statistics.completedProjects"
//                                     value={formData.statistics.completedProjects}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Ongoing Projects
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="statistics.ongoingProjects"
//                                     value={formData.statistics.ongoingProjects}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Total Buildings
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="statistics.totalBuildings"
//                                     value={formData.statistics.totalBuildings}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Total Properties
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="statistics.totalProperties"
//                                     value={formData.statistics.totalProperties}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Status & Access */}
//                     <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                             <FaCheck className="mr-2 text-blue-500" />
//                             Status & Settings
//                         </h2>

//                         <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Status
//                                 </label>
//                                 <select
//                                     name="status"
//                                     value={formData.status}
//                                     onChange={handleInputChange}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 >
//                                     <option value="ACTIVE">Active</option>
//                                     <option value="INACTIVE">Inactive</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Builder Access
//                                 </label>
//                                 <div className="flex items-center mt-3">
//                                     <label className="inline-flex items-center cursor-pointer">
//                                         <input
//                                             type="checkbox"
//                                             name="access"
//                                             checked={formData.access}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 access: e.target.checked
//                                             }))}
//                                             className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
//                                         />
//                                         <span className="ml-2 text-gray-700">
//                                             {formData.access ? 'Access Granted' : 'Access Restricted'}
//                                         </span>
//                                     </label>
//                                     <span className="ml-2 text-sm text-gray-500">
//                                         {formData.access
//                                             ? 'Builder will be able to log in and manage their properties'
//                                             : 'Builder will not have access to the platform'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex justify-center">
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all text-lg font-medium flex items-center justify-center min-w-[200px]"
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <FaSpinner className="animate-spin mr-2" />
//                                     Creating...
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaSave className="mr-2" />
//                                     Create Builder
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default BuilderUploadPage;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base_url } from '../../../utils/base_url';
import PrefillOptions from '../../components/Builder/PrefillOptions';
import MapSelector from '../../components/Builder/MapSelector';
import {
    FaBuilding, FaCloudUploadAlt, FaTimes, FaMapMarkerAlt,
    FaPlus, FaImage, FaCheck, FaGlobe, FaPhone, FaCity,
    FaChartBar, FaInfoCircle, FaSave, FaSpinner, FaBell, FaEnvelope
} from 'react-icons/fa';

const BuilderUploadPage = () => {
    const navigate = useNavigate();
    const logoInputRef = useRef(null);
    const [contactInput, setContactInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [operatingLocationInput, setOperatingLocationInput] = useState({
        city: '',
        state: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        company: '',
        experience: 0,
        establishedYear: new Date().getFullYear(),
        status: 'ACTIVE',
        description: '',
        website: '',
        contacts: [],
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        latitude: null,
        longitude: null,
        statistics: {
            completedProjects: 0,
            ongoingProjects: 0,
            totalBuildings: 0,
            totalProperties: 0
        },
        operatingLocations: [],
        access: false,
        emailNotifications: {
            dailyReport: {
                enabled: false,
                time: "08:00",
                email: "",
                lastSent: null
            }
        }
    });

    // Initialize with current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setFormData(prev => ({
                        ...prev,
                        latitude: location.lat,
                        longitude: location.lng
                    }));
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Default to India's center if geolocation fails
                    setFormData(prev => ({
                        ...prev,
                        latitude: 20.5937,
                        longitude: 78.9629
                    }));
                    setIsLoading(false);
                }
            );
        } else {
            // Default to India's center if geolocation not supported
            setFormData(prev => ({
                ...prev,
                latitude: 20.5937,
                longitude: 78.9629
            }));
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle deeply nested object inputs
        if (name.includes('.')) {
            const parts = name.split('.');

            if (parts.length === 2) {
                const [parent, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
            } else if (parts.length === 3) {
                const [parent, middle, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [middle]: {
                            ...prev[parent][middle],
                            [child]: value
                        }
                    }
                }));
            }
        } else if (name === 'experience' || name === 'establishedYear') {
            // Convert to number for numeric inputs
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        // Handle nested checkbox fields
        if (name.includes('.')) {
            const parts = name.split('.');

            if (parts.length === 3) {
                const [parent, middle, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [middle]: {
                            ...prev[parent][middle],
                            [child]: checked
                        }
                    }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handleLatLngChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    const addContact = () => {
        if (contactInput.trim()) {
            setFormData(prev => ({
                ...prev,
                contacts: [...prev.contacts, contactInput.trim()]
            }));
            setContactInput('');

            // If it's an email and no notification email is set, use this as default
            if (contactInput.match(/^\S+@\S+\.\S+$/) && !formData.emailNotifications.dailyReport.email) {
                setFormData(prev => ({
                    ...prev,
                    emailNotifications: {
                        ...prev.emailNotifications,
                        dailyReport: {
                            ...prev.emailNotifications.dailyReport,
                            email: contactInput.trim()
                        }
                    }
                }));
            }
        }
    };

    const removeContact = (index) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index)
        }));
    };

    const addOperatingLocation = () => {
        const { city, state } = operatingLocationInput;
        if (city.trim() && state.trim()) {
            setFormData(prev => ({
                ...prev,
                operatingLocations: [
                    ...prev.operatingLocations,
                    { city: city.trim(), state: state.trim() }
                ]
            }));
            // Reset input
            setOperatingLocationInput({ city: '', state: '' });
        }
    };

    const removeOperatingLocation = (index) => {
        setFormData(prev => ({
            ...prev,
            operatingLocations: prev.operatingLocations.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create FormData for multipart/form-data submission
            const formDataToSend = new FormData();

            // Add the form data as JSON
            formDataToSend.append('data', JSON.stringify(formData));

            // Add the logo file if selected
            if (logoFile) {
                formDataToSend.append('logo', logoFile);
            }

            // Send request
            const response = await fetch(`${base_url}/builders`, {
                method: 'POST',
                headers: {
                    // Add authorization if needed
                    ...(localStorage.getItem('token') && {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    })
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create builder');
            }

            // Navigate to the new builder page
            navigate(`/builders/${result.builder._id}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create builder: ' + error.message);
            setIsSubmitting(false);
        }
    };

    const handlePrefillData = (data) => {
        setFormData(data);

        // If logo is a URL, set as preview
        if (data.logo && data.logo.startsWith('http')) {
            setLogoPreview(data.logo);
            setLogoFile(null); // Clear any file selection
        }
    };

    const fetchCurrentLocation = () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setFormData(prev => ({
                        ...prev,
                        latitude: location.lat,
                        longitude: location.lng
                    }));
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location");
                    setIsLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLoading(false);
        }
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
        }));
    };

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-lg text-gray-700">Loading...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <FaBuilding className="mr-3 text-blue-600" />
                        Create New Builder
                    </h1>

                    <PrefillOptions onSelect={handlePrefillData} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaInfoCircle className="mr-2 text-blue-500" />
                            Basic Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Builder Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    placeholder="Enter builder name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter company name"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Username (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Leave blank to auto-generate"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    If left blank, a username will be auto-generated
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Leave blank to auto-generate"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    If left blank, a password will be auto-generated
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows="3"
                                placeholder="Enter a description of the builder"
                            ></textarea>
                        </div>

                        {/* Logo Upload */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Company Logo
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current.click()}
                                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    <FaImage className="mr-2" />
                                    {logoFile ? "Change Logo" : "Upload Logo"}
                                </button>
                                {logoPreview && (
                                    <div className="ml-4 flex items-center">
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLogoPreview(null);
                                                setLogoFile(null);
                                            }}
                                            className="ml-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Recommended: Square image (1:1 ratio), max 2MB in size
                            </p>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaPhone className="mr-2 text-blue-500" />
                            Contact Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Website
                                </label>
                                <div className="flex items-center">
                                    <FaGlobe className="text-gray-500 mr-2" />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Contacts
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={contactInput}
                                        onChange={(e) => setContactInput(e.target.value)}
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter phone or email"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addContact();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addContact}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-all"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {formData.contacts.map((contact, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
                                        >
                                            {contact}
                                            <button
                                                type="button"
                                                onClick={() => removeContact(index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <FaTimes />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaBell className="mr-2 text-blue-500" />
                            Notification Settings
                        </h2>

                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="dailyReportEnabled"
                                    name="emailNotifications.dailyReport.enabled"
                                    checked={formData.emailNotifications.dailyReport.enabled}
                                    onChange={handleCheckboxChange}
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                />
                                <label htmlFor="dailyReportEnabled" className="ml-2 text-gray-700 font-medium">
                                    Enable Daily Report Emails
                                </label>
                            </div>
                        </div>

                        {formData.emailNotifications.dailyReport.enabled && (
                            <div className="grid md:grid-cols-2 gap-6 pl-7">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-500 mr-2" />
                                        <input
                                            type="email"
                                            name="emailNotifications.dailyReport.email"
                                            value={formData.emailNotifications.dailyReport.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="email@example.com"
                                            required={formData.emailNotifications.dailyReport.enabled}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Delivery Time (24-hour format)
                                    </label>
                                    <input
                                        type="time"
                                        name="emailNotifications.dailyReport.time"
                                        value={formData.emailNotifications.dailyReport.time}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                            Location Information
                        </h2>

                        {/* Address Fields */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Street
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter street address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter state"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter pincode"
                                />
                            </div>
                        </div>

                        {/* Map Coordinates */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-700 font-medium">
                                    Map Location
                                </label>
                                <button
                                    type="button"
                                    onClick={fetchCurrentLocation}
                                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 transition-all flex items-center"
                                >
                                    <FaMapMarkerAlt className="mr-1" />
                                    Use My Location
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <input
                                        type="number"
                                        value={formData.latitude || ''}
                                        onChange={(e) => handleLatLngChange('latitude', parseFloat(e.target.value))}
                                        step="any"
                                        placeholder="Latitude"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        value={formData.longitude || ''}
                                        onChange={(e) => handleLatLngChange('longitude', parseFloat(e.target.value))}
                                        step="any"
                                        placeholder="Longitude"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Map Selector */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <MapSelector
                                    onLocationSelect={handleLocationSelect}
                                    initialPosition={{
                                        lat: formData.latitude,
                                        lng: formData.longitude
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Click on the map to set the builder's location or drag the marker to adjust
                            </p>
                        </div>

                        {/* Operating Locations */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Operating Locations
                            </label>
                            <div className="flex space-x-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={operatingLocationInput.city}
                                    onChange={(e) => setOperatingLocationInput(prev => ({
                                        ...prev,
                                        city: e.target.value
                                    }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={operatingLocationInput.state}
                                    onChange={(e) => setOperatingLocationInput(prev => ({
                                        ...prev,
                                        state: e.target.value
                                    }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={addOperatingLocation}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.operatingLocations.map((location, index) => (
                                    <span
                                        key={index}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm"
                                    >
                                        {`${location.city}, ${location.state}`}
                                        <button
                                            type="button"
                                            onClick={() => removeOperatingLocation(index)}
                                            className="ml-2 text-green-600 hover:text-green-800"
                                        >
                                            <FaTimes />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experience & Statistics Section */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChartBar className="mr-2 text-blue-500" />
                            Experience & Statistics
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Experience (Years)
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Established Year
                                </label>
                                <input
                                    type="number"
                                    name="establishedYear"
                                    value={formData.establishedYear}
                                    onChange={handleInputChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Completed Projects
                                </label>
                                <input
                                    type="number"
                                    name="statistics.completedProjects"
                                    value={formData.statistics.completedProjects}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Ongoing Projects
                                </label>
                                <input
                                    type="number"
                                    name="statistics.ongoingProjects"
                                    value={formData.statistics.ongoingProjects}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Total Buildings
                                </label>
                                <input
                                    type="number"
                                    name="statistics.totalBuildings"
                                    value={formData.statistics.totalBuildings}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Total Properties
                                </label>
                                <input
                                    type="number"
                                    name="statistics.totalProperties"
                                    value={formData.statistics.totalProperties}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status & Access */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaCheck className="mr-2 text-blue-500" />
                            Status & Settings
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Builder Access
                                </label>
                                <div className="flex items-center mt-3">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="access"
                                            checked={formData.access}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            {formData.access ? 'Access Granted' : 'Access Restricted'}
                                        </span>
                                    </label>
                                    <span className="ml-2 text-sm text-gray-500">
                                        {formData.access
                                            ? 'Builder will be able to log in and manage their properties'
                                            : 'Builder will not have access to the platform'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all text-lg font-medium flex items-center justify-center min-w-[200px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Create Builder
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BuilderUploadPage;