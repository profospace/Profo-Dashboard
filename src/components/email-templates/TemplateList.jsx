import React from 'react';
import { FiEdit, FiTrash2, FiCheck, FiEye } from 'react-icons/fi';

const TemplateList = ({
    templates,
    activeTemplate,
    selectedTemplate,
    onPreview,
    onEdit,
    onDelete,
    onActivate
}) => {
    return (
        <div className="overflow-y-auto max-h-80">
            {templates.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">No templates found</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {templates.map(template => (
                        <div
                            key={template._id}
                            className={`border rounded-lg p-3 transition-all duration-150 cursor-pointer ${selectedTemplate && selectedTemplate._id === template._id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            onClick={() => onPreview(template)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="truncate" style={{ maxWidth: 'calc(100% - 80px)' }}>
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                                        {activeTemplate && activeTemplate._id === template._id && (
                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{template.subject}</p>
                                </div>

                                <div className="flex space-x-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPreview(template);
                                        }}
                                        className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                        title="Preview"
                                    >
                                        <FiEye size={16} />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(template);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        title="Edit"
                                    >
                                        <FiEdit size={16} />
                                    </button>

                                    {!(activeTemplate && activeTemplate._id === template._id) && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onActivate(template._id);
                                                }}
                                                className="text-gray-400 hover:text-green-500 transition-colors p-1"
                                                title="Set as active"
                                            >
                                                <FiCheck size={16} />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(template._id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplateList;