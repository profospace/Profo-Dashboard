import React, { useState, useEffect } from 'react';
import { Plus, Smartphone, QrCode, Play, Square, RotateCcw, Trash2, Edit3, Eye, Wifi, WifiOff } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const DevicesTab = () => {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState(null);
    const [qrCode, setQrCode] = useState('');
    const [newInstanceName, setNewInstanceName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchInstances();
    }, []);

    const fetchInstances = async () => {
        try {
            const response = await fetch(`${base_url}/api/devices`, getAuthConfig());
            const data = await response.json();
            console.log("data" , data)
            setInstances(data);
        } catch (error) {
            console.error('Error fetching instances:', error);
        } finally {
            setLoading(false);
        }
    };

    const createInstance = async () => {
        if (!newInstanceName.trim()) return;

        setCreating(true);
        try {
            const response = await axios.post(
                `${base_url}/api/devices/create`,
                { name: newInstanceName },
                getAuthConfig()
            );

            const data = response.data;

            setNewInstanceName('');
            setShowCreateModal(false);
            fetchInstances();

            // Automatically show QR code for new instance
            setTimeout(() => {
                showQRCode(data.instanceKey);
            }, 1000);

        } catch (error) {
            console.error('Error creating instance:', error);
        } finally {
            setCreating(false);
        }
    };

    const showQRCode = async (instanceKey) => {
        try {
            const { data } = await axios.get(
                `${base_url}/api/devices/${instanceKey}/qr`,
                getAuthConfig()          // adds Authorization header
            );

            setQrCode(data.qrCode);
            setSelectedInstance(instanceKey);
            setShowQRModal(true);

        } catch (error) {
            console.error('Error fetching QR code:', error);
        }
    };

    const stopInstance = async (instanceKey) => {
        try {
            await axios.post(
                `${base_url}/api/devices/${instanceKey}/stop`,
                {},                    // no request body
                getAuthConfig()
            );
            fetchInstances();
        } catch (error) {
            console.error('Error stopping instance:', error);
        }
    };

    // ────────────────────────────────────────────
    // 3. Restart instance
    // ────────────────────────────────────────────
    const restartInstance = async (instanceKey) => {
        try {
            await axios.post(
                `${base_url}/api/devices/${instanceKey}/restart`,
                {},
                getAuthConfig()
            );
            fetchInstances();
        } catch (error) {
            console.error('Error restarting instance:', error);
        }
    };

    // ────────────────────────────────────────────
    // 4. Delete instance
    // ────────────────────────────────────────────
    const deleteInstance = async (instanceKey) => {
        if (!window.confirm('Are you sure you want to delete this instance?')) return;

        try {
            await axios.delete(
                `${base_url}/api/devices/${instanceKey}`,
                getAuthConfig()
            );
            fetchInstances();
        } catch (error) {
            console.error('Error deleting instance:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'bg-green-100 text-green-800 border-green-200';
            case 'disconnected': return 'bg-red-100 text-red-800 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'connected': return <Wifi className="w-4 h-4" />;
            case 'disconnected': return <WifiOff className="w-4 h-4" />;
            case 'pending': return <RotateCcw className="w-4 h-4 animate-spin" />;
            default: return <WifiOff className="w-4 h-4" />;
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
                    <h2 className="text-2xl font-bold text-gray-900">WhatsApp Devices</h2>
                    <p className="text-gray-600 mt-1">Manage your WhatsApp instances and connections</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Device</span>
                </button>
            </div>

            {/* Instances Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {instances.length === 0 ? (
                    <div className="text-center py-16">
                        <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No WhatsApp Devices</h3>
                        <p className="text-gray-600 mb-6">Create your first WhatsApp device to start automating messages</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                        >
                            Create First Device
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Device Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Phone Number</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Last Active</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {instances?.map((instance) => (
                                    <tr key={instance?.instanceKey} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mr-4">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{instance?.name}</p>
                                                    <p className="text-sm text-gray-500">{instance?.instanceKey}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(instance.status)}`}>
                                                {getStatusIcon(instance?.status)}
                                                <span className="ml-2">{instance?.status.charAt(0).toUpperCase() + instance?.status.slice(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-medium">
                                                {instance?.phoneNumber ? `+${instance?.phoneNumber}` : 'Not connected'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600">
                                                {instance?.lastActive ? new Date(instance?.lastActive).toLocaleString() : 'Never'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {instance?.status === 'pending' && (
                                                    <button
                                                        onClick={() => showQRCode(instance?.instanceKey)}
                                                        className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-150"
                                                        title="Show QR Code"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {instance?.status === 'connected' && (
                                                    <button
                                                        onClick={() => stopInstance(instance?.instanceKey)}
                                                        className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors duration-150"
                                                        title="Stop Instance"
                                                    >
                                                        <Square className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {instance?.status === 'disconnected' && (
                                                    <button
                                                        onClick={() => restartInstance(instance?.instanceKey)}
                                                        className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors duration-150"
                                                        title="Restart Instance"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => restartInstance(instance?.instanceKey)}
                                                    className="bg-orange-100 text-orange-700 p-2 rounded-lg hover:bg-orange-200 transition-colors duration-150"
                                                    title="Restart"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>

                                                <button
                                                    className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => deleteInstance(instance?.instanceKey)}
                                                    className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors duration-150"
                                                    title="Delete"
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
                )}
            </div>

            {/* Create Instance Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New WhatsApp Device</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
                                <input
                                    type="text"
                                    value={newInstanceName}
                                    onChange={(e) => setNewInstanceName(e.target.value)}
                                    placeholder="Enter device name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createInstance}
                                    disabled={creating || !newInstanceName.trim()}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Scan QR Code</h3>
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Open WhatsApp on your phone and scan this QR code to connect your device
                            </p>
                            {qrCode ? (
                                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-6">
                                    <img src={qrCode} alt="QR Code" className="w-full max-w-64 mx-auto" />
                                </div>
                            ) : (
                                <div className="bg-gray-100 p-8 rounded-lg mb-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Generating QR code...</p>
                                </div>
                            )}
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>1. Open WhatsApp on your phone</p>
                                <p>2. Go to Settings → Linked Devices</p>
                                <p>3. Tap "Link a Device"</p>
                                <p>4. Scan the QR code above</p>
                            </div>
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevicesTab;