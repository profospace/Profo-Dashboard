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
import { Bell } from 'lucide-react';
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

    const tabClasses = (tabName) =>
        `px-4 py-2 font-medium transition duration-150 ease-in-out ${activeTab === tabName
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        }`;

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <header className="mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <Bell className="mr-2" size={24} />
                    Notification Management Dashboard
                </h1>
                <p className="text-gray-600">Create, manage, and schedule notifications for your users</p>
            </header>

            {error && (
                <Alert
                    title="Error"
                    description={error}
                    variant="error"
                />
            )}

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

            <div className="mb-6 flex border-b overflow-x-auto">
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