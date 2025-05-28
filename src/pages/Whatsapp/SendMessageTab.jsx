import React, { useState, useEffect } from 'react';
import { Send, Upload, Calendar, Users, FileText, Image, Video, File } from 'lucide-react';
import { getAuthConfig } from '../../../utils/authConfig';
import { base_url } from '../../../utils/base_url';
import axios from 'axios';

const SendMessageTab = () => {
    const [instances, setInstances] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sendResults, setSendResults] = useState(null);
    const [formData, setFormData] = useState({
        instanceId: '',
        messageType: 'text',
        content: '',
        phoneNumbers: '',
        templateId: '',
        scheduledAt: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        fetchInstances();
        fetchTemplates();
    }, []);

    const fetchInstances = async () => {
        try {
            const response = await fetch(`${base_url}/api/devices`, getAuthConfig());
            const data = await response.json();
            setInstances(data.filter(i => i.status === 'connected'));
        } catch (error) {
            console.error('Error fetching instances:', error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${base_url}/api/templates`, getAuthConfig());
            const data = await response.json();
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setFormData({
                ...formData,
                templateId,
                content: template.content,
                messageType: template.messageType
            });
        } else {
            setFormData({
                ...formData,
                templateId: '',
                content: '',
                messageType: 'text'
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleCsvChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
        } else {
            alert('Please select a valid CSV file');
        }
    };

    const sendMessages = async () => {
        if (!formData.instanceId || !formData.content || (!formData.phoneNumbers && !csvFile)) {
            alert('Please fill all required fields');
            return;
        }

        setSending(true);
        setSendResults(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('instanceId', formData.instanceId);
            formDataToSend.append('messageType', formData.messageType);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('templateId', formData.templateId);
            formDataToSend.append('scheduledAt', formData.scheduledAt);

            if (formData.phoneNumbers) {
                formDataToSend.append('phoneNumbers', formData.phoneNumbers);
            }

            if (csvFile) {
                formDataToSend.append('csv', csvFile);
            }

            if (selectedFile) {
                formDataToSend.append('media', selectedFile);
            }

            const response = await axios.post(
                `${base_url}/api/messages/send-bulk`,
                formDataToSend,
                {
                    ...getAuthConfig(),
                    headers: {
                        ...getAuthConfig().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                setSendResults(result.results);

                // Reset form if successful
                if (result.results.sent > 0 || result.results.scheduled > 0) {
                    setFormData({
                        instanceId: '',
                        messageType: 'text',
                        content: '',
                        phoneNumbers: '',
                        templateId: '',
                        scheduledAt: ''
                    });
                    setSelectedFile(null);
                    setCsvFile(null);
                }
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error sending messages:', error);
            alert('Failed to send messages. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const getMessageTypeIcon = (type) => {
        switch (type) {
            case 'text': return <FileText className="w-5 h-5" />;
            case 'image': return <Image className="w-5 h-5" />;
            case 'video': return <Video className="w-5 h-5" />;
            case 'pdf': return <File className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Send Messages</h2>
                <p className="text-gray-600 mt-1">Send bulk messages to multiple contacts</p>
            </div>

            {/* Send Results */}
            {sendResults && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sending Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Total Messages</p>
                            <p className="text-2xl font-bold text-blue-900">{sendResults.total}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-600">Sent Successfully</p>
                            <p className="text-2xl font-bold text-green-900">{sendResults.sent}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-yellow-600">Scheduled</p>
                            <p className="text-2xl font-bold text-yellow-900">{sendResults.scheduled || 0}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-red-600">Failed</p>
                            <p className="text-2xl font-bold text-red-900">{sendResults.failed}</p>
                        </div>
                    </div>
                    {sendResults.errors && sendResults.errors.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-red-600 mb-2">Errors:</p>
                            <div className="bg-red-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                                {sendResults.errors.map((error, index) => (
                                    <p key={index} className="text-sm text-red-700">
                                        {error.phoneNumber}: {error.error}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Message Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="space-y-6">
                    {/* Instance and Template Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select WhatsApp Instance *
                            </label>
                            <select
                                value={formData.instanceId}
                                onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Choose an instance</option>
                                {instances.map((instance) => (
                                    <option key={instance._id} value={instance._id}>
                                        {instance.name} - {instance.phoneNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Use Template (Optional)
                            </label>
                            <select
                                value={formData.templateId}
                                onChange={(e) => handleTemplateSelect(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">No Template</option>
                                {templates.map((template) => (
                                    <option key={template._id} value={template._id}>
                                        {template.name} ({template.messageType})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Message Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['text', 'image', 'video', 'pdf'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, messageType: type })}
                                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors duration-150 ${formData.messageType === type
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {getMessageTypeIcon(type)}
                                    <span className="capitalize font-medium">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Media Upload */}
                    {formData.messageType !== 'text' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload {formData.messageType.charAt(0).toUpperCase() + formData.messageType.slice(1)}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept={
                                        formData.messageType === 'image' ? 'image/*' :
                                            formData.messageType === 'video' ? 'video/*' :
                                                'application/pdf'
                                    }
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {selectedFile && (
                                    <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recipients */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Numbers (Manual Entry)
                            </label>
                            <textarea
                                value={formData.phoneNumbers}
                                onChange={(e) => setFormData({ ...formData, phoneNumbers: e.target.value })}
                                rows="6"
                                placeholder="Enter phone numbers separated by commas or new lines&#10;Example:&#10;+919876543210&#10;+918765432109&#10;+917654321098"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload CSV File (Alternative)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <input
                                    type="file"
                                    onChange={handleCsvChange}
                                    accept=".csv"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                {csvFile && (
                                    <p className="text-sm text-gray-600 mt-2">Selected: {csvFile.name}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    CSV should have phone numbers in first column
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message Content *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows="8"
                            placeholder="Enter your message content here..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {/* <p className="text-xs text-gray-500 mt-1">
                            Use variables like {{ name }}, {{ property_type }} for personalization
                        </p> */}
                    </div>

                    {/* Schedule Option */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule for Later (Optional)
                        </label>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <input
                                type="datetime-local"
                                value={formData.scheduledAt}
                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                min={new Date().toISOString().slice(0, 16)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Send Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={sendMessages}
                            disabled={sending || !formData.instanceId || !formData.content || (!formData.phoneNumbers && !csvFile)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                        >
                            <Send className="w-5 h-5" />
                            <span>
                                {sending ? 'Sending...' :
                                    formData.scheduledAt ? 'Schedule Messages' : 'Send Messages'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Bulk Messaging</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                        <h4 className="font-medium mb-2">Phone Number Format:</h4>
                        <ul className="space-y-1">
                            <li>• Include country code (e.g., +91 for India)</li>
                            <li>• One number per line or comma-separated</li>
                            <li>• Example: +919876543210</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">CSV File Format:</h4>
                        <ul className="space-y-1">
                            <li>• First column should contain phone numbers</li>
                            <li>• Include headers (phone, name, etc.)</li>
                            <li>• Save as .csv format</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Message Variables:</h4>
                        <ul className="space-y-1">
                            {/* <li>• Use {{ name }} for personalization</li> */}
                            {/* <li>• {{ company_name }} for business name</li> */}
                            <li>• Variables work with templates</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Best Practices:</h4>
                        <ul className="space-y-1">
                            <li>• Test with small groups first</li>
                            <li>• Avoid spam-like content</li>
                            <li>• Include opt-out instructions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMessageTab;