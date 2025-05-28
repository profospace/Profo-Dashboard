import React, { useState, useEffect } from 'react';
import { Plus, FileText, Image, Video, FileType, Edit3, Trash2, Copy, Eye, Upload, X } from 'lucide-react';
import { getAuthConfig } from '../../../utils/authConfig';
import { base_url } from '../../../utils/base_url';

const TemplateTab = () => {
    const [templates, setTemplates] = useState([]);
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewContent, setPreviewContent] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        messageType: 'text',
        content: '',
        instanceId: '',
        isWelcomeTemplate: false
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchTemplates();
        fetchInstances();
    }, []);

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

    const fetchInstances = async () => {
        try {
            const response = await fetch(`${base_url}/api/devices`, getAuthConfig());
            const data = await response.json();
            setInstances(data.filter(instance => instance.status === 'connected'));
        } catch (error) {
            console.error('Error fetching instances:', error);
        }
    };

    const createTemplate = async () => {
        setCreating(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('messageType', formData.messageType);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('instanceId', formData.instanceId);
            formDataToSend.append('isWelcomeTemplate', formData.isWelcomeTemplate);

            if (selectedFile) {
                formDataToSend.append('media', selectedFile);
            }

            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                setFormData({
                    name: '',
                    messageType: 'text',
                    content: '',
                    instanceId: '',
                    isWelcomeTemplate: false
                });
                setSelectedFile(null);
                setShowCreateModal(false);
                fetchTemplates();
            }
        } catch (error) {
            console.error('Error creating template:', error);
        } finally {
            setCreating(false);
        }
    };

    const deleteTemplate = async (templateId) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;

        try {
            await fetch(`${base_url}/api/templates/${templateId}`, {
                method: 'DELETE',
                ...getAuthConfig()
            });
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const duplicateTemplate = async (templateId) => {
        try {
            await fetch(`${base_url}/api/templates/${templateId}/duplicate`, {
                method: 'POST',
                ...getAuthConfig()
            });
            fetchTemplates();
        } catch (error) {
            console.error('Error duplicating template:', error);
        }
    };

    const previewTemplate = async (templateId) => {
        try {
            const response = await fetch(`${base_url}/api/templates/${templateId}/preview`, {
                method: 'POST',
                ...getAuthConfig(),
                body: JSON.stringify({
                    variables: {
                        name: 'John Doe',
                        property_type: 'Apartment',
                        project_name: 'Sample Project'
                    }
                })
            });

            const data = await response.json();
            setPreviewContent(data.preview);
            setShowPreviewModal(true);
        } catch (error) {
            console.error('Error generating preview:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'text': return <FileText className="w-5 h-5" />;
            case 'image': return <Image className="w-5 h-5" />;
            case 'video': return <Video className="w-5 h-5" />;
            case 'pdf': return <FileType className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'text': return 'bg-blue-100 text-blue-800';
            case 'image': return 'bg-green-100 text-green-800';
            case 'video': return 'bg-purple-100 text-purple-800';
            case 'pdf': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
                    <p className="text-gray-600 mt-1">Create and manage reusable message templates</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Template</span>
                </button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
                        <p className="text-gray-600 mb-6">Create your first template to start automating messages</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                        >
                            Create First Template
                        </button>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div key={template._id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${getTypeColor(template.messageType)}`}>
                                        {getTypeIcon(template.messageType)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{template.messageType}</p>
                                    </div>
                                </div>
                                {template.isWelcomeTemplate && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Welcome
                                    </span>
                                )}
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-700 text-sm line-clamp-3">
                                    {template.content.length > 100
                                        ? `${template.content.substring(0, 100)}...`
                                        : template.content
                                    }
                                </p>
                            </div>

                            {template.instanceId && (
                                <div className="mb-4">
                                    <span className="text-xs text-gray-500">Instance: </span>
                                    <span className="text-xs font-medium text-gray-700">{template.instanceId.name}</span>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => previewTemplate(template._id)}
                                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-150 flex items-center justify-center space-x-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Preview</span>
                                </button>
                                <button
                                    onClick={() => duplicateTemplate(template._id)}
                                    className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors duration-150"
                                    title="Duplicate"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button
                                    className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                                    title="Edit"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteTemplate(template._id)}
                                    className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors duration-150"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Template Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Create New Template</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter template name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                                <select
                                    value={formData.messageType}
                                    onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instance (Optional)</label>
                                <select
                                    value={formData.instanceId}
                                    onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Instances</option>
                                    {instances.map((instance) => (
                                        <option key={instance._id} value={instance._id}>
                                            {instance.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.messageType !== 'text' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept={
                                                formData.messageType === 'image' ? 'image/*' :
                                                    formData.messageType === 'video' ? 'video/*' :
                                                        'application/pdf'
                                            }
                                            className="w-full"
                                        />
                                        {selectedFile && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Selected: {selectedFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter your message content. Use {{variable_name}} for dynamic content."
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {/* Use variables like {{ name }}, {{ property_type }}, {{ project_name }} for dynamic content */}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isWelcomeTemplate"
                                    checked={formData.isWelcomeTemplate}
                                    onChange={(e) => setFormData({ ...formData, isWelcomeTemplate: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isWelcomeTemplate" className="ml-2 text-sm font-medium text-gray-700">
                                    Use as Welcome Template
                                </label>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createTemplate}
                                    disabled={creating || !formData.name || !formData.content}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create Template'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Template Preview</h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-gray-800 whitespace-pre-wrap">{previewContent}</p>
                        </div>

                        <button
                            onClick={() => setShowPreviewModal(false)}
                            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateTab;