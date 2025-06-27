import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Edit, Trash, Save, Plus, X, Image, Check, Upload, Filter, List, Search, MapPin, Calendar, Eye, Grid, MoreVertical, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { base_url } from "../../utils/base_url";
import ColorPicker from '../components/ColorPicker';
import EntityFilterPanel from '../components/ListOptions/EntityFilterPanel';

const ListOptions = () => {
    // State for list selection and filtering
    const [availableLists, setAvailableLists] = useState([]);
    const [filteredLists, setFilteredLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    const [loading, setLoading] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [showListDropdown, setShowListDropdown] = useState(false);

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterListType, setFilterListType] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);

    // reference to auto scroll the below div
    const fetchedDivRef = useRef(null);

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

    // Auto-load list when selected (but keep manual load button too)
    useEffect(() => {
        if (selectedListId) {
            loadListOptions();
        }
    }, [selectedListId]);

    // Filter lists based on search and filter criteria
    useEffect(() => {
        let filtered = [...availableLists];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(list =>
                list.listName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                list.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                list.city?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // List type filter
        if (filterListType) {
            filtered = filtered.filter(list => list.listType === filterListType);
        }

        // City filter
        if (filterCity) {
            filtered = filtered.filter(list => list.city === filterCity);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.listName.localeCompare(b.listName);
                case 'city':
                    return (a.city || '').localeCompare(b.city || '');
                case 'type':
                    return a.listType.localeCompare(b.listType);
                case 'items':
                    return getItemCount(b) - getItemCount(a);
                default:
                    return 0;
            }
        });

        setFilteredLists(filtered);
    }, [availableLists, searchTerm, filterListType, filterCity, sortBy]);

    const loadAvailableLists = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/list-options`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const lists = await response.json();
            console.log("load available list ", lists);

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
        setShowListDropdown(false);
        setTimeout(() => {
            fetchedDivRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Auto-load when clicking on card
    const handleCardClick = (listId) => {
        setSelectedListId(listId);
        setShowListDropdown(false);
        // fetchedDivRef.current?.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            fetchedDivRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
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
                url = `${base_url}/api/list-options/${selectedListId}/update-option/${currentOptionId}`;
                method = 'PUT';
            } else {
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

    const handleEntitySelection = (entities) => {
        setSelectedEntities(entities);
        saveEntitySelections(entities);
    };

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

    const changeListType = async (newListType) => {
        if (!selectedListId) {
            showNotification('Please select a list first', 'error');
            return;
        }

        try {
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
                    options: newListType === 'options' ? listDetails.options : [],
                    listOfProperties: newListType === 'properties' ? selectedEntities.map(e => e._id) : [],
                    listOfProjects: newListType === 'projects' ? selectedEntities.map(e => e._id) : [],
                    listOfBuildings: newListType === 'buildings' ? selectedEntities.map(e => e._id) : []
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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

    const handleFileUpload = async (e, fieldType) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('uploadedFileName', file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
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
            e.target.value = "";
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleListDetailsChange = (e) => {
        const { name, value } = e.target;
        setListDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getItemCount = (list) => {
        switch (list.listType) {
            case 'options':
                return list.options?.length || 0;
            case 'properties':
                return list.listOfProperties?.length || 0;
            case 'projects':
                return list.listOfProjects?.length || 0;
            case 'buildings':
                return list.listOfBuildings?.length || 0;
            default:
                return 0;
        }
    };

    const getListTypeBadgeColor = (listType) => {
        switch (listType) {
            case 'options':
                return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
            case 'properties':
                return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
            case 'projects':
                return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
            case 'buildings':
                return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterListType('');
        setFilterCity('');
        setSortBy('name');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-6">
                {/* Modern Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        List Options Management
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your lists with advanced filtering and modern interface</p>
                </div>

                {/* Upload Progress Indicator */}
                {isUploading && (
                    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}

                {/* Enhanced List Selection Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <List className="w-6 h-6 text-blue-500" />
                            Available Lists
                        </h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Enhanced Filters Section */}
                    {showFilters && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search lists..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* List Type Filter */}
                                <select
                                    value={filterListType}
                                    onChange={(e) => setFilterListType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">All Types</option>
                                    <option value="options">Regular Options</option>
                                    <option value="properties">Properties</option>
                                    <option value="projects">Projects</option>
                                    <option value="buildings">Buildings</option>
                                </select>

                                {/* City Filter */}
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <select
                                        value={filterCity}
                                        onChange={(e) => setFilterCity(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">All Cities</option>
                                        {cities.map((city, index) => (
                                            <option key={index} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort By */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="city">Sort by City</option>
                                    <option value="type">Sort by Type</option>
                                    <option value="items">Sort by Item Count</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Showing {filteredLists.length} of {availableLists.length} lists
                                </span>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Top Selection Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Dropdown Selection */}
                        <div className="lg:col-span-2">
                            <label htmlFor="listSelector" className="block text-sm font-semibold text-gray-700 mb-2">
                                Quick Select
                            </label>
                            <div className="relative">
                                <select
                                    id="listSelector"
                                    value={selectedListId}
                                    onChange={handleSelectList}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-200"
                                >
                                    <option value="">Select a list from dropdown</option>
                                    {filteredLists.map((list, index) => (
                                        <option key={index} value={list._id}>
                                            {list.listName} ({list.listType}) - {getItemCount(list)} items
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Manual Load Button */}
                        <div className="flex items-end">
                            <button
                                onClick={loadListOptions}
                                disabled={!selectedListId || loading}
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${!selectedListId || loading
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                                    }`}
                            >
                                {loading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Zap className="w-5 h-5" />
                                )}
                                {loading ? 'Loading...' : 'Load Options'}
                            </button>
                        </div>
                    </div>

                    {/* Compact Card Grid with Auto-load */}
                    {filteredLists.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Grid className="w-5 h-5 text-blue-500" />
                                Browse & Auto-Select Lists
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                                {filteredLists.map((list, index) => (
                                    <div
                                        key={index}
                                        className={`group relative bg-white rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${selectedListId === list._id
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => handleCardClick(list._id)}
                                    >
                                        {/* Header Image */}
                                        <div className="relative h-24 rounded-t-xl overflow-hidden">
                                            {list.headerImage ? (
                                                <img
                                                    src={list.headerImage}
                                                    alt={list.listName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                    <Image className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
                                                    {list.listName}
                                                </h4>
                                                {selectedListId === list._id && (
                                                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                )}
                                            </div>

                                            <div className={`inline-block px-2 py-1 text-xs font-medium rounded-lg mb-2 ${getListTypeBadgeColor(list.listType)}`}>
                                                {list.listType}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {list.city || 'No city'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {getItemCount(list)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hover Effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={loadAvailableLists}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh Lists
                        </button>

                        {selectedListId && (
                            <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                List selected & loaded automatically
                            </div>
                        )}
                    </div>
                </div>

                {/* Rest of the component remains the same, but with improved styling */}
                {selectedListId && (
                    <>
                        {/* List Type Selection */}
                        <div ref={fetchedDivRef} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Grid className="w-5 h-5 text-blue-500" />
                                List Type Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div
                                    className={`p-4 rounded-xl cursor-pointer border-2 text-center transition-all duration-300 transform hover:scale-105 ${listDetails.listType === 'options'
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                                            : 'border-gray-300 hover:border-blue-300 hover:shadow-md'
                                        }`}
                                    onClick={() => changeListType('options')}
                                >
                                    <List className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                    <div className="font-semibold text-gray-800">Regular Options</div>
                                    <div className="text-xs text-gray-500 mt-1">Custom images and links</div>
                                </div>

                                <div
                                    className={`p-4 rounded-xl cursor-pointer border-2 text-center transition-all duration-300 transform hover:scale-105 ${listDetails.listType === 'properties'
                                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                                            : 'border-gray-300 hover:border-green-300 hover:shadow-md'
                                        }`}
                                    onClick={() => changeListType('properties')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <div className="font-semibold text-gray-800">Properties</div>
                                    <div className="text-xs text-gray-500 mt-1">Shops, Apartments, etc.</div>
                                </div>

                                <div
                                    className={`p-4 rounded-xl cursor-pointer border-2 text-center transition-all duration-300 transform hover:scale-105 ${listDetails.listType === 'projects'
                                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg'
                                            : 'border-gray-300 hover:border-purple-300 hover:shadow-md'
                                        }`}
                                    onClick={() => changeListType('projects')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="3" y1="9" x2="21" y2="9"></line>
                                        <line x1="9" y1="21" x2="9" y2="9"></line>
                                    </svg>
                                    <div className="font-semibold text-gray-800">Projects</div>
                                    <div className="text-xs text-gray-500 mt-1">Ongoing developments</div>
                                </div>

                                <div
                                    className={`p-4 rounded-xl cursor-pointer border-2 text-center transition-all duration-300 transform hover:scale-105 ${listDetails.listType === 'buildings'
                                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg'
                                            : 'border-gray-300 hover:border-orange-300 hover:shadow-md'
                                        }`}
                                    onClick={() => changeListType('buildings')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M2 14h20M10 22v-8h4v8"></path>
                                    </svg>
                                    <div className="font-semibold text-gray-800">Buildings</div>
                                    <div className="text-xs text-gray-500 mt-1">Individual buildings</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="categoryType" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category Type
                                    </label>
                                    <select
                                        id="categoryType"
                                        name="categoryType"
                                        value={listDetails.categoryType}
                                        onChange={handleListDetailsChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                                    <label htmlFor="sectionType" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Section Type
                                    </label>
                                    <select
                                        id="sectionType"
                                        name="sectionType"
                                        value={listDetails.sectionType}
                                        onChange={handleListDetailsChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                                    <label htmlFor="citySelect" className="block text-sm font-semibold text-gray-700 mb-2">
                                        City
                                    </label>
                                    <select
                                        id="citySelect"
                                        name="city"
                                        value={listDetails.city}
                                        onChange={handleListDetailsChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

                            <div className="mt-6">
                                <button
                                    onClick={updateListType}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    <Check className="w-5 h-5" />
                                    Update Configuration
                                </button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />

                        {/* List Details */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Edit className="w-5 h-5 text-blue-500" />
                                List Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="listTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                                        List Title
                                    </label>
                                    <input
                                        type="text"
                                        id="listTitle"
                                        name="title"
                                        value={listDetails.title}
                                        onChange={handleListDetailsChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter list title..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="headerImage" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Header Image
                                    </label>
                                    <div className="flex mb-2">
                                        <input
                                            type="text"
                                            id="headerImage"
                                            name="headerImage"
                                            value={listDetails.headerImage}
                                            onChange={handleListDetailsChange}
                                            className="w-full p-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Image URL"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => openImageSelector('headerImage')}
                                            className="flex items-center bg-gray-200 px-4 py-3 rounded-r-xl hover:bg-gray-300 transition-colors duration-200"
                                            title="Browse gallery"
                                        >
                                            <Image className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-xl cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
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
                                        <div className="mt-3">
                                            <img
                                                src={listDetails.headerImage}
                                                alt="Header preview"
                                                className="h-20 object-cover rounded-xl border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={updateListDetails}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    <Save className="w-5 h-5" />
                                    Update List Details
                                </button>
                            </div>
                        </div>

                        {/* Entity Selection Panel - Only show for entity list types */}
                        {listDetails.listType !== 'options' && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">
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
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <List className="w-5 h-5 text-blue-500" />
                                        List Options
                                    </h2>

                                    <div className="space-y-4">
                                        {listDetails.options.length > 0 ? (
                                            listDetails.options.map((option, index) => (
                                                <div
                                                    key={option._id || index}
                                                    className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 hover:shadow-md transition-all duration-200"
                                                >
                                                    <div className="md:w-1/5">
                                                        <img
                                                            src={option.imagelink}
                                                            alt={option.textview}
                                                            className="w-full h-32 object-cover rounded-xl"
                                                        />
                                                    </div>

                                                    <div className="md:w-3/5">
                                                        <h3 className="font-semibold text-gray-800 text-lg">{option.textview}</h3>
                                                        <p className="text-sm text-gray-600 mt-1 break-all">{option.link}</p>
                                                        <p className="text-xs text-gray-500 mt-3">
                                                            <span className="font-medium">Image URL:</span> {option.imagelink}
                                                        </p>
                                                    </div>

                                                    <div className="md:w-1/5 flex md:flex-col justify-end gap-2">
                                                        <button
                                                            onClick={() => editOption(option)}
                                                            className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => deleteOption(option._id)}
                                                            className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-12 rounded-xl border border-gray-200 text-center text-gray-500">
                                                <List className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                                <h3 className="text-lg font-semibold mb-2">No options found</h3>
                                                <p>Add a new option below to get started.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Add/Edit Option Form */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-500" />
                                        {currentOptionId ? 'Edit Option' : 'Add New Option'}
                                    </h2>

                                    <form onSubmit={saveOption} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="imagelink" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                                        className="w-full p-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        placeholder="Image URL"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => openImageSelector('optionImage')}
                                                        className="flex items-center bg-gray-200 px-4 py-3 rounded-r-xl hover:bg-gray-300 transition-colors duration-200"
                                                        title="Browse gallery"
                                                    >
                                                        <Image className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-xl cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
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
                                                    <div className="mt-3">
                                                        <img
                                                            src={optionForm.imagelink}
                                                            alt="Option preview"
                                                            className="h-20 object-cover rounded-xl border border-gray-200"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="textview" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Text View*
                                                </label>
                                                <input
                                                    type="text"
                                                    id="textview"
                                                    name="textview"
                                                    value={optionForm.textview}
                                                    onChange={handleOptionFormChange}
                                                    required
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter display text..."
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Link*
                                                </label>
                                                <input
                                                    type="text"
                                                    id="link"
                                                    name="link"
                                                    value={optionForm.link}
                                                    onChange={handleOptionFormChange}
                                                    required
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter URL or link..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={isUploading}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${isUploading
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                                                    }`}
                                            >
                                                <Save className="w-5 h-5" />
                                                {currentOptionId ? 'Update Option' : 'Add Option'}
                                            </button>

                                            {currentOptionId && (
                                                <button
                                                    type="button"
                                                    onClick={resetOptionForm}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
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
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Selected {listDetails.listType}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {selectedEntities.map((entity, index) => (
                                        <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                                            {/* For Properties */}
                                            {listDetails.listType === 'properties' && (
                                                <>
                                                    <div className="mb-2">
                                                        {entity.post_images && entity.post_images[0] && (
                                                            <img
                                                                src={entity.post_images[0]}
                                                                alt={entity.post_title}
                                                                className="w-full h-40 object-cover rounded-xl"
                                                            />
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-800">{entity.post_title}</h3>
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
                                                                className="w-full h-40 object-cover rounded-xl"
                                                            />
                                                        ) : entity.masterPlan ? (
                                                            <img
                                                                src={entity.masterPlan}
                                                                alt={entity.name}
                                                                className="w-full h-40 object-cover rounded-xl"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center">
                                                                <span className="text-gray-500">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-800">{entity.name}</h3>
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
                                                                className="w-full h-40 object-cover rounded-xl"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center">
                                                                <span className="text-gray-500">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-800">{entity.name}</h3>
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
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <button
                                    onClick={deleteList}
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    disabled={isUploading}
                                >
                                    <Trash className="w-5 h-5" />
                                    Delete Entire List
                                </button>

                                <button
                                    onClick={loadAvailableLists}
                                    className="flex items-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Refresh Lists
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Image Selector Modal */}
                {showImageSelector && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">
                                <h3 className="text-xl font-bold text-gray-800">Select an Image</h3>
                                <button
                                    onClick={() => setShowImageSelector(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all duration-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[calc(80vh-120px)] overflow-y-auto">
                                {loadingImages ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-gray-600">Loading images...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {images.length > 0 ? (
                                            images.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="border-2 border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                                                    onClick={() => selectImage(url)}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Gallery image ${index}`}
                                                        className="h-24 w-full object-cover"
                                                    />
                                                    <div className="p-2 text-xs text-gray-500 truncate bg-gray-50">
                                                        {url.split('/').pop()}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12">
                                                <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No images found</h3>
                                                <p className="text-gray-500">Please upload some images first.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t flex justify-end bg-gradient-to-r from-gray-50 to-gray-100">
                                <button
                                    onClick={() => setShowImageSelector(false)}
                                    className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 px-6 py-2 rounded-xl font-semibold transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Notification Toast */}
                {notification.show && (
                    <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transform transition-all duration-300 ${notification.type === 'success'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                            notification.type === 'error'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                                'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        }`}>
                        <span className="font-medium">{notification.message}</span>
                        <button
                            onClick={() => setNotification({ ...notification, show: false })}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOptions;


