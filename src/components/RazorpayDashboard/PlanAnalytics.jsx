// import React from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// import { TrendingUp, Package } from 'lucide-react';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const PlanAnalytics = ({ data, detailed = false }) => {
//   const chartData = {
//     labels: (data.planDistribution || []).map(plan => plan.name),
//     datasets: [
//       {
//         data: (data.planDistribution || []).map(plan => plan.value),
//         backgroundColor: (data.planDistribution || []).map(plan => plan.color),
//         borderColor: '#ffffff',
//         borderWidth: 2,
//         hoverBorderWidth: 3,
//         cutout: '60%'
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           usePointStyle: true,
//           padding: 20,
//           font: {
//             size: 12,
//             weight: '500'
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         titleColor: '#374151',
//         bodyColor: '#6B7280',
//         borderColor: '#E5E7EB',
//         borderWidth: 1,
//         cornerRadius: 8,
//         padding: 12,
//         callbacks: {
//           label: function(context) {
//             return `${context.label}: ${context.parsed}%`;
//           }
//         }
//       }
//     }
//   };

//   const totalRevenue = Object.values(data.revenue || {}).reduce((sum, value) => sum + value, 0);

//   return (
//     <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${detailed ? 'col-span-2' : ''}`}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">Plan Distribution</h3>
//           <p className="text-gray-600 text-sm mt-1">Revenue breakdown by plan types</p>
//         </div>
//         <div className="text-right">
//           <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
//           <div className="flex items-center text-green-600 text-sm">
//             <TrendingUp className="w-4 h-4 mr-1" />
//             +15.3% growth
//           </div>
//         </div>
//       </div>
      
//       <div className="flex flex-col lg:flex-row items-center gap-8">
//         {data.planDistribution && data.planDistribution.length > 0 ? (
//           <div className="w-64 h-64">
//             <Doughnut data={chartData} options={options} />
//           </div>
//         ) : (
//           <div className="w-64 h-64 flex items-center justify-center text-gray-500">
//             No plan data available
//           </div>
//         )}
        
//         <div className="flex-1 space-y-4">
//           {(data.planDistribution || []).map((plan, index) => {
//             const revenue = Object.values(data.revenue || {})[index] || 0;
//             return (
//               <div key={plan.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div 
//                     className="w-4 h-4 rounded-full mr-3"
//                     style={{ backgroundColor: plan.color }}
//                   ></div>
//                   <div>
//                     <p className="font-medium text-gray-900">{plan.name}</p>
//                     <p className="text-gray-600 text-sm">{plan.value}% of total plans</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-gray-900">₹{revenue.toLocaleString()}</p>
//                   <p className="font-bold text-gray-900">₹{(revenue || 0).toLocaleString()}</p>
//                   <p className="text-gray-600 text-sm">Revenue</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
      
//       {detailed && (
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-blue-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <Package className="w-8 h-8 text-blue-600" />
//               <span className="text-blue-600 text-sm font-medium">CONTACT</span>
//             </div>
//             <p className="text-2xl font-bold text-blue-900 mt-2">1,458</p>
//             <p className="text-blue-700 text-sm">Active subscriptions</p>
//           </div>
//           <div className="bg-green-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <Package className="w-8 h-8 text-green-600" />
//               <span className="text-green-600 text-sm font-medium">MAP</span>
//             </div>
//             <p className="text-2xl font-bold text-green-900 mt-2">907</p>
//             <p className="text-green-700 text-sm">Active subscriptions</p>
//           </div>
//           <div className="bg-orange-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <Package className="w-8 h-8 text-orange-600" />
//               <span className="text-orange-600 text-sm font-medium">COMBO</span>
//             </div>
//             <p className="text-2xl font-bold text-orange-900 mt-2">583</p>
//             <p className="text-orange-700 text-sm">Active subscriptions</p>
//           </div>
//           <div className="bg-red-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <Package className="w-8 h-8 text-red-600" />
//               <span className="text-red-600 text-sm font-medium">PREMIUM</span>
//             </div>
//             <p className="text-2xl font-bold text-red-900 mt-2">292</p>
//             <p className="text-red-700 text-sm">Active subscriptions</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlanAnalytics;

import React from 'react';
import { TrendingUp, Package } from 'lucide-react';

const PlanAnalytics = ({ data, detailed = false }) => {
  if (!data || !data.planDistribution) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Analytics</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No plan data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Plan Analytics</h3>
        <Package className="w-5 h-5 text-purple-500" />
      </div>

      <div className="space-y-4">
        {/* Plan Distribution */}
        <div className="space-y-3">
          {data.planDistribution.map((plan, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: plan.color }}
                ></div>
                <span className="text-gray-700">{plan.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{plan.value}%</p>
                </div>
                {detailed && data.revenue && (
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">
                      ₹{(data.revenue[plan.name.toLowerCase().replace(' plans', '')] || 0).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Breakdown */}
        {detailed && data.revenue && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Revenue by Plan Type</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.revenue).map(([planType, revenue]) => (
                <div key={planType} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{planType} Plans</p>
                  <p className="text-lg font-semibold text-gray-900">₹{revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanAnalytics;