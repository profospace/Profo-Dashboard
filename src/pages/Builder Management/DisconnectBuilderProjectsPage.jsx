import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUnlink } from 'react-icons/fa';
import { base_url } from '../../../utils/base_url';

const DisconnectBuilderProjectsPage = () => {
    const { builderId } = useParams();
    const navigate = useNavigate();

    const [builder, setBuilder] = useState(null);
    const [builderProjects, setBuilderProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch builder details
                const builderResponse = await fetch(`${base_url}/builders/${builderId}`);

                if (!builderResponse.ok) {
                    throw new Error('Failed to fetch builder details');
                }

                const builderData = await builderResponse.json();
                setBuilder(builderData);

                // Fetch projects assigned to this builder
                const projectsResponse = await fetch(`${base_url}/api/builder/project/connection/builders/${builderId}/projects`);

                if (!projectsResponse.ok) {
                    throw new Error('Failed to fetch builder projects');
                }

                const projectsData = await projectsResponse.json();
                setBuilderProjects(projectsData.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [builderId]);

    const handleSelectProject = (projectId) => {
        setSelectedProjects(prev => {
            if (prev.includes(projectId)) {
                return prev.filter(id => id !== projectId);
            } else {
                return [...prev, projectId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedProjects.length === builderProjects.length) {
            setSelectedProjects([]);
        } else {
            setSelectedProjects(builderProjects.map(project => project._id));
        }
    };

    const handleSubmit = async () => {
        if (selectedProjects.length === 0) {
            setError('Please select at least one project to disconnect');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(`${base_url}/api/builder/project/connection/builders/disconnect-projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    builderId,
                    projectIds: selectedProjects
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to disconnect projects');
            }

            setSuccess(`Successfully disconnected ${selectedProjects.length} projects from ${builder.name}`);

            // Remove disconnected projects from the list
            setBuilderProjects(prev =>
                prev.filter(project => !selectedProjects.includes(project._id))
            );
            setSelectedProjects([]);
        } catch (err) {
            console.error('Error disconnecting projects:', err);
            setError(err.message || 'Failed to disconnect projects');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    if (error && !builder) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate('/builders')}
                >
                    Back to Builders
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/builders')}
                    className="mr-4 text-blue-500 hover:text-blue-700"
                >
                    <FaArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Disconnect Projects from Builder</h1>
            </div>

            {/* Builder info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex items-center">
                    <img
                        src={builder?.logo || 'https://via.placeholder.com/150'}
                        alt={`${builder?.name} logo`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{builder?.name}</h2>
                        <p className="text-gray-500">{builder?.company}</p>
                    </div>
                </div>
            </div>

            {/* Status messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Success: </strong>
                    <span className="block sm:inline">{success}</span>
                </div>
            )}

            {/* Project selection */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Connected Projects</h3>
                    <div>
                        <button
                            onClick={handleSelectAll}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                        >
                            {selectedProjects.length === builderProjects.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || selectedProjects.length === 0}
                            className={`${submitting || selectedProjects.length === 0
                                    ? 'bg-red-300 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-700'
                                } text-white font-bold py-2 px-4 rounded flex items-center`}
                        >
                            <FaUnlink className="mr-2" />
                            {submitting ? 'Disconnecting...' : 'Disconnect Selected Projects'}
                        </button>
                    </div>
                </div>

                {builderProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No projects connected to this builder
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="w-12 py-2 px-4 text-left">Select</th>
                                    <th className="py-2 px-4 text-left">Project ID</th>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Type</th>
                                    <th className="py-2 px-4 text-left">Status</th>
                                    <th className="py-2 px-4 text-left">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {builderProjects.map(project => (
                                    <tr
                                        key={project._id}
                                        className={`border-b hover:bg-gray-50 ${selectedProjects.includes(project._id) ? 'bg-red-50' : ''
                                            }`}
                                    >
                                        <td className="py-2 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProjects.includes(project._id)}
                                                onChange={() => handleSelectProject(project._id)}
                                                className="form-checkbox h-5 w-5 text-red-600"
                                            />
                                        </td>
                                        <td className="py-2 px-4">{project.projectId}</td>
                                        <td className="py-2 px-4 font-medium">{project.name}</td>
                                        <td className="py-2 px-4">{project.type}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'UNDER_CONSTRUCTION' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">{project.location?.city}, {project.location?.state}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisconnectBuilderProjectsPage; 