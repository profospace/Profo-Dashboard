import React, { useState } from 'react';
import { X, Smartphone, Tablet } from 'lucide-react';

const PreviewModal = ({ icons, onClose }) => {
    const [selectedIcon, setSelectedIcon] = useState(icons[0]?.id || '');
    const [deviceType, setDeviceType] = useState('mobile');

    const getDeviceClass = () => {
        switch (deviceType) {
            case 'tablet':
                return 'w-96 h-[600px]';
            default:
                return 'w-80 h-[640px]';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Navigation Preview</h2>
                        <p className="text-sm text-gray-500">See how your navigation will look on devices</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Device Toggle */}
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setDeviceType('mobile')}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${deviceType === 'mobile'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Smartphone className="w-4 h-4 mr-2" />
                                Mobile
                            </button>
                            <button
                                onClick={() => setDeviceType('tablet')}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${deviceType === 'tablet'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Tablet className="w-4 h-4 mr-2" />
                                Tablet
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-center">
                        {/* Device Frame */}
                        <div className={`${getDeviceClass()} bg-gray-900 rounded-3xl p-2 shadow-2xl`}>
                            {/* Screen */}
                            <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                                {/* Status Bar */}
                                <div className="h-6 bg-gray-100 flex items-center justify-between px-4">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    </div>
                                    <div className="text-xs font-medium text-gray-600">9:41</div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-2 border border-gray-400 rounded-sm">
                                            <div className="w-3 h-1 bg-gray-400 rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* App Content */}
                                <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                                            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your App</h3>
                                        <p className="text-sm text-gray-600">Main content area</p>
                                    </div>
                                </div>

                                {/* Bottom Navigation */}
                                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                                    <div className="flex items-center justify-around">
                                        {icons.map((icon) => {
                                            const isSelected = selectedIcon === icon.id;
                                            return (
                                                <button
                                                    key={icon.id}
                                                    onClick={() => setSelectedIcon(icon.id)}
                                                    className="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                                                >
                                                    <div className="w-6 h-6 mb-1 flex items-center justify-center">
                                                        <img
                                                            src={`base_url${isSelected ? icon.selectedIconUrl : icon.unselectedIconUrl}`}
                                                            alt={icon.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden">
                                                            ?
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-500'
                                                        }`}>
                                                        {icon.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Icon Details */}
                    {selectedIcon && (
                        <div className="mt-8 max-w-md mx-auto">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Selected Icon Details</h3>
                                {(() => {
                                    const icon = icons.find(i => i.id === selectedIcon);
                                    return icon ? (
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Name:</span>
                                                <span className="font-medium">{icon.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">ID:</span>
                                                <span className="font-mono text-xs">{icon.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order:</span>
                                                <span className="font-medium">{icon.order}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Selected Type:</span>
                                                <span className="font-medium capitalize">{icon.selectedIconType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Unselected Type:</span>
                                                <span className="font-medium capitalize">{icon.unselectedIconType}</span>
                                            </div>
                                            {(icon.selectedIconType === 'gif' || icon.selectedIconType === 'lottie' ||
                                                icon.unselectedIconType === 'gif' || icon.unselectedIconType === 'lottie') && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Animation Duration:</span>
                                                            <span className="font-medium">{icon.animationConfig.duration}ms</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Repeat Count:</span>
                                                            <span className="font-medium">{icon.animationConfig.repeatCount}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;