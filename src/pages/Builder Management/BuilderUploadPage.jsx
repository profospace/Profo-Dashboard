import React, { useState, useRef, useEffect } from 'react';
import {
    FaPlus, FaMapMarkerAlt, FaBuilding, FaCity,
    FaPhone, FaGlobe, FaCloudUploadAlt, FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { base_url } from '../../../utils/base_url';
import MapSelector from '../../components/Builder/MapSelector';

const PREFILL_OPTIONS = [
    {
        label: 'Green Valley Builders',
        data: {
            name: 'Green Valley Builders',
            username: 'greenvalley2024',
            company: 'Green Valley Real Estate Pvt Ltd',
            logo: 'https://example.com/logo.png',
            experience: 15,
            establishedYear: 2005,
            status: 'ACTIVE',
            description: 'Leading real estate developer with sustainable and innovative housing solutions.',
            website: 'https://greenvalleybuilders.com',
            contacts: ['9876543210', 'contact@greenvalley.com'],
            address: {
                street: '123 Innovation Park',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560001'
            },
            latitude: 12.9716,
            longitude: 77.5946,
            statistics: {
                completedProjects: 25,
                ongoingProjects: 10,
                totalBuildings: 50,
                totalProperties: 500
            },
            operatingLocations: [
                { city: 'Bangalore', state: 'Karnataka' },
                { city: 'Mumbai', state: 'Maharashtra' }
            ],
            access: true
        }
    },
    {
        label: 'Urban Horizon Developers',
        data: {
            name: 'Urban Horizon Developers',
            username: 'urbanhorizon',
            company: 'Urban Horizon Construction Pvt Ltd',
            logo: 'https://example.com/urbanhorizon.png',
            experience: 10,
            establishedYear: 2010,
            status: 'ACTIVE',
            description: 'Transforming cityscapes with modern, sustainable urban developments.',
            website: 'https://urbanhorizon.com',
            contacts: ['7890123456', 'info@urbanhorizon.com'],
            address: {
                street: '456 Metro Square',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            latitude: 19.0760,
            longitude: 72.8777,
            statistics: {
                completedProjects: 18,
                ongoingProjects: 7,
                totalBuildings: 35,
                totalProperties: 350
            },
            operatingLocations: [
                { city: 'Mumbai', state: 'Maharashtra' },
                { city: 'Pune', state: 'Maharashtra' }
            ],
            access: true
        }
    },
    {
        label: 'Eco Homes Construction',
        data: {
            name: 'Eco Homes Construction',
            username: 'ecohomes',
            company: 'Eco Homes Sustainable Solutions',
            logo: 'https://example.com/ecohomes.png',
            experience: 8,
            establishedYear: 2012,
            status: 'ACTIVE',
            description: 'Pioneering eco-friendly and energy-efficient housing solutions.',
            website: 'https://ecohomesconstruction.com',
            contacts: ['8901234567', 'support@ecohomes.com'],
            address: {
                street: '789 Green Tech Park',
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500032'
            },
            latitude: 17.3850,
            longitude: 78.4867,
            statistics: {
                completedProjects: 15,
                ongoingProjects: 5,
                totalBuildings: 30,
                totalProperties: 250
            },
            operatingLocations: [
                { city: 'Hyderabad', state: 'Telangana' },
                { city: 'Chennai', state: 'Tamil Nadu' }
            ],
            access: true
        }
    }
];

const BuilderUploadPage = () => {
    const navigate = useNavigate();
    const logoInputRef = useRef(null);
    const [contactInput, setContactInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [operatingLocationInput, setOperatingLocationInput] = useState({
        city: '',
        state: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        company: '',
        logo: '',
        experience: 0,
        establishedYear: new Date().getFullYear(),
        status: 'ACTIVE',
        description: '',
        website: '',
        contacts: [],
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        latitude: null,
        longitude: null,
        statistics: {
            completedProjects: 0,
            ongoingProjects: 0,
            totalBuildings: 0,
            totalProperties: 0
        },
        operatingLocations: [],
        access: false
    });

    // Initialize with current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setFormData(prev => ({
                        ...prev,
                        latitude: location.lat,
                        longitude: location.lng
                    }));
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Default to India's center if geolocation fails
                    setFormData(prev => ({
                        ...prev,
                        latitude: 20.5937,
                        longitude: 78.9629
                    }));
                    setIsLoading(false);
                }
            );
        } else {
            // Default to India's center if geolocation not supported
            setFormData(prev => ({
                ...prev,
                latitude: 20.5937,
                longitude: 78.9629
            }));
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle nested object inputs
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (name === 'experience' || name === 'establishedYear') {
            // Convert to number for numeric inputs
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLatLngChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create an image element
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (event) => {
                img.onload = () => {
                    // Create a canvas to resize and compress the image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Maximum width and height
                    const maxWidth = 300;
                    const maxHeight = 300;

                    // Calculate the new dimensions while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas to base64 with reduced quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    // Update form data with compressed image
                    setFormData(prev => ({ ...prev, logo: compressedDataUrl }));
                };

                // Set the source of the image
                img.src = event.target.result;
            };

            // Read the file
            reader.readAsDataURL(file);
        }
    };

    const addContact = () => {
        if (contactInput.trim()) {
            setFormData(prev => ({
                ...prev,
                contacts: [...prev.contacts, contactInput.trim()]
            }));
            setContactInput('');
        }
    };

    const removeContact = (index) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index)
        }));
    };

    const addOperatingLocation = () => {
        const { city, state } = operatingLocationInput;
        if (city.trim() && state.trim()) {
            setFormData(prev => ({
                ...prev,
                operatingLocations: [
                    ...prev.operatingLocations,
                    { city: city.trim(), state: state.trim() }
                ]
            }));
            // Reset input
            setOperatingLocationInput({ city: '', state: '' });
        }
    };

    const removeOperatingLocation = (index) => {
        setFormData(prev => ({
            ...prev,
            operatingLocations: prev.operatingLocations.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${base_url}/builders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newBuilder = await response.json();
                navigate(`/builders/${newBuilder._id}`);
            } else {
                const error = await response.json();
                alert(`Failed to create builder: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create builder');
        }
    };

    const handlePrefillChange = (e) => {
        const selectedOption = PREFILL_OPTIONS.find(
            option => option.label === e.target.value
        );

        if (selectedOption) {
            setFormData(selectedOption.data);
        }
    };

    const fetchCurrentLocation = () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setFormData(prev => ({
                        ...prev,
                        latitude: location.lat,
                        longitude: location.lng
                    }));
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location");
                    setIsLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLoading(false);
        }
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
        }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto ">
            <div className="mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Upload New Builder</h1>
                    <div className="flex items-center space-x-4">
                        <select
                            onChange={handlePrefillChange}
                            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Prefill Option</option>
                            {PREFILL_OPTIONS.map((option, index) => (
                                <option key={index} value={option.label}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Builder Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Company Name</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Company Logo</label>
                        <div className="flex items-center">
                            <input
                                type="file"
                                ref={logoInputRef}
                                onChange={handleLogoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current.click()}
                                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                <FaCloudUploadAlt className="mr-2" /> Upload Logo
                            </button>
                            {formData.logo && (
                                <div className="ml-4 flex items-center">
                                    <img
                                        src={formData.logo}
                                        alt="Logo Preview"
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Location Section with Synchronized Inputs and Map */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Location</label>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-grow">
                                <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={formData.latitude || ''}
                                        onChange={(e) => handleLatLngChange('latitude', parseFloat(e.target.value))}
                                        step="any"
                                        className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={fetchCurrentLocation}
                                        disabled={isLoading}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center"
                                    >
                                        <FaMapMarkerAlt className="mr-2" />
                                        {isLoading ? 'Fetching...' : 'Fetch Location'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    value={formData.longitude || ''}
                                    onChange={(e) => handleLatLngChange('longitude', parseFloat(e.target.value))}
                                    step="any"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <MapSelector
                            onLocationSelect={handleLocationSelect}
                            initialPosition={{
                                lat: formData.latitude,
                                lng: formData.longitude
                            }}
                        />

                    </div>

                    {/* Rest of the form remains the same as previous implementation */}
                    {/* ... (previous form code) ... */}
                    {/* More Detailed Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Established Year</label>
                            <input
                                type="number"
                                name="establishedYear"
                                value={formData.establishedYear}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        ></textarea>
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Contacts</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={contactInput}
                                    onChange={(e) => setContactInput(e.target.value)}
                                    className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter contact number or email"
                                />
                                <button
                                    type="button"
                                    onClick={addContact}
                                    className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.contacts.map((contact, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
                                    >
                                        {contact}
                                        <button
                                            onClick={() => removeContact(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Operating Locations */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Operating Locations</label>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="City"
                                value={operatingLocationInput.city}
                                onChange={(e) => setOperatingLocationInput(prev => ({
                                    ...prev,
                                    city: e.target.value
                                }))}
                                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={operatingLocationInput.state}
                                onChange={(e) => setOperatingLocationInput(prev => ({
                                    ...prev,
                                    state: e.target.value
                                }))}
                                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addOperatingLocation}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.operatingLocations.map((location, index) => (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center"
                                >
                                    {`${location.city}, ${location.state}`}
                                    <button
                                        onClick={() => removeOperatingLocation(index)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Completed Projects</label>
                            <input
                                type="number"
                                name="statistics.completedProjects"
                                value={formData.statistics.completedProjects}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Ongoing Projects</label>
                            <input
                                type="number"
                                name="statistics.ongoingProjects"
                                value={formData.statistics.ongoingProjects}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    {/* More Statistics */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Total Buildings</label>
                            <input
                                type="number"
                                name="statistics.totalBuildings"
                                value={formData.statistics.totalBuildings}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Total Properties</label>
                            <input
                                type="number"
                                name="statistics.totalProperties"
                                value={formData.statistics.totalProperties}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Street</label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">City</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">State</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Pincode</label>
                            <input
                                type="text"
                                name="address.pincode"
                                value={formData.address.pincode}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Location Coordinates */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Latitude</label>
                            <input
                                type="number"
                                name="latitude"
                                value={formData.latitude || ''}
                                onChange={handleInputChange}
                                step="any"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Longitude</label>
                            <input
                                type="number"
                                name="longitude"
                                value={formData.longitude || ''}
                                onChange={handleInputChange}
                                step="any"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Access and Status */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Builder Access</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="access"
                                    checked={formData.access}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        access: e.target.checked
                                    }))}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700">
                                    {formData.access ? 'Granted' : 'Restricted'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition flex items-center justify-center"
                    >
                        <FaBuilding className="mr-2" /> Upload Builder
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuilderUploadPage;

