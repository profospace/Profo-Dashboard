import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Edit, Trash, Save, Plus, X, Image, Check, Upload } from 'lucide-react';
import { base_url } from "../../utils/base_url"
import ColorPicker from '../components/ColorPicker';


const ListOptions = () => {
    // State for list selection
    const [availableLists, setAvailableLists] = useState([]);
    const [selectedList, setSelectedList] = useState('');
    const [loading, setLoading] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('');

    // State for current list details
    const [listDetails, setListDetails] = useState({
        listName: '',
        title: '',
        headerImage: '',
        options: [],
        categoryType: 'carousal',
        sectionType: 'banner',
        city: '',
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
            const response = await fetch(`${base_url}/api/get-all-cities`);
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
        if (!selectedList) {
            showNotification('Please select a list first', 'info');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/list-options/${selectedList}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (!data) {
                throw new Error('Invalid data format received');
            }

            setListDetails({
                listName: selectedList,
                title: data.title || '',
                headerImage: data.headerImage || '',
                options: data.options || [],
                categoryType: data.categoryType || 'carousal',
                sectionType: data.sectionType || 'banner',
                city: data.city || '',

            });

            if (data.backgroundColor) {
                setBackgroundColor(data.backgroundColor);
            }

            // Reset option form
            setOptionForm({
                imagelink: '',
                textview: '',
                link: ''
            });
            setCurrentOptionId(null);

        } catch (error) {
            console.error('Error loading options:', error);
            showNotification('Failed to load options', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectList = (e) => {
        setSelectedList(e.target.value);
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

        if (!selectedList) {
            showNotification('Please select a list first', 'error');
            return;
        }

        if (!optionForm.imagelink || !optionForm.textview || !optionForm.link) {
            showNotification('Please fill in all option fields', 'error');
            return;
        }

        try {
            let url, method;

            if (currentOptionId) {
                // Update existing option
                url = `${base_url}/api/list-options/${selectedList}/update-option/${currentOptionId}`;
                method = 'PUT';
            } else {
                // Add new option
                url = `${base_url}/api/list-options/${selectedList}/add-option`;
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
            const response = await fetch(`${base_url}/api/list-options/${selectedList}/remove-option/${optionId}`, {
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
        if (!selectedList) {
            showNotification('No list selected', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete the entire list "${selectedList}"?`)) return;

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedList}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showNotification('List deleted successfully', 'success');
            setSelectedList('');
            setListDetails({
                listName: '',
                title: '',
                headerImage: '',
                options: [],
                categoryType: 'carousal',
                sectionType: 'banner',
                city: ''
            });

            // Refresh available lists
            loadAvailableLists();

        } catch (error) {
            console.error('Error deleting list:', error);
            showNotification('Failed to delete list', 'error');
        }
    };

    const updateListType = async () => {
        if (!selectedList) {
            showNotification('Please select a list first', 'error');
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedList}`, {
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
        if (!selectedList) {
            showNotification('Please select a list first', 'error');
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/list-options/${selectedList}/update-details`, {
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

    // New function to handle file uploads
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
        <div className="p-6 bg-white rounded-lg shadow-md">
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
                            value={selectedList}
                            onChange={handleSelectList}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a list</option>
                            {availableLists.map((list, index) => (
                                <option key={index} value={list.listName}>
                                    {list.listName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={loadListOptions}
                            disabled={!selectedList || loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md w-full justify-center
                ${!selectedList || loading
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

                {selectedList && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                )}
            </div>

            {/* backgroundColor */}
            <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />


            {selectedList && listDetails.options && (
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

                    {/* Options List */}
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