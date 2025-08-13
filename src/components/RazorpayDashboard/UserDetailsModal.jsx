import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Wallet, 
  CreditCard, 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, userId, adminAPI }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const [details, transactions, plans] = await Promise.all([
        adminAPI.getUserDetails(userId),
        adminAPI.getUserTransactions(userId),
        adminAPI.getUserPlans(userId)
      ]);
      
      setUserDetails(details);
      setUserTransactions(transactions.transactions || []);
      setUserPlans(plans.plans || []);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    const badge = badges[status] || badges.inactive;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getPlanStatusBadge = (plan) => {
    const isExpired = new Date(plan.expiryDate) < new Date();
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
        isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        {isExpired ? 'Expired' : 'Active'}
      </span>
    );
  };

  const totalAmountPaid = userTransactions
    .filter(t => t.type === 'DEBIT' && t.status === 'SUCCESSFUL')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWalletRecharges = userTransactions
    .filter(t => t.type === 'CREDIT' && t.status === 'SUCCESSFUL')
    .reduce((sum, t) => sum + t.amount, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {userDetails?.name || 'Loading...'}
              </h2>
              <p className="text-gray-600">User ID: {userId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading user details...</span>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'transactions', label: 'Transactions', icon: CreditCard },
                  { id: 'plans', label: 'Plans', icon: Package }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* User Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Wallet className="w-8 h-8 text-blue-600" />
                        <span className="text-blue-600 text-sm font-medium">WALLET</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mt-2">
                        ₹{userDetails?.walletBalance?.toLocaleString() || 0}
                      </p>
                      <p className="text-blue-700 text-sm">Current Balance</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-8 h-8 text-green-600" />
                        <span className="text-green-600 text-sm font-medium">RECHARGED</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 mt-2">
                        ₹{totalWalletRecharges.toLocaleString()}
                      </p>
                      <p className="text-green-700 text-sm">Total Recharged</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Package className="w-8 h-8 text-purple-600" />
                        <span className="text-purple-600 text-sm font-medium">SPENT</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 mt-2">
                        ₹{totalAmountPaid.toLocaleString()}
                      </p>
                      <p className="text-purple-700 text-sm">Total Spent</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Package className="w-8 h-8 text-orange-600" />
                        <span className="text-orange-600 text-sm font-medium">PLANS</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900 mt-2">
                        {userPlans.length}
                      </p>
                      <p className="text-orange-700 text-sm">Active Plans</p>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{userDetails?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">
                              {userDetails?.phone || 'N/A'}
                              {userDetails?.isPhoneVerified && (
                                <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Join Date</p>
                            <p className="font-medium text-gray-900">{userDetails?.joinDate || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <div className="mt-1">
                              {getStatusBadge(userDetails?.status || 'inactive')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.type === 'CREDIT' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{transaction.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === 'SUCCESSFUL'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Plan Subscriptions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userPlans.map((plan) => (
                      <div key={plan.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                          {getPlanStatusBadge(plan)}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Plan Type:</span>
                            <span className="font-medium text-gray-900">{plan.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount Paid:</span>
                            <span className="font-medium text-gray-900">₹{plan.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Purchase Date:</span>
                            <span className="font-medium text-gray-900">{plan.purchaseDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expiry Date:</span>
                            <span className="font-medium text-gray-900">{plan.expiryDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Credits Used:</span>
                            <span className="font-medium text-gray-900">
                              {plan.creditsUsed} / {plan.totalCredits}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {userPlans.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No plans purchased yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;