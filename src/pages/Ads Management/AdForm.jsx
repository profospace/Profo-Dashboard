import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const AdForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const initialFormState = {
        name: '',
        header: '',
        pagelink: '',
        imagelinks: [''],
        contact: [''],
        status: 'ACTIVE',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        priority: 0,
        type: {
            type: 'BANNER',
            width: '',
            height: '',
            delay: 0,
            fullscreen: false,
            location: {
                latitude: '',
                longitude: '',
                radius: 5
            },
            pincode: '',
            city: '',
            showAfterScroll: false,
            position: 'TOP',
            displayDuration: 10,
            showOnce: false
        },
        targeted_audience: {
            ageRange: {
                min: 18,
                max: 65
            },
            interests: [],
            gender: 'ALL'
        }
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch ad data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchAd = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${base_url}/ads/${id}`);
                    const adData = response.data.data;

                    // Format dates for form inputs
                    if (adData.startDate) {
                        adData.startDate = new Date(adData.startDate).toISOString().split('T')[0];
                    }
                    if (adData.endDate) {
                        adData.endDate = new Date(adData.endDate).toISOString().split('T')[0];
                    }

                    setFormData(adData);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to fetch ad data');
                    setLoading(false);
                }
            };

            fetchAd();
        }
    }, [id, isEditMode]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            // Handle nested properties
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Handle nested type property changes
    const handleTypeChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            // Handle doubly nested properties like location.latitude
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                type: {
                    ...prev.type,
                    [parent]: {
                        ...prev.type[parent],
                        [child]: type === 'checkbox' ? checked : value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                type: {
                    ...prev.type,
                    [name]: type === 'checkbox' ? checked : value
                }
            }));
        }
    };

    // Handle targeted audience changes
    const handleAudienceChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Handle nested properties like ageRange.min
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                targeted_audience: {
                    ...prev.targeted_audience,
                    [parent]: {
                        ...prev.targeted_audience[parent],
                        [child]: parseInt(value)
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                targeted_audience: {
                    ...prev.targeted_audience,
                    [name]: value
                }
            }));
        }
    };

    // Handle array fields (imagelinks, contact, interests)
    const handleArrayField = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field, index) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    // Handle interests array in targeted_audience
    const handleInterestChange = (index, value) => {
        const newInterests = [...formData.targeted_audience.interests];
        newInterests[index] = value;
        setFormData(prev => ({
            ...prev,
            targeted_audience: {
                ...prev.targeted_audience,
                interests: newInterests
            }
        }));
    };

    const addInterest = () => {
        setFormData(prev => ({
            ...prev,
            targeted_audience: {
                ...prev.targeted_audience,
                interests: [...prev.targeted_audience.interests, '']
            }
        }));
    };

    const removeInterest = (index) => {
        const newInterests = [...formData.targeted_audience.interests];
        newInterests.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            targeted_audience: {
                ...prev.targeted_audience,
                interests: newInterests
            }
        }));
    };

    // Handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');
    //     setSuccess('');

    //     try {
    //         // Format the data for submission
    //         const submissionData = { ...formData };

    //         // Convert string numbers to actual numbers for relevant fields
    //         if (submissionData.type.location.latitude) {
    //             submissionData.type.location.latitude = parseFloat(submissionData.type.location.latitude);
    //         }
    //         if (submissionData.type.location.longitude) {
    //             submissionData.type.location.longitude = parseFloat(submissionData.type.location.longitude);
    //         }
    //         if (submissionData.type.location.radius) {
    //             submissionData.type.location.radius = parseFloat(submissionData.type.location.radius);
    //         }
    //         if (submissionData.type.delay) {
    //             submissionData.type.delay = parseInt(submissionData.type.delay);
    //         }
    //         if (submissionData.type.displayDuration) {
    //             submissionData.type.displayDuration = parseInt(submissionData.type.displayDuration);
    //         }
    //         if (submissionData.priority) {
    //             submissionData.priority = parseInt(submissionData.priority);
    //         }

    //         // Submit data
    //         if (isEditMode) {
    //             await axios.put(`${base_url}/ads/${id}`, submissionData);
    //             setSuccess('Ad updated successfully!');
    //         } else {
    //             await axios.post(`${base_url}/ads/`, submissionData);
    //             setSuccess('Ad created successfully!');
    //             setFormData(initialFormState); // Reset form after successful creation
    //         }

    //         // Redirect to ads list after short delay
    //         setTimeout(() => {
    //             navigate('/ads');
    //         }, 2000);

    //     } catch (err) {
    //         setError(err.response?.data?.message || 'Error submitting the form');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // In handleSubmit function, modify to ensure only Ad schema fields are sent

    // Update handleSubmit function in AdForm.jsx
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Format the data for submission - only include fields from the Ad schema
            const submissionData = {
                name: formData.name,
                header: formData.header,
                pagelink: formData.pagelink,
                imagelinks: formData.imagelinks,
                contact: formData.contact,
                status: formData.status,
                startDate: formData.startDate,
                endDate: formData.endDate,
                priority: parseInt(formData.priority) || 0,
                type: {
                    type: formData.type.type,
                    // Add conditional fields based on type
                    ...(formData.type.type === 'BANNER' && {
                        width: formData.type.width,
                        height: formData.type.height
                    }),
                    ...(formData.type.type === 'POPUP' && {
                        delay: parseInt(formData.type.delay) || 0
                    }),
                    ...(formData.type.type === 'INTERSTITIAL' && {
                        fullscreen: formData.type.fullscreen
                    }),
                    ...(formData.type.type === 'PAGE_END' && {
                        showAfterScroll: formData.type.showAfterScroll
                    }),
                    ...(['SEARCH_PAGE', 'FILTER_PAGE', 'BUILDING_PAGE', 'PROPERTIES_PAGE', 'PROJECT_PAGE', 'CALL_PAGE'].includes(formData.type.type) && {
                        position: formData.type.position
                    }),
                    // Common fields
                    displayDuration: parseInt(formData.type.displayDuration) || 0,
                    showOnce: formData.type.showOnce,
                    location: {
                        latitude: parseFloat(formData.type.location.latitude) || null,
                        longitude: parseFloat(formData.type.location.longitude) || null,
                        radius: parseFloat(formData.type.location.radius) || 5
                    },
                    pincode: formData.type.pincode,
                    city: formData.type.city
                },
                targeted_audience: {
                    ageRange: {
                        min: parseInt(formData.targeted_audience.ageRange.min) || 18,
                        max: parseInt(formData.targeted_audience.ageRange.max) || 65
                    },
                    interests: formData.targeted_audience.interests,
                    gender: formData.targeted_audience.gender
                },
                // These fields are part of the Ad schema but are typically managed by the backend
                // Leave them out if they're not in your formData
                ...(formData.impressions !== undefined && { impressions: formData.impressions }),
                ...(formData.clicks !== undefined && { clicks: formData.clicks }),
                ...(formData.clickthrough_rate !== undefined && { clickthrough_rate: formData.clickthrough_rate })
            };

            // Submit data to the standalone Ad endpoint
            if (isEditMode) {
                await axios.put(`${base_url}/api/ads/${id}`, submissionData);
                setSuccess('Ad updated successfully!');
            } else {
                await axios.post(`${base_url}/api/ads`, submissionData);
                setSuccess('Ad created successfully!');
                setFormData(initialFormState); // Reset form after successful creation
            }

            // Redirect to ads list after short delay
            setTimeout(() => {
                navigate('/ads');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting the form');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto ">
            <h1 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit Ad' : 'Create New Ad'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="pb-8 mb-4">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Ad Name *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="header">
                            Header Text
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="header"
                            type="text"
                            name="header"
                            value={formData.header}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pagelink">
                            Page Link
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="pagelink"
                            type="text"
                            name="pagelink"
                            value={formData.pagelink}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Image Links
                        </label>
                        {formData.imagelinks.map((link, index) => (
                            <div key={`imagelink-${index}`} className="flex mb-2">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={link}
                                    onChange={(e) => handleArrayField('imagelinks', index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => removeArrayField('imagelinks', index)}
                                    disabled={formData.imagelinks.length <= 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                            onClick={() => addArrayField('imagelinks')}
                        >
                            Add Image Link
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Contact Information
                        </label>
                        {formData.contact.map((contact, index) => (
                            <div key={`contact-${index}`} className="flex mb-2">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={contact}
                                    onChange={(e) => handleArrayField('contact', index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => removeArrayField('contact', index)}
                                    disabled={formData.contact.length <= 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                            onClick={() => addArrayField('contact')}
                        >
                            Add Contact
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Ad Type & Placement Settings</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.type">
                            Ad Type *
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="type.type"
                            name="type"
                            value={formData.type.type}
                            onChange={handleTypeChange}
                            required
                        >
                            <option value="BANNER">Banner</option>
                            <option value="POPUP">Popup</option>
                            <option value="INTERSTITIAL">Interstitial</option>
                            <option value="PAGE_END">Page End</option>
                            <option value="SEARCH_PAGE">Search Page</option>
                            <option value="FILTER_PAGE">Filter Page</option>
                            <option value="BUILDING_PAGE">Building Page</option>
                            <option value="PROPERTIES_PAGE">Properties Page</option>
                            <option value="PROJECT_PAGE">Project Page</option>
                            <option value="CALL_PAGE">Call Page</option>
                        </select>
                    </div>

                    {/* Conditional fields based on ad type */}
                    {formData.type.type === 'BANNER' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.width">
                                    Width
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="type.width"
                                    type="text"
                                    name="width"
                                    value={formData.type.width}
                                    onChange={handleTypeChange}
                                    placeholder="e.g., 300px or 100%"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.height">
                                    Height
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="type.height"
                                    type="text"
                                    name="height"
                                    value={formData.type.height}
                                    onChange={handleTypeChange}
                                    placeholder="e.g., 250px"
                                />
                            </div>
                        </div>
                    )}

                    {formData.type.type === 'POPUP' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.delay">
                                Delay (seconds)
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type.delay"
                                type="number"
                                name="delay"
                                min="0"
                                value={formData.type.delay}
                                onChange={handleTypeChange}
                            />
                        </div>
                    )}

                    {formData.type.type === 'INTERSTITIAL' && (
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="fullscreen"
                                    checked={formData.type.fullscreen}
                                    onChange={handleTypeChange}
                                    className="mr-2"
                                />
                                <span className="text-gray-700 text-sm font-bold">Fullscreen</span>
                            </label>
                        </div>
                    )}

                    {formData.type.type === 'PAGE_END' && (
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="showAfterScroll"
                                    checked={formData.type.showAfterScroll}
                                    onChange={handleTypeChange}
                                    className="mr-2"
                                />
                                <span className="text-gray-700 text-sm font-bold">Show After Page Scroll</span>
                            </label>
                        </div>
                    )}

                    {['SEARCH_PAGE', 'FILTER_PAGE', 'BUILDING_PAGE', 'PROPERTIES_PAGE', 'PROJECT_PAGE', 'CALL_PAGE'].includes(formData.type.type) && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.position">
                                Position
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type.position"
                                name="position"
                                value={formData.type.position}
                                onChange={handleTypeChange}
                            >
                                <option value="TOP">Top</option>
                                <option value="MIDDLE">Middle</option>
                                <option value="BOTTOM">Bottom</option>
                            </select>
                        </div>
                    )}

                    {/* Common fields for all ad types */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.displayDuration">
                            Display Duration (seconds)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="type.displayDuration"
                            type="number"
                            name="displayDuration"
                            min="0"
                            value={formData.type.displayDuration}
                            onChange={handleTypeChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="showOnce"
                                checked={formData.type.showOnce}
                                onChange={handleTypeChange}
                                className="mr-2"
                            />
                            <span className="text-gray-700 text-sm font-bold">Show Only Once Per Session</span>
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Location Targeting</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.location.latitude">
                                Latitude
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type.location.latitude"
                                type="text"
                                name="location.latitude"
                                value={formData.type.location.latitude}
                                onChange={handleTypeChange}
                                placeholder="e.g., 40.7128"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.location.longitude">
                                Longitude
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type.location.longitude"
                                type="text"
                                name="location.longitude"
                                value={formData.type.location.longitude}
                                onChange={handleTypeChange}
                                placeholder="e.g., -74.0060"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.location.radius">
                            Radius (km)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="type.location.radius"
                            type="number"
                            name="location.radius"
                            min="0"
                            value={formData.type.location.radius}
                            onChange={handleTypeChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.pincode">
                                Pincode
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type.pincode"
                                type="text"
                                name="pincode"
                                value={formData.type.pincode}
                                onChange={handleTypeChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type.city">
                                City
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type.city"
                                type="text"
                                name="city"
                                value={formData.type.city}
                                onChange={handleTypeChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Audience Targeting</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targeted_audience.ageRange.min">
                                Minimum Age
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="targeted_audience.ageRange.min"
                                type="number"
                                name="ageRange.min"
                                min="0"
                                value={formData.targeted_audience.ageRange.min}
                                onChange={handleAudienceChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targeted_audience.ageRange.max">
                                Maximum Age
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="targeted_audience.ageRange.max"
                                type="number"
                                name="ageRange.max"
                                min="0"
                                value={formData.targeted_audience.ageRange.max}
                                onChange={handleAudienceChange}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targeted_audience.gender">
                            Gender
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="targeted_audience.gender"
                            name="gender"
                            value={formData.targeted_audience.gender}
                            onChange={handleAudienceChange}
                        >
                            <option value="ALL">All</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Interests
                        </label>
                        {formData.targeted_audience.interests.map((interest, index) => (
                            <div key={`interest-${index}`} className="flex mb-2">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={interest}
                                    onChange={(e) => handleInterestChange(index, e.target.value)}
                                    placeholder="e.g., Real Estate, Investment, Luxury"
                                />
                                <button
                                    type="button"
                                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => removeInterest(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                            onClick={addInterest}
                        >
                            Add Interest
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Schedule & Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                                Start Date
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="startDate"
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                                End Date
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="endDate"
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="PAUSED">Paused</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                            Priority (Higher number = Higher priority)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="priority"
                            type="number"
                            name="priority"
                            min="0"
                            value={formData.priority}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            isEditMode ? 'Update Ad' : 'Create Ad'
                        )}
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => navigate('/ads')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdForm;