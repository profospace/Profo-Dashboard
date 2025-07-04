// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// // import { base_url } from "../../../utils/base_url";
// import LocationMap from './LocationMap';

// const ProjectForm = ({ projectData, isEditing, onSubmit, onReset, onFileUpdates, onChange, loading, builders = [] }) => {
//     // Initialize form data from props or default values
//     const [formData, setFormData] = useState({
//         name: '',
//         type: 'RESIDENTIAL',
//         status: 'UPCOMING',
//         builder: '',
//         reraNumber: '',
//         reravalidity: '',
//         description: '',
//         overview: {
//             totalUnits: '',
//             totalTowers: '',
//             launchDate: '',
//             possessionDate: '',
//             priceRange: {
//                 min: '',
//                 max: '',
//                 pricePerSqFt: ''
//             }
//         },
//         location: {
//             address: '',
//             landmark: '',
//             city: '',
//             state: '',
//             pincode: '',
//             latitude: '',
//             longitude: ''
//         },
//         floorPlans: [],
//         amenities: [],
//         highlights: [],
//         brochures: [],
//         nearbyLocations: [],
//         offer: [],
//         propertyType: []
//     });

//     const [selectedAmenity, setSelectedAmenity] = useState('');
//     const [newOfferTag, setNewOfferTag] = useState('');
//     const [galleryFiles, setGalleryFiles] = useState([]);
//     const [floorPlanFiles, setFloorPlanFiles] = useState({});
//     const [formDataChanged, setFormDataChanged] = useState(false);

//     // Populate form when projectData changes (when editing)
//     useEffect(() => {
//         if (projectData) {
//             setFormData(prev => ({
//                 ...prev,
//                 ...projectData
//             }));
//         }
//     }, [projectData]);

//     // Notify parent component about file updates
//     useEffect(() => {
//         if (onFileUpdates) {
//             onFileUpdates(galleryFiles, floorPlanFiles);
//         }
//     }, [galleryFiles, floorPlanFiles, onFileUpdates]);

//     // Handle form field changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // Handle nested fields
//         if (name.includes('.')) {
//             const fields = name.split('.');

//             if (fields.length === 2) {
//                 setFormData(prev => ({
//                     ...prev,
//                     [fields[0]]: {
//                         ...prev[fields[0]],
//                         [fields[1]]: value
//                     }
//                 }));
//             } else if (fields.length === 3) {
//                 setFormData(prev => ({
//                     ...prev,
//                     [fields[0]]: {
//                         ...prev[fields[0]],
//                         [fields[1]]: {
//                             ...prev[fields[0]][fields[1]],
//                             [fields[2]]: value
//                         }
//                     }
//                 }));
//             }
//         } else {
//             // Handle top-level fields
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Notify parent of form changes - FIXED to prevent infinite loop
//     useEffect(() => {
//         if (onChange && formDataChanged) {
//             onChange(formData);
//             setFormDataChanged(false); // Reset the flag after notifying parent
//         }
//     }, [formData, onChange, formDataChanged]);

//     // Handle location selection from map
//     const handleLocationSelect = (location) => {
//         setFormData(prev => ({
//             ...prev,
//             location: {
//                 ...prev.location,
//                 latitude: location.lat,
//                 longitude: location.lng
//             }
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Add a floor plan
//     const addFloorPlan = () => {
//         setFormData(prev => ({
//             ...prev,
//             floorPlans: [
//                 ...prev.floorPlans,
//                 {
//                     name: '',
//                     type: '',
//                     bedrooms: 0,
//                     bathrooms: 0,
//                     superArea: 0,
//                     carpetArea: 0,
//                     price: 0,
//                     image: ''
//                 }
//             ]
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Remove a floor plan
//     const removeFloorPlan = (index) => {
//         const updatedPlans = [...formData.floorPlans];
//         updatedPlans.splice(index, 1);

//         // Also remove any associated file
//         const updatedFiles = { ...floorPlanFiles };
//         delete updatedFiles[index];
//         setFloorPlanFiles(updatedFiles);

//         setFormData(prev => ({
//             ...prev,
//             floorPlans: updatedPlans
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Handle floor plan changes
//     const handleFloorPlanChange = (index, field, value) => {
//         const updatedPlans = [...formData.floorPlans];
//         updatedPlans[index][field] = value;

//         setFormData(prev => ({
//             ...prev,
//             floorPlans: updatedPlans
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Handle floor plan image upload
//     const handleFloorPlanImageChange = (index, files) => {
//         if (files && files.length > 0) {
//             // Store the file for later submission
//             setFloorPlanFiles(prev => ({
//                 ...prev,
//                 [index]: files[0]
//             }));

//             // Create a preview URL
//             const imageUrl = URL.createObjectURL(files[0]);

//             const updatedPlans = [...formData.floorPlans];
//             updatedPlans[index].image = imageUrl;

//             setFormData(prev => ({
//                 ...prev,
//                 floorPlans: updatedPlans
//             }));

//             // Mark that form data has changed
//             setFormDataChanged(true);
//         }
//     };

//     // Add an amenity category
//     const addAmenity = () => {
//         if (!selectedAmenity.trim()) return;

//         // Check if this amenity category already exists
//         const existingIndex = formData.amenities.findIndex(
//             a => a.category.toLowerCase() === selectedAmenity.toLowerCase()
//         );

//         if (existingIndex !== -1) {
//             toast.error('This amenity category already exists');
//             return;
//         }

//         setFormData(prev => ({
//             ...prev,
//             amenities: [
//                 ...prev.amenities,
//                 {
//                     category: selectedAmenity,
//                     items: []
//                 }
//             ]
//         }));

//         setSelectedAmenity('');

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Add amenity item
//     const addAmenityItem = (categoryIndex) => {
//         const newItem = prompt('Enter amenity item:');

//         if (!newItem || !newItem.trim()) return;

//         const updatedAmenities = [...formData.amenities];
//         updatedAmenities[categoryIndex].items.push(newItem.trim());

//         setFormData(prev => ({
//             ...prev,
//             amenities: updatedAmenities
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Remove amenity category
//     const removeAmenityCategory = (index) => {
//         const updatedAmenities = [...formData.amenities];
//         updatedAmenities.splice(index, 1);

//         setFormData(prev => ({
//             ...prev,
//             amenities: updatedAmenities
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Remove amenity item
//     const removeAmenityItem = (categoryIndex, itemIndex) => {
//         const updatedAmenities = [...formData.amenities];
//         updatedAmenities[categoryIndex].items.splice(itemIndex, 1);

//         setFormData(prev => ({
//             ...prev,
//             amenities: updatedAmenities
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Add offer tag
//     const addOfferTag = () => {
//         if (!newOfferTag.trim()) return;

//         if (!formData.offer.includes(newOfferTag.trim())) {
//             setFormData(prev => ({
//                 ...prev,
//                 offer: [...prev.offer, newOfferTag.trim()]
//             }));

//             setNewOfferTag('');

//             // Mark that form data has changed
//             setFormDataChanged(true);
//         } else {
//             toast.error('This offer tag already exists');
//         }
//     };

//     // Remove offer tag
//     const removeOfferTag = (tag) => {
//         setFormData(prev => ({
//             ...prev,
//             offer: prev.offer.filter(t => t !== tag)
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Add property type
//     const handlePropertyTypeChange = (type) => {
//         const updatedTypes = formData.propertyType.includes(type)
//             ? formData.propertyType.filter(t => t !== type)
//             : [...formData.propertyType, type];

//         setFormData(prev => ({
//             ...prev,
//             propertyType: updatedTypes
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Add highlight
//     const addHighlight = () => {
//         setFormData(prev => ({
//             ...prev,
//             highlights: [
//                 ...prev.highlights,
//                 { title: '', description: '', icon: '' }
//             ]
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Update highlight
//     const updateHighlight = (index, field, value) => {
//         const updatedHighlights = [...formData.highlights];
//         updatedHighlights[index][field] = value;

//         setFormData(prev => ({
//             ...prev,
//             highlights: updatedHighlights
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Remove highlight
//     const removeHighlight = (index) => {
//         const updatedHighlights = [...formData.highlights];
//         updatedHighlights.splice(index, 1);

//         setFormData(prev => ({
//             ...prev,
//             highlights: updatedHighlights
//         }));

//         // Mark that form data has changed
//         setFormDataChanged(true);
//     };

//     // Handle gallery file uploads
//     const handleGalleryUpload = (e) => {
//         const files = Array.from(e.target.files);
//         setGalleryFiles(prevFiles => [...prevFiles, ...files]);
//     };

//     // Remove gallery file
//     const removeGalleryFile = (index) => {
//         setGalleryFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//     };

//     // Form submission
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     onSubmit(formData);
//     // };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Create a FormData object for file uploads
//         const formDataObj = new FormData();

//         // Clone the form data to avoid modifying the original state
//         const projectDataToSubmit = { ...formData };

//         // Add the main project data as a JSON string
//         formDataObj.append('data', JSON.stringify(projectDataToSubmit));

//         // Add gallery images if any
//         if (galleryFiles && galleryFiles.length > 0) {
//             galleryFiles.forEach((file) => {
//                 formDataObj.append('galleryList', file);
//             });

//             // Clear temporary URLs from the data since we're uploading the actual files
//             projectDataToSubmit.gallery = [];
//         }

//         // Add floor plan images if any
//         if (Object.keys(floorPlanFiles).length > 0) {
//             // Keep track of floor plan indices to help with mapping files to floor plans
//             const floorPlanIndices = [];

//             Object.entries(floorPlanFiles).forEach(([index, file]) => {
//                 // Add floor plan image with index to FormData
//                 formDataObj.append('floorPlanImages', file);
//                 floorPlanIndices.push(index);

//                 // Clear temporary URLs from the data since we're uploading the actual files
//                 projectDataToSubmit.floorPlans[index].image = '';
//             });

//             // Add indices to help backend map files to floor plans
//             formDataObj.append('floorPlanIndices', JSON.stringify(floorPlanIndices));
//         }

//         // Call parent's onSubmit with the FormData object instead of just the form data
//         onSubmit(formDataObj);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Information Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Project Type*</label>
//                         <select
//                             name="type"
//                             value={formData.type}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="RESIDENTIAL">Residential</option>
//                             <option value="COMMERCIAL">Commercial</option>
//                             <option value="MIXED_USE">Mixed Use</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                         <select
//                             name="status"
//                             value={formData.status}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="UPCOMING">Upcoming</option>
//                             <option value="UNDER_CONSTRUCTION">Under Construction</option>
//                             <option value="COMPLETED">Completed</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Builder</label>
//                         <select
//                             name="builder"
//                             value={formData.builder}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">Select Builder</option>
//                             {builders.map(builder => (
//                                 <option key={builder._id} value={builder._id}>
//                                     {builder.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">RERA Number*</label>
//                         <input
//                             type="text"
//                             name="reraNumber"
//                             value={formData.reraNumber}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter RERA registration number"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">RERA Validity*</label>
//                         <input
//                             type="text"
//                             name="reravalidity"
//                             value={formData.reravalidity}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter RERA validity"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             rows="3"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         ></textarea>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Offer Tags</label>
//                         <div className="flex items-center space-x-2">
//                             <input
//                                 type="text"
//                                 value={newOfferTag}
//                                 onChange={(e) => setNewOfferTag(e.target.value)}
//                                 className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 placeholder="Add offer tag"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={addOfferTag}
//                                 className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                             >
//                                 Add
//                             </button>
//                         </div>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                             {formData.offer.map((tag, index) => (
//                                 <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
//                                     <span>{tag}</span>
//                                     <button
//                                         type="button"
//                                         onClick={() => removeOfferTag(tag)}
//                                         className="ml-1 text-blue-800 hover:text-blue-900"
//                                     >
//                                         &times;
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Property Types</label>
//                         <div className="grid grid-cols-2 gap-2">
//                             {['Apartment', 'Villa', 'Plot', 'Independent House', 'Shop', 'Office'].map((type) => (
//                                 <div key={type} className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         id={`type-${type}`}
//                                         checked={formData.propertyType.includes(type)}
//                                         onChange={() => handlePropertyTypeChange(type)}
//                                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                                     />
//                                     <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
//                                         {type}
//                                     </label>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Overview Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Project Overview</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
//                         <input
//                             type="number"
//                             name="overview.totalUnits"
//                             value={formData.overview.totalUnits}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Total Towers</label>
//                         <input
//                             type="number"
//                             name="overview.totalTowers"
//                             value={formData.overview.totalTowers}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Launch Date</label>
//                         <input
//                             type="date"
//                             name="overview.launchDate"
//                             value={formData.overview.launchDate}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Possession Date</label>
//                         <input
//                             type="date"
//                             name="overview.possessionDate"
//                             value={formData.overview.possessionDate}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Price (₹)</label>
//                         <input
//                             type="number"
//                             name="overview.priceRange.min"
//                             value={formData.overview.priceRange.min}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Price (₹)</label>
//                         <input
//                             type="number"
//                             name="overview.priceRange.max"
//                             value={formData.overview.priceRange.max}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Price per sq.ft (₹)</label>
//                         <input
//                             type="number"
//                             name="overview.priceRange.pricePerSqFt"
//                             value={formData.overview.priceRange.pricePerSqFt}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Location Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Location Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
//                         <input
//                             type="text"
//                             name="location.address"
//                             value={formData.location.address}
//                             onChange={handleChange}
//                             required
//                             placeholder="Full address of the project"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
//                         <input
//                             type="text"
//                             name="location.landmark"
//                             value={formData.location.landmark}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
//                         <input
//                             type="text"
//                             name="location.city"
//                             value={formData.location.city}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
//                         <input
//                             type="text"
//                             name="location.state"
//                             value={formData.location.state}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
//                         <input
//                             type="text"
//                             name="location.pincode"
//                             value={formData.location.pincode}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Location on Map</label>
//                         <LocationMap
//                             initialLocation={
//                                 formData.location.latitude && formData.location.longitude
//                                     ? { lat: parseFloat(formData.location.latitude), lng: parseFloat(formData.location.longitude) }
//                                     : undefined
//                             }
//                             onLocationSelect={handleLocationSelect}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Floor Plans Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Floor Plans</h3>

//                 {formData.floorPlans.map((plan, index) => (
//                     <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
//                         <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium text-gray-700">Floor Plan {index + 1}</h4>
//                             <button
//                                 type="button"
//                                 onClick={() => removeFloorPlan(index)}
//                                 className="text-red-600 hover:text-red-800"
//                             >
//                                 Remove
//                             </button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
//                                 <input
//                                     type="text"
//                                     value={plan.name}
//                                     onChange={(e) => handleFloorPlanChange(index, 'name', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//                                 <input
//                                     type="text"
//                                     value={plan.type}
//                                     onChange={(e) => handleFloorPlanChange(index, 'type', e.target.value)}
//                                     placeholder="e.g., 2BHK, 3BHK"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
//                                 <input
//                                     type="number"
//                                     value={plan.bedrooms}
//                                     onChange={(e) => handleFloorPlanChange(index, 'bedrooms', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
//                                 <input
//                                     type="number"
//                                     value={plan.bathrooms}
//                                     onChange={(e) => handleFloorPlanChange(index, 'bathrooms', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Super Area (sq.ft)</label>
//                                 <input
//                                     type="number"
//                                     value={plan.superArea}
//                                     onChange={(e) => handleFloorPlanChange(index, 'superArea', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq.ft)</label>
//                                 <input
//                                     type="number"
//                                     value={plan.carpetArea}
//                                     onChange={(e) => handleFloorPlanChange(index, 'carpetArea', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//                                 <input
//                                     type="number"
//                                     value={plan.price}
//                                     onChange={(e) => handleFloorPlanChange(index, 'price', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Floor Plan Image</label>
//                                 <input
//                                     type="file"
//                                     onChange={(e) => handleFloorPlanImageChange(index, e.target.files)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     accept="image/*"
//                                 />
//                                 {plan.image && (
//                                     <div className="mt-2">
//                                         <img
//                                             src={plan.image}
//                                             alt={`Preview of ${plan.name}`}
//                                             className="h-20 object-contain"
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//                 <button
//                     type="button"
//                     onClick={addFloorPlan}
//                     className="mt-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                 >
//                     Add Floor Plan
//                 </button>
//             </div>

//             {/* Amenities Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Amenities</h3>

//                 <div className="flex items-center space-x-2 mb-4">
//                     <input
//                         type="text"
//                         value={selectedAmenity}
//                         onChange={(e) => setSelectedAmenity(e.target.value)}
//                         placeholder="Enter amenity category"
//                         className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                         type="button"
//                         onClick={addAmenity}
//                         className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                         Add Category
//                     </button>
//                 </div>

//                 {formData.amenities.map((amenity, categoryIndex) => (
//                     <div key={categoryIndex} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
//                         <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium text-gray-700">{amenity.category}</h4>
//                             <button
//                                 type="button"
//                                 onClick={() => removeAmenityCategory(categoryIndex)}
//                                 className="text-red-600 hover:text-red-800"
//                             >
//                                 Remove Category
//                             </button>
//                         </div>

//                         <div className="space-y-2">
//                             {amenity.items.map((item, itemIndex) => (
//                                 <div key={itemIndex} className="flex items-center">
//                                     <span className="flex-grow">{item}</span>
//                                     <button
//                                         type="button"
//                                         onClick={() => removeAmenityItem(categoryIndex, itemIndex)}
//                                         className="text-red-600 hover:text-red-800 ml-2"
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => addAmenityItem(categoryIndex)}
//                             className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
//                         >
//                             Add Item
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Highlights Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Project Highlights</h3>

//                 {formData.highlights.map((highlight, index) => (
//                     <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
//                         <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium text-gray-700">Highlight {index + 1}</h4>
//                             <button
//                                 type="button"
//                                 onClick={() => removeHighlight(index)}
//                                 className="text-red-600 hover:text-red-800"
//                             >
//                                 Remove
//                             </button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                                 <input
//                                     type="text"
//                                     value={highlight.title}
//                                     onChange={(e) => updateHighlight(index, 'title', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                                 <input
//                                     type="text"
//                                     value={highlight.description}
//                                     onChange={(e) => updateHighlight(index, 'description', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
//                                 <input
//                                     type="text"
//                                     value={highlight.icon}
//                                     onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="URL to icon image (optional)"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//                 <button
//                     type="button"
//                     onClick={addHighlight}
//                     className="mt-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                 >
//                     Add Highlight
//                 </button>
//             </div>

//             {/* Nearby Locations Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Nearby Locations</h3>

//                 <button
//                     type="button"
//                     onClick={() => {
//                         setFormData(prev => ({
//                             ...prev,
//                             nearbyLocations: [
//                                 ...prev.nearbyLocations,
//                                 { type: '', name: '', distance: '' }
//                             ]
//                         }));
//                         setFormDataChanged(true);
//                     }}
//                     className="mb-4 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                 >
//                     Add Nearby Location
//                 </button>

//                 {formData.nearbyLocations.map((location, index) => (
//                     <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
//                         <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium text-gray-700">Location {index + 1}</h4>
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     const updatedLocations = [...formData.nearbyLocations];
//                                     updatedLocations.splice(index, 1);
//                                     setFormData(prev => ({
//                                         ...prev,
//                                         nearbyLocations: updatedLocations
//                                     }));
//                                     setFormDataChanged(true);
//                                 }}
//                                 className="text-red-600 hover:text-red-800"
//                             >
//                                 Remove
//                             </button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//                                 <select
//                                     value={location.type}
//                                     onChange={(e) => {
//                                         const updatedLocations = [...formData.nearbyLocations];
//                                         updatedLocations[index].type = e.target.value;
//                                         setFormData(prev => ({
//                                             ...prev,
//                                             nearbyLocations: updatedLocations
//                                         }));
//                                         setFormDataChanged(true);
//                                     }}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 >
//                                     <option value="">Select Type</option>
//                                     <option value="HOSPITAL">Hospital</option>
//                                     <option value="SCHOOL">School</option>
//                                     <option value="COLLEGE">College</option>
//                                     <option value="SHOPPING_MALL">Shopping Mall</option>
//                                     <option value="METRO_STATION">Metro Station</option>
//                                     <option value="BUS_STAND">Bus Stand</option>
//                                     <option value="AIRPORT">Airport</option>
//                                     <option value="RAILWAY_STATION">Railway Station</option>
//                                     <option value="PARK">Park</option>
//                                     <option value="RESTAURANT">Restaurant</option>
//                                     <option value="CAFE">Cafe</option>
//                                     <option value="BANK">Bank</option>
//                                     <option value="ATM">ATM</option>
//                                     <option value="PHARMACY">Pharmacy</option>
//                                     <option value="GROCERY_STORE">Grocery Store</option>
//                                     <option value="GYM">Gym</option>
//                                     <option value="OTHER">Other</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                                 <input
//                                     type="text"
//                                     value={location.name}
//                                     onChange={(e) => {
//                                         const updatedLocations = [...formData.nearbyLocations];
//                                         updatedLocations[index].name = e.target.value;
//                                         setFormData(prev => ({
//                                             ...prev,
//                                             nearbyLocations: updatedLocations
//                                         }));
//                                         setFormDataChanged(true);
//                                     }}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
//                                 <input
//                                     type="number"
//                                     value={location.distance}
//                                     onChange={(e) => {
//                                         const updatedLocations = [...formData.nearbyLocations];
//                                         updatedLocations[index].distance = e.target.value;
//                                         setFormData(prev => ({
//                                             ...prev,
//                                             nearbyLocations: updatedLocations
//                                         }));
//                                         setFormDataChanged(true);
//                                     }}
//                                     step="0.1"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Brochures Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Brochures</h3>

//                 <div className="mb-4">
//                     <input
//                         type="file"
//                         onChange={(e) => {
//                             const files = Array.from(e.target.files);
//                             // In a real implementation, you'd upload these files and get URLs back
//                             // Here we're just creating object URLs for preview
//                             const newBrochures = files.map(file => ({
//                                 name: file.name,
//                                 url: URL.createObjectURL(file),
//                                 // You'd typically store the file here to upload later
//                                 file
//                             }));

//                             setFormData(prev => ({
//                                 ...prev,
//                                 brochures: [...prev.brochures, ...newBrochures]
//                             }));
//                             setFormDataChanged(true);
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         accept=".pdf,.doc,.docx"
//                         multiple
//                     />
//                     <p className="text-sm text-gray-500 mt-1">Upload project brochures (PDF, DOC, DOCX)</p>
//                 </div>

//                 {formData.brochures.length > 0 && (
//                     <div className="space-y-2">
//                         <h4 className="font-medium text-gray-700">Uploaded Brochures</h4>
//                         {formData.brochures.map((brochure, index) => (
//                             <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md">
//                                 <div className="flex items-center">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
//                                     </svg>
//                                     <span>{brochure.name}</span>
//                                 </div>
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         const updatedBrochures = [...formData.brochures];
//                                         updatedBrochures.splice(index, 1);
//                                         setFormData(prev => ({
//                                             ...prev,
//                                             brochures: updatedBrochures
//                                         }));
//                                         setFormDataChanged(true);
//                                     }}
//                                     className="text-red-600 hover:text-red-800"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Gallery Section */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Project Gallery</h3>

//                 <div className="mb-4">
//                     <input
//                         type="file"
//                         onChange={handleGalleryUpload}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         accept="image/*"
//                         multiple
//                     />
//                     <p className="text-sm text-gray-500 mt-1">Upload project images (JPEG, PNG, etc.)</p>
//                 </div>

//                 {galleryFiles.length > 0 && (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
//                         {galleryFiles.map((file, index) => (
//                             <div key={index} className="relative">
//                                 <img
//                                     src={URL.createObjectURL(file)}
//                                     alt={`Gallery preview ${index}`}
//                                     className="w-full h-32 object-cover rounded-md"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => removeGalleryFile(index)}
//                                     className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
//                                 >
//                                     &times;
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-4">
//                 {onReset && (
//                     <button
//                         type="button"
//                         onClick={onReset}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                     >
//                         Reset
//                     </button>
//                 )}
//                 <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
//                     disabled={loading}
//                 >
//                     {loading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
//                 </button>
//             </div>
//         </form>
//     );

