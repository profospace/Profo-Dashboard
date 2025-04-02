import React, { useState, useEffect, useCallback } from 'react';
import GoogleMapComponent from './GoogleMapComponent';
import FlatsDetailsForm from './FlatsDetailsForm';
import GalleryUpload from './GalleryUpload';

const BuildingForm = ({
    initialData = {},
    isLoading,
    onSubmit,
    onSaveDraft,
    isSaving = false
}) => {
    // Form state
    const [formData, setFormData] = useState({
        buildingId: '',
        name: '',
        frontRoad: '',
        parkingArea: '',
        description: '',
        areaUSP: '',
        ownerName: '',
        ownerId: '',
        storey: '',
        age: '',
        type: '',
        luda: '',
        totalProperties: '',
        developmentStatus: 'Upcoming',
        allowPreBooking: false,
        allocatedProperties: '',
        freeProperties: '',
        contactNumber: '',
        numberOfFlatsAvailable: '',
        totalFloors: '',
        brochureLink: '',
        mapLink: '',
        ...initialData
    });

    const [flatsDetails, setFlatsDetails] = useState(initialData.flatsDetails || []);
    const [gallery, setGallery] = useState(initialData.galleryList || []);
    const [uploadedGalleryFiles, setUploadedGalleryFiles] = useState([]);
    const [latitude, setLatitude] = useState(
        initialData.location?.coordinates ? initialData.location.coordinates[1] : ''
    );
    const [longitude, setLongitude] = useState(
        initialData.location?.coordinates ? initialData.location.coordinates[0] : ''
    );
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basic');
    const [formTouched, setFormTouched] = useState(false);

    // Initialize form with initial data when it changes
    useEffect(() => {
        if (Object.keys(initialData).length > 0) {
            setFormData({
                buildingId: '',
                name: '',
                frontRoad: '',
                parkingArea: '',
                description: '',
                areaUSP: '',
                ownerName: '',
                ownerId: '',
                storey: '',
                age: '',
                type: '',
                luda: '',
                totalProperties: '',
                developmentStatus: 'Upcoming',
                allowPreBooking: false,
                allocatedProperties: '',
                freeProperties: '',
                contactNumber: '',
                numberOfFlatsAvailable: '',
                totalFloors: '',
                brochureLink: '',
                mapLink: '',
                ...initialData
            });

            setFlatsDetails(initialData.flatsDetails || []);
            setGallery(initialData.galleryList || []);

            if (initialData.location?.coordinates) {
                setLatitude(initialData.location.coordinates[1]);
                setLongitude(initialData.location.coordinates[0]);
            }
        }
    }, [initialData]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Convert string number inputs to actual numbers
        const numericFields = [
            'totalProperties',
            'allocatedProperties',
            'freeProperties',
            'numberOfFlatsAvailable',
            'totalFloors'
        ];

        let finalValue;
        if (type === 'checkbox') {
            finalValue = checked;
        } else if (numericFields.includes(name) && value !== '') {
            finalValue = Number(value);
        } else {
            finalValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
        setFormTouched(true);

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    // Handle location change from the map component
    const handleLocationChange = (lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
        setFormTouched(true);
    };

    // Handle flats details changes
    const handleFlatsDetailsChange = (newFlatsDetails) => {
        setFlatsDetails(newFlatsDetails);
        setFormTouched(true);
    };

    // Handle gallery image changes
    const handleGalleryChange = (files) => {
        setUploadedGalleryFiles(prev => [...prev, ...files]);
        setFormTouched(true);
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.buildingId) newErrors.buildingId = 'Building ID is required';
        if (!formData.name) newErrors.name = 'Name is required';

        // Numeric validation
        const numericFields = [
            'totalProperties',
            'allocatedProperties',
            'freeProperties',
            'numberOfFlatsAvailable',
            'totalFloors'
        ];

        numericFields.forEach(field => {
            if (formData[field] && isNaN(Number(formData[field]))) {
                newErrors[field] = 'Must be a number';
            }
        });

        // Flats validation
        if (formData.numberOfFlatsAvailable && !formData.totalFloors) {
            newErrors.totalFloors = 'Total floors is required when specifying flats';
        }

        // Location validation
        if (latitude && !longitude) newErrors.longitude = 'Longitude is required when latitude is provided';
        if (longitude && !latitude) newErrors.latitude = 'Latitude is required when longitude is provided';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Prepare data for API submission
    const prepareFormData = useCallback(() => {
        // Create a copy of the form data
        const preparedData = { ...formData };

        // Add location if both lat and lng are provided
        if (latitude && longitude) {
            preparedData.location = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
        }

        // Add flats details
        if (formData.totalFloors > 0) {
            preparedData.flatsDetails = flatsDetails;
        }

        return preparedData;
    }, [formData, latitude, longitude, flatsDetails]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const preparedData = prepareFormData();
            onSubmit(preparedData, uploadedGalleryFiles);
        } else {
            // Find the first error and switch to its tab
            const errorFields = Object.keys(errors);
            if (errorFields.length > 0) {
                const basicFields = ['buildingId', 'name', 'frontRoad', 'parkingArea', 'description', 'ownerName', 'ownerId', 'storey', 'age', 'type', 'luda', 'totalProperties', 'developmentStatus', 'allocatedProperties', 'freeProperties', 'contactNumber'];
                const locationFields = ['latitude', 'longitude'];
                const flatsFields = ['numberOfFlatsAvailable', 'totalFloors'];

                if (basicFields.some(field => errorFields.includes(field))) {
                    setActiveTab('basic');
                } else if (locationFields.some(field => errorFields.includes(field))) {
                    setActiveTab('location');
                } else if (flatsFields.some(field => errorFields.includes(field))) {
                    setActiveTab('flats');
                }
            }
        }
    };

    // Handle save draft
    const handleSaveDraft = () => {
        const preparedData = prepareFormData();
        onSaveDraft(preparedData);
    };

    // Auto-fill dummy data for testing
    const autofillDummyData = (datasetIndex) => {
        const dummyDatasets = [
            {
                buildingId: 'BLD1001',
                name: 'Horizon Heights',
                frontRoad: '60 ft Wide Road',
                parkingArea: '10,000 sq ft',
                description: 'Luxury apartment complex with modern amenities and scenic views.',
                areaUSP: 'Close to metro station and shopping malls',
                ownerName: 'Sunrise Developers',
                ownerId: 'DEV001',
                storey: '15',
                age: 'New Construction',
                type: 'Residential',
                luda: 'Premium',
                totalProperties: '60',
                developmentStatus: 'Under Construction',
                allowPreBooking: true,
                allocatedProperties: '25',
                freeProperties: '35',
                contactNumber: '+91 9876543210',
                numberOfFlatsAvailable: 35,
                totalFloors: 15,
                brochureLink: 'https://example.com/brochure.pdf',
                mapLink: 'https://maps.google.com/?q=28.6139,77.2090',
                latitude: '28.6139',
                longitude: '77.2090'
            },
            {
                buildingId: 'BLD1002',
                name: 'Green Valley Residences',
                frontRoad: '40 ft Wide Road',
                parkingArea: '8,000 sq ft',
                description: 'Eco-friendly residential complex with sustainable features and green spaces.',
                areaUSP: 'Solar powered and rainwater harvesting',
                ownerName: 'Green Earth Builders',
                ownerId: 'DEV002',
                storey: '10',
                age: 'New Construction',
                type: 'Residential',
                luda: 'Standard',
                totalProperties: '40',
                developmentStatus: 'Upcoming',
                allowPreBooking: true,
                allocatedProperties: '0',
                freeProperties: '40',
                contactNumber: '+91 9876543211',
                numberOfFlatsAvailable: 40,
                totalFloors: 10,
                brochureLink: 'https://example.com/green-valley.pdf',
                mapLink: 'https://maps.google.com/?q=28.7041,77.1025',
                latitude: '28.7041',
                longitude: '77.1025'
            },
            {
                buildingId: 'BLD1003',
                name: 'Diamond Business Tower',
                frontRoad: '80 ft Wide Road',
                parkingArea: '15,000 sq ft',
                description: 'Premium commercial complex with state-of-the-art facilities for businesses.',
                areaUSP: 'Prime business district location',
                ownerName: 'Diamond Properties',
                ownerId: 'DEV003',
                storey: '25',
                age: 'New Construction',
                type: 'Commercial',
                luda: 'Premium',
                totalProperties: '100',
                developmentStatus: 'Ready',
                allowPreBooking: false,
                allocatedProperties: '70',
                freeProperties: '30',
                contactNumber: '+91 9876543212',
                numberOfFlatsAvailable: 30,
                totalFloors: 25,
                brochureLink: 'https://example.com/diamond-tower.pdf',
                mapLink: 'https://maps.google.com/?q=28.5355,77.2511',
                latitude: '28.5355',
                longitude: '77.2511'
            }
        ];

        const selectedData = dummyDatasets[datasetIndex] || dummyDatasets[0];

        setFormData(prev => ({
            ...prev,
            ...selectedData
        }));

        if (selectedData.latitude && selectedData.longitude) {
            setLatitude(selectedData.latitude);
            setLongitude(selectedData.longitude);
        }

        // Generate dummy flats details
        if (selectedData.totalFloors > 0) {
            const dummyFlatsDetails = [];
            for (let i = 1; i <= selectedData.totalFloors; i++) {
                const flatsOnFloor = Math.floor(Math.random() * 6) + 2; // Random 2-8 flats per floor
                const availableFlats = Math.floor(Math.random() * (flatsOnFloor + 1)); // Random available flats (0 to flatsOnFloor)

                dummyFlatsDetails.push({
                    floorNumber: i,
                    flatsOnFloor,
                    availableFlats
                });
            }
            setFlatsDetails(dummyFlatsDetails);
        }

        setFormTouched(true);
    };

    // Render form
    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
                <nav className="flex flex-wrap">
                    <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'basic'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Basic Information
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('location')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'location'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Location
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('flats')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'flats'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Flats Details
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'gallery'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Gallery & Links
                    </button>
                </nav>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {/* Quick Fill Options */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Fill Options</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => autofillDummyData(0)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm"
                        >
                            Residential Building
                        </button>
                        <button
                            type="button"
                            onClick={() => autofillDummyData(1)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm"
                        >
                            Eco-friendly Complex
                        </button>
                        <button
                            type="button"
                            onClick={() => autofillDummyData(2)}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm"
                        >
                            Commercial Tower
                        </button>
                    </div>
                </div>

                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Building ID*
                                </label>
                                <input
                                    type="text"
                                    id="buildingId"
                                    name="buildingId"
                                    value={formData.buildingId}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.buildingId ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.buildingId && <p className="mt-1 text-sm text-red-600">{errors.buildingId}</p>}
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name*
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="frontRoad" className="block text-sm font-medium text-gray-700 mb-1">
                                    Front Road
                                </label>
                                <input
                                    type="text"
                                    id="frontRoad"
                                    name="frontRoad"
                                    value={formData.frontRoad}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="parkingArea" className="block text-sm font-medium text-gray-700 mb-1">
                                    Parking Area
                                </label>
                                <input
                                    type="text"
                                    id="parkingArea"
                                    name="parkingArea"
                                    value={formData.parkingArea}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="areaUSP" className="block text-sm font-medium text-gray-700 mb-1">
                                    Area USP
                                </label>
                                <input
                                    type="text"
                                    id="areaUSP"
                                    name="areaUSP"
                                    value={formData.areaUSP}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Owner Name
                                </label>
                                <input
                                    type="text"
                                    id="ownerName"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Owner ID
                                </label>
                                <input
                                    type="text"
                                    id="ownerId"
                                    name="ownerId"
                                    value={formData.ownerId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="storey" className="block text-sm font-medium text-gray-700 mb-1">
                                    Storey
                                </label>
                                <input
                                    type="text"
                                    id="storey"
                                    name="storey"
                                    value={formData.storey}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                    Age
                                </label>
                                <input
                                    type="text"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="luda" className="block text-sm font-medium text-gray-700 mb-1">
                                    LUDA
                                </label>
                                <input
                                    type="text"
                                    id="luda"
                                    name="luda"
                                    value={formData.luda}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="totalProperties" className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Properties
                                </label>
                                <input
                                    type="number"
                                    id="totalProperties"
                                    name="totalProperties"
                                    value={formData.totalProperties}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.totalProperties ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.totalProperties && (
                                    <p className="mt-1 text-sm text-red-600">{errors.totalProperties}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="developmentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                    Development Status
                                </label>
                                <select
                                    id="developmentStatus"
                                    name="developmentStatus"
                                    value={formData.developmentStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Under Construction">Under Construction</option>
                                    <option value="Ready">Ready</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center h-full">
                                    <input
                                        type="checkbox"
                                        id="allowPreBooking"
                                        name="allowPreBooking"
                                        checked={formData.allowPreBooking}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="allowPreBooking" className="ml-2 block text-sm text-gray-700">
                                        Allow Pre-Booking
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="allocatedProperties" className="block text-sm font-medium text-gray-700 mb-1">
                                    Allocated Properties
                                </label>
                                <input
                                    type="number"
                                    id="allocatedProperties"
                                    name="allocatedProperties"
                                    value={formData.allocatedProperties}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.allocatedProperties ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.allocatedProperties && (
                                    <p className="mt-1 text-sm text-red-600">{errors.allocatedProperties}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="freeProperties" className="block text-sm font-medium text-gray-700 mb-1">
                                    Free Properties
                                </label>
                                <input
                                    type="number"
                                    id="freeProperties"
                                    name="freeProperties"
                                    value={formData.freeProperties}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.freeProperties ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.freeProperties && (
                                    <p className="mt-1 text-sm text-red-600">{errors.freeProperties}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                    <div className="space-y-6">
                        <GoogleMapComponent
                            latitude={latitude}
                            longitude={longitude}
                            onLocationChange={handleLocationChange}
                            height="400px"
                        />

                        {(errors.latitude || errors.longitude) && (
                            <div className="text-sm text-red-600 mt-1">
                                {errors.latitude || errors.longitude}
                            </div>
                        )}
                    </div>
                )}

                {/* Flats Details Tab */}
                {activeTab === 'flats' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="numberOfFlatsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Flats Available
                                </label>
                                <input
                                    type="number"
                                    id="numberOfFlatsAvailable"
                                    name="numberOfFlatsAvailable"
                                    value={formData.numberOfFlatsAvailable}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.numberOfFlatsAvailable ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.numberOfFlatsAvailable && (
                                    <p className="mt-1 text-sm text-red-600">{errors.numberOfFlatsAvailable}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Number of Floors
                                </label>
                                <input
                                    type="number"
                                    id="totalFloors"
                                    name="totalFloors"
                                    value={formData.totalFloors}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.totalFloors ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.totalFloors && (
                                    <p className="mt-1 text-sm text-red-600">{errors.totalFloors}</p>
                                )}
                            </div>
                        </div>

                        <FlatsDetailsForm
                            totalFloors={Number(formData.totalFloors) || 0}
                            flatsDetails={flatsDetails}
                            onChange={handleFlatsDetailsChange}
                        />
                    </div>
                )}

                {/* Gallery & Links Tab */}
                {activeTab === 'gallery' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Gallery Images</h3>
                        <GalleryUpload
                            existingImages={gallery}
                            onChange={handleGalleryChange}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label htmlFor="brochureLink" className="block text-sm font-medium text-gray-700 mb-1">
                                    Brochure Link
                                </label>
                                <input
                                    type="url"
                                    id="brochureLink"
                                    name="brochureLink"
                                    value={formData.brochureLink}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/brochure.pdf"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="mapLink" className="block text-sm font-medium text-gray-700 mb-1">
                                    Map Link
                                </label>
                                <input
                                    type="url"
                                    id="mapLink"
                                    name="mapLink"
                                    value={formData.mapLink}
                                    onChange={handleInputChange}
                                    placeholder="https://maps.google.com/?q=..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap justify-end gap-3">
                    {onSaveDraft && (
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={!formTouched || isSaving}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save as Draft'}
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || isSaving}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BuildingForm;