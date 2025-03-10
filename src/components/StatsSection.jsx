import React from 'react';

const StatsSection = ({ totalUsers, users }) => {
    // Calculate percentage of verified users from current page
    const calculateVerifiedPercentage = () => {
        if (!users || users.length === 0) return 0;

        const verifiedUsers = users.filter(user => user.isPhoneVerified).length;
        return Math.round((verifiedUsers / users.length) * 100);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Users
                                </dt>
                                <dd>
                                    <div className="text-lg font-medium text-gray-900">
                                        {totalUsers.toLocaleString()}
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Verified Users
                                </dt>
                                <dd>
                                    <div className="text-lg font-medium text-gray-900">
                                        {calculateVerifiedPercentage()}%
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* You can add more stat cards here as needed */}
        </div>
    );
};

export default StatsSection;