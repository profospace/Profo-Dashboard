// import React from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import { TrendingUp } from 'lucide-react';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const TransactionChart = ({ data, fullWidth = false }) => {
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           usePointStyle: true,
//           pointStyle: 'circle',
//           padding: 20,
//           font: {
//             size: 12,
//             weight: '500'
//           }
//         }
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         titleColor: '#374151',
//         bodyColor: '#6B7280',
//         borderColor: '#E5E7EB',
//         borderWidth: 1,
//         cornerRadius: 8,
//         padding: 12,
//         displayColors: true,
//         callbacks: {
//           label: function(context) {
//             return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
//           }
//         }
//       }
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false
//         },
//         ticks: {
//           color: '#6B7280',
//           font: {
//             size: 12
//           }
//         }
//       },
//       y: {
//         grid: {
//           color: '#F3F4F6'
//         },
//         ticks: {
//           color: '#6B7280',
//           font: {
//             size: 12
//           },
//           callback: function(value) {
//             return '₹' + (value / 1000) + 'k';
//           }
//         }
//       }
//     },
//     interaction: {
//       mode: 'nearest',
//       axis: 'x',
//       intersect: false
//     },
//     elements: {
//       point: {
//         radius: 4,
//         hoverRadius: 6,
//         borderWidth: 2,
//         hoverBorderWidth: 3
//       },
//       line: {
//         tension: 0.4
//       }
//     }
//   };

//   const totalRevenue = data.datasets.reduce((sum, dataset) => {
//     return sum + (dataset.data || []).reduce((dataSum, value) => dataSum + value, 0);
//   }, 0);

//   const growthRate = 18.7; // This could be calculated from the data

//   return (
//     <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${fullWidth ? 'col-span-2' : ''}`}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">Transaction Analytics</h3>
//           <p className="text-gray-600 text-sm mt-1">Wallet recharges and plan purchases over time</p>
//         </div>
//         <div className="text-right">
//           <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
//           <div className="flex items-center text-green-600 text-sm">
//             <TrendingUp className="w-4 h-4 mr-1" />
//             +{growthRate}% growth
//           </div>
//         </div>
//       </div>
      
//       <div className="h-80">
//         {data.labels && data.labels.length > 0 ? (
//           <Line data={data} options={options} />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             No transaction data available
//           </div>
//         )}
//       </div>
      
//       <div className="mt-6 grid grid-cols-2 gap-4">
//         <div className="bg-blue-50 rounded-lg p-4">
//           <p className="text-blue-600 text-sm font-medium">Avg. Wallet Recharge</p>
//           <p className="text-blue-900 text-xl font-bold mt-1">₹1,847</p>
//         </div>
//         <div className="bg-green-50 rounded-lg p-4">
//           <p className="text-green-600 text-sm font-medium">Avg. Plan Purchase</p>
//           <p className="text-green-900 text-xl font-bold mt-1">₹2,156</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionChart;


import React from 'react';
import { TrendingUp } from 'lucide-react';

const TransactionChart = ({ data, fullWidth = false }) => {
  console.log("data", data)

  if (!data || !data.labels || !data.datasets) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow ${fullWidth ? 'col-span-full' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Analytics</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No transaction data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.datasets.flatMap(dataset => dataset.data)
  );

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction Analytics</h3>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </div>

      <div className="space-y-4">
        {/* Chart Legend */}
        <div className="flex space-x-6">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: dataset.borderColor }}
              ></div>
              <span className="text-sm text-gray-600">{dataset.label}</span>
            </div>
          ))}
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end space-x-2">
          {data.labels.map((label, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full space-y-1">
                {data.datasets.map((dataset, datasetIndex) => {
                  const value = dataset.data[index];
                  const height = maxValue > 0 ? (value / maxValue) * 200 : 0;
                  return (
                    <div
                      key={datasetIndex}
                      className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${height}px`,
                        backgroundColor: dataset.borderColor,
                        minHeight: value > 0 ? '4px' : '0px'
                      }}
                      title={`${dataset.label}: ₹${value.toLocaleString()}`}
                    ></div>
                  );
                })}
              </div>
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          {data.datasets.map((dataset, index) => {
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            return (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-500">{dataset.label} Total</p>
                <p className="text-xl font-semibold text-gray-900">₹{total.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;