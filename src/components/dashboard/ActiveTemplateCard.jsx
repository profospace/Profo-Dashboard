import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMail, FiArrowRight } from 'react-icons/fi';

const ActiveTemplateCard = ({ template }) => {
    // Create a safe preview by truncating HTML content
    const createPreview = (htmlContent) => {
        if (!htmlContent) return '';

        // Remove HTML tags for preview
        const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
        return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Active Email Template</h2>
                <div className="p-2 rounded-full bg-purple-50">
                    <FiFileText className="h-5 w-5 text-purple-600" />
                </div>
            </div>

            {!template ? (
                <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No active email template found</p>
                    <Link
                        to="/email-templates"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Create Template
                        <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="font-medium">{template.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <FiMail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Subject</p>
                            <p className="text-sm">{template.subject}</p>
                        </div>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm font-medium text-gray-500 mb-1">Preview</p>
                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 overflow-hidden">
                            {createPreview(template.htmlContent)}
                        </div>
                    </div>

                    <Link
                        to="/email-templates"
                        className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Manage Templates
                        <FiArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ActiveTemplateCard;