// import React from 'react';
// import { Users, CreditCard, TrendingUp, DollarSign, Wallet, Activity } from 'lucide-react';

// const StatsCards = ({ stats }) => {
//   const cards = [
//     {
//       title: 'Total Users',
//       value: stats.totalUsers.toLocaleString(),
//       growth: stats.totalUsersGrowth,
//       icon: Users,
//       color: 'blue',
//       bgColor: 'bg-blue-50',
//       iconColor: 'text-blue-600'
//     },
//     {
//       title: 'Active Users',
//       value: stats.activeUsers.toLocaleString(),
//       growth: stats.activeUsersGrowth,
//       icon: Activity,
//       color: 'green',
//       bgColor: 'bg-green-50',
//       iconColor: 'text-green-600'
//     },
//     {
//       title: 'Total Revenue',
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       growth: stats.revenueGrowth,
//       icon: DollarSign,
//       color: 'purple',
//       bgColor: 'bg-purple-50',
//       iconColor: 'text-purple-600'
//     },
//     {
//       title: 'Plans Purchased',
//       value: stats.plansPurchased.toLocaleString(),
//       growth: stats.plansPurchasedGrowth,
//       icon: TrendingUp,
//       color: 'orange',
//       bgColor: 'bg-orange-50',
//       iconColor: 'text-orange-600'
//     },
//     {
//       title: 'Wallet Balance',
//       value: `₹${stats.walletBalance.toLocaleString()}`,
//       growth: stats.walletBalanceGrowth,
//       icon: Wallet,
//       color: 'indigo',
//       bgColor: 'bg-indigo-50',
//       iconColor: 'text-indigo-600'
//     },
//     {
//       title: 'Property Interactions',
//       value: stats.propertyInteractions.toLocaleString(),
//       growth: stats.propertyInteractionsGrowth,
//       icon: CreditCard,
//       color: 'pink',
//       bgColor: 'bg-pink-50',
//       iconColor: 'text-pink-600'
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {cards.map((card, index) => {
//         const Icon = card.icon;
//         const isPositive = card.growth > 0;
        
//         return (
//           <div
//             key={index}
//             className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">{card.title}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
//               </div>
//               <div className={`p-3 rounded-lg ${card.bgColor}`}>
//                 <Icon className={`w-6 h-6 ${card.iconColor}`} />
//               </div>
//             </div>
            
//             <div className="mt-4 flex items-center">
//               <div className={`flex items-center text-sm font-medium ${
//                 isPositive ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? '' : 'rotate-180'}`} />
//                 {Math.abs(card.growth)}%
//               </div>
//               <span className="text-gray-500 text-sm ml-2">from last period</span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default StatsCards;


import React from 'react';
import { Users, UserCheck, DollarSign, CreditCard, Wallet, Activity, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers?.toLocaleString() || '0',
      growth: stats.totalUsersGrowth || 0,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers?.toLocaleString() || '0',
      growth: stats.activeUsersGrowth || 0,
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'Paid Users',
      value: stats.totalPaidUsers?.toLocaleString() || '0',
      growth: stats.paidUsersGrowth || 0,
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || '0'}`,
      growth: stats.revenueGrowth || 0,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Plans Purchased',
      value: stats.plansPurchased?.toLocaleString() || '0',
      growth: stats.plansPurchasedGrowth || 0,
      icon: CreditCard,
      color: 'orange'
    },
    {
      title: 'Total Wallet Balance',
      value: `₹${stats.walletBalance?.toLocaleString() || '0'}`,
      growth: stats.walletBalanceGrowth || 0,
      icon: Wallet,
      color: 'indigo'
    },
    {
      title: 'Property Interactions',
      value: stats.propertyInteractions?.toLocaleString() || '0',
      growth: stats.propertyInteractionsGrowth || 0,
      icon: Activity,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      emerald: 'text-emerald-600 bg-emerald-100',
      orange: 'text-orange-600 bg-orange-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = getColorClasses(card.color);

        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`w-4 h-4 ${card.growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ml-1 ${card.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {card.growth >= 0 ? '+' : ''}{card.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;