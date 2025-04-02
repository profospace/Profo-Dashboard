import React from 'react';

const ColorSection = ({
    title,
    section,
    startColor,
    endColor,
    startLabel = "Start Color",
    endLabel = "End Color",
    onStartColorChange,
    onEndColorChange
}) => {
    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>

            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <label className="block text-gray-700 min-w-[100px]">{startLabel}</label>
                    <div className="flex items-center space-x-2 flex-1">
                        <input
                            type="color"
                            value={startColor}
                            onChange={(e) => onStartColorChange(e.target.value)}
                            className="h-10 w-16 p-1 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            value={startColor}
                            onChange={(e) => onStartColorChange(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <label className="block text-gray-700 min-w-[100px]">{endLabel}</label>
                    <div className="flex items-center space-x-2 flex-1">
                        <input
                            type="color"
                            value={endColor}
                            onChange={(e) => onEndColorChange(e.target.value)}
                            className="h-10 w-16 p-1 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            value={endColor}
                            onChange={(e) => onEndColorChange(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                {/* Preview of the gradient */}
                <div className="mt-3">
                    <label className="block text-gray-700 mb-2 text-sm">Preview:</label>
                    <div
                        className="h-8 w-full rounded"
                        style={{
                            background: `linear-gradient(to right, ${startColor}, ${endColor})`,
                            border: '1px solid #e2e8f0'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorSection;