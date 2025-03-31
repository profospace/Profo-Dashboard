import React,{ useState , useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// import { base_url } from "../../../utils/base_url";
import LocationMap from './LocationMap';
const ProjectForm = ({ projectData, isEditing, onSubmit, onReset, onChange, loading, builders = [] }) => {
    // Initialize form data from props or default values
    const [formData, setFormData] = useState({
        name: '',
        type: 'RESIDENTIAL',
        status: 'UPCOMING',
        builder: '',
        reraNumber: '',
        reravalidity: '',
        description: '',
        overview: {
            totalUnits: '',
            totalTowers: '',
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
        offer: [],
        propertyType: []
    });

    const [selectedAmenity, setSelectedAmenity] = useState('');
    const [newOfferTag, setNewOfferTag] = useState('');
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [floorPlanFiles, setFloorPlanFiles] = useState({});

    // Populate form when projectData changes (when editing)
    useEffect(() => {
        if (projectData) {
            setFormData(prev => ({
                ...prev,
                ...projectData
            }));
        }
    }, [projectData]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested fields
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
            // Handle top-level fields
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Notify parent of form changes
    useEffect(() => {
        if (onChange) {
            onChange(formData);
        }
    }, [formData, onChange]);

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
    };

    // Add a floor plan
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
                    image: ''
                }
            ]
        }));
    };

    // Remove a floor plan
    const removeFloorPlan = (index) => {
        const updatedPlans = [...formData.floorPlans];
        updatedPlans.splice(index, 1);

        // Also remove any associated file
        const updatedFiles = { ...floorPlanFiles };
        delete updatedFiles[index];
        setFloorPlanFiles(updatedFiles);

        setFormData(prev => ({
            ...prev,
            floorPlans: updatedPlans
        }));
    };

    // Handle floor plan changes
    const handleFloorPlanChange = (index, field, value) => {
        const updatedPlans = [...formData.floorPlans];
        updatedPlans[index][field] = value;

        setFormData(prev => ({
            ...prev,
            floorPlans: updatedPlans
        }));
    };

    // Handle floor plan image upload
    const handleFloorPlanImageChange = (index, files) => {
        if (files && files.length > 0) {
            // Store the file for later submission
            setFloorPlanFiles(prev => ({
                ...prev,
                [index]: files[0]
            }));

            // Create a preview URL
            const imageUrl = URL.createObjectURL(files[0]);

            const updatedPlans = [...formData.floorPlans];
            updatedPlans[index].image = imageUrl;

            setFormData(prev => ({
                ...prev,
                floorPlans: updatedPlans
            }));
        }
    };

    // Add an amenity category
    const addAmenity = () => {
        if (!selectedAmenity.trim()) return;

        // Check if this amenity category already exists
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
    };

    // Add amenity item
    const addAmenityItem = (categoryIndex) => {
        const newItem = prompt('Enter amenity item:');

        if (!newItem || !newItem.trim()) return;

        const updatedAmenities = [...formData.amenities];
        updatedAmenities[categoryIndex].items.push(newItem.trim());

        setFormData(prev => ({
            ...prev,
            amenities: updatedAmenities
        }));
    };

    // Remove amenity category
    const removeAmenityCategory = (index) => {
        const updatedAmenities = [...formData.amenities];
        updatedAmenities.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            amenities: updatedAmenities
        }));
    };

    // Remove amenity item
    const removeAmenityItem = (categoryIndex, itemIndex) => {
        const updatedAmenities = [...formData.amenities];
        updatedAmenities[categoryIndex].items.splice(itemIndex, 1);

        setFormData(prev => ({
            ...prev,
            amenities: updatedAmenities
        }));
    };

    // Add offer tag
    const addOfferTag = () => {
        if (!newOfferTag.trim()) return;

        if (!formData.offer.includes(newOfferTag.trim())) {
            setFormData(prev => ({
                ...prev,
                offer: [...prev.offer, newOfferTag.trim()]
            }));

            setNewOfferTag('');
        } else {
            toast.error('This offer tag already exists');
        }
    };

    // Remove offer tag
    const removeOfferTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            offer: prev.offer.filter(t => t !== tag)
        }));
    };

    // Add property type
    const handlePropertyTypeChange = (type) => {
        const updatedTypes = formData.propertyType.includes(type)
            ? formData.propertyType.filter(t => t !== type)
            : [...formData.propertyType, type];

        setFormData(prev => ({
            ...prev,
            propertyType: updatedTypes
        }));
    };

    // Add highlight
    const addHighlight = () => {
        setFormData(prev => ({
            ...prev,
            highlights: [
                ...prev.highlights,
                { title: '', description: '', icon: '' }
            ]
        }));
    };

    // Update highlight
    const updateHighlight = (index, field, value) => {
        const updatedHighlights = [...formData.highlights];
        updatedHighlights[index][field] = value;

        setFormData(prev => ({
            ...prev,
            highlights: updatedHighlights
        }));
    };

    // Remove highlight
    const removeHighlight = (index) => {
        const updatedHighlights = [...formData.highlights];
        updatedHighlights.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            highlights: updatedHighlights
        }));
    };

    // Handle gallery file uploads
    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(prevFiles => [...prevFiles, ...files]);
    };

    // Remove gallery file
    const removeGalleryFile = (index) => {
        setGalleryFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type*</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="RESIDENTIAL">Residential</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="MIXED_USE">Mixed Use</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="UPCOMING">Upcoming</option>
                            <option value="UNDER_CONSTRUCTION">Under Construction</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Builder*</label>
                        <select
                            name="builder"
                            value={formData.builder}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Builder</option>
                            {builders.map(builder => (
                                <option key={builder._id} value={builder._id}>
                                    {builder.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RERA Number*</label>
                        <input
                            type="text"
                            name="reraNumber"
                            value={formData.reraNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter RERA registration number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RERA Validity*</label>
                        <input
                            type="text"
                            name="reravalidity"
                            value={formData.reravalidity}
                            onChange={handleChange}
                            required
                            placeholder="Enter RERA validity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Tags</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newOfferTag}
                                onChange={(e) => setNewOfferTag(e.target.value)}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add offer tag"
                            />
                            <button
                                type="button"
                                onClick={addOfferTag}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.offer.map((tag, index) => (
                                <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeOfferTag(tag)}
                                        className="ml-1 text-blue-800 hover:text-blue-900"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Types</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Apartment', 'Villa', 'Plot', 'Independent House', 'Shop', 'Office'].map((type) => (
                                <div key={type} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`type-${type}`}
                                        checked={formData.propertyType.includes(type)}
                                        onChange={() => handlePropertyTypeChange(type)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Project Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                        <input
                            type="number"
                            name="overview.totalUnits"
                            value={formData.overview.totalUnits}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Towers</label>
                        <input
                            type="number"
                            name="overview.totalTowers"
                            value={formData.overview.totalTowers}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Launch Date</label>
                        <input
                            type="date"
                            name="overview.launchDate"
                            value={formData.overview.launchDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Possession Date</label>
                        <input
                            type="date"
                            name="overview.possessionDate"
                            value={formData.overview.possessionDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Price (₹)</label>
                        <input
                            type="number"
                            name="overview.priceRange.min"
                            value={formData.overview.priceRange.min}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Price (₹)</label>
                        <input
                            type="number"
                            name="overview.priceRange.max"
                            value={formData.overview.priceRange.max}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per sq.ft (₹)</label>
                        <input
                            type="number"
                            name="overview.priceRange.pricePerSqFt"
                            value={formData.overview.priceRange.pricePerSqFt}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                        <input
                            type="text"
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleChange}
                            required
                            placeholder="Full address of the project"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                        <input
                            type="text"
                            name="location.landmark"
                            value={formData.location.landmark}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                        <input
                            type="text"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                        <input
                            type="text"
                            name="location.state"
                            value={formData.location.state}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input
                            type="text"
                            name="location.pincode"
                            value={formData.location.pincode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location on Map</label>
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

            {/* Floor Plans Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Floor Plans</h3>

                {formData.floorPlans.map((plan, index) => (
                    <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">Floor Plan {index + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removeFloorPlan(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => handleFloorPlanChange(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <input
                                    type="text"
                                    value={plan.type}
                                    onChange={(e) => handleFloorPlanChange(index, 'type', e.target.value)}
                                    placeholder="e.g., 2BHK, 3BHK"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                <input
                                    type="number"
                                    value={plan.bedrooms}
                                    onChange={(e) => handleFloorPlanChange(index, 'bedrooms', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                <input
                                    type="number"
                                    value={plan.bathrooms}
                                    onChange={(e) => handleFloorPlanChange(index, 'bathrooms', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Super Area (sq.ft)</label>
                                <input
                                    type="number"
                                    value={plan.superArea}
                                    onChange={(e) => handleFloorPlanChange(index, 'superArea', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq.ft)</label>
                                <input
                                    type="number"
                                    value={plan.carpetArea}
                                    onChange={(e) => handleFloorPlanChange(index, 'carpetArea', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={plan.price}
                                    onChange={(e) => handleFloorPlanChange(index, 'price', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Floor Plan Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFloorPlanImageChange(index, e.target.files)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept="image/*"
                                />
                                {plan.image && (
                                    <div className="mt-2">
                                        <img
                                            src={plan.image}
                                            alt={`Preview of ${plan.name}`}
                                            className="h-20 object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addFloorPlan}
                    className="mt-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    Add Floor Plan
                </button>
            </div>

            {/* Amenities Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Amenities</h3>

                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={selectedAmenity}
                        onChange={(e) => setSelectedAmenity(e.target.value)}
                        placeholder="Enter amenity category"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={addAmenity}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Add Category
                    </button>
                </div>

                {formData.amenities.map((amenity, categoryIndex) => (
                    <div key={categoryIndex} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">{amenity.category}</h4>
                            <button
                                type="button"
                                onClick={() => removeAmenityCategory(categoryIndex)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove Category
                            </button>
                        </div>

                        <div className="space-y-2">
                            {amenity.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center">
                                    <span className="flex-grow">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAmenityItem(categoryIndex, itemIndex)}
                                        className="text-red-600 hover:text-red-800 ml-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addAmenityItem(categoryIndex)}
                            className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                        >
                            Add Item
                        </button>
                    </div>
                ))}
            </div>

            {/* Highlights Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Project Highlights</h3>

                {formData.highlights.map((highlight, index) => (
                    <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">Highlight {index + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removeHighlight(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={highlight.title}
                                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={highlight.description}
                                    onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                                <input
                                    type="text"
                                    value={highlight.icon}
                                    onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="URL to icon image (optional)"
                                />
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </form>
    )

}
export default ProjectForm;