import React from 'react';
import { FiPlus } from 'react-icons/fi';

const DefaultTemplates = ({ defaultTemplates, onCreate, isSaving }) => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Default Templates</h2>

            {defaultTemplates.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">No default templates available</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {defaultTemplates.map((template, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-3 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{template.description || 'Default template'}</p>
                                </div>

                                <button
                                    onClick={() => onCreate(template)}
                                    disabled={isSaving}
                                    className="bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-1 px-2 rounded transition-colors flex items-center"
                                >
                                    <FiPlus className="mr-1" size={12} />
                                    Use
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <p className="mt-4 text-xs text-gray-500">
                Default templates provide pre-designed layouts that you can customize.
            </p>
        </div>
    );
};

export default DefaultTemplates;