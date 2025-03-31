import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Plus, AlertCircle } from 'lucide-react';
import CurrentCitiesList from '../../components/City/CurrentCitiesList';
import AddCityForm from '../../components/City/AddCityForm';
import ManageCitiesSection from '../../components/City/ManageCitiesSection';
import { base_url } from '../../../utils/base_url';

const CitiesManagementPage = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [citiesToAdd, setCitiesToAdd] = useState([]);
    const [citiesToDelete, setCitiesToDelete] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Fetch all cities
    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${base_url}/api/get-all-cities`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCities(data.cities || []);
            } catch (err) {
                console.error('Error fetching cities:', err);
                setError('Failed to load cities. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [refreshTrigger]);

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Add new cities
    const handleAddCity = (city) => {
        if (!city) return;
        if (citiesToAdd.includes(city)) {
            showNotification(`'${city}' is already in your add list.`, 'warning');
            return;
        }
        if (cities.includes(city)) {
            showNotification(`'${city}' already exists in the database.`, 'warning');
            return;
        }
        setCitiesToAdd([...citiesToAdd, city]);
        showNotification(`'${city}' added to the list.`);
    };

    const handleRemoveCityToAdd = (city) => {
        setCitiesToAdd(citiesToAdd.filter(c => c !== city));
    };

    const handlePushChanges = async () => {
        if (citiesToAdd.length === 0) {
            showNotification('Please add cities first.', 'warning');
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/add-new-city`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cities: citiesToAdd })
            });

            if (!response.ok) {
                throw new Error(`Failed to add cities. Status: ${response.status}`);
            }

            showNotification(`Successfully added ${citiesToAdd.length} cities!`);
            setCitiesToAdd([]);
            setRefreshTrigger(prev => prev + 1); // Trigger a refresh
        } catch (err) {
            console.error('Error adding cities:', err);
            showNotification('Failed to add cities. Please try again.', 'error');
        }
    };

    // Delete cities
    const handleCityToDelete = (city) => {
        if (!citiesToDelete.includes(city)) {
            setCitiesToDelete([...citiesToDelete, city]);
            showNotification(`'${city}' marked for deletion.`);
        }
    };

    const handleRemoveCityToDelete = (city) => {
        setCitiesToDelete(citiesToDelete.filter(c => c !== city));
    };

    const handleDeleteCities = async () => {
        if (citiesToDelete.length === 0) {
            showNotification('No cities selected to delete.', 'warning');
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/remove-cities`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cities: citiesToDelete })
            });

            if (!response.ok) {
                throw new Error(`Failed to delete cities. Status: ${response.status}`);
            }

            showNotification(`Successfully deleted ${citiesToDelete.length} cities!`);
            setCitiesToDelete([]);
            setRefreshTrigger(prev => prev + 1); // Trigger a refresh
        } catch (err) {
            console.error('Error deleting cities:', err);
            showNotification('Failed to delete cities. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <span className="text-lg font-medium text-gray-700">Loading cities...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md max-w-md w-full">
                    <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 mr-2" />
                        <p className="font-medium">Error Loading Data</p>
                    </div>
                    <p className="mt-2 text-sm">{error}</p>
                    <button
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                        className="mt-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto ">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg max-w-sm z-50 transform transition-all duration-300 ease-in-out translate-y-0 ${notification.type === 'error' ? 'bg-red-600 text-white' :
                        notification.type === 'warning' ? 'bg-amber-500 text-white' :
                            'bg-emerald-600 text-white'
                    }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {notification.type === 'error' ? (
                                <AlertCircle className="h-5 w-5" />
                            ) : notification.type === 'warning' ? (
                                <AlertCircle className="h-5 w-5" />
                            ) : (
                                <div className="rounded-full bg-white p-1">
                                    <MapPin className="h-3 w-3 text-emerald-600" />
                                </div>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Cities Management</h1>
                <p className="text-gray-600">Add, view, and remove cities available in the application.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-8">
                    <CurrentCitiesList cities={cities} />
                </div>

                <div className="flex flex-col space-y-8">
                    <AddCityForm
                        citiesToAdd={citiesToAdd}
                        onAddCity={handleAddCity}
                        onRemoveCityToAdd={handleRemoveCityToAdd}
                        onPushChanges={handlePushChanges}
                    />

                    <ManageCitiesSection
                        cities={cities}
                        citiesToDelete={citiesToDelete}
                        onCityToDelete={handleCityToDelete}
                        onRemoveCityToDelete={handleRemoveCityToDelete}
                        onDeleteCities={handleDeleteCities}
                    />
                </div>
            </div>

            {/* Stats card */}
            <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Cities Statistics</h3>
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Cities</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{cities.length}</dd>
                            </div>
                        </div>
                        <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Cities to Add</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{citiesToAdd.length}</dd>
                            </div>
                        </div>
                        <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Cities to Delete</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{citiesToDelete.length}</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitiesManagementPage;