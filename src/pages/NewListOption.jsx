import React, { useState, useEffect } from 'react';
import { Plus, X, Image, Save, Upload, Filter, RefreshCw, Check, List } from 'lucide-react';
import { base_url } from "../../utils/base_url";
import ColorPicker from '../components/ColorPicker';
import EntityFilterPanel from '../components/ListOptions/EntityFilterPanel';

const NewListOption = () => {
    const [listName, setListName] = useState('');
    const [listTitle, setListTitle] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [optionType, setOptionType] = useState('carousal');
    const [sectionType, setSectionType] = useState('banner');
    const [listPurpose , setListPurpose] = useState('feed')
    const [cityName, setCityName] = useState('');
    const [options, setOptions] = useState([{ imageLink: '', textView: '', link: '' }]);
    const [cities, setCities] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [currentImageField, setCurrentImageField] = useState(null);
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // New states for entity selection
    const [listType, setListType] = useState('options');
    const [selectedEntities, setSelectedEntities] = useState([]);
    const [showEntitySelector, setShowEntitySelector] = useState(false);
    const [loadingEntities, setLoadingEntities] = useState(false);

    // Fetch cities on component mount
    useEffect(() => {
        fetchCities();
    }, []);

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

    const handleAddOption = () => {
        setOptions([...options, { imageLink: '', textView: '', link: '' }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const openImageSelector = (fieldName, index = null) => {
        setCurrentImageField({ name: fieldName, index });
        fetchImages();
        setShowImageSelector(true);
    };

    const selectImage = (url) => {
        if (currentImageField) {
            if (currentImageField.name === 'headerImage') {
                setHeaderImage(url);
            } else if (currentImageField.name === 'optionImage') {
                const newOptions = [...options];
                newOptions[currentImageField.index].imageLink = url;
                setOptions(newOptions);
            }
            setShowImageSelector(false);
        }
    };

    // Handler for entity selection
    const handleEntitySelection = (entities) => {
        setSelectedEntities(entities);
    };

    const handleFileUpload = async (e, fieldType, optionIndex = null) => {
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
                    setHeaderImage(uploadedUrl);
                } else if (fieldType === 'optionImage' && optionIndex !== null) {
                    const newOptions = [...options];
                    newOptions[optionIndex].imageLink = uploadedUrl;
                    setOptions(newOptions);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!listName || !listTitle || !headerImage) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Check if options are provided for options list type
        if (listType === 'options' && options.some(opt => !opt.imageLink || !opt.textView || !opt.link)) {
            showNotification('Please fill in all option fields', 'error');
            return;
        }

        // Check if entities are selected for entity list types
        if (listType !== 'options' && selectedEntities.length === 0) {
            showNotification(`Please select at least one ${listType.slice(0, -1)}`, 'error');
            return;
        }

        try {
            let requestBody = {
                listName,
                title: listTitle,
                headerImage,
                categoryType: optionType,
                sectionType,
                listPurpose,
                backgroundColor,
                city: cityName,
                listType: listType,
            };

            // Add the appropriate data based on list type
            if (listType === 'options') {
                requestBody.options = options.map(opt => ({
                    imagelink: opt.imageLink,
                    textview: opt.textView,
                    link: opt.link
                }));
            } else {
                // For entity lists, add the entity IDs
                const entityIdsField = `listOf${listType.charAt(0).toUpperCase() + listType.slice(1)}`;
                requestBody[entityIdsField] = selectedEntities.map(entity => entity._id || entity.id || entity.post_id);
            }

            const response = await fetch(`${base_url}/api/list-options/add-complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error('Failed to save list option');

            const result = await response.json();
            showNotification(result.message || 'List option created successfully', 'success');

            // Reset form
            setListName('');
            setListTitle('');
            setHeaderImage('');
            setOptionType('carousal');
            setSectionType('banner');
            setListPurpose('feed')
            setCityName('');
            setOptions([{ imageLink: '', textView: '', link: '' }]);
            setBackgroundColor('');
            setListType('options');
            setSelectedEntities([]);

        } catch (error) {
            console.error('Error creating list option:', error);
            showNotification('Failed to create list option', 'error');
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New List Option</h1>

            {/* Upload Progress Indicator */}
            {isUploading && (
                <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* List Type Selection */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">List Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div
                            className={`p-4 rounded-md cursor-pointer border-2 text-center ${listType === 'options' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                            onClick={() => setListType('options')}
                        >
                            <List className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">Regular Options</div>
                            <div className="text-xs text-gray-500 mt-1">Custom images and links</div>
                        </div>

                        <div
                            className={`p-4 rounded-md cursor-pointer border-2 text-center ${listType === 'properties' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                            onClick={() => setListType('properties')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="font-medium">Properties</div>
                            <div className="text-xs text-gray-500 mt-1">Shops, Apartments, etc.</div>
                        </div>

                        <div
                            className={`p-4 rounded-md cursor-pointer border-2 text-center ${listType === 'projects' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                            onClick={() => setListType('projects')}
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
                            className={`p-4 rounded-md cursor-pointer border-2 text-center ${listType === 'buildings' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                            onClick={() => setListType('buildings')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M2 14h20M10 22v-8h4v8"></path>
                            </svg>
                            <div className="font-medium">Buildings</div>
                            <div className="text-xs text-gray-500 mt-1">Individual buildings</div>
                        </div>
                    </div>
                </div>

                {/* Basic List Information */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Basic List Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
                                List Name*
                            </label>
                            <input
                                type="text"
                                id="listName"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="listTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                List Title*
                            </label>
                            <input
                                type="text"
                                id="listTitle"
                                value={listTitle}
                                onChange={(e) => setListTitle(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700 mb-1">
                                Header Image*
                            </label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="text"
                                    id="headerImage"
                                    value={headerImage}
                                    onChange={(e) => setHeaderImage(e.target.value)}
                                    required
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
                            {headerImage && (
                                <div className="mt-2">
                                    <img
                                        src={headerImage}
                                        alt="Header preview"
                                        className="h-20 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="optionType" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Type
                            </label>
                            <select
                                id="optionType"
                                value={optionType}
                                onChange={(e) => setOptionType(e.target.value)}
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
                                value={sectionType}
                                onChange={(e) => setSectionType(e.target.value)}
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
                        {/* listPurpose */}
                        <div>
                            <label htmlFor="listPurpose" className="block text-sm font-medium text-gray-700 mb-1">
                                List Purpose
                            </label>
                            <select
                                id="listPurpose"
                                value={listPurpose}
                                onChange={(e) => setListPurpose(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="pages">pages</option>
                                <option value="feed">feed</option>
                                <option value="pagefeed">pagefeed</option>
                                
                            </select>
                        </div>

                        <div>
                            <label htmlFor="cityName" className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <select
                                id="cityName"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
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
                    </div>
                </div>

                {/* backgroundColor */}
                <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />

                {/* Entity Filter Panel - Only show for entity list types */}
                {listType !== 'options' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Select {listType.charAt(0).toUpperCase() + listType.slice(1)}
                        </h2>

                        <EntityFilterPanel
                            entityType={listType}
                            onSelectEntities={handleEntitySelection}
                            selectedEntities={selectedEntities}
                            defaultCity={cityName}
                        />
                    </div>
                )}

                {/* Options Panel - Only show for options list type */}
                {listType === 'options' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">List Options</h2>

                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="mb-6 p-4 border border-gray-200 rounded-lg bg-white relative"
                            >
                                <h3 className="font-medium text-gray-700 mb-3">Option {index + 1}</h3>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label htmlFor={`imageLink${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Image Link*
                                        </label>
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                id={`imageLink${index}`}
                                                value={option.imageLink}
                                                onChange={(e) => handleOptionChange(index, 'imageLink', e.target.value)}
                                                required
                                                className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Image URL"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openImageSelector('optionImage', index)}
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
                                                    onChange={(e) => handleFileUpload(e, 'optionImage', index)}
                                                />
                                            </label>
                                        </div>
                                        {option.imageLink && (
                                            <div className="mt-2">
                                                <img
                                                    src={option.imageLink}
                                                    alt={`Option ${index + 1} preview`}
                                                    className="h-20 object-cover rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor={`textView${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Text View*
                                        </label>
                                        <input
                                            type="text"
                                            id={`textView${index}`}
                                            value={option.textView}
                                            onChange={(e) => handleOptionChange(index, 'textView', e.target.value)}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor={`link${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Link*
                                        </label>
                                        <input
                                            type="text"
                                            id={`link${index}`}
                                            value={option.link}
                                            onChange={(e) => handleOptionChange(index, 'link', e.target.value)}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Option
                        </button>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                        disabled={isUploading}
                    >
                        <Save className="w-5 h-5" />
                        Create List Option
                    </button>
                </div>
            </form>

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

export default NewListOption;