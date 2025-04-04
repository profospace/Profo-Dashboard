import React from 'react';

const UserTable = ({ users, onSort, currentSort, onViewHistory }) => {
    const handleSort = (sortBy) => {
        const sortOrder = currentSort.sortBy === sortBy && currentSort.sortOrder === 'asc' ? 'desc' : 'asc';
        onSort(sortBy, sortOrder);
    };

    const renderSortIcon = (column) => {
        if (currentSort.sortBy !== column) return null;

        return currentSort.sortOrder === 'asc'
            ? <span className="ml-1">↑</span>
            : <span className="ml-1">↓</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Name {renderSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Email {renderSortIcon('email')}
                        </th>
                        <th onClick={() => handleSort('phone')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Phone {renderSortIcon('phone')}
                        </th>
                        <th onClick={() => handleSort('loginType')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Login Type {renderSortIcon('loginType')}
                        </th>
                        <th onClick={() => handleSort('isPhoneVerified')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Phone Verified {renderSortIcon('isPhoneVerified')}
                        </th>
                        <th onClick={() => handleSort('createdAt')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Created At {renderSortIcon('createdAt')}
                        </th>
                        <th onClick={() => handleSort('lastLogin')} className="px-6 py-3 text-left text-sm font-medium cursor-pointer hover:bg-blue-600">
                            Last Login {renderSortIcon('lastLogin')}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users?.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.phone || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.loginType === 'EMAIL' ? 'bg-green-100 text-green-800' :
                                            user.loginType === 'GOOGLE' ? 'bg-blue-100 text-blue-800' :
                                                user.loginType === 'FACEBOOK' ? 'bg-indigo-100 text-indigo-800' :
                                                    user.loginType === 'APPLE' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-purple-100 text-purple-800'
                                        }`}>
                                        {user.loginType || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isPhoneVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.isPhoneVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.lastLogin)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onViewHistory(user._id)}
                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition duration-300"
                                    >
                                        View History
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;