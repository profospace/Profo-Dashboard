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



// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { Maximize2, Minimize2 } from 'lucide-react';
// import _ from 'lodash';
// import { useSearchParams } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [config, setConfig] = useState(null);
//     const [loadedChunks, setLoadedChunks] = useState(new Set());

//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const drawingContextRef = useRef(null);

//     const [searchParams] = useSearchParams()
//     const id = searchParams.get('id')


//     const fetchConfig = async () => {
//         try {
//             // const response = await fetch(`https://propertify.onrender.com/api/export-config/PROP1738374316908`);
//             // const response = await fetch(`https://propertify.onrender.com/api/export-config/PROP1738742741391`);
//             const response = await fetch(`${base_url}/api/export-config/${id}`);

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
//     }, [id]);

//     // Initialize canvas context
//     useEffect(() => {
//         if (canvasRef.current) {
//             drawingContextRef.current = canvasRef.current.getContext('2d');
//         }
//     }, []);

//     // Memoize buildings data with chunking
//     const buildingChunks = useMemo(() => {
//         if (!config?.buildings) return [];
//         return _.chunk(config.buildings, 10); // Process 10 buildings at a time
//     }, [config]);

//     // Load building chunks progressively
//     useEffect(() => {
//         if (!buildingChunks.length) return;

//         const loadNextChunk = (chunkIndex) => {
//             if (chunkIndex >= buildingChunks.length) return;

//             setLoadedChunks(prev => {
//                 const newSet = new Set(prev);
//                 newSet.add(chunkIndex);
//                 return newSet;
//             });

//             // Schedule next chunk load
//             if (chunkIndex + 1 < buildingChunks.length) {
//                 setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
//             }
//         };

//         loadNextChunk(0);
//     }, [buildingChunks]);

//     // Get visible buildings based on loaded chunks
//     const visibleBuildings = useMemo(() => {
//         return Array.from(loadedChunks)
//             .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
//     }, [buildingChunks, loadedChunks]);

//     // Optimized point calculation
//     const isPointInPath = useCallback((x, y, path) => {
//         if (!path?.length || !drawingContextRef.current) return false;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.beginPath();
//         path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });
//         ctx.closePath();

//         return ctx.isPointInPath(x, y);
//     }, []);

//     // Throttled hover handler
//     const handleCanvasHover = useCallback(_.throttle((event) => {
//         if (!canvasRef.current || !visibleBuildings.length) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const hoveredArea = visibleBuildings.find(building =>
//             building.path && isPointInPath(x, y, building.path)
//         );

//         setHoveredBuilding(prev =>
//             hoveredArea?.id === prev?.id ? prev : hoveredArea
//         );
//     }, 50), [visibleBuildings, isPointInPath]);

//     // Optimized drawing
//     const drawHighlight = useCallback(() => {
//         if (!drawingContextRef.current || !hoveredBuilding?.path) return;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//         ctx.fillStyle = 'rgba(228, 228, 228, 0.5)';
//         ctx.beginPath();

//         hoveredBuilding.path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });

//         ctx.closePath();
//         ctx.fill();
//     }, [hoveredBuilding]);

//     // Canvas setup effect
//     useEffect(() => {
//         if (imageRef.current && canvasRef.current) {
//             canvasRef.current.width = imageRef.current.width;
//             canvasRef.current.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config, drawHighlight]);

//     // Render building markers efficiently
//     const BuildingMarker = useCallback(({ building }) => {
//         const isHovered = hoveredBuilding?.id === building.id;

//         return (
//             <div
//                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                 style={{
//                     top: building.position.top,
//                     left: building.position.left
//                 }}
//             >
//                 <div
//                     className={`w-4 h-4 rounded-full bg-white border-2 transition-colors duration-200
//                         ${isHovered ? 'border-blue-500' : 'border-black'}`}
//                     onMouseEnter={() => setHoveredBuilding(building)}
//                 />

//                 {isHovered && (
//                     <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-48 mt-2">
//                         <h3 className="font-medium text-gray-900">{building.heading}</h3>
//                         <p className="text-sm text-gray-600">{building.description}</p>
//                     </div>
//                 )}
//             </div>
//         );
//     }, [hoveredBuilding]);

//     return (
//         <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`} ref={containerRef}>
//             <div className="relative">
//                 <img
//                     ref={imageRef}
//                     src={config?.image?.src}
//                     alt="Property Map"
//                     className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'object-cover'}`}
//                 />
//                 <canvas
//                     ref={canvasRef}
//                     className="absolute top-0 left-0 w-full h-full"
//                     onMouseMove={handleCanvasHover}
//                     onMouseLeave={() => setHoveredBuilding(null)}
//                 />

//                 {visibleBuildings.map(building => (
//                     <BuildingMarker key={building.id} building={building} />
//                 ))}

//                 <button
//                     onClick={() => setIsFullscreen(!isFullscreen)}
//                     className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
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

// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { Maximize2, Minimize2, Box, Map } from 'lucide-react';
// import _ from 'lodash';
// import * as THREE from 'three';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
//     const [config, setConfig] = useState(null);
//     const [loadedChunks, setLoadedChunks] = useState(new Set());

//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const drawingContextRef = useRef(null);
//     const threejsContainerRef = useRef(null);
//     const sceneRef = useRef(null);
//     const rendererRef = useRef(null);
//     const cameraRef = useRef(null);
//     const raycasterRef = useRef(null);
//     const mouseRef = useRef(new THREE.Vector2());
//     const buildingMeshesRef = useRef([]);
//     const frameIdRef = useRef();

//     // Mock data for demonstration - replace with your actual API call
//     const mockConfig = {
//         image: {
//             src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
//         },
//         buildings: [
//             {
//                 id: 1,
//                 heading: "North Tower",
//                 description: "Premium residential complex - $2500 per sqft",
//                 path: [
//                     { x: 0.2, y: 0.15 },
//                     { x: 0.4, y: 0.15 },
//                     { x: 0.4, y: 0.35 },
//                     { x: 0.2, y: 0.35 }
//                 ],
//                 position: { top: "25%", left: "30%" }
//             },
//             {
//                 id: 2,
//                 heading: "South Plaza",
//                 description: "Commercial space - $1800 per sqft",
//                 path: [
//                     { x: 0.6, y: 0.4 },
//                     { x: 0.8, y: 0.4 },
//                     { x: 0.8, y: 0.65 },
//                     { x: 0.6, y: 0.65 }
//                 ],
//                 position: { top: "52.5%", left: "70%" }
//             },
//             {
//                 id: 3,
//                 heading: "East Wing",
//                 description: "Mixed use development - $2200 per sqft",
//                 path: [
//                     { x: 0.15, y: 0.55 },
//                     { x: 0.35, y: 0.55 },
//                     { x: 0.35, y: 0.8 },
//                     { x: 0.15, y: 0.8 }
//                 ],
//                 position: { top: "67.5%", left: "25%" }
//             },
//             {
//                 id: 4,
//                 heading: "Central Court",
//                 description: "Luxury apartments - $3000 per sqft",
//                 path: [
//                     { x: 0.45, y: 0.2 },
//                     { x: 0.65, y: 0.2 },
//                     { x: 0.65, y: 0.35 },
//                     { x: 0.45, y: 0.35 }
//                 ],
//                 position: { top: "27.5%", left: "55%" }
//             }
//         ]
//     };

//     useEffect(() => {
//         setConfig(mockConfig);
//     }, []);

//     // Initialize Three.js scene
//     const initThreeJS = useCallback(() => {
//         if (!threejsContainerRef.current) return;

//         const container = threejsContainerRef.current;
//         const width = container.clientWidth;
//         const height = container.clientHeight;

//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x1a1a1a);
//         sceneRef.current = scene;

//         // Camera
//         const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
//         camera.position.set(0, 15, 25);
//         camera.lookAt(0, 0, 0);
//         cameraRef.current = camera;

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.shadowMap.enabled = true;
//         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         container.appendChild(renderer.domElement);
//         rendererRef.current = renderer;

//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//         directionalLight.position.set(10, 20, 10);
//         directionalLight.castShadow = true;
//         directionalLight.shadow.mapSize.width = 2048;
//         directionalLight.shadow.mapSize.height = 2048;
//         scene.add(directionalLight);

//         // Base plane
//         const planeGeometry = new THREE.PlaneGeometry(30, 20);
//         const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3748 });
//         const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//         plane.rotation.x = -Math.PI / 2;
//         plane.receiveShadow = true;
//         scene.add(plane);

//         // Raycaster for mouse interaction
//         raycasterRef.current = new THREE.Raycaster();

//         // Mouse event handlers
//         const handleMouseMove = (event) => {
//             const rect = container.getBoundingClientRect();
//             mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
//             mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
//         };

//         const handleMouseLeave = () => {
//             setHoveredBuilding(null);
//         };

//         container.addEventListener('mousemove', handleMouseMove);
//         container.addEventListener('mouseleave', handleMouseLeave);

//         return () => {
//             container.removeEventListener('mousemove', handleMouseMove);
//             container.removeEventListener('mouseleave', handleMouseLeave);
//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//             renderer.dispose();
//         };
//     }, []);

//     // Create 3D building blocks
//     const createBuildingBlocks = useCallback(() => {
//         if (!config?.buildings || !sceneRef.current) return;

//         // Clear existing meshes
//         buildingMeshesRef.current.forEach(mesh => {
//             sceneRef.current.remove(mesh);
//         });
//         buildingMeshesRef.current = [];

//         config.buildings.forEach((building, index) => {
//             if (!building.path || building.path.length < 3) return;

//             // Create shape from path
//             const shape = new THREE.Shape();
//             building.path.forEach((point, i) => {
//                 const x = (point.x - 0.5) * 30; // Scale to scene
//                 const z = (point.y - 0.5) * -20; // Flip Y and scale
//                 if (i === 0) {
//                     shape.moveTo(x, z);
//                 } else {
//                     shape.lineTo(x, z);
//                 }
//             });

//             // Extrude the shape
//             const extrudeSettings = {
//                 depth: 2 + Math.random() * 4, // Random height between 2-6
//                 bevelEnabled: true,
//                 bevelSegments: 2,
//                 steps: 1,
//                 bevelSize: 0.1,
//                 bevelThickness: 0.1
//             };

//             const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
//             // Create gradient material
//             const hue = (index * 137.5) % 360; // Golden angle spacing
//             const color = new THREE.Color().setHSL(hue / 360, 0.7, 0.5);
            
//             const material = new THREE.MeshPhongMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.8,
//                 shininess: 100
//             });

//             const mesh = new THREE.Mesh(geometry, material);
//             mesh.position.y = extrudeSettings.depth / 2;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             mesh.userData = { building, originalColor: color.clone() };

//             sceneRef.current.add(mesh);
//             buildingMeshesRef.current.push(mesh);
//         });
//     }, [config]);

//     // Animation loop
//     const animate = useCallback(() => {
//         if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

//         // Raycasting for hover effects
//         if (raycasterRef.current && buildingMeshesRef.current.length > 0) {
//             raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
//             const intersects = raycasterRef.current.intersectObjects(buildingMeshesRef.current);

//             // Reset all building colors
//             buildingMeshesRef.current.forEach(mesh => {
//                 mesh.material.color.copy(mesh.userData.originalColor);
//                 mesh.material.opacity = 0.8;
//                 mesh.scale.set(1, 1, 1);
//             });

//             if (intersects.length > 0) {
//                 const intersectedMesh = intersects[0].object;
//                 intersectedMesh.material.color.setHex(0xffffff);
//                 intersectedMesh.material.opacity = 1.0;
//                 intersectedMesh.scale.set(1.05, 1.1, 1.05);
                
//                 const building = intersectedMesh.userData.building;
//                 if (hoveredBuilding?.id !== building.id) {
//                     setHoveredBuilding(building);
//                 }
//             } else {
//                 if (hoveredBuilding) {
//                     setHoveredBuilding(null);
//                 }
//             }
//         }

//         // Rotate camera around the scene
//         const time = Date.now() * 0.0005;
//         if (cameraRef.current) {
//             cameraRef.current.position.x = Math.cos(time) * 25;
//             cameraRef.current.position.z = Math.sin(time) * 25;
//             cameraRef.current.lookAt(0, 2, 0);
//         }

//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//         frameIdRef.current = requestAnimationFrame(animate);
//     }, [hoveredBuilding]);

//     // Handle window resize
//     const handleResize = useCallback(() => {
//         if (!threejsContainerRef.current || !rendererRef.current || !cameraRef.current) return;

//         const width = threejsContainerRef.current.clientWidth;
//         const height = threejsContainerRef.current.clientHeight;

//         cameraRef.current.aspect = width / height;
//         cameraRef.current.updateProjectionMatrix();
//         rendererRef.current.setSize(width, height);
//     }, []);

//     // Initialize 3D scene
//     useEffect(() => {
//         if (viewMode === '3d') {
//             const cleanup = initThreeJS();
//             window.addEventListener('resize', handleResize);

//             return () => {
//                 window.removeEventListener('resize', handleResize);
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//                 cleanup?.();
//             };
//         }
//     }, [viewMode, initThreeJS, handleResize]);

//     // Create building blocks when config changes
//     useEffect(() => {
//         if (viewMode === '3d') {
//             createBuildingBlocks();
//         }
//     }, [config, viewMode, createBuildingBlocks]);

//     // Start animation loop
//     useEffect(() => {
//         if (viewMode === '3d') {
//             animate();
//             return () => {
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//             };
//         }
//     }, [viewMode, animate]);

//     // Memoize buildings data with chunking (for 2D mode)
//     const buildingChunks = useMemo(() => {
//         if (!config?.buildings) return [];
//         return _.chunk(config.buildings, 10);
//     }, [config]);

//     // Load building chunks progressively (for 2D mode)
//     useEffect(() => {
//         if (!buildingChunks.length || viewMode === '3d') return;

//         const loadNextChunk = (chunkIndex) => {
//             if (chunkIndex >= buildingChunks.length) return;

//             setLoadedChunks(prev => {
//                 const newSet = new Set(prev);
//                 newSet.add(chunkIndex);
//                 return newSet;
//             });

//             if (chunkIndex + 1 < buildingChunks.length) {
//                 setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
//             }
//         };

//         loadNextChunk(0);
//     }, [buildingChunks, viewMode]);

//     // Get visible buildings based on loaded chunks (for 2D mode)
//     const visibleBuildings = useMemo(() => {
//         return Array.from(loadedChunks)
//             .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
//     }, [buildingChunks, loadedChunks]);

//     // Initialize canvas context (for 2D mode)
//     useEffect(() => {
//         if (canvasRef.current) {
//             drawingContextRef.current = canvasRef.current.getContext('2d');
//         }
//     }, []);

//     // 2D Mode Functions
//     const isPointInPath = useCallback((x, y, path) => {
//         if (!path?.length || !drawingContextRef.current) return false;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.beginPath();
//         path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });
//         ctx.closePath();

//         return ctx.isPointInPath(x, y);
//     }, []);

//     const handleCanvasHover = useCallback(_.throttle((event) => {
//         if (!canvasRef.current || !visibleBuildings.length) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const hoveredArea = visibleBuildings.find(building =>
//             building.path && isPointInPath(x, y, building.path)
//         );

//         setHoveredBuilding(prev =>
//             hoveredArea?.id === prev?.id ? prev : hoveredArea
//         );
//     }, 50), [visibleBuildings, isPointInPath]);

//     const drawHighlight = useCallback(() => {
//         if (!drawingContextRef.current || !hoveredBuilding?.path) return;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//         ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
//         ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
//         ctx.lineWidth = 2;
//         ctx.beginPath();

//         hoveredBuilding.path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });

//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//     }, [hoveredBuilding]);

//     useEffect(() => {
//         if (viewMode === '2d' && imageRef.current && canvasRef.current) {
//             canvasRef.current.width = imageRef.current.width;
//             canvasRef.current.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config, drawHighlight, viewMode]);

//     const BuildingMarker = useCallback(({ building }) => {
//         const isHovered = hoveredBuilding?.id === building.id;

//         return (
//             <div
//                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                 style={{
//                     top: building.position.top,
//                     left: building.position.left
//                 }}
//             >
//                 <div
//                     className={`w-4 h-4 rounded-full bg-white border-2 transition-all duration-300 cursor-pointer
//                         ${isHovered ? 'border-blue-500 scale-125 shadow-lg' : 'border-gray-700 hover:border-blue-400'}`}
//                     onMouseEnter={() => setHoveredBuilding(building)}
//                 />
//             </div>
//         );
//     }, [hoveredBuilding]);

//     return (
//         <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-screen'}`} ref={containerRef}>
//             {/* View Mode Toggle */}
//             <div className="absolute top-4 left-4 z-20 flex bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
//                 <button
//                     onClick={() => setViewMode('2d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '2d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700 hover:bg-white/20'
//                     }`}
//                 >
//                     <Map size={20} />
//                     2D View
//                 </button>
//                 <button
//                     onClick={() => setViewMode('3d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '3d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700 hover:bg-white/20'
//                     }`}
//                 >
//                     <Box size={20} />
//                     3D View
//                 </button>
//             </div>

//             {/* 2D View */}
//             {viewMode === '2d' && (
//                 <div className="relative w-full h-full">
//                     <img
//                         ref={imageRef}
//                         src={config?.image?.src}
//                         alt="Property Map"
//                         className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         className="absolute top-0 left-0 w-full h-full"
//                         onMouseMove={handleCanvasHover}
//                         onMouseLeave={() => setHoveredBuilding(null)}
//                     />

//                     {visibleBuildings.map(building => (
//                         <BuildingMarker key={building.id} building={building} />
//                     ))}
//                 </div>
//             )}

//             {/* 3D View */}
//             {viewMode === '3d' && (
//                 <div 
//                     ref={threejsContainerRef} 
//                     className="w-full h-full"
//                     style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
//                 />
//             )}

//             {/* Building Info Panel */}
//             {hoveredBuilding && (
//                 <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-80 transform transition-all duration-300 animate-in slide-in-from-left-5">
//                     <div className="border-l-4 border-blue-500 pl-4">
//                         <h3 className="font-bold text-xl text-gray-900 mb-2">
//                             {hoveredBuilding.heading}
//                         </h3>
//                         <p className="text-gray-600 leading-relaxed">
//                             {hoveredBuilding.description}
//                         </p>
                        
//                         {viewMode === '3d' && (
//                             <div className="mt-4 pt-4 border-t border-gray-200">
//                                 <div className="grid grid-cols-2 gap-4 text-sm">
//                                     <div>
//                                         <span className="font-medium text-gray-500">Building ID:</span>
//                                         <p className="text-gray-900">#{hoveredBuilding.id}</p>
//                                     </div>
//                                     <div>
//                                         <span className="font-medium text-gray-500">Type:</span>
//                                         <p className="text-gray-900">Premium</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Fullscreen Toggle */}
//             <button
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 z-20"
//             >
//                 {isFullscreen ? (
//                     <Minimize2 className="w-6 h-6 text-white" />
//                 ) : (
//                     <Maximize2 className="w-6 h-6 text-white" />
//                 )}
//             </button>

//             {/* Loading indicator for 3D mode */}
//             {viewMode === '3d' && !config && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
//                     <div className="text-white text-xl">Loading 3D Model...</div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BuildingViewer;


// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { Maximize2, Minimize2, Box, Map } from 'lucide-react';
// import _ from 'lodash';
// import * as THREE from 'three';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
//     const [config, setConfig] = useState(null);
//     const [loadedChunks, setLoadedChunks] = useState(new Set());

//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const drawingContextRef = useRef(null);
//     const threejsContainerRef = useRef(null);
//     const sceneRef = useRef(null);
//     const rendererRef = useRef(null);
//     const cameraRef = useRef(null);
//     const raycasterRef = useRef(null);
//     const mouseRef = useRef(new THREE.Vector2());
//     const buildingMeshesRef = useRef([]);
//     const frameIdRef = useRef();

//     // Mock data for demonstration - replace with your actual API call
//     const mockConfig = {
//         image: {
//             src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
//         },
//         buildings: [
//             {
//                 id: 1,
//                 heading: "North Tower",
//                 description: "Premium residential complex - $2500 per sqft",
//                 path: [
//                     { x: 0.2, y: 0.15 },
//                     { x: 0.4, y: 0.15 },
//                     { x: 0.4, y: 0.35 },
//                     { x: 0.2, y: 0.35 }
//                 ],
//                 position: { top: "25%", left: "30%" }
//             },
//             {
//                 id: 2,
//                 heading: "South Plaza",
//                 description: "Commercial space - $1800 per sqft",
//                 path: [
//                     { x: 0.6, y: 0.4 },
//                     { x: 0.8, y: 0.4 },
//                     { x: 0.8, y: 0.65 },
//                     { x: 0.6, y: 0.65 }
//                 ],
//                 position: { top: "52.5%", left: "70%" }
//             },
//             {
//                 id: 3,
//                 heading: "East Wing",
//                 description: "Mixed use development - $2200 per sqft",
//                 path: [
//                     { x: 0.15, y: 0.55 },
//                     { x: 0.35, y: 0.55 },
//                     { x: 0.35, y: 0.8 },
//                     { x: 0.15, y: 0.8 }
//                 ],
//                 position: { top: "67.5%", left: "25%" }
//             },
//             {
//                 id: 4,
//                 heading: "Central Court",
//                 description: "Luxury apartments - $3000 per sqft",
//                 path: [
//                     { x: 0.45, y: 0.2 },
//                     { x: 0.65, y: 0.2 },
//                     { x: 0.65, y: 0.35 },
//                     { x: 0.45, y: 0.35 }
//                 ],
//                 position: { top: "27.5%", left: "55%" }
//             }
//         ]
//     };

//     useEffect(() => {
//         setConfig(mockConfig);
//     }, []);

//     // Initialize Three.js scene
//     const initThreeJS = useCallback(() => {
//         if (!threejsContainerRef.current) return;

//         const container = threejsContainerRef.current;
//         const width = container.clientWidth;
//         const height = container.clientHeight;

//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x1a1a1a);
//         sceneRef.current = scene;

//         // Camera
//         const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
//         camera.position.set(0, 15, 25);
//         camera.lookAt(0, 0, 0);
//         cameraRef.current = camera;

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.shadowMap.enabled = true;
//         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         container.appendChild(renderer.domElement);
//         rendererRef.current = renderer;

//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//         directionalLight.position.set(10, 20, 10);
//         directionalLight.castShadow = true;
//         directionalLight.shadow.mapSize.width = 2048;
//         directionalLight.shadow.mapSize.height = 2048;
//         scene.add(directionalLight);

//         // Base plane
//         const planeGeometry = new THREE.PlaneGeometry(30, 20);
//         const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3748 });
//         const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//         plane.rotation.x = -Math.PI / 2;
//         plane.receiveShadow = true;
//         scene.add(plane);

//         // Raycaster for mouse interaction
//         raycasterRef.current = new THREE.Raycaster();

//         // Mouse event handlers
//         const handleMouseMove = (event) => {
//             const rect = container.getBoundingClientRect();
//             mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
//             mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
//         };

//         const handleMouseLeave = () => {
//             setHoveredBuilding(null);
//         };

//         container.addEventListener('mousemove', handleMouseMove);
//         container.addEventListener('mouseleave', handleMouseLeave);

//         return () => {
//             container.removeEventListener('mousemove', handleMouseMove);
//             container.removeEventListener('mouseleave', handleMouseLeave);
//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//             renderer.dispose();
//         };
//     }, []);

//     // Create 3D building blocks
//     const createBuildingBlocks = useCallback(() => {
//         if (!config?.buildings || !sceneRef.current) return;

//         // Clear existing meshes
//         buildingMeshesRef.current.forEach(mesh => {
//             sceneRef.current.remove(mesh);
//         });
//         buildingMeshesRef.current = [];

//         config.buildings.forEach((building, index) => {
//             if (!building.path || building.path.length < 3) return;

//             // Create shape from path
//             const shape = new THREE.Shape();
//             building.path.forEach((point, i) => {
//                 const x = (point.x - 0.5) * 30; // Scale to scene
//                 const z = (point.y - 0.5) * -20; // Flip Y and scale
//                 if (i === 0) {
//                     shape.moveTo(x, z);
//                 } else {
//                     shape.lineTo(x, z);
//                 }
//             });

//             // Extrude the shape
//             const extrudeSettings = {
//                 depth: 2 + Math.random() * 4, // Random height between 2-6
//                 bevelEnabled: true,
//                 bevelSegments: 2,
//                 steps: 1,
//                 bevelSize: 0.1,
//                 bevelThickness: 0.1
//             };

//             const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
//             // Create gradient material
//             const hue = (index * 137.5) % 360; // Golden angle spacing
//             const color = new THREE.Color().setHSL(hue / 360, 0.7, 0.5);
            
//             const material = new THREE.MeshPhongMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.8,
//                 shininess: 100
//             });

//             const mesh = new THREE.Mesh(geometry, material);
//             mesh.position.y = extrudeSettings.depth / 2;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             mesh.userData = { building, originalColor: color.clone() };

//             sceneRef.current.add(mesh);
//             buildingMeshesRef.current.push(mesh);
//         });
//     }, [config]);

//     // Animation loop
//     const animate = useCallback(() => {
//         if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

//         // Raycasting for hover effects
//         if (raycasterRef.current && buildingMeshesRef.current.length > 0) {
//             raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
//             const intersects = raycasterRef.current.intersectObjects(buildingMeshesRef.current);

//             // Reset all building colors
//             buildingMeshesRef.current.forEach(mesh => {
//                 mesh.material.color.copy(mesh.userData.originalColor);
//                 mesh.material.opacity = 0.8;
//                 mesh.scale.set(1, 1, 1);
//             });

//             if (intersects.length > 0) {
//                 const intersectedMesh = intersects[0].object;
//                 intersectedMesh.material.color.setHex(0xffffff);
//                 intersectedMesh.material.opacity = 1.0;
//                 intersectedMesh.scale.set(1.05, 1.1, 1.05);
                
//                 const building = intersectedMesh.userData.building;
//                 if (hoveredBuilding?.id !== building.id) {
//                     setHoveredBuilding(building);
//                 }
//             } else {
//                 if (hoveredBuilding) {
//                     setHoveredBuilding(null);
//                 }
//             }
//         }

//         // Rotate camera around the scene
//         const time = Date.now() * 0.0005;
//         if (cameraRef.current) {
//             cameraRef.current.position.x = Math.cos(time) * 25;
//             cameraRef.current.position.z = Math.sin(time) * 25;
//             cameraRef.current.lookAt(0, 2, 0);
//         }

//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//         frameIdRef.current = requestAnimationFrame(animate);
//     }, [hoveredBuilding]);

//     // Handle window resize
//     const handleResize = useCallback(() => {
//         if (!threejsContainerRef.current || !rendererRef.current || !cameraRef.current) return;

//         const width = threejsContainerRef.current.clientWidth;
//         const height = threejsContainerRef.current.clientHeight;

//         cameraRef.current.aspect = width / height;
//         cameraRef.current.updateProjectionMatrix();
//         rendererRef.current.setSize(width, height);
//     }, []);

//     // Initialize 3D scene
//     useEffect(() => {
//         if (viewMode === '3d') {
//             const cleanup = initThreeJS();
//             window.addEventListener('resize', handleResize);

//             return () => {
//                 window.removeEventListener('resize', handleResize);
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//                 cleanup?.();
//             };
//         }
//     }, [viewMode, initThreeJS, handleResize]);

//     // Create building blocks when config changes
//     useEffect(() => {
//         if (viewMode === '3d') {
//             createBuildingBlocks();
//         }
//     }, [config, viewMode, createBuildingBlocks]);

//     // Start animation loop
//     useEffect(() => {
//         if (viewMode === '3d') {
//             animate();
//             return () => {
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//             };
//         }
//     }, [viewMode, animate]);

//     // Memoize buildings data with chunking (for 2D mode)
//     const buildingChunks = useMemo(() => {
//         if (!config?.buildings) return [];
//         return _.chunk(config.buildings, 10);
//     }, [config]);

//     // Load building chunks progressively (for 2D mode)
//     useEffect(() => {
//         if (!buildingChunks.length || viewMode === '3d') return;

//         const loadNextChunk = (chunkIndex) => {
//             if (chunkIndex >= buildingChunks.length) return;

//             setLoadedChunks(prev => {
//                 const newSet = new Set(prev);
//                 newSet.add(chunkIndex);
//                 return newSet;
//             });

//             if (chunkIndex + 1 < buildingChunks.length) {
//                 setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
//             }
//         };

//         loadNextChunk(0);
//     }, [buildingChunks, viewMode]);

//     // Get visible buildings based on loaded chunks (for 2D mode)
//     const visibleBuildings = useMemo(() => {
//         return Array.from(loadedChunks)
//             .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
//     }, [buildingChunks, loadedChunks]);

//     // Initialize canvas context (for 2D mode)
//     useEffect(() => {
//         if (canvasRef.current) {
//             drawingContextRef.current = canvasRef.current.getContext('2d');
//         }
//     }, []);

//     // 2D Mode Functions
//     const isPointInPath = useCallback((x, y, path) => {
//         if (!path?.length || !drawingContextRef.current) return false;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.beginPath();
//         path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });
//         ctx.closePath();

//         return ctx.isPointInPath(x, y);
//     }, []);

//     const handleCanvasHover = useCallback(_.throttle((event) => {
//         if (!canvasRef.current || !visibleBuildings.length) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const hoveredArea = visibleBuildings.find(building =>
//             building.path && isPointInPath(x, y, building.path)
//         );

//         setHoveredBuilding(prev =>
//             hoveredArea?.id === prev?.id ? prev : hoveredArea
//         );
//     }, 50), [visibleBuildings, isPointInPath]);

//     const drawHighlight = useCallback(() => {
//         if (!drawingContextRef.current || !hoveredBuilding?.path) return;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//         ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
//         ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
//         ctx.lineWidth = 2;
//         ctx.beginPath();

//         hoveredBuilding.path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });

//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//     }, [hoveredBuilding]);

//     useEffect(() => {
//         if (viewMode === '2d' && imageRef.current && canvasRef.current) {
//             canvasRef.current.width = imageRef.current.width;
//             canvasRef.current.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config, drawHighlight, viewMode]);

//     const BuildingMarker = useCallback(({ building }) => {
//         const isHovered = hoveredBuilding?.id === building.id;

//         return (
//             <div
//                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                 style={{
//                     top: building.position.top,
//                     left: building.position.left
//                 }}
//             >
//                 <div
//                     className={`w-4 h-4 rounded-full bg-white border-2 transition-all duration-300 cursor-pointer
//                         ${isHovered ? 'border-blue-500 scale-125 shadow-lg' : 'border-gray-700 hover:border-blue-400'}`}
//                     onMouseEnter={() => setHoveredBuilding(building)}
//                 />
//             </div>
//         );
//     }, [hoveredBuilding]);

//     return (
//         <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-screen'}`} ref={containerRef}>
//             {/* View Mode Toggle */}
//             <div className="absolute top-4 left-4 z-20 flex bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
//                 <button
//                     onClick={() => setViewMode('2d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '2d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700 hover:bg-white/20'
//                     }`}
//                 >
//                     <Map size={20} />
//                     2D View
//                 </button>
//                 <button
//                     onClick={() => setViewMode('3d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '3d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700 hover:bg-white/20'
//                     }`}
//                 >
//                     <Box size={20} />
//                     3D View
//                 </button>
//             </div>

//             {/* 2D View */}
//             {viewMode === '2d' && (
//                 <div className="relative w-full h-full">
//                     <img
//                         ref={imageRef}
//                         src={config?.image?.src}
//                         alt="Property Map"
//                         className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         className="absolute top-0 left-0 w-full h-full"
//                         onMouseMove={handleCanvasHover}
//                         onMouseLeave={() => setHoveredBuilding(null)}
//                     />

//                     {visibleBuildings.map(building => (
//                         <BuildingMarker key={building.id} building={building} />
//                     ))}
//                 </div>
//             )}

//             {/* 3D View */}
//             {viewMode === '3d' && (
//                 <div 
//                     ref={threejsContainerRef} 
//                     className="w-full h-full"
//                     style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
//                 />
//             )}

//             {/* Building Info Panel */}
//             {hoveredBuilding && (
//                 <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-80 transform transition-all duration-300 animate-in slide-in-from-left-5">
//                     <div className="border-l-4 border-blue-500 pl-4">
//                         <h3 className="font-bold text-xl text-gray-900 mb-2">
//                             {hoveredBuilding.heading}
//                         </h3>
//                         <p className="text-gray-600 leading-relaxed">
//                             {hoveredBuilding.description}
//                         </p>
                        
//                         {viewMode === '3d' && (
//                             <div className="mt-4 pt-4 border-t border-gray-200">
//                                 <div className="grid grid-cols-2 gap-4 text-sm">
//                                     <div>
//                                         <span className="font-medium text-gray-500">Building ID:</span>
//                                         <p className="text-gray-900">#{hoveredBuilding.id}</p>
//                                     </div>
//                                     <div>
//                                         <span className="font-medium text-gray-500">Type:</span>
//                                         <p className="text-gray-900">Premium</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Fullscreen Toggle */}
//             <button
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 z-20"
//             >
//                 {isFullscreen ? (
//                     <Minimize2 className="w-6 h-6 text-white" />
//                 ) : (
//                     <Maximize2 className="w-6 h-6 text-white" />
//                 )}
//             </button>

//             {/* Loading indicator */}
//             {!config && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-40">
//                     <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
//                         <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
//                         <div className="text-white text-xl">Loading Property Data...</div>
//                         <div className="text-white/70 text-sm mt-2">Fetching land parcels and boundaries</div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BuildingViewer;


// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { Maximize2, Minimize2, Box, Map } from 'lucide-react';
// import _ from 'lodash';
// import * as THREE from 'three';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
//     const [config, setConfig] = useState(null);
//     const [loadedChunks, setLoadedChunks] = useState(new Set());

//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const drawingContextRef = useRef(null);
//     const threejsContainerRef = useRef(null);
//     const sceneRef = useRef(null);
//     const rendererRef = useRef(null);
//     const cameraRef = useRef(null);
//     const raycasterRef = useRef(null);
//     const mouseRef = useRef(new THREE.Vector2());
//     const buildingMeshesRef = useRef([]);
//     const frameIdRef = useRef();

//     // Mock data for demonstration - replace with your actual API call
//     const mockConfig = {
//         image: {
//             src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
//         },
//         buildings: [
//             {
//                 id: 1,
//                 heading: "North Tower",
//                 description: "Premium residential complex - $2500 per sqft",
//                 path: [
//                     { x: 0.2, y: 0.15 },
//                     { x: 0.4, y: 0.15 },
//                     { x: 0.4, y: 0.35 },
//                     { x: 0.2, y: 0.35 }
//                 ],
//                 position: { top: "25%", left: "30%" }
//             },
//             {
//                 id: 2,
//                 heading: "South Plaza",
//                 description: "Commercial space - $1800 per sqft",
//                 path: [
//                     { x: 0.6, y: 0.4 },
//                     { x: 0.8, y: 0.4 },
//                     { x: 0.8, y: 0.65 },
//                     { x: 0.6, y: 0.65 }
//                 ],
//                 position: { top: "52.5%", left: "70%" }
//             },
//             {
//                 id: 3,
//                 heading: "East Wing",
//                 description: "Mixed use development - $2200 per sqft",
//                 path: [
//                     { x: 0.15, y: 0.55 },
//                     { x: 0.35, y: 0.55 },
//                     { x: 0.35, y: 0.8 },
//                     { x: 0.15, y: 0.8 }
//                 ],
//                 position: { top: "67.5%", left: "25%" }
//             },
//             {
//                 id: 4,
//                 heading: "Central Court",
//                 description: "Luxury apartments - $3000 per sqft",
//                 path: [
//                     { x: 0.45, y: 0.2 },
//                     { x: 0.65, y: 0.2 },
//                     { x: 0.65, y: 0.35 },
//                     { x: 0.45, y: 0.35 }
//                 ],
//                 position: { top: "27.5%", left: "55%" }
//             }
//         ]
//     };

//     useEffect(() => {
//         setConfig(mockConfig);
//     }, []);

//     // Initialize Three.js scene
//     const initThreeJS = useCallback(() => {
//         if (!threejsContainerRef.current) return;

//         const container = threejsContainerRef.current;
//         const width = container.clientWidth;
//         const height = container.clientHeight;

//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x1a1a1a);
//         sceneRef.current = scene;

//         // Camera
//         const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
//         camera.position.set(0, 15, 25);
//         camera.lookAt(0, 0, 0);
//         cameraRef.current = camera;

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.shadowMap.enabled = true;
//         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         container.appendChild(renderer.domElement);
//         rendererRef.current = renderer;

//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//         directionalLight.position.set(10, 20, 10);
//         directionalLight.castShadow = true;
//         directionalLight.shadow.mapSize.width = 2048;
//         directionalLight.shadow.mapSize.height = 2048;
//         scene.add(directionalLight);

//         // Base plane
//         const planeGeometry = new THREE.PlaneGeometry(30, 20);
//         const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3748 });
//         const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//         plane.rotation.x = -Math.PI / 2;
//         plane.receiveShadow = true;
//         scene.add(plane);

//         // Raycaster for mouse interaction
//         raycasterRef.current = new THREE.Raycaster();

//         // Mouse event handlers
//         const handleMouseMove = (event) => {
//             const rect = container.getBoundingClientRect();
//             mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
//             mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
//         };

//         const handleMouseLeave = () => {
//             setHoveredBuilding(null);
//         };

//         container.addEventListener('mousemove', handleMouseMove);
//         container.addEventListener('mouseleave', handleMouseLeave);

//         return () => {
//             container.removeEventListener('mousemove', handleMouseMove);
//             container.removeEventListener('mouseleave', handleMouseLeave);
//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//             renderer.dispose();
//         };
//     }, []);

//     // Create 3D building blocks
//     const createBuildingBlocks = useCallback(() => {
//         if (!config?.buildings || !sceneRef.current) return;

//         // Clear existing meshes
//         buildingMeshesRef.current.forEach(mesh => {
//             sceneRef.current.remove(mesh);
//         });
//         buildingMeshesRef.current = [];

//         config.buildings.forEach((building, index) => {
//             if (!building.path || building.path.length < 3) return;

//             // Create shape from path
//             const shape = new THREE.Shape();
//             building.path.forEach((point, i) => {
//                 const x = (point.x - 0.5) * 30; // Scale to scene
//                 const z = (point.y - 0.5) * -20; // Flip Y and scale
//                 if (i === 0) {
//                     shape.moveTo(x, z);
//                 } else {
//                     shape.lineTo(x, z);
//                 }
//             });

//             // Extrude the shape
//             const extrudeSettings = {
//                 depth: 2 + Math.random() * 4, // Random height between 2-6
//                 bevelEnabled: true,
//                 bevelSegments: 2,
//                 steps: 1,
//                 bevelSize: 0.1,
//                 bevelThickness: 0.1
//             };

//             const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
//             // Create gradient material
//             const hue = (index * 137.5) % 360; // Golden angle spacing
//             const color = new THREE.Color().setHSL(hue / 360, 0.7, 0.5);
            
//             const material = new THREE.MeshPhongMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.8,
//                 shininess: 100
//             });

//             const mesh = new THREE.Mesh(geometry, material);
//             mesh.position.y = extrudeSettings.depth / 2;
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//             mesh.userData = { building, originalColor: color.clone() };

//             sceneRef.current.add(mesh);
//             buildingMeshesRef.current.push(mesh);
//         });
//     }, [config]);

//     // Animation loop
//     const animate = useCallback(() => {
//         if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

//         // Raycasting for hover effects
//         if (raycasterRef.current && buildingMeshesRef.current.length > 0) {
//             raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
//             const intersects = raycasterRef.current.intersectObjects(buildingMeshesRef.current);

//             // Reset all building colors
//             buildingMeshesRef.current.forEach(mesh => {
//                 mesh.material.color.copy(mesh.userData.originalColor);
//                 mesh.material.opacity = 0.8;
//                 mesh.scale.set(1, 1, 1);
//             });

//             if (intersects.length > 0) {
//                 const intersectedMesh = intersects[0].object;
//                 intersectedMesh.material.color.setHex(0xffffff);
//                 intersectedMesh.material.opacity = 1.0;
//                 intersectedMesh.scale.set(1.05, 1.1, 1.05);
                
//                 const building = intersectedMesh.userData.building;
//                 if (hoveredBuilding?.id !== building.id) {
//                     setHoveredBuilding(building);
//                 }
//             } else {
//                 if (hoveredBuilding) {
//                     setHoveredBuilding(null);
//                 }
//             }
//         }

//         // Rotate camera around the scene
//         const time = Date.now() * 0.0005;
//         if (cameraRef.current) {
//             cameraRef.current.position.x = Math.cos(time) * 25;
//             cameraRef.current.position.z = Math.sin(time) * 25;
//             cameraRef.current.lookAt(0, 2, 0);
//         }

//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//         frameIdRef.current = requestAnimationFrame(animate);
//     }, [hoveredBuilding]);

//     // Handle window resize
//     const handleResize = useCallback(() => {
//         if (!threejsContainerRef.current || !rendererRef.current || !cameraRef.current) return;

//         const width = threejsContainerRef.current.clientWidth;
//         const height = threejsContainerRef.current.clientHeight;

//         cameraRef.current.aspect = width / height;
//         cameraRef.current.updateProjectionMatrix();
//         rendererRef.current.setSize(width, height);
//     }, []);

//     // Initialize 3D scene
//     useEffect(() => {
//         if (viewMode === '3d') {
//             const cleanup = initThreeJS();
//             window.addEventListener('resize', handleResize);

//             return () => {
//                 window.removeEventListener('resize', handleResize);
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//                 cleanup?.();
//             };
//         }
//     }, [viewMode, initThreeJS, handleResize]);

//     // Create building blocks when config changes
//     useEffect(() => {
//         if (viewMode === '3d') {
//             createBuildingBlocks();
//         }
//     }, [config, viewMode, createBuildingBlocks]);

//     // Start animation loop
//     useEffect(() => {
//         if (viewMode === '3d') {
//             animate();
//             return () => {
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//             };
//         }
//     }, [viewMode, animate]);

//     // Memoize buildings data with chunking (for 2D mode)
//     const buildingChunks = useMemo(() => {
//         if (!config?.buildings) return [];
//         return _.chunk(config.buildings, 10);
//     }, [config]);

//     // Load building chunks progressively (for 2D mode)
//     useEffect(() => {
//         if (!buildingChunks.length || viewMode === '3d') return;

//         const loadNextChunk = (chunkIndex) => {
//             if (chunkIndex >= buildingChunks.length) return;

//             setLoadedChunks(prev => {
//                 const newSet = new Set(prev);
//                 newSet.add(chunkIndex);
//                 return newSet;
//             });

//             if (chunkIndex + 1 < buildingChunks.length) {
//                 setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
//             }
//         };

//         loadNextChunk(0);
//     }, [buildingChunks, viewMode]);

//     // Get visible buildings based on loaded chunks (for 2D mode)
//     const visibleBuildings = useMemo(() => {
//         return Array.from(loadedChunks)
//             .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
//     }, [buildingChunks, loadedChunks]);

//     // Initialize canvas context (for 2D mode)
//     useEffect(() => {
//         if (canvasRef.current) {
//             drawingContextRef.current = canvasRef.current.getContext('2d');
//         }
//     }, []);

//     // 2D Mode Functions
//     const isPointInPath = useCallback((x, y, path) => {
//         if (!path?.length || !drawingContextRef.current) return false;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.beginPath();
//         path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });
//         ctx.closePath();

//         return ctx.isPointInPath(x, y);
//     }, []);

//     const handleCanvasHover = useCallback(_.throttle((event) => {
//         if (!canvasRef.current || !visibleBuildings.length) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const hoveredArea = visibleBuildings.find(building =>
//             building.path && isPointInPath(x, y, building.path)
//         );

//         setHoveredBuilding(prev =>
//             hoveredArea?.id === prev?.id ? prev : hoveredArea
//         );
//     }, 50), [visibleBuildings, isPointInPath]);

//     const drawHighlight = useCallback(() => {
//         if (!drawingContextRef.current || !hoveredBuilding?.path) return;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//         ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
//         ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
//         ctx.lineWidth = 2;
//         ctx.beginPath();

//         hoveredBuilding.path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });

//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//     }, [hoveredBuilding]);

//     useEffect(() => {
//         if (viewMode === '2d' && imageRef.current && canvasRef.current) {
//             canvasRef.current.width = imageRef.current.width;
//             canvasRef.current.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config, drawHighlight, viewMode]);

//     const BuildingMarker = useCallback(({ building }) => {
//         const isHovered = hoveredBuilding?.id === building.id;

//         return (
//             <div
//                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                 style={{
//                     top: building.position.top,
//                     left: building.position.left
//                 }}
//             >
//                 <div
//                     className={`w-4 h-4 rounded-full bg-white border-2 transition-all duration-300 cursor-pointer
//                         ${isHovered ? 'border-blue-500 scale-125 shadow-lg' : 'border-gray-700 hover:border-blue-400'}`}
//                     onMouseEnter={() => setHoveredBuilding(building)}
//                 />
//             </div>
//         );
//     }, [hoveredBuilding]);

//     return (
//         <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-screen'}`} ref={containerRef}>
//             {/* View Mode Toggle */}
//             <div className="absolute top-4 left-4 z-20 flex bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
//                 <button
//                     onClick={() => setViewMode('2d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '2d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700 hover:bg-white/20'
//                     }`}
//                 >
//                     <Map size={20} />
//                     2D View
//                 </button>
//                 <button
//                     onClick={() => setViewMode('3d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '3d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700 hover:bg-white/20'
//                     }`}
//                 >
//                     <Box size={20} />
//                     3D View
//                 </button>
//             </div>

//             {/* 2D View */}
//             {viewMode === '2d' && (
//                 <div className="relative w-full h-full">
//                     <img
//                         ref={imageRef}
//                         src={config?.image?.src}
//                         alt="Property Map"
//                         className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         className="absolute top-0 left-0 w-full h-full"
//                         onMouseMove={handleCanvasHover}
//                         onMouseLeave={() => setHoveredBuilding(null)}
//                     />

//                     {visibleBuildings.map(building => (
//                         <BuildingMarker key={building.id} building={building} />
//                     ))}
//                 </div>
//             )}

//             {/* 3D View */}
//             {viewMode === '3d' && (
//                 <div 
//                     ref={threejsContainerRef} 
//                     className="w-full h-full"
//                     style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
//                 />
//             )}

//             {/* Building Info Panel */}
//             {hoveredBuilding && (
//                 <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-80 transform transition-all duration-300 animate-in slide-in-from-left-5">
//                     <div className="border-l-4 border-blue-500 pl-4">
//                         <h3 className="font-bold text-xl text-gray-900 mb-2">
//                             {hoveredBuilding.heading}
//                         </h3>
//                         <p className="text-gray-600 leading-relaxed">
//                             {hoveredBuilding.description}
//                         </p>
                        
//                         {viewMode === '3d' && (
//                             <div className="mt-4 pt-4 border-t border-gray-200">
//                                 <div className="grid grid-cols-2 gap-4 text-sm">
//                                     <div>
//                                         <span className="font-medium text-gray-500">Building ID:</span>
//                                         <p className="text-gray-900">#{hoveredBuilding.id}</p>
//                                     </div>
//                                     <div>
//                                         <span className="font-medium text-gray-500">Type:</span>
//                                         <p className="text-gray-900">Premium</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Fullscreen Toggle */}
//             <button
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 z-20"
//             >
//                 {isFullscreen ? (
//                     <Minimize2 className="w-6 h-6 text-white" />
//                 ) : (
//                     <Maximize2 className="w-6 h-6 text-white" />
//                 )}
//             </button>

//             {/* Loading indicator */}
//             {!config && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-40">
//                     <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
//                         <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
//                         <div className="text-white text-xl">Loading Property Data...</div>
//                         <div className="text-white/70 text-sm mt-2">Fetching land parcels and boundaries</div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BuildingViewer;

// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { Maximize2, Minimize2, Box, Map } from 'lucide-react';
// import _ from 'lodash';
// import * as THREE from 'three';

// const BuildingViewer = () => {
//     const [hoveredBuilding, setHoveredBuilding] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
//     const [config, setConfig] = useState(null);
//     const [loadedChunks, setLoadedChunks] = useState(new Set());

//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const containerRef = useRef(null);
//     const drawingContextRef = useRef(null);
//     const threejsContainerRef = useRef(null);
//     const sceneRef = useRef(null);
//     const rendererRef = useRef(null);
//     const cameraRef = useRef(null);
//     const raycasterRef = useRef(null);
//     const mouseRef = useRef(new THREE.Vector2());
//     const buildingMeshesRef = useRef([]);
//     const frameIdRef = useRef();
//     const animationMixersRef = useRef([]);

//     // Mock data for demonstration - replace with your actual API call
//     const mockConfig = {
//         image: {
//             src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
//         },
//         buildings: [
//             {
//                 id: 1,
//                 heading: "North Tower",
//                 description: "Premium residential complex - $2500 per sqft",
//                 path: [
//                     { x: 0.2, y: 0.15 },
//                     { x: 0.4, y: 0.15 },
//                     { x: 0.4, y: 0.35 },
//                     { x: 0.2, y: 0.35 }
//                 ],
//                 position: { top: "25%", left: "30%" },
//                 height: 8
//             },
//             {
//                 id: 2,
//                 heading: "South Plaza",
//                 description: "Commercial space - $1800 per sqft",
//                 path: [
//                     { x: 0.6, y: 0.4 },
//                     { x: 0.8, y: 0.4 },
//                     { x: 0.8, y: 0.65 },
//                     { x: 0.6, y: 0.65 }
//                 ],
//                 position: { top: "52.5%", left: "70%" },
//                 height: 6
//             },
//             {
//                 id: 3,
//                 heading: "East Wing",
//                 description: "Mixed use development - $2200 per sqft",
//                 path: [
//                     { x: 0.15, y: 0.55 },
//                     { x: 0.35, y: 0.55 },
//                     { x: 0.35, y: 0.8 },
//                     { x: 0.15, y: 0.8 }
//                 ],
//                 position: { top: "67.5%", left: "25%" },
//                 height: 10
//             },
//             {
//                 id: 4,
//                 heading: "Central Court",
//                 description: "Luxury apartments - $3000 per sqft",
//                 path: [
//                     { x: 0.45, y: 0.2 },
//                     { x: 0.65, y: 0.2 },
//                     { x: 0.65, y: 0.35 },
//                     { x: 0.45, y: 0.35 }
//                 ],
//                 position: { top: "27.5%", left: "55%" },
//                 height: 12
//             }
//         ]
//     };

//     useEffect(() => {
//         setConfig(mockConfig);
//     }, []);

//     // Initialize Three.js scene
//     const initThreeJS = useCallback(() => {
//         if (!threejsContainerRef.current) return;

//         const container = threejsContainerRef.current;
//         const width = container.clientWidth;
//         const height = container.clientHeight;

//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x1a1a1a);
//         sceneRef.current = scene;

//         // Camera
//         const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
//         camera.position.set(0, 20, 30);
//         camera.lookAt(0, 0, 0);
//         cameraRef.current = camera;

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.shadowMap.enabled = true;
//         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         container.appendChild(renderer.domElement);
//         rendererRef.current = renderer;

//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
//         directionalLight.position.set(15, 25, 10);
//         directionalLight.castShadow = true;
//         directionalLight.shadow.mapSize.width = 2048;
//         directionalLight.shadow.mapSize.height = 2048;
//         directionalLight.shadow.camera.near = 0.1;
//         directionalLight.shadow.camera.far = 50;
//         directionalLight.shadow.camera.left = -20;
//         directionalLight.shadow.camera.right = 20;
//         directionalLight.shadow.camera.top = 20;
//         directionalLight.shadow.camera.bottom = -20;
//         scene.add(directionalLight);

//         // Base plane
//         const planeGeometry = new THREE.PlaneGeometry(35, 25);
//         const planeMaterial = new THREE.MeshLambertMaterial({ 
//             color: 0x2d3748,
//             transparent: true,
//             opacity: 0.8
//         });
//         const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//         plane.rotation.x = -Math.PI / 2;
//         plane.receiveShadow = true;
//         scene.add(plane);

//         // Grid helper for reference
//         const gridHelper = new THREE.GridHelper(35, 35, 0x444444, 0x333333);
//         gridHelper.position.y = 0.01;
//         scene.add(gridHelper);

//         // Raycaster for mouse interaction
//         raycasterRef.current = new THREE.Raycaster();

//         // Mouse event handlers
//         const handleMouseMove = (event) => {
//             const rect = container.getBoundingClientRect();
//             mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
//             mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
//         };

//         const handleMouseLeave = () => {
//             setHoveredBuilding(null);
//         };

//         container.addEventListener('mousemove', handleMouseMove);
//         container.addEventListener('mouseleave', handleMouseLeave);

//         return () => {
//             container.removeEventListener('mousemove', handleMouseMove);
//             container.removeEventListener('mouseleave', handleMouseLeave);
//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//             renderer.dispose();
//         };
//     }, []);

//     // Animate building height
//     const animateBuildingHeight = useCallback((mesh, targetHeight, duration = 800) => {
//         if (!mesh) return;

//         const startHeight = mesh.scale.y;
//         const startY = mesh.position.y;
//         const targetY = targetHeight / 2;
        
//         const startTime = Date.now();

//         const animate = () => {
//             const elapsed = Date.now() - startTime;
//             const progress = Math.min(elapsed / duration, 1);
            
//             // Easing function for smooth animation
//             const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
//             const currentHeight = startHeight + (targetHeight - startHeight) * easeOutCubic;
//             const currentY = startY + (targetY - startY) * easeOutCubic;
            
//             mesh.scale.y = currentHeight;
//             mesh.position.y = currentY;

//             if (progress < 1) {
//                 requestAnimationFrame(animate);
//             }
//         };

//         requestAnimationFrame(animate);
//     }, []);

//     // Create 3D building blocks
//     const createBuildingBlocks = useCallback(() => {
//         if (!config?.buildings || !sceneRef.current) return;

//         // Clear existing meshes
//         buildingMeshesRef.current.forEach(mesh => {
//             sceneRef.current.remove(mesh);
//         });
//         buildingMeshesRef.current = [];

//         config.buildings.forEach((building, index) => {
//             if (!building.path || building.path.length < 3) return;

//             // Create shape from path
//             const shape = new THREE.Shape();
//             building.path.forEach((point, i) => {
//                 const x = (point.x - 0.5) * 30; // Scale to scene
//                 const z = (point.y - 0.5) * -20; // Flip Y and scale
//                 if (i === 0) {
//                     shape.moveTo(x, z);
//                 } else {
//                     shape.lineTo(x, z);
//                 }
//             });

//             // Extrude the shape with minimal initial height
//             const extrudeSettings = {
//                 depth: 0.2, // Start very flat
//                 bevelEnabled: true,
//                 bevelSegments: 2,
//                 steps: 1,
//                 bevelSize: 0.05,
//                 bevelThickness: 0.05
//             };

//             const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
//             // Create gradient material based on building type
//             const hue = (index * 137.5) % 360; // Golden angle spacing
//             const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
            
//             const material = new THREE.MeshPhongMaterial({
//                 color: color,
//                 transparent: true,
//                 opacity: 0.9,
//                 shininess: 80,
//                 specular: 0x222222
//             });

//             const mesh = new THREE.Mesh(geometry, material);
            
//             // Position the building flat on the ground initially
//             mesh.position.y = 0.1; // Just slightly above ground
//             mesh.scale.y = 1; // Normal scale initially
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
            
//             // Store building data and target height
//             mesh.userData = { 
//                 building, 
//                 originalColor: color.clone(),
//                 targetHeight: building.height || (3 + Math.random() * 5),
//                 isAnimating: false
//             };

//             sceneRef.current.add(mesh);
//             buildingMeshesRef.current.push(mesh);
//         });
//     }, [config]);

//     // Animation loop
//     const animate = useCallback(() => {
//         if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

//         // Raycasting for hover effects
//         if (raycasterRef.current && buildingMeshesRef.current.length > 0) {
//             raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
//             const intersects = raycasterRef.current.intersectObjects(buildingMeshesRef.current);

//             let newHoveredBuilding = null;

//             if (intersects.length > 0) {
//                 const intersectedMesh = intersects[0].object;
//                 const building = intersectedMesh.userData.building;
//                 newHoveredBuilding = building;

//                 // Animate building to full height on hover
//                 if (!intersectedMesh.userData.isAnimating) {
//                     intersectedMesh.userData.isAnimating = true;
//                     animateBuildingHeight(intersectedMesh, intersectedMesh.userData.targetHeight);
                    
//                     // Enhance material on hover
//                     intersectedMesh.material.color.setHex(0xffffff);
//                     intersectedMesh.material.emissive.setHex(0x222222);
//                 }
//             }

//             // Reset non-hovered buildings
//             buildingMeshesRef.current.forEach(mesh => {
//                 const isCurrentlyHovered = intersects.length > 0 && intersects[0].object === mesh;
                
//                 if (!isCurrentlyHovered) {
//                     // Reset color
//                     mesh.material.color.copy(mesh.userData.originalColor);
//                     mesh.material.emissive.setHex(0x000000);
                    
//                     // Animate back to flat if not currently hovered
//                     if (mesh.userData.isAnimating || mesh.scale.y > 1.1) {
//                         mesh.userData.isAnimating = true;
//                         animateBuildingHeight(mesh, 0.2); // Back to flat
//                         setTimeout(() => {
//                             mesh.userData.isAnimating = false;
//                         }, 800);
//                     }
//                 }
//             });

//             // Update hovered building state
//             if (newHoveredBuilding?.id !== hoveredBuilding?.id) {
//                 setHoveredBuilding(newHoveredBuilding);
//             }
//         }

//         // Subtle camera rotation
//         const time = Date.now() * 0.0003;
//         if (cameraRef.current) {
//             cameraRef.current.position.x = Math.cos(time) * 30;
//             cameraRef.current.position.z = Math.sin(time) * 30;
//             cameraRef.current.lookAt(0, 3, 0);
//         }

//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//         frameIdRef.current = requestAnimationFrame(animate);
//     }, [hoveredBuilding, animateBuildingHeight]);

//     // Handle window resize
//     const handleResize = useCallback(() => {
//         if (!threejsContainerRef.current || !rendererRef.current || !cameraRef.current) return;

//         const width = threejsContainerRef.current.clientWidth;
//         const height = threejsContainerRef.current.clientHeight;

//         cameraRef.current.aspect = width / height;
//         cameraRef.current.updateProjectionMatrix();
//         rendererRef.current.setSize(width, height);
//     }, []);

//     // Initialize 3D scene
//     useEffect(() => {
//         if (viewMode === '3d') {
//             const cleanup = initThreeJS();
//             window.addEventListener('resize', handleResize);

//             return () => {
//                 window.removeEventListener('resize', handleResize);
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//                 cleanup?.();
//             };
//         }
//     }, [viewMode, initThreeJS, handleResize]);

//     // Create building blocks when config changes
//     useEffect(() => {
//         if (viewMode === '3d') {
//             createBuildingBlocks();
//         }
//     }, [config, viewMode, createBuildingBlocks]);

//     // Start animation loop
//     useEffect(() => {
//         if (viewMode === '3d') {
//             animate();
//             return () => {
//                 if (frameIdRef.current) {
//                     cancelAnimationFrame(frameIdRef.current);
//                 }
//             };
//         }
//     }, [viewMode, animate]);

//     // Memoize buildings data with chunking (for 2D mode)
//     const buildingChunks = useMemo(() => {
//         if (!config?.buildings) return [];
//         return _.chunk(config.buildings, 10);
//     }, [config]);

//     // Load building chunks progressively (for 2D mode)
//     useEffect(() => {
//         if (!buildingChunks.length || viewMode === '3d') return;

//         const loadNextChunk = (chunkIndex) => {
//             if (chunkIndex >= buildingChunks.length) return;

//             setLoadedChunks(prev => {
//                 const newSet = new Set(prev);
//                 newSet.add(chunkIndex);
//                 return newSet;
//             });

//             if (chunkIndex + 1 < buildingChunks.length) {
//                 setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
//             }
//         };

//         loadNextChunk(0);
//     }, [buildingChunks, viewMode]);

//     // Get visible buildings based on loaded chunks (for 2D mode)
//     const visibleBuildings = useMemo(() => {
//         return Array.from(loadedChunks)
//             .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
//     }, [buildingChunks, loadedChunks]);

//     // Initialize canvas context (for 2D mode)
//     useEffect(() => {
//         if (canvasRef.current) {
//             drawingContextRef.current = canvasRef.current.getContext('2d');
//         }
//     }, []);

//     // 2D Mode Functions
//     const isPointInPath = useCallback((x, y, path) => {
//         if (!path?.length || !drawingContextRef.current) return false;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.beginPath();
//         path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });
//         ctx.closePath();

//         return ctx.isPointInPath(x, y);
//     }, []);

//     const handleCanvasHover = useCallback(_.throttle((event) => {
//         if (!canvasRef.current || !visibleBuildings.length) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const hoveredArea = visibleBuildings.find(building =>
//             building.path && isPointInPath(x, y, building.path)
//         );

//         setHoveredBuilding(prev =>
//             hoveredArea?.id === prev?.id ? prev : hoveredArea
//         );
//     }, 50), [visibleBuildings, isPointInPath]);

//     const drawHighlight = useCallback(() => {
//         if (!drawingContextRef.current || !hoveredBuilding?.path) return;

//         const ctx = drawingContextRef.current;
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//         ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
//         ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
//         ctx.lineWidth = 2;
//         ctx.beginPath();

//         hoveredBuilding.path.forEach((point, index) => {
//             const px = point.x * canvasWidth;
//             const py = point.y * canvasHeight;
//             if (index === 0) ctx.moveTo(px, py);
//             else ctx.lineTo(px, py);
//         });

//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//     }, [hoveredBuilding]);

//     useEffect(() => {
//         if (viewMode === '2d' && imageRef.current && canvasRef.current) {
//             canvasRef.current.width = imageRef.current.width;
//             canvasRef.current.height = imageRef.current.height;
//             drawHighlight();
//         }
//     }, [hoveredBuilding, config, drawHighlight, viewMode]);

//     const BuildingMarker = useCallback(({ building }) => {
//         const isHovered = hoveredBuilding?.id === building.id;

//         return (
//             <div
//                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                 style={{
//                     top: building.position.top,
//                     left: building.position.left
//                 }}
//             >
//                 <div
//                     className={`w-4 h-4 rounded-full bg-white border-2 transition-all duration-300 cursor-pointer
//                         ${isHovered ? 'border-blue-500 scale-125 shadow-lg' : 'border-gray-700 hover:border-blue-400'}`}
//                     onMouseEnter={() => setHoveredBuilding(building)}
//                 />
//             </div>
//         );
//     }, [hoveredBuilding]);

//     return (
//         <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-screen'}`} ref={containerRef}>
//             {/* View Mode Toggle */}
//             <div className="absolute top-4 left-4 z-20 flex bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
//                 <button
//                     onClick={() => setViewMode('2d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '2d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-300 hover:bg-white/20 hover:text-white'
//                     }`}
//                 >
//                     <Map size={20} />
//                     2D View
//                 </button>
//                 <button
//                     onClick={() => setViewMode('3d')}
//                     className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
//                         viewMode === '3d' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-300 hover:bg-white/20 hover:text-white'
//                     }`}
//                 >
//                     <Box size={20} />
//                     3D View
//                 </button>
//             </div>

//             {/* 2D View */}
//             {viewMode === '2d' && (
//                 <div className="relative w-full h-full">
//                     <img
//                         ref={imageRef}
//                         src={config?.image?.src}
//                         alt="Property Map"
//                         className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         className="absolute top-0 left-0 w-full h-full"
//                         onMouseMove={handleCanvasHover}
//                         onMouseLeave={() => setHoveredBuilding(null)}
//                     />

//                     {visibleBuildings.map(building => (
//                         <BuildingMarker key={building.id} building={building} />
//                     ))}
//                 </div>
//             )}

//             {/* 3D View */}
//             {viewMode === '3d' && (
//                 <div 
//                     ref={threejsContainerRef} 
//                     className="w-full h-full"
//                     style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #4a5568 100%)' }}
//                 />
//             )}

//             {/* Building Info Panel */}
//             {hoveredBuilding && (
//                 <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-80 transform transition-all duration-300 animate-in slide-in-from-left-5">
//                     <div className="border-l-4 border-blue-500 pl-4">
//                         <h3 className="font-bold text-xl text-gray-900 mb-2">
//                             {hoveredBuilding.heading}
//                         </h3>
//                         <p className="text-gray-600 leading-relaxed mb-3">
//                             {hoveredBuilding.description}
//                         </p>
                        
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                             <div className="grid grid-cols-2 gap-4 text-sm">
//                                 <div>
//                                     <span className="font-medium text-gray-500">Building ID:</span>
//                                     <p className="text-gray-900">#{hoveredBuilding.id}</p>
//                                 </div>
//                                 {viewMode === '3d' && hoveredBuilding.height && (
//                                     <div>
//                                         <span className="font-medium text-gray-500">Height:</span>
//                                         <p className="text-gray-900">{hoveredBuilding.height} floors</p>
//                                     </div>
//                                 )}
//                                 <div>
//                                     <span className="font-medium text-gray-500">Status:</span>
//                                     <p className="text-green-600 font-medium">Available</p>
//                                 </div>
//                                 <div>
//                                     <span className="font-medium text-gray-500">Type:</span>
//                                     <p className="text-gray-900">Premium</p>
//                                 </div>
//                             </div>
                            
//                             {viewMode === '3d' && (
//                                 <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-2 rounded">
//                                     💡 Hover over buildings to see them rise to full height
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Fullscreen Toggle */}
//             <button
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 z-20"
//             >
//                 {isFullscreen ? (
//                     <Minimize2 className="w-6 h-6 text-white" />
//                 ) : (
//                     <Maximize2 className="w-6 h-6 text-white" />
//                 )}
//             </button>

//             {/* Loading indicator */}
//             {!config && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-40">
//                     <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
//                         <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
//                         <div className="text-white text-xl">Loading Property Data...</div>
//                         <div className="text-white/70 text-sm mt-2">Fetching land parcels and boundaries</div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BuildingViewer;

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Maximize2, Minimize2, Box, Map } from 'lucide-react';
import _ from 'lodash';
import * as THREE from 'three';

const BuildingViewer = () => {
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const [config, setConfig] = useState(null);
    const [loadedChunks, setLoadedChunks] = useState(new Set());

    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const drawingContextRef = useRef(null);
    const threejsContainerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const raycasterRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2());
    const buildingMeshesRef = useRef([]);
    const frameIdRef = useRef();
    const animationMixersRef = useRef([]);

    // Mock data for demonstration - replace with your actual API call
    const mockConfig = {
        image: {
            src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
        },
        buildings: [
            {
                id: 1,
                heading: "North Tower",
                description: "Premium residential complex - $2500 per sqft",
                path: [
                    { x: 0.2, y: 0.15 },
                    { x: 0.4, y: 0.15 },
                    { x: 0.4, y: 0.35 },
                    { x: 0.2, y: 0.35 }
                ],
                position: { top: "25%", left: "30%" },
                height: 8
            },
            {
                id: 2,
                heading: "South Plaza",
                description: "Commercial space - $1800 per sqft",
                path: [
                    { x: 0.6, y: 0.4 },
                    { x: 0.8, y: 0.4 },
                    { x: 0.8, y: 0.65 },
                    { x: 0.6, y: 0.65 }
                ],
                position: { top: "52.5%", left: "70%" },
                height: 6
            },
            {
                id: 3,
                heading: "East Wing",
                description: "Mixed use development - $2200 per sqft",
                path: [
                    { x: 0.15, y: 0.55 },
                    { x: 0.35, y: 0.55 },
                    { x: 0.35, y: 0.8 },
                    { x: 0.15, y: 0.8 }
                ],
                position: { top: "67.5%", left: "25%" },
                height: 10
            },
            {
                id: 4,
                heading: "Central Court",
                description: "Luxury apartments - $3000 per sqft",
                path: [
                    { x: 0.45, y: 0.2 },
                    { x: 0.65, y: 0.2 },
                    { x: 0.65, y: 0.35 },
                    { x: 0.45, y: 0.35 }
                ],
                position: { top: "27.5%", left: "55%" },
                height: 12
            }
        ]
    };

    useEffect(() => {
        setConfig(mockConfig);
    }, []);

    // Initialize Three.js scene
    const initThreeJS = useCallback(() => {
        if (!threejsContainerRef.current) return;

        const container = threejsContainerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        sceneRef.current = scene;

        // Camera - Fixed position, no rotation
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 25, 35);
        camera.lookAt(0, 5, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(15, 25, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);

        // Base plane
        const planeGeometry = new THREE.PlaneGeometry(35, 25);
        const planeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d3748,
            transparent: true,
            opacity: 0.8
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);

        // Grid helper for reference
        const gridHelper = new THREE.GridHelper(35, 35, 0x444444, 0x333333);
        gridHelper.position.y = 0.01;
        scene.add(gridHelper);

        // Raycaster for mouse interaction
        raycasterRef.current = new THREE.Raycaster();

        // Mouse event handlers
        const handleMouseMove = (event) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
        };

        const handleMouseLeave = () => {
            setHoveredBuilding(null);
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Animate building height
    const animateBuildingHeight = useCallback((mesh, targetHeight, duration = 800) => {
        if (!mesh) return;

        const startHeight = mesh.scale.y;
        const startY = mesh.position.y;
        const targetY = targetHeight / 2;
        
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            const currentHeight = startHeight + (targetHeight - startHeight) * easeOutCubic;
            const currentY = startY + (targetY - startY) * easeOutCubic;
            
            mesh.scale.y = currentHeight;
            mesh.position.y = currentY;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    // Create 3D building blocks
    const createBuildingBlocks = useCallback(() => {
        if (!config?.buildings || !sceneRef.current) return;

        // Clear existing meshes
        buildingMeshesRef.current.forEach(mesh => {
            sceneRef.current.remove(mesh);
        });
        buildingMeshesRef.current = [];

        config.buildings.forEach((building, index) => {
            if (!building.path || building.path.length < 3) return;

            // Calculate bounding box from path to create a proper rectangle
            const xCoords = building.path.map(p => (p.x - 0.5) * 30);
            const zCoords = building.path.map(p => (p.y - 0.5) * -20);
            
            const minX = Math.min(...xCoords);
            const maxX = Math.max(...xCoords);
            const minZ = Math.min(...zCoords);
            const maxZ = Math.max(...zCoords);
            
            const width = maxX - minX;
            const depth = maxZ - minZ;
            const height = 0.2; // Start very flat

            // Create a simple box geometry (perfect rectangular block)
            const geometry = new THREE.BoxGeometry(width, height, depth);
            
            // Create gradient material based on building type
            const hue = (index * 137.5) % 360; // Golden angle spacing
            const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.9,
                shininess: 80,
                specular: 0x222222
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Position the building at the center of its bounding box
            const centerX = (minX + maxX) / 2;
            const centerZ = (minZ + maxZ) / 2;
            
            mesh.position.set(centerX, height / 2, centerZ);
            mesh.scale.set(1, 1, 1);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Store building data and target height
            mesh.userData = { 
                building, 
                originalColor: color.clone(),
                targetHeight: building.height || (3 + Math.random() * 5),
                isAnimating: false,
                originalWidth: width,
                originalDepth: depth
            };

            sceneRef.current.add(mesh);
            buildingMeshesRef.current.push(mesh);
        });
    }, [config]);

    // Animation loop
    const animate = useCallback(() => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

        // Raycasting for hover effects
        if (raycasterRef.current && buildingMeshesRef.current.length > 0) {
            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
            const intersects = raycasterRef.current.intersectObjects(buildingMeshesRef.current);

            let newHoveredBuilding = null;

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const building = intersectedMesh.userData.building;
                newHoveredBuilding = building;

                // Animate building to full height on hover
                if (!intersectedMesh.userData.isAnimating) {
                    intersectedMesh.userData.isAnimating = true;
                    
                    // Update geometry for new height
                    const targetHeight = intersectedMesh.userData.targetHeight;
                    const newGeometry = new THREE.BoxGeometry(
                        intersectedMesh.userData.originalWidth,
                        targetHeight,
                        intersectedMesh.userData.originalDepth
                    );
                    intersectedMesh.geometry.dispose();
                    intersectedMesh.geometry = newGeometry;
                    intersectedMesh.position.y = targetHeight / 2;
                    
                    // Enhance material on hover
                    intersectedMesh.material.color.setHex(0xffffff);
                    intersectedMesh.material.emissive.setHex(0x222222);
                }
            }

            // Reset non-hovered buildings
            buildingMeshesRef.current.forEach(mesh => {
                const isCurrentlyHovered = intersects.length > 0 && intersects[0].object === mesh;
                
                if (!isCurrentlyHovered && mesh.userData.isAnimating) {
                    // Reset color
                    mesh.material.color.copy(mesh.userData.originalColor);
                    mesh.material.emissive.setHex(0x000000);
                    
                    // Reset to flat geometry
                    const flatHeight = 0.2;
                    const newGeometry = new THREE.BoxGeometry(
                        mesh.userData.originalWidth,
                        flatHeight,
                        mesh.userData.originalDepth
                    );
                    mesh.geometry.dispose();
                    mesh.geometry = newGeometry;
                    mesh.position.y = flatHeight / 2;
                    mesh.userData.isAnimating = false;
                }
            });

            // Update hovered building state
            if (newHoveredBuilding?.id !== hoveredBuilding?.id) {
                setHoveredBuilding(newHoveredBuilding);
            }
        }

        // Static camera - no rotation animation
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        frameIdRef.current = requestAnimationFrame(animate);
    }, [hoveredBuilding]);

    // Handle window resize
    const handleResize = useCallback(() => {
        if (!threejsContainerRef.current || !rendererRef.current || !cameraRef.current) return;

        const width = threejsContainerRef.current.clientWidth;
        const height = threejsContainerRef.current.clientHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
    }, []);

    // Initialize 3D scene
    useEffect(() => {
        if (viewMode === '3d') {
            const cleanup = initThreeJS();
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (frameIdRef.current) {
                    cancelAnimationFrame(frameIdRef.current);
                }
                cleanup?.();
            };
        }
    }, [viewMode, initThreeJS, handleResize]);

    // Create building blocks when config changes
    useEffect(() => {
        if (viewMode === '3d') {
            createBuildingBlocks();
        }
    }, [config, viewMode, createBuildingBlocks]);

    // Start animation loop
    useEffect(() => {
        if (viewMode === '3d') {
            animate();
            return () => {
                if (frameIdRef.current) {
                    cancelAnimationFrame(frameIdRef.current);
                }
            };
        }
    }, [viewMode, animate]);

    // Memoize buildings data with chunking (for 2D mode)
    const buildingChunks = useMemo(() => {
        if (!config?.buildings) return [];
        return _.chunk(config.buildings, 10);
    }, [config]);

    // Load building chunks progressively (for 2D mode)
    useEffect(() => {
        if (!buildingChunks.length || viewMode === '3d') return;

        const loadNextChunk = (chunkIndex) => {
            if (chunkIndex >= buildingChunks.length) return;

            setLoadedChunks(prev => {
                const newSet = new Set(prev);
                newSet.add(chunkIndex);
                return newSet;
            });

            if (chunkIndex + 1 < buildingChunks.length) {
                setTimeout(() => loadNextChunk(chunkIndex + 1), 100);
            }
        };

        loadNextChunk(0);
    }, [buildingChunks, viewMode]);

    // Get visible buildings based on loaded chunks (for 2D mode)
    const visibleBuildings = useMemo(() => {
        return Array.from(loadedChunks)
            .flatMap(chunkIndex => buildingChunks[chunkIndex] || []);
    }, [buildingChunks, loadedChunks]);

    // Initialize canvas context (for 2D mode)
    useEffect(() => {
        if (canvasRef.current) {
            drawingContextRef.current = canvasRef.current.getContext('2d');
        }
    }, []);

    // 2D Mode Functions
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

    const drawHighlight = useCallback(() => {
        if (!drawingContextRef.current || !hoveredBuilding?.path) return;

        const ctx = drawingContextRef.current;
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        hoveredBuilding.path.forEach((point, index) => {
            const px = point.x * canvasWidth;
            const py = point.y * canvasHeight;
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }, [hoveredBuilding]);

    useEffect(() => {
        if (viewMode === '2d' && imageRef.current && canvasRef.current) {
            canvasRef.current.width = imageRef.current.width;
            canvasRef.current.height = imageRef.current.height;
            drawHighlight();
        }
    }, [hoveredBuilding, config, drawHighlight, viewMode]);

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
                    className={`w-4 h-4 rounded-full bg-white border-2 transition-all duration-300 cursor-pointer
                        ${isHovered ? 'border-blue-500 scale-125 shadow-lg' : 'border-gray-700 hover:border-blue-400'}`}
                    onMouseEnter={() => setHoveredBuilding(building)}
                />
            </div>
        );
    }, [hoveredBuilding]);

    return (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-screen'}`} ref={containerRef}>
            {/* View Mode Toggle */}
            <div className="absolute top-4 left-4 z-20 flex bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
                <button
                    onClick={() => setViewMode('2d')}
                    className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
                        viewMode === '2d' 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    <Map size={20} />
                    2D View
                </button>
                <button
                    onClick={() => setViewMode('3d')}
                    className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
                        viewMode === '3d' 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    <Box size={20} />
                    3D View
                </button>
            </div>

            {/* 2D View */}
            {viewMode === '2d' && (
                <div className="relative w-full h-full">
                    <img
                        ref={imageRef}
                        src={config?.image?.src}
                        alt="Property Map"
                        className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
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
                </div>
            )}

            {/* 3D View */}
            {viewMode === '3d' && (
                <div 
                    ref={threejsContainerRef} 
                    className="w-full h-full"
                    style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #4a5568 100%)' }}
                />
            )}

            {/* Building Info Panel */}
            {hoveredBuilding && (
                <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-80 transform transition-all duration-300 animate-in slide-in-from-left-5">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {hoveredBuilding.heading}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            {hoveredBuilding.description}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-500">Building ID:</span>
                                    <p className="text-gray-900">#{hoveredBuilding.id}</p>
                                </div>
                                {viewMode === '3d' && hoveredBuilding.height && (
                                    <div>
                                        <span className="font-medium text-gray-500">Height:</span>
                                        <p className="text-gray-900">{hoveredBuilding.height} floors</p>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-gray-500">Status:</span>
                                    <p className="text-green-600 font-medium">Available</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Type:</span>
                                    <p className="text-gray-900">Premium</p>
                                </div>
                            </div>
                            
                            {viewMode === '3d' && (
                                <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                                    💡 Hover over buildings to see them rise to full height
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Toggle */}
            <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 z-20"
            >
                {isFullscreen ? (
                    <Minimize2 className="w-6 h-6 text-white" />
                ) : (
                    <Maximize2 className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Loading indicator */}
            {!config && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-40">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                        <div className="text-white text-xl">Loading Property Data...</div>
                        <div className="text-white/70 text-sm mt-2">Fetching land parcels and boundaries</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildingViewer;