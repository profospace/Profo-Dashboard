// import React, { useState, useRef, useEffect } from 'react';
// import { Upload, Trash2, Download, Building, Home, X, Crop, Move, Lasso } from 'lucide-react';
// import { base_url } from '../utils/base_url';
// import ConfigManager from './ConfigManager';

// const BuildingManager = () => {
//     const [images, setImages] = useState([]);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [buildings, setBuildings] = useState({});
//     const [selectedBuilding, setSelectedBuilding] = useState(null);
//     const [selectionMode, setSelectionMode] = useState('move');
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [currentPath, setCurrentPath] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [tempPath, setTempPath] = useState(null);
//     const [formData, setFormData] = useState({
//         heading: '',
//         description: ''
//     });

//     const imageRef = useRef(null);
//     const canvasRef = useRef(null);
//     const popupRef = useRef(null);

//     useEffect(() => {
//         if (selectedImage && canvasRef.current) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             canvas.width = imageRef.current.width;
//             canvas.height = imageRef.current.height;
//             drawExistingAreas();
//         }
//     }, [selectedImage, buildings]);

//     const drawExistingAreas = () => {
//         if (!canvasRef.current || !selectedImage) return;
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         const currentBuildings = buildings[selectedImage.id] || [];
//         currentBuildings.forEach(building => {
//             ctx.strokeStyle = selectedBuilding?.id === building.id ? '#3B82F6' : 'rgba(0, 0, 0, 0.5)';
//             ctx.lineWidth = 2;

//             if (building.path) {
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
//                 ctx.stroke();
//             }
//         });
//     };

//     const handleMouseDown = (e) => {
//         if (selectionMode === 'move') return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = (e.clientX - rect.left) / rect.width;
//         const y = (e.clientY - rect.top) / rect.height;

//         setIsDrawing(true);
//         setCurrentPath([{ x, y }]);
//     };

//     const handleMouseMove = (e) => {
//         if (!isDrawing || selectionMode === 'move') return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = (e.clientX - rect.left) / rect.width;
//         const y = (e.clientY - rect.top) / rect.height;

//         setCurrentPath(prev => [...prev, { x, y }]);

//         const ctx = canvasRef.current.getContext('2d');
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         drawExistingAreas();

//         ctx.strokeStyle = '#3B82F6';
//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         currentPath.forEach((point, index) => {
//             if (index === 0) {
//                 ctx.moveTo(
//                     point.x * canvasRef.current.width,
//                     point.y * canvasRef.current.height
//                 );
//             } else {
//                 ctx.lineTo(
//                     point.x * canvasRef.current.width,
//                     point.y * canvasRef.current.height
//                 );
//             }
//         });
//         ctx.lineTo(x * canvasRef.current.width, y * canvasRef.current.height);
//         ctx.stroke();
//     };

//     const handleMouseUp = () => {
//         if (!isDrawing) return;
//         setIsDrawing(false);
//         setTempPath(currentPath);
//         setShowPopup(true);
//     };

//     const handlePopupSubmit = () => {
//         const newBuilding = {
//             id: Date.now(),
//             heading: formData.heading,
//             description: formData.description,
//             path: tempPath,
//             position: calculateCentroid(tempPath)
//         };

//         setBuildings(prev => ({
//             ...prev,
//             [selectedImage.id]: [...(prev[selectedImage.id] || []), newBuilding]
//         }));

//         setShowPopup(false);
//         setCurrentPath([]);
//         setTempPath(null);
//         setFormData({ heading: '', description: '' });
//     };

//     const calculateCentroid = (points) => {
//         if (!points || points.length === 0) return { top: '50%', left: '50%' };

//         const sum = points.reduce((acc, point) => ({
//             x: acc.x + point.x,
//             y: acc.y + point.y
//         }), { x: 0, y: 0 });

//         return {
//             top: `${(sum.y / points.length) * 100}%`,
//             left: `${(sum.x / points.length) * 100}%`
//         };
//     };

//     const handleExport = () => {
//         if (!selectedImage || !buildings[selectedImage.id]) return;

//         const exportData = {
//             version: '1.0',
//             exportedAt: new Date().toISOString(),
//             image: {
//                 src: selectedImage.src,
//                 id: selectedImage.id
//             },
//             buildings: buildings[selectedImage.id].map(building => ({
//                 id: building.id,
//                 heading: building.heading,
//                 description: building.description,
//                 path: building.path,
//                 position: building.position
//             }))
//         };

//         const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `building-data-${Date.now()}.json`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     const handleImageUpload = async (event) => {
//         const files = Array.from(event.target.files);
//         const validFiles = files.filter(file => file.type.startsWith('image/'));

//         for (const file of validFiles) {
//             const formData = new FormData();
//             formData.append('image', file);

//             try {
//                 const response = await fetch(`${base_url}/profo/image/upload`, {
//                     method: 'POST',
//                     body: formData
//                 });

//                 const result = await response.json();
//                 // Access imageUrl from the nested data object
//                 const imageUrl = result.data.imageUrl;

//                 const newImage = {
//                     id: Date.now() + Math.random(),
//                     src: imageUrl,
//                     name: file.name,
//                     uploadedAt: new Date().toISOString()
//                 };

//                 setImages(prev => [...prev, newImage]);
//                 setBuildings(prev => ({ ...prev, [newImage.id]: [] }));
//             } catch (error) {
//                 console.error('Upload failed:', error);
//                 setExportStatus({ type: 'error', message: 'Image upload failed' });
//             }
//         }
//     };

//     const handleDataImport = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 try {
//                     const data = JSON.parse(e.target.result);
//                     if (!data.name || !data.totalFloors) {
//                         throw new Error('Invalid building data format');
//                     }
//                     setBuildingData(data);
//                     setExportStatus({ type: 'success', message: 'Building data imported successfully' });
//                 } catch (error) {
//                     setExportStatus({ type: 'error', message: 'Failed to import building data' });
//                     console.error('Error parsing JSON:', error);
//                 }
//             };
//             reader.readAsText(file);
//         }
//     };

//     return (
//         <div className="p-4">
//             {/* Your existing upload and tools UI */}
//             <div className="p-4 flex flex-col gap-4">
//                 {/* Upload Buttons Section */}
//                 <div className="flex gap-4 mb-4">
//                     <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
//                         <label className="cursor-pointer flex flex-col items-center gap-2">
//                             <Upload className="w-8 h-8 text-gray-500" />
//                             <span className="text-sm text-gray-600">Upload Images</span>
//                             <input
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={handleImageUpload}
//                             />
//                         </label>
//                     </div>
//                     <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
//                         <label className="cursor-pointer flex flex-col items-center gap-2">
//                             <Upload className="w-8 h-8 text-gray-500" />
//                             <span className="text-sm text-gray-600">Import Data (JSON)</span>
//                             <input
//                                 type="file"
//                                 accept="application/json"
//                                 className="hidden"
//                                 onChange={handleDataImport}
//                             />
//                         </label>
//                     </div>

//                 </div>

//                 {/* Selection Tools */}
//                 {selectedImage && (
//                     <div className="flex gap-2 mb-4">
//                         <button
//                             className={`p-2 rounded-lg flex items-center gap-2 transition-colors 
//                             ${selectionMode === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
//                             onClick={() => setSelectionMode('rect')}
//                         >
//                             <Crop className="w-4 h-4" />
//                             <span className="text-sm">Rectangle</span>
//                         </button>
//                         <button
//                             className={`p-2 rounded-lg flex items-center gap-2 transition-colors 
//                             ${selectionMode === 'lasso' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
//                             onClick={() => setSelectionMode('lasso')}
//                         >
//                             <Lasso className="w-4 h-4" />
//                             <span className="text-sm">Lasso</span>
//                         </button>
//                         <button
//                             className={`p-2 rounded-lg flex items-center gap-2 transition-colors 
//                             ${selectionMode === 'move' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
//                             onClick={() => setSelectionMode('move')}
//                         >
//                             <Move className="w-4 h-4" />
//                             <span className="text-sm">Move</span>
//                         </button>
//                     </div>
//                 )}
//                 <button
//                     className={`p-2 rounded-lg flex items-center gap-2 transition-colors 
//                         ${selectionMode === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
//                     onClick={() => setSelectionMode('rect')}
//                 >
//                     <Crop className="w-4 h-4" />
//                     <span className="text-sm">Rectangle</span>
//                 </button>
//                 <button
//                     className={`p-2 rounded-lg flex items-center gap-2 transition-colors 
//                         ${selectionMode === 'lasso' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
//                     onClick={() => setSelectionMode('lasso')}
//                 >
//                     <Lasso className="w-4 h-4" />
//                     <span className="text-sm">Lasso</span>
//                 </button>
//                 <button
//                     className={`p-2 rounded-lg flex items-center gap-2 transition-colors 
//                         ${selectionMode === 'move' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
//                     onClick={() => setSelectionMode('move')}
//                 >
//                     <Move className="w-4 h-4" />
//                     <span className="text-sm">Move</span>
//                 </button>
//             </div>

//             {/* Image Gallery */}
//             <div className="flex flex-wrap gap-4">
//                 {images.map(image => (
//                     <div
//                         key={image.id}
//                         className={`relative border rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200
//                             ${selectedImage?.id === image.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
//                         onClick={() => {
//                             setSelectedImage(image);
//                             setSelectedBuilding(null);
//                         }}
//                     >
//                         <img
//                             src={image.src}
//                             alt={image.name}
//                             className="w-32 h-32 object-cover"
//                         />
//                         <button
//                             className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 hover:opacity-100 transition-opacity"
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setImages(prev => prev.filter(img => img.id !== image.id));
//                                 setBuildings(prev => {
//                                     const newBuildings = { ...prev };
//                                     delete newBuildings[image.id];
//                                     return newBuildings;
//                                 });
//                                 if (selectedImage?.id === image.id) {
//                                     setSelectedImage(null);
//                                     setSelectedBuilding(null);
//                                 }
//                             }}
//                         >
//                             <Trash2 className="w-4 h-4" />
//                         </button>
//                     </div>
//                 ))}
//             </div>
//             {/* Main Image Editor */}
//             {selectedImage && (
//                 <div className="relative border rounded-lg overflow-hidden min-h-[400px] bg-gray-50">
//                     <img
//                         ref={imageRef}
//                         src={selectedImage.src}
//                         alt={selectedImage.name}
//                         className="w-full h-full object-contain"
//                     />

//                     <canvas
//                         ref={canvasRef}
//                         className="absolute top-0 left-0 w-full h-full"
//                         onMouseDown={handleMouseDown}
//                         onMouseMove={handleMouseMove}
//                         onMouseUp={handleMouseUp}
//                         onMouseLeave={handleMouseUp}
//                     />

//                     {/* Building Markers */}
//                     {buildings[selectedImage.id]?.map((building) => (
//                         <button
//                             key={building.id}
//                             className="absolute w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-blue-500 text-white transform -translate-x-1/2 -translate-y-1/2"
//                             style={{
//                                 top: building.position.top,
//                                 left: building.position.left
//                             }}
//                             onClick={() => setSelectedBuilding(building)}
//                         >
//                             {building.heading.charAt(0)}
//                         </button>
//                     ))}

//                     {/* Selected Building Info Popup */}
//                     {selectedBuilding && (
//                         <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-4">
//                             <div className="flex justify-between items-start mb-4">
//                                 <h3 className="text-lg font-semibold">{selectedBuilding.heading}</h3>
//                                 <button
//                                     onClick={() => setSelectedBuilding(null)}
//                                     className="p-1 hover:bg-gray-100 rounded-full"
//                                 >
//                                     <X className="w-4 h-4" />
//                                 </button>
//                             </div>
//                             <p className="text-gray-600">{selectedBuilding.description}</p>
//                         </div>
//                     )}

//                     {/* Input Popup */}
//                     {showPopup && (
//                         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//                             <div className="bg-white rounded-lg p-6 w-96">
//                                 <h3 className="text-lg font-semibold mb-4">Add Building Details</h3>
//                                 <input
//                                     type="text"
//                                     placeholder="Heading"
//                                     className="w-full mb-4 p-2 border rounded"
//                                     value={formData.heading}
//                                     onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
//                                 />
//                                 <textarea
//                                     placeholder="Description"
//                                     className="w-full mb-4 p-2 border rounded h-24"
//                                     value={formData.description}
//                                     onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                                 />
//                                 <div className="flex justify-end gap-2">
//                                     <button
//                                         className="px-4 py-2 bg-gray-200 rounded"
//                                         onClick={() => {
//                                             setShowPopup(false);
//                                             setCurrentPath([]);
//                                             setTempPath(null);
//                                         }}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 bg-blue-500 text-white rounded"
//                                         onClick={handlePopupSubmit}
//                                     >
//                                         Save
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Export Button */}
//                     {/* <button
//                         onClick={handleExport}
//                         className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//                     >
//                         <Download className="w-4 h-4" />
//                         Export Data
//                     </button> */}
//                 </div>
//             )}
//                     {selectedImage && (
//                         <div className="flex flex-col gap-4 mb-4">
//                             <ConfigManager
//                                 targetType="building"
//                                 version="1.0"
//                                 image={{
//                                     src: selectedImage.src,
//                                     id: selectedImage.id
//                                 }}
//                                 buildings={buildings[selectedImage.id] || []}
//                                 onSaveSuccess={(data) => {
//                                     console.log('Configuration saved:', data);
//                                     // Add any additional success handling here
//                                 }}
//                             />

//                             <button
//                                 onClick={handleExport}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//                             >
//                                 <Download className="w-4 h-4" />
//                                 Export Data
//                             </button>
//                         </div>
//                     )}
//         </div>
//     );
// };

// export default BuildingManager;



import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Trash2, Download, Crop, Move, Lasso, X } from 'lucide-react';

import { simplifyPath, optimizePathData } from '../../pathUtils';
import { base_url } from '../../../utils/base_url';
import ConfigManager from '../../components/Viewer/ConfigManager';
import { useSearchParams } from 'react-router-dom';

const BuildingManager = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [buildings, setBuildings] = useState({});
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectionMode, setSelectionMode] = useState('move');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [tempPath, setTempPath] = useState(null);
    const [formData, setFormData] = useState({ heading: '', description: '' });

    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const drawingContextRef = useRef(null);

    const [searchParams] = useSearchParams();
    const paramsType = searchParams.get('targetType');
    const paramsId = searchParams.get('id');
    console.log(paramsType, paramsId)

    // Initialize canvas context
    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            drawingContextRef.current = context;

            if (imageRef.current) {
                canvasRef.current.width = imageRef.current.width;
                canvasRef.current.height = imageRef.current.height;
            }
        }
    }, [selectedImage]);

    // Optimized drawing function
    const drawExistingAreas = useCallback(() => {
        const ctx = drawingContextRef.current;
        if (!ctx || !selectedImage) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const currentBuildings = buildings[selectedImage.id] || [];

        currentBuildings.forEach(building => {
            if (!building.path?.length) return;

            ctx.strokeStyle = selectedBuilding?.id === building.id ? '#3B82F6' : 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const firstPoint = building.path[0];
            ctx.moveTo(
                firstPoint.x * canvasRef.current.width,
                firstPoint.y * canvasRef.current.height
            );

            building.path.slice(1).forEach(point => {
                ctx.lineTo(
                    point.x * canvasRef.current.width,
                    point.y * canvasRef.current.height
                );
            });

            ctx.closePath();
            ctx.stroke();
        });
    }, [selectedImage, buildings, selectedBuilding]);

    // Optimized mouse handlers
    const handleMouseDown = useCallback((e) => {
        if (selectionMode === 'move') return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setIsDrawing(true);
        setCurrentPath([{ x, y }]);
    }, [selectionMode]);

    const handleMouseMove = useCallback((e) => {
        if (!isDrawing || selectionMode === 'move') return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setCurrentPath(prev => [...prev, { x, y }]);
        drawPath([...currentPath, { x, y }]);
    }, [isDrawing, selectionMode, currentPath]);

    const handleMouseUp = useCallback(() => {
        if (!isDrawing) return;

        setIsDrawing(false);
        // Optimize path before saving
        const optimizedPath = simplifyPath(currentPath);
        setTempPath(optimizedPath);
        setShowPopup(true);
    }, [isDrawing, currentPath]);

    // Optimized path drawing
    const drawPath = useCallback((path) => {
        const ctx = drawingContextRef.current;
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawExistingAreas();

        if (path.length < 2) return;

        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const firstPoint = path[0];
        ctx.moveTo(
            firstPoint.x * canvasRef.current.width,
            firstPoint.y * canvasRef.current.height
        );

        path.slice(1).forEach(point => {
            ctx.lineTo(
                point.x * canvasRef.current.width,
                point.y * canvasRef.current.height
            );
        });

        ctx.stroke();
    }, [drawExistingAreas]);

    const calculateCentroid = (points) => {
        if (!points || points.length === 0) return { top: '50%', left: '50%' };

        const sum = points.reduce((acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y
        }), { x: 0, y: 0 });

        return {
            top: `${(sum.y / points.length) * 100}%`,
            left: `${(sum.x / points.length) * 100}%`
        };
    };

    // Handle building submission
    const handlePopupSubmit = useCallback(() => {
        if (!tempPath || !selectedImage) return;

        const newBuilding = {
            id: Date.now(),
            heading: formData.heading,
            description: formData.description,
            path: tempPath,
            position: calculateCentroid(tempPath)
        };

        setBuildings(prev => ({
            ...prev,
            [selectedImage.id]: [...(prev[selectedImage.id] || []), newBuilding]
        }));

        setShowPopup(false);
        setCurrentPath([]);
        setTempPath(null);
        setFormData({ heading: '', description: '' });
    }, [tempPath, selectedImage, formData]);

    // Export handler with optimization
    const handleExport = useCallback(() => {
        if (!selectedImage || !buildings[selectedImage.id]) return;

        const optimizedBuildings = optimizePathData(buildings[selectedImage.id]);

        const exportData = {
            version: '1.0',
            targetId: `Build${Date.now()}`,
            targetType: 'building',
            image: {
                src: selectedImage.src,
                id: selectedImage.id
            },
            buildings: optimizedBuildings
        };

        // Use Blob for better memory handling
        const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `building-data-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }, [selectedImage, buildings]);


    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        for (const file of validFiles) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${base_url}/profo/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                // Access imageUrl from the nested data object
                const imageUrl = result.data.imageUrl;

                const newImage = {
                    id: Date.now() + Math.random(),
                    src: imageUrl,
                    name: file.name,
                    uploadedAt: new Date().toISOString()
                };

                setImages(prev => [...prev, newImage]);
                setBuildings(prev => ({ ...prev, [newImage.id]: [] }));
            } catch (error) {
                console.error('Upload failed:', error);
                setExportStatus({ type: 'error', message: 'Image upload failed' });
            }
        }
    };

    const handleDataImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.name || !data.totalFloors) {
                        throw new Error('Invalid building data format');
                    }
                    setBuildingData(data);
                    setExportStatus({ type: 'success', message: 'Building data imported successfully' });
                } catch (error) {
                    setExportStatus({ type: 'error', message: 'Failed to import building data' });
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    // Rest of your component JSX remains the same...

    return (
        <div className="p-4">
            {/* Your existing upload and tools UI */}
            <div className="p-4 flex flex-col gap-4">
                {/* Upload Buttons Section */}
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-gray-500" />
                            <span className="text-sm text-gray-600">Upload Images</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-gray-500" />
                            <span className="text-sm text-gray-600">Import Data (JSON)</span>
                            <input
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={handleDataImport}
                            />
                        </label>
                    </div>

                </div>

                {/* Selection Tools */}
                {selectedImage && (
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                                ${selectionMode === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            onClick={() => setSelectionMode('rect')}
                        >
                            <Crop className="w-4 h-4" />
                            <span className="text-sm">Rectangle</span>
                        </button>
                        <button
                            className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                                ${selectionMode === 'lasso' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            onClick={() => setSelectionMode('lasso')}
                        >
                            <Lasso className="w-4 h-4" />
                            <span className="text-sm">Lasso</span>
                        </button>
                        <button
                            className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                                ${selectionMode === 'move' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            onClick={() => setSelectionMode('move')}
                        >
                            <Move className="w-4 h-4" />
                            <span className="text-sm">Move</span>
                        </button>
                    </div>
                )}
                <button
                    className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                            ${selectionMode === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setSelectionMode('rect')}
                >
                    <Crop className="w-4 h-4" />
                    <span className="text-sm">Rectangle</span>
                </button>
                <button
                    className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                            ${selectionMode === 'lasso' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setSelectionMode('lasso')}
                >
                    <Lasso className="w-4 h-4" />
                    <span className="text-sm">Lasso</span>
                </button>
                <button
                    className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                            ${selectionMode === 'move' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setSelectionMode('move')}
                >
                    <Move className="w-4 h-4" />
                    <span className="text-sm">Move</span>
                </button>
            </div>

            {/* Image Gallery */}
            <div className="flex flex-wrap gap-4">
                {images.map(image => (
                    <div
                        key={image.id}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200
                                ${selectedImage?.id === image.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                        onClick={() => {
                            setSelectedImage(image);
                            setSelectedBuilding(null);
                        }}
                    >
                        <img
                            src={image.src}
                            alt={image.name}
                            className="w-32 h-32 object-cover"
                        />
                        <button
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                setImages(prev => prev.filter(img => img.id !== image.id));
                                setBuildings(prev => {
                                    const newBuildings = { ...prev };
                                    delete newBuildings[image.id];
                                    return newBuildings;
                                });
                                if (selectedImage?.id === image.id) {
                                    setSelectedImage(null);
                                    setSelectedBuilding(null);
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            {/* Main Image Editor */}
            {selectedImage && (
                <div className="relative border rounded-lg overflow-hidden min-h-[400px] bg-gray-50">
                    <img
                        ref={imageRef}
                        src={selectedImage.src}
                        alt={selectedImage.name}
                        className="w-full h-full object-contain"
                    />

                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />

                    {/* Building Markers */}
                    {buildings[selectedImage.id]?.map((building) => (
                        <button
                            key={building.id}
                            className="absolute w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-blue-500 text-white transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                top: building.position.top,
                                left: building.position.left
                            }}
                            onClick={() => setSelectedBuilding(building)}
                        >
                            {building.heading.charAt(0)}
                        </button>
                    ))}

                    {/* Selected Building Info Popup */}
                    {selectedBuilding && (
                        <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">{selectedBuilding.heading}</h3>
                                <button
                                    onClick={() => setSelectedBuilding(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-gray-600">{selectedBuilding.description}</p>
                        </div>
                    )}

                    {/* Input Popup */}
                    {showPopup && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-white rounded-lg p-6 w-96">
                                <h3 className="text-lg font-semibold mb-4">Add Building Details</h3>
                                <input
                                    type="text"
                                    placeholder="Heading"
                                    className="w-full mb-4 p-2 border rounded"
                                    value={formData.heading}
                                    onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="w-full mb-4 p-2 border rounded h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="px-4 py-2 bg-gray-200 rounded"
                                        onClick={() => {
                                            setShowPopup(false);
                                            setCurrentPath([]);
                                            setTempPath(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={handlePopupSubmit}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Export Button */}
                    {/* <button
                            onClick={handleExport}
                            className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Data
                        </button> */}
                </div>
            )}
            {selectedImage && (
                <div className="flex flex-col gap-4 mb-4">
                    <ConfigManager
                        id={paramsId}
                        targetType={paramsType}
                        version="1.0"
                        image={{
                            src: selectedImage.src,
                            id: selectedImage.id
                        }}
                        buildings={buildings[selectedImage.id] || []}
                        onSaveSuccess={(data) => {
                            console.log('Configuration saved:', data);
                            // Add any additional success handling here
                        }}
                    />

                    <button
                        onClick={handleExport}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default BuildingManager;