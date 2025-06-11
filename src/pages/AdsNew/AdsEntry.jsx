import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Dashboard from '../../components/AdsNew/Dashboard';
import AdsManagement from '../../components/AdsNew/AdsManagement';
import CreateEditAd from '../../components/AdsNew/CreateEditAd';
import Analytics from '../../components/AdsNew/Analytics';
import Settings from '../../components/AdsNew/Settings';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';


function AdsEntry() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [editingAd, setEditingAd] = useState(null);

    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'ads', name: 'Ads Management', icon: '📢' },
        { id: 'analytics', name: 'Analytics', icon: '📈' },
        { id: 'settings', name: 'Settings', icon: '⚙️' },
    ];

    const handleEditAd = (ad) => {
        setEditingAd(ad);
        setActiveTab('create-edit');
    };

    const handleCreateNew = () => {
        setEditingAd(null);
        setActiveTab('create-edit');
    };

    const handleSaveComplete = () => {
        setEditingAd(null);
        setActiveTab('ads');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard base_url={base_url} getAuthConfig={getAuthConfig} />;
            case 'ads':
                return (
                    <AdsManagement
                        base_url={base_url}
                        getAuthConfig={getAuthConfig}
                        onEditAd={handleEditAd}
                        onCreateNew={handleCreateNew}
                    />
                );
            case 'create-edit':
                return (
                    <CreateEditAd
                        base_url={base_url}
                        getAuthConfig={getAuthConfig}
                        editingAd={editingAd}
                        onSaveComplete={handleSaveComplete}
                        onCancel={() => setActiveTab('ads')}
                    />
                );
            case 'analytics':
                return <Analytics base_url={base_url} getAuthConfig={getAuthConfig} />;
            case 'settings':
                return <Settings base_url={base_url} getAuthConfig={getAuthConfig} />;
            default:
                return <Dashboard base_url={base_url} getAuthConfig={getAuthConfig} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">AD</span>
                                </div>
                                <h1 className="ml-3 text-xl font-semibold text-gray-900">Ads Dashboard</h1>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className={`lg:w-64 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
                        <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <ul className="space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className="mr-3 text-lg">{item.icon}</span>
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdsEntry;