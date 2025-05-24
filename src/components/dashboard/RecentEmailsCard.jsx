import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail, FiEye, FiMousePointer, FiAlertTriangle } from 'react-icons/fi';

const RecentEmailsCard = ({ emails = [] }) => {
    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <FiMail className="text-blue-500" />;
            case 'opened':
                return <FiEye className="text-green-500" />;
            case 'clicked':
                return <FiMousePointer className="text-purple-500" />;
            case 'failed':
                return <FiAlertTriangle className="text-red-500" />;
            default:
                return <FiMail className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Emails</h2>
                <Link
                    to="/email-logs"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                    View all
                    <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>

            {emails.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">No recent emails found</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Recipient
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {emails.map((email) => (
                                <tr key={email._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                            {email.recipient?.email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="mr-2">
                                                {getStatusIcon(email.status)}
                                            </span>
                                            <span className={`text-sm font-medium ${email.status === 'sent' ? 'text-blue-600' :
                                                    email.status === 'opened' ? 'text-green-600' :
                                                        email.status === 'clicked' ? 'text-purple-600' :
                                                            'text-red-600'
                                                }`}>
                                                {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(email.sentAt)}
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

export default RecentEmailsCard;