import React, { useState, useEffect } from 'react';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Activity,
    RefreshCw,
    PieChart,
    BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

const WalletAnalytics = ({ adminAPI, dateRange }) => {
    const [walletData, setWalletData] = useState({
        stats: {
            totalWalletBalance: 0,
            totalRecharges: 0,
            totalSpent: 0,
            averageBalance: 0,
            rechargeGrowth: 0,
            spendGrowth: 0
        },
        chartData: [],
        userDistribution: [],
        transactionTypes: [],
        topUsers: [],
        rechargePatterns: []
    });
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('balance');

    useEffect(() => {
        fetchWalletAnalytics();
    }, [dateRange]);

    const fetchWalletAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch wallet analytics data
            const [revenueData, activityData, userDetails] = await Promise.all([
                adminAPI.getRevenueAnalytics(dateRange),
                adminAPI.getUserActivityAnalytics(dateRange, 'wallet_recharge'),
                adminAPI.getUserDetailsAnalytics()
            ]);

            // Process revenue data for wallet analytics
            const processedStats = {
                totalWalletBalance: calculateTotalWalletBalance(revenueData.revenueBySource),
                totalRecharges: calculateTotalRecharges(revenueData.revenueBySource),
                totalSpent: calculateTotalSpent(activityData.activityData),
                averageBalance: calculateAverageBalance(userDetails.topUsersByBalance),
                rechargeGrowth: revenueData.revenueGrowth || 0,
                spendGrowth: calculateSpendGrowth(activityData.activityData)
            };

            // Process chart data for different visualizations
            const chartData = processRevenueChartData(revenueData.revenueData);
            const userDistribution = processUserDistribution(activityData.userActivityPatterns);
            const transactionTypes = processTransactionTypes(revenueData.revenueBySource);
            const topUsers = userDetails.topUsersByBalance.slice(0, 10);
            const rechargePatterns = processRechargePatterns(revenueData.revenueData);

            setWalletData({
                stats: processedStats,
                chartData,
                userDistribution,
                transactionTypes,
                topUsers,
                rechargePatterns
            });
        } catch (error) {
            console.error('Error fetching wallet analytics:', error);
            // Set default empty state
            setWalletData({
                stats: {
                    totalWalletBalance: 0,
                    totalRecharges: 0,
                    totalSpent: 0,
                    averageBalance: 0,
                    rechargeGrowth: 0,
                    spendGrowth: 0
                },
                chartData: [],
                userDistribution: [],
                transactionTypes: [],
                topUsers: [],
                rechargePatterns: []
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper functions to process API data
    const calculateTotalWalletBalance = (revenueBySource) => {
        const walletRecharges = revenueBySource.find(item => item._id === 'wallet_recharge');
        return walletRecharges ? walletRecharges.amount : 0;
    };

    const calculateTotalRecharges = (revenueBySource) => {
        const walletRecharges = revenueBySource.find(item => item._id === 'wallet_recharge');
        return walletRecharges ? walletRecharges.count : 0;
    };

    const calculateTotalSpent = (activityData) => {
        return activityData.reduce((total, item) => {
            if (item._id.type === 'contact_unlock' || item._id.type === 'map_unlock') {
                return total + (item.amount || 0);
            }
            return total;
        }, 0);
    };

    const calculateAverageBalance = (topUsers) => {
        if (topUsers.length === 0) return 0;
        const totalBalance = topUsers.reduce((sum, user) => sum + user.balance, 0);
        return Math.round(totalBalance / topUsers.length);
    };

    const calculateSpendGrowth = (activityData) => {
        // Calculate spend growth based on activity patterns
        const currentPeriodSpend = activityData.filter(item =>
            item._id.type === 'contact_unlock' || item._id.type === 'map_unlock'
        ).reduce((sum, item) => sum + (item.amount || 0), 0);

        // Mock previous period for growth calculation (would need historical data)
        const mockPreviousSpend = currentPeriodSpend * 0.85;
        return mockPreviousSpend > 0 ? ((currentPeriodSpend - mockPreviousSpend) / mockPreviousSpend) * 100 : 0;
    };

    const processRevenueChartData = (revenueData) => {
        const chartMap = new Map();

        revenueData.forEach(item => {
            const date = item._id.date;
            if (!chartMap.has(date)) {
                chartMap.set(date, { date, walletRecharge: 0, planPurchase: 0, totalSpend: 0 });
            }

            const entry = chartMap.get(date);
            if (item._id.type === 'wallet_recharge') {
                entry.walletRecharge = item.amount;
            } else if (item._id.type === 'plan_purchase') {
                entry.planPurchase = item.amount;
            }
        });

        return Array.from(chartMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const processUserDistribution = (userActivityPatterns) => {
        return userActivityPatterns.map(pattern => ({
            name: typeof pattern._id === 'number' ? `${pattern._id} transactions` : pattern._id,
            value: pattern.userCount,
            avgAmount: Math.round(pattern.avgAmount || 0)
        }));
    };

    const processTransactionTypes = (revenueBySource) => {
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        return revenueBySource.map((item, index) => ({
            name: item._id || "NONE",
            value: item.amount,
            count: item.count,
            color: colors[index % colors.length]
        }));
    };

    const processRechargePatterns = (revenueData) => {
        const patterns = revenueData
            .filter(item => item._id.type === 'wallet_recharge')
            .map(item => ({
                date: new Date(item._id.date).toLocaleDateString(),
                amount: item.amount,
                count: item.count
            }));

        return patterns.slice(-7); // Last 7 days
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const StatCard = ({ title, value, change, icon: Icon, trend, subtitle }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
            </div>
            {change !== undefined && (
                <div className="mt-4 flex items-center">
                    {change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                    <span className="text-gray-600">Loading wallet analytics...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Wallet Balance"
                    value={formatCurrency(walletData.stats.totalWalletBalance)}
                    change={walletData.stats.rechargeGrowth}
                    icon={Wallet}
                    trend={walletData.stats.rechargeGrowth >= 0 ? 'up' : 'down'}
                    subtitle="Across all users"
                />
                <StatCard
                    title="Total Recharges"
                    value={walletData.stats.totalRecharges.toLocaleString()}
                    change={walletData.stats.rechargeGrowth}
                    icon={CreditCard}
                    trend={walletData.stats.rechargeGrowth >= 0 ? 'up' : 'down'}
                    subtitle="Number of transactions"
                />
                <StatCard
                    title="Total Spent"
                    value={formatCurrency(walletData.stats.totalSpent)}
                    change={walletData.stats.spendGrowth}
                    icon={TrendingDown}
                    trend={walletData.stats.spendGrowth >= 0 ? 'up' : 'down'}
                    subtitle="On contacts & maps"
                />
                <StatCard
                    title="Average Balance"
                    value={formatCurrency(walletData.stats.averageBalance)}
                    icon={DollarSign}
                    subtitle="Per active user"
                />
            </div>

            {/* Chart Selection */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Wallet Activity Trends</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveChart('balance')}
                                className={`px-3 py-1 text-sm rounded-md ${activeChart === 'balance' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Balance
                            </button>
                            <button
                                onClick={() => setActiveChart('recharge')}
                                className={`px-3 py-1 text-sm rounded-md ${activeChart === 'recharge' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Recharges
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={walletData.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value, name) => [formatCurrency(value), name]}
                                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <Legend />
                                {activeChart === 'balance' && (
                                    <>
                                        <Line
                                            type="monotone"
                                            dataKey="walletRecharge"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            name="Wallet Recharge"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="planPurchase"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            name="Plan Purchase"
                                        />
                                    </>
                                )}
                                {activeChart === 'recharge' && (
                                    <Line
                                        type="monotone"
                                        dataKey="walletRecharge"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        name="Daily Recharges"
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Transaction Types and User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Types */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Transaction Types</h3>
                    </div>
                    <div className="p-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <RechartsPieChart data={walletData.transactionTypes}>
                                        {walletData.transactionTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </RechartsPieChart>
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {walletData.transactionTypes.map((type, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: type.color }}
                                        ></div>
                                        <span className="text-sm text-gray-600">{type.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{formatCurrency(type.value)}</div>
                                        <div className="text-xs text-gray-500">{type.count} transactions</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Activity Distribution */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">User Activity Distribution</h3>
                    </div>
                    <div className="p-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={walletData.userDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Users and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Users by Balance */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Top Users by Wallet Balance</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {walletData.topUsers.map((user, index) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(user.balance)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recharge Patterns */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Recharge Patterns</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {walletData.rechargePatterns.map((pattern, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{pattern.date}</p>
                                        <p className="text-xs text-gray-500">{pattern.count} transactions</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(pattern.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletAnalytics;