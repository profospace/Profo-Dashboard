// import React, { useState, useEffect } from 'react';
// import { TrendingDown, TrendingUp, Users, Target, ShoppingCart, Eye, Heart, Phone, ArrowRight, Filter, BarChart, PieChart, Activity, Clock, UserCheck, X } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';

// const FunnelAnalyticsDashboard = () => {
//     const [funnelData, setFunnelData] = useState(null);
//     const [intentData, setIntentData] = useState(null);
//     const [journeyPaths, setJourneyPaths] = useState(null);
//     const [selectedProperty, setSelectedProperty] = useState(null);
//     const [propertyFunnel, setPropertyFunnel] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedPeriod, setSelectedPeriod] = useState(30);
//     const [showPropertyModal, setShowPropertyModal] = useState(false);


//     // Fetch funnel data
//     const fetchFunnelData = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/conversion-pipeline?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setFunnelData(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching funnel data:', err);
//         }
//     };

//     // Fetch intent analysis
//     const fetchIntentData = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/user-intent-analysis?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setIntentData(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching intent data:', err);
//         }
//     };

//     // Fetch journey paths
//     const fetchJourneyPaths = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/journey-paths?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setJourneyPaths(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching journey paths:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch property funnel data
//     const fetchPropertyFunnel = async (propertyId) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/property-funnel/${propertyId}?period=${selectedPeriod}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setPropertyFunnel(data.data);
//                     setShowPropertyModal(true);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching property funnel:', err);
//         }
//     };

//     // Initial data fetch
//     useEffect(() => {
//         fetchFunnelData(selectedPeriod);
//         fetchIntentData(selectedPeriod);
//         fetchJourneyPaths(selectedPeriod);
//     }, [selectedPeriod]);

//     // Format currency
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount);
//     };

//     // Get intent color
//     const getIntentColor = (intent) => {
//         const colors = {
//             'HIGH_INTENT_BUYER': 'bg-green-500',
//             'ACTIVE_SEARCHER': 'bg-blue-500',
//             'COMPARISON_SHOPPER': 'bg-yellow-500',
//             'WINDOW_SHOPPER': 'bg-orange-500',
//             'CASUAL_BROWSER': 'bg-gray-500'
//         };
//         return colors[intent] || 'bg-gray-400';
//     };

//     // Get intent icon
//     const getIntentIcon = (intent) => {
//         const icons = {
//             'HIGH_INTENT_BUYER': <Target className="w-5 h-5" />,
//             'ACTIVE_SEARCHER': <Users className="w-5 h-5" />,
//             'COMPARISON_SHOPPER': <ShoppingCart className="w-5 h-5" />,
//             'WINDOW_SHOPPER': <Eye className="w-5 h-5" />,
//             'CASUAL_BROWSER': <Activity className="w-5 h-5" />
//         };
//         return icons[intent] || <Users className="w-5 h-5" />;
//     };

//     // Funnel Visualization Component
//     const FunnelVisualization = ({ data }) => {
//         if (!data) return null;

//         const stages = [
//             { name: 'Visitors', count: data.funnelMetrics.totalVisitors, icon: <Eye className="w-6 h-6" /> },
//             { name: 'Saved', count: data.funnelMetrics.visitToSave, icon: <Heart className="w-6 h-6" /> },
//             { name: 'Contacted', count: data.funnelMetrics.visitToContact, icon: <Phone className="w-6 h-6" /> }
//         ];

//         const maxCount = Math.max(...stages.map(s => s.count));

//         return (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6">Conversion Funnel</h3>
//                 <div className="space-y-4">
//                     {stages.map((stage, index) => {
//                         const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
//                         const dropOffRate = index > 0 ?
//                             ((stages[index - 1].count - stage.count) / stages[index - 1].count * 100).toFixed(1) : 0;

//                         return (
//                             <div key={stage.name}>
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="text-gray-400">{stage.icon}</div>
//                                         <span className="font-medium text-gray-900">{stage.name}</span>
//                                     </div>
//                                     <div className="text-right">
//                                         <span className="text-lg font-semibold text-gray-900">{stage.count}</span>
//                                         {index > 0 && dropOffRate > 0 && (
//                                             <span className="text-sm text-red-600 ml-2">-{dropOffRate}%</span>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="relative">
//                                     <div className="w-full bg-gray-200 rounded-full h-8">
//                                         <div
//                                             className={`h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-500 ${index === 0 ? 'bg-blue-500' :
//                                                     index === 1 ? 'bg-purple-500' : 'bg-green-500'
//                                                 }`}
//                                             style={{ width: `${width}%` }}
//                                         >
//                                             {width > 20 && `${width.toFixed(0)}%`}
//                                         </div>
//                                     </div>
//                                     {index < stages.length - 1 && (
//                                         <div className="absolute right-0 top-10 text-gray-400">
//                                             <ArrowRight className="w-5 h-5" />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="mt-6 grid grid-cols-3 gap-4">
//                     <div className="bg-blue-50 rounded-lg p-4 text-center">
//                         <p className="text-sm text-gray-600">Visit → Save</p>
//                         <p className="text-2xl font-bold text-blue-600">{data.conversionRates.visitToSave}%</p>
//                     </div>
//                     <div className="bg-purple-50 rounded-lg p-4 text-center">
//                         <p className="text-sm text-gray-600">Save → Contact</p>
//                         <p className="text-2xl font-bold text-purple-600">{data.conversionRates.saveToContact}%</p>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4 text-center">
//                         <p className="text-sm text-gray-600">Overall Conversion</p>
//                         <p className="text-2xl font-bold text-green-600">{data.conversionRates.overallConversion}%</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Journey Path Visualization
//     const JourneyPathVisualization = ({ paths }) => {
//         if (!paths || !paths.topJourneyPaths) return null;

//         return (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6">Common User Journey Paths</h3>
//                 <div className="space-y-3">
//                     {paths.topJourneyPaths.slice(0, 10).map((path, index) => (
//                         <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                             <div className="flex-1">
//                                 <div className="flex items-center space-x-2">
//                                     <span className="text-sm font-medium text-gray-900">{path._id}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
//                                     <span>{path.count} users</span>
//                                     {path.avgTimeToContact && (
//                                         <span>Avg. {path.avgTimeToContact.toFixed(1)} hours to contact</span>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="text-right">
//                                 <span className="text-sm font-semibold text-gray-900">
//                                     {((path.count / paths.topJourneyPaths[0].count) * 100).toFixed(0)}%
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {paths.timeBasedConversion && (
//                     <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                         <h4 className="font-medium text-gray-900 mb-2">Time to Conversion Insights</h4>
//                         <div className="space-y-2 text-sm">
//                             <p className="text-gray-700">
//                                 Average days to contact: <span className="font-semibold">{paths.timeBasedConversion.avgDaysToContact?.toFixed(1) || 'N/A'}</span>
//                             </p>
//                             <p className="text-gray-700">
//                                 Conversion rate: <span className="font-semibold">
//                                     {paths.timeBasedConversion.totalVisits > 0
//                                         ? ((paths.timeBasedConversion.convertedToContact / paths.timeBasedConversion.totalVisits) * 100).toFixed(1)
//                                         : 0}%
//                                 </span>
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     // User Intent Distribution
//     const UserIntentDistribution = ({ data }) => {
//         if (!data || !data.intentCategories) return null;

//         const total = data.summary.totalUsers;

//         return (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6">User Intent Analysis</h3>
//                 <div className="space-y-4">
//                     {data.intentCategories.map((category) => {
//                         const percentage = total > 0 ? (category.count / total * 100).toFixed(1) : 0;

//                         return (
//                             <div key={category._id} className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center space-x-3">
//                                         <div className={`p-2 rounded-lg text-white ${getIntentColor(category._id)}`}>
//                                             {getIntentIcon(category._id)}
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-gray-900">
//                                                 {category._id.replace(/_/g, ' ')}
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 {category.count} users • Avg {category.avgInteractions.toFixed(0)} interactions
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <span className="text-lg font-semibold">{percentage}%</span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div
//                                         className={`h-2 rounded-full ${getIntentColor(category._id)}`}
//                                         style={{ width: `${percentage}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="mt-6 grid grid-cols-2 gap-4">
//                     <div className="bg-green-50 rounded-lg p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">High Intent Users</p>
//                                 <p className="text-2xl font-bold text-green-600">{data.summary.highIntentUsers}</p>
//                             </div>
//                             <UserCheck className="w-8 h-8 text-green-500" />
//                         </div>
//                     </div>
//                     <div className="bg-blue-50 rounded-lg p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">Active Searchers</p>
//                                 <p className="text-2xl font-bold text-blue-600">{data.summary.activeSearchers}</p>
//                             </div>
//                             <Target className="w-8 h-8 text-blue-500" />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Property Funnel Modal
//     const PropertyFunnelModal = () => {
//         if (!showPropertyModal || !propertyFunnel) return null;

//         const funnel = propertyFunnel.funnel;
//         const conversionRate = funnel.visitors > 0
//             ? ((funnel.contactors / funnel.visitors) * 100).toFixed(1)
//             : 0;

//         return (
//             <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//                 <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
//                     <div className="flex justify-between items-center mb-4">
//                         <div>
//                             <h3 className="text-lg font-medium text-gray-900">Property Funnel Analysis</h3>
//                             <p className="text-sm text-gray-600 mt-1">{propertyFunnel.property.post_title}</p>
//                         </div>
//                         <button onClick={() => setShowPropertyModal(false)} className="text-gray-400 hover:text-gray-500">
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     <div className="space-y-4">
//                         <div className="grid grid-cols-3 gap-4">
//                             <div className="bg-blue-50 rounded-lg p-4 text-center">
//                                 <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
//                                 <p className="text-2xl font-bold text-blue-600">{funnel.visitors}</p>
//                                 <p className="text-sm text-gray-600">Visitors</p>
//                             </div>
//                             <div className="bg-purple-50 rounded-lg p-4 text-center">
//                                 <Heart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
//                                 <p className="text-2xl font-bold text-purple-600">{funnel.savers}</p>
//                                 <p className="text-sm text-gray-600">Saved</p>
//                             </div>
//                             <div className="bg-green-50 rounded-lg p-4 text-center">
//                                 <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
//                                 <p className="text-2xl font-bold text-green-600">{funnel.contactors}</p>
//                                 <p className="text-sm text-gray-600">Contacted</p>
//                             </div>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-4">
//                             <h4 className="font-medium text-gray-900 mb-3">Conversion Metrics</h4>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                     <span className="text-sm text-gray-600">Overall Conversion Rate</span>
//                                     <span className="font-semibold">{conversionRate}%</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-sm text-gray-600">Dropped after visit</span>
//                                     <span className="font-semibold">{funnel.visitOnly}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-sm text-gray-600">Saved but didn't contact</span>
//                                     <span className="font-semibold">{funnel.saveOnly}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                             <p className="text-sm text-yellow-800">
//                                 <strong>Insight:</strong> This property has a {conversionRate}% conversion rate.
//                                 {conversionRate > 10 ? ' This is above average!' : ' Consider improving property presentation or pricing.'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Drop-off Analysis
//     const DropOffAnalysis = ({ data }) => {
//         if (!data || !data.dropOffAnalysis) return null;

//         const total = data.funnelMetrics.totalVisitors;
//         const dropOffData = [
//             {
//                 stage: 'Dropped after Visit',
//                 count: data.dropOffAnalysis.afterVisit,
//                 percentage: total > 0 ? (data.dropOffAnalysis.afterVisit / total * 100).toFixed(1) : 0,
//                 color: 'bg-red-500'
//             },
//             {
//                 stage: 'Dropped after Save',
//                 count: data.dropOffAnalysis.afterSave,
//                 percentage: total > 0 ? (data.dropOffAnalysis.afterSave / total * 100).toFixed(1) : 0,
//                 color: 'bg-orange-500'
//             },
//             {
//                 stage: 'Completed Journey',
//                 count: data.dropOffAnalysis.completed,
//                 percentage: total > 0 ? (data.dropOffAnalysis.completed / total * 100).toFixed(1) : 0,
//                 color: 'bg-green-500'
//             }
//         ];

//         return (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6">Drop-off Analysis</h3>
//                 <div className="space-y-4">
//                     {dropOffData.map((item, index) => (
//                         <div key={index} className="space-y-2">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium text-gray-700">{item.stage}</span>
//                                 <div className="text-right">
//                                     <span className="text-lg font-semibold text-gray-900">{item.count}</span>
//                                     <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
//                                 </div>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-3">
//                                 <div
//                                     className={`h-3 rounded-full ${item.color} transition-all duration-500`}
//                                     style={{ width: `${item.percentage}%` }}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                     <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
//                     <ul className="space-y-1 text-sm text-gray-600">
//                         <li>• {dropOffData[0].percentage}% of visitors leave without any engagement</li>
//                         <li>• {dropOffData[1].percentage}% show interest but don't reach out</li>
//                         <li>• Focus on converting the {dropOffData[1].count} users who saved properties</li>
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <PropertyFunnelModal />

//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="py-6">
//                         <h1 className="text-3xl font-bold text-gray-900">User Journey & Funnel Analytics</h1>
//                         <p className="mt-2 text-gray-600">Understand how users navigate and convert through your platform</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Period Selector */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() => setSelectedPeriod(7)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 7
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                 }`}
//                         >
//                             Last 7 Days
//                         </button>
//                         <button
//                             onClick={() => setSelectedPeriod(30)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 30
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                 }`}
//                         >
//                             Last 30 Days
//                         </button>
//                         <button
//                             onClick={() => setSelectedPeriod(90)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 90
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                 }`}
//                         >
//                             Last 90 Days
//                         </button>
//                         <button
//                             onClick={() => setSelectedPeriod(120)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 120
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                 }`}
//                         >
//                             Last 120 Days
//                         </button>
//                         <button
//                             onClick={() => setSelectedPeriod(180)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 180
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                 }`}
//                         >
//                             Last 180 Days
//                         </button>
//                         <button
//                             onClick={() => setSelectedPeriod(365)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 365
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                 }`}
//                         >
//                             Last 365 Days
//                         </button>
//                     </div>
//                 </div>

//                 {/* Main Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Funnel Visualization */}
//                     {funnelData && <FunnelVisualization data={funnelData} />}

//                     {/* User Intent Distribution */}
//                     {intentData && <UserIntentDistribution data={intentData} />}
//                 </div>

//                 {/* Secondary Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Journey Paths */}
//                     {journeyPaths && <JourneyPathVisualization paths={journeyPaths} />}

//                     {/* Drop-off Analysis */}
//                     {funnelData && <DropOffAnalysis data={funnelData} />}
//                 </div>

//                 {/* Path Analysis Summary */}
//                 {funnelData && funnelData.pathAnalysis && (
//                     <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//                         <h3 className="text-lg font-medium text-gray-900 mb-6">User Journey Patterns</h3>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {Object.entries(funnelData.pathAnalysis).map(([path, count]) => (
//                                 <div key={path} className="bg-gray-50 rounded-lg p-4">
//                                     <p className="text-sm font-medium text-gray-600 mb-1">{path.replace(/_/g, ' → ')}</p>
//                                     <p className="text-2xl font-bold text-gray-900">{count}</p>
//                                     <p className="text-xs text-gray-500">users</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Actionable Insights */}
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                     <h3 className="text-lg font-medium text-blue-900 mb-4">Actionable Insights</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-3">
//                             <div className="flex items-start">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                         <span className="text-blue-600 font-bold text-sm">1</span>
//                                     </div>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-blue-900">
//                                         <span className="font-semibold">Optimize for mobile</span> -
//                                         {funnelData?.dropOffAnalysis?.afterVisit &&
//                                             ` ${((funnelData.dropOffAnalysis.afterVisit / funnelData.funnelMetrics.totalVisitors) * 100).toFixed(0)}% drop off immediately`
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                         <span className="text-blue-600 font-bold text-sm">2</span>
//                                     </div>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-blue-900">
//                                         <span className="font-semibold">Target saved properties</span> -
//                                         {funnelData?.dropOffAnalysis?.afterSave &&
//                                             ` ${funnelData.dropOffAnalysis.afterSave} users saved but didn't contact`
//                                         }
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-3">
//                             <div className="flex items-start">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                         <span className="text-blue-600 font-bold text-sm">3</span>
//                                     </div>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-blue-900">
//                                         <span className="font-semibold">Focus on high-intent users</span> -
//                                         {intentData?.summary?.highIntentUsers &&
//                                             ` ${intentData.summary.highIntentUsers} users ready to buy`
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                         <span className="text-blue-600 font-bold text-sm">4</span>
//                                     </div>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-blue-900">
//                                         <span className="font-semibold">Reduce time to contact</span> -
//                                         {journeyPaths?.timeBasedConversion?.avgDaysToContact &&
//                                             ` Currently ${journeyPaths.timeBasedConversion.avgDaysToContact.toFixed(1)} days average`
//                                         }
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FunnelAnalyticsDashboard;

import React, { useState, useEffect, useRef } from 'react';
import { TrendingDown, TrendingUp, Users, Target, ShoppingCart, Eye, Heart, Phone, ArrowRight, Filter, BarChart, PieChart, Activity, Clock, UserCheck, X, GitBranch } from 'lucide-react';
import * as d3 from 'd3';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const FunnelAnalyticsDashboard = () => {
    const [funnelData, setFunnelData] = useState(null);
    const [intentData, setIntentData] = useState(null);
    const [journeyPaths, setJourneyPaths] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyFunnel, setPropertyFunnel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [sankeyData, setSankeyData] = useState(null);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [flowUsers, setFlowUsers] = useState(null);
    const [showFlowModal, setShowFlowModal] = useState(false);
    const [showPropertyModal, setShowPropertyModal] = useState(false); // Added missing state
    const [error, setError] = useState(null);
    const sankeyRef = useRef(null);


    // Mock data generator for demonstration
    const generateMockData = () => {
        const mockFunnelData = {
            funnelMetrics: {
                totalVisitors: 1500,
                visitToSave: 450,
                visitToContact: 120
            },
            conversionRates: {
                visitToSave: 30.0,
                saveToContact: 26.7,
                overallConversion: 8.0
            },
            dropOffAnalysis: {
                afterVisit: 1050,
                afterSave: 330,
                completed: 120
            },
            pathAnalysis: {
                VISIT_ONLY: 1050,
                VISIT_SAVE: 330,
                VISIT_SAVE_CONTACT: 120
            }
        };

        const mockIntentData = {
            intentCategories: [
                { _id: 'HIGH_INTENT_BUYER', count: 180, avgInteractions: 5.2 },
                { _id: 'ACTIVE_SEARCHER', count: 320, avgInteractions: 3.8 },
                { _id: 'COMPARISON_SHOPPER', count: 280, avgInteractions: 4.1 },
                { _id: 'WINDOW_SHOPPER', count: 450, avgInteractions: 2.3 },
                { _id: 'CASUAL_BROWSER', count: 270, avgInteractions: 1.8 }
            ],
            summary: {
                totalUsers: 1500,
                highIntentUsers: 180,
                activeSearchers: 320
            }
        };

        const mockJourneyPaths = {
            topJourneyPaths: [
                { _id: 'VISIT → SAVE → CONTACT', count: 120, avgTimeToContact: 2.5 },
                { _id: 'VISIT → CONTACT', count: 80, avgTimeToContact: 1.2 },
                { _id: 'VISIT → SAVE', count: 330, avgTimeToContact: null },
                { _id: 'VISIT', count: 970, avgTimeToContact: null }
            ],
            timeBasedConversion: {
                avgDaysToContact: 2.1,
                totalVisits: 1500,
                convertedToContact: 200
            }
        };

        const mockSankeyData = {
            nodes: [
                { name: 'START' },
                { name: 'VISIT' },
                { name: 'SAVE' },
                { name: 'CONTACT' },
                { name: 'END' }
            ],
            links: [
                { source: 'START', target: 'VISIT', value: 1500, users: [] },
                { source: 'VISIT', target: 'SAVE', value: 450, users: [] },
                { source: 'VISIT', target: 'END', value: 1050, users: [] },
                { source: 'SAVE', target: 'CONTACT', value: 120, users: [] },
                { source: 'SAVE', target: 'END', value: 330, users: [] },
                { source: 'CONTACT', target: 'END', value: 120, users: [] }
            ],
            metrics: {
                totalUsers: 1500,
                visitedUsers: 1500,
                savedUsers: 450,
                contactedUsers: 120,
                conversionRate: '8.0'
            },
            totalJourneys: 1500
        };

        setFunnelData(mockFunnelData);
        setIntentData(mockIntentData);
        setJourneyPaths(mockJourneyPaths);
        setSankeyData(mockSankeyData);
        setLoading(false);
    };

    // Fetch funnel data
    const fetchFunnelData = async (period) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/conversion-pipeline?period=${period}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setFunnelData(data.data);
                }
            } else {
                throw new Error('Failed to fetch funnel data');
            }
        } catch (err) {
            console.error('Error fetching funnel data:', err);
            setError('Failed to load funnel data');
        }
    };

    // Fetch intent analysis
    const fetchIntentData = async (period) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/user-intent-analysis?period=${period}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIntentData(data.data);
                }
            } else {
                throw new Error('Failed to fetch intent data');
            }
        } catch (err) {
            console.error('Error fetching intent data:', err);
            setError('Failed to load intent data');
        }
    };

    // Fetch journey paths
    const fetchJourneyPaths = async (period) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/journey-paths?period=${period}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setJourneyPaths(data.data);
                }
            } else {
                throw new Error('Failed to fetch journey paths');
            }
        } catch (err) {
            console.error('Error fetching journey paths:', err);
            setError('Failed to load journey paths');
        }
    };

    // Fetch property funnel data
    const fetchPropertyFunnel = async (propertyId) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/funnel-analytics/property-funnel/${propertyId}?period=${selectedPeriod}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPropertyFunnel(data.data);
                    setShowPropertyModal(true);
                }
            } else {
                throw new Error('Failed to fetch property funnel');
            }
        } catch (err) {
            console.error('Error fetching property funnel:', err);
            setError('Failed to load property funnel');
        }
    };

    // Fetch Sankey flow data
    const fetchSankeyData = async (period, propertyId = null, userId = null) => {
        try {
            let url = `${base_url}/properties-interaction/api/admin/funnel-analytics/sankey-flow-data?period=${period}`;
            if (propertyId) url += `&propertyId=${propertyId}`;
            if (userId) url += `&userId=${userId}`;

            const response = await fetch(url, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSankeyData(data.data);
                }
            } else {
                throw new Error('Failed to fetch Sankey data');
            }
        } catch (err) {
            console.error('Error fetching Sankey data:', err);
            setError('Failed to load Sankey data');
        }
    };

    // Fetch users for specific flow
    const fetchFlowUsers = async (source, target) => {
        try {
            setSelectedFlow({ source, target });
            const response = await fetch(
                `${base_url}/properties-interaction/api/admin/funnel-analytics/flow-users?source=${source}&target=${target}&period=${selectedPeriod}`,
                getAuthConfig()
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setFlowUsers(data.data);
                    setShowFlowModal(true);
                } else {
                    // Mock data for demonstration
                    const mockFlowUsers = {
                        flowPath: `${source} → ${target}`,
                        users: [
                            {
                                userId: '1',
                                userName: 'John Doe',
                                userEmail: 'john@example.com',
                                userPhone: '+91 9876543210',
                                propertyId: 'prop1',
                                propertyTitle: 'Luxury Villa in Mumbai',
                                propertyPrice: 25000000,
                                propertyLocation: 'Mumbai, Bandra',
                                journey: [{ type: source }, { type: target }]
                            },
                            {
                                userId: '2',
                                userName: 'Jane Smith',
                                userEmail: 'jane@example.com',
                                userPhone: '+91 9876543211',
                                propertyId: 'prop2',
                                propertyTitle: 'Modern Apartment in Delhi',
                                propertyPrice: 15000000,
                                propertyLocation: 'Delhi, Gurgaon',
                                journey: [{ type: source }, { type: target }]
                            }
                        ],
                        totalUsers: 2
                    };
                    setFlowUsers(mockFlowUsers);
                    setShowFlowModal(true);
                }
            } else {
                throw new Error('Failed to fetch flow users');
            }
        } catch (err) {
            console.error('Error fetching flow users:', err);
            // Use mock data on error
            const mockFlowUsers = {
                flowPath: `${source} → ${target}`,
                users: [],
                totalUsers: 0
            };
            setFlowUsers(mockFlowUsers);
            setShowFlowModal(true);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Try to fetch real data first, fallback to mock data
                await Promise.all([
                    fetchFunnelData(selectedPeriod),
                    fetchIntentData(selectedPeriod),
                    fetchJourneyPaths(selectedPeriod),
                    fetchSankeyData(selectedPeriod)
                ]);
            } catch (err) {
                console.log('Using mock data due to API error');
                generateMockData();
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedPeriod]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get intent color
    const getIntentColor = (intent) => {
        const colors = {
            'HIGH_INTENT_BUYER': 'bg-green-500',
            'ACTIVE_SEARCHER': 'bg-blue-500',
            'COMPARISON_SHOPPER': 'bg-yellow-500',
            'WINDOW_SHOPPER': 'bg-orange-500',
            'CASUAL_BROWSER': 'bg-gray-500'
        };
        return colors[intent] || 'bg-gray-400';
    };

    // Get intent icon
    const getIntentIcon = (intent) => {
        const icons = {
            'HIGH_INTENT_BUYER': <Target className="w-5 h-5" />,
            'ACTIVE_SEARCHER': <Users className="w-5 h-5" />,
            'COMPARISON_SHOPPER': <ShoppingCart className="w-5 h-5" />,
            'WINDOW_SHOPPER': <Eye className="w-5 h-5" />,
            'CASUAL_BROWSER': <Activity className="w-5 h-5" />
        };
        return icons[intent] || <Users className="w-5 h-5" />;
    };

    // Funnel Visualization Component
    const FunnelVisualization = ({ data }) => {
        if (!data) return null;

        const stages = [
            { name: 'Visitors', count: data.funnelMetrics.totalVisitors, icon: <Eye className="w-6 h-6" /> },
            { name: 'Saved', count: data.funnelMetrics.visitToSave, icon: <Heart className="w-6 h-6" /> },
            { name: 'Contacted', count: data.funnelMetrics.visitToContact, icon: <Phone className="w-6 h-6" /> }
        ];

        const maxCount = Math.max(...stages.map(s => s.count));

        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Conversion Funnel</h3>
                <div className="space-y-4">
                    {stages.map((stage, index) => {
                        const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                        const dropOffRate = index > 0 ?
                            ((stages[index - 1].count - stage.count) / stages[index - 1].count * 100).toFixed(1) : 0;

                        return (
                            <div key={stage.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-gray-400">{stage.icon}</div>
                                        <span className="font-medium text-gray-900">{stage.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-semibold text-gray-900">{stage.count}</span>
                                        {index > 0 && dropOffRate > 0 && (
                                            <span className="text-sm text-red-600 ml-2">-{dropOffRate}%</span>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-8">
                                        <div
                                            className={`h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-500 ${index === 0 ? 'bg-blue-500' :
                                                    index === 1 ? 'bg-purple-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${width}%` }}
                                        >
                                            {width > 20 && `${width.toFixed(0)}%`}
                                        </div>
                                    </div>
                                    {index < stages.length - 1 && (
                                        <div className="absolute right-0 top-10 text-gray-400">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Visit → Save</p>
                        <p className="text-2xl font-bold text-blue-600">{data.conversionRates.visitToSave}%</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Save → Contact</p>
                        <p className="text-2xl font-bold text-purple-600">{data.conversionRates.saveToContact}%</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Overall Conversion</p>
                        <p className="text-2xl font-bold text-green-600">{data.conversionRates.overallConversion}%</p>
                    </div>
                </div>
            </div>
        );
    };

    // Journey Path Visualization
    const JourneyPathVisualization = ({ paths }) => {
        if (!paths || !paths.topJourneyPaths) return null;

        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Common User Journey Paths</h3>
                <div className="space-y-3">
                    {paths.topJourneyPaths.slice(0, 10).map((path, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">{path._id}</span>
                                </div>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                    <span>{path.count} users</span>
                                    {path.avgTimeToContact && (
                                        <span>Avg. {path.avgTimeToContact.toFixed(1)} hours to contact</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-gray-900">
                                    {((path.count / paths.topJourneyPaths[0].count) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {paths.timeBasedConversion && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Time to Conversion Insights</h4>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                                Average days to contact: <span className="font-semibold">{paths.timeBasedConversion.avgDaysToContact?.toFixed(1) || 'N/A'}</span>
                            </p>
                            <p className="text-gray-700">
                                Conversion rate: <span className="font-semibold">
                                    {paths.timeBasedConversion.totalVisits > 0
                                        ? ((paths.timeBasedConversion.convertedToContact / paths.timeBasedConversion.totalVisits) * 100).toFixed(1)
                                        : 0}%
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // User Intent Distribution
    const UserIntentDistribution = ({ data }) => {
        if (!data || !data.intentCategories) return null;

        const total = data.summary.totalUsers;

        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">User Intent Analysis</h3>
                <div className="space-y-4">
                    {data.intentCategories.map((category) => {
                        const percentage = total > 0 ? (category.count / total * 100).toFixed(1) : 0;

                        return (
                            <div key={category._id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg text-white ${getIntentColor(category._id)}`}>
                                            {getIntentIcon(category._id)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {category._id.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {category.count} users • Avg {category.avgInteractions.toFixed(0)} interactions
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-semibold">{percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${getIntentColor(category._id)}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">High Intent Users</p>
                                <p className="text-2xl font-bold text-green-600">{data.summary.highIntentUsers}</p>
                            </div>
                            <UserCheck className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Searchers</p>
                                <p className="text-2xl font-bold text-blue-600">{data.summary.activeSearchers}</p>
                            </div>
                            <Target className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Simplified Sankey Diagram Component
    const SankeyDiagram = ({ data }) => {
        useEffect(() => {
            if (!data || !sankeyRef.current) return;

            // Clear previous diagram
            d3.select(sankeyRef.current).selectAll("*").remove();

            const margin = { top: 20, right: 150, bottom: 20, left: 50 };
            const width = 1000 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select(sankeyRef.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Simplified node positioning
            const nodeWidth = 20;
            const nodePadding = 40;

            // Position nodes manually for simplicity
            const nodePositions = {
                'START': { x: 0, y: height / 2 - 50, width: nodeWidth, height: 100 },
                'VISIT': { x: 200, y: height / 2 - 80, width: nodeWidth, height: 160 },
                'SAVE': { x: 400, y: height / 2 - 30, width: nodeWidth, height: 60 },
                'CONTACT': { x: 600, y: height / 2 - 20, width: nodeWidth, height: 40 },
                'END': { x: 800, y: height / 2 - 60, width: nodeWidth, height: 120 }
            };

            // Color scale
            const color = d3.scaleOrdinal()
                .domain(['START', 'VISIT', 'SAVE', 'CONTACT', 'END'])
                .range(['#6b7280', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']);

            // Draw links first
            data.links.forEach(link => {
                const source = nodePositions[link.source];
                const target = nodePositions[link.target];

                if (source && target) {
                    const strokeWidth = Math.max(2, (link.value / data.metrics.totalUsers) * 100);

                    g.append("path")
                        .attr("d", `M ${source.x + source.width} ${source.y + source.height / 2} 
                                   C ${(source.x + target.x) / 2} ${source.y + source.height / 2} 
                                   ${(source.x + target.x) / 2} ${target.y + target.height / 2} 
                                   ${target.x} ${target.y + target.height / 2}`)
                        .attr("stroke", color(link.source))
                        .attr("stroke-width", strokeWidth)
                        .attr("fill", "none")
                        .attr("opacity", 0.6)
                        .style("cursor", "pointer")
                        .on("click", () => fetchFlowUsers(link.source, link.target))
                        .on("mouseover", function () {
                            d3.select(this).attr("opacity", 0.9);
                        })
                        .on("mouseout", function () {
                            d3.select(this).attr("opacity", 0.6);
                        });

                    // Add link labels
                    g.append("text")
                        .attr("x", (source.x + target.x) / 2)
                        .attr("y", (source.y + target.y) / 2)
                        .attr("text-anchor", "middle")
                        .attr("dy", "0.35em")
                        .style("font-size", "12px")
                        .style("fill", "#4b5563")
                        .style("font-weight", "bold")
                        .text(link.value);
                }
            });

            // Draw nodes
            Object.entries(nodePositions).forEach(([nodeName, pos]) => {
                const node = g.append("g")
                    .attr("transform", `translate(${pos.x}, ${pos.y})`);

                node.append("rect")
                    .attr("width", pos.width)
                    .attr("height", pos.height)
                    .attr("fill", color(nodeName))
                    .attr("opacity", 0.8)
                    .style("cursor", "pointer");

                // Node labels
                node.append("text")
                    .attr("x", nodeName === 'START' || nodeName === 'END' ? pos.width + 10 : -10)
                    .attr("y", pos.height / 2)
                    .attr("text-anchor", nodeName === 'START' || nodeName === 'END' ? "start" : "end")
                    .attr("dy", "0.35em")
                    .style("font-size", "14px")
                    .style("font-weight", "bold")
                    .text(nodeName);
            });

        }, [data]);

        if (!data) return null;

        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">User Journey Flow Visualization</h3>
                    <div className="flex items-center space-x-2">
                        <GitBranch className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">{data.totalJourneys} total journeys tracked</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <svg ref={sankeyRef}></svg>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-600">{data.metrics.totalUsers}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Visited</p>
                        <p className="text-2xl font-bold text-purple-600">{data.metrics.visitedUsers}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Contacted</p>
                        <p className="text-2xl font-bold text-green-600">{data.metrics.contactedUsers}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Conversion</p>
                        <p className="text-2xl font-bold text-yellow-600">{data.metrics.conversionRate}%</p>
                    </div>
                </div>
            </div>
        );
    };

    // Property Funnel Modal
    const PropertyFunnelModal = () => {
        if (!showPropertyModal || !propertyFunnel) return null;

        const funnel = propertyFunnel.funnel;
        const conversionRate = funnel.visitors > 0
            ? ((funnel.contactors / funnel.visitors) * 100).toFixed(1)
            : 0;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Property Funnel Analysis</h3>
                            <p className="text-sm text-gray-600 mt-1">{propertyFunnel.property.post_title}</p>
                        </div>
                        <button onClick={() => setShowPropertyModal(false)} className="text-gray-400 hover:text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-blue-600">{funnel.visitors}</p>
                                <p className="text-sm text-gray-600">Visitors</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <Heart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-purple-600">{funnel.savers}</p>
                                <p className="text-sm text-gray-600">Saved</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-green-600">{funnel.contactors}</p>
                                <p className="text-sm text-gray-600">Contacted</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Conversion Metrics</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Overall Conversion Rate</span>
                                    <span className="font-semibold">{conversionRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Dropped after visit</span>
                                    <span className="font-semibold">{funnel.visitOnly}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Saved but didn't contact</span>
                                    <span className="font-semibold">{funnel.saveOnly}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Insight:</strong> This property has a {conversionRate}% conversion rate.
                                {conversionRate > 10 ? ' This is above average!' : ' Consider improving property presentation or pricing.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Flow Users Modal
    const FlowUsersModal = () => {
        if (!showFlowModal || !flowUsers) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Users in Flow: {flowUsers.flowPath}</h3>
                            <p className="text-sm text-gray-600 mt-1">{flowUsers.totalUsers} users followed this path</p>
                        </div>
                        <button onClick={() => setShowFlowModal(false)} className="text-gray-400 hover:text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-96">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journey</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {flowUsers.users.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.userName || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500">{user.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.userPhone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{user.propertyTitle || 'Unknown Property'}</div>
                                            <div className="text-sm text-gray-500">{user.propertyLocation}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.propertyPrice ? formatCurrency(user.propertyPrice) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-1">
                                                {user.journey.map((step, stepIdx) => (
                                                    <div key={stepIdx} className="flex items-center">
                                                        <span className={`inline-flex px-2 py-1 text-xs rounded ${step.type === 'VISIT' ? 'bg-blue-100 text-blue-700' :
                                                                step.type === 'SAVE' ? 'bg-purple-100 text-purple-700' :
                                                                    step.type === 'CONTACT' ? 'bg-green-100 text-green-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {step.type}
                                                        </span>
                                                        {stepIdx < user.journey.length - 1 && (
                                                            <ArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Drop-off Analysis
    const DropOffAnalysis = ({ data }) => {
        if (!data || !data.dropOffAnalysis) return null;

        const total = data.funnelMetrics.totalVisitors;
        const dropOffData = [
            {
                stage: 'Dropped after Visit',
                count: data.dropOffAnalysis.afterVisit,
                percentage: total > 0 ? (data.dropOffAnalysis.afterVisit / total * 100).toFixed(1) : 0,
                color: 'bg-red-500'
            },
            {
                stage: 'Dropped after Save',
                count: data.dropOffAnalysis.afterSave,
                percentage: total > 0 ? (data.dropOffAnalysis.afterSave / total * 100).toFixed(1) : 0,
                color: 'bg-orange-500'
            },
            {
                stage: 'Completed Journey',
                count: data.dropOffAnalysis.completed,
                percentage: total > 0 ? (data.dropOffAnalysis.completed / total * 100).toFixed(1) : 0,
                color: 'bg-green-500'
            }
        ];

        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Drop-off Analysis</h3>
                <div className="space-y-4">
                    {dropOffData.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                                <div className="text-right">
                                    <span className="text-lg font-semibold text-gray-900">{item.count}</span>
                                    <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                        <li>• {dropOffData[0].percentage}% of visitors leave without any engagement</li>
                        <li>• {dropOffData[1].percentage}% show interest but don't reach out</li>
                        <li>• Focus on converting the {dropOffData[1].count} users who saved properties</li>
                    </ul>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PropertyFunnelModal />
            <FlowUsersModal />

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">User Journey & Funnel Analytics</h1>
                        <p className="mt-2 text-gray-600">Understand how users navigate and convert through your platform</p>
                        {error && (
                            <div className="mt-2 text-red-600 text-sm">
                                {error} - Using demo data
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Period Selector */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedPeriod(7)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 7
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setSelectedPeriod(30)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 30
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setSelectedPeriod(90)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 90
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Last 90 Days
                        </button>
                    </div>
                </div>

                {/* Sankey Diagram - Full Width */}
                {sankeyData && (
                    <div className="mb-8">
                        <SankeyDiagram data={sankeyData} />
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Funnel Visualization */}
                    {funnelData && <FunnelVisualization data={funnelData} />}

                    {/* User Intent Distribution */}
                    {intentData && <UserIntentDistribution data={intentData} />}
                </div>

                {/* Secondary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Journey Paths */}
                    {journeyPaths && <JourneyPathVisualization paths={journeyPaths} />}

                    {/* Drop-off Analysis */}
                    {funnelData && <DropOffAnalysis data={funnelData} />}
                </div>

                {/* Path Analysis Summary */}
                {funnelData && funnelData.pathAnalysis && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">User Journey Patterns</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(funnelData.pathAnalysis).map(([path, count]) => (
                                <div key={path} className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-600 mb-1">{path.replace(/_/g, ' → ')}</p>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-xs text-gray-500">users</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actionable Insights */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">Actionable Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">1</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-900">
                                        <span className="font-semibold">Optimize for mobile</span> -
                                        {funnelData?.dropOffAnalysis?.afterVisit &&
                                            ` ${((funnelData.dropOffAnalysis.afterVisit / funnelData.funnelMetrics.totalVisitors) * 100).toFixed(0)}% drop off immediately`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">2</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-900">
                                        <span className="font-semibold">Target saved properties</span> -
                                        {funnelData?.dropOffAnalysis?.afterSave &&
                                            ` ${funnelData.dropOffAnalysis.afterSave} users saved but didn't contact`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">3</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-900">
                                        <span className="font-semibold">Focus on high-intent users</span> -
                                        {intentData?.summary?.highIntentUsers &&
                                            ` ${intentData.summary.highIntentUsers} users ready to buy`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">4</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-900">
                                        <span className="font-semibold">Reduce time to contact</span> -
                                        {journeyPaths?.timeBasedConversion?.avgDaysToContact &&
                                            ` Currently ${journeyPaths.timeBasedConversion.avgDaysToContact.toFixed(1)} days average`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelAnalyticsDashboard;