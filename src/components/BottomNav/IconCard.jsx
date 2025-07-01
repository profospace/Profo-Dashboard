// import React, { useState } from 'react';
// import { Edit, Trash2, Eye, EyeOff, GripVertical, Play, Pause } from 'lucide-react';

// // const IconCard = ({ icon, index, onEdit, onDelete, onToggleEnabled, onReorder }) => {

// //     console.log("icon card" , icon)
// //     const [isSelected, setIsSelected] = useState(false);
// //     const [draggedOver, setDraggedOver] = useState(false);

// //     const handleDragStart = (e) => {
// //         e.dataTransfer.setData('text/plain', index);
// //         e.dataTransfer.effectAllowed = 'move';
// //     };

// //     const handleDragOver = (e) => {
// //         e.preventDefault();
// //         e.dataTransfer.dropEffect = 'move';
// //         setDraggedOver(true);
// //     };

// //     const handleDragLeave = () => {
// //         setDraggedOver(false);
// //     };

// //     const handleDrop = (e) => {
// //         e.preventDefault();
// //         setDraggedOver(false);
// //         const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
// //         if (dragIndex !== index) {
// //             onReorder(dragIndex, index);
// //         }
// //     };

// //     const getIconTypeColor = (type) => {
// //         switch (type) {
// //             case 'gif': return 'bg-purple-100 text-purple-800';
// //             case 'svg': return 'bg-green-100 text-green-800';
// //             case 'lottie': return 'bg-orange-100 text-orange-800';
// //             default: return 'bg-blue-100 text-blue-800';
// //         }
// //     };

// //     const getIconTypeLabel = (type) => {
// //         switch (type) {
// //             case 'gif': return 'GIF';
// //             case 'svg': return 'SVG';
// //             case 'lottie': return 'Lottie';
// //             default: return 'Static';
// //         }
// //     };

// //     return (
// //         <div
// //             draggable
// //             onDragStart={handleDragStart}
// //             onDragOver={handleDragOver}
// //             onDragLeave={handleDragLeave}
// //             onDrop={handleDrop}
// //             className={`bg-white rounded-xl border-2 transition-all duration-200 cursor-move ${draggedOver
// //                     ? 'border-blue-400 shadow-lg scale-105'
// //                     : icon.isEnabled
// //                         ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
// //                         : 'border-gray-100 opacity-60'
// //                 }`}
// //         >
// //             {/* Drag Handle */}
// //             <div className="flex items-center justify-center p-2 border-b border-gray-100">
// //                 <GripVertical className="w-4 h-4 text-gray-400" />
// //                 <span className="ml-2 text-xs font-medium text-gray-500">Order: {icon.order}</span>
// //             </div>

// //             <div className="p-4">
// //                 {/* Icon Preview */}
// //                 <div className="flex items-center justify-center mb-4">
// //                     <div
// //                         className="relative w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
// //                         onClick={() => setIsSelected(!isSelected)}
// //                     >
// //                         {isSelected ? (
// //                             <img
// //                                 src={icon}
// //                                 alt={`${icon.name} selected`}
// //                                 className="w-12 h-12 object-contain"
// //                                 onError={(e) => {
// //                                     e.target.style.display = 'none';
// //                                     e.target.nextSibling.style.display = 'flex';
// //                                 }}
// //                             />
// //                         ) : (
// //                             <img
// //                                 src={icon}
// //                                 alt={`${icon.name} unselected`}
// //                                 className="w-12 h-12 object-contain"
// //                                 onError={(e) => {
// //                                     e.target.style.display = 'none';
// //                                     e.target.nextSibling.style.display = 'flex';
// //                                 }}
// //                             />
// //                         )}
// //                         <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden">
// //                             No Image
// //                         </div>

// //                         {/* State Indicator */}
// //                         <div className="absolute -top-1 -right-1">
// //                             <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-green-500' : 'bg-gray-300'}`} />
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Icon Info */}
// //                 <div className="text-center mb-4">
// //                     <h3 className="font-semibold text-gray-900 mb-1">{icon.name}</h3>
// //                     <p className="text-xs text-gray-500 mb-2">ID: {icon.id}</p>

// //                     {/* Icon Types */}
// //                     <div className="flex justify-center space-x-1 mb-2">
// //                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIconTypeColor(icon.selectedIconType)}`}>
// //                             {getIconTypeLabel(icon.selectedIconType)}
// //                         </span>
// //                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIconTypeColor(icon.unselectedIconType)}`}>
// //                             {getIconTypeLabel(icon.unselectedIconType)}
// //                         </span>
// //                     </div>

// //                     {/* Animation Info */}
// //                     {(icon.selectedIconType === 'gif' || icon.selectedIconType === 'lottie' ||
// //                         icon.unselectedIconType === 'gif' || icon.unselectedIconType === 'lottie') && (
// //                             <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
// //                                 <Play className="w-3 h-3" />
// //                                 <span>{icon.animationConfig.duration}ms</span>
// //                                 <span>×{icon.animationConfig.repeatCount}</span>
// //                             </div>
// //                         )}
// //                 </div>

// //                 {/* Status Badge */}
// //                 <div className="flex justify-center mb-4">
// //                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${icon.isEnabled
// //                             ? 'bg-green-100 text-green-800'
// //                             : 'bg-red-100 text-red-800'
// //                         }`}>
// //                         {icon.isEnabled ? (
// //                             <>
// //                                 <Eye className="w-3 h-3 mr-1" />
// //                                 Enabled
// //                             </>
// //                         ) : (
// //                             <>
// //                                 <EyeOff className="w-3 h-3 mr-1" />
// //                                 Disabled
// //                             </>
// //                         )}
// //                     </span>
// //                 </div>

// //                 {/* Action Buttons */}
// //                 <div className="flex space-x-2">
// //                     <button
// //                         onClick={onEdit}
// //                         className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
// //                     >
// //                         <Edit className="w-4 h-4 mr-1" />
// //                         Edit
// //                     </button>

// //                     <button
// //                         onClick={onToggleEnabled}
// //                         className={`flex-1 inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${icon.isEnabled
// //                                 ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
// //                                 : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
// //                             }`}
// //                     >
// //                         {icon.isEnabled ? (
// //                             <>
// //                                 <EyeOff className="w-4 h-4 mr-1" />
// //                                 Hide
// //                             </>
// //                         ) : (
// //                             <>
// //                                 <Eye className="w-4 h-4 mr-1" />
// //                                 Show
// //                             </>
// //                         )}
// //                     </button>

// //                     <button
// //                         onClick={onDelete}
// //                         className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
// //                     >
// //                         <Trash2 className="w-4 h-4" />
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };


// // const IconCard = ({ icon, onEdit, onDelete, onToggleEnabled, disabled }) => {
// //     return (
// //         <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${icon.isEnabled ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' : 'border-gray-100 opacity-60'
// //             }`}>
// //             <div className="p-4">
// //                 {/* Order */}
// //                 <div className="flex items-center justify-between mb-4">
// //                     <div className="flex items-center">
// //                         <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
// //                         <span className="text-xs font-medium text-gray-500">Order: {icon.order}</span>
// //                     </div>
// //                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${icon.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
// //                         }`}>
// //                         {icon.isEnabled ? 'Enabled' : 'Disabled'}
// //                     </span>
// //                 </div>

// //                 {/* Icon Preview */}
// //                 <div className="flex items-center justify-center mb-4">
// //                     <div className="grid grid-cols-2 gap-2">
// //                         <div className="text-center">
// //                             <img
// //                                 src={icon.selectedIconUrl}
// //                                 alt={`${icon.name} selected`}
// //                                 className="w-12 h-12 object-contain mx-auto mb-1"
// //                                 onError={(e) => {
// //                                     e.target.style.display = 'none';
// //                                     e.target.nextSibling.style.display = 'flex';
// //                                 }}
// //                             />
// //                             <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden mx-auto mb-1">
// //                                 Error
// //                             </div>
// //                             <span className="text-xs text-gray-500">Selected</span>
// //                         </div>
// //                         <div className="text-center">
// //                             <img
// //                                 src={icon.unselectedIconUrl}
// //                                 alt={`${icon.name} unselected`}
// //                                 className="w-12 h-12 object-contain mx-auto mb-1"
// //                                 onError={(e) => {
// //                                     e.target.style.display = 'none';
// //                                     e.target.nextSibling.style.display = 'flex';
// //                                 }}
// //                             />
// //                             <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden mx-auto mb-1">
// //                                 Error
// //                             </div>
// //                             <span className="text-xs text-gray-500">Unselected</span>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Icon Info */}
// //                 <div className="text-center mb-4">
// //                     <h3 className="font-semibold text-gray-900 mb-1">{icon.name}</h3>
// //                     <p className="text-xs text-gray-500">ID: {icon.id}</p>
// //                 </div>

// //                 {/* Action Buttons */}
// //                 <div className="flex space-x-2">
// //                     <button
// //                         onClick={onEdit}
// //                         disabled={disabled}
// //                         className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //                     >
// //                         <Edit className="w-4 h-4 mr-1" />
// //                         Edit
// //                     </button>

// //                     <button
// //                         onClick={onToggleEnabled}
// //                         disabled={disabled}
// //                         className={`flex-1 inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${icon.isEnabled
// //                                 ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
// //                                 : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
// //                             }`}
// //                     >
// //                         {icon.isEnabled ? (
// //                             <>
// //                                 <EyeOff className="w-4 h-4 mr-1" />
// //                                 Hide
// //                             </>
// //                         ) : (
// //                             <>
// //                                 <Eye className="w-4 h-4 mr-1" />
// //                                 Show
// //                             </>
// //                         )}
// //                     </button>

// //                     <button
// //                         onClick={onDelete}
// //                         disabled={disabled}
// //                         className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //                     >
// //                         <Trash2 className="w-4 h-4" />
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// // export default IconCard;


// // Icon Card Component
// const IconCard = ({ icon, onEdit, onDelete, onToggleEnabled, disabled }) => {
//     return (
//         <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${icon.isEnabled ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' : 'border-gray-100 opacity-60'
//             }`}>
//             <div className="p-4">
//                 {/* Order */}
//                 <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center">
//                         <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-xs font-medium text-gray-500">Order: {icon.order}</span>
//                     </div>
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${icon.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                         {icon.isEnabled ? 'Enabled' : 'Disabled'}
//                     </span>
//                 </div>

//                 {/* Icon Preview */}
//                 <div className="flex items-center justify-center mb-4">
//                     <div className="grid grid-cols-2 gap-2">
//                         <div className="text-center">
//                             <img
//                                 src={icon.selectedIconUrl}
//                                 alt={`${icon.name} selected`}
//                                 className="w-12 h-12 object-contain mx-auto mb-1"
//                                 onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.nextSibling.style.display = 'flex';
//                                 }}
//                             />
//                             <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden mx-auto mb-1">
//                                 Error
//                             </div>
//                             <span className="text-xs text-gray-500">Selected</span>
//                         </div>
//                         <div className="text-center">
//                             <img
//                                 src={icon.unselectedIconUrl}
//                                 alt={`${icon.name} unselected`}
//                                 className="w-12 h-12 object-contain mx-auto mb-1"
//                                 onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.nextSibling.style.display = 'flex';
//                                 }}
//                             />
//                             <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden mx-auto mb-1">
//                                 Error
//                             </div>
//                             <span className="text-xs text-gray-500">Unselected</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Icon Info */}
//                 <div className="text-center mb-4">
//                     <h3 className="font-semibold text-gray-900 mb-1">{icon.name}</h3>
//                     <p className="text-xs text-gray-500">ID: {icon.id}</p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-2">
//                     <button
//                         onClick={onEdit}
//                         disabled={disabled}
//                         className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                         <Edit className="w-4 h-4 mr-1" />
//                         Edit
//                     </button>

//                     <button
//                         onClick={onToggleEnabled}
//                         disabled={disabled}
//                         className={`flex-1 inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${icon.isEnabled
//                                 ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
//                                 : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
//                             }`}
//                     >
//                         {icon.isEnabled ? (
//                             <>
//                                 <EyeOff className="w-4 h-4 mr-1" />
//                                 Hide
//                             </>
//                         ) : (
//                             <>
//                                 <Eye className="w-4 h-4 mr-1" />
//                                 Show
//                             </>
//                         )}
//                     </button>

//                     <button
//                         onClick={onDelete}
//                         disabled={disabled}
//                         className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                         <Trash2 className="w-4 h-4" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default IconCard

import React from 'react';
import { Edit, Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';

// Icon Card Component
const IconCard = ({ icon, onEdit, onDelete, onToggleEnabled, disabled }) => {
    return (
        <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${icon.isEnabled
                ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                : 'border-gray-100 opacity-60'
            }`}>
            <div className="p-4">
                {/* Order */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs font-medium text-gray-500">Order: {icon.order}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${icon.isEnabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {icon.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>

                {/* Icon Preview */}
                <div className="flex items-center justify-center mb-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                            <img
                                src={icon.selectedIconUrl}
                                alt={`${icon.name} selected`}
                                className="w-12 h-12 object-contain mx-auto mb-1"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden mx-auto mb-1">
                                Error
                            </div>
                            <span className="text-xs text-gray-500">Selected</span>
                        </div>
                        <div className="text-center">
                            <img
                                src={icon.unselectedIconUrl}
                                alt={`${icon.name} unselected`}
                                className="w-12 h-12 object-contain mx-auto mb-1"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs hidden mx-auto mb-1">
                                Error
                            </div>
                            <span className="text-xs text-gray-500">Unselected</span>
                        </div>
                    </div>
                </div>

                {/* Icon Info */}
                <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{icon.name}</h3>
                    <p className="text-xs text-gray-500">ID: {icon.id}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        disabled={disabled}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                    </button>

                    <button
                        onClick={onToggleEnabled}
                        disabled={disabled}
                        className={`flex-1 inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${icon.isEnabled
                                ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
                                : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
                            }`}
                    >
                        {icon.isEnabled ? (
                            <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Hide
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4 mr-1" />
                                Show
                            </>
                        )}
                    </button>

                    <button
                        onClick={onDelete}
                        disabled={disabled}
                        className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IconCard;