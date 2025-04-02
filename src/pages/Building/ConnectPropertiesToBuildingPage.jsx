import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBuildings } from '../../../utils/Building/api';
import { getUnassignedProperties, connectPropertiesToBuilding } from '../../../utils/Building/api2';

const ConnectPropertiesToBuildingPage = () => {
    const { buildingId } = useParams();
    const navigate = useNavigate();
    const [building, setBuilding] = useState(null);
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch building details
                const buildingData = await getBuildings(buildingId);
                setBuilding(buildingData);

                // Fetch unassigned properties
                const propertiesData = await getUnassignedProperties();
                setProperties(propertiesData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [buildingId]);

    const handlePropertyToggle = (propertyId) => {
        setSelectedProperties(prevSelected => {
            if (prevSelected.includes(propertyId)) {
                return prevSelected.filter(id => id !== propertyId);
            } else {
                return [...prevSelected, propertyId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedProperties.length === properties.length) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(properties.map(property => property._id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedProperties.length === 0) {
            setError('Please select at least one property to connect');
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await connectPropertiesToBuilding(buildingId, { propertyIds: selectedProperties });
            setSuccess(`${selectedProperties.length} properties successfully connected to the building.`);
            setTimeout(() => {
                navigate(`/buildings/${buildingId}`);
            }, 2000);
        } catch (err) {
            console.error('Error connecting properties:', err);
            setError('Failed to connect properties. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Connect Properties to Building</h1>
                {building && (
                    <div className="mt-2 p-4 bg-blue-50 rounded-md">
                        <h2 className="text-lg font-semibold">{building.name || 'Unnamed Building'}</h2>
                        <p className="text-sm text-gray-600">ID: {building.buildingId}</p>
                        {building.address && <p className="text-sm text-gray-600">Address: {building.address}</p>}
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                        Available Properties ({properties.length})
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md"
                        >
                            {selectedProperties.length === properties.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting || selectedProperties.length === 0}
                            className={`${submitting || selectedProperties.length === 0
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white text-sm px-3 py-1 rounded-md`}
                        >
                            {submitting ? 'Connecting...' : 'Connect Selected Properties'}
                        </button>
                    </div>
                </div>

                {properties.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No unassigned properties found</h3>
                        <p className="mt-1 text-sm text-gray-500">All properties are already assigned to buildings.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Select
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Property Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Area
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {properties.map((property) => (
                                    <tr key={property._id} className={`${selectedProperties.includes(property._id) ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                checked={selectedProperties.includes(property._id)}
                                                onChange={() => handlePropertyToggle(property._id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {property.post_images && property.post_images.length > 0 ? (
                                                        <img
                                                            className="h-10 w-10 rounded-md object-cover"
                                                            src={property.post_images[0].url}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {property.post_title || 'Untitled Property'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {property.post_id || property._id}
                                                    </div>
                                                    {property.address && (
                                                        <div className="text-xs text-gray-500 truncate max-w-xs">
                                                            {property.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{property.type_name || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">
                                                {property.bedrooms ? `${property.bedrooms} BHK` : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {property.superBuiltupArea ? `${property.superBuiltupArea} ${property.areaUnit || 'sq.ft'}` : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {property.priceOnRequest
                                                    ? 'Price on Request'
                                                    : property.price
                                                        ? `${property.price.toLocaleString()} ${property.priceUnit || ''}`
                                                        : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${property.status === 'listed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : property.status === 'unlisted'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {property.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="bg-gray-50 px-4 py-3 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(`/buildings/${buildingId}`)}
                        className="mr-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || selectedProperties.length === 0}
                        className={`${submitting || selectedProperties.length === 0
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {submitting ? 'Connecting...' : 'Connect Selected Properties'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectPropertiesToBuildingPage;