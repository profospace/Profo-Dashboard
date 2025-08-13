import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  UserPlus, 
  CreditCard, 
  Wallet, 
  Phone, 
  MoreHorizontal,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

const RecentActivity = ({ activities, showAll = false }) => {
  const getActivityIcon = (type) => {
    const icons = {
      user_signup: UserPlus,
      plan_purchase: CreditCard,
      wallet_recharge: Wallet,
      property_contact: Phone
    };
    return icons[type] || Info;
  };

  const getActivityColor = (status) => {
    const colors = {
      success: 'text-green-600 bg-green-50',
      info: 'text-blue-600 bg-blue-50',
      warning: 'text-yellow-600 bg-yellow-50',
      error: 'text-red-600 bg-red-50'
    };
    return colors[status] || colors.info;
  };

  const getStatusIcon = (status) => {
    const icons = {
      success: CheckCircle,
      info: Info,
      warning: AlertTriangle,
      error: AlertTriangle
    };
    const StatusIcon = icons[status] || Info;
    return <StatusIcon className="w-4 h-4" />;
  };

  const displayedActivities = showAll ? activities : (activities || []).slice(0, 5);

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${showAll ? 'col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-gray-600 text-sm mt-1">Latest user actions and system events</p>
        </div>
        {!showAll && (
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {(displayedActivities || []).map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.status);
          
          return (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 truncate">
                    {activity.user}
                  </p>
                  <div className="flex items-center space-x-2">
                    {activity.amount && (
                      <span className="text-green-600 font-medium text-sm">
                        +₹{activity.amount.toLocaleString()}
                      </span>
                    )}
                    <div className={`p-1 rounded ${colorClass}`}>
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                <p className="text-gray-500 text-xs mt-2">{activity.timestamp}</p>
              </div>
              
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
      
      {(!displayedActivities || displayedActivities.length === 0) && (
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
            <Info className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No recent activity found</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;