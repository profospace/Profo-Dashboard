import React, { useState, useEffect } from 'react';
import { BarChart3, Smartphone, MessageSquare, Send, Zap, FileText, Menu, X, LogOut, User, Settings } from 'lucide-react';

// Import tab components (these would be separate files in a real app)
import Dashboard from './Dashboard';
import DevicesTab from './DevicesTab';
import TemplateTab from './TemplateTab';
import WelcomeTemplateTab from './WelcomeTemplateTab';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import AutoReplyTab from './AutoReplyTab';
import SendMessageTab from './SendMessageTab';
import MessageReportsTab from './MessageReportsTab';

const Entry = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user data
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${base_url}/api/auth/profile`, getAuthConfig());
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue' },
        { id: 'devices', label: 'Devices', icon: Smartphone, color: 'green' },
        { id: 'welcome', label: 'Welcome Templates', icon: MessageSquare, color: 'purple' },
        { id: 'autoreply', label: 'Auto Reply', icon: Zap, color: 'yellow' },
        { id: 'templates', label: 'Templates', icon: FileText, color: 'indigo' },
        { id: 'send-message', label: 'Send Message', icon: Send, color: 'pink' },
        { id: 'reports', label: 'Message Reports', icon: BarChart3, color: 'orange' }
    ];

    const getTabColorClass = (color, isActive) => {
        const colors = {
            blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700',
            green: isActive ? 'bg-green-100 text-green-700 border-green-300' : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
            purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-300' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
            yellow: isActive ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-700',
            indigo: isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
            pink: isActive ? 'bg-pink-100 text-pink-700 border-pink-300' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700',
            orange: isActive ? 'bg-orange-100 text-orange-700 border-orange-300' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
        };
        return colors[color] || colors.blue;
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'devices':
                return <DevicesTab />;
            case 'templates':
                return <TemplateTab />;
            case 'welcome':
                return <WelcomeTemplateTab />;
            case 'autoreply':
                return <AutoReplyTab />;
            case 'send-message':
                return <SendMessageTab />;
            case 'reports':
                return <MessageReportsTab />;
            default:
                return <Dashboard />;
        }
    };

    // Placeholder components for tabs not yet implemented
    // const WelcomeTemplateTab = () => (
    //     <div className="text-center py-16">
    //         <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    //         <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome Templates</h3>
    //         <p className="text-gray-600">Configure welcome messages for new contacts</p>
    //     </div>
    // );

    // const AutoReplyTab = () => (
    //     <div className="text-center py-16">
    //         <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    //         <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto Reply</h3>
    //         <p className="text-gray-600">Set up automatic responses to keywords</p>
    //     </div>
    // );

    // const SendMessageTab = () => (
    //     <div className="text-center py-16">
    //         <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    //         <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Message</h3>
    //         <p className="text-gray-600">Send bulk messages to multiple contacts</p>
    //     </div>
    // );

    // const MessageReportsTab = () => (
    //     <div className="text-center py-16">
    //         <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    //         <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Reports</h3>
    //         <p className="text-gray-600">View detailed message analytics and reports</p>
    //     </div>
    // );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">WhatsApp Bot</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${getTabColorClass(item.color, isActive)} ${isActive ? 'border shadow-sm' : ''}`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    {user && (
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-gray-200 p-2 rounded-full">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-1 rounded">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">WhatsApp Bot</span>
                        </div>
                        <div className="w-6"></div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="container mx-auto px-4 py-6 lg:px-8">
                        {renderActiveTab()}
                    </div>
                </main>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 -z-10 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-purple-50 to-transparent"></div>
            </div>
        </div>
    );
};

export default Entry;