import React from 'react';
import { FiEdit, FiCheck } from 'react-icons/fi';

const TemplatePreview = ({ template, onEdit, isActive, onActivate }) => {
    // Format HTML content for safe preview
    const createPreviewContent = () => {
        if (!template || !template.htmlContent) return '';
        return { __html: template.htmlContent };
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{template.name}</h2>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center"
                    >
                        <FiEdit className="mr-1" />
                        Edit Template
                    </button>

                    {!isActive && (
                        <button
                            onClick={onActivate}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center"
                        >
                            <FiCheck className="mr-1" />
                            Set as Active
                        </button>
                    )}
                </div>
            </div>

            {template.description && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">{template.description}</p>
                </div>
            )}

            <div className="border rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Template Preview</h3>
                <div className="border rounded-lg p-4 bg-white overflow-auto max-h-[500px]">
                    <div dangerouslySetInnerHTML={createPreviewContent()} />
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Available Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-sm p-2 bg-gray-50 rounded-md">
                        <code className="text-purple-600">{'{{userName}}'}</code>
                        <span className="text-gray-600 ml-2">- Recipient's name</span>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded-md">
                        <code className="text-purple-600">{'{{#each recommendations}}...{{/each}}'}</code>
                        <span className="text-gray-600 ml-2">- Loop through recommendations</span>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded-md">
                        <code className="text-purple-600">{'{{title}}'}</code>
                        <span className="text-gray-600 ml-2">- Property title</span>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded-md">
                        <code className="text-purple-600">{'{{price}}'}</code>
                        <span className="text-gray-600 ml-2">- Property price</span>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded-md">
                        <code className="text-purple-600">{'{{location}}'}</code>
                        <span className="text-gray-600 ml-2">- Property location</span>
                    </div>
                    <div className="text-sm p-2 bg-gray-50 rounded-md">
                        <code className="text-purple-600">{'{{bedrooms}}}, {{bathrooms}}, {{area}}'}</code>
                        <span className="text-gray-600 ml-2">- Property details</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;