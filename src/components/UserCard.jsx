import React from 'react';

const UserCard = ({ user }) => {
    // Default avatar if user doesn't have one
    const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

    // Get login type badge color
    const getLoginTypeColor = (loginType) => {
        const colors = {
            EMAIL: 'bg-blue-100 text-blue-800',
            GOOGLE: 'bg-red-100 text-red-800',
            FACEBOOK: 'bg-indigo-100 text-indigo-800',
            APPLE: 'bg-gray-100 text-gray-800',
            PHONE: 'bg-green-100 text-green-800'
        };
        return colors[loginType] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-5 flex items-start">
                {/* User Avatar */}
                <div className="flex-shrink-0 mr-4">
                    <img
                        src={user.profile?.avatar || defaultAvatar}
                        alt={`${user.name || 'User'}'s avatar`}
                        className="h-14 w-14 rounded-full object-cover bg-gray-200"
                    />
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                        {user.name || 'Unnamed User'}
                    </h3>

                    <p className="text-sm text-gray-600 truncate mt-1">
                        {user.email || 'No email provided'}
                    </p>

                    <p className="text-sm text-gray-600 truncate mt-1">
                        {user.phone || 'No phone provided'}
                    </p>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getLoginTypeColor(user.loginType)}`}>
                            {user.loginType || 'Unknown'}
                        </span>

                        <span className={`px-2 py-1 text-xs rounded-full ${user.isPhoneVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {user.isPhoneVerified ? 'Verified' : 'Not Verified'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Activity Indicators (Optional) */}
            {user.lastLogin && (
                <div className="px-5 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
                    Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

export default UserCard;