import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Calendar, Users, BellRing, Activity } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const NotificationStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotificationStats();
    }, []);

    const fetchNotificationStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/notifications/admin/stats` , getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setStats(data.stats);
            } else {
                setError(data.message || 'Failed to fetch notification statistics');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch notification statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-lg shadow h-28"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-5 rounded-lg shadow h-64"></div>
                    <div className="bg-white p-5 rounded-lg shadow h-64"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Notification Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                            <Users size={20} />
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Active Users</div>
                            <div className="text-2xl font-semibold">{stats.activeUserCount}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                            <BellRing size={20} />
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Templates</div>
                            <div className="text-2xl font-semibold">{stats.templateCount}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Scheduled Automations</div>
                            <div className="text-2xl font-semibold">{stats.scheduledCount || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                            <Activity size={20} />
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Sent Today</div>
                            <div className="text-2xl font-semibold">{stats.sentToday || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Templates */}
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center mb-4">
                        <BarChart className="text-gray-400 mr-2" size={20} />
                        <h3 className="text-lg font-medium">Top Templates</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 text-xs uppercase text-gray-500">Template</th>
                                    <th className="text-right py-3 text-xs uppercase text-gray-500">Send Count</th>
                                    <th className="text-right py-3 text-xs uppercase text-gray-500">Last Sent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topTemplates && stats.topTemplates.length > 0 ? (
                                    stats.topTemplates.map((template, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="py-3 text-sm">{template.name}</td>
                                            <td className="py-3 text-sm text-right">{template.sendCount}</td>
                                            <td className="py-3 text-sm text-right text-gray-500">
                                                {template.lastSentAt ? new Date(template.lastSentAt).toLocaleDateString() : 'Never'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-3 text-center text-sm text-gray-500">No template data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Preferences */}
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center mb-4">
                        <PieChart className="text-gray-400 mr-2" size={20} />
                        <h3 className="text-lg font-medium">User Preferences</h3>
                    </div>

                    {stats.userPreferences ? (
                        <div className="space-y-4">
                            <div className="relative pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            Price Alerts
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            {stats.userPreferences.priceAlertsEnabled} / {stats.userPreferences.totalUsers}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: `${(stats.userPreferences.priceAlertsEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                            </div>

                            <div className="relative pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block text-green-600">
                                            New Property Alerts
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-green-600">
                                            {stats.userPreferences.newPropertyAlertsEnabled} / {stats.userPreferences.totalUsers}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-green-200">
                                    <div style={{ width: `${(stats.userPreferences.newPropertyAlertsEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                </div>
                            </div>

                            <div className="relative pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block text-purple-600">
                                            Saved Search Alerts
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-purple-600">
                                            {stats.userPreferences.savedSearchAlertsEnabled} / {stats.userPreferences.totalUsers}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-purple-200">
                                    <div style={{ width: `${(stats.userPreferences.savedSearchAlertsEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                                </div>
                            </div>

                            <div className="relative pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block text-yellow-600">
                                            Daily Digest
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-yellow-600">
                                            {stats.userPreferences.dailyDigestEnabled} / {stats.userPreferences.totalUsers}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-yellow-200">
                                    <div style={{ width: `${(stats.userPreferences.dailyDigestEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No user preference data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationStats;