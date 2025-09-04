// import React from 'react';
// import { 
//   TrendingUp, 
//   Users, 
//   Target, 
//   AlertTriangle, 
//   CheckCircle, 
//   Clock,
//   ArrowRight,
//   Lightbulb
// } from 'lucide-react';

// const Suggestions = ({ suggestions }) => {
//   const getPriorityColor = (priority) => {
//     const colors = {
//       high: {
//         bg: 'bg-red-50',
//         border: 'border-red-200',
//         text: 'text-red-800',
//         icon: 'text-red-600'
//       },
//       medium: {
//         bg: 'bg-yellow-50',
//         border: 'border-yellow-200',
//         text: 'text-yellow-800',
//         icon: 'text-yellow-600'
//       },
//       low: {
//         bg: 'bg-green-50',
//         border: 'border-green-200',
//         text: 'text-green-800',
//         icon: 'text-green-600'
//       }
//     };
//     return colors[priority] || colors.medium;
//   };

//   const getTypeIcon = (type) => {
//     const icons = {
//       revenue: TrendingUp,
//       engagement: Users,
//       feature: Target,
//       alert: AlertTriangle,
//       optimization: CheckCircle
//     };
//     return icons[type] || Lightbulb;
//   };

//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">AI Insights & Suggestions</h3>
//           <p className="text-gray-600 text-sm mt-1">Data-driven recommendations to optimize your platform</p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Lightbulb className="w-5 h-5 text-yellow-500" />
//           <span className="text-sm font-medium text-gray-700">{suggestions.length} insights</span>
//         </div>
//       </div>
      
//       <div className="space-y-4">
//         {(suggestions || []).map((suggestion, index) => {
//           const colorScheme = getPriorityColor(suggestion.priority);
//           const TypeIcon = getTypeIcon(suggestion.type);
          
//           return (
//             <div
//               key={index}
//               className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg p-4 hover:shadow-md transition-shadow`}
//             >
//               <div className="flex items-start space-x-4">
//                 <div className={`p-2 rounded-lg ${colorScheme.bg} border ${colorScheme.border}`}>
//                   <TypeIcon className={`w-5 h-5 ${colorScheme.icon}`} />
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className={`font-semibold ${colorScheme.text}`}>
//                       {suggestion.title}
//                     </h4>
//                     <div className="flex items-center space-x-2">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
//                         suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-green-100 text-green-800'
//                       }`}>
//                         {suggestion.priority.toUpperCase()}
//                       </span>
//                       <Clock className="w-4 h-4 text-gray-400" />
//                     </div>
//                   </div>
                  
//                   <p className="text-gray-700 text-sm mb-3">
//                     {suggestion.description}
//                   </p>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Target className="w-4 h-4 text-gray-500" />
//                       <span className="text-sm font-medium text-gray-600">
//                         Expected Impact:
//                       </span>
//                       <span className="text-sm text-gray-800 font-medium">
//                         {suggestion.impact}
//                       </span>
//                     </div>
                    
//                     <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
//                       <span>Take Action</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
      
//       {(!suggestions || suggestions.length === 0) && (
//         <div className="text-center py-8">
//           <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
//             <Lightbulb className="w-8 h-8 text-gray-400" />
//           </div>
//           <h4 className="text-gray-900 font-medium mb-2">No Suggestions Available</h4>
//           <p className="text-gray-600 text-sm">
//             AI insights will appear here based on your platform's performance data.
//           </p>
//         </div>
//       )}
      
//       {/* Quick Actions */}
//       <div className="mt-6 pt-6 border-t border-gray-200">
//         <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//           <button className="flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors">
//             <TrendingUp className="w-4 h-4" />
//             <span className="text-sm font-medium">View Revenue Trends</span>
//           </button>
//           <button className="flex items-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors">
//             <Users className="w-4 h-4" />
//             <span className="text-sm font-medium">User Engagement Report</span>
//           </button>
//           <button className="flex items-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors">
//             <Target className="w-4 h-4" />
//             <span className="text-sm font-medium">Optimize Pricing</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Suggestions;


import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, Target } from 'lucide-react';

const Suggestions = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityIcon = (type) => {
    switch (type) {
      case 'revenue':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'engagement':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'feature':
        return <Target className="w-5 h-5 text-blue-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Suggestions</h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getPriorityIcon(suggestion.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${suggestion.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : suggestion.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                    {suggestion.priority} priority
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {suggestion.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Impact: {suggestion.impact}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
