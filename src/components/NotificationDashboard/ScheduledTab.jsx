import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Badge from '../../components/NotificationDashboard/Badge';

const ScheduledTab = () => {
    const [scheduledNotifications, setScheduledNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScheduledNotifications();
    }, []);

    const fetchScheduledNotifications = async () => {
        try {
            // Mock data for demonstration
            setTimeout(() => {
                setScheduledNotifications([
                    {
                        id: '1',
                        name: 'Daily Price Alerts',
                        template: 'Price Drop',
                        schedule: 'Daily at 10:00 AM',
                        nextRun: new Date(Date.now() + 86400000), // Tomorrow
                        recipients: 'Filter: priceAlerts=true',
                        status: 'Active'
                    },
                    {
                        id: '2',
                        name: 'Weekly Digest',
                        template: 'Weekly Summary',
                        schedule: 'Every Monday at 9:00 AM',
                        nextRun: new Date(Date.now() + 259200000), // 3 days from now
                        recipients: 'All active users',
                        status: 'Active'
                    },
                    {
                        id: '3',
                        name: 'Abandoned Cart Reminder',
                        template: 'Checkout Reminder',
                        schedule: '3 hours after abandonment',
                        nextRun: new Date(Date.now() + 10800000), // 3 hours from now
                        recipients: 'Event: cart_abandoned',
                        status: 'Paused'
                    }
                ]);
                setLoading(false);
            }, 800);
        } catch (err) {
            console.error('Failed to fetch scheduled notifications:', err);
            setLoading(false);
        }
    };

    const toggleStatus = (id) => {
        setScheduledNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, status: notification.status === 'Active' ? 'Paused' : 'Active' }
                    : notification
            )
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Scheduled Notifications</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition duration-150 ease-in-out">
                    <Plus size={16} className="mr-1" />
                    New Schedule
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                </div>
            ) : (
                <div className="border rounded-lg overflow-auto">
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
                                        <div className="text-sm text-gray-500">{notification.schedule}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {notification.nextRun.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{notification.recipients}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge status={notification.status}>
                                            {notification.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className={`text-${notification.status === 'Active' ? 'yellow' : 'green'}-600 hover:text-${notification.status === 'Active' ? 'yellow' : 'green'}-900 mr-3 transition duration-150`}
                                            onClick={() => toggleStatus(notification.id)}
                                        >
                                            {notification.status === 'Active' ? 'Pause' : 'Activate'}
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-900 mr-3 transition duration-150">
                                            Edit
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 transition duration-150">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScheduledTab;