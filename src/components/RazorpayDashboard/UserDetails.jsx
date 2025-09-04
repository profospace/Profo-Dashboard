import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, DollarSign, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

const UserDetails = ({ adminAPI }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTransactions, setUserTransactions] = useState([]);
    const [userPlans, setUserPlans] = useState([]);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUserDetailsAnalytics();
            console.log("response", response)
            setUsers(response);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserTransactionDetails = async (userId) => {
        try {
            const [transactions, plans] = await Promise.all([
                adminAPI.getUserTransactions(userId),
                adminAPI.getUserPlans(userId)
            ]);
            setUserTransactions(transactions);
            setUserPlans(plans);
        } catch (error) {
            console.error('Error fetching user transaction details:', error);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchUserTransactionDetails(user.id);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Details & Transaction History</h2>

                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Users List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => handleUserClick(user)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                ₹{user.totalSpent?.toLocaleString() || 0}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {user.transactionCount || 0} transactions
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Transaction Details */}
                <div className="bg-white rounded-lg shadow">
                    {selectedUser ? (
                        <div>
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                                <p className="text-gray-600">{selectedUser.email}</p>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                                            <span className="text-sm text-green-600">Total Spent</span>
                                        </div>
                                        <p className="text-xl font-semibold text-green-900 mt-1">
                                            ₹{selectedUser.totalSpent?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="text-sm text-blue-600">Active Plans</span>
                                        </div>
                                        <p className="text-xl font-semibold text-blue-900 mt-1">
                                            {userPlans.length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Plans Section */}
                            {userPlans.length > 0 && (
                                <div className="p-6 border-b border-gray-200">
                                    <h4 className="font-medium text-gray-900 mb-3">Active Plans</h4>
                                    <div className="space-y-2">
                                        {userPlans.map(plan => (
                                            <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">{plan.planName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Expires: {new Date(plan.expiryDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-medium text-green-600">
                                                    ₹{plan.amount}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Transactions Section */}
                            <div className="p-6">
                                <h4 className="font-medium text-gray-900 mb-3">Recent Transactions</h4>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {userTransactions.map(transaction => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                                                </p>
                                                <p className="text-xs text-gray-500">{transaction.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Select a user to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;