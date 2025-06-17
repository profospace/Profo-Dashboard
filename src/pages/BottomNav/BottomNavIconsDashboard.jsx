import React, { useState, useEffect, useRef } from 'react';
import { Upload, Edit, Trash2, Save, X, Plus, Eye, EyeOff, Settings, RefreshCw } from 'lucide-react';
import { getAuthConfig } from '../../../utils/authConfig';
import { base_url } from '../../../utils/base_url';
import axios from 'axios';

const BottomNavIconsDashboard = () => {
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingIcon, setEditingIcon] = useState(null);
    const [version, setVersion] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef();


    useEffect(() => {
        fetchIcons();
    }, []);

    const fetchIcons = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/admin/bottom-nav-config`, getAuthConfig());

            if (!response.ok) throw new Error('Failed to fetch icons');

            const data = await response.json();
            if (data.success) {
                setIcons(data.data.icons || []);
                setVersion(data.data.version || '');
                setLastUpdated(data.data.lastUpdated || '');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // const updateIcon = async (iconId, formData) => {
    //     try {
    //         setUploadLoading(true);
    //         const response = await fetch(`${base_url}/api/bottom-nav-icons/${iconId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: formData
    //         });

    //         if (!response.ok) throw new Error('Failed to update icon');

    //         const data = await response.json();
    //         if (data.success) {
    //             await fetchIcons(); // Refresh the list
    //             setEditingIcon(null);
    //             alert('Icon updated successfully!');
    //         }
    //     } catch (err) {
    //         alert('Error updating icon: ' + err.message);
    //     } finally {
    //         setUploadLoading(false);
    //     }
    // };

    const updateIcon = async (iconId, formData) => {
        try {
            setUploadLoading(true);

            const config = getAuthConfig(); // Should include headers with Authorization
            const response = await axios.post(`${base_url}/api/bottom-nav-icons/${iconId}`, formData, config);

            if (response.data.success) {
                await fetchIcons(); // Refresh the list
                setEditingIcon(null);
                alert('Icon updated successfully!');
            }
        } catch (err) {
            alert('Error updating icon: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploadLoading(false);
        }
    };

    // const deleteIcon = async (iconId) => {
    //     if (!confirm('Are you sure you want to delete this icon?')) return;

    //     try {
    //         const response = await fetch(`/api/bottom-nav-icons/${iconId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (!response.ok) throw new Error('Failed to delete icon');

    //         const data = await response.json();
    //         if (data.success) {
    //             await fetchIcons();
    //             alert('Icon deleted successfully!');
    //         }
    //     } catch (err) {
    //         alert('Error deleting icon: ' + err.message);
    //     }
    // };


    const deleteIcon = async (iconId) => {
        if (!confirm('Are you sure you want to delete this icon?')) return;

        try {
            const config = getAuthConfig(); // Contains headers (Authorization)
            const response = await axios.delete(`/api/bottom-nav-icons/${iconId}`, config);

            if (response.data.success) {
                await fetchIcons();
                alert('Icon deleted successfully!');
            }
        } catch (err) {
            alert('Error deleting icon: ' + (err.response?.data?.message || err.message));
        }
    };


    const IconCard = ({ icon }) => {
        const isEditing = editingIcon?.id === icon.id;

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{icon.name}</h3>
                        <p className="text-sm text-gray-500">ID: {icon.id}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setEditingIcon(isEditing ? null : icon)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title={isEditing ? 'Cancel edit' : 'Edit icon'}
                        >
                            {isEditing ? <X size={16} /> : <Edit size={16} />}
                        </button>
                        <button
                            onClick={() => deleteIcon(icon.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete icon"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected State</p>
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center h-20">
                            {icon.selectedIconUrl ? (
                                <img
                                    src={icon.selectedIconUrl}
                                    alt="Selected"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400 text-xs">No icon</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Type: {icon.selectedIconType}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Unselected State</p>
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center h-20">
                            {icon.unselectedIconUrl ? (
                                <img
                                    src={icon.unselectedIconUrl}
                                    alt="Unselected"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400 text-xs">No icon</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Type: {icon.unselectedIconType}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>Order: {icon.order}</span>
                    <div className="flex items-center space-x-2">
                        {icon.isEnabled ? (
                            <><Eye size={14} className="text-green-600" /> <span className="text-green-600">Enabled</span></>
                        ) : (
                            <><EyeOff size={14} className="text-red-600" /> <span className="text-red-600">Disabled</span></>
                        )}
                    </div>
                </div>

                {isEditing && <IconEditForm icon={icon} onSubmit={updateIcon} loading={uploadLoading} />}
            </div>
        );
    };

    const IconEditForm = ({ icon, onSubmit, loading }) => {
        const [formData, setFormData] = useState({
            name: icon.name,
            order: icon.order,
            isEnabled: icon.isEnabled,
            selectedIconType: icon.selectedIconType,
            unselectedIconType: icon.unselectedIconType,
            animationConfig: icon.animationConfig || {}
        });
        const [selectedFile, setSelectedFile] = useState(null);
        const [unselectedFile, setUnselectedFile] = useState(null);

        const handleSubmit = (e) => {
            e.preventDefault();

            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('order', formData.order);
            submitData.append('isEnabled', formData.isEnabled);
            submitData.append('selectedIconType', formData.selectedIconType);
            submitData.append('unselectedIconType', formData.unselectedIconType);
            submitData.append('animationConfig', JSON.stringify(formData.animationConfig));

            if (selectedFile) {
                submitData.append('selectedIcon', selectedFile);
            }
            if (unselectedFile) {
                submitData.append('unselectedIcon', unselectedFile);
            }

            onSubmit(icon.id, submitData);
        };

        return (
            <div className="border-t pt-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <input
                                type="number"
                                min="0"
                                max="99"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isEnabled}
                                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Enabled</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selected Icon</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <select
                                value={formData.selectedIconType}
                                onChange={(e) => setFormData({ ...formData, selectedIconType: e.target.value })}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="static">Static</option>
                                <option value="gif">GIF</option>
                                <option value="svg">SVG</option>
                                <option value="lottie">Lottie</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unselected Icon</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUnselectedFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <select
                                value={formData.unselectedIconType}
                                onChange={(e) => setFormData({ ...formData, unselectedIconType: e.target.value })}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="static">Static</option>
                                <option value="gif">GIF</option>
                                <option value="svg">SVG</option>
                                <option value="lottie">Lottie</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Animation Config</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Duration (ms)</label>
                                <input
                                    type="number"
                                    min="100"
                                    max="5000"
                                    value={formData.animationConfig.duration || 300}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        animationConfig: { ...formData.animationConfig, duration: parseInt(e.target.value) }
                                    })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Repeat Count</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.animationConfig.repeatCount || 1}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        animationConfig: { ...formData.animationConfig, repeatCount: parseInt(e.target.value) }
                                    })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="flex items-center text-xs">
                                    <input
                                        type="checkbox"
                                        checked={formData.animationConfig.autoPlay !== false}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            animationConfig: { ...formData.animationConfig, autoPlay: e.target.checked }
                                        })}
                                        className="mr-1 scale-75"
                                    />
                                    Auto Play
                                </label>
                                <label className="flex items-center text-xs">
                                    <input
                                        type="checkbox"
                                        checked={formData.animationConfig.playOnSelect !== false}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            animationConfig: { ...formData.animationConfig, playOnSelect: e.target.checked }
                                        })}
                                        className="mr-1 scale-75"
                                    />
                                    Play on Select
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3">
                        <button
                            type="button"
                            onClick={() => setEditingIcon(null)}
                            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {loading ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="animate-spin" />
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <div className="text-center">
    //                 <div className="text-red-600 mb-4">
    //                     <X size={48} className="mx-auto mb-2" />
    //                     <p className="text-lg font-semibold">Error loading dashboard</p>
    //                 </div>
    //                 <p className="text-gray-600 mb-4">{error}</p>
    //                 <button
    //                     onClick={fetchIcons}
    //                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    //                 >
    //                     Try Again
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Bottom Navigation Icons Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your app's bottom navigation icons and configuration</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Version: {version}</p>
                            <p className="text-sm text-gray-500">
                                Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Unknown'}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                        <button
                            onClick={fetchIcons}
                            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            <Plus size={16} className="mr-2" />
                            Add Icon
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Settings className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Icons</p>
                                <p className="text-2xl font-semibold text-gray-900">{icons.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Eye className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Enabled</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {icons.filter(icon => icon.isEnabled).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <EyeOff className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Disabled</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {icons.filter(icon => !icon.isEnabled).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Upload className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Current Version</p>
                                <p className="text-2xl font-semibold text-gray-900">{version}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icons Grid */}
                {icons.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No icons configured</h3>
                        <p className="text-gray-600 mb-6">Get started by adding your first bottom navigation icon.</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} className="mr-2" />
                            Add First Icon
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {icons
                            .sort((a, b) => a.order - b.order)
                            .map(icon => (
                                <IconCard key={icon.id} icon={icon} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomNavIconsDashboard;