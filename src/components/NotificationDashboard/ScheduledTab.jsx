// import React, { useState, useEffect } from 'react';
// import { Plus } from 'lucide-react';
// import Badge from '../../components/NotificationDashboard/Badge';
// import ScheduleForm from '../../components/NotificationDashboard/ScheduleForm';
// import Alert from './Alert';
// import { base_url } from '../../../utils/base_url';

// const ScheduledTab = () => {
//     const [scheduledNotifications, setScheduledNotifications] = useState([]);
//     const [templates, setTemplates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showAddSchedule, setShowAddSchedule] = useState(false);

//     useEffect(() => {
//         fetchScheduledNotifications();
//         fetchTemplates();
//     }, []);

//     const fetchScheduledNotifications = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/api/notifications/admin/schedules`);
//             const data = await response.json();

//             if (data.success) {
//                 setScheduledNotifications(data.schedules);
//             } else {
//                 setError(data.message || 'Failed to fetch schedules');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to fetch scheduled notifications:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchTemplates = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/notifications/admin/templates`);
//             const data = await response.json();

//             if (data.success) {
//                 setTemplates(data.templates);
//             }
//         } catch (err) {
//             console.error('Failed to fetch templates:', err);
//         }
//     };

//     const toggleStatus = async (id) => {
//         try {
//             const schedule = scheduledNotifications.find(n => n.id === id);
//             const newStatus = schedule.status === 'Active' ? 'Paused' : 'Active';

//             const response = await fetch(`${base_url}/api/notifications/admin/schedules/${id}/status`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ status: newStatus })
//             });

//             const data = await response.json();

//             if (data.success) {
//                 setScheduledNotifications(prev =>
//                     prev.map(notification =>
//                         notification.id === id
//                             ? { ...notification, status: newStatus }
//                             : notification
//                     )
//                 );
//             } else {
//                 setError(data.message || 'Failed to update status');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to toggle status:', err);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this schedule?')) {
//             return;
//         }

//         try {
//             const response = await fetch(`${base_url}/api/notifications/admin/schedules/${id}`, {
//                 method: 'DELETE'
//             });

//             const data = await response.json();

//             if (data.success) {
//                 setScheduledNotifications(prev => prev.filter(n => n.id !== id));
//             } else {
//                 setError(data.message || 'Failed to delete schedule');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to delete schedule:', err);
//         }
//     };

//     const handleSaveSchedule = async (schedule) => {
//         setShowAddSchedule(false);
//         await fetchScheduledNotifications();
//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Scheduled Notifications</h2>
//                 <button
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition duration-150 ease-in-out"
//                     onClick={() => setShowAddSchedule(true)}
//                 >
//                     <Plus size={16} className="mr-1" />
//                     New Schedule
//                 </button>
//             </div>

//             {error && (
//                 <Alert
//                     title="Error"
//                     description={error}
//                     variant="error"
//                 />
//             )}

//             {loading ? (
//                 <div className="animate-pulse">
//                     <div className="h-10 bg-gray-200 rounded mb-4"></div>
//                     <div className="h-20 bg-gray-200 rounded mb-4"></div>
//                     <div className="h-20 bg-gray-200 rounded mb-4"></div>
//                 </div>
//             ) : (
//                 <div className="border rounded-lg overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Name
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Template
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Schedule
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Next Run
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Recipients
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Status
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Actions
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {scheduledNotifications.map((notification) => (
//                                 <tr key={notification.id} className="hover:bg-gray-50 transition-colors duration-150">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm font-medium text-gray-900">{notification.name}</div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-900">{notification.template}</div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-500">{notification.schedule}</div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-500">
//                                             {new Date(notification.nextRun).toLocaleString()}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-500">{notification.recipients}</div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <Badge status={notification.status}>
//                                             {notification.status}
//                                         </Badge>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                         <button
//                                             className={`text-${notification.status === 'Active' ? 'yellow' : 'green'}-600 hover:text-${notification.status === 'Active' ? 'yellow' : 'green'}-900 mr-3 transition duration-150`}
//                                             onClick={() => toggleStatus(notification.id)}
//                                         >
//                                             {notification.status === 'Active' ? 'Pause' : 'Activate'}
//                                         </button>
//                                         <button
//                                             className="text-red-600 hover:text-red-900 transition duration-150"
//                                             onClick={() => handleDelete(notification.id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {showAddSchedule && (
//                 <ScheduleForm
//                     templates={templates}
//                     onClose={() => setShowAddSchedule(false)}
//                     onSave={handleSaveSchedule}
//                 />
//             )}
//         </div>
//     );
// };

// export default ScheduledTab;

import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trash2, Calendar, Clock, Users } from 'lucide-react';
import Badge from '../../components/NotificationDashboard/Badge';
import ScheduleForm from '../../components/NotificationDashboard/ScheduleForm';
import Alert from './Alert';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const ScheduledTab = () => {
    const [scheduledNotifications, setScheduledNotifications] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddSchedule, setShowAddSchedule] = useState(false);

    useEffect(() => {
        fetchScheduledNotifications();
        fetchTemplates();
    }, []);

    const fetchScheduledNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/notifications/admin/schedules`, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setScheduledNotifications(data.schedules);
            } else {
                setError(data.message || 'Failed to fetch schedules');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch scheduled notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${base_url}/api/notifications/admin/templates` , getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setTemplates(data.templates);
            }
        } catch (err) {
            console.error('Failed to fetch templates:', err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const schedule = scheduledNotifications.find(n => n.id === id);
            const newStatus = schedule.status === 'Active' ? 'Paused' : 'Active';

            const data = await axios.put(
                `${base_url}/api/notifications/admin/schedules/${id}/status`,
                { status: newStatus }, // Axios handles JSON.stringify internally
                getAuthConfig()
            );

            // const data = await response.json();

            if (data.success) {
                setScheduledNotifications(prev =>
                    prev.map(notification =>
                        notification.id === id
                            ? { ...notification, status: newStatus }
                            : notification
                    )
                );
            } else {
                setError(data.message || 'Failed to update status');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to toggle status:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this schedule?')) {
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/notifications/admin/schedules/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                setScheduledNotifications(prev => prev.filter(n => n.id !== id));
            } else {
                setError(data.message || 'Failed to delete schedule');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to delete schedule:', err);
        }
    };

    const handleSaveSchedule = async (schedule) => {
        setShowAddSchedule(false);
        await fetchScheduledNotifications();
    };

    // Format the schedule type for display
    const formatScheduleType = (type) => {
        switch (type) {
            case 'daily':
                return 'Daily';
            case 'weekly':
                return 'Weekly (Mondays)';
            case 'monthly':
                return 'Monthly (1st)';
            default:
                return type;
        }
    };

    // Format the date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Scheduled Notifications</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition duration-150 ease-in-out"
                    onClick={() => setShowAddSchedule(true)}
                >
                    <Plus size={16} className="mr-1" />
                    New Schedule
                </button>
            </div>

            {error && (
                <Alert
                    title="Error"
                    description={error}
                    variant="error"
                    onClose={() => setError(null)}
                />
            )}

            {loading ? (
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                </div>
            ) : scheduledNotifications.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No schedules yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new notification schedule.</p>
                    <div className="mt-6">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setShowAddSchedule(true)}
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            New Schedule
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg overflow-scroll">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Template
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Next Run
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Recipients
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scheduledNotifications.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{notification.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{notification.template}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Clock size={14} className="mr-1 text-gray-400" />
                                            {formatScheduleType(notification.schedule)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {formatDate(notification.nextRun)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Users size={14} className="mr-1 text-gray-400" />
                                            {notification.recipients}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge status={notification.status}>
                                            {notification.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className={`text-${notification.status === 'Active' ? 'yellow' : 'green'}-600 hover:text-${notification.status === 'Active' ? 'yellow' : 'green'}-900 mr-3 transition duration-150 inline-flex items-center`}
                                            onClick={() => toggleStatus(notification.id)}
                                        >
                                            {notification.status === 'Active' ? (
                                                <>
                                                    <Pause size={14} className="mr-1" />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={14} className="mr-1" />
                                                    Activate
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900 transition duration-150 inline-flex items-center"
                                            onClick={() => handleDelete(notification.id)}
                                        >
                                            <Trash2 size={14} className="mr-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAddSchedule && (
                <ScheduleForm
                    templates={templates}
                    onClose={() => setShowAddSchedule(false)}
                    onSave={handleSaveSchedule}
                />
            )}
        </div>
    );
};

export default ScheduledTab;