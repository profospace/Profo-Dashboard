import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProperties, selectProperty, clearSelectedProperty } from '../redux/features/Properties/propertiesSlice';

const PropertiesPage = () => {
    const dispatch = useDispatch();
    const { properties, selectedProperty, isLoading, isError, message } = useSelector(
        (state) => state.properties
    );

    useEffect(() => {
        dispatch(getProperties());
    }, [dispatch]);

    const handleSelect = (propertyId) => {
        dispatch(selectProperty(propertyId));
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading properties...</div>;
    }

    if (isError) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{message}</span>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Properties</h1>

            {selectedProperty ? (
                <div className="mb-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Property Details: {selectedProperty.post_title}</h2>
                            <button
                                onClick={() => dispatch(clearSelectedProperty())}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                            >
                                Back to List
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 mb-2">ID: {selectedProperty.post_id}</p>
                                <p className="text-gray-600 mb-2">Type: {selectedProperty.type_name}</p>
                                <p className="text-gray-600 mb-2">Address: {selectedProperty.address}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 mb-2">Price: {selectedProperty.price}</p>
                                <p className="text-gray-600 mb-2">Status: {selectedProperty.status || 'Available'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {properties.length > 0 ? (
                                properties.map((property) => (
                                    <tr key={property.post_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.post_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.post_title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.type_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleSelect(property.post_id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No properties found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;