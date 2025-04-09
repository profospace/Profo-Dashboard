import React, { useState, useEffect } from 'react';
import {
    Plus, X, Image, Save, Upload, Edit, Trash2,
    Copy, CheckCircle, Home, Building, Briefcase, List,

} from 'lucide-react';
import { base_url } from "../../../utils/base_url";
import ColorPicker from '../../components/ColorPicker';

const ListOptionDashboard = () => {
    // List of created options
    const [listOptions, setListOptions] = useState([]);

    // Form state for creating/editing a list option
    const [formData, setFormData] = useState({
        listName: '',
        title: '',
        subtitle: '',
        headerImage: '',
        categoryType: 'horizontal_list',
        sectionType: 'propertyList',
        entityType: 'property',
        backgroundColor: '#ffffff',
        buttonText: 'View All',
        buttonLink: '#',
        buttonColor: '#3b82f6',
        city: '',
        region: '',
        useGeolocation: true,
        defaultRadius: 10,
        limit: 5,
        viewType: 'compact',
        sortBy: {
            field: 'createdAt',
            order: 'desc'
        },
        options: [],
        filters: {
            property: {
                type: { enabled: false, values: [] },
                bedrooms: { enabled: false, min: 0, max: 0 },
                bathrooms: { enabled: false, min: 0, max: 0 },
                price: { enabled: false, min: 0, max: 0 },
                area: { enabled: false, min: 0, max: 0 },
                furnishing: { enabled: false, values: [] },
                construction_status: { enabled: false, values: [] },
                purpose: { enabled: false, values: [] },
                amenities: { enabled: false, values: [] }
            },
            project: {
                type: { enabled: false, values: [] },
                status: { enabled: false, values: [] },
                priceRange: { enabled: false, min: 0, max: 0 }
            },
            building: {
                type: { enabled: false, values: [] },
                status: { enabled: false, values: [] }
            }
        },
        isActive: true
    });

    // Custom options state (for entityType 'custom')
    const [customOptions, setCustomOptions] = useState([
        { imageLink: '', textView: '', link: '' }
    ]);

    // UI state
    const [cities, setCities] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState(['Apartment', 'Villa', 'Shops', 'Warehouses', 'Halls', 'Penthouse', 'Office', 'Land']);
    const [furnishingOptions, setFurnishingOptions] = useState(['Furnished', 'Semi-Furnished', 'Unfurnished']);
    const [constructionStatuses, setConstructionStatuses] = useState(['Ready to Move', 'Under Construction', 'New Launch']);
    const [propertyPurposes, setPropertyPurposes] = useState(['buy', 'rent', 'sell']);
    const [amenities, setAmenities] = useState(['Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden', 'Power Backup', 'Lift', 'Club House', 'Internet', 'Gas Pipeline']);

    const [currentTab, setCurrentTab] = useState('create'); // 'create', 'list'
    const [editMode, setEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [currentImageField, setCurrentImageField] = useState(null);
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [filters, setFilters] = useState({
        searchTerm: '',
        entityType: 'all',
        isActive: true
    });

    // New state for advanced filter visibility
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Load initial data
    useEffect(() => {
        fetchListOptions();
        fetchCities();
        fetchFilterOptions();
    }, []);

    // Fetch all list options
    const fetchListOptions = async () => {
        try {
            const response = await fetch(`${base_url}/api/list-options`);
            if (!response.ok) throw new Error('Failed to fetch list options');
            const data = await response.json();
            console.log("response", data)
            setListOptions(data);
        } catch (error) {
            console.error('Error fetching list options:', error);
            showNotification('Failed to load list options', 'error');
        }
    };

    // Fetch cities for dropdown
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

    // Fetch filter options (property types, amenities, etc.)
    const fetchFilterOptions = async () => {
        try {
            // You can add an API call here to get dynamic filter options from backend
            // For now, we're using static arrays defined above
            // Example:
            // const response = await fetch(`${base_url}/api/property-filter-options`);
            // if (!response.ok) throw new Error('Failed to fetch filter options');
            // const data = await response.json();
            // setPropertyTypes(data.propertyTypes);
            // setFurnishingOptions(data.furnishingOptions);
            // ...
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    // Fetch images for image selector
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

    // Handle form input change
    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    // Handle nested object changes (for filters)
    const handleNestedChange = (category, subcategory, field, value) => {
        setFormData({
            ...formData,
            [category]: {
                ...formData[category],
                [subcategory]: {
                    ...formData[category][subcategory],
                    [field]: value
                }
            }
        });
    };

    // Handle filter range change (min/max values)
    const handleFilterRangeChange = (entityType, filterName, field, value) => {
        // Convert value to number and ensure it's valid
        let numValue = parseInt(value);
        if (isNaN(numValue)) numValue = 0;

        setFormData({
            ...formData,
            filters: {
                ...formData.filters,
                [entityType]: {
                    ...formData.filters[entityType],
                    [filterName]: {
                        ...formData.filters[entityType][filterName],
                        [field]: numValue
                    }
                }
            }
        });
    };

    // Toggle filter enabled/disabled
    const toggleFilterEnabled = (entityType, filterName) => {
        setFormData({
            ...formData,
            filters: {
                ...formData.filters,
                [entityType]: {
                    ...formData.filters[entityType],
                    [filterName]: {
                        ...formData.filters[entityType][filterName],
                        enabled: !formData.filters[entityType][filterName].enabled
                    }
                }
            }
        });
    };

    // Handle multi-select filter values (like property types, amenities)
    const handleFilterValuesChange = (entityType, filterName, selectedValues) => {
        setFormData({
            ...formData,
            filters: {
                ...formData.filters,
                [entityType]: {
                    ...formData.filters[entityType],
                    [filterName]: {
                        ...formData.filters[entityType][filterName],
                        values: selectedValues
                    }
                }
            }
        });
    };

    // Toggle a single value in a multi-select filter
    const toggleFilterValue = (entityType, filterName, value) => {
        const currentValues = [...formData.filters[entityType][filterName].values];
        const index = currentValues.indexOf(value);

        if (index > -1) {
            currentValues.splice(index, 1);
        } else {
            currentValues.push(value);
        }

        handleFilterValuesChange(entityType, filterName, currentValues);
    };

    // Handle adding a custom option
    const handleAddCustomOption = () => {
        setCustomOptions([...customOptions, { imageLink: '', textView: '', link: '' }]);
    };

    // Handle removing a custom option
    const handleRemoveCustomOption = (index) => {
        const newOptions = [...customOptions];
        newOptions.splice(index, 1);
        setCustomOptions(newOptions);
    };

    // Handle custom option change
    const handleCustomOptionChange = (index, field, value) => {
        const newOptions = [...customOptions];
        newOptions[index][field] = value;
        setCustomOptions(newOptions);
    };

    // Open image selector
    const openImageSelector = (fieldName, index = null) => {
        setCurrentImageField({ name: fieldName, index });
        fetchImages();
        setShowImageSelector(true);
    };

    // Select image from image selector
    const selectImage = (url) => {
        if (currentImageField) {
            if (currentImageField.name === 'headerImage') {
                handleInputChange('headerImage', url);
            } else if (currentImageField.name === 'optionImage') {
                const newOptions = [...customOptions];
                newOptions[currentImageField.index].imageLink = url;
                setCustomOptions(newOptions);
            }
            setShowImageSelector(false);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e, fieldType, optionIndex = null) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('uploadedFileName', file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress
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

            if (data.response_code === 200) {
                const uploadedUrl = data.response_data.Location;

                if (fieldType === 'headerImage') {
                    handleInputChange('headerImage', uploadedUrl);
                } else if (fieldType === 'optionImage' && optionIndex !== null) {
                    const newOptions = [...customOptions];
                    newOptions[optionIndex].imageLink = uploadedUrl;
                    setCustomOptions(newOptions);
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
            e.target.value = "";
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.listName || !formData.title || !formData.headerImage) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // For custom entity type, validate custom options
        if (formData.entityType === 'custom' &&
            (customOptions.length === 0 ||
                customOptions.some(opt => !opt.imageLink || !opt.textView || !opt.link))) {
            showNotification('Please fill in all custom options', 'error');
            return;
        }

        try {
            // Prepare request body
            const requestBody = {
                ...formData
            };

            // Handle options based on entity type
            if (formData.entityType === 'custom') {
                // For custom entity type, use the user-defined options
                requestBody.options = customOptions.map(opt => ({
                    imagelink: opt.imageLink,
                    textview: opt.textView,
                    link: opt.link
                }));
            } else {
                // For entity types (property, project, building), add a placeholder option
                // for backward compatibility
                requestBody.options = [{
                    imagelink: formData.headerImage || 'https://example.com/default.jpg',
                    textview: `${formData.title || formData.listName}`,
                    link: formData.buttonLink || '#'
                }];
            }

            // Validate filter values are provided when filters are enabled
            if (formData.entityType === 'property') {
                // Check property type filter
                if (formData.filters.property.type.enabled &&
                    (!formData.filters.property.type.values || formData.filters.property.type.values.length === 0)) {
                    showNotification('Please select at least one property type', 'error');
                    return;
                }

                // Validate other enabled filters have values
                if (formData.filters.property.bedrooms.enabled &&
                    formData.filters.property.bedrooms.min === 0 &&
                    formData.filters.property.bedrooms.max === 0) {
                    showNotification('Please set at least minimum or maximum bedrooms', 'error');
                    return;
                }

                if (formData.filters.property.price.enabled &&
                    formData.filters.property.price.min === 0 &&
                    formData.filters.property.price.max === 0) {
                    showNotification('Please set at least minimum or maximum price', 'error');
                    return;
                }

                if (formData.filters.property.furnishing.enabled &&
                    (!formData.filters.property.furnishing.values || formData.filters.property.furnishing.values.length === 0)) {
                    showNotification('Please select at least one furnishing option', 'error');
                    return;
                }

                if (formData.filters.property.purpose.enabled &&
                    (!formData.filters.property.purpose.values || formData.filters.property.purpose.values.length === 0)) {
                    showNotification('Please select at least one purpose option', 'error');
                    return;
                }

                if (formData.filters.property.amenities.enabled &&
                    (!formData.filters.property.amenities.values || formData.filters.property.amenities.values.length === 0)) {
                    showNotification('Please select at least one amenity', 'error');
                    return;
                }
            } else if (formData.entityType === 'project') {
                // Check project type filter
                if (formData.filters.project.type.enabled &&
                    (!formData.filters.project.type.values || formData.filters.project.type.values.length === 0)) {
                    showNotification('Please select at least one project type', 'error');
                    return;
                }

                // Check other project filters
            } else if (formData.entityType === 'building') {
                // Check building filters
                if (formData.filters.building.type.enabled &&
                    (!formData.filters.building.type.values || formData.filters.building.type.values.length === 0)) {
                    showNotification('Please select at least one building type', 'error');
                    return;
                }
            }

            // Determine API endpoint based on edit mode
            const endpoint = editMode
                ? `${base_url}/api/list-options/${currentEditId}`
                : `${base_url}/api/list-options/add-complete`;

            const method = editMode ? 'PUT' : 'POST';

            // Make API request
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${editMode ? 'update' : 'create'} list option`);
            }

            const result = await response.json();

            // Show success notification
            showNotification(
                result.message || `List option ${editMode ? 'updated' : 'created'} successfully`,
                'success'
            );

            // Reset form and refresh list
            resetForm();
            fetchListOptions();
            setCurrentTab('list');

        } catch (error) {
            console.error(`Error ${editMode ? 'updating' : 'creating'} list option:`, error);
            showNotification(error.message || `Failed to ${editMode ? 'update' : 'create'} list option`, 'error');
        }
    };

    // Edit existing list option
    const handleEdit = (id) => {
        const listOption = listOptions.find(option => option._id === id);
        if (!listOption) return;

        // Set form data from list option
        setFormData({
            listName: listOption.listName || '',
            title: listOption.title || '',
            subtitle: listOption.subtitle || '',
            headerImage: listOption.headerImage || '',
            categoryType: listOption.categoryType || 'horizontal_list',
            sectionType: listOption.sectionType || 'propertyList',
            entityType: listOption.entityType || 'property',
            backgroundColor: listOption.backgroundColor || '#ffffff',
            buttonText: listOption.buttonText || 'View All',
            buttonLink: listOption.buttonLink || '#',
            buttonColor: listOption.buttonColor || '#3b82f6',
            city: listOption.city || '',
            region: listOption.region || '',
            useGeolocation: listOption.useGeolocation !== undefined ? listOption.useGeolocation : true,
            defaultRadius: listOption.defaultRadius || 10,
            limit: listOption.limit || 5,
            viewType: listOption.viewType || 'compact',
            sortBy: listOption.sortBy || {
                field: 'createdAt',
                order: 'desc'
            },
            filters: listOption.filters || {
                property: {
                    type: { enabled: false, values: [] },
                    bedrooms: { enabled: false, min: 0, max: 0 },
                    bathrooms: { enabled: false, min: 0, max: 0 },
                    price: { enabled: false, min: 0, max: 0 },
                    area: { enabled: false, min: 0, max: 0 },
                    furnishing: { enabled: false, values: [] },
                    construction_status: { enabled: false, values: [] },
                    purpose: { enabled: false, values: [] },
                    amenities: { enabled: false, values: [] }
                },
                project: {
                    type: { enabled: false, values: [] },
                    status: { enabled: false, values: [] },
                    priceRange: { enabled: false, min: 0, max: 0 }
                },
                building: {
                    type: { enabled: false, values: [] },
                    status: { enabled: false, values: [] }
                }
            },
            isActive: listOption.isActive !== undefined ? listOption.isActive : true
        });

        // Set custom options if present
        if (listOption.options && listOption.options.length > 0) {
            setCustomOptions(listOption.options.map(opt => ({
                imageLink: opt.imagelink || '',
                textView: opt.textview || '',
                link: opt.link || ''
            })));
        } else {
            setCustomOptions([{ imageLink: '', textView: '', link: '' }]);
        }

        // Set edit mode
        setEditMode(true);
        setCurrentEditId(id);
        setCurrentTab('create');

        // Expand advanced filters if any are enabled
        const hasAdvancedFilters =
            (listOption.entityType === 'property' && (
                listOption.filters?.property?.amenities?.enabled ||
                listOption.filters?.property?.purpose?.enabled ||
                listOption.filters?.property?.construction_status?.enabled
            )) ||
            (listOption.entityType === 'project' && (
                listOption.filters?.project?.status?.enabled
            )) ||
            (listOption.entityType === 'building' && (
                listOption.filters?.building?.status?.enabled
            ));

        if (hasAdvancedFilters) {
            setShowAdvancedFilters(true);
        }
    };

    // Delete list option
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this list option?')) return;

        try {
            const response = await fetch(`${base_url}/api/list-options/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete list option');

            // Remove from state and show notification
            setListOptions(listOptions.filter(option => option._id !== id));
            showNotification('List option deleted successfully', 'success');

        } catch (error) {
            console.error('Error deleting list option:', error);
            showNotification('Failed to delete list option', 'error');
        }
    };

    // Clone list option
    const handleClone = (id) => {
        const listOption = listOptions.find(option => option._id === id);
        if (!listOption) return;

        // Set form data from list option with a new name
        handleEdit(id);
        handleInputChange('listName', `${listOption.listName}_clone`);
        setEditMode(false);
        setCurrentEditId(null);
    };

    // Toggle active state
    const handleToggleActive = async (id, currentState) => {
        try {
            const response = await fetch(`${base_url}/api/list-options/${id}/toggle-active`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentState })
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Update state
            setListOptions(listOptions.map(option =>
                option._id === id ? { ...option, isActive: !currentState } : option
            ));

            showNotification('Status updated successfully', 'success');

        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('Failed to update status', 'error');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            listName: '',
            title: '',
            subtitle: '',
            headerImage: '',
            categoryType: 'horizontal_list',
            sectionType: 'propertyList',
            entityType: 'property',
            backgroundColor: '#ffffff',
            buttonText: 'View All',
            buttonLink: '#',
            buttonColor: '#3b82f6',
            city: '',
            region: '',
            useGeolocation: true,
            defaultRadius: 10,
            limit: 5,
            viewType: 'compact',
            sortBy: {
                field: 'createdAt',
                order: 'desc'
            },
            options: [],
            filters: {
                property: {
                    type: { enabled: false, values: [] },
                    bedrooms: { enabled: false, min: 0, max: 0 },
                    bathrooms: { enabled: false, min: 0, max: 0 },
                    price: { enabled: false, min: 0, max: 0 },
                    area: { enabled: false, min: 0, max: 0 },
                    furnishing: { enabled: false, values: [] },
                    construction_status: { enabled: false, values: [] },
                    purpose: { enabled: false, values: [] },
                    amenities: { enabled: false, values: [] }
                },
                project: {
                    type: { enabled: false, values: [] },
                    status: { enabled: false, values: [] },
                    priceRange: { enabled: false, min: 0, max: 0 }
                },
                building: {
                    type: { enabled: false, values: [] },
                    status: { enabled: false, values: [] }
                }
            },
            isActive: true
        });
        setCustomOptions([{ imageLink: '', textView: '', link: '' }]);
        setEditMode(false);
        setCurrentEditId(null);
        setShowAdvancedFilters(false);
    };

    // Show notification
    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Filter list options
    const filteredListOptions = listOptions.filter(option => {
        // Filter by search term
        if (filters.searchTerm &&
            !option.listName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !option.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by entity type
        if (filters.entityType !== 'all' && option.entityType !== filters.entityType) {
            return false;
        }

        // Filter by active state
        if (filters.isActive !== null && option.isActive !== filters.isActive) {
            return false;
        }

        return true;
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">List Options Manager</h1>

            {/* Upload Progress Indicator */}
            {isUploading && (
                <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${currentTab === 'list'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setCurrentTab('list')}
                >
                    All List Options
                </button>
                <button
                    className={`py-2 px-4 font-medium ${currentTab === 'create'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => {
                        resetForm();
                        setCurrentTab('create');
                    }}
                >
                    {editMode ? 'Edit List Option' : 'Create New List Option'}
                </button>
            </div>

            {/* List Tab */}
            {currentTab === 'list' && (
                <form>
                    {/* Filter Controls */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by name or title..."
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={filters.searchTerm}
                                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Entity Type
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={filters.entityType}
                                    onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                                >
                                    <option value="all">All Types</option>
                                    <option value="property">Property</option>
                                    <option value="project">Project</option>
                                    <option value="building">Building</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={filters.isActive}
                                    onChange={(e) => setFilters({ ...filters, isActive: e.target.value === 'true' })}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* List Options Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Section Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Entity Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredListOptions.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No list options found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredListOptions.map((option) => (
                                            <tr key={option._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={option.headerImage || 'https://example.com/default.jpg'}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {option.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {option.listName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {option.sectionType}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {option.entityType === 'property' && <Home className="h-4 w-4 mr-1 text-blue-500" />}
                                                        {option.entityType === 'project' && <Building className="h-4 w-4 mr-1 text-green-500" />}
                                                        {option.entityType === 'building' && <Briefcase className="h-4 w-4 mr-1 text-orange-500" />}
                                                        {option.entityType === 'custom' && <List className="h-4 w-4 mr-1 text-purple-500" />}
                                                        <span className="text-sm text-gray-900 capitalize">
                                                            {option.entityType}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${option.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {option.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(option.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleToggleActive(option._id, option.isActive)}
                                                            className={`p-1 rounded-full ${option.isActive
                                                                ? 'text-red-500 hover:bg-red-100'
                                                                : 'text-green-500 hover:bg-green-100'
                                                                }`}
                                                            title={option.isActive ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {option.isActive ? (
                                                                <X className="h-4 w-4" />
                                                            ) : (
                                                                <CheckCircle className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(option._id)}
                                                            className="p-1 rounded-full text-blue-500 hover:bg-blue-100"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleClone(option._id)}
                                                            className="p-1 rounded-full text-purple-500 hover:bg-purple-100"
                                                            title="Clone"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(option._id)}
                                                            className="p-1 rounded-full text-red-500 hover:bg-red-100"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>



                    {/* Custom Options (for entityType 'custom') */}
                    {
                        formData.entityType === 'custom' && (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Options</h2>

                                {customOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                    >
                                        <h3 className="font-medium text-gray-700 mb-3">Option {index + 1}</h3>

                                        {customOptions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCustomOption(index)}
                                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Image Link*
                                                </label>
                                                <div className="flex mb-2">
                                                    <input
                                                        type="text"
                                                        value={option.imageLink}
                                                        onChange={(e) => handleCustomOptionChange(index, 'imageLink', e.target.value)}
                                                        required
                                                        className="w-full p-2 border border-gray-300 rounded-l-md"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Text View*
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.textView}
                                                    onChange={(e) => handleCustomOptionChange(index, 'textView', e.target.value)}
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Link*
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.link}
                                                    onChange={(e) => handleCustomOptionChange(index, 'link', e.target.value)}
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddCustomOption}
                                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Another Option
                                </button>
                            </div>
                        )
                    }

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                if (editMode) {
                                    setCurrentTab('list');
                                }
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                        >
                            <Save className="w-5 h-5" />
                            {editMode ? 'Update List Option' : 'Create List Option'}
                        </button>
                    </div>
                </form>
            )}

            {/* Image Selector Modal */}
            {
                showImageSelector && (
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
                )
            }

            {/* Notification Toast */}
            {
                notification.show && (
                    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' :
                        notification.type === 'error' ? 'bg-red-500 text-white' :
                            'bg-blue-500 text-white'
                        }`}>
                        <span>{notification.message}</span>
                        <button onClick={() => setNotification({ ...notification, show: false })} className="text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default ListOptionDashboard;