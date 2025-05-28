import React, { useState, useEffect } from 'react';
import { BarChart3, MessageSquare, Users, Zap, Smartphone, Globe, TrendingUp, Activity } from 'lucide-react';
import { getAuthConfig } from '../../../utils/authConfig';
import { base_url } from '../../../utils/base_url';
import axios from 'axios';

const Dashboard = () => {
    const [instances, setInstances] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalMessagesSent: 0,
        totalAutoReplies: 0,
        totalTemplates: 0,
        totalInstances: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // const fetchDashboardData = async () => {
    //     try {
    //         setLoading(true);

    //         // Fetch instances
    //         const instancesResponse = await fetch('/api/devices', {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             }
    //         });
    //         const instancesData = await instancesResponse.json();

    //         // Fetch analytics
    //         const analyticsResponse = await fetch('/api/dashboard/analytics', {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             }
    //         });
    //         const analyticsData = await analyticsResponse.json();

    //         setInstances(instancesData);
    //         setAnalytics(analyticsData);

    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [instancesResponse, analyticsResponse] = await Promise.all([
                axios.get(`${base_url}/api/devices`, getAuthConfig()),
                axios.get(`${base_url}/api/dashboard/analytics`, getAuthConfig())
            ]);

            setInstances(instancesResponse.data);
            setAnalytics(analyticsResponse.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'text-green-600 bg-green-100';
            case 'disconnected': return 'text-red-600 bg-red-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'connected': return '🟢';
            case 'disconnected': return '🔴';
            case 'pending': return '🟡';
            default: return '⚪';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Dashboard</h1>
                            <p className="text-gray-600 mt-1">Monitor your WhatsApp automation performance</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                                <Activity className="w-5 h-5" />
                                <span className="font-medium">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Messages Sent</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.totalMessagesSent.toLocaleString()}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">+12% from last week</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Auto Replies Triggered</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.totalAutoReplies.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">+8% from last week</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Templates Created</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.totalTemplates.toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">+5% from last week</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Instances</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{instances.filter(i => i.status === 'connected').length}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Smartphone className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-sm text-gray-600">of {instances.length} total</span>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Instances */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-blue-600" />
                            WhatsApp Instances
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">Manage your WhatsApp connections</p>
                    </div>

                    <div className="p-6">
                        {instances.length === 0 ? (
                            <div className="text-center py-12">
                                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No WhatsApp Instances</h3>
                                <p className="text-gray-600 mb-6">Create your first WhatsApp instance to start automating messages</p>
                                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                                    Create Instance
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200">
                                            <th className="pb-3 text-sm font-medium text-gray-600">Instance</th>
                                            <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                                            <th className="pb-3 text-sm font-medium text-gray-600">Phone Number</th>
                                            <th className="pb-3 text-sm font-medium text-gray-600">Last Active</th>
                                            <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {instances.map((instance) => (
                                            <tr key={instance.instanceKey} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="py-4">
                                                    <div className="flex items-center">
                                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg mr-3">
                                                            <MessageSquare className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{instance.name}</p>
                                                            <p className="text-sm text-gray-500">{instance.instanceKey}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
                                                        <span className="mr-1">{getStatusIcon(instance.status)}</span>
                                                        {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-900">
                                                    {instance.phoneNumber || 'Not connected'}
                                                </td>
                                                <td className="py-4 text-gray-600">
                                                    {instance.lastActive ? new Date(instance.lastActive).toLocaleString() : 'Never'}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex space-x-2">
                                                        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors duration-150">
                                                            View
                                                        </button>
                                                        <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-150">
                                                            Edit
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                            Message Statistics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Messages Sent Today</span>
                                <span className="font-semibold text-gray-900">247</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Auto Replies Today</span>
                                <span className="font-semibold text-gray-900">89</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Failed Messages</span>
                                <span className="font-semibold text-red-600">3</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            Active Contacts
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Contacts</span>
                                <span className="font-semibold text-gray-900">1,234</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">New Contacts Today</span>
                                <span className="font-semibold text-gray-900">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Active Conversations</span>
                                <span className="font-semibold text-green-600">45</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;