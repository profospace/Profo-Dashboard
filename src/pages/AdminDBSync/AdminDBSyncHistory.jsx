
// src/pages/admin/AdminDBSyncHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import { Link } from 'react-router-dom';

const AdminDBSyncHistory = () => {
    const [syncOperations, setSyncOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSync, setSelectedSync] = useState(null);
    const [syncDetails, setSyncDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchSyncOperations();
    }, []);

    useEffect(() => {
        if (selectedSync) {
            fetchSyncDetails(selectedSync);
        } else {
            setSyncDetails(null);
        }
    }, [selectedSync]);

    const fetchSyncOperations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${base_url}/api/sync/operations`, getAuthConfig());

            // Sort operations by startTime (newest first)
            const sortedOperations = response.data.operations.sort((a, b) =>
                new Date(b.startTime) - new Date(a.startTime)
            );

            setSyncOperations(sortedOperations);
        } catch (err) {
            setError(`Failed to fetch sync history: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchSyncDetails = async (syncId) => {
        setDetailsLoading(true);
        try {
            const response = await axios.get(`${base_url}/api/sync/status/${syncId}`, getAuthConfig());
            setSyncDetails(response.data.status);
        } catch (err) {
            console.error('Failed to fetch sync details:', err);
            setError(`Failed to fetch details: ${err.response?.data?.message || err.message}`);
        } finally {
            setDetailsLoading(false);
        }
    };

    const formatDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 'N/A';

        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationMs = end - start;

        const seconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes === 0) {
            return `${seconds} seconds`;
        }

        return `${minutes} min ${remainingSeconds} sec`;
    };

    const getStatusBadgeColor = (operation) => {
        if (operation.inProgress) return 'bg-blue-100 text-blue-800';
        if (operation.hasErrors) return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (operation) => {
        if (operation.inProgress) return 'In Progress';
        if (operation.hasErrors) return 'Completed with Errors';
        return 'Successful';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Database Sync History</h1>
                <Link
                    to="/sync-db-prod"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Back to Sync Dashboard
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sync Operations List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                        <h2 className="text-lg font-medium text-gray-800">Sync Operations</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        </div>
                    ) : syncOperations.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No sync operations found
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {syncOperations.map((operation) => (
                                <li
                                    key={operation.id}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedSync === operation.id ? 'bg-blue-50' : ''}`}
                                    onClick={() => setSelectedSync(operation.id)}
                                >
                                    <div className="flex justify-between">
                                        <span className="font-medium">Sync {operation.id.substring(5, 13)}</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(operation)}`}>
                                            {getStatusText(operation)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {new Date(operation.startTime).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {operation.completed} of {operation.total} collections
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="bg-gray-50 px-4 py-3 border-t">
                        <button
                            onClick={fetchSyncOperations}
                            className="w-full flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Sync Details */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    {!selectedSync ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium">No Sync Operation Selected</h3>
                            <p className="mt-1">Select a sync operation from the list to view details</p>
                        </div>
                    ) : detailsLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        </div>
                    ) : !syncDetails ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium">Details Not Available</h3>
                            <p className="mt-1">Could not load details for this sync operation</p>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4">Sync Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm font-medium text-gray-500">Start Time</div>
                                        <div className="mt-1">{new Date(syncDetails.startTime).toLocaleString()}</div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm font-medium text-gray-500">End Time</div>
                                        <div className="mt-1">
                                            {syncDetails.endTime
                                                ? new Date(syncDetails.endTime).toLocaleString()
                                                : 'In Progress'}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm font-medium text-gray-500">Duration</div>
                                        <div className="mt-1">
                                            {formatDuration(syncDetails.startTime, syncDetails.endTime)}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm font-medium text-gray-500">Progress</div>
                                        <div className="mt-1 flex items-center">
                                            <span className="mr-2">
                                                {syncDetails.completed} / {syncDetails.total} collections
                                            </span>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${(syncDetails.completed / syncDetails.total) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Collection Details */}
                            {syncDetails.collections && Object.keys(syncDetails.collections).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Collections</h3>
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Collection
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Documents
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Object.entries(syncDetails.collections).map(([collection, details]) => (
                                                    <tr key={collection}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {collection}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${details.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        details.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                            'bg-blue-100 text-blue-800'}`}
                                                            >
                                                                {details.status === 'completed' ? 'Completed' :
                                                                    details.status === 'failed' ? 'Failed' : 'In Progress'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {details.docsProcessed || 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Errors */}
                            {syncDetails.errors && syncDetails.errors.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3 text-red-600">Errors</h3>
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {syncDetails.errors.map((error, index) => (
                                                <li key={index} className="text-red-700">
                                                    {error}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDBSyncHistory;