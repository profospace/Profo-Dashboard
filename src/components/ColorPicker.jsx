import React, { useState } from 'react';

const ColorPicker = ({ backgroundColor, setBackgroundColor }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(backgroundColor);
        setIsTooltipVisible(true);
        setTimeout(() => setIsTooltipVisible(false), 2000);
    };

    return (
        <div className="mx-auto">
            <div
                className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100"
                style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            >
                <div className="p-6 flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-gray-800">Background Color</h2>
                        <div className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-500 font-mono">
                            Color
                        </div>
                    </div>

                    {/* Preview area */}
                    <div
                        className="h-32 rounded-lg transition-all duration-300 flex items-center justify-center"
                        style={{ backgroundColor }}
                    >
                        <span className="text-lg font-medium" style={{ color: isLightColor(backgroundColor) ? '#333' : '#fff' }}>
                            Preview
                        </span>
                    </div>

                    {/* Controls section */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor }}></div>
                            </div>
                            <input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter color hex code"
                            />
                        </div>

                        <div className="relative flex items-center">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="ml-2 text-gray-500">Select</span>
                        </div>

                        <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                            {isTooltipVisible && (
                                <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    Copied!
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Current value: <span className="font-mono">{backgroundColor}</span>
                    </div>
                    <button
                        onClick={() => setBackgroundColor('#F3F4F6')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper function to determine if a color is light or dark
const isLightColor = (color) => {
    // Convert hex to RGB
    let hex = color.replace('#', '');

    // Handle shorthand hex
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate perceived brightness using the formula
    // (299*R + 587*G + 114*B) / 1000
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128;
};

export default ColorPicker;