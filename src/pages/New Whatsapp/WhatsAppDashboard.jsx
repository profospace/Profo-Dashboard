import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    MessageCircle, Send, Users, Home, FileText, Zap, Bot, Settings,
    Bell, Menu, X, Plus, Edit2, Trash2, Clock, Check, AlertCircle,
    Calendar, Filter, Search, Download, Upload, RefreshCw, Wifi,
    ChevronDown, ChevronRight, Eye, Copy, Shield, Activity
} from 'lucide-react';
import { base_url } from '../../../utils/base_url';

// API Configuration
const API_BASE_URL = base_url;
const WS_URL = window.REACT_APP_WS_URL || 'ws://localhost:3000/ws';

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('whatsapp_access_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API call failed');
    }

    return response.json();
};

// Custom hooks
const useWebSocket = (url, onMessage) => {
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);

    const connect = useCallback(() => {
        try {
            ws.current = new WebSocket(url);

            ws.current.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                onMessage(data);
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.current.onclose = () => {
                console.log('WebSocket disconnected');
                reconnectTimeout.current = setTimeout(connect, 5000);
            };
        } catch (error) {
            console.error('WebSocket connection failed:', error);
        }
    }, [url, onMessage]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [connect]);

    return ws.current;
};

const WhatsAppDashboard = () => {
    // State management
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Dashboard data
    const [stats, setStats] = useState({
        totalConversations: 0,
        activeUsers: 0,
        messagesDelivered: 0,
        conversionRate: 0,
    });

    const [messageAnalytics, setMessageAnalytics] = useState([]);
    const [userEngagement, setUserEngagement] = useState([]);

    // Templates
    const [templates, setTemplates] = useState([]);
    const [templateForm, setTemplateForm] = useState({
        name: '',
        category: 'MARKETING',
        language: 'en_US',
        header: '',
        body: '',
        footer: '',
        buttons: []
    });
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    // Automation
    const [automations, setAutomations] = useState([]);
    const [scheduledMessages, setScheduledMessages] = useState([]);
    const [chatbotFlows, setChatbotFlows] = useState([]);

    // Conversations
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [userEngagementData, setUserEngagementData] = useState({});

    // Settings
    const [settings, setSettings] = useState({
        phoneNumberId: '',
        businessAccountId: '',
        accessToken: '',
        verifyToken: '',
        webhookUrl: ''
    });

    // Load initial data
    useEffect(() => {
        loadDashboardData();
        loadSettings();
    }, []);

    // WebSocket connection for real-time updates
    useWebSocket(WS_URL, (data) => {
        switch (data.type) {
            case 'message':
                handleIncomingMessage(data);
                break;
            case 'status_update':
                updateMessageStatus(data);
                break;
            case 'user_engagement':
                updateUserEngagement(data);
                break;
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    });

    // Data loading functions
    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, analytics, engagement, templatesData, automationsData, conversationsData] = await Promise.all([
                apiCall('/dashboard/stats'),
                apiCall('/dashboard/analytics'),
                apiCall('/dashboard/engagement'),
                apiCall('/templates'),
                apiCall('/automations'),
                apiCall('/conversations')
            ]);

            setStats(statsData);
            setMessageAnalytics(analytics.messages);
            setUserEngagement(analytics.engagement);
            setTemplates(templatesData);
            setAutomations(automationsData);
            setConversations(conversationsData);
        } catch (error) {
            showNotification('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        try {
            const savedSettings = await apiCall('/settings');
            setSettings(savedSettings);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    // Message handling
    const handleIncomingMessage = (data) => {
        const { from, message, timestamp } = data;

        // Update user engagement tracking
        setUserEngagementData(prev => ({
            ...prev,
            [from]: {
                lastMessageTime: timestamp,
                isInWindow: true
            }
        }));

        // Add to conversations
        setConversations(prev => {
            const existing = prev.find(c => c.phoneNumber === from);
            if (existing) {
                return prev.map(c =>
                    c.phoneNumber === from
                        ? { ...c, lastMessage: message, timestamp, unread: c.unread + 1 }
                        : c
                );
            } else {
                return [{
                    id: Date.now(),
                    phoneNumber: from,
                    lastMessage: message,
                    timestamp,
                    unread: 1,
                    messages: [{ sender: 'user', text: message, timestamp }]
                }, ...prev];
            }
        });

        showNotification(`New message from ${from}`);
    };

    const sendMessage = async () => {
        if (!selectedConversation || !messageInput.trim()) return;

        try {
            const phoneNumber = selectedConversation.phoneNumber;
            const userEngagement = userEngagementData[phoneNumber];

            // Check if user is in 24-hour window
            const isInWindow = userEngagement?.isInWindow || false;

            let response;
            if (isInWindow) {
                // Send regular message
                response = await apiCall('/messages/send', {
                    method: 'POST',
                    body: JSON.stringify({
                        to: phoneNumber,
                        type: 'text',
                        text: { body: messageInput }
                    })
                });
            } else {
                // Must use template
                showNotification('User is outside 24-hour window. Please select a template.', 'warning');
                return;
            }

            // Add message to conversation
            setConversations(prev =>
                prev.map(c =>
                    c.id === selectedConversation.id
                        ? {
                            ...c,
                            messages: [...c.messages, {
                                sender: 'agent',
                                text: messageInput,
                                timestamp: new Date().toISOString(),
                                status: 'sent'
                            }]
                        }
                        : c
                )
            );

            setMessageInput('');
            showNotification('Message sent successfully');
        } catch (error) {
            showNotification('Failed to send message', 'error');
        }
    };

    // Template management
    const createTemplate = async () => {
        try {
            const response = await apiCall('/templates', {
                method: 'POST',
                body: JSON.stringify(templateForm)
            });

            setTemplates(prev => [...prev, response]);
            setShowTemplateModal(false);
            resetTemplateForm();
            showNotification('Template created and submitted for approval');
        } catch (error) {
            showNotification('Failed to create template', 'error');
        }
    };

    const sendTemplateMessage = async (phoneNumber, templateId, parameters = []) => {
        try {
            const template = templates.find(t => t.id === templateId);
            if (!template) throw new Error('Template not found');

            await apiCall('/messages/send-template', {
                method: 'POST',
                body: JSON.stringify({
                    to: phoneNumber,
                    template: {
                        name: template.name,
                        language: { code: template.language },
                        components: parameters.length > 0 ? [{
                            type: 'body',
                            parameters: parameters.map(p => ({ type: 'text', text: p }))
                        }] : undefined
                    }
                })
            });

            showNotification('Template message sent successfully');
        } catch (error) {
            showNotification('Failed to send template message', 'error');
        }
    };

    // Automation and scheduling
    const scheduleMessage = async (messageData) => {
        try {
            const response = await apiCall('/messages/schedule', {
                method: 'POST',
                body: JSON.stringify(messageData)
            });

            setScheduledMessages(prev => [...prev, response]);
            showNotification('Message scheduled successfully');
        } catch (error) {
            showNotification('Failed to schedule message', 'error');
        }
    };

    const createAutomation = async (automationData) => {
        try {
            const response = await apiCall('/automations', {
                method: 'POST',
                body: JSON.stringify(automationData)
            });

            setAutomations(prev => [...prev, response]);
            showNotification('Automation created successfully');
        } catch (error) {
            showNotification('Failed to create automation', 'error');
        }
    };

    // Chatbot flow management
    const saveChatbotFlow = async (flowData) => {
        try {
            const response = await apiCall('/chatbot/flows', {
                method: 'POST',
                body: JSON.stringify(flowData)
            });

            setChatbotFlows(prev => [...prev, response]);
            showNotification('Chatbot flow saved successfully');
        } catch (error) {
            showNotification('Failed to save chatbot flow', 'error');
        }
    };

    // Utility functions
    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const resetTemplateForm = () => {
        setTemplateForm({
            name: '',
            category: 'MARKETING',
            language: 'en_US',
            header: '',
            body: '',
            footer: '',
            buttons: []
        });
    };

    const updateMessageStatus = (data) => {
        setConversations(prev =>
            prev.map(c => ({
                ...c,
                messages: c.messages.map(m =>
                    m.id === data.messageId
                        ? { ...m, status: data.status }
                        : m
                )
            }))
        );
    };

    const updateUserEngagement = (data) => {
        setUserEngagementData(prev => ({
            ...prev,
            [data.phoneNumber]: data.engagement
        }));
    };

    const testConnection = async () => {
        try {
            await apiCall('/settings/test-connection');
            showNotification('Connection successful!');
        } catch (error) {
            showNotification('Connection failed. Please check your credentials.', 'error');
        }
    };

    const saveSettings = async () => {
        try {
            await apiCall('/settings', {
                method: 'PUT',
                body: JSON.stringify(settings)
            });
            showNotification('Settings saved successfully');
        } catch (error) {
            showNotification('Failed to save settings', 'error');
        }
    };

    // Render functions
    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Conversations</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalConversations.toLocaleString()}</p>
                        </div>
                        <MessageCircle className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold mt-1">{stats.activeUsers.toLocaleString()}</p>
                        </div>
                        <Users className="w-12 h-12 text-green-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Messages Delivered</p>
                            <p className="text-2xl font-bold mt-1">{stats.messagesDelivered.toLocaleString()}</p>
                        </div>
                        <Send className="w-12 h-12 text-purple-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Conversion Rate</p>
                            <p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p>
                        </div>
                        <Activity className="w-12 h-12 text-orange-500 opacity-20" />
                    </div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Message Analytics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={messageAnalytics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sent" stroke="#3B82F6" />
                            <Line type="monotone" dataKey="delivered" stroke="#10B981" />
                            <Line type="monotone" dataKey="read" stroke="#8B5CF6" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userEngagement}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userEngagement.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderTemplates = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Message Templates</h3>
                    <p className="text-sm text-gray-600">Manage your WhatsApp message templates</p>
                </div>
                <button
                    onClick={() => setShowTemplateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Language
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {templates.map((template) => (
                            <tr key={template.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {template.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {template.language}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${template.status === 'APPROVED'
                                            ? 'bg-green-100 text-green-800'
                                            : template.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {template.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Template Creation Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Create Message Template</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Template Name
                                </label>
                                <input
                                    type="text"
                                    value={templateForm.name}
                                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., welcome_message"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={templateForm.category}
                                        onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="MARKETING">Marketing</option>
                                        <option value="UTILITY">Utility</option>
                                        <option value="AUTHENTICATION">Authentication</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Language
                                    </label>
                                    <select
                                        value={templateForm.language}
                                        onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="en_US">English (US)</option>
                                        <option value="es_ES">Spanish</option>
                                        <option value="pt_BR">Portuguese</option>
                                        <option value="hi_IN">Hindi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Header (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={templateForm.header}
                                    onChange={(e) => setTemplateForm({ ...templateForm, header: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Header text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Body <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={templateForm.body}
                                    onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Message body. Use {{1}}, {{2}} for variables"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Use {'{{1}}'}, {'{{2}}'}, etc. for dynamic variables
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Footer (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={templateForm.footer}
                                    onChange={(e) => setTemplateForm({ ...templateForm, footer: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Footer text"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={() => {
                                        setShowTemplateModal(false);
                                        resetTemplateForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createTemplate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderAutomation = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Automation & Scheduling</h3>
                    <p className="text-sm text-gray-600">Set up automated messages and workflows</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Automation
                </button>
            </div>

            {/* Scheduled Messages */}
            <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Scheduled Messages
                </h4>
                <div className="space-y-3">
                    {scheduledMessages.map((message) => (
                        <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">{message.recipient}</p>
                                <p className="text-sm text-gray-600">{message.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Scheduled for: {new Date(message.scheduledTime).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Automation Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {automations.map((automation) => (
                    <div key={automation.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-semibold">{automation.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{automation.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={automation.active} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Zap className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Trigger:</span>
                                <span className="text-gray-600">{automation.trigger}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Delay:</span>
                                <span className="text-gray-600">{automation.delay}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Send className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Action:</span>
                                <span className="text-gray-600">{automation.action}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderChatbot = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Chatbot Builder</h3>
                    <p className="text-sm text-gray-600">Create automated conversation flows</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Flow
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Flow Builder */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h4 className="font-semibold mb-4">Flow Builder</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Drag and drop elements to build your chatbot flow</p>
                    </div>
                </div>

                {/* Quick Replies */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="font-semibold mb-4">Quick Replies</h4>
                    <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                            <input
                                type="text"
                                placeholder="Trigger keyword"
                                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Response message"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Quick Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderConversations = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                    {conversation.phoneNumber.slice(-2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{conversation.phoneNumber}</p>
                                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {new Date(conversation.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {conversation.unread > 0 && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full mt-1">
                                            {conversation.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {userEngagementData[conversation.phoneNumber] && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${userEngagementData[conversation.phoneNumber].isInWindow
                                            ? 'bg-green-500'
                                            : 'bg-yellow-500'
                                        }`} />
                                    <span className="text-xs text-gray-500">
                                        {userEngagementData[conversation.phoneNumber].isInWindow
                                            ? 'In 24h window'
                                            : 'Outside window - use template'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversation View */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col" style={{ height: '600px' }}>
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                    {selectedConversation.phoneNumber.slice(-2)}
                                </div>
                                <div>
                                    <p className="font-medium">{selectedConversation.phoneNumber}</p>
                                    <p className="text-xs text-gray-500">Active now</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedConversation.messages?.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user'
                                                ? 'bg-gray-100'
                                                : 'bg-blue-600 text-white'
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-500' : 'text-blue-100'
                                            }`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            {message.status && (
                                                <span className="ml-2">
                                                    {message.status === 'sent' && '✓'}
                                                    {message.status === 'delivered' && '✓✓'}
                                                    {message.status === 'read' && <span className="text-blue-300">✓✓</span>}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t">
                            {userEngagementData[selectedConversation.phoneNumber]?.isInWindow ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            This user is outside the 24-hour messaging window. You can only send template messages.
                                        </p>
                                    </div>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select a template...</option>
                                        {templates
                                            .filter(t => t.status === 'APPROVED')
                                            .map(template => (
                                                <option key={template.id} value={template.id}>
                                                    {template.name}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        onClick={() => {/* Send selected template */ }}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Send Template
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">WhatsApp Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number ID
                        </label>
                        <input
                            type="text"
                            value={settings.phoneNumberId}
                            onChange={(e) => setSettings({ ...settings, phoneNumberId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Phone Number ID"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp Business Account ID
                        </label>
                        <input
                            type="text"
                            value={settings.businessAccountId}
                            onChange={(e) => setSettings({ ...settings, businessAccountId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Business Account ID"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Access Token
                        </label>
                        <input
                            type="password"
                            value={settings.accessToken}
                            onChange={(e) => setSettings({ ...settings, accessToken: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Access Token"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Webhook Verify Token
                        </label>
                        <input
                            type="text"
                            value={settings.verifyToken}
                            onChange={(e) => setSettings({ ...settings, verifyToken: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Verify Token"
                        />
                    </div>

                    <button onClick={saveSettings} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Configuration
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Webhook URL</p>
                        <code className="text-xs text-gray-600 break-all">
                            {`${window.location.origin}/api/webhook`}
                        </code>
                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                            <Copy className="w-3 h-3 inline mr-1" />
                            Copy
                        </button>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium mb-1">API Base URL</p>
                        <code className="text-xs text-gray-600 break-all">
                            https://graph.facebook.com/v17.0
                        </code>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-medium mb-3">Connection Status</h4>
                    <button
                        onClick={testConnection}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <Wifi className="w-4 h-4" />
                        Test WhatsApp Connection
                    </button>
                </div>
            </div>
        </div>
    );

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'templates', label: 'Templates', icon: FileText },
        { id: 'automation', label: 'Automation', icon: Zap },
        { id: 'chatbot', label: 'Chatbot', icon: Bot },
        { id: 'conversations', label: 'Conversations', icon: MessageCircle, badge: conversations.filter(c => c.unread > 0).length },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden`}>
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        WhatsApp API
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <h2 className="text-xl font-semibold">
                                {menuItems.find(item => item.id === activeTab)?.label}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            <button
                                onClick={loadDashboardData}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'templates' && renderTemplates()}
                            {activeTab === 'automation' && renderAutomation()}
                            {activeTab === 'chatbot' && renderChatbot()}
                            {activeTab === 'conversations' && renderConversations()}
                            {activeTab === 'settings' && renderSettings()}
                        </>
                    )}
                </main>
            </div>

            {/* Notifications */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`px-4 py-3 rounded-lg shadow-lg text-white transition-all transform ${notification.type === 'error'
                                ? 'bg-red-600'
                                : notification.type === 'warning'
                                    ? 'bg-yellow-600'
                                    : 'bg-green-600'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {notification.type === 'error' && <AlertCircle className="w-4 h-4" />}
                            {notification.type === 'success' && <Check className="w-4 h-4" />}
                            <p className="text-sm">{notification.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhatsAppDashboard;