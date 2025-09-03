import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { calculateDimensions } from '../../pathUtils';

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
        if (!targetId || !targetId.trim()) {
            setStatus({
                type: 'error',
                message: 'Please enter a target ID'
            });
            return;
        }

        setIsSaving(true);
        setStatus(null);

        try {
            const configData = {
                targetId: targetId.trim(),
                targetType,
                version,
                image,
                buildings: buildings.map(building => ({
                    ...building,
                    dimensions: calculateDimensions(building.path)
                })),
                exportedAt: new Date().toISOString()
            };

            const response = await fetch(`${base_url}/api/export-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configData),
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
        <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Configuration Manager</h3>
                <div className="text-sm text-gray-500">
                    {buildings.length} building{buildings.length !== 1 ? 's' : ''} mapped
                </div>
            </div>

            {buildings.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium mb-2">Buildings Summary:</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {buildings.map(building => {
                            const dimensions = calculateDimensions(building.path);
                            return (
                                <div key={building.id} className="bg-gray-50 p-2 rounded text-sm">
                                    <div className="font-medium">{building.heading}</div>
                                    <div className="text-gray-600 text-xs">
                                        Area: {dimensions.area} m² • Dimensions: {dimensions.width}m × {dimensions.height}m
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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
                            value={targetId || ''}
                            onChange={(e) => setTargetId(e.target.value)}
                            placeholder="Enter target ID"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={handleSave}
                            disabled={isSaving || buildings.length === 0}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                isSaving || buildings.length === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
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
                    <div className={`p-4 rounded-lg ${
                        status.type === 'error'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfigManager;