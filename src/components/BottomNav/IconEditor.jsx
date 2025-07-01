import React, { useState, useEffect } from 'react';
import { X, Upload, Save, RefreshCw, Image, Settings, Zap } from 'lucide-react';

const IconEditor = ({ icon, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        order: 0,
        isEnabled: true
    });
    const [selectedIconFile, setSelectedIconFile] = useState(null);
    const [unselectedIconFile, setUnselectedIconFile] = useState(null);
    const [selectedIconPreview, setSelectedIconPreview] = useState('');
    const [unselectedIconPreview, setUnselectedIconPreview] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (icon) {
            setFormData({
                id: icon.id,
                name: icon.name,
                order: icon.order,
                isEnabled: icon.isEnabled
            });
            setSelectedIconPreview(icon.selectedIconUrl);
            setUnselectedIconPreview(icon.unselectedIconUrl);
        } else {
            // New icon defaults
            setFormData({
                id: `icon_${Date.now()}`,
                name: '',
                order: 0,
                isEnabled: true
            });
        }
    }, [icon]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (type, file) => {
        if (type === 'selected') {
            setSelectedIconFile(file);
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setSelectedIconPreview(e.target.result);
                reader.readAsDataURL(file);
            }
        } else {
            setUnselectedIconFile(file);
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setUnselectedIconPreview(e.target.result);
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Name is required');
            return;
        }

        if (!icon && (!selectedIconFile || !unselectedIconFile)) {
            alert('Both selected and unselected icons are required for new icons');
            return;
        }

        // Create FormData for file upload
        const submitData = new FormData();

        // Add form fields
        submitData.append('id', formData.id);
        submitData.append('name', formData.name);
        submitData.append('order', formData.order);
        submitData.append('isEnabled', formData.isEnabled);

        // Add files if selected
        if (selectedIconFile) {
            submitData.append('selectedIcon', selectedIconFile);
        }
        if (unselectedIconFile) {
            submitData.append('unselectedIcon', unselectedIconFile);
        }

        // Pass FormData to parent component for API call
        onSave(submitData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        {icon ? 'Edit Icon' : 'Add New Icon'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon ID
                            </label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => handleInputChange('id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., home_icon"
                                required
                                disabled={!!icon}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Home"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                max="99"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isEnabled"
                                checked={formData.isEnabled}
                                onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-900">
                                Enable this icon
                            </label>
                        </div>
                    </div>

                    {/* Icon Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Selected Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selected State Icon
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                {selectedIconPreview ? (
                                    <img
                                        src={selectedIconPreview}
                                        alt="Selected icon preview"
                                        className="mx-auto h-16 w-16 object-contain mb-2"
                                    />
                                ) : (
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                )}
                                <label className="cursor-pointer">
                                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                                        Choose file
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('selected', e.target.files[0])}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, SVG</p>
                            </div>
                        </div>

                        {/* Unselected Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unselected State Icon
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                {unselectedIconPreview ? (
                                    <img
                                        src={unselectedIconPreview}
                                        alt="Unselected icon preview"
                                        className="mx-auto h-16 w-16 object-contain mb-2"
                                    />
                                ) : (
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                )}
                                <label className="cursor-pointer">
                                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                                        Choose file
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('unselected', e.target.files[0])}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, SVG</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {saving ? 'Saving...' : 'Save Icon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IconEditor;