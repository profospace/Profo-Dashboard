import React, { useState, useEffect } from 'react';
import { Trash } from './icons';
import { Alert } from './Alert';

// Template Form Component
const TemplateForm = ({ template, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        body: '',
        imageUrl: '',
        clickAction: '',
        category: 'system',
        additionalData: {},
        tags: [],
        active: true
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [additionalDataKey, setAdditionalDataKey] = useState('');
    const [additionalDataValue, setAdditionalDataValue] = useState('');
    const [tag, setTag] = useState('');

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name || '',
                title: template.title || '',
                body: template.body || '',
                imageUrl: template.imageUrl || '',
                clickAction: template.clickAction || '',
                category: template.category || 'system',
                additionalData: template.additionalData || {},
                tags: template.tags || [],
                active: template.active !== undefined ? template.active : true
            });
        }
    }, [template]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addAdditionalData = () => {
        if (!additionalDataKey.trim()) return;

        setFormData(prev => ({
            ...prev,
            additionalData: {
                ...prev.additionalData,
                [additionalDataKey]: additionalDataValue
            }
        }));

        setAdditionalDataKey('');
        setAdditionalDataValue('');
    };

    const removeAdditionalData = (key) => {
        const newData = { ...formData.additionalData };
        delete newData[key];

        setFormData(prev => ({
            ...prev,
            additionalData: newData
        }));
    };

    const addTag = () => {
        if (!tag.trim()) return;

        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, tag]
        }));

        setTag('');
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.title.trim() || !formData.body.trim()) {
            setError('Please fill out all required fields');
            return;
        }

        try {
            setSaving(true);

            // Extract variables from the body and title
            const extractVariables = (text) => {
                const matches = text.match(/{{([\w]+)}}/g) || [];
                return matches.map(match => match.replace(/[{}]/g, ''));
            };

            const titleVars = extractVariables(formData.title);
            const bodyVars = extractVariables(formData.body);
            const clickActionVars = extractVariables(formData.clickAction);

            // Combine and deduplicate variables
            const variables = [...new Set([...titleVars, ...bodyVars, ...clickActionVars])];

            // Simulate API call with timeout
            setTimeout(() => {
                const savedTemplate = {
                    ...formData,
                    variables,
                    _id: template?._id || String(Date.now())
                };
                onSave(savedTemplate);
                setSaving(false);
            }, 1000);
        } catch (err) {
            setError('Error saving template');
            console.error('Failed to save template:', err);
            setSaving(false);
        }
    };

    // Modal overlay with animation
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideIn">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {template ? 'Edit Template' : 'Add New Template'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <Alert
                            variant="error"
                            title="Error"
                            description={error}
                            className="mb-4"
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                                placeholder="e.g., price-drop"
                            />
                            <p className="text-xs text-gray-500 mt-1">Unique identifier for this template</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="property">Property</option>
                                <option value="building">Building</option>
                                <option value="project">Project</option>
                                <option value="user">User</option>
                                <option value="system">System</option>
                                <option value="marketing">Marketing</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title*</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                            placeholder="e.g., Price Drop Alert"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can use variables like &#123;&#123;propertyTitle&#125;&#125;
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Body*</label>
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            rows="3"
                            required
                            placeholder="e.g., The price of {{propertyTitle}} in {{location}} has dropped by {{dropPercentage}}!"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                            You can use variables like &#123;&#123;propertyTitle&#125;&#125;
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional image to display with the notification</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Click Action URL</label>
                        <input
                            type="text"
                            name="clickAction"
                            value={formData.clickAction}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="e.g., /property/{{propertyId}}"
                        />
                        <p className="text-xs text-gray-500 mt-1">Where to direct users when they click the notification</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Data</label>

                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={additionalDataKey}
                                onChange={(e) => setAdditionalDataKey(e.target.value)}
                                className="w-1/3 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Key"
                            />
                            <input
                                type="text"
                                value={additionalDataValue}
                                onChange={(e) => setAdditionalDataValue(e.target.value)}
                                className="w-2/3 p-2 border-t border-b border-r rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Value"
                            />
                            <button
                                type="button"
                                onClick={addAdditionalData}
                                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200"
                            >
                                Add
                            </button>
                        </div>

                        {Object.keys(formData.additionalData).length > 0 && (
                            <div className="bg-gray-50 p-2 rounded border mb-2">
                                {Object.entries(formData.additionalData).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center mb-1">
                                        <div>
                                            <span className="font-medium">{key}:</span> {value}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalData(key)}
                                            className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">Extra data to send with the notification</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>

                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Add a tag"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200"
                            >
                                Add
                            </button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 text-gray-600 hover:text-red-500 transition-colors duration-150"
                                        >
                                            <Trash size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">Tags help organize templates</p>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="mr-2 focus:ring-2 focus:ring-blue-500 text-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Only active templates can be used to send notifications</p>
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors duration-200"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 transition-colors duration-200 flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                template ? 'Update Template' : 'Create Template'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TemplateForm;