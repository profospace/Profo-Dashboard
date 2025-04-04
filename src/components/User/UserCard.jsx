import React from 'react';

const UserCard = ({ user, onViewHistory }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Generate initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Get random color based on user ID for avatar background
    const getAvatarColor = (id) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500',
            'bg-pink-500', 'bg-yellow-500', 'bg-red-500',
            'bg-indigo-500', 'bg-teal-500'
        ];
        const index = id?.charCodeAt(0) % colors.length || 0;
        return colors[index];
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(user._id)}`}>
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">{user.name || 'No Name'}</h3>
                        <p className="text-sm text-gray-500 truncate">{user.email || 'No Email'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{user.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Login Type</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.loginType === 'EMAIL' ? 'bg-green-100 text-green-800' :
                                user.loginType === 'GOOGLE' ? 'bg-blue-100 text-blue-800' :
                                    user.loginType === 'FACEBOOK' ? 'bg-indigo-100 text-indigo-800' :
                                        user.loginType === 'APPLE' ? 'bg-gray-100 text-gray-800' :
                                            'bg-purple-100 text-purple-800'
                            }`}>
                            {user.loginType || 'N/A'}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500">Created</p>
                        <p className="font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Last Login</p>
                        <p className="font-medium">{formatDate(user.lastLogin)}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isPhoneVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {user.isPhoneVerified ? 'Phone Verified' : 'Phone Not Verified'}
                    </span>

                    <button
                        onClick={() => onViewHistory(user._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                    >
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;