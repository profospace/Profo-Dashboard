import React from 'react';
import { FiMail, FiEye, FiMousePointer, FiAlertTriangle } from 'react-icons/fi';

const EmailLogTable = ({ emailLogs }) => {
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

    // Get status icon and color
    const getStatusInfo = (status) => {
        switch (status) {
            case 'sent':
                return {
                    icon: <FiMail className="h-4 w-4 text-blue-500" />,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800'
                };
            case 'opened':
                return {
                    icon: <FiEye className="h-4 w-4 text-green-500" />,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800'
                };
            case 'clicked':
                return {
                    icon: <FiMousePointer className="h-4 w-4 text-purple-500" />,
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-800'
                };
            case 'failed':
                return {
                    icon: <FiAlertTriangle className="h-4 w-4 text-red-500" />,
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800'
                };
            default:
                return {
                    icon: <FiMail className="h-4 w-4 text-gray-500" />,
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800'
                };
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recipient
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subject
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sent At
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Opened/Clicked
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {emailLogs.map(log => {
                            const { icon, bgColor, textColor } = getStatusInfo(log.status);

                            return (
                                <tr key={log._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {log?.recipient?.email}
                                        </div>
                                        {log?.recipient?.userId && (
                                            <div className="text-xs text-gray-500">
                                                ID: {typeof log.recipient.userId === 'object' ?
                                                    log.recipient.userId._id || 'N/A' :
                                                    log.recipient.userId}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{log.subject}</div>
                                        {log.templateId && (
                                            <div className="text-xs text-gray-500">
                                                Template: {typeof log.templateId === 'object' ?
                                                    log.templateId.name || 'Unknown' :
                                                    log.templateId}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                                            {icon}
                                            <span className="ml-1.5">{log.status.charAt(0).toUpperCase() + log.status.slice(1)}</span>
                                        </span>
                                        {log.status === 'failed' && log.error && (
                                            <div className="text-xs text-red-500 mt-1 max-w-xs truncate" title={log.error}>
                                                {log.error}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(log.sentAt)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        {log.status === 'opened' && log.openedAt && (
                                            <div>
                                                <div className="text-green-600 font-medium">
                                                    Opened: {formatDate(log.openedAt)}
                                                </div>
                                                {log.openCount > 1 && (
                                                    <div className="text-xs text-gray-500">
                                                        Opened {log.openCount} times
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {log.status === 'clicked' && log.clickedAt && (
                                            <div>
                                                <div className="text-purple-600 font-medium">
                                                    Clicked: {formatDate(log.clickedAt)}
                                                </div>
                                                {log.clickCount > 1 && (
                                                    <div className="text-xs text-gray-500">
                                                        Clicked {log.clickCount} times
                                                    </div>
                                                )}
                                                {log.lastClickedUrl && (
                                                    <div className="text-xs text-gray-500 truncate max-w-xs" title={log.lastClickedUrl}>
                                                        URL: {log.lastClickedUrl}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmailLogTable;