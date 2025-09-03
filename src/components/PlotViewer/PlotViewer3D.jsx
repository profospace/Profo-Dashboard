// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
// import * as THREE from 'three';
// import HoverPanel from './HoverPanel';

// const PlotBlock = ({ position, dimensions, color, metadata, onHover, onLeave, isSelected }) => {
//   const meshRef = useRef();
//   const [hovered, setHovered] = useState(false);

//   useFrame((state) => {
//     if (meshRef.current) {
//       if (hovered || isSelected) {
//         meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.3, 0.1);
//         meshRef.current.material.emissive.setHex(0x444444);
//       } else {
//         meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
//         meshRef.current.material.emissive.setHex(0x000000);
//       }
//     }
//   });

//   const handlePointerEnter = (e) => {
//     e.stopPropagation();
//     setHovered(true);
//     onHover(metadata, e.point);
//     document.body.style.cursor = 'pointer';
//   };

//   const handlePointerLeave = (e) => {
//     e.stopPropagation();
//     setHovered(false);
//     onLeave();
//     document.body.style.cursor = 'default';
//   };

//   return (
//     <mesh
//       ref={meshRef}
//       position={position}
//       onPointerEnter={handlePointerEnter}
//       onPointerLeave={handlePointerLeave}
//     >
//       <boxGeometry args={dimensions} />
//       <meshStandardMaterial 
//         color={color}
//         metalness={0.3}
//         roughness={0.4}
//         transparent
//         opacity={hovered || isSelected ? 0.9 : 0.8}
//       />
      
//       {/* Plot borders */}
//       <lineSegments>
//         <edgesGeometry args={[new THREE.BoxGeometry(...dimensions)]} />
//         <lineBasicMaterial color={hovered || isSelected ? '#ffffff' : '#666666'} />
//       </lineSegments>
//     </mesh>
//   );
// };

// const CameraController = () => {
//   const { camera } = useThree();
  
//   useEffect(() => {
//     camera.position.set(8, 6, 8);
//     camera.lookAt(0, 0, 0);
//   }, [camera]);

//   return null;
// };

// const PlotViewer3D = ({ plotData, selectedPlot, setSelectedPlot, backgroundImage }) => {
//   const [hoveredPlot, setHoveredPlot] = useState(null);
//   const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

//   const handlePlotHover = (metadata, worldPosition) => {
//     setHoveredPlot(metadata);
//     // Convert 3D world position to screen coordinates would need more complex calculation
//     // For now, using mouse position
//     setHoverPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
//   };

//   const handlePlotLeave = () => {
//     setHoveredPlot(null);
//   };

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (hoveredPlot) {
//         setHoverPosition({ x: e.clientX, y: e.clientY });
//       }
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [hoveredPlot]);

//   if (!plotData) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading 3D visualization...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-full w-full">
//       {/* Background Image Overlay */}
//       {backgroundImage && (
//         <div 
//           className="absolute inset-0 opacity-10 bg-cover bg-center z-0"
//           style={{ backgroundImage: `url(${backgroundImage.url})` }}
//         />
//       )}

//       {/* 3D Canvas */}
//       <Canvas className="relative z-10">
//         <CameraController />
        
//         {/* Lighting */}
//         <ambientLight intensity={0.4} />
//         <directionalLight 
//           position={[10, 10, 5]} 
//           intensity={1.2} 
//           castShadow
//           shadow-mapSize={[2048, 2048]}
//         />
//         <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

//         {/* Environment */}
//         <Environment preset="sunset" />
        
//         {/* Ground Grid */}
//         <Grid 
//           args={[20, 20]} 
//           cellSize={1} 
//           cellThickness={0.5} 
//           cellColor="#444444" 
//           sectionSize={5} 
//           sectionThickness={1} 
//           sectionColor="#666666"
//           position={[0, -0.01, 0]}
//         />

//         {/* Plot Blocks */}
//         {plotData.map((plot) => (
//           <PlotBlock
//             key={plot.id}
//             position={plot.position}
//             dimensions={plot.dimensions}
//             color={plot.color}
//             metadata={plot.metadata}
//             onHover={handlePlotHover}
//             onLeave={handlePlotLeave}
//             isSelected={selectedPlot?.id === plot.id}
//           />
//         ))}

//         {/* Camera Controls */}
//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={3}
//           maxDistance={20}
//           minPolarAngle={0}
//           maxPolarAngle={Math.PI / 2.2}
//           autoRotate={false}
//           autoRotateSpeed={0.5}
//         />
//       </Canvas>

//       {/* Hover Panel */}
//       {hoveredPlot && (
//         <HoverPanel
//           plot={hoveredPlot}
//           position={hoverPosition}
//         />
//       )}

//       {/* Instructions */}
//       <div className="absolute bottom-6 left-6 z-50 glass-dark rounded-lg p-4 max-w-sm animate-slide-up">
//         <h3 className="text-white font-semibold mb-2">Navigation</h3>
//         <div className="space-y-1 text-sm text-gray-300">
//           <p>• <strong>Mouse:</strong> Rotate view</p>
//           <p>• <strong>Scroll:</strong> Zoom in/out</p>
//           <p>• <strong>Right-click + Drag:</strong> Pan view</p>
//           <p>• <strong>Hover:</strong> View plot details</p>
//         </div>
//       </div>

//       {/* Stats Panel */}
//       <div className="absolute bottom-6 right-6 z-50 glass-dark rounded-lg p-4 animate-slide-up">
//         <h3 className="text-white font-semibold mb-2">Plot Statistics</h3>
//         <div className="space-y-2 text-sm text-gray-300">
//           <div className="flex justify-between">
//             <span>Total Plots:</span>
//             <span className="font-medium text-white">{plotData.length}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Residential:</span>
//             <span className="font-medium text-primary-400">
//               {plotData.filter(p => p.metadata.type === 'residential').length}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span>Commercial:</span>
//             <span className="font-medium text-secondary-400">
//               {plotData.filter(p => p.metadata.type === 'commercial').length}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span>Agricultural:</span>
//             <span className="font-medium text-yellow-400">
//               {plotData.filter(p => p.metadata.type === 'agricultural').length}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span>Industrial:</span>
//             <span className="font-medium text-red-400">
//               {plotData.filter(p => p.metadata.type === 'industrial').length}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlotViewer3D;


// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, Environment, Grid } from '@react-three/drei';
// import * as THREE from 'three';
// import HoverPanel from './HoverPanel';

// const PlotBlock = ({ position, dimensions, color, metadata, onHover, onLeave, isSelected }) => {
//   const meshRef = useRef();
//   const [hovered, setHovered] = useState(false);

//   useFrame((state) => {
//     if (meshRef.current) {
//       if (hovered || isSelected) {
//         meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.3, 0.1);
//         meshRef.current.material.emissive.setHex(0x444444);
//       } else {
//         meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
//         meshRef.current.material.emissive.setHex(0x000000);
//       }
//     }
//   });

//   const handlePointerEnter = (e) => {
//     e.stopPropagation();
//     setHovered(true);
//     onHover(metadata, e.point);
//     document.body.style.cursor = 'pointer';
//   };

//   const handlePointerLeave = (e) => {
//     e.stopPropagation();
//     setHovered(false);
//     onLeave();
//     document.body.style.cursor = 'default';
//   };

//   return (
//     <mesh
//       ref={meshRef}
//       position={position}
//       onPointerEnter={handlePointerEnter}
//       onPointerLeave={handlePointerLeave}
//     >
//       <boxGeometry args={dimensions} />
//       <meshStandardMaterial 
//         color={color}
//         metalness={0.3}
//         roughness={0.4}
//         transparent
//         opacity={hovered || isSelected ? 0.9 : 0.8}
//       />
      
//       {/* Plot borders */}
//       <lineSegments>
//         <edgesGeometry args={[new THREE.BoxGeometry(...dimensions)]} />
//         <lineBasicMaterial color={hovered || isSelected ? '#ffffff' : '#666666'} />
//       </lineSegments>
//     </mesh>
//   );
// };

// const CameraController = () => {
//   const { camera } = useThree();
  
//   useEffect(() => {
//     camera.position.set(8, 6, 8);
//     camera.lookAt(0, 0, 0);
//   }, [camera]);

//   return null;
// };

// const PlotViewer3D = ({ plotData, selectedPlot, setSelectedPlot, backgroundImage }) => {
//   const [hoveredPlot, setHoveredPlot] = useState(null);
//   const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
//   const [contextLost, setContextLost] = useState(false);

//   const handlePlotHover = (metadata, worldPosition) => {
//     setHoveredPlot(metadata);
//     // Convert 3D world position to screen coordinates would need more complex calculation
//     // For now, using mouse position
//     setHoverPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
//   };

//   const handlePlotLeave = () => {
//     setHoveredPlot(null);
//   };

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (hoveredPlot) {
//         setHoverPosition({ x: e.clientX, y: e.clientY });
//       }
//     };

//     const handleContextLost = (event) => {
//       event.preventDefault();
//       setContextLost(true);
//       console.log('WebGL context lost. Attempting to restore...');
//     };

//     const handleContextRestored = () => {
//       setContextLost(false);
//       console.log('WebGL context restored.');
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     const canvas = document.querySelector('canvas');
//     if (canvas) {
//       canvas.addEventListener('webglcontextlost', handleContextLost);
//       canvas.addEventListener('webglcontextrestored', handleContextRestored);
//     }

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       if (canvas) {
//         canvas.removeEventListener('webglcontextlost', handleContextLost);
//         canvas.removeEventListener('webglcontextrestored', handleContextRestored);
//       }
//     };
//   }, [hoveredPlot]);

//   if (!plotData) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading 3D visualization...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-full w-full">
//       {/* Background Image Overlay */}
//       {backgroundImage && (
//         <div 
//           className="absolute inset-0 opacity-10 bg-cover bg-center z-0"
//           style={{ backgroundImage: `url(${backgroundImage.url})` }}
//         />
//       )}

//       {/* Context Lost Warning */}
//       {contextLost && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="glass-dark rounded-xl p-6 text-center max-w-md">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
//               <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//             <h3 className="text-white font-semibold mb-2">Restoring 3D View</h3>
//             <p className="text-gray-400 text-sm">WebGL context is being restored. Please wait...</p>
//           </div>
//         </div>
//       )}
//       {/* 3D Canvas */}
//       <Canvas 
//         className="relative z-10"
//         gl={{
//           antialias: true,
//           alpha: true,
//           preserveDrawingBuffer: false,
//           powerPreference: "high-performance",
//           failIfMajorPerformanceCaveat: false
//         }}
//         onCreated={({ gl }) => {
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//           gl.shadowMap.enabled = true;
//           gl.shadowMap.type = THREE.PCFSoftShadowMap;
//         }}
//       >
//         <CameraController />
        
//         {/* Lighting */}
//         <ambientLight intensity={0.4} />
//         <directionalLight 
//           position={[10, 10, 5]} 
//           intensity={1.2} 
//           castShadow
//           shadow-mapSize={[2048, 2048]}
//         />
//         <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

//         {/* Environment */}
//         <Environment preset="sunset" />
        
//         {/* Ground Grid */}
//         <Grid 
//           args={[20, 20]} 
//           cellSize={1} 
//           cellThickness={0.5} 
//           cellColor="#444444" 
//           sectionSize={5} 
//           sectionThickness={1} 
//           sectionColor="#666666"
//           position={[0, -0.01, 0]}
//         />

//         {/* Plot Blocks */}
//         {plotData.map((plot) => (
//           <PlotBlock
//             key={plot.id}
//             position={plot.position}
//             dimensions={plot.dimensions}
//             color={plot.color}
//             metadata={plot.metadata}
//             onHover={handlePlotHover}
//             onLeave={handlePlotLeave}
//             isSelected={selectedPlot?.id === plot.id}
//           />
//         ))}

//         {/* Camera Controls */}
//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={3}
//           maxDistance={20}
//           minPolarAngle={0}
//           maxPolarAngle={Math.PI / 2.2}
//           autoRotate={false}
//           autoRotateSpeed={0.5}
//         />
//       </Canvas>

//       {/* Hover Panel */}
//       {hoveredPlot && (
//         <HoverPanel
//           plot={hoveredPlot}
//           position={hoverPosition}
//         />
//       )}

//       {/* Instructions */}
//       <div className="absolute bottom-6 left-6 z-50 glass-dark rounded-lg p-4 max-w-sm animate-slide-up">
//         <h3 className="text-white font-semibold mb-2">Navigation</h3>
//         <div className="space-y-1 text-sm text-gray-300">
//           <p>• <strong>Mouse:</strong> Rotate view</p>
//           <p>• <strong>Scroll:</strong> Zoom in/out</p>
//           <p>• <strong>Right-click + Drag:</strong> Pan view</p>
//           <p>• <strong>Hover:</strong> View plot details</p>
//         </div>
//       </div>

//       {/* Stats Panel */}
//       <div className="absolute bottom-6 right-6 z-50 glass-dark rounded-lg p-4 animate-slide-up">
//         <h3 className="text-white font-semibold mb-2">Plot Statistics</h3>
//         <div className="space-y-2 text-sm text-gray-300">
//           <div className="flex justify-between">
//             <span>Total Plots:</span>
//             <span className="font-medium text-white">{plotData.length}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Residential:</span>
//             <span className="font-medium text-primary-400">
//               {plotData.filter(p => p.metadata.type === 'residential').length}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span>Commercial:</span>
//             <span className="font-medium text-secondary-400">
//               {plotData.filter(p => p.metadata.type === 'commercial').length}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span>Agricultural:</span>
//             <span className="font-medium text-yellow-400">
//               {plotData.filter(p => p.metadata.type === 'agricultural').length}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span>Industrial:</span>
//             <span className="font-medium text-red-400">
//               {plotData.filter(p => p.metadata.type === 'industrial').length}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlotViewer3D;

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import HoverPanel from './HoverPanel';

const PlotBlock = ({ position, dimensions, color, metadata, onHover, onLeave, isSelected }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // ✅ Memoize geometries to prevent GPU memory leaks
  const geometry = useMemo(() => new THREE.BoxGeometry(...dimensions), [dimensions]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useFrame(() => {
    if (meshRef.current) {
      if (hovered || isSelected) {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.3, 0.1);
        meshRef.current.material.emissive.setHex(0x444444);
      } else {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
        meshRef.current.material.emissive.setHex(0x000000);
      }
    }
  });

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover(metadata, e.point);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    setHovered(false);
    onLeave();
    document.body.style.cursor = 'default';
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      geometry={geometry}
    >
      <meshStandardMaterial 
        color={color}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={hovered || isSelected ? 0.9 : 0.8}
      />
      {/* Plot borders */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={hovered || isSelected ? '#ffffff' : '#666666'} />
      </lineSegments>
    </mesh>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

const PlotViewer3D = ({ plotData, selectedPlot, setSelectedPlot, backgroundImage }) => {
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [contextLost, setContextLost] = useState(false);

  const handlePlotHover = (metadata, worldPosition) => {
    setHoveredPlot(metadata);
    setHoverPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };

  const handlePlotLeave = () => {
    setHoveredPlot(null);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (hoveredPlot) {
        setHoverPosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredPlot]);

  if (!plotData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading 3D visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Background Image Overlay */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${backgroundImage.url})` }}
        />
      )}

      {/* Context Lost Warning */}
      {contextLost && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-dark rounded-xl p-6 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-white font-semibold mb-2">Restoring 3D View</h3>
            <p className="text-gray-400 text-sm">WebGL context is being restored. Please wait...</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas 
        className="relative z-10"
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: "default", // ✅ safer than forcing high-performance
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        onContextLost={(e) => {
          e.preventDefault();
          setContextLost(true);
          console.warn("WebGL context lost, attempting restore...");
        }}
        onContextRestored={() => {
          setContextLost(false);
          console.log("WebGL context restored.");
        }}
      >
        <CameraController />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize={[1024, 1024]} // ✅ smaller shadow map
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

        {/* Environment - lighter preset */}
        <Environment preset="city" />

        {/* Ground Grid */}
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#444444" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#666666"
          position={[0, -0.01, 0]}
        />

        {/* Plot Blocks */}
        {plotData.map((plot) => (
          <PlotBlock
            key={plot.id}
            position={plot.position}
            dimensions={plot.dimensions}
            color={plot.color}
            metadata={plot.metadata}
            onHover={handlePlotHover}
            onLeave={handlePlotLeave}
            isSelected={selectedPlot?.id === plot.id}
          />
        ))}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Hover Panel */}
      {hoveredPlot && (
        <HoverPanel
          plot={hoveredPlot}
          position={hoverPosition}
        />
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-50 glass-dark rounded-lg p-4 max-w-sm animate-slide-up">
        <h3 className="text-white font-semibold mb-2">Navigation</h3>
        <div className="space-y-1 text-sm text-gray-300">
          <p>• <strong>Mouse:</strong> Rotate view</p>
          <p>• <strong>Scroll:</strong> Zoom in/out</p>
          <p>• <strong>Right-click + Drag:</strong> Pan view</p>
          <p>• <strong>Hover:</strong> View plot details</p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute bottom-6 right-6 z-50 glass-dark rounded-lg p-4 animate-slide-up">
        <h3 className="text-white font-semibold mb-2">Plot Statistics</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Total Plots:</span>
            <span className="font-medium text-white">{plotData.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Residential:</span>
            <span className="font-medium text-primary-400">
              {plotData.filter(p => p.metadata.type === 'residential').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Commercial:</span>
            <span className="font-medium text-secondary-400">
              {plotData.filter(p => p.metadata.type === 'commercial').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Agricultural:</span>
            <span className="font-medium text-yellow-400">
              {plotData.filter(p => p.metadata.type === 'agricultural').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Industrial:</span>
            <span className="font-medium text-red-400">
              {plotData.filter(p => p.metadata.type === 'industrial').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotViewer3D;
