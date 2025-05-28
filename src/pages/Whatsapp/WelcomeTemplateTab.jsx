import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, Eye, X } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const WelcomeTemplateTab = () => {
    const [templates, setTemplates] = useState([]);
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        instanceId: ''
    });

    useEffect(() => {
        fetchWelcomeTemplates();
        fetchInstances();
    }, []);

    const fetchWelcomeTemplates = async () => {
        try {
            const response = await fetch(`${base_url}/api/templates?type=welcome`, getAuthConfig());
            const data = await response.json();
            setTemplates(data.filter(t => t.isWelcomeTemplate));
        } catch (error) {
            console.error('Error fetching welcome templates:', error);
        }
    };

    const fetchInstances = async () => {
        try {
            const response = await fetch(`${base_url}/api/devices`, getAuthConfig());
            const data = await response.json();
            setInstances(data);
        } catch (error) {
            console.error('Error fetching instances:', error);
        } finally {
            setLoading(false);
        }
    };

    const createWelcomeTemplate = async () => {
        try {
            const response = await fetch(`${base_url}/api/templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthConfig().headers
                },
                body: JSON.stringify({
                    ...formData,
                    messageType: 'text',
                    isWelcomeTemplate: true
                })
            });

            if (response.ok) {
                setShowCreateModal(false);
                setFormData({ name: '', content: '', instanceId: '' });
                fetchWelcomeTemplates();
            }
        } catch (error) {
            console.error('Error creating welcome template:', error);
        }
    };

    const updateTemplate = async () => {
        try {
            const response = await fetch(`${base_url}/api/templates/${editingTemplate._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthConfig().headers
                },
                body: JSON.stringify({
                    ...formData,
                    messageType: 'text',
                    isWelcomeTemplate: true
                })
            });

            if (response.ok) {
                setShowEditModal(false);
                setEditingTemplate(null);
                setFormData({ name: '', content: '', instanceId: '' });
                fetchWelcomeTemplates();
            }
        } catch (error) {
            console.error('Error updating template:', error);
        }
    };

    const deleteTemplate = async (templateId) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;

        try {
            await fetch(`${base_url}/api/templates/${templateId}`, {
                method: 'DELETE',
                headers: { ...getAuthConfig().headers }
            });
            fetchWelcomeTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const openEditModal = (template) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            content: template.content,
            instanceId: template.instanceId?._id || ''
        });
        setShowEditModal(true);
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
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Templates</h2>
                    <p className="text-gray-600 mt-1">Configure welcome messages for new contacts</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Welcome Template</span>
                </button>
            </div>

            {/* Templates Grid */}
            {templates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Welcome Templates</h3>
                    <p className="text-gray-600 mb-6">Create your first welcome template to automatically greet new contacts</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150"
                    >
                        Create First Template
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div key={template._id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                        <p className="text-sm text-gray-500">Welcome Message</p>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                    Active
                                </span>
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
                                    onClick={() => openEditModal(template)}
                                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-150 flex items-center justify-center space-x-1"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => deleteTemplate(template._id)}
                                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-150 flex items-center justify-center space-x-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Create Welcome Template</h3>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instance (Optional)</label>
                                <select
                                    value={formData.instanceId}
                                    onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Instances</option>
                                    {instances.map((instance) => (
                                        <option key={instance._id} value={instance._id}>{instance.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows="6"
                                    placeholder="Enter your welcome message. Use {{name}} for dynamic content."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {/* Use variables like {{ name }}, '{{ company_name }}' for personalization */}
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createWelcomeTemplate}
                                    disabled={!formData.name || !formData.content}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
                                >
                                    Create Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Welcome Template</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instance (Optional)</label>
                                <select
                                    value={formData.instanceId}
                                    onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Instances</option>
                                    {instances.map((instance) => (
                                        <option key={instance._id} value={instance._id}>{instance.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows="6"
                                    placeholder="Enter your welcome message. Use {{name}} for dynamic content."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Use variables like {{ name }}, {{ company_name }} for personalization
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateTemplate}
                                    disabled={!formData.name || !formData.content}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
                                >
                                    Update Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomeTemplateTab;