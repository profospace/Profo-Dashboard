import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import BuildingList from '../components/Building/BuildingList';
import BuildingForm from '../components/Building/BuildingForm';
import BuildingDetails from './BuildingDetails';
import { toast } from 'react-hot-toast';
import { base_url } from "../../utils/base_url"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function BuildingManagement() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBuilding, setEditingBuilding] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchBuildings();
    }, []);

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${base_url}/api/buildings`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setBuildings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching buildings:', error);
            setError('Failed to load buildings. Please try again.');
            setLoading(false);
            toast.error('Failed to load buildings');
        }
    };

    const addBuilding = async (buildingData) => {
        try {
            const formData = new FormData();

            // Handle gallery images
            if (buildingData.galleryList) {
                for (let i = 0; i < buildingData.galleryList.length; i++) {
                    formData.append('galleryList', buildingData.galleryList[i]);
                }
            }

            // Convert the rest of the data to JSON and append it
            const buildingDataWithoutFiles = { ...buildingData };
            delete buildingDataWithoutFiles.galleryList;

            formData.append('data', JSON.stringify(buildingDataWithoutFiles));

            const response = await fetch(`${base_url}/api/buildings/saveBuildingDetails`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            toast.success('Building added successfully!');
            fetchBuildings();
            return result;
        } catch (error) {
            console.error('Error adding building:', error);
            toast.error(`Failed to add building: ${error.message}`);
            throw error;
        }
    };

    const updateBuilding = async (buildingId, buildingData) => {
        try {
            // For update, we send a JSON object directly
            const response = await fetch(`${base_url}/api/buildings/${buildingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(buildingData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            toast.success('Building updated successfully!');
            fetchBuildings();
            return result;
        } catch (error) {
            console.error('Error updating building:', error);
            toast.error(`Failed to update building: ${error.message}`);
            throw error;
        }
    };

    const deleteBuilding = async (buildingId) => {
        if (!window.confirm('Are you sure you want to delete this building?')) {
            return;
        }

        try {
            const response = await fetch(`${base_url}/api/buildings/${buildingId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            toast.success('Building deleted successfully!');
            fetchBuildings();
        } catch (error) {
            console.error('Error deleting building:', error);
            toast.error(`Failed to delete building: ${error.message}`);
        }
    };

    const handleEditBuilding = (building) => {
        setEditingBuilding(building);
        setSelectedTab(1); // Switch to the Edit tab
    };

    const handleTabChange = (index) => {
        setSelectedTab(index);
        if (index === 0) {
            // If switching to the list tab, reset the editing building
            setEditingBuilding(null);
        }
    };

    const filteredBuildings = buildings.filter(building => {
        const matchesSearch = building.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            building.buildingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            building.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !filterStatus || building.developmentStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="mx-auto">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Building Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Add, edit, and manage all buildings in the system.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Tab.Group selectedIndex={selectedTab} onChange={handleTabChange}>
                    <Tab.List className="flex bg-gray-50 border-b border-gray-200">
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    'w-full py-3 px-4 text-sm font-medium rounded-t-lg text-center focus:outline-none',
                                    selected
                                        ? 'bg-white text-blue-600 border-t-2 border-l border-r border-blue-600 border-b-0'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                )
                            }
                        >
                            Buildings
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    'w-full py-3 px-4 text-sm font-medium rounded-t-lg text-center focus:outline-none',
                                    selected
                                        ? 'bg-white text-blue-600 border-t-2 border-l border-r border-blue-600 border-b-0'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                )
                            }
                        >
                            {editingBuilding ? "Edit Building" : "Add New Building"}
                        </Tab>
                    </Tab.List>

                    <Tab.Panels>
                        <Tab.Panel>
                            <BuildingList
                                buildings={filteredBuildings}
                                loading={loading}
                                error={error}
                                onEdit={handleEditBuilding}
                                onDelete={deleteBuilding}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                filterStatus={filterStatus}
                                onFilterStatusChange={setFilterStatus}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <BuildingForm
                                building={editingBuilding}
                                onSubmit={editingBuilding ?
                                    (data) => updateBuilding(editingBuilding.buildingId, data) :
                                    addBuilding
                                }
                                onCancel={() => {
                                    setEditingBuilding(null);
                                    setSelectedTab(0); // Switch back to list tab
                                }}
                            />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
}