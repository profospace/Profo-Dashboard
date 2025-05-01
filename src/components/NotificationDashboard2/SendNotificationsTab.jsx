import React, { useState, useEffect } from 'react';
import { Send, Users, Filter, Zap, Eye } from './icons';
import { Alert } from './Alert';

// Sample data for templates
const sampleTemplates = [
    {
        _id: '1',
        name: 'price-drop',
        title: 'Price Drop Alert',
        body: 'The price of {{propertyTitle}} in {{location}} has dropped by {{dropPercentage}}!',
        imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        clickAction: '/property/{{propertyId}}',
        category: 'property',
        active: true,
        variables: ['propertyTitle', 'location', 'dropPercentage', 'propertyId']
    },
    {
        _id: '2',
        name: 'new-property',
        title: 'New Property Alert',
        body: 'A new property matching your preferences is now available in {{location}}.',
        imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        clickAction: '/property/{{propertyId}}',
        category: 'property',
        active: true,
        variables: ['location', 'propertyId']
    }
];

// Send Notifications Tab Component
const SendNotificationsTab = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [sendMode, setSendMode] = useState('filter'); // filter, users, topic
    const [formData, setFormData] = useState({
        filter: {},
        userIds: '',
        topic: '',
        variables: {},
        testMode: true
    });
    const [variableKey, setVariableKey] = useState('');
    const [variableValue, setVariableValue] = useState('');
    const [previewNotification, setPreviewNotification] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setTemplates(sampleTemplates);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch templates:', err);
            setLoading(false);
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        setSelectedTemplate(template);
        setFormData(prev => ({
            ...prev,
            variables: {}
        }));
        setPreviewNotification(null);
    };

    const handleSendModeChange = (mode) => {
        setSendMode(mode);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFilterChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            filter: {
                ...prev.filter,
                [field]: value
            }
        }));
    };

    const addVariable = () => {
        if (!variableKey.trim()) return;

        setFormData(prev => ({
            ...prev,
            variables: {
                ...prev.variables,
                [variableKey]: variableValue
            }
        }));

        setVariableKey('');
        setVariableValue('');
    };

    const removeVariable = (key) => {
        const newVariables = { ...formData.variables };
        delete newVariables[key];

        setFormData(prev => ({
            ...prev,
            variables: newVariables
        }));
    };

    const handlePreview = async () => {
        if (!selectedTemplate) return;

        // Replace template variables with formData.variables values
        const replaceVariables = (text, variables) => {
            let result = text;
            Object.entries(variables).forEach(([key, value]) => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                result = result.replace(regex, value);
            });
            return result;
        };

        const previewData = {
            title: replaceVariables(selectedTemplate.title, formData.variables),
            body: replaceVariables(selectedTemplate.body, formData.variables),
            imageUrl: selectedTemplate.imageUrl,
            clickAction: replaceVariables(selectedTemplate.clickAction, formData.variables)
        };

        setPreviewNotification(previewData);
    };

    const handleSendTest = async () => {
        if (!selectedTemplate) return;

        try {
            setSending(true);
            setError(null);
            setSuccess(null);

            // Simulate API call
            setTimeout(() => {
                setSending(false);
                setSuccess('Test notification sent successfully!');
            }, 1500);
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to send test notification:', err);
            setSending(false);
        }
    };

    const handleSend = async () => {
        if (!selectedTemplate) {
            setError('Please select a template first');
            return;
        }

        if (!previewNotification) {
            setError('Please preview your notification before sending');
            return;
        }

        try {
            setSending(true);
            setError(null);
            setSuccess(null);

            // Validate send mode data
            if (sendMode === 'filter' && Object.keys(formData.filter).length === 0) {
                setError('Please specify at least one filter');
                setSending(false);
                return;
            } else if (sendMode === 'users' && !formData.userIds.trim()) {
                setError('Please specify at least one user ID');
                setSending(false);
                return;
            } else if (sendMode === 'topic' && !formData.topic.trim()) {
                setError('Please specify a topic');
                setSending(false);
                return;
            }

            // Simulate API call
            setTimeout(() => {
                setSending(false);
                setSuccess(formData.testMode
                    ? 'Test notification sent successfully!'
                    : 'Notification queued for delivery to all recipients!');

                // Reset form after successful send if not in test mode
                if (!formData.testMode) {
                    setFormData({
                        filter: {},
                        userIds: '',
                        topic: '',
                        variables: {},
                        testMode: true
                    });
                    setSelectedTemplate(null);
                    setPreviewNotification(null);
                }
            }, 2000);
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to send notification:', err);
            setSending(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>

            {error && (
                <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-4"
                />
            )}

            {success && (
                <Alert
                    variant="success"
                    title="Success"
                    description={success}
                    className="mb-4"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-3">1. Select Template</h3>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading templates...</p>
                        </div>
                    ) : (
                        <div className="border rounded overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b">
                                <select
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    onChange={(e) => handleTemplateSelect(e.target.value)}
                                    value={selectedTemplate?._id || ''}
                                >
                                    <option value="">-- Select a template --</option>
                                    {templates.map(template => (
                                        <option key={template._id} value={template._id}>
                                            {template.name} - {template.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTemplate && (
                                <div className="p-3">
                                    <h4 className="font-medium">{selectedTemplate.title}</h4>
                                    <p className="text-gray-600 text-sm mt-1">{selectedTemplate.body}</p>

                                    {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                                        <div className="mt-3">
                                            <h5 className="text-sm font-medium">Variables</h5>

                                            <div className="flex mb-2 mt-2">
                                                <select
                                                    value={variableKey}
                                                    onChange={(e) => setVariableKey(e.target.value)}
                                                    className="w-1/3 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                >
                                                    <option value="">-- Select variable --</option>
                                                    {selectedTemplate.variables.map(variable => (
                                                        <option key={variable} value={variable}>
                                                            {variable}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={variableValue}
                                                    onChange={(e) => setVariableValue(e.target.value)}
                                                    className="w-2/3 p-2 border-t border-b border-r rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    placeholder="Value"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addVariable}
                                                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200"
                                                >
                                                    Set
                                                </button>
                                            </div>

                                            {Object.keys(formData.variables).length > 0 && (
                                                <div className="bg-gray-50 p-2 rounded border mb-2">
                                                    {Object.entries(formData.variables).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center mb-1">
                                                            <div>
                                                                <span className="font-medium">{key}:</span> {value}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVariable(key)}
                                                                className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                                            >
                                                                <span className="sr-only">Remove</span>
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-2 space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={handlePreview}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                                                >
                                                    <Eye size={14} className="inline mr-1" />
                                                    Preview
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSendTest}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                                                >
                                                    <Send size={14} className="inline mr-1" />
                                                    Send Test
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {previewNotification && (
                                        <div className="mt-4 border p-3 rounded bg-gray-50 animate-fadeIn">
                                            <h5 className="text-sm font-medium">Preview</h5>
                                            <div className="mt-2 p-3 bg-white border rounded shadow-sm">
                                                <div className="font-medium">{previewNotification.title}</div>
                                                <p className="text-sm mt-1">{previewNotification.body}</p>
                                                {previewNotification.imageUrl && (
                                                    <img
                                                        src={previewNotification.imageUrl}
                                                        alt="Notification preview"
                                                        className="mt-2 h-20 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <h3 className="text-lg font-medium mb-3 mt-6">2. Select Recipients</h3>

                    <div className="border rounded overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                            <div className="flex border rounded">
                                <button
                                    className={`flex-1 p-2 transition-colors duration-200 ${sendMode === 'filter' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
                                    onClick={() => handleSendModeChange('filter')}
                                >
                                    <Filter size={16} className="inline mr-1" />
                                    By Filter
                                </button>
                                <button
                                    className={`flex-1 p-2 transition-colors duration-200 ${sendMode === 'users' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
                                    onClick={() => handleSendModeChange('users')}
                                >
                                    <Users size={16} className="inline mr-1" />
                                    Specific Users
                                </button>
                                <button
                                    className={`flex-1 p-2 transition-colors duration-200 ${sendMode === 'topic' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
                                    onClick={() => handleSendModeChange('topic')}
                                >
                                    <Zap size={16} className="inline mr-1" />
                                    Topic
                                </button>
                            </div>
                        </div>

                        <div className="p-3">
                            {sendMode === 'filter' && (
                                <div>
                                    <p className="text-sm mb-3">Send to users matching specific criteria:</p>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="e.g., city=Mumbai"
                                            value={formData.filter.location || ''}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preference</label>
                                        <select
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            value={formData.filter.preference || ''}
                                            onChange={(e) => handleFilterChange('preference', e.target.value)}
                                        >
                                            <option value="">Any preference</option>
                                            <option value="priceAlerts">Price Alerts Enabled</option>
                                            <option value="newPropertyAlerts">New Property Alerts Enabled</option>
                                            <option value="savedSearchAlerts">Saved Search Alerts Enabled</option>
                                            <option value="dailyDigest">Daily Digest Enabled</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                                        <select
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            value={formData.filter.activity || ''}
                                            onChange={(e) => handleFilterChange('activity', e.target.value)}
                                        >
                                            <option value="">Any activity</option>
                                            <option value="active">Active in last 30 days</option>
                                            <option value="inactive">Inactive for 30+ days</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {sendMode === 'users' && (
                                <div>
                                    <p className="text-sm mb-3">Send to specific users by ID:</p>

                                    <textarea
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        rows="4"
                                        name="userIds"
                                        value={formData.userIds}
                                        onChange={handleInputChange}
                                        placeholder="Enter user IDs separated by commas"
                                    ></textarea>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter user IDs separated by commas (e.g., 5f8a3b2c1d4e5f6a7b8c9d0e, 5f8a3b2c1d4e5f6a7b8c9d0f)
                                    </p>
                                </div>
                            )}

                            {sendMode === 'topic' && (
                                <div>
                                    <p className="text-sm mb-3">Send to users subscribed to a topic:</p>

                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleInputChange}
                                        placeholder="e.g., price-alerts"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">
                                        Only users who have explicitly subscribed to this topic will receive the notification
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="testMode"
                                        checked={formData.testMode}
                                        onChange={handleInputChange}
                                        className="mr-2 focus:ring-2 focus:ring-blue-500 text-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Test Mode</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    In test mode, the notification will only be sent to one user instead of all recipients
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-3">3. Review & Send</h3>

                    <div className="border rounded overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                            <h4 className="font-medium">Notification Summary</h4>
                        </div>

                        <div className="p-3">
                            {!selectedTemplate ? (
                                <p className="text-gray-500">Please select a template first</p>
                            ) : !previewNotification ? (
                                <p className="text-gray-500">Click "Preview" to see how your notification will appear</p>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <h5 className="text-sm font-medium">Notification Content</h5>
                                        <div className="mt-2 p-3 bg-gray-50 border rounded">
                                            <div className="font-medium">{previewNotification.title}</div>
                                            <p className="text-sm mt-1">{previewNotification.body}</p>
                                            {previewNotification.imageUrl && (
                                                <img
                                                    src={previewNotification.imageUrl}
                                                    alt="Notification preview"
                                                    className="mt-2 h-20 object-cover rounded"
                                                />
                                            )}
                                            {previewNotification.clickAction && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Click action: {previewNotification.clickAction}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="text-sm font-medium">Recipients</h5>
                                        <div className="mt-2 p-3 bg-gray-50 border rounded">
                                            {sendMode === 'filter' && (
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Method:</span> By Filter</p>
                                                    {Object.keys(formData.filter).length > 0 ? (
                                                        <div className="mt-1">
                                                            <ul className="list-disc list-inside">
                                                                {Object.entries(formData.filter).map(([key, value]) => (
                                                                    value && <li key={key}>{key}: {value}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 mt-1">No filters specified</p>
                                                    )}
                                                </div>
                                            )}

                                            {sendMode === 'users' && (
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Method:</span> Specific Users</p>
                                                    {formData.userIds ? (
                                                        <div className="mt-1">
                                                            <p>{formData.userIds.split(',').length} users selected</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 mt-1">No users specified</p>
                                                    )}
                                                </div>
                                            )}

                                            {sendMode === 'topic' && (
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Method:</span> Topic</p>
                                                    {formData.topic ? (
                                                        <div className="mt-1">
                                                            <p>Topic: {formData.topic}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 mt-1">No topic specified</p>
                                                    )}
                                                </div>
                                            )}

                                            {formData.testMode && (
                                                <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-sm rounded border border-yellow-200">
                                                    <strong>Test Mode:</strong> Only 1 user will receive this notification
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !previewNotification}
                                        className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex justify-center items-center"
                                    >
                                        {sending ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending Notification...
                                            </div>
                                        ) : formData.testMode ? (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Send Test Notification
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Send Notification to All Recipients
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendNotificationsTab;