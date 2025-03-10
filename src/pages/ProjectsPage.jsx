import React, { useState, useEffect } from 'react';
import { base_url } from '../../utils/base_url';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${base_url}/api/projects`);
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleSelect = (projectId) => {
        // Handle project selection
        console.log(`Selected project with ID: ${projectId}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading projects...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Projects</h1>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Units</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.projectId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.projectId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.overview?.totalUnits}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleSelect(project.projectId)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsPage;