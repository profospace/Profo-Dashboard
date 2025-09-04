import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, BarChart3, Calendar, Users } from 'lucide-react';

const RevenueAnalytics = ({ adminAPI, dateRange }) => {
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRevenueAnalytics();
    }, [dateRange]);

    const fetchRevenueAnalytics = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getRevenueAnalytics(dateRange);
            setRevenueData(response);
        } catch (error) {
            console.error('Error fetching revenue analytics:', error);
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

    if (!revenueData) {
        return <div className="text-center py-8">No revenue data available</div>;
    }

    return (
        <div className="space-y-6">
            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">₹{revenueData.totalRevenue?.toLocaleString() || 0}</p>
                            <p className={`text-sm ${revenueData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {revenueData.revenueGrowth >= 0 ? '+' : ''}{revenueData.revenueGrowth?.toFixed(1) || 0}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Plan Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">₹{revenueData.planRevenue?.toLocaleString() || 0}</p>
                            <p className="text-sm text-gray-600">{((revenueData.planRevenue / revenueData.totalRevenue) * 100).toFixed(1)}% of total</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Wallet Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">₹{revenueData.walletRevenue?.toLocaleString() || 0}</p>
                            <p className="text-sm text-gray-600">{((revenueData.walletRevenue / revenueData.totalRevenue) * 100).toFixed(1)}% of total</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Paying Users</p>
                            <p className="text-2xl font-semibold text-gray-900">{revenueData.payingUsers || 0}</p>
                            <p className="text-sm text-gray-600">₹{revenueData.avgRevenuePerUser?.toFixed(2) || 0} avg/user</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Plan Type */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan Type</h3>
                    <div className="space-y-4">
                        {revenueData.revenueByPlanType?.map((planType, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full mr-3 ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][index % 4]
                                        }`}></div>
                                    <span className="text-gray-700 capitalize">{planType.type} Plans</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">₹{planType.revenue.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">{planType.percentage.toFixed(1)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Revenue Trend */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="space-y-3">
                        {revenueData.monthlyTrend?.map((month, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-gray-700">{month.month}</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(month.revenue / Math.max(...revenueData.monthlyTrend.map(m => m.revenue))) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-medium text-gray-900">₹{month.revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Revenue Generators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue Plans</h3>
                    <div className="space-y-3">
                        {revenueData.topPlans?.map((plan, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{plan.name}</p>
                                    <p className="text-sm text-gray-500">{plan.subscribers} subscribers</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">₹{plan.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">₹{plan.avgPerUser} avg/user</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Users</h3>
                    <div className="space-y-3">
                        {revenueData.topUsers?.map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">₹{user.totalSpent.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{user.transactionCount} transactions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Revenue Insights */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Best Performing Plan</h4>
                        <p className="text-2xl font-bold text-blue-600">{revenueData.insights?.bestPlan}</p>
                        <p className="text-sm text-blue-700">₹{revenueData.insights?.bestPlanRevenue?.toLocaleString()} revenue</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Growth Rate</h4>
                        <p className="text-2xl font-bold text-green-600">{revenueData.insights?.growthRate}%</p>
                        <p className="text-sm text-green-700">vs previous period</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Conversion Rate</h4>
                        <p className="text-2xl font-bold text-purple-600">{revenueData.insights?.conversionRate}%</p>
                        <p className="text-sm text-purple-700">users to paid users</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalytics;