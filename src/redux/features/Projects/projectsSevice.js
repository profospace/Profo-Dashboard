import axios from 'axios';
import { base_url } from '../../../../utils/base_url';

// Get all projects
const getProjects = async () => {
    const response = await axios.get(`${base_url}/api/projects`);
    return response.data;
};

// Get project by ID
const getProjectById = async (projectId) => {
    const response = await axios.get(`${base_url}/api/projects/${projectId}`);
    return response.data;
};

// Add new project
const addProject = async (projectData) => {
    const response = await axios.post(`${base_url}/api/projects`, projectData);
    return response.data;
};

// Update project
const updateProject = async (projectId, projectData) => {
    const response = await axios.put(`${base_url}/api/projects/${projectId}`, projectData);
    return response.data;
};

// Delete project
const deleteProject = async (projectId) => {
    const response = await axios.delete(`${base_url}/api/projects/${projectId}`);
    return response.data;
};

const projectsService = {
    getProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject,
};

export default projectsService;