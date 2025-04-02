import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaBuilding, FaLink } from 'react-icons/fa';
import { base_url } from '../../../utils/base_url';

const ConnectBuildingsPage = () => {
    const { builderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [builder, setBuilder] = useState(null);
    const [unassignedBuildings, setUnassignedBuildings] = useState([]);
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch builder details and unassigned buildings
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch builder details
                const builderResponse = await fetch(`${base_url}/builders/${builderId}`);
                const builderData = await builderResponse.json();

                // Fetch unassigned buildings
                const buildingsResponse = await fetch(`${base_url}/api/builder/building/connection/buildings/unassigned`);
                const buildingsData = await buildingsResponse.json();

                setBuilder(builderData);
                setUnassignedBuildings(buildingsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [builderId]);

    // Handle building selection
    const toggleBuildingSelection = (buildingId) => {
        setSelectedBuildings(prevSelected => {
            if (prevSelected.includes(buildingId)) {
                return prevSelected.filter(id => id !== buildingId);
            } else {
                return [...prevSelected, buildingId];
            }
        });
    };

    // Handle select all buildings
    const selectAllBuildings = () => {
        if (selectedBuildings.length === unassignedBuildings.length) {
            // If all are selected, deselect all
            setSelectedBuildings([]);
        } else {
            // Otherwise, select all
            setSelectedBuildings(unassignedBuildings.map(building => building._id));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedBuildings.length === 0) {
            alert('Please select at least one building to connect');
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(`${base_url}/api/builder/building/connection/buildings/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    builderId,
                    buildingIds: selectedBuildings
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Successfully connected ${result.modifiedCount} buildings to ${builder.name}`);
                navigate('/builders');
            } else {
                throw new Error(result.message || 'Failed to connect buildings');
            }
        } catch (error) {
            console.error('Error connecting buildings:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter buildings based on search term
    const filteredBuildings = unassignedBuildings.filter(building =>
        building.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.buildingId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!builder) {
        return <div className="p-8 text-center">Builder not found</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/builders')}
                    className="mr-4 text-blue-500 hover:text-blue-700"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold">Connect Buildings to Builder</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-4">
                    <img
                        src={builder.logo || 'https://via.placeholder.com/150'}
                        alt={`${builder.name} logo`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{builder.name}</h2>
                        <p className="text-gray-500">{builder.company}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Available Buildings</h3>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search buildings..."
                                className="border rounded px-3 py-1 mr-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={selectAllBuildings}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                {selectedBuildings.length === unassignedBuildings.length
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </button>
                        </div>
                    </div>

                    {filteredBuildings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FaBuilding className="text-5xl mx-auto mb-2" />
                            <p>No unassigned buildings available</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBuildings.map(building => (
                                <div
                                    key={building._id}
                                    className={`border rounded-lg p-4 cursor-pointer transition ${selectedBuildings.includes(building._id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    onClick={() => toggleBuildingSelection(building._id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{building.name}</h4>
                                            <p className="text-sm text-gray-500">ID: {building.buildingId}</p>
                                            <p className="text-sm text-gray-500">
                                                Floors: {building.storey || 'N/A'} |
                                                Units: {building.totalProperties || 'N/A'}
                                            </p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedBuildings.includes(building._id)
                                                ? 'bg-blue-500 text-white'
                                                : 'border border-gray-300'
                                            }`}>
                                            {selectedBuildings.includes(building._id) && <FaCheck size={12} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/builders')}
                        className="px-4 py-2 border border-gray-300 rounded-md mr-3 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={selectedBuildings.length === 0 || submitting}
                        className={`px-4 py-2 rounded-md flex items-center ${selectedBuildings.length === 0 || submitting
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        <FaLink className="mr-2" />
                        {submitting ? 'Connecting...' : `Connect ${selectedBuildings.length} Buildings`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConnectBuildingsPage;