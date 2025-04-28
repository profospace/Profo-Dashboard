import React from 'react';

const WatermarkList = ({ watermarks, onSetActive, onDelete }) => {
    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preview
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {watermarks.map((watermark) => (
                        <tr key={watermark._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center">
                                    <img
                                        src={watermark.url}
                                        alt={watermark.name}
                                        className="h-16 w-16 object-contain"
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{watermark.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                    <div>Size: {formatFileSize(watermark.size)}</div>
                                    <div>Type: {watermark.fileType}</div>
                                    <div>Uploaded: {formatDate(watermark.uploadedAt)}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {watermark.isActive ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {!watermark.isActive && (
                                    <button
                                        onClick={() => onSetActive(watermark._id)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Set Active
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(watermark._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WatermarkList;