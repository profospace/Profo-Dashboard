import React, { useState, useEffect } from 'react';
import { Zap, Plus, Eye, Edit3, Trash2, X, Play, Pause } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const AutoReplyTab = () => {
    const [autoReplies, setAutoReplies] = useState([]);
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingReply, setEditingReply] = useState(null);
    const [formData, setFormData] = useState({
        instanceId: '',
        keyword: '',
        responseMessage: '',
        responseType: 'text',
        priority: 0
    });

    useEffect(() => {
        fetchAutoReplies();
        fetchInstances();
    }, []);

    const fetchAutoReplies = async () => {
        try {
            const response = await fetch(`${base_url}/api/auto-reply`, getAuthConfig());
            const data = await response.json();
            setAutoReplies(data);
        } catch (error) {
            console.error('Error fetching auto replies:', error);
        }
    };

    const fetchInstances = async () => {
        try {
            const response = await fetch(`${base_url}/api/devices`, getAuthConfig());
            const data = await response.json();
            setInstances(data.filter(i => i.status === 'connected'));
        } catch (error) {
            console.error('Error fetching instances:', error);
        } finally {
            setLoading(false);
        }
    };

    const createAutoReply = async () => {
        try {
            const response = await fetch(`${base_url}/api/auto-reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthConfig().headers
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowCreateModal(false);
                setFormData({
                    instanceId: '',
                    keyword: '',
                    responseMessage: '',
                    responseType: 'text',
                    priority: 0
                });
                fetchAutoReplies();
            }
        } catch (error) {
            console.error('Error creating auto reply:', error);
        }
    };

    const updateAutoReply = async () => {
        try {
            const response = await fetch(`${base_url}/api/auto-reply/${editingReply._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthConfig().headers
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowEditModal(false);
                setEditingReply(null);
                setFormData({
                    instanceId: '',
                    keyword: '',
                    responseMessage: '',
                    responseType: 'text',
                    priority: 0
                });
                fetchAutoReplies();
            }
        } catch (error) {
            console.error('Error updating auto reply:', error);
        }
    };

    const toggleAutoReply = async (id) => {
        try {
            await axios.patch(
                `${base_url}/api/auto-reply/${id}/toggle`,
                {}, // No body needed
                getAuthConfig()
            );
            fetchAutoReplies();
        } catch (error) {
            console.error('Error toggling auto reply:', error);
        }
    };

    const deleteAutoReply = async (id) => {
        if (!window.confirm('Are you sure you want to delete this auto reply?')) return;

        try {
            await axios.delete(
                `${base_url}/api/auto-reply/${id}`,
                getAuthConfig()
            );
            fetchAutoReplies();
        } catch (error) {
            console.error('Error deleting auto reply:', error);
        }
    };

    const openEditModal = (reply) => {
        setEditingReply(reply);
        setFormData({
            instanceId: reply.instanceId?._id || '',
            keyword: reply.keyword,
            responseMessage: reply.responseMessage,
            responseType: reply.responseType,
            priority: reply.priority
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
                    <h2 className="text-2xl font-bold text-gray-900">Auto Reply</h2>
                    <p className="text-gray-600 mt-1">Set up automatic responses to keywords</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Auto Reply</span>
                </button>
            </div>

            {/* Auto Replies Table */}
            {autoReplies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
                    <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Auto Replies</h3>
                    <p className="text-gray-600 mb-6">Create your first auto reply to automatically respond to keywords</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150"
                    >
                        Create First Auto Reply
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Auto Reply Rules</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {autoReplies.map((reply) => (
                                    <tr key={reply._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="bg-yellow-100 text-yellow-800 p-2 rounded-lg mr-3">
                                                    <Zap className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-900">{reply.keyword}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-700 text-sm line-clamp-2 max-w-xs">
                                                {reply.responseMessage.length > 50
                                                    ? `${reply.responseMessage.substring(0, 50)}...`
                                                    : reply.responseMessage
                                                }
                                            </p>
                                            <span className="text-xs text-gray-500 capitalize">{reply.responseType}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">{reply.instanceId?.name || 'All Instances'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {reply.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleAutoReply(reply._id)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reply.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {reply.isActive ? (
                                                    <>
                                                        <Play className="w-3 h-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <Pause className="w-3 h-3 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(reply)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteAutoReply(reply._id)}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Create Auto Reply</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instance</label>
                                <select
                                    value={formData.instanceId}
                                    onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Instance</option>
                                    {instances.map((instance) => (
                                        <option key={instance._id} value={instance._id}>{instance.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                                <input
                                    type="text"
                                    value={formData.keyword}
                                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                                    placeholder="e.g., 1, hello, info, buy"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Users will trigger this response by typing this keyword</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Response Type</label>
                                <select
                                    value={formData.responseType}
                                    onChange={(e) => setFormData({ ...formData, responseType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
                                <textarea
                                    value={formData.responseMessage}
                                    onChange={(e) => setFormData({ ...formData, responseMessage: e.target.value })}
                                    rows="4"
                                    placeholder="Enter your auto reply message"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Higher priority rules are processed first</p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createAutoReply}
                                    disabled={!formData.instanceId || !formData.keyword || !formData.responseMessage}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
                                >
                                    Create Auto Reply
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
                            <h3 className="text-xl font-semibold text-gray-900">Edit Auto Reply</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instance</label>
                                <select
                                    value={formData.instanceId}
                                    onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Instance</option>
                                    {instances.map((instance) => (
                                        <option key={instance._id} value={instance._id}>{instance.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                                <input
                                    type="text"
                                    value={formData.keyword}
                                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                                    placeholder="e.g., 1, hello, info, buy"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Response Type</label>
                                <select
                                    value={formData.responseType}
                                    onChange={(e) => setFormData({ ...formData, responseType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
                                <textarea
                                    value={formData.responseMessage}
                                    onChange={(e) => setFormData({ ...formData, responseMessage: e.target.value })}
                                    rows="4"
                                    placeholder="Enter your auto reply message"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateAutoReply}
                                    disabled={!formData.instanceId || !formData.keyword || !formData.responseMessage}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
                                >
                                    Update Auto Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoReplyTab;