import React from 'react';

const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* <div>https://www.profospace.in/notification/subscription/aryan-testing</div> */}
            <StatCard
                title="Active Users"
                value={stats.activeUserCount.toLocaleString()}
                description="Users with notification tokens"
            />
            <StatCard
                title="Templates"
                value={stats.templateCount}
                description="Total notification templates"
            />
            <StatCard
                title="Price Alerts"
                value={stats.userPreferences?.priceAlertsEnabled || 0}
                suffix="users"
                progress={(stats.userPreferences?.priceAlertsEnabled || 0) / (stats.userPreferences?.totalUsers || 1) * 100}
                progressColor="bg-blue-600"
            />
            <StatCard
                title="Daily Digest"
                value={stats.userPreferences?.dailyDigestEnabled || 0}
                suffix="users"
                progress={(stats.userPreferences?.dailyDigestEnabled || 0) / (stats.userPreferences?.totalUsers || 1) * 100}
                progressColor="bg-green-600"
            />
        </div>
    );
};

const StatCard = ({ title, value, description, suffix, progress, progressColor }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow transform transition-all duration-200 hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold">
                {value}
                {suffix && <span className="text-sm ml-1 text-gray-500">{suffix}</span>}
            </p>
            {description && <p className="text-xs text-gray-500">{description}</p>}

            {progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className={`${progressColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default DashboardStats;