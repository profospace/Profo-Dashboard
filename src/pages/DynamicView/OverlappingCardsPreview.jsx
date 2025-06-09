// import React, { useState, useEffect } from 'react';

// const OverlappingCardsPreview = () => {
//     // Sample data for cards
//     const cardImages = [
//         'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80', // Mountains
//         'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=500&q=80', // Ocean
//         'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80', // Forest
//         'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', // Valley
//         'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=500&q=80'  // Desert
//     ];

//     const cardTitles = [
//         'Mountains View',
//         'Ocean Waves',
//         'Forest Path',
//         'Valley Ridge',
//         'Desert Dunes'
//     ];

//     // Configuration state
//     const [config, setConfig] = useState({
//         style: 'HORIZONTAL_LEFT_TO_RIGHT',
//         horizontalOverlap: -80,
//         verticalOverlap: 0,
//         maxRotation: 1.5,
//         randomRotation: false,
//         elevationStep: 2,
//         scaleFactor: 1,
//         scaleStep: 0.03
//     });

//     const [showCode, setShowCode] = useState(false);

//     // Predefined patterns
//     const patterns = {
//         fan: {
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -65,
//             verticalOverlap: 0,
//             maxRotation: 4,
//             randomRotation: false,
//             elevationStep: 1,
//             scaleFactor: 1,
//             scaleStep: 0.02
//         },
//         stack: {
//             style: 'STACK_CENTERED',
//             horizontalOverlap: -20,
//             verticalOverlap: -20,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 3,
//             scaleFactor: 1,
//             scaleStep: 0.05
//         },
//         cascade: {
//             style: 'CASCADE_TOP_LEFT',
//             horizontalOverlap: -60,
//             verticalOverlap: -15,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 2,
//             scaleFactor: 1,
//             scaleStep: 0.03
//         },
//         staggered: {
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -70,
//             verticalOverlap: 0,
//             maxRotation: 3,
//             randomRotation: true,
//             elevationStep: 1.5,
//             scaleFactor: 1,
//             scaleStep: 0.02
//         },
//         tight: {
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -30,
//             verticalOverlap: 0,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 1,
//             scaleFactor: 1,
//             scaleStep: 0
//         },
//         vertical: {
//             style: 'VERTICAL_TOP_TO_BOTTOM',
//             horizontalOverlap: 0,
//             verticalOverlap: -40,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 1.5,
//             scaleFactor: 1,
//             scaleStep: 0.02
//         }
//     };

//     const updateConfig = (key, value) => {
//         setConfig(prev => ({ ...prev, [key]: value }));
//     };

//     const resetConfig = () => {
//         setConfig({
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -80,
//             verticalOverlap: 0,
//             maxRotation: 1.5,
//             randomRotation: false,
//             elevationStep: 2,
//             scaleFactor: 1,
//             scaleStep: 0.03
//         });
//     };

//     const applyPattern = (patternName) => {
//         const pattern = patterns[patternName];
//         if (pattern) {
//             setConfig(pattern);
//         }
//     };

//     const getStyleName = (style) => {
//         const styleNames = {
//             'HORIZONTAL_LEFT_TO_RIGHT': 'Horizontal: Left to Right',
//             'HORIZONTAL_RIGHT_TO_LEFT': 'Horizontal: Right to Left',
//             'VERTICAL_TOP_TO_BOTTOM': 'Vertical: Top to Bottom',
//             'VERTICAL_BOTTOM_TO_TOP': 'Vertical: Bottom to Top',
//             'CASCADE_TOP_LEFT': 'Cascade: Top Left',
//             'CASCADE_TOP_RIGHT': 'Cascade: Top Right',
//             'STACK_CENTERED': 'Stack: Centered'
//         };
//         return styleNames[style] || style;
//     };

//     const generateCode = () => {
//         return `// Add this code to your Fragment/Activity
// private fun setupRecyclerView() {
//     // Create and set adapter
//     val adapter = CardAdapter(items)
//     binding.recyclerView.adapter = adapter
    
//     // Apply overlapping effect with your configuration
//     OverlappingCardsHelper.Builder(binding.recyclerView)
//         .setStyle(OverlappingCardsHelper.OverlappingStyle.${config.style})
//         .setOverlapSize(horizontal = ${config.horizontalOverlap}, vertical = ${config.verticalOverlap})
//         .setRotation(maxAngle = ${config.maxRotation}f, random = ${config.randomRotation})
//         .setElevationStep(${config.elevationStep}f)
//         .setScaleEffect(${config.scaleFactor}f, ${config.scaleStep}f)
//         .build()
// }`;
//     };

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(generateCode()).then(() => {
//             alert('Code copied to clipboard!');
//         }).catch(err => {
//             console.error('Failed to copy: ', err);
//         });
//     };

//     const calculateCardPosition = (index) => {
//         let transform = 'translate(-50%, -50%)';
//         let left = '50%';
//         let top = '50%';

//         switch (config.style) {
//             case 'HORIZONTAL_LEFT_TO_RIGHT':
//                 left = `calc(50% + ${index * config.horizontalOverlap}px)`;
//                 break;
//             case 'HORIZONTAL_RIGHT_TO_LEFT':
//                 left = `calc(50% - ${index * config.horizontalOverlap}px)`;
//                 break;
//             case 'VERTICAL_TOP_TO_BOTTOM':
//                 top = `calc(50% + ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'VERTICAL_BOTTOM_TO_TOP':
//                 top = `calc(50% - ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'CASCADE_TOP_LEFT':
//                 left = `calc(50% + ${index * config.horizontalOverlap}px)`;
//                 top = `calc(50% + ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'CASCADE_TOP_RIGHT':
//                 left = `calc(50% - ${index * config.horizontalOverlap}px)`;
//                 top = `calc(50% + ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'STACK_CENTERED':
//                 left = `calc(50% + ${index * config.horizontalOverlap / 3}px)`;
//                 top = `calc(50% + ${index * config.verticalOverlap / 3}px)`;
//                 break;
//         }

//         // Apply rotation
//         if (config.maxRotation > 0) {
//             let rotation = 0;
//             if (config.randomRotation) {
//                 rotation = (Math.random() * 2 - 1) * config.maxRotation;
//             } else {
//                 rotation = ((index % 2) * 2 - 1) * config.maxRotation * (index % 3 + 1) / 3;
//             }
//             transform += ` rotate(${rotation}deg)`;
//         }

//         // Apply scaling
//         if (config.scaleStep > 0) {
//             const scale = Math.max(0.5, config.scaleFactor - (index * config.scaleStep));
//             transform += ` scale(${scale})`;
//         }

//         return { left, top, transform };
//     };

//     const calculateElevation = (index) => {
//         if (config.elevationStep > 0) {
//             const elevation = 4 + (index * config.elevationStep);
//             return `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)`;
//         }
//         return '0 4px 12px rgba(0,0,0,0.15)';
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-4">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-purple-800 mb-4">
//                         Overlapping Cards Preview
//                     </h1>
//                     <p className="text-gray-600 text-lg">
//                         Visualize how your RecyclerView cards will appear with different overlapping configurations
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Controls Section */}
//                     <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
//                         <h2 className="text-2xl font-semibold text-purple-800 mb-6 border-b pb-2">
//                             Configuration Controls
//                         </h2>

//                         {/* Quick Patterns */}
//                         <div className="mb-6">
//                             <h3 className="text-lg font-medium mb-3">Quick Patterns</h3>
//                             <div className="grid grid-cols-2 gap-2">
//                                 {Object.keys(patterns).map(pattern => (
//                                     <button
//                                         key={pattern}
//                                         onClick={() => applyPattern(pattern)}
//                                         className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 rounded transition-colors capitalize"
//                                     >
//                                         {pattern.replace(/([A-Z])/g, ' $1').trim()}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Style Selection */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium mb-2">Overlapping Style</label>
//                             <select
//                                 value={config.style}
//                                 onChange={(e) => updateConfig('style', e.target.value)}
//                                 className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                             >
//                                 <option value="HORIZONTAL_LEFT_TO_RIGHT">Horizontal: Left to Right</option>
//                                 <option value="HORIZONTAL_RIGHT_TO_LEFT">Horizontal: Right to Left</option>
//                                 <option value="VERTICAL_TOP_TO_BOTTOM">Vertical: Top to Bottom</option>
//                                 <option value="VERTICAL_BOTTOM_TO_TOP">Vertical: Bottom to Top</option>
//                                 <option value="CASCADE_TOP_LEFT">Cascade: Top Left</option>
//                                 <option value="CASCADE_TOP_RIGHT">Cascade: Top Right</option>
//                                 <option value="STACK_CENTERED">Stack: Centered</option>
//                             </select>
//                         </div>

//                         {/* Range Controls */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Horizontal Overlap: {config.horizontalOverlap}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="-150"
//                                     max="0"
//                                     value={config.horizontalOverlap}
//                                     onChange={(e) => updateConfig('horizontalOverlap', parseInt(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Vertical Overlap: {config.verticalOverlap}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="-150"
//                                     max="0"
//                                     value={config.verticalOverlap}
//                                     onChange={(e) => updateConfig('verticalOverlap', parseInt(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Maximum Rotation: {config.maxRotation}°
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="10"
//                                     step="0.5"
//                                     value={config.maxRotation}
//                                     onChange={(e) => updateConfig('maxRotation', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="flex items-center space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={config.randomRotation}
//                                         onChange={(e) => updateConfig('randomRotation', e.target.checked)}
//                                         className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                                     />
//                                     <span className="text-sm font-medium">Use Random Rotation</span>
//                                 </label>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Elevation Step: {config.elevationStep}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="10"
//                                     step="0.5"
//                                     value={config.elevationStep}
//                                     onChange={(e) => updateConfig('elevationStep', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Scale Factor: {config.scaleFactor}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0.5"
//                                     max="1.5"
//                                     step="0.05"
//                                     value={config.scaleFactor}
//                                     onChange={(e) => updateConfig('scaleFactor', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Scale Step: {config.scaleStep}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="0.2"
//                                     step="0.01"
//                                     value={config.scaleStep}
//                                     onChange={(e) => updateConfig('scaleStep', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             onClick={resetConfig}
//                             className="w-full mt-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
//                         >
//                             Reset to Default
//                         </button>
//                     </div>

//                     {/* Preview Section */}
//                     <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-2xl font-semibold text-purple-800">Live Preview</h2>
//                             <button
//                                 onClick={() => setShowCode(!showCode)}
//                                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
//                             >
//                                 {showCode ? 'Hide Code' : 'Show Code'}
//                             </button>
//                         </div>

//                         <div className="text-center mb-4 text-sm font-medium text-purple-700">
//                             Current Style: {getStyleName(config.style)}
//                         </div>

//                         {/* Preview Container - Fixed height and contained overflow */}
//                         <div className="relative h-96 border-2 border-gray-200 rounded-lg mb-6 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
//                             <div className="absolute inset-0 flex items-center justify-center">
//                                 <div className="relative w-full h-full">
//                                     {cardImages.map((image, index) => {
//                                         const position = calculateCardPosition(index);
//                                         return (
//                                             <div
//                                                 key={index}
//                                                 className="absolute w-48 h-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
//                                                 style={{
//                                                     left: position.left,
//                                                     top: position.top,
//                                                     transform: position.transform,
//                                                     boxShadow: calculateElevation(index),
//                                                     zIndex: 5 - index
//                                                 }}
//                                             >
//                                                 <div
//                                                     className="h-3/4 bg-cover bg-center"
//                                                     style={{ backgroundImage: `url(${image})` }}
//                                                 />
//                                                 <div className="h-1/4 flex items-center justify-center bg-white text-xs font-medium text-gray-700 px-2">
//                                                     {cardTitles[index]}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Code Section - Moved below preview */}
//                         {showCode && (
//                             <div className="mt-6">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <h3 className="text-lg font-semibold text-gray-800">Kotlin Implementation</h3>
//                                     <button
//                                         onClick={copyToClipboard}
//                                         className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
//                                     >
//                                         Copy Code
//                                     </button>
//                                 </div>
//                                 <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
//                                     <code>{generateCode()}</code>
//                                 </pre>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="text-center mt-8 text-gray-500 text-sm">
//                     <p>Configure your overlapping cards layout and copy the generated Kotlin code for your Android project.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OverlappingCardsPreview;

// import React, { useState, useEffect } from 'react';

// const OverlappingCardsPreview = () => {
//     // Sample data for cards
//     const cardImages = [
//         'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80', // Mountains
//         'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=500&q=80', // Ocean
//         'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80', // Forest
//         'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', // Valley
//         'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=500&q=80'  // Desert
//     ];

//     const cardTitles = [
//         'Mountains View',
//         'Ocean Waves',
//         'Forest Path',
//         'Valley Ridge',
//         'Desert Dunes'
//     ];

//     // Configuration state
//     const [config, setConfig] = useState({
//         style: 'HORIZONTAL_LEFT_TO_RIGHT',
//         horizontalOverlap: -80,
//         verticalOverlap: 0,
//         maxRotation: 1.5,
//         randomRotation: false,
//         elevationStep: 2,
//         scaleFactor: 1,
//         scaleStep: 0.03
//     });

//     const [showCode, setShowCode] = useState(false);
//     const [showcaseMode, setShowcaseMode] = useState('cards'); // 'cards', 'list', 'grid'

//     // Predefined patterns
//     const patterns = {
//         fan: {
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -65,
//             verticalOverlap: 0,
//             maxRotation: 4,
//             randomRotation: false,
//             elevationStep: 1,
//             scaleFactor: 1,
//             scaleStep: 0.02
//         },
//         stack: {
//             style: 'STACK_CENTERED',
//             horizontalOverlap: -20,
//             verticalOverlap: -20,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 3,
//             scaleFactor: 1,
//             scaleStep: 0.05
//         },
//         cascade: {
//             style: 'CASCADE_TOP_LEFT',
//             horizontalOverlap: -60,
//             verticalOverlap: -15,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 2,
//             scaleFactor: 1,
//             scaleStep: 0.03
//         },
//         staggered: {
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -70,
//             verticalOverlap: 0,
//             maxRotation: 3,
//             randomRotation: true,
//             elevationStep: 1.5,
//             scaleFactor: 1,
//             scaleStep: 0.02
//         },
//         tight: {
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -30,
//             verticalOverlap: 0,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 1,
//             scaleFactor: 1,
//             scaleStep: 0
//         },
//         vertical: {
//             style: 'VERTICAL_TOP_TO_BOTTOM',
//             horizontalOverlap: 0,
//             verticalOverlap: -40,
//             maxRotation: 0,
//             randomRotation: false,
//             elevationStep: 1.5,
//             scaleFactor: 1,
//             scaleStep: 0.02
//         }
//     };

//     const updateConfig = (key, value) => {
//         setConfig(prev => ({ ...prev, [key]: value }));
//     };

//     const resetConfig = () => {
//         setConfig({
//             style: 'HORIZONTAL_LEFT_TO_RIGHT',
//             horizontalOverlap: -80,
//             verticalOverlap: 0,
//             maxRotation: 1.5,
//             randomRotation: false,
//             elevationStep: 2,
//             scaleFactor: 1,
//             scaleStep: 0.03
//         });
//     };

//     const applyPattern = (patternName) => {
//         const pattern = patterns[patternName];
//         if (pattern) {
//             setConfig(pattern);
//         }
//     };

//     const getStyleName = (style) => {
//         const styleNames = {
//             'HORIZONTAL_LEFT_TO_RIGHT': 'Horizontal: Left to Right',
//             'HORIZONTAL_RIGHT_TO_LEFT': 'Horizontal: Right to Left',
//             'VERTICAL_TOP_TO_BOTTOM': 'Vertical: Top to Bottom',
//             'VERTICAL_BOTTOM_TO_TOP': 'Vertical: Bottom to Top',
//             'CASCADE_TOP_LEFT': 'Cascade: Top Left',
//             'CASCADE_TOP_RIGHT': 'Cascade: Top Right',
//             'STACK_CENTERED': 'Stack: Centered'
//         };
//         return styleNames[style] || style;
//     };

//     const generateCode = () => {
//         return `// Add this code to your Fragment/Activity
// private fun setupRecyclerView() {
//     // Create and set adapter
//     val adapter = CardAdapter(items)
//     binding.recyclerView.adapter = adapter
    
//     // Apply overlapping effect with your configuration
//     OverlappingCardsHelper.Builder(binding.recyclerView)
//         .setStyle(OverlappingCardsHelper.OverlappingStyle.${config.style})
//         .setOverlapSize(horizontal = ${config.horizontalOverlap}, vertical = ${config.verticalOverlap})
//         .setRotation(maxAngle = ${config.maxRotation}f, random = ${config.randomRotation})
//         .setElevationStep(${config.elevationStep}f)
//         .setScaleEffect(${config.scaleFactor}f, ${config.scaleStep}f)
//         .build()
// }`;
//     };

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(generateCode()).then(() => {
//             alert('Code copied to clipboard!');
//         }).catch(err => {
//             console.error('Failed to copy: ', err);
//         });
//     };

//     const calculateCardPosition = (index) => {
//         let transform = 'translate(-50%, -50%)';
//         let left = '50%';
//         let top = '50%';

//         switch (config.style) {
//             case 'HORIZONTAL_LEFT_TO_RIGHT':
//                 left = `calc(50% + ${index * config.horizontalOverlap}px)`;
//                 break;
//             case 'HORIZONTAL_RIGHT_TO_LEFT':
//                 left = `calc(50% - ${index * config.horizontalOverlap}px)`;
//                 break;
//             case 'VERTICAL_TOP_TO_BOTTOM':
//                 top = `calc(50% + ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'VERTICAL_BOTTOM_TO_TOP':
//                 top = `calc(50% - ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'CASCADE_TOP_LEFT':
//                 left = `calc(50% + ${index * config.horizontalOverlap}px)`;
//                 top = `calc(50% + ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'CASCADE_TOP_RIGHT':
//                 left = `calc(50% - ${index * config.horizontalOverlap}px)`;
//                 top = `calc(50% + ${index * config.verticalOverlap}px)`;
//                 break;
//             case 'STACK_CENTERED':
//                 left = `calc(50% + ${index * config.horizontalOverlap / 3}px)`;
//                 top = `calc(50% + ${index * config.verticalOverlap / 3}px)`;
//                 break;
//         }

//         // Apply rotation
//         if (config.maxRotation > 0) {
//             let rotation = 0;
//             if (config.randomRotation) {
//                 rotation = (Math.random() * 2 - 1) * config.maxRotation;
//             } else {
//                 rotation = ((index % 2) * 2 - 1) * config.maxRotation * (index % 3 + 1) / 3;
//             }
//             transform += ` rotate(${rotation}deg)`;
//         }

//         // Apply scaling
//         if (config.scaleStep > 0) {
//             const scale = Math.max(0.5, config.scaleFactor - (index * config.scaleStep));
//             transform += ` scale(${scale})`;
//         }

//         return { left, top, transform };
//     };

//     const calculateElevation = (index) => {
//         if (config.elevationStep > 0) {
//             const elevation = 4 + (index * config.elevationStep);
//             return `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)`;
//         }
//         return '0 4px 12px rgba(0,0,0,0.15)';
//     };

//     const renderPreview = () => {
//         if (showcaseMode === 'list') {
//             return (
//                 <div className="space-y-4 p-4">
//                     {cardImages.map((image, index) => (
//                         <div
//                             key={index}
//                             className="flex bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
//                             style={{
//                                 marginLeft: `${index * Math.abs(config.horizontalOverlap) / 4}px`,
//                                 transform: config.maxRotation > 0 ?
//                                     `rotate(${((index % 2) * 2 - 1) * config.maxRotation * 0.5}deg)` : 'none'
//                             }}
//                         >
//                             <img
//                                 src={image}
//                                 alt={cardTitles[index]}
//                                 className="w-20 h-20 object-cover"
//                             />
//                             <div className="p-3 flex-1 flex items-center">
//                                 <span className="font-medium text-gray-800">{cardTitles[index]}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             );
//         }

//         if (showcaseMode === 'grid') {
//             return (
//                 <div className="grid grid-cols-2 gap-3 p-4">
//                     {cardImages.map((image, index) => (
//                         <div
//                             key={index}
//                             className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
//                             style={{
//                                 transform: config.maxRotation > 0 ?
//                                     `rotate(${((index % 2) * 2 - 1) * config.maxRotation}deg) scale(${1 - index * config.scaleStep * 0.5})` :
//                                     `scale(${1 - index * config.scaleStep * 0.5})`,
//                                 zIndex: 5 - index
//                             }}
//                         >
//                             <img
//                                 src={image}
//                                 alt={cardTitles[index]}
//                                 className="w-full h-24 object-cover"
//                             />
//                             <div className="p-2 text-center">
//                                 <span className="text-sm font-medium text-gray-800">{cardTitles[index]}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             );
//         }

//         // Default cards mode
//         return (
//             <div className="relative w-full h-full">
//                 {cardImages.map((image, index) => {
//                     const position = calculateCardPosition(index);
//                     return (
//                         <div
//                             key={index}
//                             className="absolute w-48 h-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
//                             style={{
//                                 left: position.left,
//                                 top: position.top,
//                                 transform: position.transform,
//                                 boxShadow: calculateElevation(index),
//                                 zIndex: 5 - index
//                             }}
//                         >
//                             <div
//                                 className="h-3/4 bg-cover bg-center"
//                                 style={{ backgroundImage: `url(${image})` }}
//                             />
//                             <div className="h-1/4 flex items-center justify-center bg-white text-xs font-medium text-gray-700 px-2">
//                                 {cardTitles[index]}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-4">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-purple-800 mb-4">
//                         Overlapping Cards Preview
//                     </h1>
//                     <p className="text-gray-600 text-lg">
//                         Visualize how your RecyclerView cards will appear with different overlapping configurations
//                     </p>
//                 </div>

//                 {/* Main Layout - Side by Side */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Controls Section */}
//                     <div className="bg-white rounded-lg shadow-lg p-6 max-h-[800px] overflow-y-auto">
//                         <h2 className="text-2xl font-semibold text-purple-800 mb-6 border-b pb-2">
//                             Configuration Controls
//                         </h2>

//                         {/* Quick Patterns */}
//                         <div className="mb-6">
//                             <h3 className="text-lg font-medium mb-3">Quick Patterns</h3>
//                             <div className="grid grid-cols-2 gap-2">
//                                 {Object.keys(patterns).map(pattern => (
//                                     <button
//                                         key={pattern}
//                                         onClick={() => applyPattern(pattern)}
//                                         className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 rounded transition-colors capitalize"
//                                     >
//                                         {pattern.replace(/([A-Z])/g, ' $1').trim()}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Style Selection */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium mb-2">Overlapping Style</label>
//                             <select
//                                 value={config.style}
//                                 onChange={(e) => updateConfig('style', e.target.value)}
//                                 className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                             >
//                                 <option value="HORIZONTAL_LEFT_TO_RIGHT">Horizontal: Left to Right</option>
//                                 <option value="HORIZONTAL_RIGHT_TO_LEFT">Horizontal: Right to Left</option>
//                                 <option value="VERTICAL_TOP_TO_BOTTOM">Vertical: Top to Bottom</option>
//                                 <option value="VERTICAL_BOTTOM_TO_TOP">Vertical: Bottom to Top</option>
//                                 <option value="CASCADE_TOP_LEFT">Cascade: Top Left</option>
//                                 <option value="CASCADE_TOP_RIGHT">Cascade: Top Right</option>
//                                 <option value="STACK_CENTERED">Stack: Centered</option>
//                             </select>
//                         </div>

//                         {/* Range Controls */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Horizontal Overlap: {config.horizontalOverlap}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="-150"
//                                     max="0"
//                                     value={config.horizontalOverlap}
//                                     onChange={(e) => updateConfig('horizontalOverlap', parseInt(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Vertical Overlap: {config.verticalOverlap}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="-150"
//                                     max="0"
//                                     value={config.verticalOverlap}
//                                     onChange={(e) => updateConfig('verticalOverlap', parseInt(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Maximum Rotation: {config.maxRotation}°
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="10"
//                                     step="0.5"
//                                     value={config.maxRotation}
//                                     onChange={(e) => updateConfig('maxRotation', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="flex items-center space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={config.randomRotation}
//                                         onChange={(e) => updateConfig('randomRotation', e.target.checked)}
//                                         className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                                     />
//                                     <span className="text-sm font-medium">Use Random Rotation</span>
//                                 </label>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Elevation Step: {config.elevationStep}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="10"
//                                     step="0.5"
//                                     value={config.elevationStep}
//                                     onChange={(e) => updateConfig('elevationStep', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Scale Factor: {config.scaleFactor}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0.5"
//                                     max="1.5"
//                                     step="0.05"
//                                     value={config.scaleFactor}
//                                     onChange={(e) => updateConfig('scaleFactor', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Scale Step: {config.scaleStep}
//                                 </label>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="0.2"
//                                     step="0.01"
//                                     value={config.scaleStep}
//                                     onChange={(e) => updateConfig('scaleStep', parseFloat(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             onClick={resetConfig}
//                             className="w-full mt-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
//                         >
//                             Reset to Default
//                         </button>
//                     </div>

//                     {/* Preview Section */}
//                     <div className="bg-white rounded-lg shadow-lg p-6 max-h-[800px] flex flex-col">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-2xl font-semibold text-purple-800">Live Preview</h2>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => setShowcaseMode('cards')}
//                                     className={`px-3 py-1 text-sm rounded transition-colors ${showcaseMode === 'cards'
//                                             ? 'bg-purple-600 text-white'
//                                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                         }`}
//                                 >
//                                     Cards
//                                 </button>
//                                 <button
//                                     onClick={() => setShowcaseMode('list')}
//                                     className={`px-3 py-1 text-sm rounded transition-colors ${showcaseMode === 'list'
//                                             ? 'bg-purple-600 text-white'
//                                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                         }`}
//                                 >
//                                     List
//                                 </button>
//                                 <button
//                                     onClick={() => setShowcaseMode('grid')}
//                                     className={`px-3 py-1 text-sm rounded transition-colors ${showcaseMode === 'grid'
//                                             ? 'bg-purple-600 text-white'
//                                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                         }`}
//                                 >
//                                     Grid
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="text-center mb-4 text-sm font-medium text-purple-700">
//                             Current Style: {getStyleName(config.style)} | Mode: {showcaseMode.charAt(0).toUpperCase() + showcaseMode.slice(1)}
//                         </div>

//                         {/* Preview Container */}
//                         <div className="flex-1 border-2 border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
//                             <div className="w-full h-full flex items-center justify-center relative">
//                                 {renderPreview()}
//                             </div>
//                         </div>

//                         <div className="mt-4 flex justify-center">
//                             <button
//                                 onClick={() => setShowCode(!showCode)}
//                                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
//                             >
//                                 {showCode ? 'Hide Code' : 'Show Kotlin Code'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Code Section - Full Width Below */}
//                 {showCode && (
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-semibold text-gray-800">Kotlin Implementation Code</h3>
//                             <button
//                                 onClick={copyToClipboard}
//                                 className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
//                             >
//                                 Copy Code
//                             </button>
//                         </div>
//                         <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
//                             <code>{generateCode()}</code>
//                         </pre>
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className="text-center mt-8 text-gray-500 text-sm">
//                     <p>Configure your overlapping cards layout and copy the generated Kotlin code for your Android project.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OverlappingCardsPreview;

import React, { useState, useEffect } from 'react';

const OverlappingCardsPreview = () => {
    // Sample data for cards
    const cardImages = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80', // Mountains
        'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=500&q=80', // Ocean
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80', // Forest
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', // Valley
        'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=500&q=80'  // Desert
    ];

    const cardTitles = [
        'Mountains View',
        'Ocean Waves',
        'Forest Path',
        'Valley Ridge',
        'Desert Dunes'
    ];

    // Configuration state
    const [config, setConfig] = useState({
        style: 'HORIZONTAL_LEFT_TO_RIGHT',
        horizontalOverlap: -80,
        verticalOverlap: 0,
        maxRotation: 1.5,
        randomRotation: false,
        elevationStep: 2,
        scaleFactor: 1,
        scaleStep: 0.03
    });

    const [showCode, setShowCode] = useState(false);
    const [showcaseMode, setShowcaseMode] = useState('cards'); // 'cards', 'list', 'grid'

    // Predefined patterns
    const patterns = {
        fan: {
            style: 'STACK_CENTERED', // Use centered style for fan layout
            horizontalOverlap: 60, // Positive value for spreading out
            verticalOverlap: 0,
            maxRotation: 12,
            randomRotation: false,
            elevationStep: 2,
            scaleFactor: 1,
            scaleStep: 0.05
        },
        stack: {
            style: 'STACK_CENTERED',
            horizontalOverlap: -20,
            verticalOverlap: -20,
            maxRotation: 0,
            randomRotation: false,
            elevationStep: 3,
            scaleFactor: 1,
            scaleStep: 0.05
        },
        cascade: {
            style: 'CASCADE_TOP_LEFT',
            horizontalOverlap: -60,
            verticalOverlap: -15,
            maxRotation: 0,
            randomRotation: false,
            elevationStep: 2,
            scaleFactor: 1,
            scaleStep: 0.03
        },
        staggered: {
            style: 'HORIZONTAL_LEFT_TO_RIGHT',
            horizontalOverlap: -70,
            verticalOverlap: 0,
            maxRotation: 3,
            randomRotation: true,
            elevationStep: 1.5,
            scaleFactor: 1,
            scaleStep: 0.02
        },
        tight: {
            style: 'HORIZONTAL_LEFT_TO_RIGHT',
            horizontalOverlap: -30,
            verticalOverlap: 0,
            maxRotation: 0,
            randomRotation: false,
            elevationStep: 1,
            scaleFactor: 1,
            scaleStep: 0
        },
        vertical: {
            style: 'VERTICAL_TOP_TO_BOTTOM',
            horizontalOverlap: 0,
            verticalOverlap: -40,
            maxRotation: 0,
            randomRotation: false,
            elevationStep: 1.5,
            scaleFactor: 1,
            scaleStep: 0.02
        }
    };

    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const resetConfig = () => {
        setConfig({
            style: 'HORIZONTAL_LEFT_TO_RIGHT',
            horizontalOverlap: -80,
            verticalOverlap: 0,
            maxRotation: 1.5,
            randomRotation: false,
            elevationStep: 2,
            scaleFactor: 1,
            scaleStep: 0.03
        });
    };

    const applyPattern = (patternName) => {
        const pattern = patterns[patternName];
        if (pattern) {
            setConfig(pattern);
        }
    };

    const getStyleName = (style) => {
        const styleNames = {
            'HORIZONTAL_LEFT_TO_RIGHT': 'Horizontal: Left to Right',
            'HORIZONTAL_RIGHT_TO_LEFT': 'Horizontal: Right to Left',
            'VERTICAL_TOP_TO_BOTTOM': 'Vertical: Top to Bottom',
            'VERTICAL_BOTTOM_TO_TOP': 'Vertical: Bottom to Top',
            'CASCADE_TOP_LEFT': 'Cascade: Top Left',
            'CASCADE_TOP_RIGHT': 'Cascade: Top Right',
            'STACK_CENTERED': 'Stack: Centered'
        };
        return styleNames[style] || style;
    };

    const generateCode = () => {
        return `// Add this code to your Fragment/Activity
private fun setupRecyclerView() {
    // Create and set adapter
    val adapter = CardAdapter(items)
    binding.recyclerView.adapter = adapter
    
    // Apply overlapping effect with your configuration
    OverlappingCardsHelper.Builder(binding.recyclerView)
        .setStyle(OverlappingCardsHelper.OverlappingStyle.${config.style})
        .setOverlapSize(horizontal = ${config.horizontalOverlap}, vertical = ${config.verticalOverlap})
        .setRotation(maxAngle = ${config.maxRotation}f, random = ${config.randomRotation})
        .setElevationStep(${config.elevationStep}f)
        .setScaleEffect(${config.scaleFactor}f, ${config.scaleStep}f)
        .build()
}`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateCode()).then(() => {
            alert('Code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const calculateCardPosition = (index) => {
        let transform = 'translate(-50%, -50%)';
        let left = '50%';
        let top = '50%';

        switch (config.style) {
            case 'HORIZONTAL_LEFT_TO_RIGHT':
                left = `calc(50% + ${index * config.horizontalOverlap}px)`;
                break;
            case 'HORIZONTAL_RIGHT_TO_LEFT':
                left = `calc(50% - ${index * config.horizontalOverlap}px)`;
                break;
            case 'VERTICAL_TOP_TO_BOTTOM':
                top = `calc(50% + ${index * config.verticalOverlap}px)`;
                break;
            case 'VERTICAL_BOTTOM_TO_TOP':
                top = `calc(50% - ${index * config.verticalOverlap}px)`;
                break;
            case 'CASCADE_TOP_LEFT':
                left = `calc(50% + ${index * config.horizontalOverlap}px)`;
                top = `calc(50% + ${index * config.verticalOverlap}px)`;
                break;
            case 'CASCADE_TOP_RIGHT':
                left = `calc(50% - ${index * config.horizontalOverlap}px)`;
                top = `calc(50% + ${index * config.verticalOverlap}px)`;
                break;
            case 'STACK_CENTERED':
                if (config.maxRotation > 8) { // Fan layout special case
                    // Create a true fan layout centered around the middle card
                    const centerIndex = 2;
                    const offset = index - centerIndex;
                    left = `calc(50% + ${offset * config.horizontalOverlap}px)`;
                    top = `calc(50% + ${index * config.verticalOverlap / 3}px)`;
                } else {
                    // Regular stack centered
                    left = `calc(50% + ${index * config.horizontalOverlap / 3}px)`;
                    top = `calc(50% + ${index * config.verticalOverlap / 3}px)`;
                }
                break;
        }

        // Apply rotation
        if (config.maxRotation > 0) {
            let rotation = 0;
            if (config.randomRotation) {
                rotation = (Math.random() * 2 - 1) * config.maxRotation;
            } else {
                if (config.maxRotation > 8) { // Fan layout special rotation
                    const centerIndex = 2;
                    const offset = index - centerIndex;
                    rotation = offset * (config.maxRotation / 2); // More spread for fan effect
                } else {
                    rotation = ((index % 2) * 2 - 1) * config.maxRotation * (index % 3 + 1) / 3;
                }
            }
            transform += ` rotate(${rotation}deg)`;
        }

        // Apply scaling
        if (config.scaleStep > 0) {
            let scale;
            if (config.maxRotation > 8) { // Fan layout special scaling
                const centerIndex = 2;
                const distanceFromCenter = Math.abs(index - centerIndex);
                scale = Math.max(0.7, config.scaleFactor - (distanceFromCenter * config.scaleStep));
            } else {
                scale = Math.max(0.5, config.scaleFactor - (index * config.scaleStep));
            }
            transform += ` scale(${scale})`;
        }

        return { left, top, transform };
    };

    const calculateElevation = (index) => {
        if (config.elevationStep > 0) {
            const elevation = 4 + (index * config.elevationStep);
            return `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)`;
        }
        return '0 4px 12px rgba(0,0,0,0.15)';
    };

    const renderPreview = () => {
        if (showcaseMode === 'list') {
            return (
                <div className="space-y-4 p-4">
                    {cardImages.map((image, index) => (
                        <div
                            key={index}
                            className="flex bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                            style={{
                                marginLeft: `${index * Math.abs(config.horizontalOverlap) / 4}px`,
                                transform: config.maxRotation > 0 ?
                                    `rotate(${((index % 2) * 2 - 1) * config.maxRotation * 0.5}deg)` : 'none'
                            }}
                        >
                            <img
                                src={image}
                                alt={cardTitles[index]}
                                className="w-20 h-20 object-cover"
                            />
                            <div className="p-3 flex-1 flex items-center">
                                <span className="font-medium text-gray-800">{cardTitles[index]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (showcaseMode === 'grid') {
            return (
                <div className="grid grid-cols-2 gap-3 p-4">
                    {cardImages.map((image, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
                            style={{
                                transform: config.maxRotation > 0 ?
                                    `rotate(${((index % 2) * 2 - 1) * config.maxRotation}deg) scale(${1 - index * config.scaleStep * 0.5})` :
                                    `scale(${1 - index * config.scaleStep * 0.5})`,
                                zIndex: 5 - index
                            }}
                        >
                            <img
                                src={image}
                                alt={cardTitles[index]}
                                className="w-full h-24 object-cover"
                            />
                            <div className="p-2 text-center">
                                <span className="text-sm font-medium text-gray-800">{cardTitles[index]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Default cards mode
        return (
            <div className="relative w-full h-full">
                {cardImages.map((image, index) => {
                    const position = calculateCardPosition(index);
                    return (
                        <div
                            key={index}
                            className="absolute w-48 h-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
                            style={{
                                left: position.left,
                                top: position.top,
                                transform: position.transform,
                                boxShadow: calculateElevation(index),
                                zIndex: 5 - index
                            }}
                        >
                            <div
                                className="h-3/4 bg-cover bg-center"
                                style={{ backgroundImage: `url(${image})` }}
                            />
                            <div className="h-1/4 flex items-center justify-center bg-white text-xs font-medium text-gray-700 px-2">
                                {cardTitles[index]}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-purple-800 mb-4">
                        Overlapping Cards Preview
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Visualize how your RecyclerView cards will appear with different overlapping configurations
                    </p>
                </div>

                {/* Main Layout - Side by Side */}
                <div className="flex gap-6 mb-8 min-h-[600px]">
                    {/* Controls Section */}
                    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
                        <h2 className="text-2xl font-semibold text-purple-800 mb-6 border-b pb-2">
                            Configuration Controls
                        </h2>

                        {/* Quick Patterns */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Quick Patterns</h3>

                            {/* Featured Pattern - Center */}
                            <div className="mb-4">
                                <div className="relative bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-4 border-2 border-purple-200">
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                        Featured
                                    </div>
                                    <button
                                        onClick={() => applyPattern('fan')}
                                        className="w-full text-left"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-purple-800">Fan Layout</h4>
                                            <div className="relative flex items-center justify-center w-20 h-8">
                                                {/* Left card */}
                                                <div
                                                    className="absolute w-6 h-4 bg-gradient-to-br from-green-200 to-green-300 rounded shadow-sm border border-white"
                                                    style={{
                                                        transform: `translateX(-12px) rotate(-15deg)`,
                                                        zIndex: 1
                                                    }}
                                                />
                                                {/* Center card - prominent */}
                                                <div
                                                    className="absolute w-7 h-5 bg-gradient-to-br from-purple-200 to-purple-300 rounded shadow-md border-2 border-white"
                                                    style={{
                                                        transform: `translateX(0px) rotate(0deg)`,
                                                        zIndex: 3
                                                    }}
                                                />
                                                {/* Right card */}
                                                <div
                                                    className="absolute w-6 h-4 bg-gradient-to-br from-blue-200 to-blue-300 rounded shadow-sm border border-white"
                                                    style={{
                                                        transform: `translateX(12px) rotate(15deg)`,
                                                        zIndex: 2
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-purple-600">Center card prominently displayed with side cards fanned out</p>
                                    </button>
                                </div>
                            </div>

                            {/* Side Patterns */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/* Left Side */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => applyPattern('stack')}
                                        className="w-full p-3 bg-white border-2 border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-800">Stack</span>
                                            <div className="relative">
                                                {[0, 1, 2].map(i => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-4 h-3 bg-gray-300 rounded border"
                                                        style={{
                                                            transform: `translate(${i * 2}px, ${i * 2}px)`,
                                                            zIndex: 3 - i
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-left">Centered stacking</p>
                                    </button>

                                    <button
                                        onClick={() => applyPattern('cascade')}
                                        className="w-full p-3 bg-white border-2 border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-800">Cascade</span>
                                            <div className="relative">
                                                {[0, 1, 2].map(i => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-4 h-3 bg-gray-300 rounded border"
                                                        style={{
                                                            transform: `translate(${i * 3}px, ${i * 1.5}px)`,
                                                            zIndex: 3 - i
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-left">Diagonal flow</p>
                                    </button>
                                </div>

                                {/* Right Side */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => applyPattern('staggered')}
                                        className="w-full p-3 bg-white border-2 border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-800">Staggered</span>
                                            <div className="relative">
                                                {[0, 1, 2].map(i => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-4 h-3 bg-gray-300 rounded border"
                                                        style={{
                                                            transform: `translateX(${-i * 6}px) rotate(${(Math.random() - 0.5) * 20}deg)`,
                                                            zIndex: 3 - i
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-left">Random rotation</p>
                                    </button>

                                    <button
                                        onClick={() => applyPattern('vertical')}
                                        className="w-full p-3 bg-white border-2 border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-800">Vertical</span>
                                            <div className="relative">
                                                {[0, 1, 2].map(i => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-4 h-3 bg-gray-300 rounded border"
                                                        style={{
                                                            transform: `translateY(${-i * 4}px)`,
                                                            zIndex: 3 - i
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-left">Top to bottom</p>
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Pattern */}
                            <button
                                onClick={() => applyPattern('tight')}
                                className="w-full p-3 bg-gray-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <span className="text-sm font-medium text-gray-800 block">Tight Overlap</span>
                                        <p className="text-xs text-gray-500">Minimal spacing</p>
                                    </div>
                                    <div className="relative">
                                        {[0, 1, 2, 3].map(i => (
                                            <div
                                                key={i}
                                                className="absolute w-3 h-3 bg-gray-400 rounded border"
                                                style={{
                                                    transform: `translateX(${-i * 4}px)`,
                                                    zIndex: 4 - i
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Style Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Overlapping Style</label>
                            <select
                                value={config.style}
                                onChange={(e) => updateConfig('style', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="HORIZONTAL_LEFT_TO_RIGHT">Horizontal: Left to Right</option>
                                <option value="HORIZONTAL_RIGHT_TO_LEFT">Horizontal: Right to Left</option>
                                <option value="VERTICAL_TOP_TO_BOTTOM">Vertical: Top to Bottom</option>
                                <option value="VERTICAL_BOTTOM_TO_TOP">Vertical: Bottom to Top</option>
                                <option value="CASCADE_TOP_LEFT">Cascade: Top Left</option>
                                <option value="CASCADE_TOP_RIGHT">Cascade: Top Right</option>
                                <option value="STACK_CENTERED">Stack: Centered</option>
                            </select>
                        </div>

                        {/* Range Controls */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Horizontal Overlap: {config.horizontalOverlap}
                                </label>
                                <input
                                    type="range"
                                    min="-150"
                                    max="150"
                                    value={config.horizontalOverlap}
                                    onChange={(e) => updateConfig('horizontalOverlap', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Vertical Overlap: {config.verticalOverlap}
                                </label>
                                <input
                                    type="range"
                                    min="-150"
                                    max="150"
                                    value={config.verticalOverlap}
                                    onChange={(e) => updateConfig('verticalOverlap', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Maximum Rotation: {config.maxRotation}°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={config.maxRotation}
                                    onChange={(e) => updateConfig('maxRotation', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={config.randomRotation}
                                        onChange={(e) => updateConfig('randomRotation', e.target.checked)}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium">Use Random Rotation</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Elevation Step: {config.elevationStep}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={config.elevationStep}
                                    onChange={(e) => updateConfig('elevationStep', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Scale Factor: {config.scaleFactor}
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.05"
                                    value={config.scaleFactor}
                                    onChange={(e) => updateConfig('scaleFactor', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Scale Step: {config.scaleStep}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="0.2"
                                    step="0.01"
                                    value={config.scaleStep}
                                    onChange={(e) => updateConfig('scaleStep', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            onClick={resetConfig}
                            className="w-full mt-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                            Reset to Default
                        </button>
                    </div>

                    {/* Preview Section */}
                    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-purple-800">Live Preview</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowcaseMode('cards')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${showcaseMode === 'cards'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setShowcaseMode('list')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${showcaseMode === 'list'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    List
                                </button>
                                <button
                                    onClick={() => setShowcaseMode('grid')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${showcaseMode === 'grid'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Grid
                                </button>
                            </div>
                        </div>

                        <div className="text-center mb-4 text-sm font-medium text-purple-700">
                            Current Style: {getStyleName(config.style)} | Mode: {showcaseMode.charAt(0).toUpperCase() + showcaseMode.slice(1)}
                        </div>

                        {/* Preview Container */}
                        <div className="flex-1 border-2 border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                            <div className="w-full h-full flex items-center justify-center relative">
                                {renderPreview()}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setShowCode(!showCode)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                            >
                                {showCode ? 'Hide Code' : 'Show Kotlin Code'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Code Section - Full Width Below */}
                {showCode && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Kotlin Implementation Code</h3>
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                            >
                                Copy Code
                            </button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{generateCode()}</code>
                        </pre>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Configure your overlapping cards layout and copy the generated Kotlin code for your Android project.</p>
                </div>
            </div>
        </div>
    );
};

export default OverlappingCardsPreview;