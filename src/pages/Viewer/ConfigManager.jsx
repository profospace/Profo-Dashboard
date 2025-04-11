import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { base_url, project_upload_url } from '../../../utils/base_url';

const ConfigManager = ({
    id,
    targetType = 'property',
    version = '1.0',
    image,
    buildings,
    onSaveSuccess
}) => {
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState(null);
    const [targetId, setTargetId] = useState(id);

    const handleSave = async () => {
        if (!targetId.trim()) {
            setStatus({
                type: 'error',
                message: 'Please enter a target ID'
            });
            return;
        }

        setIsSaving(true);
        setStatus(null);

        try {
            const response = await fetch(`${base_url}/api/export-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetId: targetId.trim(),
                    targetType,
                    version,
                    image,
                    buildings,
                    exportedAt: new Date().toISOString()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save configuration');
            }

            setStatus({
                type: 'success',
                message: 'Configuration saved successfully'
            });

            if (onSaveSuccess) {
                onSaveSuccess(data);
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to save configuration'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label
                    htmlFor="targetId"
                    className="block text-sm font-medium text-gray-700"
                >
                    Target ID
                </label>
                <div className="flex items-center gap-4">
                    <input
                        id="targetId"
                        type="text"
                        value={targetId || id}
                        onChange={(e) => setTargetId(e.target.value)}
                        placeholder="Enter target ID"
                        className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isSaving
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            {status && (
                <div className={`p-4 rounded-lg ${status.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default ConfigManager;