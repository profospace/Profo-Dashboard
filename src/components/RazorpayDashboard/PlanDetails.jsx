import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Users, TrendingUp, Calendar, Target } from 'lucide-react';

const PlanDetails = ({ adminAPI }) => {
    const [planDetails, setPlanDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        fetchPlanDetails();
    }, []);

    const fetchPlanDetails = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getPlanDetailsAnalytics();
            setPlanDetails(response);
            if (response.length > 0) {
                setSelectedPlan(response[0]);
            }
        } catch (error) {
            console.error('Error fetching plan details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Package className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Plans</p>
                            <p className="text-2xl font-semibold text-gray-900">{planDetails.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{planDetails.reduce((sum, plan) => sum + (plan.totalRevenue || 0), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {planDetails.reduce((sum, plan) => sum + (plan.totalSubscribers || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Avg. Revenue/Plan</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{planDetails.length > 0 ? Math.round(planDetails.reduce((sum, plan) => sum + (plan.totalRevenue || 0), 0) / planDetails.length).toLocaleString() : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plans List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Plans Overview</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {planDetails.map(plan => (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedPlan?.id === plan.id ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{plan.name}</h4>
                                        <p className="text-sm text-gray-500">{plan.planType}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                ₹{plan.price}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {plan.totalSubscribers || 0} users
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            ₹{(plan.totalRevenue || 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">Revenue</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plan Details */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    {selectedPlan ? (
                        <div>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{selectedPlan.name}</h3>
                                        <p className="text-gray-600">{selectedPlan.description}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedPlan.recommended
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {selectedPlan.recommended ? 'Recommended' : selectedPlan.planType}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Plan Info */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Plan Information</h4>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Price:</span>
                                                <span className="font-medium">₹{selectedPlan.price}</span>
                                            </div>
                                            {selectedPlan.originalPrice && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Original Price:</span>
                                                    <span className="font-medium line-through text-gray-500">₹{selectedPlan.originalPrice}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Validity:</span>
                                                <span className="font-medium">{selectedPlan.validity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${selectedPlan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedPlan.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedPlan.features && selectedPlan.features.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-2">Features:</h5>
                                                <ul className="space-y-1">
                                                    {selectedPlan.features.map((feature, index) => (
                                                        <li key={index} className="text-sm text-gray-600 flex items-center">
                                                            <Target className="w-3 h-3 text-green-500 mr-2" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Revenue Info */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Revenue Analytics</h4>

                                        <div className="space-y-3">
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-green-700 font-medium">Total Revenue</span>
                                                    <span className="text-2xl font-bold text-green-900">
                                                        ₹{(selectedPlan.totalRevenue || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-700 font-medium">Total Subscribers</span>
                                                    <span className="text-2xl font-bold text-blue-900">
                                                        {selectedPlan.totalSubscribers || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-purple-700 font-medium">Active Subscriptions</span>
                                                    <span className="text-2xl font-bold text-purple-900">
                                                        {selectedPlan.activeSubscriptions || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-orange-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-orange-700 font-medium">Avg. Revenue/User</span>
                                                    <span className="text-xl font-bold text-orange-900">
                                                        ₹{selectedPlan.totalSubscribers > 0 ?
                                                            Math.round((selectedPlan.totalRevenue || 0) / selectedPlan.totalSubscribers) : 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Subscribers */}
                                {selectedPlan.recentSubscribers && selectedPlan.recentSubscribers.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-4">Recent Subscribers</h4>
                                        <div className="space-y-2">
                                            {selectedPlan.recentSubscribers.slice(0, 5).map((subscriber, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{subscriber.name}</p>
                                                        <p className="text-sm text-gray-500">{subscriber.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {new Date(subscriber.purchaseDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">₹{subscriber.amount}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Select a plan to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanDetails;