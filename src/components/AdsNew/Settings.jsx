import React, { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Globe, Clock, Users, Zap } from 'lucide-react';

const Settings = ({ base_url, getAuthConfig }) => {
    const [settings, setSettings] = useState({
        defaultShowFrequency: 3,
        maxAdsPerSession: 5,
        adCooldownMinutes: 30,
        isAdsEnabled: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/ads/settings`, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage('');

            const response = await fetch(`${base_url}/api/ads/settings`, {
                ...getAuthConfig(),
                method: 'PUT',
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Error saving settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const SettingCard = ({ title, description, icon: Icon, children }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-4">{description}</p>
                    {children}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Settings</h2>
                    <p className="text-gray-600">Configure global advertising behavior and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                    <Save size={20} className="mr-2" />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('Error')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                    {message}
                </div>
            )}

            {/* Settings Cards */}
            <div className="space-y-6">
                {/* Global Ad Control */}
                <SettingCard
                    title="Global Ad Control"
                    description="Master switch to enable or disable all advertising across the platform"
                    icon={Globe}
                >
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="adsEnabled"
                            checked={settings.isAdsEnabled}
                            onChange={(e) => updateSetting('isAdsEnabled', e.target.checked)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="adsEnabled" className="ml-3 text-sm font-medium text-gray-700">
                            Enable advertisements globally
                        </label>
                    </div>
                </SettingCard>

                {/* Ad Frequency */}
                <SettingCard
                    title="Ad Frequency"
                    description="Control how often ads are shown to users during their browsing session"
                    icon={Zap}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Show Frequency
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={settings.defaultShowFrequency}
                                    onChange={(e) => updateSetting('defaultShowFrequency', parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-600">
                                    Show ads every {settings.defaultShowFrequency} property views
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Ads Per Session
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={settings.maxAdsPerSession}
                                    onChange={(e) => updateSetting('maxAdsPerSession', parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-600">
                                    Maximum {settings.maxAdsPerSession} ads per user session
                                </span>
                            </div>
                        </div>
                    </div>
                </SettingCard>

                {/* Ad Timing */}
                <SettingCard
                    title="Ad Timing"
                    description="Configure timing-related settings for better user experience"
                    icon={Clock}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ad Cooldown Period
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                min="1"
                                max="1440"
                                value={settings.adCooldownMinutes}
                                onChange={(e) => updateSetting('adCooldownMinutes', parseInt(e.target.value))}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-600">
                                minutes between showing the same ad to a user
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            This prevents users from seeing the same ad too frequently
                        </p>
                    </div>
                </SettingCard>

                {/* System Information */}
                <SettingCard
                    title="System Information"
                    description="Current system status and configuration details"
                    icon={SettingsIcon}
                >
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Ads System Status</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${settings.isAdsEnabled
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {settings.isAdsEnabled ? 'Active' : 'Disabled'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Last Updated</span>
                            <span className="text-sm text-gray-600">
                                {new Date(settings.updatedAt || Date.now()).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </SettingCard>
            </div>

            {/* Additional Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Configuration Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Lower frequency values show ads more often but may impact user experience</li>
                    <li>• Higher cooldown periods improve user satisfaction but may reduce ad impressions</li>
                    <li>• Monitor your analytics to find the optimal balance for your audience</li>
                    <li>• Consider different settings for different user segments or locations</li>
                </ul>
            </div>
        </div>
    );
};

export default Settings;