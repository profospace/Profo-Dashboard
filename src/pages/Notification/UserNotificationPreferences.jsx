import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Tag, DollarSign, Home, Search } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const UserNotificationPreferences = ({ userId }) => {
    const [preferences, setPreferences] = useState({
        email: true,
        push: true,
        sms: false,
        priceAlerts: true,
        newPropertyAlerts: true,
        savedSearchAlerts: true,
        dailyDigest: false,
        propertyUpdates: true,
        inactivityReminders: true,
        marketingNotifications: false
    });

    const [deviceTokens, setDeviceTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        // Fetch user notification preferences when component loads
        fetchPreferences();
    }, [userId]);

    const fetchPreferences = async () => {
        try {
            setLoading(true);
            setError(null);

            // API call to fetch user preferences using base_url and getAuthConfig
            const response = await fetch(`${base_url}/users/profile`, getAuthConfig());

            if (!response.ok) {
                throw new Error('Failed to fetch notification preferences');
            }

            const data = await response.json();

            // Extract preferences and device tokens
            if (data.user && data.user.profile && data.user.profile.notifications) {
                setPreferences(data.user.profile.notifications);
            }

            if (data.user && data.user.notificationTokens) {
                setDeviceTokens(data.user.notificationTokens);
            }
        } catch (err) {
            setError('Error loading your notification preferences. Please try again.');
            console.error('Error fetching preferences:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            // API call to update preferences using base_url and getAuthConfig
            const config = getAuthConfig();
            const response = await fetch(`${base_url}/notifications/settings`, {
                method: 'PUT',
                headers: config.headers,
                body: JSON.stringify(preferences)
            });

            if (!response.ok) {
                throw new Error('Failed to update notification preferences');
            }

            const data = await response.json();

            if (data.success) {
                setSuccess('Your notification preferences have been updated successfully');
            } else {
                throw new Error(data.message || 'Failed to update preferences');
            }
        } catch (err) {
            setError('Error saving your preferences. Please try again.');
            console.error('Error saving preferences:', err);
        } finally {
            setSaving(false);
        }
    };

    const registerDeviceForNotifications = async () => {
        try {
            // This would use the FCM SDK to get the device token
            // This is a simplified example
            if (!('Notification' in window)) {
                setError('Notifications are not supported in this browser');
                return;
            }

            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                setError('Notification permission denied');
                return;
            }

            // In a real implementation, you'd use the FCM SDK to get the token
            const mockToken = 'fcm-token-' + Math.random().toString(36).substring(2, 10);

            // Register the token with your backend using base_url and getAuthConfig
            const config = getAuthConfig();
            const response = await fetch(`${base_url}/notifications/register-token`, {
                method: 'POST',
                headers: config.headers,
                body: JSON.stringify({
                    deviceToken: mockToken,
                    deviceType: 'web'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to register device for notifications');
            }

            const data = await response.json();

            if (data.success) {
                setSuccess('Your device has been registered for notifications');
                // Refresh the list of device tokens
                fetchPreferences();
            } else {
                throw new Error(data.message || 'Failed to register device');
            }
        } catch (err) {
            setError('Error registering device for notifications. Please try again.');
            console.error('Error registering device:', err);
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2">Loading your notification preferences...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <Bell className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Notification Methods</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <Bell className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                                <span className="font-medium">Push Notifications</span>
                                <p className="text-sm text-gray-500">Receive notifications on this device</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.push}
                                onChange={() => handleToggle('push')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.push ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <span className="font-medium">Email Notifications</span>
                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.email}
                                onChange={() => handleToggle('email')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.email ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <span className="font-medium">SMS Notifications</span>
                                <p className="text-sm text-gray-500">Receive text messages for important alerts</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.sms}
                                onChange={() => handleToggle('sms')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.sms ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Notification Types</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                            <div>
                                <span className="font-medium">Price Alerts</span>
                                <p className="text-sm text-gray-500">Notify me when properties I'm interested in change price</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.priceAlerts}
                                onChange={() => handleToggle('priceAlerts')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.priceAlerts ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <Home className="h-5 w-5 text-blue-500 mr-2" />
                            <div>
                                <span className="font-medium">New Property Alerts</span>
                                <p className="text-sm text-gray-500">Notify me about new properties matching my preferences</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.newPropertyAlerts}
                                onChange={() => handleToggle('newPropertyAlerts')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.newPropertyAlerts ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <Search className="h-5 w-5 text-purple-500 mr-2" />
                            <div>
                                <span className="font-medium">Saved Search Alerts</span>
                                <p className="text-sm text-gray-500">Get updates for my saved searches</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.savedSearchAlerts}
                                onChange={() => handleToggle('savedSearchAlerts')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.savedSearchAlerts ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 text-orange-500 mr-2" />
                            <div>
                                <span className="font-medium">Daily Digest</span>
                                <p className="text-sm text-gray-500">Receive a daily summary of activity</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.dailyDigest}
                                onChange={() => handleToggle('dailyDigest')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.dailyDigest ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <Tag className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                                <span className="font-medium">Marketing Notifications</span>
                                <p className="text-sm text-gray-500">Occasional offers and promotions</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences.marketingNotifications}
                                onChange={() => handleToggle('marketingNotifications')}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${preferences.marketingNotifications ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Registered Devices</h3>

                {deviceTokens.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded border">
                        <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No devices registered for notifications</p>
                        <button
                            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={registerDeviceForNotifications}
                        >
                            Register This Device
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deviceTokens.map((device, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center">
                                    <Bell className="h-5 w-5 text-green-500 mr-2" />
                                    <div>
                                        <span className="font-medium">
                                            {device.deviceType === 'web' ? 'Web Browser' :
                                                device.deviceType === 'ios' ? 'iOS Device' :
                                                    device.deviceType === 'android' ? 'Android Device' :
                                                        'Unknown Device'}
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Registered on {new Date(device.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-red-500 hover:text-red-700">
                                    Unregister
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </div>
    );
};

export default UserNotificationPreferences;