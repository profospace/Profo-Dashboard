// import React, { useState, useEffect } from 'react';
// import DashboardStats from '../../components/NotificationDashboard/DashboardStats';
// import TemplatesTab from '../../components/NotificationDashboard/TemplatesTab';
// import SendNotificationsTab from '../../components/NotificationDashboard/SendNotificationsTab';
// import ScheduledNotifications from '../../components/NotificationDashboard/ScheduledNotifications';

// // Main Dashboard Component
// const NotificationDashboard = () => {
//     const [activeTab, setActiveTab] = useState('templates');
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchStats();
//     }, []);

//     const fetchStats = async () => {
//         try {
//             setLoading(true);
//             // This would be replaced with your actual API endpoint
//             // Using setTimeout to simulate API call
//             setTimeout(() => {
//                 const mockData = {
//                     success: true,
//                     stats: {
//                         activeUserCount: 12543,
//                         templateCount: 15,
//                         userPreferences: {
//                             priceAlertsEnabled: 8765,
//                             dailyDigestEnabled: 10234,
//                             totalUsers: 12543
//                         }
//                     }
//                 };
//                 setStats(mockData.stats);
//                 setLoading(false);
//             }, 1000);
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to fetch stats:', err);
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="container mx-auto px-4 py-6">
//                 <h1 className="text-2xl font-bold mb-6">Notification Center</h1>

//                 {stats && <DashboardStats stats={stats} />}

//                 {/* Tab Navigation */}
//                 <div className="mb-6 border-b">
//                     <div className="flex space-x-4">
//                         <button
//                             className={`px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'scheduled'
//                                     ? 'text-blue-600 border-b-2 border-blue-600'
//                                     : 'text-gray-600 hover:text-blue-500'
//                                 }`}
//                             onClick={() => setActiveTab('scheduled')}
//                         >
//                             Scheduled
//                         </button>
//                         <button
//                             className={`px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'templates'
//                                     ? 'text-blue-600 border-b-2 border-blue-600'
//                                     : 'text-gray-600 hover:text-blue-500'
//                                 }`}
//                             onClick={() => setActiveTab('templates')}
//                         >
//                             Templates
//                         </button>
//                         <button
//                             className={`px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'send'
//                                     ? 'text-blue-600 border-b-2 border-blue-600'
//                                     : 'text-gray-600 hover:text-blue-500'
//                                 }`}
//                             onClick={() => setActiveTab('send')}
//                         >
//                             Send Notifications
//                         </button>
//                     </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm">
//                     {activeTab === 'scheduled' && <ScheduledNotifications />}
//                     {activeTab === 'templates' && <TemplatesTab />}
//                     {activeTab === 'send' && <SendNotificationsTab />}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NotificationDashboard;

import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Calendar, Users, BellRing, Activity } from 'lucide-react';
import DashboardStats from '../../components/NotificationDashboard/DashboardStats';
import TemplatesTab from '../../components/NotificationDashboard/TemplatesTab';
import SendNotificationsTab from '../../components/NotificationDashboard/SendNotificationsTab';
import ScheduledTab from '../../components/NotificationDashboard/ScheduledTab';
import HistoryTab from '../../components/NotificationDashboard/HistoryTab';
import Alert from '../../components/NotificationDashboard/Alert';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const NotificationDashboard = () => {
    const [activeTab, setActiveTab] = useState('templates');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/notifications/admin/stats`, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setStats(data.stats);
            } else {
                setError(data.message || 'Failed to fetch notification stats');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    console.log("Stats" , stats)

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-lg shadow h-28"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-5 rounded-lg shadow h-64"></div>
                    <div className="bg-white p-5 rounded-lg shadow h-64"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    if (!stats) {
        return null;
    }
    



    const tabClasses = (tabName) =>
        `px-4 py-2 font-medium transition duration-150 ease-in-out ${activeTab === tabName
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        }`;

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            {/* <header className="mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <Bell className="mr-2" size={24} />
                    Notification Management Dashboard
                </h1>
                <p className="text-gray-600">Create, manage, and schedule notifications for your users</p>
            </header> */}

            {/* {error && (
                <Alert
                    title="Error"
                    description={error}
                    variant="error"
                />
            )} */}

            


            {/* New Notificatio Stats */}

            <div>
                <h2 className="text-xl font-semibold mb-4">Notification Dashboard</h2>
                {stats && !loading && <DashboardStats stats={stats} />}
                {loading && (
                    <div className="flex justify-center my-8">
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                <Users size={20} />
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Active Users</div>
                                <div className="text-2xl font-semibold">{stats.activeUserCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                <BellRing size={20} />
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Templates</div>
                                <div className="text-2xl font-semibold">{stats.templateCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Scheduled Automations</div>
                                <div className="text-2xl font-semibold">{stats.scheduledCount || 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                                <Activity size={20} />
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Sent Today</div>
                                <div className="text-2xl font-semibold">{stats.sentToday || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

               

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Templates */}
                    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center mb-4">
                            <BarChart className="text-gray-400 mr-2" size={20} />
                            <h3 className="text-lg font-medium">Top Templates</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 text-xs uppercase text-gray-500">Template</th>
                                        <th className="text-right py-3 text-xs uppercase text-gray-500">Send Count</th>
                                        <th className="text-right py-3 text-xs uppercase text-gray-500">Last Sent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.topTemplates && stats.topTemplates.length > 0 ? (
                                        stats.topTemplates.map((template, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 text-sm">{template.name}</td>
                                                <td className="py-3 text-sm text-right">{template.sendCount}</td>
                                                <td className="py-3 text-sm text-right text-gray-500">
                                                    {template.lastSentAt ? new Date(template.lastSentAt).toLocaleDateString() : 'Never'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-3 text-center text-sm text-gray-500">No template data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* User Preferences */}
                    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center mb-4">
                            <PieChart className="text-gray-400 mr-2" size={20} />
                            <h3 className="text-lg font-medium">User Preferences</h3>
                        </div>

                        {stats.userPreferences ? (
                            <div className="space-y-4">
                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-blue-600">
                                                Price Alerts
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-blue-600">
                                                {stats.userPreferences.priceAlertsEnabled} / {stats.userPreferences.totalUsers}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                                        <div style={{ width: `${(stats.userPreferences.priceAlertsEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-green-600">
                                                New Property Alerts
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-green-600">
                                                {stats.userPreferences.newPropertyAlertsEnabled} / {stats.userPreferences.totalUsers}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-green-200">
                                        <div style={{ width: `${(stats.userPreferences.newPropertyAlertsEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-purple-600">
                                                Saved Search Alerts
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-purple-600">
                                                {stats.userPreferences.savedSearchAlertsEnabled} / {stats.userPreferences.totalUsers}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-purple-200">
                                        <div style={{ width: `${(stats.userPreferences.savedSearchAlertsEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-yellow-600">
                                                Daily Digest
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-yellow-600">
                                                {stats.userPreferences.dailyDigestEnabled} / {stats.userPreferences.totalUsers}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-yellow-200">
                                        <div style={{ width: `${(stats.userPreferences.dailyDigestEnabled / stats.userPreferences.totalUsers) * 100}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No user preference data available</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-6 flex border-b overflow-x-auto mt-6">
                <button
                    className={tabClasses('templates')}
                    onClick={() => setActiveTab('templates')}
                >
                    Templates
                </button>
                <button
                    className={tabClasses('send')}
                    onClick={() => setActiveTab('send')}
                >
                    Send Notifications
                </button>
                <button
                    className={tabClasses('scheduled')}
                    onClick={() => setActiveTab('scheduled')}
                >
                    Scheduled
                </button>
                <button
                    className={tabClasses('history')}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 transition-all duration-200 ease-in-out">
                {activeTab === 'templates' && <TemplatesTab />}
                {activeTab === 'send' && <SendNotificationsTab />}
                {activeTab === 'scheduled' && <ScheduledTab />}
                {activeTab === 'history' && <HistoryTab />}
            </div>
        </div>
    );
};

export default NotificationDashboard;