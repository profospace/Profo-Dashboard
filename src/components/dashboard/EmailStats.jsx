import React from 'react';
import { FiMail, FiEye, FiMousePointer, FiAlertTriangle } from 'react-icons/fi';

const EmailStats = ({ emails = [] }) => {
    // Calculate statistics
    const totalEmails = emails.length;
    const sent = emails.filter(email => email.status === 'sent').length;
    const opened = emails.filter(email => email.status === 'opened').length;
    const clicked = emails.filter(email => email.status === 'clicked').length;
    const failed = emails.filter(email => email.status === 'failed').length;

    // Calculate percentages
    const sentPercent = totalEmails > 0 ? Math.round((sent / totalEmails) * 100) : 0;
    const openedPercent = totalEmails > 0 ? Math.round((opened / totalEmails) * 100) : 0;
    const clickedPercent = totalEmails > 0 ? Math.round((clicked / totalEmails) * 100) : 0;
    const failedPercent = totalEmails > 0 ? Math.round((failed / totalEmails) * 100) : 0;

    const stats = [
        {
            name: 'Sent',
            value: sent,
            percent: sentPercent,
            color: 'bg-blue-500',
            icon: <FiMail className="h-5 w-5 text-blue-500" />
        },
        {
            name: 'Opened',
            value: opened,
            percent: openedPercent,
            color: 'bg-green-500',
            icon: <FiEye className="h-5 w-5 text-green-500" />
        },
        {
            name: 'Clicked',
            value: clicked,
            percent: clickedPercent,
            color: 'bg-purple-500',
            icon: <FiMousePointer className="h-5 w-5 text-purple-500" />
        },
        {
            name: 'Failed',
            value: failed,
            percent: failedPercent,
            color: 'bg-red-500',
            icon: <FiAlertTriangle className="h-5 w-5 text-red-500" />
        }
    ];

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Performance</h2>

            {totalEmails === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">No email data available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        {stats.map(stat => (
                            <div
                                key={stat.name}
                                className={`${stat.color} transition-all duration-500 ease-in-out`}
                                style={{ width: `${stat.percent}%` }}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map(stat => (
                            <div key={stat.name} className="flex items-center">
                                <div className="mr-2">{stat.icon}</div>
                                <div>
                                    <div className="flex items-center">
                                        <span className="text-lg font-semibold mr-2">{stat.value}</span>
                                        <span className="text-xs text-gray-500">({stat.percent}%)</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{stat.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailStats;