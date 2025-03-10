// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home } from 'lucide-react';
// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const popupRef = useRef(null);
// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, []);
// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }
// //     return (
// //         <div className="w-full">
// //             {/* Project Overview Section */}
// //             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
// //                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">Project Overview</h2>
// //                 <p className="text-gray-600">
// //                     Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                 </p>
// //                 <div className="mt-2 text-sm text-gray-500">
// //                     Total Buildings: {config.metadata.buildingCount}
// //                 </div>
// //             </div>
// //             {/* Main Viewer */}
// //             <div className="relative border rounded-lg overflow-hidden min-h-[500px] bg-gray-50">
// //                 <img
// //                     src={config.image.src}
// //                     alt="Property Map"
// //                     className="w-full h-full object-contain"
// //                 />

// //                 {/* Building Markers */}
// //                 {config.buildings?.map((building) => (
// //                     <div
// //                         key={building.id}
// //                         className={`absolute w-8 h-8 rounded-full flex items-center justify-center transform transition-all duration-300
// //               ${hoveredBuilding?.id === building.id
// //                                 ? 'bg-blue-500 ring-4 ring-blue-200 scale-110 z-50'
// //                                 : 'bg-black/40 hover:bg-blue-500 hover:ring-4 hover:ring-blue-200 hover:scale-110'}
// //               text-white text-sm backdrop-blur-sm cursor-pointer`}
// //                         style={{
// //                             top: `${building.position.y}%`,
// //                             left: `${building.position.x}%`,
// //                             transform: 'translate(-50%, -50%)',
// //                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
// //                         }}
// //                         onMouseEnter={() => setHoveredBuilding(building)}
// //                         onMouseLeave={() => setHoveredBuilding(null)}
// //                     >
// //                         <span className="relative group">
// //                             {building.name.charAt(0)}
// //                             <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black/75 text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
// //                                 {building.name}
// //                             </span>
// //                         </span>
// //                     </div>
// //                 ))}
// //                 {/* Building Information Popup */}
// //                 {hoveredBuilding && (
// //                     <div
// //                         ref={popupRef}
// //                         className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg"
// //                     >
// //                         <div className="p-4">
// //                             <div className="mb-4">
// //                                 <h3 className="text-lg font-semibold text-blue-900 mb-2">
// //                                     {hoveredBuilding.name}
// //                                 </h3>
// //                                 <p className="text-sm text-gray-600">
// //                                     {hoveredBuilding.description}
// //                                 </p>
// //                             </div>
// //                             <div className="flex flex-wrap gap-2 mb-4">
// //                                 {hoveredBuilding.developmentStatus && (
// //                                     <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
// //                                         {hoveredBuilding.developmentStatus}
// //                                     </span>
// //                                 )}
// //                                 {hoveredBuilding.totalFloors && (
// //                                     <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
// //                                         {hoveredBuilding.totalFloors} Floors
// //                                     </span>
// //                                 )}
// //                             </div>
// //                             {/* Amenities Section */}
// //                             {hoveredBuilding.amenities && hoveredBuilding.amenities.length > 0 && (
// //                                 <div className="mb-4">
// //                                     <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
// //                                     <div className="flex flex-wrap gap-2">
// //                                         {hoveredBuilding.amenities.map((amenity, index) => (
// //                                             <span
// //                                                 key={index}
// //                                                 className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
// //                                             >
// //                                                 {amenity}
// //                                             </span>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {/* Floor Information */}
// //                             {hoveredBuilding.flatsDetails && hoveredBuilding.flatsDetails.length > 0 && (
// //                                 <div className="mt-4">
// //                                     <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
// //                                         <Building className="w-4 h-4" />
// //                                         Floor Information
// //                                     </h4>
// //                                     <div className="max-h-48 overflow-y-auto pr-2">
// //                                         {hoveredBuilding.flatsDetails.map((floor) => (
// //                                             <div
// //                                                 key={floor._id || floor.floorNumber}
// //                                                 className="flex gap-2 items-center mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
// //                                             >
// //                                                 <div className="flex-1">
// //                                                     <div className="text-sm font-medium">Floor {floor.floorNumber}</div>
// //                                                     <div className="text-xs text-gray-600 flex items-center gap-2">
// //                                                         <span>
// //                                                             <Home className="w-3 h-3 inline mr-1" />
// //                                                             Total: {floor.flatsOnFloor}
// //                                                         </span>
// //                                                         <span>|</span>
// //                                                         <span className="text-green-600">
// //                                                             Available: {floor.availableFlats}
// //                                                         </span>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {/* Contact Information */}
// //                             {hoveredBuilding.contactNumber && (
// //                                 <div className="mt-4 pt-4 border-t border-gray-100">
// //                                     <a
// //                                         href={`tel:${hoveredBuilding.contactNumber}`}
// //                                         className="block w-full py-2 px-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
// //                                     >
// //                                         Contact: {hoveredBuilding.contactNumber}
// //                                     </a>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };
// // export default BuildingViewer;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home } from 'lucide-react';
// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const popupRef = useRef(null);
// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, []);
// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }
// //     return (
// //         <div className="w-full">
// //             {/* Project Overview Section */}
// //             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
// //                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">Project Overview</h2>
// //                 <p className="text-gray-600">
// //                     Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                 </p>
// //                 <div className="mt-2 text-sm text-gray-500">
// //                     Total Buildings: {config.metadata.buildingCount}
// //                 </div>
// //             </div>
// //             {/* Main Viewer */}
// //             <div className="relative border rounded-lg overflow-hidden min-h-[500px] bg-gray-50">
// //                 <img
// //                     src={config.image.src}
// //                     alt="Property Map"
// //                     className="w-full h-full object-contain"
// //                 />

// //                 {/* Building Markers */}
// //                 {config.buildings?.map((building) => (
// //                     <div
// //                         key={building.id}
// //                         className="absolute group"
// //                         style={{
// //                             top: `${building.position.y}%`,
// //                             left: `${building.position.x}%`,
// //                             transform: 'translate(-50%, -50%)',
// //                         }}
// //                         onMouseEnter={() => setHoveredBuilding(building)}
// //                         onMouseLeave={() => setHoveredBuilding(null)}
// //                     >
// //                         {/* Main Building Marker */}
// //                         <div
// //                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
// //                 ${hoveredBuilding?.id === building.id
// //                                     ? 'bg-blue-500 ring-4 ring-blue-200 scale-125'
// //                                     : 'bg-black/40 group-hover:bg-blue-500 group-hover:ring-4 group-hover:ring-blue-200 group-hover:scale-125'}
// //                 text-white text-sm backdrop-blur-sm cursor-pointer`}
// //                             style={{
// //                                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
// //                             }}
// //                         >
// //                             {building.name.charAt(0)}
// //                         </div>
// //                         {/* Building Name Tooltip */}
// //                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
// //                           opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
// //                             <div className="px-2 py-1 text-xs bg-black/75 text-white rounded whitespace-nowrap">
// //                                 {building.name}
// //                             </div>
// //                         </div>
// //                         {/* Building Highlight Circle */}
// //                         <div className={`absolute inset-[-8px] rounded-full border-2 transition-all duration-300
// //               ${hoveredBuilding?.id === building.id
// //                                 ? 'border-blue-400 scale-125 opacity-100'
// //                                 : 'border-transparent scale-100 opacity-0 group-hover:border-blue-400 group-hover:scale-125 group-hover:opacity-100'}`}
// //                         />
// //                     </div>
// //                 ))}
// //                 {/* Building Information Popup */}
// //                 {hoveredBuilding && (
// //                     <div
// //                         ref={popupRef}
// //                         className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg"
// //                     >
// //                         <div className="p-4">
// //                             <div className="mb-4">
// //                                 <h3 className="text-lg font-semibold text-blue-900 mb-2">
// //                                     {hoveredBuilding.name}
// //                                 </h3>
// //                                 <p className="text-sm text-gray-600">
// //                                     {hoveredBuilding.description}
// //                                 </p>
// //                             </div>
// //                             <div className="flex flex-wrap gap-2 mb-4">
// //                                 {hoveredBuilding.developmentStatus && (
// //                                     <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
// //                                         {hoveredBuilding.developmentStatus}
// //                                     </span>
// //                                 )}
// //                                 {hoveredBuilding.totalFloors && (
// //                                     <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
// //                                         {hoveredBuilding.totalFloors} Floors
// //                                     </span>
// //                                 )}
// //                             </div>
// //                             {/* Amenities Section */}
// //                             {hoveredBuilding.amenities && hoveredBuilding.amenities.length > 0 && (
// //                                 <div className="mb-4">
// //                                     <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
// //                                     <div className="flex flex-wrap gap-2">
// //                                         {hoveredBuilding.amenities.map((amenity, index) => (
// //                                             <span
// //                                                 key={index}
// //                                                 className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
// //                                             >
// //                                                 {amenity}
// //                                             </span>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {/* Floor Information */}
// //                             {hoveredBuilding.flatsDetails && hoveredBuilding.flatsDetails.length > 0 && (
// //                                 <div className="mt-4">
// //                                     <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
// //                                         <Building className="w-4 h-4" />
// //                                         Floor Information
// //                                     </h4>
// //                                     <div className="max-h-48 overflow-y-auto pr-2">
// //                                         {hoveredBuilding.flatsDetails.map((floor) => (
// //                                             <div
// //                                                 key={floor._id || floor.floorNumber}
// //                                                 className="flex gap-2 items-center mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
// //                                             >
// //                                                 <div className="flex-1">
// //                                                     <div className="text-sm font-medium">Floor {floor.floorNumber}</div>
// //                                                     <div className="text-xs text-gray-600 flex items-center gap-2">
// //                                                         <span>
// //                                                             <Home className="w-3 h-3 inline mr-1" />
// //                                                             Total: {floor.flatsOnFloor}
// //                                                         </span>
// //                                                         <span>|</span>
// //                                                         <span className="text-green-600">
// //                                                             Available: {floor.availableFlats}
// //                                                         </span>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {/* Contact Information */}
// //                             {hoveredBuilding.contactNumber && (
// //                                 <div className="mt-4 pt-4 border-t border-gray-100">
// //                                     <a
// //                                         href={`tel:${hoveredBuilding.contactNumber}`}
// //                                         className="block w-full py-2 px-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
// //                                     >
// //                                         Contact: {hoveredBuilding.contactNumber}
// //                                     </a>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };
// // export default BuildingViewer;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home } from 'lucide-react';
// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const popupRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const imageRef = useRef(null);
// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, []);
// //     useEffect(() => {
// //         if (imageRef.current && canvasRef.current) {
// //             const canvas = canvasRef.current;
// //             canvas.width = imageRef.current.width;
// //             canvas.height = imageRef.current.height;
// //             drawHighlight();
// //         }
// //     }, [hoveredBuilding, config]);
// //     const drawHighlight = () => {
// //         if (!canvasRef.current || !config?.buildings) return;
// //         const ctx = canvasRef.current.getContext('2d');
// //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// //         config.buildings.forEach(building => {
// //             if (building.id === hoveredBuilding?.id) {
// //                 ctx.strokeStyle = '#3B82F6';
// //                 ctx.lineWidth = 3;
// //                 ctx.setLineDash([5, 5]);
// //                 if (building.selectionType === 'rect' && building.area) {
// //                     ctx.strokeRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                 } else if (building.selectionType === 'lasso' && building.path) {
// //                     ctx.beginPath();
// //                     building.path.forEach((point, index) => {
// //                         if (index === 0) {
// //                             ctx.moveTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         } else {
// //                             ctx.lineTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         }
// //                     });
// //                     ctx.closePath();
// //                     ctx.stroke();
// //                 }
// //                 ctx.setLineDash([]);
// //             }
// //         });
// //     };
// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }
// //     return (
// //         <div className="w-full">
// //             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
// //                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //                     Project Overview
// //                 </h2>
// //                 <p className="text-gray-600">
// //                     Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                 </p>
// //                 <div className="mt-2 text-sm text-gray-500">
// //                     Total Buildings: {config.metadata.buildingCount}
// //                 </div>
// //             </div>
// //             <div className="relative border rounded-lg overflow-hidden min-h-[500px] bg-gray-50">
// //                 <img
// //                     ref={imageRef}
// //                     src={config.image.src}
// //                     alt="Property Map"
// //                     className="w-full h-full object-contain"
// //                 />
// //                 <canvas
// //                     ref={canvasRef}
// //                     className="absolute top-0 left-0 w-full h-full pointer-events-none"
// //                 />
// //                 {config.buildings?.map((building) => (
// //                     <div
// //                         key={building.id}
// //                         className="absolute group"
// //                         style={{
// //                             top: `${building.position.y * 100}%`,
// //                             left: `${building.position.x * 100}%`,
// //                             transform: 'translate(-50%, -50%)',
// //                         }}
// //                         onMouseEnter={() => setHoveredBuilding(building)}
// //                         onMouseLeave={() => setHoveredBuilding(null)}
// //                     >
// //                         <div
// //                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
// //                                 ${hoveredBuilding?.id === building.id
// //                                     ? 'bg-blue-500 ring-4 ring-blue-200 scale-125'
// //                                     : 'bg-black/40 group-hover:bg-blue-500 group-hover:ring-4 group-hover:ring-blue-200 group-hover:scale-125'}
// //                                 text-white text-sm backdrop-blur-sm cursor-pointer`}
// //                         >
// //                             {building.name.charAt(0)}
// //                         </div>
// //                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
// //                                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
// //                             <div className="px-2 py-1 text-xs bg-black/75 text-white rounded whitespace-nowrap">
// //                                 {building.name}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 ))}
// //                 {hoveredBuilding && (
// //                     <div
// //                         ref={popupRef}
// //                         className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg"
// //                     >
// //                         <div className="p-4">
// //                             <div className="mb-4">
// //                                 <h3 className="text-lg font-semibold text-blue-900 mb-2">
// //                                     {hoveredBuilding.name}
// //                                 </h3>
// //                                 <p className="text-sm text-gray-600">
// //                                     {hoveredBuilding.description}
// //                                 </p>
// //                             </div>
// //                             <div className="flex flex-wrap gap-2 mb-4">
// //                                 {hoveredBuilding.developmentStatus && (
// //                                     <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
// //                                         {hoveredBuilding.developmentStatus}
// //                                     </span>
// //                                 )}
// //                                 {hoveredBuilding.totalFloors && (
// //                                     <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
// //                                         {hoveredBuilding.totalFloors} Floors
// //                                     </span>
// //                                 )}
// //                             </div>
// //                             {hoveredBuilding.amenities && hoveredBuilding.amenities.length > 0 && (
// //                                 <div className="mb-4">
// //                                     <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
// //                                     <div className="flex flex-wrap gap-2">
// //                                         {hoveredBuilding.amenities.map((amenity, index) => (
// //                                             <span
// //                                                 key={index}
// //                                                 className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
// //                                             >
// //                                                 {amenity}
// //                                             </span>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {hoveredBuilding.flatsDetails && hoveredBuilding.flatsDetails.length > 0 && (
// //                                 <div className="mt-4">
// //                                     <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
// //                                         <Building className="w-4 h-4" />
// //                                         Floor Information
// //                                     </h4>
// //                                     <div className="max-h-48 overflow-y-auto pr-2">
// //                                         {hoveredBuilding.flatsDetails.map((floor) => (
// //                                             <div
// //                                                 key={floor._id || floor.floorNumber}
// //                                                 className="flex gap-2 items-center mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
// //                                             >
// //                                                 <div className="flex-1">
// //                                                     <div className="text-sm font-medium">
// //                                                         Floor {floor.floorNumber}
// //                                                     </div>
// //                                                     <div className="text-xs text-gray-600 flex items-center gap-2">
// //                                                         <span>
// //                                                             <Home className="w-3 h-3 inline mr-1" />
// //                                                             Total: {floor.flatsOnFloor}
// //                                                         </span>
// //                                                         <span>|</span>
// //                                                         <span className="text-green-600">
// //                                                             Available: {floor.availableFlats}
// //                                                         </span>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {hoveredBuilding.contactNumber && (
// //                                 <div className="mt-4 pt-4 border-t border-gray-100">
// //                                     <a
// //                                         href={`tel:${hoveredBuilding.contactNumber}`}
// //                                         className="block w-full py-2 px-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
// //                                     >
// //                                         Contact: {hoveredBuilding.contactNumber}
// //                                     </a>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };
// // export default BuildingViewer;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home } from 'lucide-react';
// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const popupRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const imageRef = useRef(null);
// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, []);
// //     useEffect(() => {
// //         if (imageRef.current && canvasRef.current) {
// //             const canvas = canvasRef.current;
// //             canvas.width = imageRef.current.width;
// //             canvas.height = imageRef.current.height;
// //             drawHighlight();
// //         }
// //     }, [hoveredBuilding, config]);
// //     const drawHighlight = () => {
// //         if (!canvasRef.current || !config?.buildings) return;
// //         const ctx = canvasRef.current.getContext('2d');
// //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// //         config.buildings.forEach(building => {
// //             if (building.id === hoveredBuilding?.id) {
// //                 // First draw the fill
// //                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
// //                 ctx.strokeStyle = 'rgba(0,0,0,0)';
// //                 ctx.lineWidth = 3;
// //                 if (building.selectionType === 'rect' && building.area) {
// //                     // Fill the rectangle
// //                     ctx.fillRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );

// //                     // Draw the dashed stroke
// //                     // ctx.setLineDash([5, 5]);
// //                     ctx.strokeRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                 } else if (building.selectionType === 'lasso' && building.path) {
// //                     ctx.beginPath();
// //                     building.path.forEach((point, index) => {
// //                         if (index === 0) {
// //                             ctx.moveTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         } else {
// //                             ctx.lineTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         }
// //                     });
// //                     ctx.closePath();

// //                     // Fill the path
// //                     ctx.fill();

// //                     // Draw the dashed stroke
// //                     ctx.setLineDash([5, 5]);
// //                     ctx.stroke();
// //                 }
// //                 ctx.setLineDash([]);
// //             }
// //         });
// //     };
// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }
// //     return (
// //         <div className="w-full">
// //             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
// //                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //                     Project Overview
// //                 </h2>
// //                 <p className="text-gray-600">
// //                     Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                 </p>
// //                 <div className="mt-2 text-sm text-gray-500">
// //                     Total Buildings: {config.metadata.buildingCount}
// //                 </div>
// //             </div>
// //             <div className="relative border rounded-lg overflow-hidden">
// //                 <img
// //                     ref={imageRef}
// //                     src={config.image.src}
// //                     alt="Property Map"
// //                     className="w-full h-full object-contain"
// //                 />

// //                 <canvas
// //                     ref={canvasRef}
// //                     className="absolute top-0 left-0 w-full h-full pointer-events-none"
// //                 />
// //                 {config.buildings?.map((building) => (
// //                     <div
// //                         key={building.id}
// //                         className="absolute group"
// //                         style={{
// //                             top: `${building.position.y * 100}%`,
// //                             left: `${building.position.x * 100}%`,
// //                             transform: 'translate(-50%, -50%)',
// //                         }}
// //                         onMouseEnter={() => setHoveredBuilding(building)}
// //                         onMouseLeave={() => setHoveredBuilding(null)}
// //                     >
// //                         <div
// //                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
// //                                 ${hoveredBuilding?.id === building.id
// //                                     ? 'bg-blue-500 ring-4 ring-blue-200 scale-125'
// //                                     : 'bg-black/40 group-hover:bg-blue-500 group-hover:ring-4 group-hover:ring-blue-200 group-hover:scale-125'}
// //                                 text-white text-sm backdrop-blur-sm cursor-pointer`}
// //                         >
// //                             {building.name.charAt(0)}
// //                         </div>
// //                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
// //                                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
// //                             <div className="px-2 py-1 text-xs bg-black/75 text-white rounded whitespace-nowrap">
// //                                 {building.name}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 ))}
// //                 {hoveredBuilding && (
// //                     <div
// //                         ref={popupRef}
// //                         className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg"
// //                     >
// //                         <div className="p-4">
// //                             <div className="mb-4">
// //                                 <h3 className="text-lg font-semibold text-blue-900 mb-2">
// //                                     {hoveredBuilding.name}
// //                                 </h3>
// //                                 <p className="text-sm text-gray-600">
// //                                     {hoveredBuilding.description}
// //                                 </p>
// //                             </div>
// //                             <div className="flex flex-wrap gap-2 mb-4">
// //                                 {hoveredBuilding.developmentStatus && (
// //                                     <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
// //                                         {hoveredBuilding.developmentStatus}
// //                                     </span>
// //                                 )}
// //                                 {hoveredBuilding.totalFloors && (
// //                                     <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
// //                                         {hoveredBuilding.totalFloors} Floors
// //                                     </span>
// //                                 )}
// //                             </div>
// //                             {hoveredBuilding.amenities && hoveredBuilding.amenities.length > 0 && (
// //                                 <div className="mb-4">
// //                                     <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
// //                                     <div className="flex flex-wrap gap-2">
// //                                         {hoveredBuilding.amenities.map((amenity, index) => (
// //                                             <span
// //                                                 key={index}
// //                                                 className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
// //                                             >
// //                                                 {amenity}
// //                                             </span>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {hoveredBuilding.flatsDetails && hoveredBuilding.flatsDetails.length > 0 && (
// //                                 <div className="mt-4">
// //                                     <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
// //                                         <Building className="w-4 h-4" />
// //                                         Floor Information
// //                                     </h4>
// //                                     <div className="max-h-48 overflow-y-auto pr-2">
// //                                         {hoveredBuilding.flatsDetails.map((floor) => (
// //                                             <div
// //                                                 key={floor._id || floor.floorNumber}
// //                                                 className="flex gap-2 items-center mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
// //                                             >
// //                                                 <div className="flex-1">
// //                                                     <div className="text-sm font-medium">
// //                                                         Floor {floor.floorNumber}
// //                                                     </div>
// //                                                     <div className="text-xs text-gray-600 flex items-center gap-2">
// //                                                         <span>
// //                                                             <Home className="w-3 h-3 inline mr-1" />
// //                                                             Total: {floor.flatsOnFloor}
// //                                                         </span>
// //                                                         <span>|</span>
// //                                                         <span className="text-green-600">
// //                                                             Available: {floor.availableFlats}
// //                                                         </span>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                             {hoveredBuilding.contactNumber && (
// //                                 <div className="mt-4 pt-4 border-t border-gray-100">
// //                                     <a
// //                                         href={`tel:${hoveredBuilding.contactNumber}`}
// //                                         className="block w-full py-2 px-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
// //                                     >
// //                                         Contact: {hoveredBuilding.contactNumber}
// //                                     </a>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };
// // export default BuildingViewer;


// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home } from 'lucide-react';

// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const popupRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const imageRef = useRef(null);

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, []);

// //     useEffect(() => {
// //         if (imageRef.current && canvasRef.current) {
// //             const canvas = canvasRef.current;
// //             canvas.width = imageRef.current.width;
// //             canvas.height = imageRef.current.height;
// //             drawHighlight();
// //         }
// //     }, [hoveredBuilding, config]);

// //     const drawHighlight = () => {
// //         if (!canvasRef.current || !config?.buildings) return;
// //         const ctx = canvasRef.current.getContext('2d');
// //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// //         config.buildings.forEach(building => {
// //             if (building.id === hoveredBuilding?.id) {
// //                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
// //                 ctx.strokeStyle = 'rgba(0,0,0,0)';
// //                 ctx.lineWidth = 3;
// //                 if (building.selectionType === 'rect' && building.area) {
// //                     ctx.fillRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                     ctx.strokeRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                 } else if (building.selectionType === 'lasso' && building.path) {
// //                     ctx.beginPath();
// //                     building.path.forEach((point, index) => {
// //                         if (index === 0) {
// //                             ctx.moveTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         } else {
// //                             ctx.lineTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         }
// //                     });
// //                     ctx.closePath();
// //                     ctx.fill();
// //                     ctx.stroke();
// //                 }
// //             }
// //         });
// //     };

// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="w-full">
// //             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
// //                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //                     Project Overview
// //                 </h2>
// //                 <p className="text-gray-600">
// //                     Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                 </p>
// //                 <div className="mt-2 text-sm text-gray-500">
// //                     Total Buildings: {config.metadata.buildingCount}
// //                 </div>
// //             </div>
// //             <div className="relative border rounded-lg overflow-hidden">
// //                 <img
// //                     ref={imageRef}
// //                     src={config.image.src}
// //                     alt="Property Map"
// //                     className="w-full h-full object-contain"
// //                 />
// //                 <canvas
// //                     ref={canvasRef}
// //                     className="absolute top-0 left-0 w-full h-full pointer-events-none"
// //                 />
// //                 {config.buildings?.map((building) => (
// //                     <div
// //                         key={building.id}
// //                         className="absolute"
// //                         style={{
// //                             top: `${building.position.y * 100}%`,
// //                             left: `${building.position.x * 100}%`,
// //                         }}
// //                     >
// //                         <div
// //                             className="relative"
// //                             onMouseEnter={() => setHoveredBuilding(building)}
// //                             onMouseLeave={() => setHoveredBuilding(null)}
// //                         >
// //                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
// //                                 ${hoveredBuilding?.id === building.id
// //                                     ? 'bg-white ring-4 ring-blue-500'
// //                                     : 'bg-white ring-2 ring-gray-300 hover:ring-blue-500'}`}
// //                             >
// //                                 {building.name.charAt(0)}
// //                             </div>
// //                             {hoveredBuilding?.id === building.id && (
// //                                 <div className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-64 -translate-x-1/2 -translate-y-full -mt-2">
// //                                     <div className="text-lg font-bold mb-1">{building.name}</div>
// //                                     <div className="text-sm text-gray-600 mb-2">
// //                                         {building.developmentStatus && (
// //                                             <div>{building.developmentStatus} • {building.totalFloors} floors</div>
// //                                         )}
// //                                     </div>
// //                                     {building.price && (
// //                                         <div className="text-sm">
// //                                             from {building.price.toLocaleString()} ₽
// //                                         </div>
// //                                     )}
// //                                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
// //                                         <div className="w-3 h-3 bg-white rotate-45 transform"></div>
// //                                     </div>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };

// // export default BuildingViewer;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home } from 'lucide-react';

// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const popupRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const imageRef = useRef(null);

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, []);

// //     useEffect(() => {
// //         if (imageRef.current && canvasRef.current) {
// //             const canvas = canvasRef.current;
// //             canvas.width = imageRef.current.width;
// //             canvas.height = imageRef.current.height;
// //             drawHighlight();
// //         }
// //     }, [hoveredBuilding, config]);

// //     const drawHighlight = () => {
// //         if (!canvasRef.current || !config?.buildings) return;
// //         const ctx = canvasRef.current.getContext('2d');
// //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// //         config.buildings.forEach(building => {
// //             if (building.id === hoveredBuilding?.id) {
// //                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
// //                 ctx.strokeStyle = 'rgba(0,0,0,0)';
// //                 ctx.lineWidth = 3;
// //                 if (building.selectionType === 'rect' && building.area) {
// //                     ctx.fillRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                     ctx.strokeRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                 } else if (building.selectionType === 'lasso' && building.path) {
// //                     ctx.beginPath();
// //                     building.path.forEach((point, index) => {
// //                         if (index === 0) {
// //                             ctx.moveTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         } else {
// //                             ctx.lineTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         }
// //                     });
// //                     ctx.closePath();
// //                     ctx.fill();
// //                     ctx.stroke();
// //                 }
// //             }
// //         });
// //     };

// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="w-full">
// //             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
// //                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //                     Project Overview
// //                 </h2>
// //                 <p className="text-gray-600">
// //                     Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                 </p>
// //                 <div className="mt-2 text-sm text-gray-500">
// //                     Total Buildings: {config.metadata.buildingCount}
// //                 </div>
// //             </div>
// //             <div className="relative border rounded-lg overflow-hidden">
// //                 <img
// //                     ref={imageRef}
// //                     src={config.image.src}
// //                     alt="Property Map"
// //                     className="w-full h-full object-contain"
// //                 />
// //                 <canvas
// //                     ref={canvasRef}
// //                     className="absolute top-0 left-0 w-full h-full pointer-events-none"
// //                 />
// //                 {config.buildings?.map((building) => (
// //                     <div
// //                         key={building.id}
// //                         className="absolute"
// //                         style={{
// //                             top: `${building.position.y * 100}%`,
// //                             left: `${building.position.x * 100}%`,
// //                         }}
// //                     >
// //                         <div
// //                             className="relative"
// //                             onMouseEnter={() => setHoveredBuilding(building)}
// //                             onMouseLeave={() => setHoveredBuilding(null)}
// //                         >
// //                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
// //                                 ${hoveredBuilding?.id === building.id
// //                                     ? 'bg-white ring-4 ring-blue-500'
// //                                     : 'bg-white ring-2 ring-gray-300 hover:ring-blue-500'}`}
// //                             >
// //                                 {building.name.charAt(0)}
// //                             </div>
// //                             {hoveredBuilding?.id === building.id && (
// //                                 <div className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-64 -translate-x-1/2 mt-2">
// //                                     <div className="absolute top-0 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
// //                                         <div className="w-3 h-3 bg-white rotate-45 transform"></div>
// //                                     </div>
// //                                     <div className="text-lg font-bold mb-1">{building.name}</div>
// //                                     <div className="text-sm text-gray-600 mb-2">
// //                                         {building.developmentStatus && (
// //                                             <div>{building.developmentStatus} • {building.totalFloors} floors</div>
// //                                         )}
// //                                     </div>
// //                                     {building.price && (
// //                                         <div className="text-sm">
// //                                             from {building.price.toLocaleString()} ₽
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };

// // export default BuildingViewer;



// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home, Maximize2, Minimize2 } from 'lucide-react';
// // import { motion } from 'framer-motion';

// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const [isFullscreen, setIsFullscreen] = useState(false);
// //     const popupRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const imageRef = useRef(null);
// //     const containerRef = useRef(null);

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };

// //         const handleEscKey = (event) => {
// //             if (event.key === 'Escape' && isFullscreen) {
// //                 setIsFullscreen(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         document.addEventListener('keydown', handleEscKey);

// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //             document.removeEventListener('keydown', handleEscKey);
// //         };
// //     }, [isFullscreen]);

// //     useEffect(() => {
// //         if (imageRef.current && canvasRef.current) {
// //             const canvas = canvasRef.current;
// //             canvas.width = imageRef.current.width;
// //             canvas.height = imageRef.current.height;
// //             drawHighlight();
// //         }
// //     }, [hoveredBuilding, config]);

// //     const drawHighlight = () => {
// //         if (!canvasRef.current || !config?.buildings) return;
// //         const ctx = canvasRef.current.getContext('2d');
// //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// //         config.buildings.forEach(building => {
// //             if (building.id === hoveredBuilding?.id) {
// //                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
// //                 ctx.strokeStyle = 'rgba(0,0,0,0)';
// //                 ctx.lineWidth = 3;
// //                 if (building.selectionType === 'rect' && building.area) {
// //                     ctx.fillRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                     ctx.strokeRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                 } else if (building.selectionType === 'lasso' && building.path) {
// //                     ctx.beginPath();
// //                     building.path.forEach((point, index) => {
// //                         if (index === 0) {
// //                             ctx.moveTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         } else {
// //                             ctx.lineTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         }
// //                     });
// //                     ctx.closePath();
// //                     ctx.fill();
// //                     ctx.stroke();
// //                 }
// //             }
// //         });
// //     };

// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }

// //     const toggleFullscreen = () => {
// //         setIsFullscreen(!isFullscreen);
// //     };

// //     const containerClasses = isFullscreen
// //         ? "fixed inset-0 z-50 bg-white"
// //         : "w-full";

// //     const contentClasses = isFullscreen
// //         ? "h-screen p-4 flex flex-col"
// //         : "";

// //     return (
// //         // <div className={containerClasses} ref={containerRef}>
// //         //     <div className={contentClasses}>
// //         <motion.div
// //             className={containerClasses}
// //             ref={containerRef}
// //             layout
// //             transition={{ duration: 0.5, ease: "easeInOut" }}
// //         >
// //             <motion.div
// //                 className={contentClasses}
// //                 layout
// //                 transition={{ duration: 0.5, ease: "easeInOut" }}
// //             >
// //                 <div className={`mb-6 p-4 bg-white rounded-lg shadow-sm ${isFullscreen ? 'flex-shrink-0' : ''}`}>
// //                     <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //                         Project Overview
// //                     </h2>
// //                     <p className="text-gray-600">
// //                         Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                     </p>
// //                     <div className="mt-2 text-sm text-gray-500">
// //                         Total Buildings: {config.metadata.buildingCount}
// //                     </div>
// //                 </div>
// //                 <div className={`relative border rounded-lg overflow-hidden ${isFullscreen ? 'flex-grow' : ''}`}>
// //                     <img
// //                         ref={imageRef}
// //                         src={config.image.src}
// //                         alt="Property Map"
// //                         className="w-full h-full object-contain"
// //                     />
// //                     <canvas
// //                         ref={canvasRef}
// //                         className="absolute top-0 left-0 w-full h-full pointer-events-none"
// //                     />
// //                     {config.buildings?.map((building) => (
// //                         <div
// //                             key={building.id}
// //                             className="absolute"
// //                             style={{
// //                                 top: `${building.position.y * 100}%`,
// //                                 left: `${building.position.x * 100}%`,
// //                             }}
// //                         >
// //                             <div
// //                                 className="relative"
// //                                 onMouseEnter={() => setHoveredBuilding(building)}
// //                                 onMouseLeave={() => setHoveredBuilding(null)}
// //                             >
// //                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
// //                                     ${hoveredBuilding?.id === building.id
// //                                         ? 'bg-white ring-4 ring-blue-500'
// //                                         : 'bg-white ring-2 ring-gray-300 hover:ring-blue-500'}`}
// //                                 >
// //                                     {building.name.charAt(0)}
// //                                 </div>
// //                                 {hoveredBuilding?.id === building.id && (
// //                                     <div className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-64 -translate-x-1/2 mt-2">
// //                                         <div className="absolute top-0 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
// //                                             <div className="w-3 h-3 bg-white rotate-45 transform"></div>
// //                                         </div>
// //                                         <div className="text-lg font-bold mb-1">{building.name}</div>
// //                                         <div className="text-sm text-gray-600 mb-2">
// //                                             {building.developmentStatus && (
// //                                                 <div>{building.developmentStatus} • {building.totalFloors} floors</div>
// //                                             )}
// //                                         </div>
// //                                         {building.price && (
// //                                             <div className="text-sm">
// //                                                 from {building.price.toLocaleString()} ₽
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}
// //                     <button
// //                         onClick={toggleFullscreen}
// //                         className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
// //                         aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
// //                     >
// //                         {isFullscreen ? (
// //                             <Minimize2 className="w-6 h-6 text-gray-600" />
// //                         ) : (
// //                             <Maximize2 className="w-6 h-6 text-gray-600" />
// //                         )}
// //                     </button>
// //                 </div>
// //             </motion.div>
// //         </motion.div>
// //     );
// // };

// // export default BuildingViewer;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Building, Home, Maximize2, Minimize2 } from 'lucide-react';

// // const BuildingViewer = ({ config }) => {
// //     const [hoveredBuilding, setHoveredBuilding] = useState(null);
// //     const [isFullscreen, setIsFullscreen] = useState(false);
// //     const popupRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const imageRef = useRef(null);
// //     const containerRef = useRef(null);

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (popupRef.current && !popupRef.current.contains(event.target)) {
// //                 setHoveredBuilding(null);
// //             }
// //         };

// //         const handleEscKey = (event) => {
// //             if (event.key === 'Escape' && isFullscreen) {
// //                 setIsFullscreen(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         document.addEventListener('keydown', handleEscKey);

// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //             document.removeEventListener('keydown', handleEscKey);
// //         };
// //     }, [isFullscreen]);

// //     useEffect(() => {
// //         if (imageRef.current && canvasRef.current) {
// //             const canvas = canvasRef.current;
// //             canvas.width = imageRef.current.width;
// //             canvas.height = imageRef.current.height;
// //             drawHighlight();
// //         }
// //     }, [hoveredBuilding, config]);

// //     const drawHighlight = () => {
// //         if (!canvasRef.current || !config?.buildings) return;
// //         const ctx = canvasRef.current.getContext('2d');
// //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
// //         config.buildings.forEach(building => {
// //             if (building.id === hoveredBuilding?.id) {
// //                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
// //                 ctx.strokeStyle = 'rgba(0,0,0,0)';
// //                 ctx.lineWidth = 3;
// //                 if (building.selectionType === 'rect' && building.area) {
// //                     ctx.fillRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                     ctx.strokeRect(
// //                         building.area.x * canvasRef.current.width,
// //                         building.area.y * canvasRef.current.height,
// //                         building.area.width * canvasRef.current.width,
// //                         building.area.height * canvasRef.current.height
// //                     );
// //                 } else if (building.selectionType === 'lasso' && building.path) {
// //                     ctx.beginPath();
// //                     building.path.forEach((point, index) => {
// //                         if (index === 0) {
// //                             ctx.moveTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         } else {
// //                             ctx.lineTo(
// //                                 point.x * canvasRef.current.width,
// //                                 point.y * canvasRef.current.height
// //                             );
// //                         }
// //                     });
// //                     ctx.closePath();
// //                     ctx.fill();
// //                     ctx.stroke();
// //                 }
// //             }
// //         });
// //     };

// //     if (!config || !config.image) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 No building configuration available
// //             </div>
// //         );
// //     }

// //     const toggleFullscreen = () => {
// //         setIsFullscreen(!isFullscreen);
// //     };

// //     const containerClasses = isFullscreen
// //         ? "fixed inset-0 z-50 bg-white"
// //         : "w-full";

// //     const contentClasses = isFullscreen
// //         ? "h-screen p-4 flex flex-col"
// //         : "";

// //     return (
// //         <div className={containerClasses} ref={containerRef}>
// //             <div className={contentClasses}>
// //                 <div className={`mb-6 p-4 bg-white rounded-lg shadow-sm ${isFullscreen ? 'flex-shrink-0' : ''}`}>
// //                     <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //                         Project Overview
// //                     </h2>
// //                     <p className="text-gray-600">
// //                         Last updated: {new Date(config.metadata.lastModified).toLocaleDateString()}
// //                     </p>
// //                     <div className="mt-2 text-sm text-gray-500">
// //                         Total Buildings: {config.metadata.buildingCount}
// //                     </div>
// //                 </div>
// //                 <div className={`relative border rounded-lg overflow-hidden ${isFullscreen ? 'flex-grow' : ''}`}>
// //                     <img
// //                         ref={imageRef}
// //                         src={config.image.src}
// //                         alt="Property Map"
// //                         className="w-full h-full object-contain"
// //                     />
// //                     <canvas
// //                         ref={canvasRef}
// //                         className="absolute top-0 left-0 w-full h-full pointer-events-none"
// //                     />
// //                     {config.buildings?.map((building) => (
// //                         <div
// //                             key={building.id}
// //                             className="absolute"
// //                             style={{
// //                                 top: `${building.position.y * 100}%`,
// //                                 left: `${building.position.x * 100}%`,
// //                             }}
// //                         >
// //                             <div
// //                                 className="relative"
// //                                 onMouseEnter={() => setHoveredBuilding(building)}
// //                                 onMouseLeave={() => setHoveredBuilding(null)}
// //                             >
// //                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
// //                                     ${hoveredBuilding?.id === building.id
// //                                         ? 'bg-white ring-4 ring-blue-500'
// //                                         : 'bg-white ring-2 ring-gray-300 hover:ring-blue-500'}`}
// //                                 >
// //                                     {building.name.charAt(0)}
// //                                 </div>
// //                                 {hoveredBuilding?.id === building.id && (
// //                                     <div className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-64 -translate-x-1/2 mt-2">
// //                                         <div className="absolute top-0 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
// //                                             <div className="w-3 h-3 bg-white rotate-45 transform"></div>
// //                                         </div>
// //                                         <div className="text-lg font-bold mb-1">{building.name}</div>
// //                                         <div className="text-sm text-gray-600 mb-2">
// //                                             {building.developmentStatus && (
// //                                                 <div>{building.developmentStatus} • {building.totalFloors} floors</div>
// //                                             )}
// //                                         </div>
// //                                         {building.price && (
// //                                             <div className="text-sm">
// //                                                 from {building.price.toLocaleString()} ₽
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}
// //                     <button
// //                         onClick={toggleFullscreen}
// //                         className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
// //                         aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
// //                     >
// //                         {isFullscreen ? (
// //                             <Minimize2 className="w-6 h-6 text-gray-600" />
// //                         ) : (
// //                             <Maximize2 className="w-6 h-6 text-gray-600" />
// //                         )}
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default BuildingViewer;

// import React, { useState, useRef, useEffect } from 'react';
// import { Building, Home, Maximize2, Minimize2 } from 'lucide-react';

// const BuildingViewer = ({ config }) => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const popupRef = useRef(null);
//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (popupRef.current && !popupRef.current.contains(event.target)) {
//                 setHoveredBuilding(null);
//             }
//         };

//         const handleEscKey = (event) => {
//             if (event.key === 'Escape' && isFullscreen) {
//                 setIsFullscreen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         document.addEventListener('keydown', handleEscKey);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//             document.removeEventListener('keydown', handleEscKey);
//         };
//     }, [isFullscreen]);

//     useEffect(() => {
//         if (imageRef.current && canvasRef.current) {
//             const canvas = canvasRef.current;
//             canvas.width = imageRef.current.width;
//             canvas.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config]);

//     useEffect(() => {
//         if (isFullscreen) {
//             document.documentElement.requestFullscreen().catch((err) => {
//                 console.error(`Error attempting to enable fullscreen: ${err.message}`);
//             });
//         } else if (document.fullscreenElement) {
//             document.exitFullscreen().catch((err) => {
//                 console.error(`Error attempting to exit fullscreen: ${err.message}`);
//             });
//         }
//     }, [isFullscreen]);

//     const drawHighlight = () => {
//         if (!canvasRef.current || !config?.buildings) return;
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         config.buildings.forEach(building => {
//             if (building.id === hoveredBuilding?.id) {
//                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
//                 ctx.strokeStyle = 'rgba(0,0,0,0)';
//                 ctx.lineWidth = 3;
//                 if (building.selectionType === 'rect' && building.area) {
//                     ctx.fillRect(
//                         building.area.x * canvasRef.current.width,
//                         building.area.y * canvasRef.current.height,
//                         building.area.width * canvasRef.current.width,
//                         building.area.height * canvasRef.current.height
//                     );
//                     ctx.strokeRect(
//                         building.area.x * canvasRef.current.width,
//                         building.area.y * canvasRef.current.height,
//                         building.area.width * canvasRef.current.width,
//                         building.area.height * canvasRef.current.height
//                     );
//                 } else if (building.selectionType === 'lasso' && building.path) {
//                     ctx.beginPath();
//                     building.path.forEach((point, index) => {
//                         if (index === 0) {
//                             ctx.moveTo(
//                                 point.x * canvasRef.current.width,
//                                 point.y * canvasRef.current.height
//                             );
//                         } else {
//                             ctx.lineTo(
//                                 point.x * canvasRef.current.width,
//                                 point.y * canvasRef.current.height
//                             );
//                         }
//                     });
//                     ctx.closePath();
//                     ctx.fill();
//                     ctx.stroke();
//                 }
//             }
//         });
//     };

//     if (!config || !config.image) {
//         return (
//             <div className="p-8 text-center text-gray-500">
//                 No building configuration available
//             </div>
//         );
//     }

//     const toggleFullscreen = () => {
//         setIsFullscreen(!isFullscreen);
//     };

//     return (
//         <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`} ref={containerRef}>
//             {!isFullscreen && (
//                 <div className="mb-6 py-4 bg-white rounded-lg shadow-sm">
//                     {/* <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//                         Project Overview
//                     </h2> */}
//                     {/* <HeadingCommon title='Project 3D View' dual /> */}
//                     <h1>Project 3D View</h1>
//                     <p className="text-gray-600">
//                         Last updated: {new Date(config?.metadata?.lastModified).toLocaleDateString()}
//                     </p>
//                     <div className="mt-2 text-sm text-gray-500">
//                         Total Buildings: {config?.metadata?.buildingCount}
//                     </div>
//                 </div>
//             )}
//             <div className={`relative ${isFullscreen ? 'h-screen' : ''}`}>
//                 <img
//                     ref={imageRef}
//                     src={config.image.src}
//                     alt="Property Map"
//                     className={`${isFullscreen ? 'h-screen w-screen object-contain' : 'w-full h-full object-contain'}`}
//                 />
//                 <canvas
//                     ref={canvasRef}
//                     className="absolute top-0 left-0 w-full h-full pointer-events-none"
//                 />
//                 {config.buildings?.map((building) => (
//                     <div
//                         key={building.id}
//                         className="absolute"
//                         style={{
//                             top: `${building.position.y * 100}%`,
//                             left: `${building.position.x * 100}%`,
//                         }}
//                     >
//                         <div
//                             className="relative"
//                             onMouseEnter={() => setHoveredBuilding(building)}
//                             onMouseLeave={() => setHoveredBuilding(null)}
//                         >
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
//                                 ${hoveredBuilding?.id === building.id
//                                     ? 'bg-white ring-4 ring-blue-500'
//                                     : 'bg-white ring-2 ring-gray-300 hover:ring-blue-500'}`}
//                             >
//                                 {building?.name?.charAt(0)}
//                             </div>
//                             {hoveredBuilding?.id === building.id && !isFullscreen && (
//                                 <div className="absolute z-10 bg-white rounded-lg shadow-lg p-3 w-64 -translate-x-1/2 mt-2">
//                                     <div className="absolute top-0 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
//                                         <div className="w-3 h-3 bg-white rotate-45 transform"></div>
//                                     </div>
//                                     <div className="text-lg font-bold mb-1">{building.name}</div>
//                                     <div className="text-sm text-gray-600 mb-2">
//                                         {building.developmentStatus && (
//                                             <div>{building.developmentStatus} • {building.totalFloors} floors</div>
//                                         )}
//                                     </div>
//                                     {building.price && (
//                                         <div className="text-sm">
//                                             from {building.price.toLocaleString()} ₽
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//                 <button
//                     onClick={toggleFullscreen}
//                     className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
//                     aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//                 >
//                     {isFullscreen ? (
//                         <Minimize2 className="w-6 h-6 text-gray-600" />
//                     ) : (
//                         <Maximize2 className="w-6 h-6 text-gray-600" />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BuildingViewer;


// import React, { useState, useRef, useEffect } from 'react';
// import { Maximize2, Minimize2 } from 'lucide-react';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const popupRef = useRef(null);
//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const [config, setConfig] = useState([])

//     console.log("config", config)

//     const fetchConfig = async () => {
//         console.log("fetching....")

//         try {
//             const response = await fetch(`https://propertify.onrender.com/api/export-config/PRJ1737460453472`);

//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} - ${response.statusText}`);
//             }

//             const data = await response.json();
//             console.log('Response Data:', data);
//             setConfig(data?.data)


//         } catch (error) {
//             console.log("Error fetching configuration:", error);
//         }
//     };

//     useEffect(() => {
//         fetchConfig();
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (popupRef.current && !popupRef.current.contains(event.target)) {
//                 setHoveredBuilding(null);
//             }
//         };

//         const handleEscKey = (event) => {
//             if (event.key === 'Escape' && isFullscreen) {
//                 setIsFullscreen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         document.addEventListener('keydown', handleEscKey);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//             document.removeEventListener('keydown', handleEscKey);
//         };
//     }, [isFullscreen]);

//     useEffect(() => {
//         if (imageRef.current && canvasRef.current) {
//             const canvas = canvasRef.current;
//             canvas.width = imageRef.current.width;
//             canvas.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config]);

//     useEffect(() => {
//         if (isFullscreen) {
//             document.documentElement.requestFullscreen().catch((err) => {
//                 console.error(`Error attempting to enable fullscreen: ${err.message}`);
//             });
//         } else if (document.fullscreenElement) {
//             document.exitFullscreen().catch((err) => {
//                 console.error(`Error attempting to exit fullscreen: ${err.message}`);
//             });
//         }
//     }, [isFullscreen]);

//     const drawHighlight = () => {
//         if (!canvasRef.current || !config?.buildings) return;
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         config.buildings.forEach(building => {
//             if (building.id === hoveredBuilding?.id && building.path) {
//                 ctx.fillStyle = 'rgba(228, 228, 228, 0.5)'; // Light blue fill
//                 ctx.strokeStyle = 'rgba(0,0,0,0)'; // Blue stroke
//                 ctx.lineWidth = 0;

//                 ctx.beginPath();
//                 building.path.forEach((point, index) => {
//                     if (index === 0) {
//                         ctx.moveTo(
//                             point.x * canvasRef.current.width,
//                             point.y * canvasRef.current.height
//                         );
//                     } else {
//                         ctx.lineTo(
//                             point.x * canvasRef.current.width,
//                             point.y * canvasRef.current.height
//                         );
//                     }
//                 });
//                 ctx.closePath();
//                 ctx.fill();
//                 ctx.stroke();
//             }
//         });
//     };

//     if (!config || !config.image) {
//         return (
//             <div className="p-8 text-center text-gray-500">
//                 No building configuration available
//             </div>
//         );
//     }

//     const toggleFullscreen = () => {
//         setIsFullscreen(!isFullscreen);
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };





//     return (
//         <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`} ref={containerRef}>
//             {!isFullscreen && (
//                 <div className="mb-6 py-4 px-6 bg-white rounded-lg shadow-sm">
//                     <h1 className="text-2xl font-semibold text-gray-800 mb-2">Project View</h1>
//                     <p className="text-gray-600">
//                         Last updated: {formatDate(config.exportedAt)}
//                     </p>
//                     <div className="mt-2 text-sm text-gray-500">
//                         Total Areas: {config.buildings?.length || 0}
//                     </div>
//                 </div>
//             )}

//             <div className={`relative ${isFullscreen ? 'h-screen' : ''}`}>
//                 <img
//                     ref={imageRef}
//                     src={config.image.src}
//                     alt="Property Map"
//                     className={`${isFullscreen ? 'h-screen w-screen object-contain' : 'w-full h-full object-contain'}`}
//                 />
//                 <canvas
//                     ref={canvasRef}
//                     className="absolute top-0 left-0 w-full h-full pointer-events-none"
//                 />

//                 {config.buildings?.map((building) => (
//                     <div
//                         key={building.id}
//                         className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                         style={{
//                             top: building.position.top,
//                             left: building.position.left,
//                         }}
//                     >
//                         <div
//                             className="relative"
//                             onMouseEnter={() => setHoveredBuilding(building)}
//                             onMouseLeave={() => setHoveredBuilding(null)}
//                         >
//                             {/* <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
//                                 ${hoveredBuilding?.id === building.id
//                                 ? 'bg-[#fff] text-white  border-2 border-[rgba(0,0,0)]'
//                                 : 'bg-[#fff] outline-[#C7D5EF50] outline-6 border-4 border-[rgba(0,0,0)]'}`}
//                             > */}
//                             {/* {building.heading.charAt(0)} */}
//                             {/* </div> */}
//                             <div className="relative flex justify-center items-center w-8 h-8 cursor-pointer">
//                                 {/* Animated Border Ping Effect */}
//                                 <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C7D5EF80] opacity-75"></div>

//                                 {/* Static Middle Portion */}
//                                 <div className={`relative inline-flex w-4 h-4 rounded-full transition-all duration-300
//     ${hoveredBuilding?.id === building.id
//                                         ? 'bg-white border-2 border-black'
//                                         : 'bg-white border-4 border-black'}`}
//                                 />
//                             </div>


//                             {hoveredBuilding?.id === building.id && (
//                                 <div className="absolute z-10 bg-white rounded-lg shadow-xl p-4 w-52 -translate-x-1/2 mt-2">
//                                     <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                                         <div className="w-3 h-3 bg-white rotate-45 transform"></div>
//                                     </div>
//                                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                                         {building.heading}
//                                     </h3>
//                                     <p className="text-gray-600 text-sm">
//                                         {building.description}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}

//                 <button
//                     onClick={toggleFullscreen}
//                     className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
//                     aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//                 >
//                     {isFullscreen ? (
//                         <Minimize2 className="w-6 h-6 text-gray-600" />
//                     ) : (
//                         <Maximize2 className="w-6 h-6 text-gray-600" />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BuildingViewer;


/* Highlight when in the area - added */
// import React, { useState, useRef, useEffect } from 'react';
// import { Maximize2, Minimize2 } from 'lucide-react';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const popupRef = useRef(null);
//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const [config, setConfig] = useState([]);

//     const fetchConfig = async () => {
//         try {
//             // const response = await fetch(`https://propertify.onrender.com/api/export-config/PROP1738374316908`);
//             const response = await fetch(`https://propertify.onrender.com/api/export-config/PROP1738742741391`);
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} - ${response.statusText}`);
//             }
//             const data = await response.json();
//             setConfig(data?.data);
//         } catch (error) {
//             console.log("Error fetching configuration:", error);
//         }
//     };

//     useEffect(() => {
//         fetchConfig();
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (popupRef.current && !popupRef.current.contains(event.target)) {
//                 setHoveredBuilding(null);
//             }
//         };

//         const handleEscKey = (event) => {
//             if (event.key === 'Escape' && isFullscreen) {
//                 setIsFullscreen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         document.addEventListener('keydown', handleEscKey);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//             document.removeEventListener('keydown', handleEscKey);
//         };
//     }, [isFullscreen]);

//     useEffect(() => {
//         if (imageRef.current && canvasRef.current) {
//             const canvas = canvasRef.current;
//             canvas.width = imageRef.current.width;
//             canvas.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config]);

//     useEffect(() => {
//         if (isFullscreen) {
//             document.documentElement.requestFullscreen().catch((err) => {
//                 console.error(`Error attempting to enable fullscreen: ${err.message}`);
//             });
//         } else if (document.fullscreenElement) {
//             document.exitFullscreen().catch((err) => {
//                 console.error(`Error attempting to exit fullscreen: ${err.message}`);
//             });
//         }
//     }, [isFullscreen]);

//     const isPointInPath = (x, y, path, canvasWidth, canvasHeight) => {
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.beginPath();
//         path.forEach((point, index) => {
//             if (index === 0) {
//                 ctx.moveTo(point.x * canvasWidth, point.y * canvasHeight);
//             } else {
//                 ctx.lineTo(point.x * canvasWidth, point.y * canvasHeight);
//             }
//         });
//         ctx.closePath();
//         return ctx.isPointInPath(x, y);
//     };

//     const handleCanvasHover = (event) => {
//         if (!canvasRef.current || !config?.buildings) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const hoveredArea = config.buildings.find(building =>
//             building.path && isPointInPath(x, y, building.path, canvasRef.current.width, canvasRef.current.height)
//         );

//         if (hoveredArea) {
//             setHoveredBuilding(hoveredArea);
//         } else if (!hoveredBuilding?.isHoveringMarker) {
//             setHoveredBuilding(null);
//         }
//     };

//     const drawHighlight = () => {
//         if (!canvasRef.current || !config?.buildings) return;
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         if (hoveredBuilding?.path) {
//             ctx.fillStyle = 'rgba(228, 228, 228, 0.5)';
//             ctx.strokeStyle = 'rgba(0,0,0,0)';
//             ctx.lineWidth = 0;

//             ctx.beginPath();
//             hoveredBuilding.path.forEach((point, index) => {
//                 if (index === 0) {
//                     ctx.moveTo(
//                         point.x * canvasRef.current.width,
//                         point.y * canvasRef.current.height
//                     );
//                 } else {
//                     ctx.lineTo(
//                         point.x * canvasRef.current.width,
//                         point.y * canvasRef.current.height
//                     );
//                 }
//             });
//             ctx.closePath();
//             ctx.fill();
//             ctx.stroke();
//         }
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     if (!config || !config.image) {
//         return (
//             <div className="p-8 text-center text-gray-500">
//                 No building configuration available
//             </div>
//         );
//     }

//     const toggleFullscreen = () => {
//         setIsFullscreen(!isFullscreen);
//     };

//     return (
//         <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`} ref={containerRef}>
//             {!isFullscreen && (
//                 <div className="mb-6 py-4 px-6 bg-white rounded-lg shadow-sm">
//                     <h1 className="text-2xl font-semibold text-gray-800 mb-2">Project View</h1>
//                     <p className="text-gray-600">
//                         Last updated: {formatDate(config.exportedAt)}
//                     </p>
//                     <div className="mt-2 text-sm text-gray-500">
//                         Total Areas: {config.buildings?.length || 0}
//                     </div>
//                 </div>
//             )}

//             <div className={`relative ${isFullscreen ? 'h-screen' : ''}`}>
//                 <img
//                     ref={imageRef}
//                     src={config.image.src}
//                     alt="Property Map"
//                     className={`${isFullscreen ? 'h-screen w-screen object-contain' : 'w-full h-full object-contain'}`}
//                 />
//                 <canvas
//                     ref={canvasRef}
//                     className="absolute top-0 left-0 w-full h-full"
//                     onMouseMove={handleCanvasHover}
//                     onMouseLeave={() => !hoveredBuilding?.isHoveringMarker && setHoveredBuilding(null)}
//                 />

//                 {config.buildings?.map((building) => (
//                     <div
//                         key={building.id}
//                         className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                         style={{
//                             top: building.position.top,
//                             left: building.position.left,
//                         }}
//                     >
//                         <div
//                             className="relative"
//                             onMouseEnter={() => setHoveredBuilding({ ...building, isHoveringMarker: true })}
//                             onMouseLeave={() => setHoveredBuilding(null)}
//                         >
//                             <div className="relative flex justify-center items-center w-8 h-8 cursor-pointer">
//                                 <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C7D5EF80] opacity-75"></div>
//                                 <div className={`relative inline-flex w-4 h-4 rounded-full transition-all duration-300
//                                     ${hoveredBuilding?.id === building.id
//                                         ? 'bg-white border-2 border-black'
//                                         : 'bg-white border-4 border-black'}`}
//                                 />
//                             </div>

//                             {hoveredBuilding?.id === building.id && (
//                                 <div className="absolute z-10 bg-white rounded-lg shadow-xl p-4 w-52 -translate-x-1/2 mt-2">
//                                     <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                                         <div className="w-3 h-3 bg-white rotate-45 transform"></div>
//                                     </div>
//                                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                                         {building.heading}
//                                     </h3>
//                                     <p className="text-gray-600 text-sm">
//                                         {building.description}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}

//                 <button
//                     onClick={toggleFullscreen}
//                     className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
//                     aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//                 >
//                     {isFullscreen ? (
//                         <Minimize2 className="w-6 h-6 text-gray-600" />
//                     ) : (
//                         <Maximize2 className="w-6 h-6 text-gray-600" />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BuildingViewer;



import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import _ from 'lodash';

const BuildingViewer = ({ id }) => {
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [config, setConfig] = useState(null);
    const [loadedChunks, setLoadedChunks] = useState(new Set());

    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const drawingContextRef = useRef(null);


    const fetchConfig = async () => {
        try {
            // const response = await fetch(`https://propertify.onrender.com/api/export-config/PROP1738374316908`);
            // const response = await fetch(`https://propertify.onrender.com/api/export-config/PROP1738742741391`);
            const response = await fetch(`https://propertify.onrender.com/api/export-config/${id}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setConfig(data?.data);
        } catch (error) {
            console.log("Error fetching configuration:", error);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, [id]);

    // Initialize canvas context
    useEffect(() => {
        if (canvasRef.current) {
            drawingContextRef.current = canvasRef.current.getContext('2d');
        }
    }, []);

    // Memoize buildings data with chunking
    const buildingChunks = useMemo(() => {
        if (!config?.buildings) return [];
        return _.chunk(config.buildings, 10); // Process 10 buildings at a time
    }, [config]);

    // Load building chunks progressively
    useEffect(() => {
        if (!buildingChunks.length) return;

        const loadNextChunk = (chunkIndex) => {
            if (chunkIndex >= buildingChunks.length) return;

            setLoadedChunks(prev => {
                const newSet = new Set(prev);
                newSet.add(chunkIndex);
                return newSet;
            });

            // Schedule next chunk load
            if (chunkIndex + 1 < buildingChunks.length) {
                setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
            }
        };

        loadNextChunk(0);
    }, [buildingChunks]);

    // Get visible buildings based on loaded chunks
    const visibleBuildings = useMemo(() => {
        return Array.from(loadedChunks)
            .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
    }, [buildingChunks, loadedChunks]);

    // Optimized point calculation
    const isPointInPath = useCallback((x, y, path) => {
        if (!path?.length || !drawingContextRef.current) return false;

        const ctx = drawingContextRef.current;
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        ctx.beginPath();
        path.forEach((point, index) => {
            const px = point.x * canvasWidth;
            const py = point.y * canvasHeight;
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();

        return ctx.isPointInPath(x, y);
    }, []);

    // Throttled hover handler
    const handleCanvasHover = useCallback(_.throttle((event) => {
        if (!canvasRef.current || !visibleBuildings.length) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const hoveredArea = visibleBuildings.find(building =>
            building.path && isPointInPath(x, y, building.path)
        );

        setHoveredBuilding(prev =>
            hoveredArea?.id === prev?.id ? prev : hoveredArea
        );
    }, 50), [visibleBuildings, isPointInPath]);

    // Optimized drawing
    const drawHighlight = useCallback(() => {
        if (!drawingContextRef.current || !hoveredBuilding?.path) return;

        const ctx = drawingContextRef.current;
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = 'rgba(228, 228, 228, 0.5)';
        ctx.beginPath();

        hoveredBuilding.path.forEach((point, index) => {
            const px = point.x * canvasWidth;
            const py = point.y * canvasHeight;
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });

        ctx.closePath();
        ctx.fill();
    }, [hoveredBuilding]);

    // Canvas setup effect
    useEffect(() => {
        if (imageRef.current && canvasRef.current) {
            canvasRef.current.width = imageRef.current.width;
            canvasRef.current.height = imageRef.current.height;
            drawHighlight();
        }
    }, [hoveredBuilding, config, drawHighlight]);

    // Render building markers efficiently
    const BuildingMarker = useCallback(({ building }) => {
        const isHovered = hoveredBuilding?.id === building.id;

        return (
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    top: building.position.top,
                    left: building.position.left
                }}
            >
                <div
                    className={`w-4 h-4 rounded-full bg-white border-2 transition-colors duration-200
                        ${isHovered ? 'border-blue-500' : 'border-black'}`}
                    onMouseEnter={() => setHoveredBuilding(building)}
                />

                {isHovered && (
                    <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-48 mt-2">
                        <h3 className="font-medium text-gray-900">{building.heading}</h3>
                        <p className="text-sm text-gray-600">{building.description}</p>
                    </div>
                )}
            </div>
        );
    }, [hoveredBuilding]);

    return (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`} ref={containerRef}>
            <div className="relative">
                <img
                    ref={imageRef}
                    src={config?.image?.src}
                    alt="Property Map"
                    className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'object-cover'}`}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    onMouseMove={handleCanvasHover}
                    onMouseLeave={() => setHoveredBuilding(null)}
                />

                {visibleBuildings.map(building => (
                    <BuildingMarker key={building.id} building={building} />
                ))}

                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-6 h-6 text-gray-600" />
                    ) : (
                        <Maximize2 className="w-6 h-6 text-gray-600" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default BuildingViewer;

