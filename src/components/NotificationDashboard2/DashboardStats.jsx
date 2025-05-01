import React from 'react';

// Dashboard Stats Component
const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="text-2xl font-bold">{stats.activeUserCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Users with notification tokens</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Templates</h3>
                <p className="text-2xl font-bold">{stats.templateCount}</p>
                <p className="text-xs text-gray-500">Total notification templates</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Price Alerts</h3>
                <p className="text-2xl font-bold">
                    {stats.userPreferences?.priceAlertsEnabled || 0}
                    <span className="text-sm ml-1 text-gray-500">users</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${((stats.userPreferences?.priceAlertsEnabled || 0) /
                                (stats.userPreferences?.totalUsers || 1)) * 100}%`
                        }}
                    ></div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Daily Digest</h3>
                <p className="text-2xl font-bold">
                    {stats.userPreferences?.dailyDigestEnabled || 0}
                    <span className="text-sm ml-1 text-gray-500">users</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${((stats.userPreferences?.dailyDigestEnabled || 0) /
                                (stats.userPreferences?.totalUsers || 1)) * 100}%`
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;