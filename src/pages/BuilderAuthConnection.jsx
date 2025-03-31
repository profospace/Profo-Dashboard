import React, { useState, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { base_url } from "../../utils/base_url"


const BuilderAuthConnection = () => {
    const [builders, setBuilders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${base_url}/builders/info`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Response is not an array. Check API structure.');
            }

            setBuilders(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching builders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateBuilderAccess = async (builderId, newAccessState) => {
        try {
            const response = await fetch(`${base_url}/builder/update-access/${builderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access: newAccessState }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update access');
            }

            // Update builders list with the updated access state
            setBuilders(prevBuilders =>
                prevBuilders.map(builder =>
                    builder._id === builderId
                        ? { ...builder, access: newAccessState }
                        : builder
                )
            );

            return data;
        } catch (error) {
            console.error('Error updating access:', error);
            throw error;
        }
    };

    const handleToggleAccess = async (builderId, currentAccessState) => {
        try {
            await updateBuilderAccess(builderId, !currentAccessState);
            // Success toast or message could be added here
        } catch (error) {
            // Error toast or message could be added here
            console.error('Failed to update access status:', error);
        }
    };

    const resetPassword = async (builderId) => {
        try {
            const response = await fetch(`${base_url}/builder/reset-password/${builderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            alert(`Password has been reset: ${data.newPassword}`);
            await fetchBuilders(); // Refresh the data
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password: ' + error.message);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Password copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy:', err);
                alert('Failed to copy password to clipboard');
            });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-600">Loading builders...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Error fetching builders: {error}
                        </p>
                        <button
                            className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                            onClick={fetchBuilders}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto ">
            <h1 className="text-2xl font-bold mb-6">Builder ID Connection</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reset Password</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {builders.map((builder) => (
                            <tr key={builder._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {builder.logo ? (
                                        <img
                                            src={builder.logo}
                                            alt={`${builder.name} logo`}
                                            className="h-12 w-12 object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            N/A
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{builder.name || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{builder.username || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500 font-mono bg-gray-100 p-1 rounded">
                                            {builder.password || 'N/A'}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(builder.password || 'N/A')}
                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to reset this password?')) {
                                                resetPassword(builder._id);
                                            }
                                        }}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                    >
                                        Reset Password
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={builder.access || false}
                                            onChange={() => handleToggleAccess(builder._id, builder.access || false)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BuilderAuthConnection;