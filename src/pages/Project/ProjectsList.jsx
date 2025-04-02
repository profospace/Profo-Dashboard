// // // import React, { useState, useEffect } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import axios from 'axios';
// // // import { toast } from 'react-hot-toast';
// // // import { base_url } from "../../../utils/base_url";

// // // const ProjectsListPage = () => {
// // //     const [projects, setProjects] = useState([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [filters, setFilters] = useState({
// // //         type: '',
// // //         status: '',
// // //         city: ''
// // //     });
// // //     const [searchTerm, setSearchTerm] = useState('');
// // //     const navigate = useNavigate();

// // //     useEffect(() => {
// // //         fetchProjects();
// // //     }, [filters]);

// // //     const fetchProjects = async () => {
// // //         try {
// // //             setLoading(true);
// // //             // Build query parameters from filters
// // //             const queryParams = new URLSearchParams();
// // //             if (filters.type) queryParams.append('type', filters.type);
// // //             if (filters.status) queryParams.append('status', filters.status);
// // //             if (filters.city) queryParams.append('city', filters.city);

// // //             const response = await axios.get(`${base_url}/api/projects?${queryParams.toString()}`);
// // //             setProjects(response.data);
// // //         } catch (error) {
// // //             console.error('Error fetching projects:', error);
// // //             toast.error('Failed to load projects');
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const handleFilterChange = (e) => {
// // //         const { name, value } = e.target;
// // //         setFilters(prev => ({
// // //             ...prev,
// // //             [name]: value
// // //         }));
// // //     };

// // //     const handleSearchChange = (e) => {
// // //         setSearchTerm(e.target.value);
// // //     };

// // //     const resetFilters = () => {
// // //         setFilters({
// // //             type: '',
// // //             status: '',
// // //             city: ''
// // //         });
// // //         setSearchTerm('');
// // //     };

// // //     const handleEditProject = (projectId) => {
// // //         navigate(`/projects/edit/${projectId}`);
// // //     };

// // //     const handleViewProject = (projectId) => {
// // //         navigate(`/projects/${projectId}`);
// // //     };

// // //     const handleDeleteProject = async (projectId) => {
// // //         if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
// // //             return;
// // //         }

// // //         try {
// // //             setLoading(true);
// // //             await axios.delete(`${base_url}/api/projects/${projectId}`);
// // //             toast.success('Project deleted successfully');
// // //             fetchProjects();
// // //         } catch (error) {
// // //             console.error('Error deleting project:', error);
// // //             toast.error('Failed to delete project');
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const handleAddNewProject = () => {
// // //         navigate('/projects/add');
// // //     };

// // //     const handleViewDrafts = () => {
// // //         navigate('/projects/drafts');
// // //     };

// // //     const getStatusColor = (status) => {
// // //         switch (status?.toLowerCase()) {
// // //             case 'upcoming':
// // //                 return 'bg-yellow-100 text-yellow-800';
// // //             case 'under_construction':
// // //                 return 'bg-orange-100 text-orange-800';
// // //             case 'completed':
// // //                 return 'bg-green-100 text-green-800';
// // //             default:
// // //                 return 'bg-gray-100 text-gray-800';
// // //         }
// // //     };

// // //     const formatStatus = (status) => {
// // //         if (!status) return 'Unknown';
// // //         return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
// // //     };

// // //     // Filter projects by search term
// // //     const filteredProjects = projects.filter(project =>
// // //         project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         (project.builder?.name && project.builder.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
// // //         (project.location?.city && project.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
// // //     );

// // //     return (
// // //         <div className="mx-auto ">
// // //             <div className="flex justify-between items-center mb-8">
// // //                 <h1 className="text-3xl font-bold text-gray-800">Projects Management</h1>
// // //                 <div className="flex space-x-4">
// // //                     <button
// // //                         onClick={handleViewDrafts}
// // //                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
// // //                     >
// // //                         View Drafts
// // //                     </button>
// // //                     <button
// // //                         onClick={handleAddNewProject}
// // //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //                     >
// // //                         Add New Project
// // //                     </button>
// // //                 </div>
// // //             </div>

// // //             {/* Filter Section */}
// // //             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
// // //                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Projects</h2>
// // //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //                     <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
// // //                         <input
// // //                             type="text"
// // //                             value={searchTerm}
// // //                             onChange={handleSearchChange}
// // //                             placeholder="Search by name, builder, city..."
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                     </div>
// // //                     <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
// // //                         <select
// // //                             name="type"
// // //                             value={filters.type}
// // //                             onChange={handleFilterChange}
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         >
// // //                             <option value="">All Types</option>
// // //                             <option value="RESIDENTIAL">Residential</option>
// // //                             <option value="COMMERCIAL">Commercial</option>
// // //                             <option value="MIXED_USE">Mixed Use</option>
// // //                         </select>
// // //                     </div>
// // //                     <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// // //                         <select
// // //                             name="status"
// // //                             value={filters.status}
// // //                             onChange={handleFilterChange}
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         >
// // //                             <option value="">All Statuses</option>
// // //                             <option value="UPCOMING">Upcoming</option>
// // //                             <option value="UNDER_CONSTRUCTION">Under Construction</option>
// // //                             <option value="COMPLETED">Completed</option>
// // //                         </select>
// // //                     </div>
// // //                     <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
// // //                         <input
// // //                             type="text"
// // //                             name="city"
// // //                             value={filters.city}
// // //                             onChange={handleFilterChange}
// // //                             placeholder="Enter city name"
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                         />
// // //                     </div>
// // //                 </div>
// // //                 <div className="flex justify-end mt-4">
// // //                     <button
// // //                         onClick={resetFilters}
// // //                         className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
// // //                     >
// // //                         Reset Filters
// // //                     </button>
// // //                 </div>
// // //             </div>

// // //             {/* Projects Grid */}
// // //             <div className="bg-white rounded-lg shadow-md p-6">
// // //                 <h2 className="text-xl font-semibold text-gray-700 mb-6">
// // //                     All Projects {filteredProjects.length > 0 && `(${filteredProjects.length})`}
// // //                 </h2>

// // //                 {loading ? (
// // //                     <div className="flex justify-center items-center py-16">
// // //                         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
// // //                     </div>
// // //                 ) : filteredProjects.length === 0 ? (
// // //                     <div className="text-center py-16 text-gray-500">
// // //                         <p className="text-xl">No projects found.</p>
// // //                         <p className="mt-2">Try adjusting your filters or add a new project.</p>
// // //                         <button
// // //                             onClick={handleAddNewProject}
// // //                             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //                         >
// // //                             Add New Project
// // //                         </button>
// // //                     </div>
// // //                 ) : (
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //                         {filteredProjects.map((project) => (
// // //                             <div
// // //                                 key={project._id || project.projectId}
// // //                                 className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
// // //                             >
// // //                                 <div className="p-5">
// // //                                     <div className="flex justify-between items-start mb-3">
// // //                                         <h3 className="text-lg font-semibold text-gray-800 truncate">{project.name}</h3>
// // //                                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
// // //                                             {formatStatus(project.status)}
// // //                                         </span>
// // //                                     </div>

// // //                                     <div className="space-y-2 mb-4">
// // //                                         {project.builder && (
// // //                                             <p className="text-sm text-gray-600">
// // //                                                 <span className="font-medium">Builder:</span> {project.builder.name}
// // //                                             </p>
// // //                                         )}
// // //                                         <p className="text-sm text-gray-600">
// // //                                             <span className="font-medium">Type:</span> {project.type?.replace('_', ' ')}
// // //                                         </p>
// // //                                         <p className="text-sm text-gray-600">
// // //                                             <span className="font-medium">Location:</span> {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
// // //                                         </p>
// // //                                         <p className="text-sm text-gray-600">
// // //                                             <span className="font-medium">Units:</span> {project.overview?.totalUnits || 'N/A'}
// // //                                         </p>
// // //                                         <p className="text-sm text-gray-600">
// // //                                             <span className="font-medium">RERA:</span> {project.reraNumber || 'N/A'}
// // //                                         </p>
// // //                                     </div>

// // //                                     {project.connectedProperties && project.connectedProperties.length > 0 && (
// // //                                         <div className="mt-2 mb-4">
// // //                                             <p className="text-sm font-medium text-gray-700">
// // //                                                 Connected Properties: {project.connectedProperties.length}
// // //                                             </p>
// // //                                         </div>
// // //                                     )}

// // //                                     <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
// // //                                         <button
// // //                                             onClick={() => handleViewProject(project.projectId || project._id)}
// // //                                             className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded transition-colors"
// // //                                         >
// // //                                             View Details
// // //                                         </button>
// // //                                         <div className="flex space-x-2">
// // //                                             <button
// // //                                                 onClick={() => handleEditProject(project.projectId || project._id)}
// // //                                                 className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
// // //                                             >
// // //                                                 Edit
// // //                                             </button>
// // //                                             <button
// // //                                                 onClick={() => handleDeleteProject(project.projectId || project._id)}
// // //                                                 className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
// // //                                             >
// // //                                                 Delete
// // //                                             </button>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default ProjectsListPage;


// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { toast } from 'react-hot-toast';
// // import { base_url } from "../../../utils/base_url";

// // const ProjectsListPage = () => {
// //     const [projects, setProjects] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [filters, setFilters] = useState({
// //         type: '',
// //         status: '',
// //         city: ''
// //     });
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         fetchProjects();
// //     }, [filters]);

// //     const fetchProjects = async () => {
// //         try {
// //             setLoading(true);
// //             // Build query parameters from filters
// //             const queryParams = new URLSearchParams();
// //             if (filters.type) queryParams.append('type', filters.type);
// //             if (filters.status) queryParams.append('status', filters.status);
// //             if (filters.city) queryParams.append('city', filters.city);

// //             const response = await axios.get(`${base_url}/api/projects?${queryParams.toString()}`);
// //             setProjects(response.data);
// //         } catch (error) {
// //             console.error('Error fetching projects:', error);
// //             toast.error('Failed to load projects');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleFilterChange = (e) => {
// //         const { name, value } = e.target;
// //         setFilters(prev => ({
// //             ...prev,
// //             [name]: value
// //         }));
// //     };

// //     const handleSearchChange = (e) => {
// //         setSearchTerm(e.target.value);
// //     };

// //     const resetFilters = () => {
// //         setFilters({
// //             type: '',
// //             status: '',
// //             city: ''
// //         });
// //         setSearchTerm('');
// //     };

// //     const handleEditProject = (projectId) => {
// //         navigate(`/projects/edit/${projectId}`);
// //     };

// //     const handleViewProject = (projectId) => {
// //         navigate(`/projects/${projectId}`);
// //     };

// //     const handleConnectProperties = (projectId, projectName) => {
// //         navigate(`/projects/${projectId}/connect-properties`, {
// //             state: { projectName }
// //         });
// //     };

// //     const handleDeleteProject = async (projectId) => {
// //         if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
// //             return;
// //         }

// //         try {
// //             setLoading(true);
// //             await axios.delete(`${base_url}/api/projects/${projectId}`);
// //             toast.success('Project deleted successfully');
// //             fetchProjects();
// //         } catch (error) {
// //             console.error('Error deleting project:', error);
// //             toast.error('Failed to delete project');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleAddNewProject = () => {
// //         navigate('/projects/add');
// //     };

// //     const handleViewDrafts = () => {
// //         navigate('/projects/drafts');
// //     };

// //     const getStatusColor = (status) => {
// //         switch (status?.toLowerCase()) {
// //             case 'upcoming':
// //                 return 'bg-yellow-100 text-yellow-800';
// //             case 'under_construction':
// //                 return 'bg-orange-100 text-orange-800';
// //             case 'completed':
// //                 return 'bg-green-100 text-green-800';
// //             default:
// //                 return 'bg-gray-100 text-gray-800';
// //         }
// //     };

// //     const formatStatus = (status) => {
// //         if (!status) return 'Unknown';
// //         return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
// //     };

// //     // Filter projects by search term
// //     const filteredProjects = projects.filter(project =>
// //         project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         (project.builder?.name && project.builder.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
// //         (project.location?.city && project.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
// //     );

// //     return (
// //         <div className="mx-auto ">
// //             <div className="flex justify-between items-center mb-8">
// //                 <h1 className="text-3xl font-bold text-gray-800">Projects Management</h1>
// //                 <div className="flex space-x-4">
// //                     <button
// //                         onClick={handleViewDrafts}
// //                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
// //                     >
// //                         View Drafts
// //                     </button>
// //                     <button
// //                         onClick={handleAddNewProject}
// //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //                     >
// //                         Add New Project
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Filter Section */}
// //             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
// //                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Projects</h2>
// //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
// //                         <input
// //                             type="text"
// //                             value={searchTerm}
// //                             onChange={handleSearchChange}
// //                             placeholder="Search by name, builder, city..."
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
// //                         <select
// //                             name="type"
// //                             value={filters.type}
// //                             onChange={handleFilterChange}
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         >
// //                             <option value="">All Types</option>
// //                             <option value="RESIDENTIAL">Residential</option>
// //                             <option value="COMMERCIAL">Commercial</option>
// //                             <option value="MIXED_USE">Mixed Use</option>
// //                         </select>
// //                     </div>
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// //                         <select
// //                             name="status"
// //                             value={filters.status}
// //                             onChange={handleFilterChange}
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         >
// //                             <option value="">All Statuses</option>
// //                             <option value="UPCOMING">Upcoming</option>
// //                             <option value="UNDER_CONSTRUCTION">Under Construction</option>
// //                             <option value="COMPLETED">Completed</option>
// //                         </select>
// //                     </div>
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
// //                         <input
// //                             type="text"
// //                             name="city"
// //                             value={filters.city}
// //                             onChange={handleFilterChange}
// //                             placeholder="Enter city name"
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>
// //                 </div>
// //                 <div className="flex justify-end mt-4">
// //                     <button
// //                         onClick={resetFilters}
// //                         className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
// //                     >
// //                         Reset Filters
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Projects Grid */}
// //             <div className="bg-white rounded-lg shadow-md p-6">
// //                 <h2 className="text-xl font-semibold text-gray-700 mb-6">
// //                     All Projects {filteredProjects.length > 0 && `(${filteredProjects.length})`}
// //                 </h2>

// //                 {loading ? (
// //                     <div className="flex justify-center items-center py-16">
// //                         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
// //                     </div>
// //                 ) : filteredProjects.length === 0 ? (
// //                     <div className="text-center py-16 text-gray-500">
// //                         <p className="text-xl">No projects found.</p>
// //                         <p className="mt-2">Try adjusting your filters or add a new project.</p>
// //                         <button
// //                             onClick={handleAddNewProject}
// //                             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //                         >
// //                             Add New Project
// //                         </button>
// //                     </div>
// //                 ) : (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                         {filteredProjects.map((project) => (
// //                             <div
// //                                 key={project._id || project.projectId}
// //                                 className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
// //                             >
// //                                 <div className="p-5">
// //                                     <div className="flex justify-between items-start mb-3">
// //                                         <h3 className="text-lg font-semibold text-gray-800 truncate">{project.name}</h3>
// //                                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
// //                                             {formatStatus(project.status)}
// //                                         </span>
// //                                     </div>

// //                                     <div className="space-y-2 mb-4">
// //                                         {project.builder && (
// //                                             <p className="text-sm text-gray-600">
// //                                                 <span className="font-medium">Builder:</span> {project.builder.name}
// //                                             </p>
// //                                         )}
// //                                         <p className="text-sm text-gray-600">
// //                                             <span className="font-medium">Type:</span> {project.type?.replace('_', ' ')}
// //                                         </p>
// //                                         <p className="text-sm text-gray-600">
// //                                             <span className="font-medium">Location:</span> {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
// //                                         </p>
// //                                         <p className="text-sm text-gray-600">
// //                                             <span className="font-medium">Units:</span> {project.overview?.totalUnits || 'N/A'}
// //                                         </p>
// //                                         <p className="text-sm text-gray-600">
// //                                             <span className="font-medium">RERA:</span> {project.reraNumber || 'N/A'}
// //                                         </p>
// //                                     </div>

// //                                     {/* Connected Properties Information */}
// //                                     <div className="mt-2 mb-4">
// //                                         <p className="text-sm font-medium text-gray-700">
// //                                             Connected Properties: {project.connectedProperties?.length || 0}
// //                                         </p>
// //                                     </div>

// //                                     <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
// //                                         <button
// //                                             onClick={() => handleViewProject(project.projectId || project._id)}
// //                                             className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded transition-colors"
// //                                         >
// //                                             View Details
// //                                         </button>

// //                                         <button
// //                                             onClick={() => handleConnectProperties(project.projectId || project._id, project.name)}
// //                                             className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
// //                                         >
// //                                             Connect Properties
// //                                         </button>

// //                                         <button
// //                                             onClick={() => handleEditProject(project.projectId || project._id)}
// //                                             className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
// //                                         >
// //                                             Edit
// //                                         </button>

// //                                         <button
// //                                             onClick={() => handleDeleteProject(project.projectId || project._id)}
// //                                             className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
// //                                         >
// //                                             Delete
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default ProjectsListPage;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { base_url } from "../../../utils/base_url";

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
//             // Build query parameters from filters
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
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'under_construction':
//                 return 'bg-orange-100 text-orange-800';
//             case 'completed':
//                 return 'bg-green-100 text-green-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const formatStatus = (status) => {
//         if (!status) return 'Unknown';
//         return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//     };

//     // Filter projects by search term
//     const filteredProjects = projects.filter(project =>
//         project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (project.builder?.name && project.builder.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (project.location?.city && project.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     return (
//         <div className="mx-auto ">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-800">Projects Management</h1>
//                 <div className="flex space-x-4">
//                     <button
//                         onClick={handleViewDrafts}
//                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//                     >
//                         View Drafts
//                     </button>
//                     <button
//                         onClick={handleAddNewProject}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                     >
//                         Add New Project
//                     </button>
//                 </div>
//             </div>

//             {/* Filter Section */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Projects</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//                         <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             placeholder="Search by name, builder, city..."
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
//                         <select
//                             name="type"
//                             value={filters.type}
//                             onChange={handleFilterChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Types</option>
//                             <option value="RESIDENTIAL">Residential</option>
//                             <option value="COMMERCIAL">Commercial</option>
//                             <option value="MIXED_USE">Mixed Use</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                         <select
//                             name="status"
//                             value={filters.status}
//                             onChange={handleFilterChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Statuses</option>
//                             <option value="UPCOMING">Upcoming</option>
//                             <option value="UNDER_CONSTRUCTION">Under Construction</option>
//                             <option value="COMPLETED">Completed</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                         <input
//                             type="text"
//                             name="city"
//                             value={filters.city}
//                             onChange={handleFilterChange}
//                             placeholder="Enter city name"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>
//                 <div className="flex justify-end mt-4">
//                     <button
//                         onClick={resetFilters}
//                         className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                     >
//                         Reset Filters
//                     </button>
//                 </div>
//             </div>

//             {/* Projects Grid */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-700 mb-6">
//                     All Projects {filteredProjects.length > 0 && `(${filteredProjects.length})`}
//                 </h2>

//                 {loading ? (
//                     <div className="flex justify-center items-center py-16">
//                         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : filteredProjects.length === 0 ? (
//                     <div className="text-center py-16 text-gray-500">
//                         <p className="text-xl">No projects found.</p>
//                         <p className="mt-2">Try adjusting your filters or add a new project.</p>
//                         <button
//                             onClick={handleAddNewProject}
//                             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                             Add New Project
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filteredProjects.map((project) => (
//                             <div
//                                 key={project._id || project.projectId}
//                                 className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
//                             >
//                                 <div className="p-5">
//                                     <div className="flex justify-between items-start mb-3">
//                                         <h3 className="text-lg font-semibold text-gray-800 truncate">{project.name}</h3>
//                                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
//                                             {formatStatus(project.status)}
//                                         </span>
//                                     </div>

//                                     <div className="space-y-2 mb-4">
//                                         {project.builder && (
//                                             <p className="text-sm text-gray-600">
//                                                 <span className="font-medium">Builder:</span> {project.builder.name}
//                                             </p>
//                                         )}
//                                         <p className="text-sm text-gray-600">
//                                             <span className="font-medium">Type:</span> {project.type?.replace('_', ' ')}
//                                         </p>
//                                         <p className="text-sm text-gray-600">
//                                             <span className="font-medium">Location:</span> {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
//                                         </p>
//                                         <p className="text-sm text-gray-600">
//                                             <span className="font-medium">Units:</span> {project.overview?.totalUnits || 'N/A'}
//                                         </p>
//                                         <p className="text-sm text-gray-600">
//                                             <span className="font-medium">RERA:</span> {project.reraNumber || 'N/A'}
//                                         </p>
//                                     </div>

//                                     {/* Connected Properties Information */}
//                                     <div className="mt-2 mb-4">
//                                         <p className="text-sm font-medium text-gray-700">
//                                             Connected Properties: {project.connectedProperties?.length || 0}
//                                         </p>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
//                                         <button
//                                             onClick={() => handleViewProject(project.projectId || project._id)}
//                                             className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded transition-colors"
//                                         >
//                                             View Details
//                                         </button>

//                                         <button
//                                             onClick={() => handleEditProject(project.projectId || project._id)}
//                                             className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
//                                         >
//                                             Edit
//                                         </button>

//                                         <button
//                                             onClick={() => handleConnectProperties(project.projectId || project._id, project.name)}
//                                             className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
//                                         >
//                                             Connect Properties
//                                         </button>

//                                         <button
//                                             onClick={() => handleDisconnectProperties(
//                                                 project.projectId || project._id,
//                                                 project.name,
//                                                 project.connectedProperties?.length || 0
//                                             )}
//                                             className={`px-3 py-1.5 text-sm rounded transition-colors ${(project.connectedProperties?.length > 0)
//                                                     ? 'bg-amber-600 hover:bg-amber-700 text-white'
//                                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                                 }`}
//                                             disabled={!project.connectedProperties?.length}
//                                         >
//                                             Disconnect Properties
//                                         </button>

//                                         <button
//                                             onClick={() => handleDeleteProject(project.projectId || project._id)}
//                                             className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors col-span-2"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProjectsListPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";

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