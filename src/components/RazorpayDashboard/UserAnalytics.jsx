import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Users, Clock, Target } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserAnalytics = ({ data }) => {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: data.newUsers || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Active Users',
        data: data.activeUsers || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10B981',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#F3F4F6'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Analytics</h3>
          <p className="text-gray-600 text-sm mt-1">Daily user activity and engagement</p>
        </div>
      </div>
      
      <div className="h-64 mb-6">
        {data.newUsers && data.newUsers.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No user analytics data available
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.userEngagement || 0}%</p>
          <p className="text-gray-600 text-sm">Engagement</p>
        </div>
        <div className="text-center">
          <div className="bg-green-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.avgSessionTime || '0m'}</p>
          <p className="text-gray-600 text-sm">Avg. Session</p>
        </div>
        <div className="text-center">
          <div className="bg-orange-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">92%</p>
          <p className="text-gray-600 text-sm">Retention</p>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;