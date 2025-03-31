import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsList from './Project/ProjectsList';
import ProjectForm from '../components/Project/ProjectForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../utils/base_url"


const ProjectManagementPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showProjects, setShowProjects] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${base_url}/api/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleEditProject = async (projectId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/api/projects/${projectId}`);
            setSelectedProject(response.data);
            setIsEditing(true);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error fetching project details:', error);
            toast.error('Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            setLoading(true);
            await axios.delete(`${base_url}/api/projects/${projectId}`);
            toast.success('Project deleted successfully');
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (projectData, isUpdate = false) => {
        try {
            setLoading(true);

            if (isUpdate) {
                await axios.put(`${base_url}/api/projects/${selectedProject.projectId}`, projectData);
                toast.success('Project updated successfully');
            } else {
                await axios.post(`${base_url}/api/projects`, projectData);
                toast.success('Project created successfully');
            }

            setSelectedProject(null);
            setIsEditing(false);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(`Failed to ${isUpdate ? 'update' : 'create'} project`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedProject(null);
        setIsEditing(false);
    };

    return (
        <div className="mx-auto ">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Project Management</h1>

            {/* Projects List Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Existing Projects</h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => setShowProjects(!showProjects)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {showProjects ? 'Hide Projects' : 'Show Projects'}
                        </button>
                    </div>
                </div>

                {showProjects && (
                    <ProjectsList
                        projects={projects}
                        loading={loading}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                    />
                )}
            </div>

            {/* Project Form Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                </h2>

                <ProjectForm
                    projectData={selectedProject}
                    isEditing={isEditing}
                    onSubmit={handleFormSubmit}
                    onReset={resetForm}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ProjectManagementPage;