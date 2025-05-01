import React from 'react';
import { Plus } from './icons';
import { Alert } from './Alert';

// Sample data for scheduled notifications
const scheduledNotifications = [
    {
        id: 1,
        name: 'Price Drop Weekly',
        templateName: 'Price Drop Alert',
        sentAt: '2023-05-15T10:30:00',
        title: 'Price Alert for Downtown Properties',
        recipientCount: 1254,
        recipientType: 'Premium Users',
        status: 'Sent',
        nextRun: '2023-05-22T10:30:00',
        schedule: 'Weekly on Monday, 10:30 AM'
    },
    {
        id: 2,
        name: 'New Listing Alert',
        templateName: 'New Property',
        sentAt: '2023-05-16T09:15:00',
        title: 'New Properties in Your Area',
        recipientCount: 876,
        recipientType: 'Location-based',
        status: 'Scheduled',
        nextRun: '2023-05-23T09:15:00',
        schedule: 'Weekly on Tuesday, 9:15 AM'
    },
    {
        id: 3,
        name: 'Monthly Market Update',
        templateName: 'Market Report',
        sentAt: '2023-05-01T08:00:00',
        title: 'May Market Report',
        recipientCount: 15432,
        recipientType: 'All Users',
        status: 'Failed',
        nextRun: '2023-06-01T08:00:00',
        schedule: 'Monthly on 1st, 8:00 AM'
    }
];

const ScheduledNotifications = () => {
    const [error, setError] = React.useState(null);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Scheduled Notifications</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200">
                    <Plus size={16} className="mr-1" />
                    New Schedule
                </button>
            </div>

            {error && (
                <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-4"
                />
            )}

            <div className="border rounded-lg overflow-hidden">
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
                                    <div className="text-sm text-gray-900">{notification.templateName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{notification.schedule}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(notification.nextRun).toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {notification.recipientCount} users
                                        {notification.recipientType && ` (${notification.recipientType})`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.status === 'Sent' ? 'bg-green-100 text-green-800' :
                                        notification.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {notification.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 transition-colors duration-150">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Showing most recent 20 notifications
                </div>

                <div className="flex">
                    <button className="px-3 py-1 border rounded-l bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-150">
                        Previous
                    </button>
                    <button className="px-3 py-1 border-t border-b border-r rounded-r bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-150">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduledNotifications;