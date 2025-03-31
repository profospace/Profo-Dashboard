import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { LuMapPin } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";


export default function PropertyForm({ property, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        post_title: '',
        post_description: '',
        type_name: '',
        purpose: '',
        building_id: '',
        price: '',
        priceUnit: 'INR',
        area: '',
        areaUnit: 'sqft',
        bedrooms: '',
        bathrooms: '',
        floor: '',
        furnishing: '',
        carpetArea: '',
        superBuiltupArea: '',
        available: true,
        category: '',
        region: '',
        possession: '',
        address: '',
        latitude: '',
        longitude: '',
        post_city: '',
        locality: '',
        agreement: '',
        contactList: [],
        amenities: [],
        facilities: [],
        tags: [],
        status: 'unlisted',
        viewTypes: '',
        constructionStatus: '',
        ownershipType: '',
        propertyCondition: '',
        legalStatus: '',
        negotiation: false,
        priceOnRequest: false,
        property_owner_name: ''
    });

    const [contactInput, setContactInput] = useState('');
    const [mapInitialized, setMapInitialized] = useState(false);
    const [previewImages, setPreviewImages] = useState({
        post_image: null,
        floor_plan_image: null,
        gallery_images: []
    });

    // References
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);

    // Options for select fields
    const propertyTypes = ["Apartment", "House", "Villa", "Office", "Shop", "Warehouse", "Land", "Plot", "PG/Co-Living", "Commercial Land"];
    const purposes = ["Buy", "Rent"];
    const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
    const possessionOptions = ["Ready to Move", "Under Construction", "3 Months", "6 Months", "1 Year", "1+ Years"];
    const viewTypes = ["City View", "Sea View", "Mountain View", "Garden View", "Pool View", "Lake View"];
    const constructionStatuses = ["Ready to Move", "Under Construction", "New Launch", "Resale"];
    const ownershipTypes = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
    const propertyConditions = ["Brand New", "Fully Furnished", "Semi Furnished", "Unfurnished", "Ready to Move"];
    const legalStatuses = ["Clear Title", "Disputed", "Encumbrance", "Litigation", "Mortgaged"];
    const statusOptions = ["listed", "unlisted", "payment-pending", "suspicious"];

    // Amenities and facilities for multi-select
    const amenitiesOptions = [
        "Swimming Pool", "Gym", "Garden", "Club House", "Children's Play Area",
        "24x7 Security", "Power Backup", "Lift", "Car Parking", "Visitor Parking",
        "Gated Community", "Basketball Court", "Tennis Court", "Jogging Track",
        "Indoor Games", "Maintenance Staff", "Water Storage", "RO Water System"
    ];

    const facilitiesOptions = [
        "Hospital", "School", "ATM", "Bank", "Park", "Restaurant", "Shopping Mall",
        "Supermarket", "Petrol Pump", "Metro Station", "Bus Stop", "Airport",
        "Railway Station", "Pharmacy", "Mosque", "Temple", "Church"
    ];

    const tagsOptions = [
        "Best Deal", "Luxury", "Pet Friendly", "Senior Living", "Student Accommodation",
        "Near Transportation", "Near Schools", "Near Market", "Investment Opportunity",
        "Hot Property", "Newly Listed", "Price Reduced", "Negotiable", "Ready to Move"
    ];

    useEffect(() => {
        // If property is provided for editing, initialize form with its values
        if (property) {
            const propertyData = { ...property };

            // Convert any arrays that might be strings back to arrays
            if (typeof propertyData.contactList === 'string') {
                propertyData.contactList = propertyData.contactList.split(',').map(item => item.trim());
            }

            if (typeof propertyData.amenities === 'string') {
                propertyData.amenities = propertyData.amenities.split(',').map(item => item.trim());
            }

            if (typeof propertyData.facilities === 'string') {
                propertyData.facilities = propertyData.facilities.split(',').map(item => item.trim());
            }

            if (typeof propertyData.tags === 'string') {
                propertyData.tags = propertyData.tags.split(',').map(item => item.trim());
            }

            setFormData({
                ...formData,
                ...propertyData
            });

            // Set preview images if available
            if (property.post_image) {
                setPreviewImages(prev => ({
                    ...prev,
                    post_image: property.post_image
                }));
            }

            if (property.floor_plan_image) {
                setPreviewImages(prev => ({
                    ...prev,
                    floor_plan_image: property.floor_plan_image
                }));
            }

            if (property.galleryList && property.galleryList.length > 0) {
                setPreviewImages(prev => ({
                    ...prev,
                    gallery_images: property.galleryList
                }));
            }
        }
    }, [property]);

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
            }

            // Autocomplete for address
            const addressInput = document.getElementById('address');
            const autocomplete = new window.google.maps.places.Autocomplete(addressInput);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) return;

                // Set map location
                if (place.geometry.viewport) {
                    mapRef.current.fitBounds(place.geometry.viewport);
                } else {
                    mapRef.current.setCenter(place.geometry.location);
                    mapRef.current.setZoom(17);
                }

                // Update marker and form fields
                placeMarker(place.geometry.location);

                // Extract city and locality from the place
                let city = '';
                let locality = '';

                place.address_components.forEach(component => {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    } else if (component.types.includes('sublocality_level_1') ||
                        component.types.includes('sublocality')) {
                        locality = component.long_name;
                    }
                });

                // Update form data with address details
                setFormData(prev => ({
                    ...prev,
                    address: place.formatted_address,
                    post_city: city || prev.post_city,
                    locality: locality || prev.locality
                }));
            });

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

                    // Reverse geocode to get address
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            const place = results[0];

                            // Extract city and locality
                            let city = '';
                            let locality = '';

                            place.address_components.forEach(component => {
                                if (component.types.includes('locality')) {
                                    city = component.long_name;
                                } else if (component.types.includes('sublocality_level_1') ||
                                    component.types.includes('sublocality')) {
                                    locality = component.long_name;
                                }
                            });

                            setFormData(prev => ({
                                ...prev,
                                address: place.formatted_address,
                                post_city: city || prev.post_city,
                                locality: locality || prev.locality
                            }));
                        }
                    });
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

    const handleMultiSelectChange = (e) => {
        const { name } = e.target;
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, [name]: selectedOptions });
    };

    const handleAddContact = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();

            if (!contactInput.trim()) return;

            const contact = contactInput.trim();
            if (!/^\d+$/.test(contact)) {
                toast.error('Contact number should only contain digits');
                return;
            }

            if (formData.contactList.includes(contact)) {
                toast.error('This contact is already added');
                return;
            }

            setFormData({
                ...formData,
                contactList: [...formData.contactList, contact]
            });

            setContactInput('');
        }
    };

    const handleRemoveContact = (contactToRemove) => {
        setFormData({
            ...formData,
            contactList: formData.contactList.filter(contact => contact !== contactToRemove)
        });
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;

        // Update form data with the file(s)
        if (name === 'gallery_images') {
            setFormData(prev => ({
                ...prev,
                [name]: files
            }));

            // Create preview URLs
            const previewURLs = [];
            for (let i = 0; i < files.length; i++) {
                previewURLs.push(URL.createObjectURL(files[i]));
            }

            setPreviewImages(prev => ({
                ...prev,
                [name]: previewURLs
            }));
        } else {
            // For single image fields
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));

            if (files.length > 0) {
                setPreviewImages(prev => ({
                    ...prev,
                    [name]: URL.createObjectURL(files[0])
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.post_title) {
            toast.error('Property title is required');
            return;
        }

        if (!formData.type_name) {
            toast.error('Property type is required');
            return;
        }

        if (!formData.purpose) {
            toast.error('Purpose (Buy/Rent) is required');
            return;
        }

        if (!formData.price && !formData.priceOnRequest) {
            toast.error('Price is required unless "Price on Request" is checked');
            return;
        }

        if (!formData.area) {
            toast.error('Area is required');
            return;
        }

        if (!formData.address) {
            toast.error('Address is required');
            return;
        }

        if (!formData.post_description) {
            toast.error('Description is required');
            return;
        }

        if (formData.contactList.length === 0) {
            toast.error('At least one contact number is required');
            return;
        }

        try {
            // Submit the form
            await onSubmit(formData);

            // Reset form if it's not an edit (new property)
            if (!property) {
                setFormData({
                    post_title: '',
                    post_description: '',
                    type_name: '',
                    purpose: '',
                    building_id: '',
                    price: '',
                    priceUnit: 'INR',
                    area: '',
                    areaUnit: 'sqft',
                    bedrooms: '',
                    bathrooms: '',
                    floor: '',
                    furnishing: '',
                    carpetArea: '',
                    superBuiltupArea: '',
                    available: true,
                    category: '',
                    region: '',
                    possession: '',
                    address: '',
                    latitude: '',
                    longitude: '',
                    post_city: '',
                    locality: '',
                    agreement: '',
                    contactList: [],
                    amenities: [],
                    facilities: [],
                    tags: [],
                    status: 'unlisted',
                    viewTypes: '',
                    constructionStatus: '',
                    ownershipType: '',
                    propertyCondition: '',
                    legalStatus: '',
                    negotiation: false,
                    priceOnRequest: false,
                    property_owner_name: ''
                });

                setPreviewImages({
                    post_image: null,
                    floor_plan_image: null,
                    gallery_images: []
                });

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
                            <label htmlFor="post_title" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Title*
                            </label>
                            <input
                                type="text"
                                id="post_title"
                                name="post_title"
                                value={formData.post_title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="property_owner_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Owner Name
                            </label>
                            <input
                                type="text"
                                id="property_owner_name"
                                name="property_owner_name"
                                value={formData.property_owner_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="post_city" className="block text-sm font-medium text-gray-700 mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                id="post_city"
                                name="post_city"
                                value={formData.post_city}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                                Locality*
                            </label>
                            <input
                                type="text"
                                id="locality"
                                name="locality"
                                value={formData.locality}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="type_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Type*
                            </label>
                            <select
                                id="type_name"
                                name="type_name"
                                value={formData.type_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Type</option>
                                {propertyTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                Purpose*
                            </label>
                            <select
                                id="purpose"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Purpose</option>
                                {purposes.map(purpose => (
                                    <option key={purpose} value={purpose}>
                                        {purpose}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="building_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Building ID
                            </label>
                            <input
                                type="text"
                                id="building_id"
                                name="building_id"
                                value={formData.building_id}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Price and Area Information */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Price and Area Information</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="priceOnRequest"
                                    name="priceOnRequest"
                                    checked={formData.priceOnRequest}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="priceOnRequest" className="ml-2 block text-sm text-gray-700">
                                    Price On Request
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="negotiation"
                                    name="negotiation"
                                    checked={formData.negotiation}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="negotiation" className="ml-2 block text-sm text-gray-700">
                                    Negotiable
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price{!formData.priceOnRequest && '*'}
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required={!formData.priceOnRequest}
                                disabled={formData.priceOnRequest}
                            />
                        </div>

                        <div>
                            <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                Price Unit
                            </label>
                            <input
                                type="text"
                                id="priceUnit"
                                name="priceUnit"
                                value={formData.priceUnit}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                Area*
                            </label>
                            <input
                                type="number"
                                id="area"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="areaUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                Area Unit
                            </label>
                            <input
                                type="text"
                                id="areaUnit"
                                name="areaUnit"
                                value={formData.areaUnit}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="carpetArea" className="block text-sm font-medium text-gray-700 mb-1">
                                Carpet Area
                            </label>
                            <input
                                type="number"
                                id="carpetArea"
                                name="carpetArea"
                                value={formData.carpetArea}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="superBuiltupArea" className="block text-sm font-medium text-gray-700 mb-1">
                                Super Built-up Area
                            </label>
                            <input
                                type="number"
                                id="superBuiltupArea"
                                name="superBuiltupArea"
                                value={formData.superBuiltupArea}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Property Details</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                Bedrooms
                            </label>
                            <input
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                min="0"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                Bathrooms
                            </label>
                            <input
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                min="0"
                                value={formData.bathrooms}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                                Floor
                            </label>
                            <input
                                type="text"
                                id="floor"
                                name="floor"
                                value={formData.floor}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700 mb-1">
                                Furnishing
                            </label>
                            <select
                                id="furnishing"
                                name="furnishing"
                                value={formData.furnishing}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Furnishing</option>
                                {furnishingOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="possession" className="block text-sm font-medium text-gray-700 mb-1">
                                Possession
                            </label>
                            <select
                                id="possession"
                                name="possession"
                                value={formData.possession}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Possession</option>
                                {possessionOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="agreement" className="block text-sm font-medium text-gray-700 mb-1">
                                Agreement
                            </label>
                            <input
                                type="text"
                                id="agreement"
                                name="agreement"
                                value={formData.agreement}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 11 months"
                            />
                        </div>

                        <div>
                            <label htmlFor="available" className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="available"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Available</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <label htmlFor="viewTypes" className="block text-sm font-medium text-gray-700 mb-1">
                                View Type
                            </label>
                            <select
                                id="viewTypes"
                                name="viewTypes"
                                value={formData.viewTypes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select View Type</option>
                                {viewTypes.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="constructionStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                Construction Status
                            </label>
                            <select
                                id="constructionStatus"
                                name="constructionStatus"
                                value={formData.constructionStatus}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Construction Status</option>
                                {constructionStatuses.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="propertyCondition" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Condition
                            </label>
                            <select
                                id="propertyCondition"
                                name="propertyCondition"
                                value={formData.propertyCondition}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Property Condition</option>
                                {propertyConditions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="ownershipType" className="block text-sm font-medium text-gray-700 mb-1">
                                Ownership Type
                            </label>
                            <select
                                id="ownershipType"
                                name="ownershipType"
                                value={formData.ownershipType}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Ownership Type</option>
                                {ownershipTypes.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="legalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                Legal Status
                            </label>
                            <select
                                id="legalStatus"
                                name="legalStatus"
                                value={formData.legalStatus}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Legal Status</option>
                                {legalStatuses.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Address*
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

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
                </div>

                {/* Contact Information */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="contactInput" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Numbers*
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    id="contactInput"
                                    value={contactInput}
                                    onChange={(e) => setContactInput(e.target.value)}
                                    onKeyPress={handleAddContact}
                                    placeholder="Type and press Enter to add"
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddContact}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.contactList.map((contact, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm"
                                    >
                                        {contact}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveContact(contact)}
                                            className="ml-1 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                                        >
                                            <RxCross2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>

                    <div>
                        <label htmlFor="post_description" className="block text-sm font-medium text-gray-700 mb-1">
                            Property Description*
                        </label>
                        <textarea
                            id="post_description"
                            name="post_description"
                            value={formData.post_description}
                            onChange={handleInputChange}
                            rows="5"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Features & Amenities */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Features & Amenities</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
                                Amenities
                            </label>
                            <select
                                id="amenities"
                                name="amenities"
                                multiple
                                value={formData.amenities}
                                onChange={handleMultiSelectChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                size="6"
                            >
                                {amenitiesOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        <div>
                            <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-1">
                                Facilities
                            </label>
                            <select
                                id="facilities"
                                name="facilities"
                                multiple
                                value={formData.facilities}
                                onChange={handleMultiSelectChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                size="6"
                            >
                                {facilitiesOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                Tags
                            </label>
                            <select
                                id="tags"
                                name="tags"
                                multiple
                                value={formData.tags}
                                onChange={handleMultiSelectChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                size="6"
                            >
                                {tagsOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="post_image" className="block text-sm font-medium text-gray-700 mb-1">
                                Main Image*
                            </label>
                            <input
                                type="file"
                                id="post_image"
                                name="post_image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required={!property}
                            />
                            {previewImages.post_image && (
                                <div className="mt-2">
                                    <img
                                        src={previewImages.post_image}
                                        alt="Main"
                                        className="h-40 w-auto object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="floor_plan_image" className="block text-sm font-medium text-gray-700 mb-1">
                                Floor Plan Image
                            </label>
                            <input
                                type="file"
                                id="floor_plan_image"
                                name="floor_plan_image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {previewImages.floor_plan_image && (
                                <div className="mt-2">
                                    <img
                                        src={previewImages.floor_plan_image}
                                        alt="Floor Plan"
                                        className="h-40 w-auto object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700 mb-1">
                                Gallery Images
                            </label>
                            <input
                                type="file"
                                id="gallery_images"
                                name="gallery_images"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />

                            {Array.isArray(previewImages.gallery_images) && previewImages.gallery_images.length > 0 && (
                                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {previewImages.gallery_images.map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            alt={`Gallery ${index + 1}`}
                                            className="h-32 w-full object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
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
                        {property ? 'Update Property' : 'Add Property'}
                    </button>
                </div>
            </form>
        </div>
    );
}