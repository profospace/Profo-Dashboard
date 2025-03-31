import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../utils/base_url"


const ProjectPropertiesConnection = ({ projectId, onUpdate }) => {
    const [projects, setProjects] = useState([]);
    const [properties, setProperties] = useState([]);
    const [selectedProject, setSelectedProject] = useState(projectId || '');
    const [selectedProperties, setSelectedProperties] = useState(new Set());
    const [connectedProperties, setConnectedProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch projects and properties on component mount
    useEffect(() => {
        fetchProjects();
        fetchProperties();
    }, []);

    // Fetch project's connected properties when selectedProject changes
    useEffect(() => {
        if (selectedProject) {
            fetchConnectedProperties(selectedProject);
        } else {
            setConnectedProperties([]);
        }
    }, [selectedProject]);

    // Fetch all projects
    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${base_url}/api/projects`);
            setProjects(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
            setIsLoading(false);
        }
    };

    // Fetch all properties
    const fetchProperties = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${base_url}/api/properties/all`);
            setProperties(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            toast.error('Failed to load properties');
            setIsLoading(false);
        }
    };

    // Fetch properties connected to a specific project
    const fetchConnectedProperties = async (projectId) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${base_url}/api/projects/${projectId}/properties`);
            if (response.data && response.data.success && response.data.data) {
                setConnectedProperties(response.data.data.properties || []);
            } else {
                setConnectedProperties([]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching connected properties:', error);
            toast.error('Failed to load connected properties');
            setConnectedProperties([]);
            setIsLoading(false);
        }
    };

    // Connect properties to the selected project
    const connectProperties = async () => {
        if (!selectedProject || selectedProperties.size === 0) {
            toast.error('Please select a project and at least one property');
            return;
        }

        try {
            setIsLoading(true);
            const propertyIds = Array.from(selectedProperties);

            // Make API calls to connect each property to the project
            const promises = propertyIds.map(propertyId =>
                axios.post(`${base_url}/api/projects/${selectedProject}/properties/${propertyId}`)
            );

            await Promise.all(promises);

            toast.success('Properties connected successfully');

            // Refresh connected properties list
            fetchConnectedProperties(selectedProject);

            // Clear selections
            setSelectedProperties(new Set());

            // Callback to parent component if provided
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error connecting properties:', error);
            toast.error('Failed to connect properties');
        } finally {
            setIsLoading(false);
        }
    };

    // Disconnect a property from the selected project
    const disconnectProperty = async (propertyId) => {
        if (!selectedProject) return;

        try {
            setIsLoading(true);
            await axios.delete(`${base_url}/api/projects/${selectedProject}/properties/${propertyId}`);

            toast.success('Property disconnected successfully');

            // Refresh connected properties list
            fetchConnectedProperties(selectedProject);

            // Callback to parent component if provided
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error disconnecting property:', error);
            toast.error('Failed to disconnect property');
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle property selection
    const togglePropertySelection = (propertyId) => {
        setSelectedProperties(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(propertyId)) {
                newSelection.delete(propertyId);
            } else {
                newSelection.add(propertyId);
            }
            return newSelection;
        });
    };

    // Filter properties based on search term
    const filteredProperties = properties.filter(property => {
        // Get the ids of connected properties to exclude them
        const connectedIds = connectedProperties.map(p => p.post_id);

        // Check if property is not already connected
        const isNotConnected = !connectedIds.includes(property.post_id);

        // Check if property matches search term
        const matchesSearch =
            property.post_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.post_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address?.toLowerCase().includes(searchTerm.toLowerCase());

        return isNotConnected && matchesSearch;
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Project-Property Connection</h2>

            {/* Project Selection */}
            <div className="mb-6">
                <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                </label>
                <select
                    id="project-select"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                        <option key={project._id} value={project.projectId || project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Connection Status */}
            {selectedProject && (
                <div className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-700">
                        Connected Properties: <span className="font-bold">{connectedProperties.length}</span>
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Properties */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Available Properties</h3>
                        <span className="text-sm text-gray-500">{filteredProperties.length} properties</span>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="h-96 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-2">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : filteredProperties.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                No available properties found
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {filteredProperties.map(property => (
                                    <li
                                        key={property.post_id}
                                        className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id={`property-${property.post_id}`}
                                                checked={selectedProperties.has(property.post_id)}
                                                onChange={() => togglePropertySelection(property.post_id)}
                                                className="mt-1 h-4 w-4 text-blue-600 rounded"
                                            />
                                            <div className="ml-3">
                                                <label
                                                    htmlFor={`property-${property.post_id}`}
                                                    className="block font-medium text-gray-800 hover:text-blue-600 cursor-pointer"
                                                >
                                                    {property.post_title}
                                                </label>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <span className="mr-3">{property.type_name}</span>
                                                    <span className="mr-3">₹{property.price?.toLocaleString() || 'N/A'}</span>
                                                    <span>{property.address?.substring(0, 30)}...</span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                                        ID: {property.post_id}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        onClick={connectProperties}
                        disabled={selectedProperties.size === 0 || !selectedProject || isLoading}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
                    >
                        {isLoading ? 'Connecting...' : `Connect Selected Properties (${selectedProperties.size})`}
                    </button>
                </div>

                {/* Connected Properties */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Connected Properties</h3>
                        <span className="text-sm text-gray-500">{connectedProperties.length} properties</span>
                    </div>

                    <div className="h-96 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-2">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : connectedProperties.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                No connected properties found
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {connectedProperties.map(property => (
                                    <li
                                        key={property.post_id}
                                        className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium text-gray-800">{property.post_title}</div>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <span className="mr-3">{property.type_name}</span>
                                                    <span className="mr-3">₹{property.price?.toLocaleString() || 'N/A'}</span>
                                                    <span>{property.address?.substring(0, 30)}...</span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                                                        ID: {property.post_id}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => disconnectProperty(property.post_id)}
                                                disabled={isLoading}
                                                className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPropertiesConnection;