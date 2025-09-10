import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";
import { Button } from 'antd';

const ProjectsListPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        city: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, [filters]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            // Build query parameters from filters
            const queryParams = new URLSearchParams();
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.city) queryParams.append('city', filters.city);

            const response = await axios.get(`${base_url}/api/projects?${queryParams.toString()}`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const resetFilters = () => {
        setFilters({
            type: '',
            status: '',
            city: ''
        });
        setSearchTerm('');
    };

    const handleEditProject = (projectId) => {
        navigate(`/projects/edit/${projectId}`);
    };

    const handleViewProject = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const handleConnectProperties = (projectId, projectName) => {
        navigate(`/projects/${projectId}/connect-properties`, {
            state: { projectName }
        });
    };

    const handleDisconnectProperties = (projectId, projectName, connectedCount) => {
        if (connectedCount === 0) {
            toast.error('This project has no connected properties');
            return;
        }

        navigate(`/projects/${projectId}/disconnect-properties`, {
            state: { projectName }
        });
    };

    const handleViewConnectedProperties = (projectId, projectName, connectedCount) => {
        if (connectedCount === 0) {
            toast.error('This project has no connected properties');
            return;
        }

        navigate(`/projects/${projectId}/connected-properties`, {
            state: { projectName }
        });
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

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

    const handleAddNewProject = () => {
        navigate('/projects/add');
    };

    const handleViewDrafts = () => {
        navigate('/projects/drafts');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800';
            case 'under_construction':
                return 'bg-orange-100 text-orange-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Filter projects by search term
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.builder?.name && project.builder.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.location?.city && project.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const handleAddProjectViewer = (id) => {
        navigate(`/manager?id=${id}&targetType=project`)

    }
    const handleViewProjectViewer = (id) => {
        navigate(`/viewer?id=${id}`)

    }

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Projects Management</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleViewDrafts}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        View Drafts
                    </button>
                    <button
                        onClick={handleAddNewProject}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add New Project
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by name, builder, city..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="RESIDENTIAL">Residential</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="MIXED_USE">Mixed Use</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="UNDER_CONSTRUCTION">Under Construction</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            placeholder="Enter city name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">
                    All Projects {filteredProjects.length > 0 && `(${filteredProjects.length})`}
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-xl">No projects found.</p>
                        <p className="mt-2">Try adjusting your filters or add a new project.</p>
                        <button
                            onClick={handleAddNewProject}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add New Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div
                                key={project._id || project.projectId}
                                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{project.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                                            {formatStatus(project.status)}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {project.builder && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Builder:</span> {project.builder.name}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Type:</span> {project.type?.replace('_', ' ')}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Location:</span> {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Units:</span> {project.overview?.totalUnits || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">RERA:</span> {project.reraNumber || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Connected Properties Information */}
                                    <div className="mt-2 mb-4">
                                        <p className="text-sm font-medium text-gray-700 flex items-center">
                                            <span>Connected Properties:</span>
                                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                                {project.connectedProperties?.length || 0}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleViewProject(project.projectId || project._id)}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded transition-colors"
                                        >
                                            View Details
                                        </button>

                                        <button
                                            onClick={() => handleEditProject(project.projectId || project._id)}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleViewConnectedProperties(
                                                project.projectId || project._id,
                                                project.name,
                                                project.connectedProperties?.length || 0
                                            )}
                                            className={`px-3 py-1.5 text-sm rounded transition-colors ${(project.connectedProperties?.length > 0)
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            disabled={!project.connectedProperties?.length}
                                        >
                                            View Connections
                                        </button>

                                        <button
                                            onClick={() => handleConnectProperties(project.projectId || project._id, project.name)}
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                                        >
                                            Connect Properties
                                        </button>

                                        <button
                                            onClick={() => handleDisconnectProperties(
                                                project.projectId || project._id,
                                                project.name,
                                                project.connectedProperties?.length || 0
                                            )}
                                            className={`px-3 py-1.5 text-sm rounded transition-colors ${(project.connectedProperties?.length > 0)
                                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            disabled={!project.connectedProperties?.length}
                                        >
                                            Disconnect Properties
                                        </button>

                                        <button
                                            onClick={() => handleDeleteProject(project.projectId || project._id)}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors col-span-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div>
                                        <Button onClick={() => handleAddProjectViewer(project?._id)}>Add Project Viewer</Button>
                                        <Button onClick={() => handleViewProjectViewer(project?.projectId)}>View Project Viewer</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsListPage;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { base_url } from "../../../utils/base_url";
// import { Button } from 'antd';
// import { Building2, MapPin, Calendar, Users, Star, Eye, Edit, Trash2, Link, Plus, Filter, Search, Image as ImageIcon } from 'lucide-react';

// const ProjectsListPage = () => {
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filters, setFilters] = useState({
//         type: '',
//         status: '',
//         city: ''
//     });
//     const [searchTerm, setSearchTerm] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchProjects();
//     }, [filters]);

//     const fetchProjects = async () => {
//         try {
//             setLoading(true);
//             const queryParams = new URLSearchParams();
//             if (filters.type) queryParams.append('type', filters.type);
//             if (filters.status) queryParams.append('status', filters.status);
//             if (filters.city) queryParams.append('city', filters.city);

//             const response = await axios.get(`${base_url}/api/projects?${queryParams.toString()}`);
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//             toast.error('Failed to load projects');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const resetFilters = () => {
//         setFilters({
//             type: '',
//             status: '',
//             city: ''
//         });
//         setSearchTerm('');
//     };

//     const handleEditProject = (projectId) => {
//         navigate(`/projects/edit/${projectId}`);
//     };

//     const handleViewProject = (projectId) => {
//         navigate(`/projects/${projectId}`);
//     };

//     const handleConnectProperties = (projectId, projectName) => {
//         navigate(`/projects/${projectId}/connect-properties`, {
//             state: { projectName }
//         });
//     };

//     const handleDisconnectProperties = (projectId, projectName, connectedCount) => {
//         if (connectedCount === 0) {
//             toast.error('This project has no connected properties');
//             return;
//         }

//         navigate(`/projects/${projectId}/disconnect-properties`, {
//             state: { projectName }
//         });
//     };

//     const handleViewConnectedProperties = (projectId, projectName, connectedCount) => {
//         if (connectedCount === 0) {
//             toast.error('This project has no connected properties');
//             return;
//         }

//         navigate(`/projects/${projectId}/connected-properties`, {
//             state: { projectName }
//         });
//     };

//     const handleDeleteProject = async (projectId) => {
//         if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             setLoading(true);
//             await axios.delete(`${base_url}/api/projects/${projectId}`);
//             toast.success('Project deleted successfully');
//             fetchProjects();
//         } catch (error) {
//             console.error('Error deleting project:', error);
//             toast.error('Failed to delete project');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddNewProject = () => {
//         navigate('/projects/add');
//     };

//     const handleViewDrafts = () => {
//         navigate('/projects/drafts');
//     };

//     const getStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'upcoming':
//                 return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//             case 'under_construction':
//                 return 'bg-orange-100 text-orange-800 border-orange-200';
//             case 'completed':
//                 return 'bg-green-100 text-green-800 border-green-200';
//             default:
//                 return 'bg-gray-100 text-gray-800 border-gray-200';
//         }
//     };

//     const getAvailabilityColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'coming_soon':
//                 return 'bg-blue-100 text-blue-800';
//             case 'booking_open':
//                 return 'bg-green-100 text-green-800';
//             case 'almost_sold_out':
//                 return 'bg-orange-100 text-orange-800';
//             case 'sold_out':
//                 return 'bg-red-100 text-red-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const formatStatus = (status) => {
//         if (!status) return 'Unknown';
//         return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//     };

//     const formatPrice = (price) => {
//         if (!price) return 'N/A';
//         return new Intl.NumberFormat('en-IN', {
//             maximumFractionDigits: 0,
//             style: 'currency',
//             currency: 'INR'
//         }).format(price).replace(/^(\D+)/, '₹ ');
//     };

//     const getProjectMainImage = (project) => {
//         if (project.galleryNow && project.galleryNow.length > 0) {
//             return project.galleryNow[0];
//         }
//         if (project.gallery && project.gallery.length > 0) {
//             for (const category of project.gallery) {
//                 if (category.images && category.images.length > 0) {
//                     return category.images[0];
//                 }
//             }
//         }
//         return 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400';
//     };

//     // Filter projects by search term
//     const filteredProjects = projects.filter(project =>
//         project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (project.builder?.name && project.builder.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (project.location?.city && project.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     const handleAddProjectViewer = (id) => {
//         navigate(`/manager?id=${id}&targetType=project`)
//     }

//     const handleViewProjectViewer = (id) => {
//         navigate(`/viewer?id=${id}`)
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Header */}
//                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
//                         <p className="text-gray-600 mt-1">Manage your real estate projects efficiently</p>
//                     </div>
//                     <div className="flex flex-wrap gap-3">
//                         <button
//                             onClick={handleViewDrafts}
//                             className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                         >
//                             <Edit className="h-4 w-4 mr-2" />
//                             View Drafts
//                         </button>
//                         <button
//                             onClick={handleAddNewProject}
//                             className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
//                         >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Add New Project
//                         </button>
//                     </div>
//                 </div>

//                 {/* Filter Section */}
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
//                     <div className="flex items-center mb-4">
//                         <Filter className="h-5 w-5 text-gray-500 mr-2" />
//                         <h2 className="text-lg font-semibold text-gray-800">Filter Projects</h2>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Search className="h-4 w-4 inline mr-1" />
//                                 Search
//                             </label>
//                             <input
//                                 type="text"
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                                 placeholder="Search by name, builder, city..."
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
//                             <select
//                                 name="type"
//                                 value={filters.type}
//                                 onChange={handleFilterChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                             >
//                                 <option value="">All Types</option>
//                                 <option value="RESIDENTIAL">Residential</option>
//                                 <option value="COMMERCIAL">Commercial</option>
//                                 <option value="MIXED_USE">Mixed Use</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                             <select
//                                 name="status"
//                                 value={filters.status}
//                                 onChange={handleFilterChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                             >
//                                 <option value="">All Statuses</option>
//                                 <option value="UPCOMING">Upcoming</option>
//                                 <option value="UNDER_CONSTRUCTION">Under Construction</option>
//                                 <option value="COMPLETED">Completed</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                             <input
//                                 type="text"
//                                 name="city"
//                                 value={filters.city}
//                                 onChange={handleFilterChange}
//                                 placeholder="Enter city name"
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex justify-end mt-4">
//                         <button
//                             onClick={resetFilters}
//                             className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                             Reset Filters
//                         </button>
//                     </div>
//                 </div>

//                 {/* Projects Grid */}
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-xl font-semibold text-gray-800">
//                             All Projects {filteredProjects.length > 0 && (
//                                 <span className="text-lg text-gray-500">({filteredProjects.length})</span>
//                             )}
//                         </h2>
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center items-center py-20">
//                             <div className="relative">
//                                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//                                 <div className="absolute inset-0 flex items-center justify-center">
//                                     <Building2 className="h-6 w-6 text-blue-500" />
//                                 </div>
//                             </div>
//                         </div>
//                     ) : filteredProjects.length === 0 ? (
//                         <div className="text-center py-20">
//                             <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//                             <p className="text-xl text-gray-600 mb-2">No projects found</p>
//                             <p className="text-gray-500 mb-6">Try adjusting your filters or add a new project</p>
//                             <button
//                                 onClick={handleAddNewProject}
//                                 className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
//                             >
//                                 <Plus className="h-5 w-5 mr-2" />
//                                 Add New Project
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                             {filteredProjects.map((project) => (
//                                 <div
//                                     key={project._id || project.projectId}
//                                     className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
//                                 >
//                                     {/* Project Image */}
//                                     <div className="relative h-48 overflow-hidden">
//                                         <img
//                                             src={getProjectMainImage(project)}
//                                             alt={project.name}
//                                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                                         />
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

//                                         {/* Status Badges */}
//                                         <div className="absolute top-3 left-3 flex flex-col gap-2">
//                                             <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
//                                                 {formatStatus(project.status)}
//                                             </span>
//                                             {project.availabilityStatus && (
//                                                 <span className={`px-3 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(project.availabilityStatus)}`}>
//                                                     {formatStatus(project.availabilityStatus)}
//                                                 </span>
//                                             )}
//                                         </div>

//                                         {/* Gallery Indicator */}
//                                         {((project.galleryNow && project.galleryNow.length > 0) ||
//                                             (project.gallery && project.gallery.some(cat => cat.images && cat.images.length > 0))) && (
//                                                 <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
//                                                     <ImageIcon className="h-3 w-3 mr-1" />
//                                                     {project.galleryNow?.length ||
//                                                         project.gallery?.reduce((acc, cat) => acc + (cat.images?.length || 0), 0) || 0}
//                                                 </div>
//                                             )}

//                                         {/* Project Type */}
//                                         <div className="absolute bottom-3 left-3">
//                                             <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
//                                                 {project.type?.replace('_', ' ')}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Project Details */}
//                                     <div className="p-5">
//                                         <div className="mb-3">
//                                             <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
//                                                 {project.name}
//                                             </h3>
//                                             {project.builder && (
//                                                 <p className="text-sm text-gray-600 flex items-center">
//                                                     <Building2 className="h-4 w-4 mr-1" />
//                                                     {project.builder.name}
//                                                 </p>
//                                             )}
//                                         </div>

//                                         {/* Location */}
//                                         <div className="flex items-center text-gray-600 mb-3">
//                                             <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
//                                             <span className="text-sm truncate">
//                                                 {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
//                                             </span>
//                                         </div>

//                                         {/* Key Stats */}
//                                         <div className="grid grid-cols-2 gap-3 mb-4">
//                                             <div className="bg-gray-50 rounded-lg p-3">
//                                                 <div className="flex items-center justify-between">
//                                                     <Users className="h-4 w-4 text-gray-500" />
//                                                     <span className="text-xs text-gray-500">Units</span>
//                                                 </div>
//                                                 <p className="text-sm font-semibold text-gray-900 mt-1">
//                                                     {project.overview?.totalUnits || 'N/A'}
//                                                 </p>
//                                             </div>

//                                             <div className="bg-gray-50 rounded-lg p-3">
//                                                 <div className="flex items-center justify-between">
//                                                     <Link className="h-4 w-4 text-gray-500" />
//                                                     <span className="text-xs text-gray-500">Connected</span>
//                                                 </div>
//                                                 <p className="text-sm font-semibold text-gray-900 mt-1">
//                                                     {project.connectedProperties?.length || 0}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Price Range */}
//                                         {project.overview?.priceRange?.min && project.overview?.priceRange?.max && (
//                                             <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                                                 <p className="text-xs text-green-600 font-medium mb-1">Price Range</p>
//                                                 <p className="text-sm font-semibold text-green-800">
//                                                     {formatPrice(project.overview.priceRange.min)} - {formatPrice(project.overview.priceRange.max)}
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* RERA Info */}
//                                         {project.reraNumber && (
//                                             <div className="mb-4 text-xs text-gray-600">
//                                                 <span className="font-medium">RERA:</span> {project.reraNumber}
//                                             </div>
//                                         )}

//                                         {/* Action Buttons */}
//                                         <div className="space-y-2">
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <button
//                                                     onClick={() => handleViewProject(project.projectId || project._id)}
//                                                     className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-lg transition-colors"
//                                                 >
//                                                     <Eye className="h-4 w-4 mr-1" />
//                                                     View
//                                                 </button>

//                                                 <button
//                                                     onClick={() => handleEditProject(project.projectId || project._id)}
//                                                     className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
//                                                 >
//                                                     <Edit className="h-4 w-4 mr-1" />
//                                                     Edit
//                                                 </button>
//                                             </div>

//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <button
//                                                     onClick={() => handleViewConnectedProperties(
//                                                         project.projectId || project._id,
//                                                         project.name,
//                                                         project.connectedProperties?.length || 0
//                                                     )}
//                                                     className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${(project.connectedProperties?.length > 0)
//                                                             ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
//                                                             : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                                         }`}
//                                                     disabled={!project.connectedProperties?.length}
//                                                 >
//                                                     <Link className="h-4 w-4 mr-1" />
//                                                     View Links
//                                                 </button>

//                                                 <button
//                                                     onClick={() => handleConnectProperties(project.projectId || project._id, project.name)}
//                                                     className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
//                                                 >
//                                                     <Plus className="h-4 w-4 mr-1" />
//                                                     Connect
//                                                 </button>
//                                             </div>

//                                             <button
//                                                 onClick={() => handleDeleteProject(project.projectId || project._id)}
//                                                 className="w-full flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
//                                             >
//                                                 <Trash2 className="h-4 w-4 mr-1" />
//                                                 Delete Project
//                                             </button>

//                                             {/* Additional Actions */}
//                                             <div className="pt-2 border-t border-gray-100">
//                                                 <div className="grid grid-cols-2 gap-2">
//                                                     <Button
//                                                         onClick={() => handleAddProjectViewer(project?.projectId)}
//                                                         size="small"
//                                                         className="text-xs"
//                                                     >
//                                                         Add Viewer
//                                                     </Button>
//                                                     <Button
//                                                         onClick={() => handleViewProjectViewer(project?.projectId)}
//                                                         size="small"
//                                                         className="text-xs"
//                                                     >
//                                                         View Viewer
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProjectsListPage;