import React, { useState, useEffect } from 'react';
import { Loader2, Check, X, Clock, Mail } from 'lucide-react';
import { base_url } from "../../../utils/base_url";
import { getAuthConfig } from '../../../utils/authConfig';

const BuilderAuthConnection = () => {
    const [builders, setBuilders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingReportSettings, setEditingReportSettings] = useState(null);

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${base_url}/builders/info` , getAuthConfig());

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

    const updateBuilderBookingAccess = async (builderId, newAccessState) => {
        try {
            const response = await fetch(`${base_url}/builder/booking/update-access/${builderId}`, {
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
                        ? { ...builder, bookingAccess: newAccessState }
                        : builder
                )
            );

            return data;
        } catch (error) {
            console.error('Error updating access:', error);
            throw error;
        }
    };

    const updateReportSettings = async (builderId, settings) => {
        try {
            const response = await fetch(`${base_url}/builder/update-report-settings/${builderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update report settings');
            }

            // Update builders list with the updated report settings
            setBuilders(prevBuilders =>
                prevBuilders.map(builder =>
                    builder._id === builderId
                        ? {
                            ...builder,
                            emailNotifications: {
                                ...builder.emailNotifications,
                                dailyReport: {
                                    ...builder.emailNotifications?.dailyReport,
                                    ...settings
                                }
                            }
                        }
                        : builder
                )
            );

            return data;
        } catch (error) {
            console.error('Error updating report settings:', error);
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
    const handleToggleBookingAccess = async (builderId, currentAccessState) => {
        try {
            await updateBuilderBookingAccess(builderId, !currentAccessState);
            // Success toast or message could be added here
        } catch (error) {
            // Error toast or message could be added here
            console.error('Failed to update access status:', error);
        }
    };

    const handleToggleDailyReport = async (builderId, currentEnabled) => {
        try {
            await updateReportSettings(builderId, { enabled: !currentEnabled });
            // Success toast or message could be added here
        } catch (error) {
            // Error toast or message could be added here
            console.error('Failed to toggle daily report:', error);
        }
    };

    const handleSaveReportSettings = async (builderId) => {
        if (!editingReportSettings) return;

        try {
            await updateReportSettings(builderId, {
                time: editingReportSettings.time,
                email: editingReportSettings.email
            });
            setEditingReportSettings(null);
            // Success message could be added here
        } catch (error) {
            console.error('Failed to save report settings:', error);
            // Error message could be added here
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

    // Helper function to safely get the daily report settings
    const getDailyReportSettings = (builder) => {
        return builder.emailNotifications?.dailyReport || { enabled: false, time: "08:00", email: "" };
    };

    // Start editing report settings for a builder
    const startEditingReportSettings = (builder) => {
        const settings = getDailyReportSettings(builder);
        setEditingReportSettings({
            builderId: builder._id,
            time: settings.time || "08:00",
            email: settings.email || ""
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
        <div className="mx-auto">
            <h1 className="text-2xl font-bold mb-6">Builder Auth Connection</h1>

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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Access</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Report</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {builders.map((builder) => {
                            const dailyReport = getDailyReportSettings(builder);
                            const isEditing = editingReportSettings?.builderId === builder._id;

                            return (
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={builder.bookingAccess || false}
                                                onChange={() => handleToggleBookingAccess(builder._id, builder.bookingAccess || false)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            {/* Daily Report Toggle */}
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Enabled:</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={dailyReport.enabled || false}
                                                        onChange={() => handleToggleDailyReport(builder._id, dailyReport.enabled || false)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                            </div>

                                            {/* Time Setting */}
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                {isEditing ? (
                                                    <input
                                                        type="time"
                                                        value={editingReportSettings.time}
                                                        onChange={(e) => setEditingReportSettings({
                                                            ...editingReportSettings,
                                                            time: e.target.value
                                                        })}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 w-24"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-600">{dailyReport.time || "08:00"}</span>
                                                )}
                                            </div>

                                            {/* Email Setting */}
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        value={editingReportSettings.email}
                                                        onChange={(e) => setEditingReportSettings({
                                                            ...editingReportSettings,
                                                            email: e.target.value
                                                        })}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 w-48"
                                                        placeholder="email@example.com"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-600 truncate max-w-xs">
                                                        {dailyReport.email || "Not set"}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Edit/Save Buttons */}
                                            <div>
                                                {isEditing ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleSaveReportSettings(builder._id)}
                                                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition flex items-center"
                                                        >
                                                            <Check className="h-3 w-3 mr-1" /> Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingReportSettings(null)}
                                                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition flex items-center"
                                                        >
                                                            <X className="h-3 w-3 mr-1" /> Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditingReportSettings(builder)}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                                                    >
                                                        Edit Settings
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BuilderAuthConnection;