// }
// export default ProjectForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LocationMap from './LocationMap';
import ImagePreview from './ImagePreview';
import { Calendar, DollarSign, Building, MapPin, Image, FileText, Star, Plus, Trash2 } from 'lucide-react';

const ProjectForm = ({ projectData, isEditing, onSubmit, onReset, onFileUpdates, onChange, loading, builders = [] }) => {
    // Initialize form data from props or default values
    const [formData, setFormData] = useState({
        name: '',
        type: 'RESIDENTIAL',
        status: 'UPCOMING',
        availabilityStatus: 'COMING_SOON',
        builder: '',
        reraNumber: '',
        reraValidity: '',
        description: '',
        overview: {
            totalUnits: '',
            totalTowers: '',
            totalFloors: '',
            launchDate: '',
            possessionDate: '',
            priceRange: {
                min: '',
                max: '',
                pricePerSqFt: ''
            }
        },
        location: {
            address: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            latitude: '',
            longitude: ''
        },
        floorPlans: [],
        amenities: [],
        highlights: [],
        brochures: [],
        nearbyLocations: [],
        paymentPlan: [],
        specification: [],
        phases: [],
        offer: [],
        propertyType: [],
        masterPlan: '',
        videos: []
    });

    const [selectedAmenity, setSelectedAmenity] = useState('');
    const [newOfferTag, setNewOfferTag] = useState('');
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [floorPlanFiles, setFloorPlanFiles] = useState({});
    const [formDataChanged, setFormDataChanged] = useState(false);

    // Populate form when projectData changes (when editing)
    useEffect(() => {
        if (projectData) {
            setFormData(prev => ({
                ...prev,
                ...projectData
            }));

            // Extract existing gallery images for preview
            if (projectData.galleryNow) {
                setExistingGalleryImages(projectData.galleryNow);
            } else if (projectData.gallery) {
                const allImages = projectData.gallery.reduce((acc, cat) => {
                    return [...acc, ...cat.images];
                }, []);
                setExistingGalleryImages(allImages);
            }
        }
    }, [projectData]);

    // Notify parent component about file updates
    useEffect(() => {
        if (onFileUpdates) {
            onFileUpdates(galleryFiles, floorPlanFiles);
        }
    }, [galleryFiles, floorPlanFiles, onFileUpdates]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const fields = name.split('.');

            if (fields.length === 2) {
                setFormData(prev => ({
                    ...prev,
                    [fields[0]]: {
                        ...prev[fields[0]],
                        [fields[1]]: value
                    }
                }));
            } else if (fields.length === 3) {
                setFormData(prev => ({
                    ...prev,
                    [fields[0]]: {
                        ...prev[fields[0]],
                        [fields[1]]: {
                            ...prev[fields[0]][fields[1]],
                            [fields[2]]: value
                        }
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        setFormDataChanged(true);
    };

    // Notify parent of form changes
    useEffect(() => {
        if (onChange && formDataChanged) {
            onChange(formData);
            setFormDataChanged(false);
        }
    }, [formData, onChange, formDataChanged]);

    // Handle location selection from map
    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                latitude: location.lat,
                longitude: location.lng
            }
        }));
        setFormDataChanged(true);
    };

    // Gallery image management
    const handleGalleryAdd = (newFiles) => {
        setGalleryFiles(prev => [...prev, ...newFiles]);
    };

    const handleGalleryRemove = (index) => {
        if (index < existingGalleryImages.length) {
            // Remove from existing images
            setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
        } else {
            // Remove from new files
            const newFileIndex = index - existingGalleryImages.length;
            setGalleryFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        }
    };

    // Combine existing and new gallery images for display
    const allGalleryImages = [...existingGalleryImages, ...galleryFiles];

    // Floor plan management
    const addFloorPlan = () => {
        setFormData(prev => ({
            ...prev,
            floorPlans: [
                ...prev.floorPlans,
                {
                    name: '',
                    type: '',
                    bedrooms: 0,
                    bathrooms: 0,
                    superArea: 0,
                    carpetArea: 0,
                    price: 0,
                    image: '',
                    isActive: true
                }
            ]
        }));
        setFormDataChanged(true);
    };

    const removeFloorPlan = (index) => {
        const updatedPlans = [...formData.floorPlans];
        updatedPlans.splice(index, 1);

        const updatedFiles = { ...floorPlanFiles };
        delete updatedFiles[index];
        setFloorPlanFiles(updatedFiles);

        setFormData(prev => ({
            ...prev,
            floorPlans: updatedPlans
        }));
        setFormDataChanged(true);
    };

    const handleFloorPlanChange = (index, field, value) => {
        const updatedPlans = [...formData.floorPlans];
        updatedPlans[index][field] = value;

        setFormData(prev => ({
            ...prev,
            floorPlans: updatedPlans
        }));
        setFormDataChanged(true);
    };

    const handleFloorPlanImageChange = (index, files) => {
        if (files && files.length > 0) {
            setFloorPlanFiles(prev => ({
                ...prev,
                [index]: files[0]
            }));

            const imageUrl = URL.createObjectURL(files[0]);
            const updatedPlans = [...formData.floorPlans];
            updatedPlans[index].image = imageUrl;

            setFormData(prev => ({
                ...prev,
                floorPlans: updatedPlans
            }));
            setFormDataChanged(true);
        }
    };

    // Amenity management
    const addAmenity = () => {
        if (!selectedAmenity.trim()) return;

        const existingIndex = formData.amenities.findIndex(
            a => a.category.toLowerCase() === selectedAmenity.toLowerCase()
        );

        if (existingIndex !== -1) {
            toast.error('This amenity category already exists');
            return;
        }

        setFormData(prev => ({
            ...prev,
            amenities: [
                ...prev.amenities,
                {
                    category: selectedAmenity,
                    items: []
                }
            ]
        }));

        setSelectedAmenity('');
        setFormDataChanged(true);
    };

    const addAmenityItem = (categoryIndex) => {
        const newItem = prompt('Enter amenity item:');
        if (!newItem || !newItem.trim()) return;

        const updatedAmenities = [...formData.amenities];
        updatedAmenities[categoryIndex].items.push(newItem.trim());

        setFormData(prev => ({
            ...prev,
            amenities: updatedAmenities
        }));
        setFormDataChanged(true);
    };

    const removeAmenityCategory = (index) => {
        const updatedAmenities = [...formData.amenities];
        updatedAmenities.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            amenities: updatedAmenities
        }));
        setFormDataChanged(true);
    };

    const removeAmenityItem = (categoryIndex, itemIndex) => {
        const updatedAmenities = [...formData.amenities];
        updatedAmenities[categoryIndex].items.splice(itemIndex, 1);

        setFormData(prev => ({
            ...prev,
            amenities: updatedAmenities
        }));
        setFormDataChanged(true);
    };

    // Offer management
    const addOfferTag = () => {
        if (!newOfferTag.trim()) return;

        if (!formData.offer.includes(newOfferTag.trim())) {
            setFormData(prev => ({
                ...prev,
                offer: [...prev.offer, newOfferTag.trim()]
            }));
            setNewOfferTag('');
            setFormDataChanged(true);
        } else {
            toast.error('This offer tag already exists');
        }
    };

    const removeOfferTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            offer: prev.offer.filter(t => t !== tag)
        }));
        setFormDataChanged(true);
    };

    // Property type management
    const handlePropertyTypeChange = (type) => {
        const updatedTypes = formData.propertyType.includes(type)
            ? formData.propertyType.filter(t => t !== type)
            : [...formData.propertyType, type];

        setFormData(prev => ({
            ...prev,
            propertyType: updatedTypes
        }));
        setFormDataChanged(true);
    };

    // Highlight management
    const addHighlight = () => {
        setFormData(prev => ({
            ...prev,
            highlights: [
                ...prev.highlights,
                { title: '', description: '', icon: '' }
            ]
        }));
        setFormDataChanged(true);
    };

    const updateHighlight = (index, field, value) => {
        const updatedHighlights = [...formData.highlights];
        updatedHighlights[index][field] = value;

        setFormData(prev => ({
            ...prev,
            highlights: updatedHighlights
        }));
        setFormDataChanged(true);
    };

    const removeHighlight = (index) => {
        const updatedHighlights = [...formData.highlights];
        updatedHighlights.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            highlights: updatedHighlights
        }));
        setFormDataChanged(true);
    };

    // Payment plan management
    const addPaymentPlan = () => {
        setFormData(prev => ({
            ...prev,
            paymentPlan: [
                ...prev.paymentPlan,
                { stage: '', percentage: 0, description: '' }
            ]
        }));
        setFormDataChanged(true);
    };

    const updatePaymentPlan = (index, field, value) => {
        const updatedPlans = [...formData.paymentPlan];
        updatedPlans[index][field] = value;

        setFormData(prev => ({
            ...prev,
            paymentPlan: updatedPlans
        }));
        setFormDataChanged(true);
    };

    const removePaymentPlan = (index) => {
        const updatedPlans = [...formData.paymentPlan];
        updatedPlans.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            paymentPlan: updatedPlans
        }));
        setFormDataChanged(true);
    };

    // Specification management
    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specification: [
                ...prev.specification,
                { category: '', details: [] }
            ]
        }));
        setFormDataChanged(true);
    };

    const updateSpecificationCategory = (index, value) => {
        const updatedSpecs = [...formData.specification];
        updatedSpecs[index].category = value;

        setFormData(prev => ({
            ...prev,
            specification: updatedSpecs
        }));
        setFormDataChanged(true);
    };

    const addSpecificationDetail = (specIndex) => {
        const detail = prompt('Enter specification detail:');
        if (!detail || !detail.trim()) return;

        const updatedSpecs = [...formData.specification];
        updatedSpecs[specIndex].details.push(detail.trim());

        setFormData(prev => ({
            ...prev,
            specification: updatedSpecs
        }));
        setFormDataChanged(true);
    };

    const removeSpecification = (index) => {
        const updatedSpecs = [...formData.specification];
        updatedSpecs.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            specification: updatedSpecs
        }));
        setFormDataChanged(true);
    };

    const removeSpecificationDetail = (specIndex, detailIndex) => {
        const updatedSpecs = [...formData.specification];
        updatedSpecs[specIndex].details.splice(detailIndex, 1);

        setFormData(prev => ({
            ...prev,
            specification: updatedSpecs
        }));
        setFormDataChanged(true);
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        const projectDataToSubmit = { ...formData };

        // Handle removed existing gallery images
        if (isEditing) {
            const removedImages = projectData.galleryNow?.filter(img => !existingGalleryImages.includes(img)) || [];
            if (removedImages.length > 0) {
                projectDataToSubmit.removedGalleryImages = removedImages;
            }
            projectDataToSubmit.galleryNow = existingGalleryImages;
        }

        formDataObj.append('data', JSON.stringify(projectDataToSubmit));

        // Add new gallery images
        if (galleryFiles && galleryFiles.length > 0) {
            galleryFiles.forEach((file) => {
                formDataObj.append('galleryList', file);
            });
        }

        // Add floor plan images
        if (Object.keys(floorPlanFiles).length > 0) {
            const floorPlanIndices = [];
            Object.entries(floorPlanFiles).forEach(([index, file]) => {
                formDataObj.append('floorPlanImages', file);
                floorPlanIndices.push(index);
                projectDataToSubmit.floorPlans[index].image = '';
            });
            formDataObj.append('floorPlanIndices', JSON.stringify(floorPlanIndices));
        }

        onSubmit(formDataObj);
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex items-center">
                            <Building className="h-6 w-6 text-white mr-3" />
                            <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter project name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Type *
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="RESIDENTIAL">Residential</option>
                                            <option value="COMMERCIAL">Commercial</option>
                                            <option value="MIXED_USE">Mixed Use</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="UPCOMING">Upcoming</option>
                                            <option value="UNDER_CONSTRUCTION">Under Construction</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Availability Status
                                    </label>
                                    <select
                                        name="availabilityStatus"
                                        value={formData.availabilityStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="COMING_SOON">Coming Soon</option>
                                        <option value="BOOKING_OPEN">Booking Open</option>
                                        <option value="ALMOST_SOLD_OUT">Almost Sold Out</option>
                                        <option value="SOLD_OUT">Sold Out</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Builder
                                    </label>
                                    <select
                                        name="builder"
                                        value={formData.builder}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select Builder</option>
                                        {builders.map(builder => (
                                            <option key={builder._id} value={builder._id}>
                                                {builder.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            RERA Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="reraNumber"
                                            value={formData.reraNumber}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter RERA number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            RERA Validity *
                                        </label>
                                        <input
                                            type="date"
                                            name="reraValidity"
                                            value={formData.reraValidity}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Master Plan URL
                                    </label>
                                    <input
                                        type="url"
                                        name="masterPlan"
                                        value={formData.masterPlan}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://example.com/master-plan.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Enter project description"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Property Types */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Property Types
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {['Apartment', 'Villa', 'Plot', 'Independent House', 'Shop', 'Office'].map((type) => (
                                    <div key={type} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`type-${type}`}
                                            checked={formData.propertyType.includes(type)}
                                            onChange={() => handlePropertyTypeChange(type)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Offer Tags */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Offer Tags
                            </label>
                            <div className="flex items-center space-x-2 mb-3">
                                <input
                                    type="text"
                                    value={newOfferTag}
                                    onChange={(e) => setNewOfferTag(e.target.value)}
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Add offer tag"
                                />
                                <button
                                    type="button"
                                    onClick={addOfferTag}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.offer.map((tag, index) => (
                                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm">
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeOfferTag(tag)}
                                            className="ml-2 text-blue-800 hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Overview Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                        <div className="flex items-center">
                            <DollarSign className="h-6 w-6 text-white mr-3" />
                            <h3 className="text-xl font-semibold text-white">Project Overview</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Units
                                </label>
                                <input
                                    type="number"
                                    name="overview.totalUnits"
                                    value={formData.overview.totalUnits}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Towers
                                </label>
                                <input
                                    type="number"
                                    name="overview.totalTowers"
                                    value={formData.overview.totalTowers}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Floors
                                </label>
                                <input
                                    type="number"
                                    name="overview.totalFloors"
                                    value={formData.overview.totalFloors}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Launch Date
                                </label>
                                <input
                                    type="date"
                                    name="overview.launchDate"
                                    value={formData.overview.launchDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Possession Date
                                </label>
                                <input
                                    type="date"
                                    name="overview.possessionDate"
                                    value={formData.overview.possessionDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price per sq.ft (₹)
                                </label>
                                <input
                                    type="number"
                                    name="overview.priceRange.pricePerSqFt"
                                    value={formData.overview.priceRange.pricePerSqFt}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="overview.priceRange.min"
                                    value={formData.overview.priceRange.min}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="overview.priceRange.max"
                                    value={formData.overview.priceRange.max}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                        <div className="flex items-center">
                            <MapPin className="h-6 w-6 text-white mr-3" />
                            <h3 className="text-xl font-semibold text-white">Location Details</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Address *
                                    </label>
                                    <textarea
                                        name="location.address"
                                        value={formData.location.address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Enter complete address"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="location.city"
                                            value={formData.location.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="location.state"
                                            value={formData.location.state}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Landmark
                                        </label>
                                        <input
                                            type="text"
                                            name="location.landmark"
                                            value={formData.location.landmark}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="location.pincode"
                                            value={formData.location.pincode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location on Map
                                </label>
                                <LocationMap
                                    initialLocation={
                                        formData.location.latitude && formData.location.longitude
                                            ? { lat: parseFloat(formData.location.latitude), lng: parseFloat(formData.location.longitude) }
                                            : undefined
                                    }
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4">
                        <div className="flex items-center">
                            <Image className="h-6 w-6 text-white mr-3" />
                            <h3 className="text-xl font-semibold text-white">Project Gallery</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <ImagePreview
                            images={allGalleryImages}
                            onRemove={handleGalleryRemove}
                            onAdd={handleGalleryAdd}
                            title="Gallery Images"
                            maxImages={20}
                        />
                    </div>
                </div>

                {/* Floor Plans Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Floor Plans</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addFloorPlan}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Floor Plan
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {formData.floorPlans.map((plan, index) => (
                            <div key={index} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-gray-800">Floor Plan {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeFloorPlan(index)}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                                        <input
                                            type="text"
                                            value={plan.name}
                                            onChange={(e) => handleFloorPlanChange(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                        <input
                                            type="text"
                                            value={plan.type}
                                            onChange={(e) => handleFloorPlanChange(index, 'type', e.target.value)}
                                            placeholder="e.g., 2BHK, 3BHK"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                        <input
                                            type="number"
                                            value={plan.bedrooms}
                                            onChange={(e) => handleFloorPlanChange(index, 'bedrooms', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                        <input
                                            type="number"
                                            value={plan.bathrooms}
                                            onChange={(e) => handleFloorPlanChange(index, 'bathrooms', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Super Area (sq.ft)</label>
                                        <input
                                            type="number"
                                            value={plan.superArea}
                                            onChange={(e) => handleFloorPlanChange(index, 'superArea', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq.ft)</label>
                                        <input
                                            type="number"
                                            value={plan.carpetArea}
                                            onChange={(e) => handleFloorPlanChange(index, 'carpetArea', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={plan.price}
                                            onChange={(e) => handleFloorPlanChange(index, 'price', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor Plan Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFloorPlanImageChange(index, e.target.files)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            accept="image/*"
                                        />
                                        {plan.image && (
                                            <div className="mt-2">
                                                <img
                                                    src={plan.image}
                                                    alt={`Preview of ${plan.name}`}
                                                    className="h-20 w-20 object-cover rounded-lg border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`active-${index}`}
                                            checked={plan.isActive}
                                            onChange={(e) => handleFloorPlanChange(index, 'isActive', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`active-${index}`} className="ml-2 text-sm text-gray-700">
                                            Active Plan
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.floorPlans.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No floor plans added yet</p>
                                <button
                                    type="button"
                                    onClick={addFloorPlan}
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Your First Floor Plan
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Amenities Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                        <div className="flex items-center">
                            <Star className="h-6 w-6 text-white mr-3" />
                            <h3 className="text-xl font-semibold text-white">Amenities</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <input
                                type="text"
                                value={selectedAmenity}
                                onChange={(e) => setSelectedAmenity(e.target.value)}
                                placeholder="Enter amenity category (e.g., Recreation, Security)"
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={addAmenity}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Category
                            </button>
                        </div>

                        {formData.amenities.map((amenity, categoryIndex) => (
                            <div key={categoryIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">{amenity.category}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeAmenityCategory(categoryIndex)}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove Category
                                    </button>
                                </div>

                                <div className="space-y-2 mb-3">
                                    {amenity.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center justify-between bg-white p-2 rounded border">
                                            <span className="text-gray-700">{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAmenityItem(categoryIndex, itemIndex)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addAmenityItem(categoryIndex)}
                                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
                                >
                                    + Add Item
                                </button>
                            </div>
                        ))}

                        {formData.amenities.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No amenities added yet</p>
                                <p className="text-sm">Add categories like Recreation, Security, etc.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Highlights Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Star className="h-6 w-6 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Project Highlights</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addHighlight}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Highlight
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {formData.highlights.map((highlight, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">Highlight {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeHighlight(index)}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                        <input
                                            type="text"
                                            value={highlight.title}
                                            onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                                        <input
                                            type="url"
                                            value={highlight.icon}
                                            onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://example.com/icon.png"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                        <textarea
                                            value={highlight.description}
                                            onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            rows="2"
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.highlights.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No highlights added yet</p>
                                <button
                                    type="button"
                                    onClick={addHighlight}
                                    className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Add Your First Highlight
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Plan Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <DollarSign className="h-6 w-6 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Payment Plan</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addPaymentPlan}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Stage
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {formData.paymentPlan.map((plan, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">Stage {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removePaymentPlan(index)}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage Name *</label>
                                        <input
                                            type="text"
                                            value={plan.stage}
                                            onChange={(e) => updatePaymentPlan(index, 'stage', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Booking, Construction"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage *</label>
                                        <input
                                            type="number"
                                            value={plan.percentage}
                                            onChange={(e) => updatePaymentPlan(index, 'percentage', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={plan.description}
                                            onChange={(e) => updatePaymentPlan(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Stage description"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.paymentPlan.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No payment plan added yet</p>
                                <button
                                    type="button"
                                    onClick={addPaymentPlan}
                                    className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                >
                                    Add Payment Stage
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Specifications Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Specifications</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addSpecification}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {formData.specification.map((spec, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <input
                                        type="text"
                                        value={spec.category}
                                        onChange={(e) => updateSpecificationCategory(index, e.target.value)}
                                        className="font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-2 py-1"
                                        placeholder="Specification Category"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpecification(index)}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove Category
                                    </button>
                                </div>

                                <div className="space-y-2 mb-3">
                                    {spec.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="flex items-center justify-between bg-white p-2 rounded border">
                                            <span className="text-gray-700">{detail}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecificationDetail(index, detailIndex)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addSpecificationDetail(index)}
                                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
                                >
                                    + Add Detail
                                </button>
                            </div>
                        ))}

                        {formData.specification.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No specifications added yet</p>
                                <p className="text-sm">Add categories like Structure, Electrical, etc.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nearby Locations Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <MapPin className="h-6 w-6 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Nearby Locations</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        nearbyLocations: [
                                            ...prev.nearbyLocations,
                                            { type: '', name: '', distance: 0, duration: 0 }
                                        ]
                                    }));
                                    setFormDataChanged(true);
                                }}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Location
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {formData.nearbyLocations.map((location, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">Location {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedLocations = [...formData.nearbyLocations];
                                            updatedLocations.splice(index, 1);
                                            setFormData(prev => ({
                                                ...prev,
                                                nearbyLocations: updatedLocations
                                            }));
                                            setFormDataChanged(true);
                                        }}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                        <select
                                            value={location.type}
                                            onChange={(e) => {
                                                const updatedLocations = [...formData.nearbyLocations];
                                                updatedLocations[index].type = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    nearbyLocations: updatedLocations
                                                }));
                                                setFormDataChanged(true);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="HOSPITAL">Hospital</option>
                                            <option value="SCHOOL">School</option>
                                            <option value="COLLEGE">College</option>
                                            <option value="SHOPPING_MALL">Shopping Mall</option>
                                            <option value="METRO_STATION">Metro Station</option>
                                            <option value="BUS_STAND">Bus Stand</option>
                                            <option value="AIRPORT">Airport</option>
                                            <option value="RAILWAY_STATION">Railway Station</option>
                                            <option value="PARK">Park</option>
                                            <option value="RESTAURANT">Restaurant</option>
                                            <option value="CAFE">Cafe</option>
                                            <option value="BANK">Bank</option>
                                            <option value="ATM">ATM</option>
                                            <option value="PHARMACY">Pharmacy</option>
                                            <option value="GROCERY_STORE">Grocery Store</option>
                                            <option value="GYM">Gym</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={location.name}
                                            onChange={(e) => {
                                                const updatedLocations = [...formData.nearbyLocations];
                                                updatedLocations[index].name = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    nearbyLocations: updatedLocations
                                                }));
                                                setFormDataChanged(true);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km) *</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={location.distance}
                                            onChange={(e) => {
                                                const updatedLocations = [...formData.nearbyLocations];
                                                updatedLocations[index].distance = parseFloat(e.target.value) || 0;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    nearbyLocations: updatedLocations
                                                }));
                                                setFormDataChanged(true);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                                        <input
                                            type="number"
                                            value={location.duration || ''}
                                            onChange={(e) => {
                                                const updatedLocations = [...formData.nearbyLocations];
                                                updatedLocations[index].duration = parseInt(e.target.value) || 0;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    nearbyLocations: updatedLocations
                                                }));
                                                setFormDataChanged(true);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.nearbyLocations.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No nearby locations added yet</p>
                                <p className="text-sm">Add schools, hospitals, malls nearby</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        {onReset && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            ) : (
                                isEditing ? 'Update Project' : 'Create Project'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;