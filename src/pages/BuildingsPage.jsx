// import React, { useState, useEffect } from 'react';
// import { base_url } from '../../utils/base_url';
// import BuildingManager from '../components/BuildingManager';
// import BuildingViewer from '../components/BuildingViewer';

// const BuildingsPage = () => {
//     const [buildings, setBuildings] = useState([]);
//     const [selectedBuildingId, setSelectedBuildingId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('list'); // 'list', 'manager', or 'viewer'

//     useEffect(() => {
//         const fetchBuildings = async () => {
//             try {
//                 const response = await fetch(`${base_url}/api/buildings`);
//                 const data = await response.json();
//                 setBuildings(data);
//             } catch (error) {
//                 console.error('Error fetching buildings:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBuildings();
//     }, []);

//     const handleSelect = (buildingId) => {
//         setSelectedBuildingId(buildingId);
//         setActiveTab('manager');
//     };

//     // Render tab button
//     const TabButton = ({ id, label, current }) => (
//         <button
//             onClick={() => setActiveTab(id)}
//             className={`px-4 py-2 mr-2 rounded-t-lg focus:outline-none ${current === id
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//         >
//             {label}
//         </button>
//     );

//     if (loading && activeTab === 'list') {
//         return <div className="flex justify-center items-center h-64">Loading buildings...</div>;
//     }

//     return (
//         <div>
//             <h1 className="text-2xl font-bold mb-6">Buildings</h1>

//             {/* Tabs */}
//             <div className="mb-6">
//                 <TabButton id="list" label="Building List" current={activeTab} />
//                 <TabButton id="manager" label="Building Manager" current={activeTab} />
//                 <TabButton id="viewer" label="Building Viewer" current={activeTab} />
//             </div>

//             {/* Content based on active tab */}
//             {activeTab === 'list' && (
//                 <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Properties</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Flats</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {buildings.map((building) => (
//                                 <tr key={building.buildingId}>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{building.buildingId}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.type}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.totalProperties}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.availableFlats}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         <button
//                                             onClick={() => handleSelect(building.buildingId)}
//                                             className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                                         >
//                                             Select
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {activeTab === 'manager' && (
//                 <div className="bg-white shadow-md rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">
//                         {selectedBuildingId ? `Manage Building: ${selectedBuildingId}` : 'Building Manager'}
//                     </h2>
//                     <BuildingManager id={selectedBuildingId} />
//                 </div>
//             )}

//             {activeTab === 'viewer' && (
//                 <div className="bg-white shadow-md rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">
//                         {selectedBuildingId ? `View Building: ${selectedBuildingId}` : 'Building Viewer'}
//                     </h2>
//                     <BuildingViewer id={selectedBuildingId} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BuildingsPage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getBuildings,
    selectBuilding,
    getBuildingConfig,
    clearSelectedBuilding
} from '../redux/features/Buildings/buildingsSlice';
import BuildingManager from './Viewer/BuildingManager';
import BuildingViewer from './Viewer/BuildingViewer';

const BuildingsPage = () => {
    const dispatch = useDispatch();
    const { buildings, selectedBuilding, buildingConfig, isLoading, isError, message } = useSelector(
        (state) => state.buildings
    );

    const [activeTab, setActiveTab] = useState('list'); // 'list', 'manager', or 'viewer'

    useEffect(() => {
        dispatch(getBuildings());
    }, [dispatch]);

    const handleSelect = (buildingId) => {
        dispatch(selectBuilding(buildingId));
        dispatch(getBuildingConfig(buildingId));
        setActiveTab('manager');
    };

    const handleClearSelection = () => {
        dispatch(clearSelectedBuilding());
        setActiveTab('list');
    };

    // Render tab button
    const TabButton = ({ id, label, current }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 mr-2 rounded-t-lg focus:outline-none ${current === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
        >
            {label}
        </button>
    );

    if (isLoading && activeTab === 'list' && !selectedBuilding) {
        return <div className="flex justify-center items-center h-64">Loading buildings...</div>;
    }

    if (isError) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{message}</span>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Buildings</h1>

            {/* Back button if a building is selected */}
            {selectedBuilding && (
                <div className="mb-4">
                    <button
                        onClick={handleClearSelection}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                        Back to Building List
                    </button>
                </div>
            )}

            {/* Tabs */}
            {selectedBuilding && (
                <div className="mb-6">
                    <TabButton id="manager" label="Building Manager" current={activeTab} />
                    <TabButton id="viewer" label="Building Viewer" current={activeTab} />
                </div>
            )}

            {/* Content based on active tab */}
            {(!selectedBuilding || activeTab === 'list') && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Properties</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Flats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {buildings.length > 0 ? (
                                buildings.map((building) => (
                                    <tr key={building.buildingId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{building.buildingId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.totalProperties}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{building.availableFlats}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleSelect(building.buildingId)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No buildings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedBuilding && activeTab === 'manager' && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {`Manage Building: ${selectedBuilding.name || selectedBuilding.buildingId}`}
                    </h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">Loading building data...</div>
                    ) : (
                        <BuildingManager id={selectedBuilding.buildingId} />
                    )}
                </div>
            )}

            {selectedBuilding && activeTab === 'viewer' && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {`View Building: ${selectedBuilding.name || selectedBuilding.buildingId}`}
                    </h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">Loading building data...</div>
                    ) : (
                        <BuildingViewer id={selectedBuilding.buildingId} />
                    )}
                </div>
            )}
        </div>
    );
};

export default BuildingsPage;