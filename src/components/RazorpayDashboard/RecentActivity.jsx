// import React from 'react';
// import { formatDistanceToNow } from 'date-fns';
// import { 
//   UserPlus, 
//   CreditCard, 
//   Wallet, 
//   Phone, 
//   MoreHorizontal,
//   CheckCircle,
//   Info,
//   AlertTriangle
// } from 'lucide-react';

// const RecentActivity = ({ activities, showAll = false }) => {
//   const getActivityIcon = (type) => {
//     const icons = {
//       user_signup: UserPlus,
//       plan_purchase: CreditCard,
//       wallet_recharge: Wallet,
//       property_contact: Phone
//     };
//     return icons[type] || Info;
//   };

//   const getActivityColor = (status) => {
//     const colors = {
//       success: 'text-green-600 bg-green-50',
//       info: 'text-blue-600 bg-blue-50',
//       warning: 'text-yellow-600 bg-yellow-50',
//       error: 'text-red-600 bg-red-50'
//     };
//     return colors[status] || colors.info;
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       success: CheckCircle,
//       info: Info,
//       warning: AlertTriangle,
//       error: AlertTriangle
//     };
//     const StatusIcon = icons[status] || Info;
//     return <StatusIcon className="w-4 h-4" />;
//   };

//   const displayedActivities = showAll ? activities : (activities || []).slice(0, 5);

//   return (
//     <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${showAll ? 'col-span-2' : ''}`}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
//           <p className="text-gray-600 text-sm mt-1">Latest user actions and system events</p>
//         </div>
//         {!showAll && (
//           <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//             View all
//           </button>
//         )}
//       </div>
      
//       <div className="space-y-4">
//         {(displayedActivities || []).map((activity) => {
//           const Icon = getActivityIcon(activity.type);
//           const colorClass = getActivityColor(activity.status);
          
//           return (
//             <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//               <div className={`p-2 rounded-lg ${colorClass}`}>
//                 <Icon className="w-5 h-5" />
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <p className="font-medium text-gray-900 truncate">
//                     {activity.user}
//                   </p>
//                   <div className="flex items-center space-x-2">
//                     {activity.amount && (
//                       <span className="text-green-600 font-medium text-sm">
//                         +₹{activity.amount.toLocaleString()}
//                       </span>
//                     )}
//                     <div className={`p-1 rounded ${colorClass}`}>
//                       {getStatusIcon(activity.status)}
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
//                 <p className="text-gray-500 text-xs mt-2">{activity.timestamp}</p>
//               </div>
              
//               <button className="text-gray-400 hover:text-gray-600 p-1">
//                 <MoreHorizontal className="w-4 h-4" />
//               </button>
//             </div>
//           );
//         })}
//       </div>
      
//       {(!displayedActivities || displayedActivities.length === 0) && (
//         <div className="text-center py-8">
//           <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
//             <Info className="w-6 h-6 text-gray-400" />
//           </div>
//           <p className="text-gray-600">No recent activity found</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecentActivity;

import React from 'react';
import { Activity, User, CreditCard, Package, Eye } from 'lucide-react';

const RecentActivity = ({ activities, showAll = false }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_signup':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'plan_purchase':
        return <Package className="w-4 h-4 text-green-500" />;
      case 'wallet_recharge':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'property_contact':
        return <Eye className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <div key={activity.id || index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                {activity.amount && (
                  <p className="text-sm font-medium text-green-600">
                    ₹{activity.amount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && activities.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;