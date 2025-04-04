// import React from 'react';

// const ColorPreview = ({ colors }) => {
//     if (!colors) return null;

//     const {
//         header,
//         button,
//         buttonBackground,
//         list_title_size,
//         listbackground,
//         search_filter,
//         markerColor,
//         constantData
//     } = colors;

//     return (
//         <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Color Preview</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Header Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">Header</h3>
//                     <div
//                         className="h-16 rounded-md shadow-sm"
//                         style={{
//                             background: `linear-gradient(to right, ${header.startColor}, ${header.endColor})`
//                         }}
//                     ></div>
//                 </div>

//                 {/* Button Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">Button</h3>
//                     <div className="flex space-x-4">
//                         <button
//                             className="px-4 py-2 rounded-md shadow-sm w-32 text-white text-center"
//                             style={{
//                                 background: `linear-gradient(to right, ${button.startColor}, ${button.endColor})`
//                             }}
//                         >
//                             Button
//                         </button>

//                         <div
//                             className="px-4 py-2 rounded-md shadow-sm w-32 text-white text-center"
//                             style={{
//                                 background: `linear-gradient(to right, ${buttonBackground.startColor}, ${buttonBackground.endColor})`
//                             }}
//                         >
//                             Background
//                         </div>
//                     </div>
//                 </div>

//                 {/* List Title Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">List Title</h3>
//                     <div
//                         className="p-2 rounded-md shadow-sm"
//                         style={{
//                             color: list_title_size.color,
//                             backgroundColor: list_title_size.backgroundColor
//                         }}
//                     >
//                         Example List Title
//                     </div>
//                 </div>

//                 {/* List Background Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">List Background</h3>
//                     <div
//                         className="h-16 rounded-md shadow-sm"
//                         style={{
//                             backgroundColor: listbackground.backgroundColor
//                         }}
//                     ></div>
//                 </div>

//                 {/* Search Filter Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">Search Filter</h3>
//                     <div
//                         className="h-10 rounded-md shadow-sm"
//                         style={{
//                             backgroundColor: search_filter.backgroundColor
//                         }}
//                     ></div>
//                 </div>

//                 {/* Marker Color Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">Marker Color</h3>
//                     <div className="flex items-center space-x-2">
//                         <div
//                             className="h-8 w-8 rounded-full shadow-sm"
//                             style={{
//                                 backgroundColor: markerColor
//                             }}
//                         ></div>
//                         <span>Marker</span>
//                     </div>
//                 </div>

//                 {/* Detail Page Button Preview */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">Detail Page Button</h3>
//                     <button
//                         className="px-4 py-2 rounded-md shadow-sm w-32 text-white text-center"
//                         style={{
//                             background: `linear-gradient(to right, ${constantData.DetailPageButtonColor.startColor}, ${constantData.DetailPageButtonColor.endColor})`
//                         }}
//                     >
//                         Detail Button
//                     </button>
//                 </div>

//                 {/* Price & Call Button Colors */}
//                 <div className="space-y-2">
//                     <h3 className="text-md font-medium">Price & Call Button</h3>
//                     <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                             <div
//                                 className="p-1 rounded"
//                                 style={{ color: constantData.priceColor }}
//                             >
//                                 <span className="font-bold">₹10,000</span>
//                             </div>
//                             <span>Price</span>
//                         </div>

//                         <div className="flex items-center space-x-2">
//                             <button
//                                 className="px-3 py-1 rounded text-white"
//                                 style={{ backgroundColor: constantData.callButtonColor }}
//                             >
//                                 Call
//                             </button>
//                             <span>Call Button</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ColorPreview;

import React, { useState, useEffect } from 'react';

const ColorPreview = ({ colors }) => {
    const [previewMode, setPreviewMode] = useState('light'); // 'light' or 'dark'
    const [deviceView, setDeviceView] = useState('mobile'); // 'mobile' or 'desktop'
    const [initialColors, setInitialColors] = useState(null);

    useEffect(() => {
        if (colors && !initialColors) {
            setInitialColors(colors);
        }
    }, [colors, initialColors]);

    if (!colors) {
        return (
            <div className="p-6 rounded-lg bg-white">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Color Preview</h2>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">Update colors to see a preview</p>
                </div>
            </div>
        );
    }

    const {
        header,
        button,
        buttonBackground,
        list_title_size,
        listbackground,
        search_filter,
        markerColor,
        constantData
    } = colors;

    const backgroundColor = previewMode === 'light' ? 'white' : '#121212';
    const textColor = previewMode === 'light' ? 'text-gray-800' : 'text-gray-200';

    return (
        <div className={`p-6 rounded-lg ${previewMode === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>Color Preview</h2>

                <div className="flex space-x-3">
                    {/* Light/Dark Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${previewMode === 'light' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'}`}
                            onClick={() => setPreviewMode('light')}
                        >
                            Light
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${previewMode === 'dark' ? 'bg-gray-800 shadow-sm text-white' : 'text-gray-600'}`}
                            onClick={() => setPreviewMode('dark')}
                        >
                            Dark
                        </button>
                    </div>

                    {/* Device Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${deviceView === 'mobile' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'}`}
                            onClick={() => setDeviceView('mobile')}
                        >
                            Mobile
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${deviceView === 'desktop' ? 'bg-gray-800 shadow-sm text-white' : 'text-gray-600'}`}
                            onClick={() => setDeviceView('desktop')}
                        >
                            Desktop
                        </button>
                    </div>
                </div>
            </div>

            {/* Device Frame */}
            <div className="flex justify-center mb-6">
                <div
                    className={`border-4 border-gray-800 rounded-lg ${deviceView === 'mobile' ? 'w-64' : 'w-full max-w-md'} overflow-hidden shadow-lg`}
                    style={{
                        height: deviceView === 'mobile' ? '440px' : '320px'
                    }}
                >
                    {/* App Preview */}
                    <div className={`h-full flex flex-col`} style={{ backgroundColor }}>
                        {/* Header */}
                        <div
                            className="relative px-4 py-6 flex items-center"
                            style={{
                                background: `linear-gradient(to right, ${header.startColor}, ${header.endColor})`,
                                height: '120px'
                            }}
                        >
                            <div className="absolute inset-0" style={{
                                backgroundImage: constantData.headerBackgroundImage ? `url(${constantData.headerBackgroundImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.3
                            }}></div>
                            <div className="relative z-10">
                                <div className="h-8 w-8 bg-white rounded-full mb-2 shadow-md"></div>
                                <div className="h-2 w-24 bg-white rounded-full shadow-md opacity-80"></div>
                            </div>

                            {/* Search Bar */}
                            <div
                                className="absolute bottom-0 left-0 right-0 mx-4 transform translate-y-1/2 rounded-lg shadow-lg flex items-center px-4 py-2"
                                style={{ backgroundColor: search_filter.backgroundColor }}
                            >
                                <div className="h-4 w-full bg-white bg-opacity-20 rounded"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-8 px-4 overflow-y-auto">
                            {/* List Items */}
                            <div className="space-y-4 mt-2">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-lg overflow-hidden shadow-sm"
                                        style={{ backgroundColor: listbackground.backgroundColor }}
                                    >
                                        <div className="relative h-24 bg-gray-200">
                                            {/* Marker */}
                                            {item === 1 && (
                                                <div
                                                    className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium"
                                                    style={{ backgroundColor: markerColor, color: '#000' }}
                                                >
                                                    Featured
                                                </div>
                                            )}

                                            {constantData.shadowOnImage && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <div
                                                className="mb-1 text-sm font-medium"
                                                style={{ color: list_title_size.color }}
                                            >
                                                Item Title {item}
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div style={{ color: constantData.priceColor, fontSize: `${colors.list_price_size}px` }}>
                                                    $199.99
                                                </div>
                                                <button
                                                    className="text-xs px-3 py-1 rounded-md text-white"
                                                    style={{
                                                        background: `linear-gradient(to right, ${button.startColor}, ${button.endColor})`
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div
                            className="py-2 px-4 border-t flex justify-between items-center"
                            style={{
                                borderColor: previewMode === 'light' ? '#e5e7eb' : '#2d3748',
                                backgroundColor: backgroundColor
                            }}
                        >
                            <button
                                className="text-xs px-4 py-2 rounded-md font-medium"
                                style={{
                                    background: `linear-gradient(to right, ${constantData.DetailPageButtonColor.startColor}, ${constantData.DetailPageButtonColor.endColor})`,
                                    color: '#fff'
                                }}
                            >
                                Action
                            </button>

                            <button
                                className="text-xs px-4 py-2 rounded-md text-white"
                                style={{
                                    backgroundColor: constantData.callButtonColor
                                }}
                            >
                                Call
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Color Pallette Summary */}
            <div className={`mt-4 p-4 rounded-lg ${previewMode === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                <h3 className={`text-sm font-medium mb-3 ${textColor}`}>Color Palette</h3>
                <div className="flex flex-wrap gap-2">
                    {[
                        header.startColor, header.endColor,
                        button.startColor, button.endColor,
                        markerColor,
                        constantData.priceColor,
                        constantData.callButtonColor,
                        list_title_size.backgroundColor
                    ].map((color, index) => (
                        <div key={index} className="relative group">
                            <div
                                className="h-8 w-8 rounded-full border shadow-sm cursor-pointer"
                                style={{
                                    backgroundColor: color,
                                    borderColor: previewMode === 'light' ? '#e5e7eb' : '#4b5563'
                                }}
                            ></div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {color}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Before/After Toggle (if initialColors exists) */}
            {initialColors && (
                <div className="mt-4 flex justify-center">
                    <button
                        className="text-xs px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                        onClick={() => setInitialColors(null)}
                    >
                        Reset Preview
                    </button>
                </div>
            )}
        </div>
    );
};

export default ColorPreview;