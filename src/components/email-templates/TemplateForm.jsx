import React from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const TemplateForm = ({
    templateForm,
    handleChange,
    saveTemplate,
    cancelEdit,
    isNewTemplate,
    isSaving
}) => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    {isNewTemplate ? 'Create New Template' : 'Edit Template'}
                </h2>
                <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1"
                    title="Cancel"
                >
                    <FiX size={20} />
                </button>
            </div>

            <form onSubmit={saveTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Template Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={templateForm.name}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={templateForm.subject}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={templateForm.description}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-1">
                        HTML Content
                    </label>
                    <textarea
                        id="htmlContent"
                        name="htmlContent"
                        value={templateForm.htmlContent}
                        onChange={handleChange}
                        rows={15}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        You can use Handlebars syntax for dynamic content: <code>{'{{userName}}'}</code>, <code>{'{{#each recommendations}}...{{/each}}'}</code>
                    </p>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave className="mr-2" />
                                Save Template
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TemplateForm;