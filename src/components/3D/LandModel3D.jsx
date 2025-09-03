import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Shape, ExtrudeGeometry, Vector3 } from 'three';
import { pathTo3D, calculateDimensions } from '../../utils/pathUtils';

const BuildingBlock = ({ building, onHover, onHoverEnd, isHovered }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    const geometry = useMemo(() => {
        if (!building.path || building.path.length < 3) return null;

        const shape = new Shape();
        const scaledPath = building.path.map(point => ({
            x: (point.x - 0.5) * 20,
            y: (point.y - 0.5) * 20
        }));

        shape.moveTo(scaledPath[0].x, scaledPath[0].y);
        scaledPath.slice(1).forEach(point => {
            shape.lineTo(point.x, point.y);
        });
        shape.lineTo(scaledPath[0].x, scaledPath[0].y);

        const extrudeSettings = {
            depth: 0.5 + Math.random() * 1.5,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.02,
            bevelThickness: 0.02,
        };

        return new ExtrudeGeometry(shape, extrudeSettings);
    }, [building.path]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += (hovered || isHovered) ? 0.005 : 0;
            meshRef.current.position.y = (hovered || isHovered) ? 0.1 : 0;
        }
    });

    if (!geometry) return null;

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            onPointerEnter={(e) => {
                e.stopPropagation();
                setHovered(true);
                onHover(building, e);
            }}
            onPointerLeave={(e) => {
                e.stopPropagation();
                setHovered(false);
                onHoverEnd();
            }}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial
                color={hovered || isHovered ? '#3B82F6' : '#8B5CF6'}
                metalness={0.3}
                roughness={0.4}
                transparent
                opacity={hovered || isHovered ? 0.9 : 0.8}
            />
        </mesh>
    );
};

const GroundPlane = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#f0f0f0" />
        </mesh>
    );
};

const Scene = ({ buildings, onBuildingHover, onBuildingHoverEnd, hoveredBuilding }) => {
    const { camera } = useThree();

    // Set initial camera position
    React.useEffect(() => {
        camera.position.set(15, 10, 15);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return (
        <>
            <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={60} />
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2}
            />
            
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            
            <Environment preset="city" />
            
            <GroundPlane />
            
            {buildings.map((building) => (
                <BuildingBlock
                    key={building.id}
                    building={building}
                    onHover={onBuildingHover}
                    onHoverEnd={onBuildingHoverEnd}
                    isHovered={hoveredBuilding?.id === building.id}
                />
            ))}
        </>
    );
};

const LandModel3D = ({ buildings = [] }) => {
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const handleBuildingHover = (building, event) => {
        setHoveredBuilding(building);
        setHoverPosition({ x: event.clientX, y: event.clientY });
    };

    const handleBuildingHoverEnd = () => {
        setHoveredBuilding(null);
    };

    const dimensions = useMemo(() => {
        if (hoveredBuilding) {
            return calculateDimensions(hoveredBuilding.path);
        }
        return null;
    }, [hoveredBuilding]);

    return (
        <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
            <Canvas shadows>
                <Scene
                    buildings={buildings}
                    onBuildingHover={handleBuildingHover}
                    onBuildingHoverEnd={handleBuildingHoverEnd}
                    hoveredBuilding={hoveredBuilding}
                />
            </Canvas>
            
            {/* Floating Detail Panel */}
            {hoveredBuilding && (
                <div
                    className="fixed z-50 bg-white/95 backdrop-blur-md shadow-xl rounded-lg p-4 max-w-xs transform transition-all duration-200 pointer-events-none"
                    style={{
                        left: hoverPosition.x + 15,
                        top: hoverPosition.y - 100,
                    }}
                >
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {hoveredBuilding.heading}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                        {hoveredBuilding.description}
                    </p>
                    {dimensions && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-blue-50 p-2 rounded">
                                <span className="font-medium">Width:</span>
                                <div className="font-bold">{dimensions.width}m</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                                <span className="font-medium">Length:</span>
                                <div className="font-bold">{dimensions.height}m</div>
                            </div>
                            <div className="bg-purple-50 p-2 rounded col-span-2">
                                <span className="font-medium">Area:</span>
                                <div className="font-bold">{dimensions.area} m²</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* 3D Controls Info */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600">
                <div className="font-medium mb-1">3D Controls:</div>
                <div>• Left click + drag: Rotate</div>
                <div>• Right click + drag: Pan</div>
                <div>• Scroll: Zoom</div>
                <div>• Hover blocks: View details</div>
            </div>
        </div>
    );
};

export default LandModel3D;