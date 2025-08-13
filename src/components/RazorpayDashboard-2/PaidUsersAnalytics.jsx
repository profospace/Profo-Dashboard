import React from 'react';
import { Users, CreditCard, TrendingUp, Package } from 'lucide-react';

const PaidUsersAnalytics = ({ data }) => {
    
    const { paidUsers, totalRevenue, averageSpending, planBreakdown } = data;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Paid Users Analytics</h3>
                    <p className="text-gray-600 text-sm mt-1">Revenue and spending patterns analysis</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{paidUsers.total.toLocaleString()}</p>
                    <div className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{paidUsers.growth}% growth
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <Users className="w-6 h-6 text-blue-600" />
                        <span className="text-blue-600 text-xs font-medium">PAID USERS</span>
                    </div>
                    <p className="text-xl font-bold text-blue-900 mt-2">{paidUsers.total.toLocaleString()}</p>
                    <p className="text-blue-700 text-sm">Total Paid Users</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <CreditCard className="w-6 h-6 text-green-600" />
                        <span className="text-green-600 text-xs font-medium">REVENUE</span>
                    </div>
                    <p className="text-xl font-bold text-green-900 mt-2">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-green-700 text-sm">Total Revenue</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        <span className="text-purple-600 text-xs font-medium">AVG SPEND</span>
                    </div>
                    <p className="text-xl font-bold text-purple-900 mt-2">₹{averageSpending.toLocaleString()}</p>
                    <p className="text-purple-700 text-sm">Per User</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <Package className="w-6 h-6 text-orange-600" />
                        <span className="text-orange-600 text-xs font-medium">CONVERSION</span>
                    </div>
                    <p className="text-xl font-bold text-orange-900 mt-2">{paidUsers.conversionRate}%</p>
                    <p className="text-orange-700 text-sm">Free to Paid</p>
                </div>
            </div>

            {/* Plan Breakdown */}
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Revenue by Plan Type</h4>
                {planBreakdown.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: plan.color }}
                            ></div>
                            <div>
                                <p className="font-medium text-gray-900">{plan.name}</p>
                                <p className="text-gray-600 text-sm">{plan.users} users • ₹{plan.unitPrice} per plan</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">₹{plan.revenue.toLocaleString()}</p>
                            <p className="text-gray-600 text-sm">{plan.percentage}% of total</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaidUsersAnalytics;