import React from 'react';
import { FiMail, FiEye, FiMousePointer, FiAlertTriangle } from 'react-icons/fi';

const EmailMetrics = ({ metrics }) => {
    const metricCards = [
        {
            title: 'Total Sent',
            value: metrics.totalSent,
            icon: <FiMail className="h-5 w-5 text-blue-500" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Open Rate',
            value: `${metrics.openRate}%`,
            icon: <FiEye className="h-5 w-5 text-green-500" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Click Rate',
            value: `${metrics.clickRate}%`,
            icon: <FiMousePointer className="h-5 w-5 text-purple-500" />,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Failed',
            value: metrics.failed,
            icon: <FiAlertTriangle className="h-5 w-5 text-red-500" />,
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricCards.map((card, index) => (
                <div
                    key={index}
                    className={`${card.bgColor} rounded-lg p-4 shadow-sm flex items-center transition-transform duration-200 hover:scale-[1.02]`}
                >
                    <div className="mr-4 p-3 rounded-full bg-white">
                        {card.icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{card.title}</p>
                        <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmailMetrics;