import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { LuMapPin } from "react-icons/lu";

export default function BuildingForm({ building, onSubmit, onCancel }) {
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
        latitude: '',
        longitude: '',
        brochureLink: '',
        mapLink: '',
        numberOfFlatsAvailable: 0,
        totalFloors: 0,
        flatsDetails: []
    });

    const [mapInitialized, setMapInitialized] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);

    // References
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);

    // Building types and development statuses for dropdowns
    const buildingTypes = [
        "Residential Apartment",
        "Commercial Complex",
        "Mixed Use",
        "Office Building",
        "Retail Mall",
        "Industrial",
        "Villa/Townhouse Complex",
        "Co-working Space"
    ];

    const developmentStatuses = [
        "Ready",
        "Under Construction",
        "Upcoming"
    ];

    useEffect(() => {
        // If building is provided for editing, initialize form with its values
        if (building) {
            const buildingData = { ...building };

            // Handle flatsDetails if it exists
            if (!buildingData.flatsDetails || !Array.isArray(buildingData.flatsDetails)) {
                buildingData.flatsDetails = [];

                // Create default flatsDetails based on totalFloors
                if (buildingData.totalFloors) {
                    for (let i = 1; i <= buildingData.totalFloors; i++) {
                        buildingData.flatsDetails.push({
                            floorNumber: i,
                            flatsOnFloor: 0,
                            availableFlats: 0
                        });
                    }
                }
            }

            setFormData({
                ...formData,
                ...buildingData
            });

            // Set preview images if available
            if (building.galleryList && building.galleryList.length > 0) {
                setPreviewImages(building.galleryList);
            }
        }
    }, [building]);

    useEffect(() => {
        // Initialize Google Maps when component mounts
        if (window.google && !mapInitialized) {
            initializeMap();
        } else if (!window.google) {
            // If Google Maps API is not loaded, load it
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.GOOGLE_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        }
    }, [mapInitialized]);

    const initializeMap = () => {
        if (mapContainerRef.current) {
            // Default center (India)
            const defaultCenter = { lat: 20.5937, lng: 78.9629 };

            // Create the map
            mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
                center: defaultCenter,
                zoom: 5,
                mapTypeControl: true,
                streetViewControl: false
            });

            // Create the marker
            markerRef.current = new window.google.maps.Marker({
                map: mapRef.current,
                draggable: true,
                animation: window.google.maps.Animation.DROP
            });

            // Add click event to map
            mapRef.current.addListener('click', (event) => {
                placeMarker(event.latLng);
            });

            // Add drag end event to marker
            markerRef.current.addListener('dragend', (event) => {
                updateLatLng(event.latLng);
            });

            // If we have coordinates from form data, set the marker
            if (formData.latitude && formData.longitude) {
                const position = new window.google.maps.LatLng(
                    parseFloat(formData.latitude),
                    parseFloat(formData.longitude)
                );
                placeMarker(position);
                mapRef.current.setZoom(15);
            } else if (formData.location && formData.location.coordinates) {
                // Handle GeoJSON format
                const [lng, lat] = formData.location.coordinates;
                const position = new window.google.maps.LatLng(lat, lng);
                placeMarker(position);
                mapRef.current.setZoom(15);
            }

            setMapInitialized(true);
        }
    };

    const placeMarker = (location) => {
        if (markerRef.current && mapRef.current) {
            markerRef.current.setPosition(location);
            mapRef.current.panTo(location);
            updateLatLng(location);
        }
    };

    const updateLatLng = (location) => {
        setFormData(prev => ({
            ...prev,
            latitude: location.lat(),
            longitude: location.lng()
        }));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    const location = new window.google.maps.LatLng(pos.lat, pos.lng);

                    if (mapRef.current) {
                        mapRef.current.setCenter(location);
                        mapRef.current.setZoom(15);
                    }

                    if (markerRef.current) {
                        markerRef.current.setPosition(location);
                    }

                    updateLatLng(location);
                },
                (error) => {
                    toast.error(`Error getting location: ${error.message}`);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle checkbox inputs
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
            return;
        }

        // Handle number inputs
        if (type === 'number') {
            setFormData({ ...formData, [name]: value === '' ? '' : Number(value) });
            return;
        }

        // Handle regular inputs
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            // Save the files to the form data
            setFormData(prev => ({
                ...prev,
                galleryList: files
            }));

            // Create preview URLs
            const newPreviews = [];
            for (let i = 0; i < files.length; i++) {
                newPreviews.push(URL.createObjectURL(files[i]));
            }

            setPreviewImages(newPreviews);
        }
    };

    const handleTotalFloorsChange = (e) => {
        const newTotalFloors = parseInt(e.target.value) || 0;

        // Update the total floors in form data
        setFormData(prev => {
            // Create or update flatsDetails array based on the new total floors
            const newFlatsDetails = [];

            for (let i = 1; i <= newTotalFloors; i++) {
                // Try to find existing floor data
                const existingFloor = prev.flatsDetails.find(f => f.floorNumber === i);

                if (existingFloor) {
                    newFlatsDetails.push(existingFloor);
                } else {
                    newFlatsDetails.push({
                        floorNumber: i,
                        flatsOnFloor: 0,
                        availableFlats: 0
                    });
                }
            }

            return {
                ...prev,
                totalFloors: newTotalFloors,
                flatsDetails: newFlatsDetails
            };
        });
    };

    const handleFlatsDetailsChange = (floorNumber, field, value) => {
        const numValue = parseInt(value) || 0;

        setFormData(prev => {
            const newFlatsDetails = prev.flatsDetails.map(floor => {
                if (floor.floorNumber === floorNumber) {
                    return { ...floor, [field]: numValue };
                }
                return floor;
            });

            // Calculate total available flats
            const totalAvailable = newFlatsDetails.reduce(
                (sum, floor) => sum + floor.availableFlats, 0
            );

            return {
                ...prev,
                flatsDetails: newFlatsDetails,
                numberOfFlatsAvailable: totalAvailable
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.buildingId) {
            toast.error('Building ID is required');
            return;
        }

        if (!formData.name) {
            toast.error('Building name is required');
            return;
        }

        if (!formData.totalFloors) {
            toast.error('Total floors is required');
            return;
        }

        // Validate flats details
        for (const floor of formData.flatsDetails) {
            if (floor.flatsOnFloor < 0 || floor.availableFlats < 0) {
                toast.error(`Invalid data for floor ${floor.floorNumber}`);
                return;
            }

            if (floor.availableFlats > floor.flatsOnFloor) {
                toast.error(`Available flats cannot exceed total flats on floor ${floor.floorNumber}`);
                return;
            }
        }

        try {
            // Submit the form
            await onSubmit(formData);

            // Reset form if it's not an edit (new building)
            if (!building) {
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
                    latitude: '',
                    longitude: '',
                    brochureLink: '',
                    mapLink: '',
                    numberOfFlatsAvailable: 0,
                    totalFloors: 0,
                    flatsDetails: []
                });

                setPreviewImages([]);

                // Reset marker if map is initialized
                if (markerRef.current) {
                    markerRef.current.setPosition(null);
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Building Name*
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                Building Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Building Type</option>
                                {buildingTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {developmentStatuses.map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                Building Age (years)
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="areaUSP" className="block text-sm font-medium text-gray-700 mb-1">
                            Area USP (Unique Selling Points)
                        </label>
                        <textarea
                            id="areaUSP"
                            name="areaUSP"
                            rows="2"
                            value={formData.areaUSP}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Property Information */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Property Information</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-3 flex items-center">
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
                </div>

                {/* Location Information */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location Coordinates
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    id="latitude"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    placeholder="Latitude"
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    id="longitude"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    placeholder="Longitude"
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    readOnly
                                />
                            </div>
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <LuMapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    Get Current Location
                                </button>
                            </div>
                        </div>

                        <div className="h-64 md:h-auto flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Map
                            </label>
                            <div
                                ref={mapContainerRef}
                                className="flex-grow min-h-[200px] border border-gray-300 rounded-md"
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Flats Details */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Flats Details</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Floors*
                                </label>
                                <input
                                    type="number"
                                    id="totalFloors"
                                    name="totalFloors"
                                    value={formData.totalFloors}
                                    onChange={handleTotalFloorsChange}
                                    min="0"
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="numberOfFlatsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Available Flats
                                </label>
                                <input
                                    type="number"
                                    id="numberOfFlatsAvailable"
                                    name="numberOfFlatsAvailable"
                                    value={formData.numberOfFlatsAvailable}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Calculated from floor details below
                                </p>
                            </div>
                        </div>

                        {formData.totalFloors > 0 && (
                            <div className="mt-4">
                                <h3 className="text-md font-medium text-gray-800 mb-2">Floor Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {formData.flatsDetails.map((floor) => (
                                        <div key={floor.floorNumber} className="border border-gray-200 rounded-md p-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Floor {floor.floorNumber}
                                            </h4>

                                            <div className="space-y-3">
                                                <div>
                                                    <label
                                                        htmlFor={`flatsOnFloor-${floor.floorNumber}`}
                                                        className="block text-xs font-medium text-gray-700 mb-1"
                                                    >
                                                        Total Flats on Floor
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`flatsOnFloor-${floor.floorNumber}`}
                                                        value={floor.flatsOnFloor}
                                                        onChange={(e) => handleFlatsDetailsChange(floor.floorNumber, 'flatsOnFloor', e.target.value)}
                                                        min="0"
                                                        className="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`availableFlats-${floor.floorNumber}`}
                                                        className="block text-xs font-medium text-gray-700 mb-1"
                                                    >
                                                        Available Flats
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`availableFlats-${floor.floorNumber}`}
                                                        value={floor.availableFlats}
                                                        onChange={(e) => handleFlatsDetailsChange(floor.floorNumber, 'availableFlats', e.target.value)}
                                                        min="0"
                                                        max={floor.flatsOnFloor}
                                                        className="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Links and Resources */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Links and Resources</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Gallery Images</h2>

                    <div>
                        <label htmlFor="galleryList" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Images
                        </label>
                        <input
                            type="file"
                            id="galleryList"
                            name="galleryList"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />

                        {previewImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previewImages.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={src}
                                            alt={`Gallery ${index + 1}`}
                                            className="h-32 w-full object-cover rounded-md border border-gray-200"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {building ? 'Update Building' : 'Add Building'}
                    </button>
                </div>
            </form>
        </div>
    )
}
