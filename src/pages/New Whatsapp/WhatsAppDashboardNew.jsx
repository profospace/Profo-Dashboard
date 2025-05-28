
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    MessageCircle, Send, Users, Home, FileText, Zap, Bot, Settings,
    Bell, Menu, X, Plus, Edit2, Trash2, Clock, Check, AlertCircle,
    Calendar, Filter, Search, Download, Upload, RefreshCw, Wifi,
    ChevronDown, ChevronRight, Eye, Copy, Shield, Activity
} from 'lucide-react';

// WhatsApp Cloud API Configuration
const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

// Backend API Configuration
// const WS_URL = import.meta.env.REACT_APP_WS_URL || 'ws://localhost:3100';
const WS_URL = import.meta.env.REACT_APP_WS_URL || 'wss://whatsapp-webhook-w7a3.onrender.com';
const API_URL = 'https://whatsapp-webhook-w7a3.onrender.com';

const WhatsAppDashboardNew = () => {
    // State management
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [wsConnected, setWsConnected] = useState(false);

    // WhatsApp API Credentials
    const [credentials, setCredentials] = useState({
        phoneNumberId: localStorage.getItem('whatsapp_phone_number_id') || '',
        businessAccountId: localStorage.getItem('whatsapp_business_account_id') || '',
        accessToken: localStorage.getItem('whatsapp_access_token') || '',
        verifyToken: localStorage.getItem('whatsapp_verify_token') || ''
    });

    // User engagement tracking
    const [userEngagement, setUserEngagement] = useState({});

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

    // Business Profile
    const [businessProfile, setBusinessProfile] = useState({
        about: '',
        address: '',
        description: '',
        email: '',
        websites: [],
        vertical: ''
    });
    const [profilePictureUrl, setProfilePictureUrl] = useState('');

    // Conversations
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState({});

    // Stats
    const [stats, setStats] = useState({
        totalMessages: 0,
        deliveredMessages: 0,
        readMessages: 0,
        totalConversations: 0
    });

    // Chatbot state
    const [chatbotEnabled, setChatbotEnabled] = useState(false);
    const [quickReplies, setQuickReplies] = useState([]);
    const [chatbotFlows, setChatbotFlows] = useState([]);
    const [welcomeMessage, setWelcomeMessage] = useState({
        enabled: false,
        message: 'Welcome! How can I help you today?',
        delay: 1000
    });
    const [awayMessage, setAwayMessage] = useState({
        enabled: false,
        message: "We're currently away but will respond as soon as possible.",
        startTime: '18:00',
        endTime: '09:00'
    });

    // WebSocket connection
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);

    // Utility functions
    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    // Save credentials to localStorage
    useEffect(() => {
        if (credentials.phoneNumberId) {
            localStorage.setItem('whatsapp_phone_number_id', credentials.phoneNumberId);
        }
        if (credentials.businessAccountId) {
            localStorage.setItem('whatsapp_business_account_id', credentials.businessAccountId);
        }
        if (credentials.accessToken) {
            localStorage.setItem('whatsapp_access_token', credentials.accessToken);
        }
        if (credentials.verifyToken) {
            localStorage.setItem('whatsapp_verify_token', credentials.verifyToken);
        }
    }, [credentials]);

    // Update stats when data changes
    useEffect(() => {
        const totalConversations = conversations.length;
        const totalMessages = Object.values(messages).flat().length;
        const deliveredMessages = Object.values(messages).flat().filter(m => m.status === 'delivered' || m.status === 'read').length;
        const readMessages = Object.values(messages).flat().filter(m => m.status === 'read').length;

        setStats({
            totalMessages,
            deliveredMessages,
            readMessages,
            totalConversations
        });
    }, [conversations, messages]);

    // MongoDB Integration Functions
    const loadChatbotSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chatbot/settings`);
            if (response.ok) {
                const settings = await response.json();
                setChatbotEnabled(settings.enabled);
                setQuickReplies(settings.quickReplies || []);
                setChatbotFlows(settings.flows || []);
                setWelcomeMessage(settings.welcomeMessage || welcomeMessage);
                setAwayMessage(settings.awayMessage || awayMessage);
            }
        } catch (error) {
            console.error('Error loading chatbot settings:', error);
            showNotification('Failed to load chatbot settings', 'error');
        }
    };

    const saveChatbotSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chatbot/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enabled: chatbotEnabled,
                    quickReplies,
                    flows: chatbotFlows,
                    welcomeMessage,
                    awayMessage
                })
            });

            if (response.ok) {
                showNotification('Chatbot settings saved successfully');
            }
        } catch (error) {
            console.error('Error saving chatbot settings:', error);
            showNotification('Failed to save chatbot settings', 'error');
        }
    };

    const loadConversationsFromDB = async () => {
        try {
            const response = await fetch(`${API_URL}/api/conversations`);
            if (response.ok) {
                const data = await response.json();
                console.log("data", data)
                setConversations(data.map(conv => ({
                    id: conv._id,
                    phoneNumber: conv.phoneNumber,
                    lastMessage: conv.lastMessage,
                    timestamp: conv.lastMessageTime,
                    unread: conv.unreadCount
                })));
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const loadMessagesFromDB = async (phoneNumber) => {
        try {
            const response = await fetch(`${API_URL}/api/conversations/${phoneNumber}/messages`);
            if (response.ok) {
                const data = await response.json();
                console.log("messages data", data)
                setMessages(prev => ({
                    ...prev,
                    [phoneNumber]: data.map(msg => ({
                        id: msg.messageId,
                        sender: msg.sender,
                        text: msg.text,
                        timestamp: msg.createdAt,
                        status: msg.status,
                        isAutomated: msg.isAutomated
                    }))
                }));
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const loadUserEngagementFromDB = async () => {
        try {
            const response = await fetch(`${API_URL}/api/user-engagement`);
            if (response.ok) {
                const data = await response.json();
                setUserEngagement(data);
            }
        } catch (error) {
            console.error('Error loading user engagement:', error);
        }
    };

    const markAsReadInDB = async (phoneNumber) => {
        try {
            await fetch(`${API_URL}/api/conversations/${phoneNumber}/read`, {
                method: 'PUT'
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // WhatsApp API Functions
    const whatsappAPI = async (endpoint, options = {}) => {
        if (!credentials.accessToken) {
            showNotification('Please configure your WhatsApp API credentials in Settings', 'error');
            return null;
        }

        try {
            const response = await fetch(`${WHATSAPP_API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${credentials.accessToken}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('WhatsApp API Error:', error);
            showNotification(error.message, 'error');
            return null;
        }
    };

    const loadTemplates = async () => {
        if (!credentials.businessAccountId) return;

        setLoading(true);
        try {
            const data = await whatsappAPI(`/${credentials.businessAccountId}/message_templates`);
            if (data?.data) {
                setTemplates(data.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const createTemplate = async () => {
        try {
            const components = [];

            if (templateForm.header) {
                components.push({
                    type: 'HEADER',
                    format: 'TEXT',
                    text: templateForm.header
                });
            }

            components.push({
                type: 'BODY',
                text: templateForm.body
            });

            if (templateForm.footer) {
                components.push({
                    type: 'FOOTER',
                    text: templateForm.footer
                });
            }

            const templateData = {
                name: templateForm.name,
                category: templateForm.category,
                language: templateForm.language,
                components: components
            };

            const result = await whatsappAPI(`/${credentials.businessAccountId}/message_templates`, {
                method: 'POST',
                body: JSON.stringify(templateData)
            });

            if (result) {
                showNotification('Template created and submitted for approval');
                setShowTemplateModal(false);
                resetTemplateForm();
                loadTemplates();
            }
        } catch (error) {
            showNotification('Failed to create template', 'error');
        }
    };

    const sendMessage = async () => {
        if (!selectedConversation || !messageInput.trim()) return;

        const phoneNumber = selectedConversation.phoneNumber;
        const isInWindow = checkIfInMessagingWindow(phoneNumber);

        try {
            let messageData;

            if (isInWindow) {
                messageData = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: phoneNumber,
                    type: 'text',
                    text: { body: messageInput }
                };
            } else {
                showNotification('User is outside 24-hour window. Please use a template.', 'warning');
                return;
            }

            const result = await whatsappAPI(`/${credentials.phoneNumberId}/messages`, {
                method: 'POST',
                body: JSON.stringify(messageData)
            });

            if (result) {
                const newMessage = {
                    id: result.messages[0].id,
                    sender: 'business',
                    text: messageInput,
                    timestamp: new Date().toISOString(),
                    status: 'sent'
                };

                updateConversationMessages(phoneNumber, newMessage);
                setMessageInput('');
                showNotification('Message sent successfully');
            }
        } catch (error) {
            showNotification('Failed to send message', 'error');
        }
    };

    const sendTemplateMessage = async (phoneNumber, templateName, languageCode, parameters = []) => {
        try {
            const messageData = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: phoneNumber,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: languageCode },
                    components: parameters.length > 0 ? [{
                        type: 'body',
                        parameters: parameters.map(param => ({
                            type: 'text',
                            text: param
                        }))
                    }] : undefined
                }
            };

            const result = await whatsappAPI(`/${credentials.phoneNumberId}/messages`, {
                method: 'POST',
                body: JSON.stringify(messageData)
            });

            if (result) {
                showNotification('Template message sent successfully');
                return result;
            }
        } catch (error) {
            showNotification('Failed to send template message', 'error');
            return null;
        }
    };

    const testConnection = async () => {
        if (!credentials.phoneNumberId || !credentials.accessToken) {
            showNotification('Please enter your credentials first', 'error');
            return;
        }

        setLoading(true);
        try {
            const data = await whatsappAPI(`/${credentials.phoneNumberId}`);
            if (data) {
                showNotification(`Connected! Phone number: ${data.display_phone_number}`, 'success');
            }
        } finally {
            setLoading(false);
        }
    };

    const checkIfInMessagingWindow = (phoneNumber) => {
        const engagement = userEngagement[phoneNumber];
        if (!engagement) return false;

        const lastMessageTime = new Date(engagement.lastMessageTime).getTime();
        const currentTime = new Date().getTime();
        const hoursSinceLastMessage = (currentTime - lastMessageTime) / (1000 * 60 * 60);

        return hoursSinceLastMessage < 24;
    };

    const updateConversationMessages = (phoneNumber, newMessage) => {
        setMessages(prev => ({
            ...prev,
            [phoneNumber]: [...(prev[phoneNumber] || []), newMessage]
        }));

        setConversations(prev =>
            prev.map(conv =>
                conv.phoneNumber === phoneNumber
                    ? { ...conv, lastMessage: newMessage.text, timestamp: newMessage.timestamp }
                    : conv
            )
        );
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

    // WebSocket connection
    const connectWebSocket = useCallback(() => {
        try {
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                console.log('Connected to WhatsApp webhook server');
                setWsConnected(true);
                showNotification('Connected to real-time updates', 'success');
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'message':
                        handleIncomingWhatsAppMessage(data);
                        break;
                    case 'status_update':
                        handleMessageStatusUpdate(data);
                        break;
                    case 'chatbot_reply':
                        if (data.to && data.reply) {
                            setTimeout(() => {
                                sendAutomatedReply(data.to, data.reply);
                            }, data.delay || 1000);
                        }
                        break;
                    default:
                        console.log('Unknown message type:', data);
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                showNotification('Real-time connection error', 'error');
            };

            ws.current.onclose = () => {
                console.log('WebSocket disconnected');
                setWsConnected(false);
                showNotification('Real-time updates disconnected', 'warning');
                reconnectTimeout.current = setTimeout(connectWebSocket, 5000);
            };
        } catch (error) {
            console.error('WebSocket connection failed:', error);
        }
    }, []);

    const handleIncomingWhatsAppMessage = async (data) => {
        const { from, message, messageId, timestamp } = data;

        const newMessage = {
            id: messageId,
            sender: 'user',
            text: message,
            timestamp: timestamp
        };

        updateConversationMessages(from, newMessage);

        setConversations(prev => {
            const exists = prev.find(c => c.phoneNumber === from);
            if (!exists) {
                return [{
                    id: Date.now(),
                    phoneNumber: from,
                    lastMessage: message,
                    timestamp: timestamp,
                    unread: 1
                }, ...prev];
            }
            return prev.map(c =>
                c.phoneNumber === from
                    ? { ...c, lastMessage: message, timestamp: timestamp, unread: c.unread + 1 }
                    : c
            );
        });

        showNotification(`New message from ${from}`);
    };

    const handleMessageStatusUpdate = (data) => {
        const { messageId, status } = data;

        setMessages(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(phoneNumber => {
                updated[phoneNumber] = updated[phoneNumber].map(msg =>
                    msg.id === messageId ? { ...msg, status } : msg
                );
            });
            return updated;
        });
    };

    const sendAutomatedReply = async (phoneNumber, replyMessage) => {
        const isInWindow = checkIfInMessagingWindow(phoneNumber);

        try {
            if (isInWindow) {
                const messageData = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: phoneNumber,
                    type: 'text',
                    text: { body: replyMessage }
                };

                const result = await whatsappAPI(`/${credentials.phoneNumberId}/messages`, {
                    method: 'POST',
                    body: JSON.stringify(messageData)
                });

                if (result) {
                    const autoReplyMessage = {
                        id: result.messages[0].id,
                        sender: 'business',
                        text: replyMessage,
                        timestamp: new Date().toISOString(),
                        status: 'sent',
                        isAutomated: true
                    };

                    updateConversationMessages(phoneNumber, autoReplyMessage);
                }
            }
        } catch (error) {
            console.error('Failed to send automated reply:', error);
        }
    };

    // Load initial data
    useEffect(() => {
        loadChatbotSettings();
        loadConversationsFromDB();
        loadUserEngagementFromDB();
    }, []);

    useEffect(() => {
        if (credentials.accessToken && credentials.businessAccountId) {
            loadTemplates();
        }
    }, [credentials.accessToken, credentials.businessAccountId]);

    useEffect(() => {
        if (selectedConversation) {
            loadMessagesFromDB(selectedConversation.phoneNumber);
            if (selectedConversation.unread > 0) {
                markAsReadInDB(selectedConversation.phoneNumber);
            }
        }
    }, [selectedConversation]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [connectWebSocket]);

    // Render functions
    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
                <div className="flex gap-3">
                    <button
                        onClick={loadTemplates}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                        Refresh Templates
                    </button>
                    <button
                        onClick={testConnection}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                        Test Connection
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Conversations</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalConversations}</p>
                        </div>
                        <MessageCircle className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Messages Sent</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalMessages}</p>
                        </div>
                        <Send className="w-12 h-12 text-green-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Messages Delivered</p>
                            <p className="text-2xl font-bold mt-1">{stats.deliveredMessages}</p>
                        </div>
                        <Check className="w-12 h-12 text-purple-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Messages Read</p>
                            <p className="text-2xl font-bold mt-1">{stats.readMessages}</p>
                        </div>
                        <Eye className="w-12 h-12 text-orange-500 opacity-20" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">User Engagement Status</h3>
                <div className="space-y-3">
                    {Object.entries(userEngagement).map(([phone, engagement]) => {
                        const isInWindow = checkIfInMessagingWindow(phone);
                        const lastMessageTime = new Date(engagement.lastMessageTime);
                        const hoursAgo = (new Date() - lastMessageTime) / (1000 * 60 * 60);

                        return (
                            <div key={phone} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">{phone}</p>
                                    <p className="text-sm text-gray-600">
                                        Last message: {hoursAgo < 1 ? 'Less than 1 hour ago' : `${Math.floor(hoursAgo)} hours ago`}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm ${isInWindow
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {isInWindow ? 'In Window' : 'Template Only'}
                                </div>
                            </div>
                        );
                    })}
                    {Object.keys(userEngagement).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No user engagements yet</p>
                    )}
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
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(template.name);
                                            showNotification('Template name copied!');
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {templates.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No templates found. Create your first template!</p>
                    </div>
                )}
            </div>

            {showTemplateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Create Message Template</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Template Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={templateForm.name}
                                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., welcome_message"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category <span className="text-red-500">*</span>
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
                                        Language <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={templateForm.language}
                                        onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="en_US">English (US)</option>
                                        <option value="en_GB">English (UK)</option>
                                        <option value="es_ES">Spanish (Spain)</option>
                                        <option value="es_MX">Spanish (Mexico)</option>
                                        <option value="pt_BR">Portuguese (Brazil)</option>
                                        <option value="hi_IN">Hindi</option>
                                    </select>
                                </div>
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
                                    disabled={!templateForm.name || !templateForm.body}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

    const renderChatbot = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Chatbot Settings</h3>
                        <p className="text-sm text-gray-600">Automate responses to common queries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={chatbotEnabled}
                            onChange={(e) => setChatbotEnabled(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <button
                    onClick={saveChatbotSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Save All Settings
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold mb-4">Quick Replies</h4>
                <div className="space-y-3">
                    {quickReplies.map((reply, index) => (
                        <div key={reply.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <input
                                type="checkbox"
                                checked={reply.enabled}
                                onChange={(e) => {
                                    const updated = [...quickReplies];
                                    updated[index].enabled = e.target.checked;
                                    setQuickReplies(updated);
                                }}
                                className="w-4 h-4"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={reply.keyword}
                                    onChange={(e) => {
                                        const updated = [...quickReplies];
                                        updated[index].keyword = e.target.value;
                                        setQuickReplies(updated);
                                    }}
                                    className="w-full px-3 py-1 border rounded mb-1"
                                    placeholder="Keyword"
                                />
                                <textarea
                                    value={reply.reply}
                                    onChange={(e) => {
                                        const updated = [...quickReplies];
                                        updated[index].reply = e.target.value;
                                        setQuickReplies(updated);
                                    }}
                                    className="w-full px-3 py-1 border rounded text-sm"
                                    placeholder="Reply message"
                                    rows={2}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setQuickReplies(quickReplies.filter((_, i) => i !== index));
                                }}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            setQuickReplies([...quickReplies, {
                                id: Date.now(),
                                keyword: '',
                                reply: '',
                                enabled: true
                            }]);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Quick Reply
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAutomation = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Automation Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Chatbot Status</p>
                                <p className="text-xl font-bold">{chatbotEnabled ? 'Active' : 'Inactive'}</p>
                            </div>
                            <Bot className={`w-8 h-8 ${chatbotEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Quick Replies</p>
                                <p className="text-xl font-bold">{quickReplies.filter(qr => qr.enabled).length}</p>
                            </div>
                            <Zap className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Flows</p>
                                <p className="text-xl font-bold">{chatbotFlows.filter(f => f.enabled).length}</p>
                            </div>
                            <Activity className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderConversations = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h3 className="font-semibold mb-3">Conversations</h3>
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
                    {conversations.map((conversation) => {
                        const isInWindow = checkIfInMessagingWindow(conversation.phoneNumber);
                        return (
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
                                <div className="mt-2 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isInWindow ? 'bg-green-500' : 'bg-yellow-500'
                                        }`} />
                                    <span className="text-xs text-gray-500">
                                        {isInWindow ? 'In 24h window' : 'Template only'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

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
                                    <p className="text-xs text-gray-500">
                                        {checkIfInMessagingWindow(selectedConversation.phoneNumber)
                                            ? 'Can send messages'
                                            : 'Template messages only'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {(messages[selectedConversation.phoneNumber] || []).map((message, index) => (
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
                            {checkIfInMessagingWindow(selectedConversation.phoneNumber) ? (
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
                                            24-hour window expired. You can only send pre-approved template messages.
                                        </p>
                                    </div>
                                    <select
                                        onChange={(e) => {
                                            const template = templates.find(t => t.name === e.target.value);
                                            if (template) {
                                                sendTemplateMessage(
                                                    selectedConversation.phoneNumber,
                                                    template.name,
                                                    template.language
                                                );
                                            }
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a template to send...</option>
                                        {templates
                                            .filter(t => t.status === 'APPROVED')
                                            .map(template => (
                                                <option key={template.id} value={template.name}>
                                                    {template.name}
                                                </option>
                                            ))}
                                    </select>
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
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">WhatsApp Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number ID
                        </label>
                        <input
                            type="text"
                            value={credentials.phoneNumberId}
                            onChange={(e) => setCredentials({ ...credentials, phoneNumberId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Phone Number ID from Meta Business"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp Business Account ID
                        </label>
                        <input
                            type="text"
                            value={credentials.businessAccountId}
                            onChange={(e) => setCredentials({ ...credentials, businessAccountId: e.target.value })}
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
                            value={credentials.accessToken}
                            onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Permanent Access Token"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Webhook Verify Token
                        </label>
                        <input
                            type="text"
                            value={credentials.verifyToken}
                            onChange={(e) => setCredentials({ ...credentials, verifyToken: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Create your own verify token"
                        />
                    </div>

                    <button
                        onClick={() => showNotification('Settings saved!', 'success')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'templates', label: 'Templates', icon: FileText },
        { id: 'chatbot', label: 'Chatbot', icon: Bot, badge: chatbotEnabled ? 'ON' : '' },
        { id: 'automation', label: 'Automation', icon: Zap },
        { id: 'conversations', label: 'Conversations', icon: MessageCircle, badge: conversations.filter(c => c.unread > 0).length },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    // Main render
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden`}>
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-green-600" />
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
                                        ? 'bg-green-50 text-green-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <span className="ml-auto bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {item.badge === 'ON' && (
                                    <span className="ml-auto bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">API Status</p>
                        <p className="text-sm font-medium flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${credentials.accessToken ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {credentials.accessToken ? 'Connected' : 'Not Connected'}
                        </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg mt-2">
                        <p className="text-xs text-gray-600">Webhook Status</p>
                        <p className="text-sm font-medium flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            {wsConnected ? 'Live Updates Active' : 'Disconnected'}
                        </p>
                    </div>
                </div>
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
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'templates' && renderTemplates()}
                            {activeTab === 'chatbot' && renderChatbot()}
                            {activeTab === 'automation' && renderAutomation()}
                            {activeTab === 'conversations' && renderConversations()}
                            {activeTab === 'settings' && renderSettings()}
                        </>
                    )}
                </main>
            </div>

            {/* Notifications */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {notifications?.map((notification,index) => (
                    <div
                        key={index}
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

export default WhatsAppDashboardNew;