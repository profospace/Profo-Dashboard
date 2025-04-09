// import React, { useState, useEffect, useCallback } from 'react';
// import { RefreshCw, Edit, Trash, Save, Plus, X, Image, Check, Upload } from 'lucide-react';
// import { base_url } from "../../utils/base_url"
// import ColorPicker from '../components/ColorPicker';


// const ListOptions = () => {
//     // State for list selection
//     const [availableLists, setAvailableLists] = useState([]);
//     const [selectedList, setSelectedList] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [backgroundColor, setBackgroundColor] = useState('#ffffff');

//     // State for current list details
//     const [listDetails, setListDetails] = useState({
//         listName: '',
//         title: '',
//         headerImage: '',
//         options: [],
//         categoryType: 'carousal',
//         sectionType: 'banner',
//         city: '',
//     });

//     // State for editing options
//     const [currentOptionId, setCurrentOptionId] = useState(null);
//     const [optionForm, setOptionForm] = useState({
//         imagelink: '',
//         textview: '',
//         link: ''
//     });

//     // State for image selector
//     const [showImageSelector, setShowImageSelector] = useState(false);
//     const [currentImageField, setCurrentImageField] = useState(null);
//     const [images, setImages] = useState([]);
//     const [loadingImages, setLoadingImages] = useState(false);

//     // State for upload functionality
//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);

//     // State for cities
//     const [cities, setCities] = useState([]);

//     // Notifications
//     const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//     // Load available lists and cities on component mount
//     useEffect(() => {
//         loadAvailableLists();
//         fetchCities();
//     }, []);

//     const loadAvailableLists = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/list-options`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             const lists = await response.json();
//             setAvailableLists(lists);
//         } catch (error) {
//             console.error('Error loading available lists:', error);
//             showNotification('Failed to load lists', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/get-all-cities`);
//             if (!response.ok) throw new Error('Failed to fetch cities');
//             const data = await response.json();
//             if (data && data.cities) {
//                 setCities(data.cities);
//             }
//         } catch (error) {
//             console.error('Error fetching cities:', error);
//             showNotification('Failed to load cities', 'error');
//         }
//     };

//     const fetchImages = async () => {
//         setLoadingImages(true);
//         try {
//             const response = await fetch(`${base_url}/api/list-images`);
//             if (!response.ok) throw new Error('Failed to fetch images');
//             const data = await response.json();
//             setImages(data);
//         } catch (error) {
//             console.error('Error fetching images:', error);
//             showNotification('Failed to fetch images', 'error');
//         } finally {
//             setLoadingImages(false);
//         }
//     };

//     const loadListOptions = async () => {
//         if (!selectedList) {
//             showNotification('Please select a list first', 'info');
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/list-options/${selectedList}`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             const data = await response.json();
//             if (!data) {
//                 throw new Error('Invalid data format received');
//             }

//             setListDetails({
//                 listName: selectedList,
//                 title: data.title || '',
//                 headerImage: data.headerImage || '',
//                 options: data.options || [],
//                 categoryType: data.categoryType || 'carousal',
//                 sectionType: data.sectionType || 'banner',
//                 city: data.city || '',

//             });

//             if (data.backgroundColor) {
//                 setBackgroundColor(data.backgroundColor);
//             }

//             // Reset option form
//             setOptionForm({
//                 imagelink: '',
//                 textview: '',
//                 link: ''
//             });
//             setCurrentOptionId(null);

//         } catch (error) {
//             console.error('Error loading options:', error);
//             showNotification('Failed to load options', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectList = (e) => {
//         setSelectedList(e.target.value);
//     };

//     const editOption = (option) => {
//         setOptionForm({
//             imagelink: option.imagelink,
//             textview: option.textview,
//             link: option.link
//         });
//         setCurrentOptionId(option._id);
//     };

//     const handleOptionFormChange = (e) => {
//         const { name, value } = e.target;
//         setOptionForm(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const resetOptionForm = () => {
//         setOptionForm({
//             imagelink: '',
//             textview: '',
//             link: ''
//         });
//         setCurrentOptionId(null);
//     };

//     const saveOption = async (e) => {
//         e.preventDefault();

//         if (!selectedList) {
//             showNotification('Please select a list first', 'error');
//             return;
//         }

//         if (!optionForm.imagelink || !optionForm.textview || !optionForm.link) {
//             showNotification('Please fill in all option fields', 'error');
//             return;
//         }

//         try {
//             let url, method;

//             if (currentOptionId) {
//                 // Update existing option
//                 url = `${base_url}/api/list-options/${selectedList}/update-option/${currentOptionId}`;
//                 method = 'PUT';
//             } else {
//                 // Add new option
//                 url = `${base_url}/api/list-options/${selectedList}/add-option`;
//                 method = 'POST';
//             }

//             const response = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(optionForm)
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             showNotification(
//                 currentOptionId ? 'Option updated successfully' : 'Option added successfully',
//                 'success'
//             );

//             // Reload list options
//             loadListOptions();
//             resetOptionForm();

//         } catch (error) {
//             console.error('Error saving option:', error);
//             showNotification('Failed to save option', 'error');
//         }
//     };

//     const deleteOption = async (optionId) => {
//         if (!confirm('Are you sure you want to delete this option?')) return;

//         try {
//             const response = await fetch(`${base_url}/api/list-options/${selectedList}/remove-option/${optionId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('Option deleted successfully', 'success');
//             loadListOptions();
//         } catch (error) {
//             console.error('Error deleting option:', error);
//             showNotification('Failed to delete option', 'error');
//         }
//     };

//     const deleteList = async () => {
//         if (!selectedList) {
//             showNotification('No list selected', 'error');
//             return;
//         }

//         if (!confirm(`Are you sure you want to delete the entire list "${selectedList}"?`)) return;

//         try {
//             const response = await fetch(`${base_url}/api/list-options/${selectedList}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('List deleted successfully', 'success');
//             setSelectedList('');
//             setListDetails({
//                 listName: '',
//                 title: '',
//                 headerImage: '',
//                 options: [],
//                 categoryType: 'carousal',
//                 sectionType: 'banner',
//                 city: ''
//             });

//             // Refresh available lists
//             loadAvailableLists();

//         } catch (error) {
//             console.error('Error deleting list:', error);
//             showNotification('Failed to delete list', 'error');
//         }
//     };

//     const updateListType = async () => {
//         if (!selectedList) {
//             showNotification('Please select a list first', 'error');
//             return;
//         }

//         try {
//             const response = await fetch(`${base_url}/api/list-options/${selectedList}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     categoryType: listDetails.categoryType,
//                     sectionType: listDetails.sectionType,
//                     city: listDetails.city
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('List type updated successfully', 'success');
//             loadListOptions();
//         } catch (error) {
//             console.error('Error updating list type:', error);
//             showNotification('Error updating list type', 'error');
//         }
//     };

//     const updateListDetails = async () => {
//         if (!selectedList) {
//             showNotification('Please select a list first', 'error');
//             return;
//         }

//         try {
//             const response = await fetch(`${base_url}/api/list-options/${selectedList}/update-details`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     title: listDetails.title,
//                     headerImage: listDetails.headerImage,
//                     backgroundColor
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('List details updated successfully', 'success');
//         } catch (error) {
//             console.error('Error updating list details:', error);
//             showNotification('Failed to update list details', 'error');
//         }
//     };

//     const openImageSelector = (fieldName) => {
//         setCurrentImageField(fieldName);
//         fetchImages();
//         setShowImageSelector(true);
//     };

//     const selectImage = (url) => {
//         if (currentImageField === 'headerImage') {
//             setListDetails(prev => ({ ...prev, headerImage: url }));
//         } else if (currentImageField === 'optionImage') {
//             setOptionForm(prev => ({ ...prev, imagelink: url }));
//         }
//         setShowImageSelector(false);
//     };

//     // New function to handle file uploads
//     const handleFileUpload = async (e, fieldType) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Create a FormData object to send the file
//         const formData = new FormData();
//         formData.append('uploadedFileName', file);

//         setIsUploading(true);
//         setUploadProgress(0);

//         try {
//             // Simulate progress (since fetch doesn't have progress event)
//             const progressInterval = setInterval(() => {
//                 setUploadProgress(prev => {
//                     const newProgress = prev + Math.random() * 20;
//                     return newProgress > 90 ? 90 : newProgress;
//                 });
//             }, 300);

//             const response = await fetch(`${base_url}/upload/imageUpload`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             clearInterval(progressInterval);

//             if (!response.ok) {
//                 throw new Error('Upload failed');
//             }

//             const data = await response.json();
//             setUploadProgress(100);

//             // Update the appropriate state with the uploaded file URL
//             if (data.response_code === 200) {
//                 const uploadedUrl = data.response_data.Location;

//                 if (fieldType === 'headerImage') {
//                     setListDetails(prev => ({ ...prev, headerImage: uploadedUrl }));
//                 } else if (fieldType === 'optionImage') {
//                     setOptionForm(prev => ({ ...prev, imagelink: uploadedUrl }));
//                 }

//                 showNotification('File uploaded successfully', 'success');
//             } else {
//                 throw new Error('Upload response not successful');
//             }
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             showNotification('Failed to upload file', 'error');
//         } finally {
//             setIsUploading(false);
//             // Reset the file input
//             e.target.value = "";
//         }
//     };

//     const showNotification = (message, type = 'info') => {
//         setNotification({ show: true, message, type });
//         setTimeout(() => {
//             setNotification({ show: false, message: '', type: '' });
//         }, 3000);
//     };

//     // Handler for changing list details
//     const handleListDetailsChange = (e) => {
//         const { name, value } = e.target;
//         setListDetails(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     return (
//         <div className="">
//             <h1 className="text-2xl font-bold mb-6 text-gray-800">List Options Management</h1>

//             {/* Upload Progress Indicator */}
//             {isUploading && (
//                 <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
//                     <div
//                         className="h-full bg-blue-500 transition-all duration-200"
//                         style={{ width: `${uploadProgress}%` }}
//                     ></div>
//                 </div>
//             )}

//             {/* List Selection Section */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                 <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Lists</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//                     <div className="md:col-span-2">
//                         <label htmlFor="listSelector" className="block text-sm font-medium text-gray-700 mb-1">
//                             Select a list
//                         </label>
//                         <select
//                             id="listSelector"
//                             value={selectedList}
//                             onChange={handleSelectList}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">Select a list</option>
//                             {availableLists.map((list, index) => (
//                                 <option key={index} value={list.listName}>
//                                     {list.listName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <button
//                             onClick={loadListOptions}
//                             disabled={!selectedList || loading}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-md w-full justify-center
//                 ${!selectedList || loading
//                                     ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                                     : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
//                         >
//                             {loading ? (
//                                 <RefreshCw className="w-5 h-5 animate-spin" />
//                             ) : (
//                                 <RefreshCw className="w-5 h-5" />
//                             )}
//                             {loading ? 'Loading...' : 'Load Options'}
//                         </button>
//                     </div>
//                 </div>

//                 {selectedList && (
//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Category Type
//                             </label>
//                             <select
//                                 id="categoryType"
//                                 name="categoryType"
//                                 value={listDetails.categoryType}
//                                 onChange={handleListDetailsChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="carousal">Carousel</option>
//                                 <option value="carousalWithIndicator">Carousel With Indicator</option>
//                                 <option value="centerCarousal">Center Carousel</option>
//                                 <option value="centerCarousalWithIndicator">Center Carousel With Indicator</option>
//                                 <option value="horizontal_list">Horizontal List</option>
//                                 <option value="single_item">Single Item</option>
//                                 <option value="grid_view">Grid View</option>
//                                 <option value="vertical_list">Vertical List</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label htmlFor="sectionType" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Section Type
//                             </label>
//                             <select
//                                 id="sectionType"
//                                 name="sectionType"
//                                 value={listDetails.sectionType}
//                                 onChange={handleListDetailsChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="banner">Banner</option>
//                                 <option value="launch">Launch</option>
//                                 <option value="search">Search</option>
//                                 <option value="userprofile">User Profile</option>
//                                 <option value="list">List</option>
//                                 <option value="call">Call</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label htmlFor="citySelect" className="block text-sm font-medium text-gray-700 mb-1">
//                                 City
//                             </label>
//                             <select
//                                 id="citySelect"
//                                 name="city"
//                                 value={listDetails.city}
//                                 onChange={handleListDetailsChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">Select City</option>
//                                 {cities.map((city, index) => (
//                                     <option key={index} value={city}>
//                                         {city}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="md:col-span-3">
//                             <button
//                                 onClick={updateListType}
//                                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
//                             >
//                                 <Check className="w-5 h-5" />
//                                 Update Image Type
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* backgroundColor */}
//             <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />


//             {selectedList && listDetails.options && (
//                 <>
//                     {/* List Details */}
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h2 className="text-lg font-semibold text-gray-700 mb-4">List Details</h2>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="listTitle" className="block text-sm font-medium text-gray-700 mb-1">
//                                     List Title
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="listTitle"
//                                     name="title"
//                                     value={listDetails.title}
//                                     onChange={handleListDetailsChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Header Image
//                                 </label>
//                                 <div className="flex mb-2">
//                                     <input
//                                         type="text"
//                                         id="headerImage"
//                                         name="headerImage"
//                                         value={listDetails.headerImage}
//                                         onChange={handleListDetailsChange}
//                                         className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Image URL"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => openImageSelector('headerImage')}
//                                         className="flex items-center bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
//                                         title="Browse gallery"
//                                     >
//                                         <Image className="w-5 h-5" />
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <label className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
//                                         <Upload className="w-4 h-4" />
//                                         <span>Upload Image</span>
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             className="hidden"
//                                             onChange={(e) => handleFileUpload(e, 'headerImage')}
//                                         />
//                                     </label>
//                                 </div>
//                                 {listDetails.headerImage && (
//                                     <div className="mt-2">
//                                         <img
//                                             src={listDetails.headerImage}
//                                             alt="Header preview"
//                                             className="h-20 object-cover rounded-md"
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="mt-4">
//                             <button
//                                 onClick={updateListDetails}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
//                             >
//                                 <Save className="w-5 h-5" />
//                                 Update List Details
//                             </button>
//                         </div>
//                     </div>

//                     {/* Options List */}
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h2 className="text-lg font-semibold text-gray-700 mb-4">List Options</h2>

//                         <div className="space-y-4">
//                             {listDetails.options.length > 0 ? (
//                                 listDetails.options.map((option, index) => (
//                                     <div
//                                         key={option._id || index}
//                                         className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4"
//                                     >
//                                         <div className="md:w-1/5">
//                                             <img
//                                                 src={option.imagelink}
//                                                 alt={option.textview}
//                                                 className="w-full h-32 object-cover rounded-md"
//                                             />
//                                         </div>

//                                         <div className="md:w-3/5">
//                                             <h3 className="font-medium text-gray-800">{option.textview}</h3>
//                                             <p className="text-sm text-gray-600 mt-1 break-all">{option.link}</p>
//                                             <p className="text-xs text-gray-500 mt-3">
//                                                 <span className="font-medium">Image URL:</span> {option.imagelink}
//                                             </p>
//                                         </div>

//                                         <div className="md:w-1/5 flex md:flex-col justify-end gap-2">
//                                             <button
//                                                 onClick={() => editOption(option)}
//                                                 className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                                             >
//                                                 <Edit className="w-4 h-4" />
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 onClick={() => deleteOption(option._id)}
//                                                 className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                                             >
//                                                 <Trash className="w-4 h-4" />
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="bg-white p-8 rounded-md border border-gray-200 text-center text-gray-500">
//                                     No options found for this list. Add a new option below.
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Add/Edit Option Form */}
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                             {currentOptionId ? 'Edit Option' : 'Add New Option'}
//                         </h2>

//                         <form onSubmit={saveOption} className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="imagelink" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Image Link*
//                                     </label>
//                                     <div className="flex mb-2">
//                                         <input
//                                             type="text"
//                                             id="imagelink"
//                                             name="imagelink"
//                                             value={optionForm.imagelink}
//                                             onChange={handleOptionFormChange}
//                                             required
//                                             className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Image URL"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => openImageSelector('optionImage')}
//                                             className="flex items-center bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
//                                             title="Browse gallery"
//                                         >
//                                             <Image className="w-5 h-5" />
//                                         </button>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <label className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
//                                             <Upload className="w-4 h-4" />
//                                             <span>Upload Image</span>
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={(e) => handleFileUpload(e, 'optionImage')}
//                                             />
//                                         </label>
//                                     </div>
//                                     {optionForm.imagelink && (
//                                         <div className="mt-2">
//                                             <img
//                                                 src={optionForm.imagelink}
//                                                 alt="Option preview"
//                                                 className="h-20 object-cover rounded-md"
//                                             />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label htmlFor="textview" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Text View*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="textview"
//                                         name="textview"
//                                         value={optionForm.textview}
//                                         onChange={handleOptionFormChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Link*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="link"
//                                         name="link"
//                                         value={optionForm.link}
//                                         onChange={handleOptionFormChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex gap-3">
//                                 <button
//                                     type="submit"
//                                     disabled={isUploading}
//                                     className={`flex items-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md`}
//                                 >
//                                     <Save className="w-5 h-5" />
//                                     {currentOptionId ? 'Update Option' : 'Add Option'}
//                                 </button>

//                                 {currentOptionId && (
//                                     <button
//                                         type="button"
//                                         onClick={resetOptionForm}
//                                         className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                                     >
//                                         <X className="w-5 h-5" />
//                                         Cancel Edit
//                                     </button>
//                                 )}
//                             </div>
//                         </form>
//                     </div>

//                     {/* List Actions */}
//                     <div className="flex justify-between items-center">
//                         <button
//                             onClick={deleteList}
//                             className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
//                             disabled={isUploading}
//                         >
//                             <Trash className="w-5 h-5" />
//                             Delete Entire List
//                         </button>

//                         <button
//                             onClick={loadAvailableLists}
//                             className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                         >
//                             <RefreshCw className="w-5 h-5" />
//                             Refresh Lists
//                         </button>
//                     </div>
//                 </>
//             )}

//             {/* Image Selector Modal */}
//             {showImageSelector && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg w-11/12 max-w-3xl max-h-[80vh] overflow-hidden">
//                         <div className="p-4 border-b flex justify-between items-center">
//                             <h3 className="font-medium">Select an Image</h3>
//                             <button
//                                 onClick={() => setShowImageSelector(false)}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>

//                         <div className="p-4 max-h-[calc(80vh-120px)] overflow-y-auto">
//                             {loadingImages ? (
//                                 <div className="flex justify-center py-12">
//                                     <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                 </div>
//                             ) : (
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                                     {images.length > 0 ? (
//                                         images.map((url, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="border rounded-md overflow-hidden cursor-pointer hover:border-blue-500"
//                                                 onClick={() => selectImage(url)}
//                                             >
//                                                 <img
//                                                     src={url}
//                                                     alt={`Gallery image ${index}`}
//                                                     className="h-24 w-full object-cover"
//                                                 />
//                                                 <div className="p-2 text-xs text-gray-500 truncate">
//                                                     {url.split('/').pop()}
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="col-span-full text-center py-8 text-gray-500">
//                                             No images found. Please upload some images first.
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="p-4 border-t flex justify-end">
//                             <button
//                                 onClick={() => setShowImageSelector(false)}
//                                 className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Notification Toast */}
//             {notification.show && (
//                 <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' :
//                         notification.type === 'error' ? 'bg-red-500 text-white' :
//                             'bg-blue-500 text-white'
//                     }`}>
//                     <span>{notification.message}</span>
//                     <button onClick={() => setNotification({ ...notification, show: false })} className="text-white">
//                         <X className="w-4 h-4" />
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ListOptions;


// import React, { useState, useEffect, useCallback } from 'react';
// import { RefreshCw, Edit, Trash, Save, Plus, X, Image, Check, Upload } from 'lucide-react';
// import { base_url } from "../../utils/base_url"
// import ColorPicker from '../components/ColorPicker';

// const ListOptions = () => {
//     // State for list selection
//     const [availableLists, setAvailableLists] = useState([]);
//     const [selectedListId, setSelectedListId] = useState(''); // Changed from selectedList to selectedListId
//     const [loading, setLoading] = useState(false);
//     const [backgroundColor, setBackgroundColor] = useState('#ffffff');

//     // State for current list details
//     const [listDetails, setListDetails] = useState({
//         _id: '', // Added _id field
//         listName: '',
//         title: '',
//         headerImage: '',
//         options: [],
//         categoryType: 'carousal',
//         sectionType: 'banner',
//         city: '',
//     });

//     // State for editing options
//     const [currentOptionId, setCurrentOptionId] = useState(null);
//     const [optionForm, setOptionForm] = useState({
//         imagelink: '',
//         textview: '',
//         link: ''
//     });

//     // State for image selector
//     const [showImageSelector, setShowImageSelector] = useState(false);
//     const [currentImageField, setCurrentImageField] = useState(null);
//     const [images, setImages] = useState([]);
//     const [loadingImages, setLoadingImages] = useState(false);

//     // State for upload functionality
//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);

//     // State for cities
//     const [cities, setCities] = useState([]);

//     // Notifications
//     const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//     // Load available lists and cities on component mount
//     useEffect(() => {
//         loadAvailableLists();
//         fetchCities();
//     }, []);

//     const loadAvailableLists = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/list-options`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             const lists = await response.json();
//             setAvailableLists(lists);
//         } catch (error) {
//             console.error('Error loading available lists:', error);
//             showNotification('Failed to load lists', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/get-all-cities`);
//             if (!response.ok) throw new Error('Failed to fetch cities');
//             const data = await response.json();
//             if (data && data.cities) {
//                 setCities(data.cities);
//             }
//         } catch (error) {
//             console.error('Error fetching cities:', error);
//             showNotification('Failed to load cities', 'error');
//         }
//     };

//     const fetchImages = async () => {
//         setLoadingImages(true);
//         try {
//             const response = await fetch(`${base_url}/api/list-images`);
//             if (!response.ok) throw new Error('Failed to fetch images');
//             const data = await response.json();
//             setImages(data);
//         } catch (error) {
//             console.error('Error fetching images:', error);
//             showNotification('Failed to fetch images', 'error');
//         } finally {
//             setLoadingImages(false);
//         }
//     };

//     const loadListOptions = async () => {
//         if (!selectedListId) {
//             showNotification('Please select a list first', 'info');
//             return;
//         }

//         try {
//             setLoading(true);
//             // Updated to use ID instead of listName
//             const response = await fetch(`${base_url}/api/list-options/${selectedListId}`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             const data = await response.json();
//             if (!data) {
//                 throw new Error('Invalid data format received');
//             }

//             setListDetails({
//                 _id: data._id,
//                 listName: data.listName,
//                 title: data.title || '',
//                 headerImage: data.headerImage || '',
//                 options: data.options || [],
//                 categoryType: data.categoryType || 'carousal',
//                 sectionType: data.sectionType || 'banner',
//                 city: data.city || '',
//             });

//             if (data.backgroundColor) {
//                 setBackgroundColor(data.backgroundColor);
//             }

//             // Reset option form
//             resetOptionForm();

//         } catch (error) {
//             console.error('Error loading options:', error);
//             showNotification('Failed to load options', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectList = (e) => {
//         setSelectedListId(e.target.value);
//     };

//     const editOption = (option) => {
//         setOptionForm({
//             imagelink: option.imagelink,
//             textview: option.textview,
//             link: option.link
//         });
//         setCurrentOptionId(option._id);
//     };

//     const handleOptionFormChange = (e) => {
//         const { name, value } = e.target;
//         setOptionForm(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const resetOptionForm = () => {
//         setOptionForm({
//             imagelink: '',
//             textview: '',
//             link: ''
//         });
//         setCurrentOptionId(null);
//     };

//     const saveOption = async (e) => {
//         e.preventDefault();

//         if (!selectedListId) {
//             showNotification('Please select a list first', 'error');
//             return;
//         }

//         if (!optionForm.imagelink || !optionForm.textview || !optionForm.link) {
//             showNotification('Please fill in all option fields', 'error');
//             return;
//         }

//         try {
//             let url, method;

//             if (currentOptionId) {
//                 // Update existing option using list ID and option ID
//                 url = `${base_url}/api/list-options/${selectedListId}/update-option/${currentOptionId}`;
//                 method = 'PUT';
//             } else {
//                 // Add new option using list ID
//                 url = `${base_url}/api/list-options/${selectedListId}/add-option`;
//                 method = 'POST';
//             }

//             const response = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(optionForm)
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             showNotification(
//                 currentOptionId ? 'Option updated successfully' : 'Option added successfully',
//                 'success'
//             );

//             // Reload list options
//             loadListOptions();
//             resetOptionForm();

//         } catch (error) {
//             console.error('Error saving option:', error);
//             showNotification('Failed to save option', 'error');
//         }
//     };

//     const deleteOption = async (optionId) => {
//         if (!confirm('Are you sure you want to delete this option?')) return;

//         try {
//             // Updated to use list ID and option ID
//             const response = await fetch(`${base_url}/api/list-options/${selectedListId}/remove-option/${optionId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('Option deleted successfully', 'success');
//             loadListOptions();
//         } catch (error) {
//             console.error('Error deleting option:', error);
//             showNotification('Failed to delete option', 'error');
//         }
//     };

//     const deleteList = async () => {
//         if (!selectedListId) {
//             showNotification('No list selected', 'error');
//             return;
//         }

//         const selectedListName = availableLists.find(list => list._id === selectedListId)?.listName || 'this list';
//         if (!confirm(`Are you sure you want to delete the entire list "${selectedListName}"?`)) return;

//         try {
//             // Updated to use ID instead of listName
//             const response = await fetch(`${base_url}/api/list-options/${selectedListId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('List deleted successfully', 'success');
//             setSelectedListId('');
//             setListDetails({
//                 _id: '',
//                 listName: '',
//                 title: '',
//                 headerImage: '',
//                 options: [],
//                 categoryType: 'carousal',
//                 sectionType: 'banner',
//                 city: ''
//             });

//             // Refresh available lists
//             loadAvailableLists();

//         } catch (error) {
//             console.error('Error deleting list:', error);
//             showNotification('Failed to delete list', 'error');
//         }
//     };

//     const updateListType = async () => {
//         if (!selectedListId) {
//             showNotification('Please select a list first', 'error');
//             return;
//         }

//         try {
//             // Updated to use ID instead of listName
//             const response = await fetch(`${base_url}/api/list-options/${selectedListId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     categoryType: listDetails.categoryType,
//                     sectionType: listDetails.sectionType,
//                     city: listDetails.city
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('List type updated successfully', 'success');
//             loadListOptions();
//         } catch (error) {
//             console.error('Error updating list type:', error);
//             showNotification('Error updating list type', 'error');
//         }
//     };

//     const updateListDetails = async () => {
//         if (!selectedListId) {
//             showNotification('Please select a list first', 'error');
//             return;
//         }

//         try {
//             // Updated to use ID instead of listName
//             const response = await fetch(`${base_url}/api/list-options/${selectedListId}/update-details`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     title: listDetails.title,
//                     headerImage: listDetails.headerImage,
//                     backgroundColor
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             showNotification('List details updated successfully', 'success');
//         } catch (error) {
//             console.error('Error updating list details:', error);
//             showNotification('Failed to update list details', 'error');
//         }
//     };

//     const openImageSelector = (fieldName) => {
//         setCurrentImageField(fieldName);
//         fetchImages();
//         setShowImageSelector(true);
//     };

//     const selectImage = (url) => {
//         if (currentImageField === 'headerImage') {
//             setListDetails(prev => ({ ...prev, headerImage: url }));
//         } else if (currentImageField === 'optionImage') {
//             setOptionForm(prev => ({ ...prev, imagelink: url }));
//         }
//         setShowImageSelector(false);
//     };

//     // Function to handle file uploads
//     const handleFileUpload = async (e, fieldType) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Create a FormData object to send the file
//         const formData = new FormData();
//         formData.append('uploadedFileName', file);

//         setIsUploading(true);
//         setUploadProgress(0);

//         try {
//             // Simulate progress (since fetch doesn't have progress event)
//             const progressInterval = setInterval(() => {
//                 setUploadProgress(prev => {
//                     const newProgress = prev + Math.random() * 20;
//                     return newProgress > 90 ? 90 : newProgress;
//                 });
//             }, 300);

//             const response = await fetch(`${base_url}/upload/imageUpload`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             clearInterval(progressInterval);

//             if (!response.ok) {
//                 throw new Error('Upload failed');
//             }

//             const data = await response.json();
//             setUploadProgress(100);

//             // Update the appropriate state with the uploaded file URL
//             if (data.response_code === 200) {
//                 const uploadedUrl = data.response_data.Location;

//                 if (fieldType === 'headerImage') {
//                     setListDetails(prev => ({ ...prev, headerImage: uploadedUrl }));
//                 } else if (fieldType === 'optionImage') {
//                     setOptionForm(prev => ({ ...prev, imagelink: uploadedUrl }));
//                 }

//                 showNotification('File uploaded successfully', 'success');
//             } else {
//                 throw new Error('Upload response not successful');
//             }
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             showNotification('Failed to upload file', 'error');
//         } finally {
//             setIsUploading(false);
//             // Reset the file input
//             e.target.value = "";
//         }
//     };

//     const showNotification = (message, type = 'info') => {
//         setNotification({ show: true, message, type });
//         setTimeout(() => {
//             setNotification({ show: false, message: '', type: '' });
//         }, 3000);
//     };

//     // Handler for changing list details
//     const handleListDetailsChange = (e) => {
//         const { name, value } = e.target;
//         setListDetails(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     return (
//         <div className="">
//             <h1 className="text-2xl font-bold mb-6 text-gray-800">List Options Management</h1>

//             {/* Upload Progress Indicator */}
//             {isUploading && (
//                 <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
//                     <div
//                         className="h-full bg-blue-500 transition-all duration-200"
//                         style={{ width: `${uploadProgress}%` }}
//                     ></div>
//                 </div>
//             )}

//             {/* List Selection Section */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                 <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Lists</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//                     <div className="md:col-span-2">
//                         <label htmlFor="listSelector" className="block text-sm font-medium text-gray-700 mb-1">
//                             Select a list
//                         </label>
//                         <select
//                             id="listSelector"
//                             value={selectedListId}
//                             onChange={handleSelectList}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">Select a list</option>
//                             {availableLists.map((list, index) => (
//                                 <option key={index} value={list._id}>
//                                     {list.listName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <button
//                             onClick={loadListOptions}
//                             disabled={!selectedListId || loading}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-md w-full justify-center
//                 ${!selectedListId || loading
//                                     ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                                     : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
//                         >
//                             {loading ? (
//                                 <RefreshCw className="w-5 h-5 animate-spin" />
//                             ) : (
//                                 <RefreshCw className="w-5 h-5" />
//                             )}
//                             {loading ? 'Loading...' : 'Load Options'}
//                         </button>
//                     </div>
//                 </div>

//                 {selectedListId && (
//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Category Type
//                             </label>
//                             <select
//                                 id="categoryType"
//                                 name="categoryType"
//                                 value={listDetails.categoryType}
//                                 onChange={handleListDetailsChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="carousal">Carousel</option>
//                                 <option value="carousalWithIndicator">Carousel With Indicator</option>
//                                 <option value="centerCarousal">Center Carousel</option>
//                                 <option value="centerCarousalWithIndicator">Center Carousel With Indicator</option>
//                                 <option value="horizontal_list">Horizontal List</option>
//                                 <option value="single_item">Single Item</option>
//                                 <option value="grid_view">Grid View</option>
//                                 <option value="vertical_list">Vertical List</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label htmlFor="sectionType" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Section Type
//                             </label>
//                             <select
//                                 id="sectionType"
//                                 name="sectionType"
//                                 value={listDetails.sectionType}
//                                 onChange={handleListDetailsChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="banner">Banner</option>
//                                 <option value="launch">Launch</option>
//                                 <option value="search">Search</option>
//                                 <option value="userprofile">User Profile</option>
//                                 <option value="list">List</option>
//                                 <option value="call">Call</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label htmlFor="citySelect" className="block text-sm font-medium text-gray-700 mb-1">
//                                 City
//                             </label>
//                             <select
//                                 id="citySelect"
//                                 name="city"
//                                 value={listDetails.city}
//                                 onChange={handleListDetailsChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">Select City</option>
//                                 {cities.map((city, index) => (
//                                     <option key={index} value={city}>
//                                         {city}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="md:col-span-3">
//                             <button
//                                 onClick={updateListType}
//                                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
//                             >
//                                 <Check className="w-5 h-5" />
//                                 Update Image Type
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* backgroundColor */}
//             <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />

//             {selectedListId && listDetails.options && (
//                 <>
//                     {/* List Details */}
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h2 className="text-lg font-semibold text-gray-700 mb-4">List Details</h2>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="listTitle" className="block text-sm font-medium text-gray-700 mb-1">
//                                     List Title
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="listTitle"
//                                     name="title"
//                                     value={listDetails.title}
//                                     onChange={handleListDetailsChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Header Image
//                                 </label>
//                                 <div className="flex mb-2">
//                                     <input
//                                         type="text"
//                                         id="headerImage"
//                                         name="headerImage"
//                                         value={listDetails.headerImage}
//                                         onChange={handleListDetailsChange}
//                                         className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Image URL"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => openImageSelector('headerImage')}
//                                         className="flex items-center bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
//                                         title="Browse gallery"
//                                     >
//                                         <Image className="w-5 h-5" />
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <label className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
//                                         <Upload className="w-4 h-4" />
//                                         <span>Upload Image</span>
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             className="hidden"
//                                             onChange={(e) => handleFileUpload(e, 'headerImage')}
//                                         />
//                                     </label>
//                                 </div>
//                                 {listDetails.headerImage && (
//                                     <div className="mt-2">
//                                         <img
//                                             src={listDetails.headerImage}
//                                             alt="Header preview"
//                                             className="h-20 object-cover rounded-md"
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="mt-4">
//                             <button
//                                 onClick={updateListDetails}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
//                             >
//                                 <Save className="w-5 h-5" />
//                                 Update List Details
//                             </button>
//                         </div>
//                     </div>

//                     {/* Options List */}
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h2 className="text-lg font-semibold text-gray-700 mb-4">List Options</h2>

//                         <div className="space-y-4">
//                             {listDetails.options.length > 0 ? (
//                                 listDetails.options.map((option, index) => (
//                                     <div
//                                         key={option._id || index}
//                                         className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4"
//                                     >
//                                         <div className="md:w-1/5">
//                                             <img
//                                                 src={option.imagelink}
//                                                 alt={option.textview}
//                                                 className="w-full h-32 object-cover rounded-md"
//                                             />
//                                         </div>

//                                         <div className="md:w-3/5">
//                                             <h3 className="font-medium text-gray-800">{option.textview}</h3>
//                                             <p className="text-sm text-gray-600 mt-1 break-all">{option.link}</p>
//                                             <p className="text-xs text-gray-500 mt-3">
//                                                 <span className="font-medium">Image URL:</span> {option.imagelink}
//                                             </p>
//                                         </div>

//                                         <div className="md:w-1/5 flex md:flex-col justify-end gap-2">
//                                             <button
//                                                 onClick={() => editOption(option)}
//                                                 className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                                             >
//                                                 <Edit className="w-4 h-4" />
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 onClick={() => deleteOption(option._id)}
//                                                 className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                                             >
//                                                 <Trash className="w-4 h-4" />
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="bg-white p-8 rounded-md border border-gray-200 text-center text-gray-500">
//                                     No options found for this list. Add a new option below.
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Add/Edit Option Form */}
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                             {currentOptionId ? 'Edit Option' : 'Add New Option'}
//                         </h2>

//                         <form onSubmit={saveOption} className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="imagelink" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Image Link*
//                                     </label>
//                                     <div className="flex mb-2">
//                                         <input
//                                             type="text"
//                                             id="imagelink"
//                                             name="imagelink"
//                                             value={optionForm.imagelink}
//                                             onChange={handleOptionFormChange}
//                                             required
//                                             className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Image URL"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => openImageSelector('optionImage')}
//                                             className="flex items-center bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
//                                             title="Browse gallery"
//                                         >
//                                             <Image className="w-5 h-5" />
//                                         </button>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <label className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
//                                             <Upload className="w-4 h-4" />
//                                             <span>Upload Image</span>
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={(e) => handleFileUpload(e, 'optionImage')}
//                                             />
//                                         </label>
//                                     </div>
//                                     {optionForm.imagelink && (
//                                         <div className="mt-2">
//                                             <img
//                                                 src={optionForm.imagelink}
//                                                 alt="Option preview"
//                                                 className="h-20 object-cover rounded-md"
//                                             />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label htmlFor="textview" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Text View*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="textview"
//                                         name="textview"
//                                         value={optionForm.textview}
//                                         onChange={handleOptionFormChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Link*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="link"
//                                         name="link"
//                                         value={optionForm.link}
//                                         onChange={handleOptionFormChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex gap-3">
//                                 <button
//                                     type="submit"
//                                     disabled={isUploading}
//                                     className={`flex items-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md`}
//                                 >
//                                     <Save className="w-5 h-5" />
//                                     {currentOptionId ? 'Update Option' : 'Add Option'}
//                                 </button>

//                                 {currentOptionId && (
//                                     <button
//                                         type="button"
//                                         onClick={resetOptionForm}
//                                         className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                                     >
//                                         <X className="w-5 h-5" />
//                                         Cancel Edit
//                                     </button>
//                                 )}
//                             </div>
//                         </form>
//                     </div>

//                     {/* List Actions */}
//                     <div className="flex justify-between items-center">
//                         <button
//                             onClick={deleteList}
//                             className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
//                             disabled={isUploading}
//                         >
//                             <Trash className="w-5 h-5" />
//                             Delete Entire List
//                         </button>

//                         <button
//                             onClick={loadAvailableLists}
//                             className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                         >
//                             <RefreshCw className="w-5 h-5" />
//                             Refresh Lists
//                         </button>
//                     </div>
//                 </>
//             )}

//             {/* Image Selector Modal */}
//             {showImageSelector && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg w-11/12 max-w-3xl max-h-[80vh] overflow-hidden">
//                         <div className="p-4 border-b flex justify-between items-center">
//                             <h3 className="font-medium">Select an Image</h3>
//                             <button
//                                 onClick={() => setShowImageSelector(false)}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>

//                         <div className="p-4 max-h-[calc(80vh-120px)] overflow-y-auto">
//                             {loadingImages ? (
//                                 <div className="flex justify-center py-12">
//                                     <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                 </div>
//                             ) : (
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                                     {images.length > 0 ? (
//                                         images.map((url, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="border rounded-md overflow-hidden cursor-pointer hover:border-blue-500"
//                                                 onClick={() => selectImage(url)}
//                                             >
//                                                 <img
//                                                     src={url}
//                                                     alt={`Gallery image ${index}`}
//                                                     className="h-24 w-full object-cover"
//                                                 />
//                                                 <div className="p-2 text-xs text-gray-500 truncate">
//                                                     {url.split('/').pop()}
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="col-span-full text-center py-8 text-gray-500">
//                                             No images found. Please upload some images first.
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="p-4 border-t flex justify-end">
//                             <button
//                                 onClick={() => setShowImageSelector(false)}
//                                 className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Notification Toast */}
//             {notification.show && (
//                 <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' :
//                     notification.type === 'error' ? 'bg-red-500 text-white' :
//                         'bg-blue-500 text-white'
//                     }`}>
//                     <span>{notification.message}</span>
//                     <button onClick={() => setNotification({ ...notification, show: false })} className="text-white">
//                         <X className="w-4 h-4" />
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ListOptions;


import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Edit, Trash, Save, Plus, X, Image, Check, Upload, Filter, List } from 'lucide-react';
import { base_url } from "../../utils/base_url";
import ColorPicker from '../components/ColorPicker';
import EntityFilterPanel from '../components/ListOptions/EntityFilterPanel';

const ListOptions = () => {
    // State for list selection
    const [availableLists, setAvailableLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    const [loading, setLoading] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    // State for current list details
    const [listDetails, setListDetails] = useState({
        _id: '',
        listName: '',
        title: '',
        headerImage: '',
        options: [],
        categoryType: 'carousal',
        sectionType: 'banner',
        city: '',
        listType: 'options',
        listOfProperties: [],
        listOfProjects: [],
        listOfBuildings: [],
    });

    // State for editing options
    const [currentOptionId, setCurrentOptionId] = useState(null);
    const [optionForm, setOptionForm] = useState({
        imagelink: '',
        textview: '',
        link: ''
    });

    // State for image selector
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [currentImageField, setCurrentImageField] = useState(null);
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);

    // State for upload functionality
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // State for cities
    const [cities, setCities] = useState([]);

    // State for entity selection
    const [selectedEntities, setSelectedEntities] = useState([]);
    const [loadingEntities, setLoadingEntities] = useState(false);

    // Notifications
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Load available lists and cities on component mount
    useEffect(() => {
        loadAvailableLists();
        fetchCities();
    }, []);

    const loadAvailableLists = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/list-options`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const lists = await response.json();
            setAvailableLists(lists);
        } catch (error) {
            console.error('Error loading available lists:', error);
            showNotification('Failed to load lists', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await fetch(`${base_url}/api/list-options/available-cities`);
            if (!response.ok) throw new Error('Failed to fetch cities');
            const data = await response.json();
            if (data && data.cities) {
                setCities(data.cities);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            showNotification('Failed to load cities', 'error');
        }
    };

    const fetchImages = async () => {
        setLoadingImages(true);
        try {
            const response = await fetch(`${base_url}/api/list-images`);
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            showNotification('Failed to fetch images', 'error');
        } finally {
            setLoadingImages(false);
        }
    };

    const loadListOptions = async () => {
        if (!selectedListId) {
            showNotification('Please select a list first', 'info');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/list-options/${selectedListId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (!data) {
                throw new Error('Invalid data format received');
            }

            setListDetails({
                _id: data._id,
                listName: data.listName,
                title: data.title || '',
                headerImage: data.headerImage || '',
                options: data.options || [],
                categoryType: data.categoryType || 'carousal',
                sectionType: data.sectionType || 'banner',
                city: data.city || '',
                listType: data.listType || 'options',
                listOfProperties: data.listOfProperties || [],
                listOfProjects: data.listOfProjects || [],
                listOfBuildings: data.listOfBuildings || [],
            });

            // Set selected entities based on list type
            switch (data.listType) {
                case 'properties':
                    setSelectedEntities(data.listOfProperties || []);
                    break;
                case 'projects':
                    setSelectedEntities(data.listOfProjects || []);
                    break;
                case 'buildings':
                    setSelectedEntities(data.listOfBuildings || []);
                    break;
                default:
                    setSelectedEntities([]);
            }

            if (data.backgroundColor) {
                setBackgroundColor(data.backgroundColor);
            }

            // Reset option form
            resetOptionForm();

        } catch (error) {
            console.error('Error loading options:', error);
            showNotification('Failed to load options', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectList = (e) => {
        setSelectedListId(e.target.value);
    };

    const editOption = (option) => {
        setOptionForm({
            imagelink: option.imagelink,
            textview: option.textview,
            link: option.link
        });
        setCurrentOptionId(option._id);
    };

    const handleOptionFormChange = (e) => {
        const { name, value } = e.target;
        setOptionForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetOptionForm = () => {
        setOptionForm({
            imagelink: '',
            textview: '',
            link: ''
        });
        setCurrentOptionId(null);
    };

    const saveOption = async (e) => {
        e.preventDefault();

        if (!selectedListId) {
            showNotification('Please select a list first', 'error');
            return;
        }

        if (listDetails.listType !== 'options') {
            showNotification('Cannot add options to an entity-based list', 'error');
            return;
        }

        if (!optionForm.imagelink || !optionForm.textview || !optionForm.link) {
            showNotification('Please fill in all option fields', 'error');
            return;
        }

        try {
            let url, method;

            if (currentOptionId) {
                // Update existing option using list ID and option ID
                url = `${base_url}/api/list-options/${selectedListId}/update-option/${currentOptionId}`;
                method = 'PUT';
            } else {
                // Add new option using list ID
                url = `${base_url}/api/list-options/${selectedListId}/add-option`;
                method = 'POST';
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(optionForm)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showNotification(
                currentOptionId ? 'Option updated successfully' : 'Option added successfully',
                'success'
            );

            // Reload list options
            loadListOptions();
            resetOptionForm();

        } catch (error) {
            console.error('Error saving option:', error);
            showNotification('Failed to save option', 'error');
        }
    };

    const deleteOption = async (optionId) => {
        if (!confirm('Are you sure you want to delete this option?')) return;

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedListId}/remove-option/${optionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showNotification('Option deleted successfully', 'success');
            loadListOptions();
        } catch (error) {
            console.error('Error deleting option:', error);
            showNotification('Failed to delete option', 'error');
        }
    };

    const deleteList = async () => {
        if (!selectedListId) {
            showNotification('No list selected', 'error');
            return;
        }

        const selectedListName = availableLists.find(list => list._id === selectedListId)?.listName || 'this list';
        if (!confirm(`Are you sure you want to delete the entire list "${selectedListName}"?`)) return;

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedListId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showNotification('List deleted successfully', 'success');
            setSelectedListId('');
            setListDetails({
                _id: '',
                listName: '',
                title: '',
                headerImage: '',
                options: [],
                categoryType: 'carousal',
                sectionType: 'banner',
                city: '',
                listType: 'options',
                listOfProperties: [],
                listOfProjects: [],
                listOfBuildings: [],
            });

            // Refresh available lists
            loadAvailableLists();

        } catch (error) {
            console.error('Error deleting list:', error);
            showNotification('Failed to delete list', 'error');
        }
    };

    const updateListType = async () => {
        if (!selectedListId) {
            showNotification('Please select a list first', 'error');
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedListId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categoryType: listDetails.categoryType,
                    sectionType: listDetails.sectionType,
                    city: listDetails.city
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showNotification('List type updated successfully', 'success');
            loadListOptions();
        } catch (error) {
            console.error('Error updating list type:', error);
            showNotification('Error updating list type', 'error');
        }
    };

    const updateListDetails = async () => {
        if (!selectedListId) {
            showNotification('Please select a list first', 'error');
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedListId}/update-details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: listDetails.title,
                    headerImage: listDetails.headerImage,
                    backgroundColor
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showNotification('List details updated successfully', 'success');
        } catch (error) {
            console.error('Error updating list details:', error);
            showNotification('Failed to update list details', 'error');
        }
    };

    // Handler for entity selection
    const handleEntitySelection = (entities) => {
        setSelectedEntities(entities);
        saveEntitySelections(entities);
    };

    // Function to save selected entities
    const saveEntitySelections = async (entities) => {
        if (!selectedListId || listDetails.listType === 'options') {
            return;
        }

        try {
            const entityIds = entities.map(entity => entity._id || entity.id || entity.post_id);

            const response = await fetch(`${base_url}/api/list-options/${selectedListId}/add-entities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    listType: listDetails.listType,
                    entityIds: entityIds
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showNotification('Entities updated successfully', 'success');
            loadListOptions();
        } catch (error) {
            console.error('Error saving entity selections:', error);
            showNotification('Failed to save entity selections', 'error');
        }
    };

    // Function to change list type
    const changeListType = async (newListType) => {
        if (!selectedListId) {
            showNotification('Please select a list first', 'error');
            return;
        }

        try {
            // First update the list type in the database
            const response = await fetch(`${base_url}/api/list-options/add-complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    listName: listDetails.listName,
                    title: listDetails.title,
                    headerImage: listDetails.headerImage,
                    categoryType: listDetails.categoryType,
                    sectionType: listDetails.sectionType,
                    backgroundColor,
                    city: listDetails.city,
                    listType: newListType,
                    // Clear all entities when changing list type
                    options: newListType === 'options' ? listDetails.options : [],
                    listOfProperties: newListType === 'properties' ? selectedEntities.map(e => e._id) : [],
                    listOfProjects: newListType === 'projects' ? selectedEntities.map(e => e._id) : [],
                    listOfBuildings: newListType === 'buildings' ? selectedEntities.map(e => e._id) : []
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the local state
            setListDetails(prev => ({
                ...prev,
                listType: newListType
            }));

            showNotification(`List type changed to ${newListType}`, 'success');
            loadListOptions();
        } catch (error) {
            console.error('Error changing list type:', error);
            showNotification('Failed to change list type', 'error');
        }
    };

    const openImageSelector = (fieldName) => {
        setCurrentImageField(fieldName);
        fetchImages();
        setShowImageSelector(true);
    };

    const selectImage = (url) => {
        if (currentImageField === 'headerImage') {
            setListDetails(prev => ({ ...prev, headerImage: url }));
        } else if (currentImageField === 'optionImage') {
            setOptionForm(prev => ({ ...prev, imagelink: url }));
        }
        setShowImageSelector(false);
    };

    // Function to handle file uploads
    const handleFileUpload = async (e, fieldType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('uploadedFileName', file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress (since fetch doesn't have progress event)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    const newProgress = prev + Math.random() * 20;
                    return newProgress > 90 ? 90 : newProgress;
                });
            }, 300);

            const response = await fetch(`${base_url}/upload/imageUpload`, {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setUploadProgress(100);

            // Update the appropriate state with the uploaded file URL
            if (data.response_code === 200) {
                const uploadedUrl = data.response_data.Location;

                if (fieldType === 'headerImage') {
                    setListDetails(prev => ({ ...prev, headerImage: uploadedUrl }));
                } else if (fieldType === 'optionImage') {
                    setOptionForm(prev => ({ ...prev, imagelink: uploadedUrl }));
                }

                showNotification('File uploaded successfully', 'success');
            } else {
                throw new Error('Upload response not successful');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            showNotification('Failed to upload file', 'error');
        } finally {
            setIsUploading(false);
            // Reset the file input
            e.target.value = "";
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Handler for changing list details
    const handleListDetailsChange = (e) => {
        const { name, value } = e.target;
        setListDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">List Options Management</h1>

            {/* Upload Progress Indicator */}
            {isUploading && (
                <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}

            {/* List Selection Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Lists</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="listSelector" className="block text-sm font-medium text-gray-700 mb-1">
                            Select a list
                        </label>
                        <select
                            id="listSelector"
                            value={selectedListId}
                            onChange={handleSelectList}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a list</option>
                            {availableLists.map((list, index) => (
                                <option key={index} value={list._id}>
                                    {list.listName} ({list.listType})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={loadListOptions}
                            disabled={!selectedListId || loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md w-full justify-center
                ${!selectedListId || loading
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <RefreshCw className="w-5 h-5" />
                            )}
                            {loading ? 'Loading...' : 'Load Options'}
                        </button>
                    </div>
                </div>

                {selectedListId && (
                    <div className="mt-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">List Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div
                                className={`p-4 rounded-md cursor-pointer border-2 text-center ${listDetails.listType === 'options' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                                onClick={() => changeListType('options')}
                            >
                                <List className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-medium">Regular Options</div>
                                <div className="text-xs text-gray-500 mt-1">Custom images and links</div>
                            </div>

                            <div
                                className={`p-4 rounded-md cursor-pointer border-2 text-center ${listDetails.listType === 'properties' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                                onClick={() => changeListType('properties')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <div className="font-medium">Properties</div>
                                <div className="text-xs text-gray-500 mt-1">Shops, Apartments, etc.</div>
                            </div>

                            <div
                                className={`p-4 rounded-md cursor-pointer border-2 text-center ${listDetails.listType === 'projects' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                                onClick={() => changeListType('projects')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <div className="font-medium">Projects</div>
                                <div className="text-xs text-gray-500 mt-1">Ongoing developments</div>
                            </div>

                            <div
                                className={`p-4 rounded-md cursor-pointer border-2 text-center ${listDetails.listType === 'buildings' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                                onClick={() => changeListType('buildings')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M2 14h20M10 22v-8h4v8"></path>
                                </svg>
                                <div className="font-medium">Buildings</div>
                                <div className="text-xs text-gray-500 mt-1">Individual buildings</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Type
                                </label>
                                <select
                                    id="categoryType"
                                    name="categoryType"
                                    value={listDetails.categoryType}
                                    onChange={handleListDetailsChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="carousal">Carousel</option>
                                    <option value="carousalWithIndicator">Carousel With Indicator</option>
                                    <option value="centerCarousal">Center Carousel</option>
                                    <option value="centerCarousalWithIndicator">Center Carousel With Indicator</option>
                                    <option value="horizontal_list">Horizontal List</option>
                                    <option value="single_item">Single Item</option>
                                    <option value="grid_view">Grid View</option>
                                    <option value="vertical_list">Vertical List</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="sectionType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Type
                                </label>
                                <select
                                    id="sectionType"
                                    name="sectionType"
                                    value={listDetails.sectionType}
                                    onChange={handleListDetailsChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="banner">Banner</option>
                                    <option value="launch">Launch</option>
                                    <option value="search">Search</option>
                                    <option value="userprofile">User Profile</option>
                                    <option value="list">List</option>
                                    <option value="call">Call</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="citySelect" className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <select
                                    id="citySelect"
                                    name="city"
                                    value={listDetails.city}
                                    onChange={handleListDetailsChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-3">
                                <button
                                    onClick={updateListType}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Update Image Type
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Color Picker */}
            {selectedListId && (
                <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />
            )}

            {selectedListId && (
                <>
                    {/* List Details */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">List Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="listTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                    List Title
                                </label>
                                <input
                                    type="text"
                                    id="listTitle"
                                    name="title"
                                    value={listDetails.title}
                                    onChange={handleListDetailsChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Header Image
                                </label>
                                <div className="flex mb-2">
                                    <input
                                        type="text"
                                        id="headerImage"
                                        name="headerImage"
                                        value={listDetails.headerImage}
                                        onChange={handleListDetailsChange}
                                        className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Image URL"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => openImageSelector('headerImage')}
                                        className="flex items-center bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                                        title="Browse gallery"
                                    >
                                        <Image className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, 'headerImage')}
                                        />
                                    </label>
                                </div>
                                {listDetails.headerImage && (
                                    <div className="mt-2">
                                        <img
                                            src={listDetails.headerImage}
                                            alt="Header preview"
                                            className="h-20 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={updateListDetails}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Update List Details
                            </button>
                        </div>
                    </div>

                    {/* Entity Selection Panel - Only show for entity list types */}
                    {listDetails.listType !== 'options' && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Select {listDetails.listType.charAt(0).toUpperCase() + listDetails.listType.slice(1)}
                            </h2>

                            <EntityFilterPanel
                                entityType={listDetails.listType}
                                onSelectEntities={handleEntitySelection}
                                selectedEntities={selectedEntities}
                                defaultCity={listDetails.city}
                            />
                        </div>
                    )}

                    {/* Options List - Only show for options list type */}
                    {listDetails.listType === 'options' && listDetails.options && (
                        <>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">List Options</h2>

                                <div className="space-y-4">
                                    {listDetails.options.length > 0 ? (
                                        listDetails.options.map((option, index) => (
                                            <div
                                                key={option._id || index}
                                                className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4"
                                            >
                                                <div className="md:w-1/5">
                                                    <img
                                                        src={option.imagelink}
                                                        alt={option.textview}
                                                        className="w-full h-32 object-cover rounded-md"
                                                    />
                                                </div>

                                                <div className="md:w-3/5">
                                                    <h3 className="font-medium text-gray-800">{option.textview}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 break-all">{option.link}</p>
                                                    <p className="text-xs text-gray-500 mt-3">
                                                        <span className="font-medium">Image URL:</span> {option.imagelink}
                                                    </p>
                                                </div>

                                                <div className="md:w-1/5 flex md:flex-col justify-end gap-2">
                                                    <button
                                                        onClick={() => editOption(option)}
                                                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => deleteOption(option._id)}
                                                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white p-8 rounded-md border border-gray-200 text-center text-gray-500">
                                            No options found for this list. Add a new option below.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add/Edit Option Form */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                    {currentOptionId ? 'Edit Option' : 'Add New Option'}
                                </h2>

                                <form onSubmit={saveOption} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="imagelink" className="block text-sm font-medium text-gray-700 mb-1">
                                                Image Link*
                                            </label>
                                            <div className="flex mb-2">
                                                <input
                                                    type="text"
                                                    id="imagelink"
                                                    name="imagelink"
                                                    value={optionForm.imagelink}
                                                    onChange={handleOptionFormChange}
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Image URL"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => openImageSelector('optionImage')}
                                                    className="flex items-center bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                                                    title="Browse gallery"
                                                >
                                                    <Image className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    <span>Upload Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(e, 'optionImage')}
                                                    />
                                                </label>
                                            </div>
                                            {optionForm.imagelink && (
                                                <div className="mt-2">
                                                    <img
                                                        src={optionForm.imagelink}
                                                        alt="Option preview"
                                                        className="h-20 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="textview" className="block text-sm font-medium text-gray-700 mb-1">
                                                Text View*
                                            </label>
                                            <input
                                                type="text"
                                                id="textview"
                                                name="textview"
                                                value={optionForm.textview}
                                                onChange={handleOptionFormChange}
                                                required
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                                                Link*
                                            </label>
                                            <input
                                                type="text"
                                                id="link"
                                                name="link"
                                                value={optionForm.link}
                                                onChange={handleOptionFormChange}
                                                required
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`flex items-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md`}
                                        >
                                            <Save className="w-5 h-5" />
                                            {currentOptionId ? 'Update Option' : 'Add Option'}
                                        </button>

                                        {currentOptionId && (
                                            <button
                                                type="button"
                                                onClick={resetOptionForm}
                                                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                            >
                                                <X className="w-5 h-5" />
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </>
                    )}

                    {/* Entity Display Section - Show entities for entity list types */}
                    {listDetails.listType !== 'options' && selectedEntities.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Selected {listDetails.listType}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedEntities.map((entity, index) => (
                                    <div key={index} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                                        {/* For Properties */}
                                        {listDetails.listType === 'properties' && (
                                            <>
                                                <div className="mb-2">
                                                    {entity.post_images && entity.post_images[0] && (
                                                        <img
                                                            src={entity.post_images[0]}
                                                            alt={entity.post_title}
                                                            className="w-full h-40 object-cover rounded-md"
                                                        />
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-gray-800">{entity.post_title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{entity.address}</p>
                                                <div className="flex justify-between mt-2 text-sm">
                                                    <span>₹{entity.price}</span>
                                                    <span>{entity.area} sq.ft</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">{entity.type_name}</div>
                                            </>
                                        )}

                                        {/* For Projects */}
                                        {listDetails.listType === 'projects' && (
                                            <>
                                                <div className="mb-2">
                                                    {entity.gallery && entity.gallery[0] && entity.gallery[0].images && entity.gallery[0].images[0] ? (
                                                        <img
                                                            src={entity.gallery[0].images[0]}
                                                            alt={entity.name}
                                                            className="w-full h-40 object-cover rounded-md"
                                                        />
                                                    ) : entity.masterPlan ? (
                                                        <img
                                                            src={entity.masterPlan}
                                                            alt={entity.name}
                                                            className="w-full h-40 object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                                                            <span className="text-gray-500">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-gray-800">{entity.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {entity.location && entity.location.address ? entity.location.address : ''}
                                                </p>
                                                <div className="flex justify-between mt-2 text-sm">
                                                    <span>{entity.type || ''}</span>
                                                    <span>{entity.status || ''}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {entity.builder && entity.builder.name ? `By ${entity.builder.name}` : ''}
                                                </div>
                                            </>
                                        )}

                                        {/* For Buildings */}
                                        {listDetails.listType === 'buildings' && (
                                            <>
                                                <div className="mb-2">
                                                    {entity.galleryList && entity.galleryList[0] ? (
                                                        <img
                                                            src={entity.galleryList[0]}
                                                            alt={entity.name}
                                                            className="w-full h-40 object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                                                            <span className="text-gray-500">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-gray-800">{entity.name}</h3>
                                                <div className="flex justify-between mt-2 text-sm">
                                                    <span>{entity.type || ''}</span>
                                                    <span>{entity.totalProperties || 0} Properties</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* List Actions */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={deleteList}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            disabled={isUploading}
                        >
                            <Trash className="w-5 h-5" />
                            Delete Entire List
                        </button>

                        <button
                            onClick={loadAvailableLists}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh Lists
                        </button>
                    </div>
                </>
            )}

            {/* Image Selector Modal */}
            {showImageSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-11/12 max-w-3xl max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-medium">Select an Image</h3>
                            <button
                                onClick={() => setShowImageSelector(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 max-h-[calc(80vh-120px)] overflow-y-auto">
                            {loadingImages ? (
                                <div className="flex justify-center py-12">
                                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.length > 0 ? (
                                        images.map((url, index) => (
                                            <div
                                                key={index}
                                                className="border rounded-md overflow-hidden cursor-pointer hover:border-blue-500"
                                                onClick={() => selectImage(url)}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Gallery image ${index}`}
                                                    className="h-24 w-full object-cover"
                                                />
                                                <div className="p-2 text-xs text-gray-500 truncate">
                                                    {url.split('/').pop()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No images found. Please upload some images first.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowImageSelector(false)}
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' :
                        notification.type === 'error' ? 'bg-red-500 text-white' :
                            'bg-blue-500 text-white'
                    }`}>
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification({ ...notification, show: false })} className="text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListOptions;