import React from 'react';
import { Users, CreditCard, TrendingUp, DollarSign, Wallet, Activity } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      growth: stats.totalUsersGrowth,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      growth: stats.activeUsersGrowth,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      growth: stats.revenueGrowth,
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Plans Purchased',
      value: stats.plansPurchased.toLocaleString(),
      growth: stats.plansPurchasedGrowth,
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Wallet Balance',
      value: `₹${stats.walletBalance.toLocaleString()}`,
      growth: stats.walletBalanceGrowth,
      icon: Wallet,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Property Interactions',
      value: stats.propertyInteractions.toLocaleString(),
      growth: stats.propertyInteractionsGrowth,
      icon: CreditCard,
      color: 'pink',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.growth > 0;
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <div className={`flex items-center text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? '' : 'rotate-180'}`} />
                {Math.abs(card.growth)}%
              </div>
              <span className="text-gray-500 text-sm ml-2">from last period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;