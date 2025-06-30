import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";
import PropertyList from '../../components/Property/PropertyList';
import PropertyDetails from '../../components/Property/PropertyDetails';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

export default function PropertyManagement() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchCities();
        fetchProperties();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch(`${base_url}/api/get-all-cities`);
            const data = await response.json();
            if (data && data.cities) {
                setCities(data.cities);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            toast.error('Failed to load cities');
        }
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${base_url}/api/properties/all`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setProperties(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setError('Failed to load properties. Please try again.');
            setLoading(false);
            toast.error('Failed to load properties');
        }
    };

    const fetchPropertiesByCity = async (city) => {
        if (!city) {
            fetchProperties();
            return;
        }

        setLoading(true);
        try {
            // First get coordinates for the city
            const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${import.meta.env.GOOGLE_API_KEY}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (geoData.status === "OK" && geoData.results.length > 0) {
                const location = geoData.results[0].geometry.location;

                // Now fetch properties near that location
                const response = await fetch(
                    `${base_url}/api/properties/filter?latitude=${location.lat}&longitude=${location.lng}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setProperties(data.properties || []);
            } else {
                setProperties([]);
                toast.error('No location found for this city');
            }
        } catch (error) {
            console.error('Error fetching properties by city:', error);
            setError('Failed to load properties for this city');
            toast.error('Failed to load properties for this city');
        } finally {
            setLoading(false);
        }
    };

    const deleteProperty = async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/properties/${propertyId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            toast.success('Property deleted successfully!');
            fetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error(`Failed to delete property: ${error.message}`);
        }
    };

    // const updatePropertyStatus = async (propertyId, status) => {
    //     try {
    //         const response = await fetch(`${base_url}/api/property/update-status/${propertyId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ status })
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }

    //         const result = await response.json();
    //         toast.success('Property status updated');

    //         // Update the property in the local state
    //         setProperties(prevProperties =>
    //             prevProperties.map(prop =>
    //                 prop._id === propertyId ? { ...prop, status } : prop
    //             )
    //         );

    //         return result;
    //     } catch (error) {
    //         console.error('Error updating property status:', error);
    //         toast.error('Failed to update property status');
    //         throw error;
    //     }
    // };

    const updatePropertyStatus = async (propertyId, status) => {
        try {
            const response = await axios.put(
                `${base_url}/api/property/update-status/${propertyId}`,
                { status }, // Request body
                getAuthConfig()
            );

            toast.success('Property status updated');

            // Update the property in the local state
            setProperties(prevProperties =>
                prevProperties.map(prop =>
                    prop._id === propertyId ? { ...prop, status } : prop
                )
            );

            return response.data;
        } catch (error) {
            console.error('Error updating property status:', error);
            toast.error(
                error.response?.data?.message || 'Failed to update property status'
            );
            throw error;
        }
    };
    
    const handleEditProperty = (property) => {
        navigate(`/property-edit/${property.post_id}`, { state: { property } });
    };

    const handleAddNewProperty = () => {
        navigate('/property-add');
    };

    const handleCityChange = (cityName) => {
        setSelectedCity(cityName);
        if (cityName) {
            fetchPropertiesByCity(cityName);
        } else {
            fetchProperties();
        }
    };

    const handleViewDetails = (property) => {
        setSelectedProperty(property);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedProperty(null);
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.post_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.post_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !filterStatus || property.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <motion.div
            className="mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Property Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage all properties in the system.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <motion.button
                        type="button"
                        onClick={handleAddNewProperty}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add New Property
                    </motion.button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <PropertyList
                    properties={filteredProperties}
                    loading={loading}
                    error={error}
                    onEdit={handleEditProperty}
                    onDelete={deleteProperty}
                    onUpdateStatus={updatePropertyStatus}
                    onViewDetails={handleViewDetails}
                    cities={cities}
                    selectedCity={selectedCity}
                    onCityChange={handleCityChange}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                />
            </div>

            {showDetailModal && selectedProperty && (
                <PropertyDetails
                    propertyId={selectedProperty.post_id}
                    onClose={closeDetailModal}
                />
            )}
        </motion.div>
    );
}