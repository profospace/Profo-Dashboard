import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiServer, FiClock, FiArrowRight } from 'react-icons/fi';

const ActiveConfigCard = ({ config }) => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Active Email Configuration</h2>
                <div className="p-2 rounded-full bg-blue-50">
                    <FiSettings className="h-5 w-5 text-blue-600" />
                </div>
            </div>

            {!config ? (
                <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No active email configuration found</p>
                    <Link
                        to="/email-config"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Create Configuration
                        <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="font-medium">{config.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <FiServer className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">SMTP Server</p>
                            <p className="text-sm">{config.host}:{config.port} {config.secure ? '(SSL)' : ''}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <FiClock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Schedule</p>
                            <p className="text-sm">{config.schedule || 'Not scheduled'}</p>
                        </div>
                    </div>

                    <Link
                        to="/email-config"
                        className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Edit Configuration
                        <FiArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ActiveConfigCard;