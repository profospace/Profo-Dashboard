import React, { useState, useEffect } from 'react';
import { Activity, Eye, CreditCard, MapPin, Calendar, Filter } from 'lucide-react';

const UserActivity = ({ adminAPI, dateRange }) => {
    const [activityData, setActivityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchUserActivity();
    }, [dateRange, filterType]);

    const fetchUserActivity = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUserActivityAnalytics(dateRange, filterType);
            setActivityData(response);
        } catch (error) {
            console.error('Error fetching user activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const activityTypes = [
        { value: 'all', label: 'All Activities' },
        { value: 'login', label: 'User Logins' },
        { value: 'plan_purchase', label: 'Plan Purchases' },
        { value: 'wallet_recharge', label: 'Wallet Recharges' },
        { value: 'contact_unlock', label: 'Contact Unlocks' },
        { value: 'map_unlock', label: 'Map Unlocks' }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'login': return <Activity className="w-4 h-4 text-blue-500" />;
            case 'plan_purchase': return <CreditCard className="w-4 h-4 text-green-500" />;
            case 'wallet_recharge': return <CreditCard className="w-4 h-4 text-purple-500" />;
            case 'contact_unlock': return <Eye className="w-4 h-4 text-orange-500" />;
            case 'map_unlock': return <MapPin className="w-4 h-4 text-red-500" />;
            default: return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'login': return 'bg-blue-100 text-blue-800';
            case 'plan_purchase': return 'bg-green-100 text-green-800';
            case 'wallet_recharge': return 'bg-purple-100 text-purple-800';
            case 'contact_unlock': return 'bg-orange-100 text-orange-800';
            case 'map_unlock': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!activityData) {
        return <div className="text-center py-8">No activity data available</div>;
    }

    return (
        <div className="space-y-6">
            {/* Activity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Activities</p>
                            <p className="text-2xl font-semibold text-gray-900">{activityData.totalActivities || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Eye className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Contact Views</p>
                            <p className="text-2xl font-semibold text-gray-900">{activityData.contactViews || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <MapPin className="h-8 w-8 text-red-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Map Unlocks</p>
                            <p className="text-2xl font-semibold text-gray-900">{activityData.mapUnlocks || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Plan Purchases</p>
                            <p className="text-2xl font-semibold text-gray-900">{activityData.planPurchases || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Users</p>
                            <p className="text-2xl font-semibold text-gray-900">{activityData.activeUsers || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Activity List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">User Activities</h3>
                        <div className="flex items-center space-x-4">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {activityTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {activityData.activities?.map((activity, index) => (
                        <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {getActivityIcon(activity.type)}
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.userName}</p>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                        {activity.propertyId && (
                                            <p className="text-xs text-gray-500">Property: {activity.propertyId}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                                        {activity.type.replace('_', ' ')}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                                    {activity.amount && (
                                        <p className="text-sm font-medium text-green-600">₹{activity.amount}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Heatmap (Last 7 Days)</h3>
                <div className="grid grid-cols-7 gap-2">
                    {activityData.heatmapData?.map((day, index) => (
                        <div key={index} className="text-center">
                            <p className="text-xs text-gray-500 mb-2">{day.day}</p>
                            <div
                                className={`h-12 rounded ${day.intensity === 'high' ? 'bg-green-500' :
                                        day.intensity === 'medium' ? 'bg-green-300' :
                                            day.intensity === 'low' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}
                                title={`${day.activities} activities`}
                            ></div>
                            <p className="text-xs text-gray-600 mt-1">{day.activities}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent High-Value Activities */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">High-Value Recent Activities</h3>
                <div className="space-y-3">
                    {activityData.highValueActivities?.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {getActivityIcon(activity.type)}
                                <div>
                                    <p className="font-medium text-gray-900">{activity.userName}</p>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">₹{activity.amount?.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserActivity;