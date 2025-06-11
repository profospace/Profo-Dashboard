// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { Play, Trash2, Info, Filter, RefreshCw } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

// const VideoGalleryPage = () => {
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [filters, setFilters] = useState({
//         entityType: '',
//         entityId: '',
//         searchTerm: ''
//     });
//     const [showFilters, setShowFilters] = useState(false);
//     const [entityOptions, setEntityOptions] = useState({
//         properties: [],
//         projects: [],
//         buildings: []
//     });

//     // Fetch videos on component mount
//     useEffect(() => {
//         fetchVideos();
//         fetchEntityOptions();
//     }, []);

//     const fetchVideos = async () => {
//         setLoading(true);
//         try {
//             // Construct query parameters from filters
//             const params = new URLSearchParams();
//             if (filters.entityType) params.append('entityType', filters.entityType);
//             if (filters.entityId) params.append('entityId', filters.entityId);
//             if (filters.searchTerm) params.append('search', filters.searchTerm);

//             const response = await axios.get(`${base_url}/api/videos?${params.toString()}`);
//             setVideos(response.data);
//             setError('');
//         } catch (err) {
//             console.error('Error fetching videos:', err);
//             setError('Failed to load videos. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchEntityOptions = async () => {
//         try {
//             const [propertiesRes, projectsRes, buildingsRes] = await Promise.all([
//                 axios.get(`${base_url}/api/properties/all`),
//                 axios.get(`${base_url}/api/projects`),
//                 axios.get(`${base_url}/api/buildings`)
//             ]);

//             setEntityOptions({
//                 properties: propertiesRes.data.map(item => ({
//                     id: item._id,
//                     name: item.post_title || `Property ${item.post_id}`
//                 })),
//                 projects: projectsRes.data.map(item => ({
//                     id: item._id,
//                     name: item.name
//                 })),
//                 buildings: buildingsRes.data.buildings ? buildingsRes.data.buildings.map(item => ({
//                     id: item._id,
//                     name: item.name
//                 })) : []
//             });
//         } catch (err) {
//             console.error('Error fetching entity options:', err);
//         }
//     };

//     const handleDeleteVideo = async (videoId) => {
//         if (!confirm('Are you sure you want to delete this video?')) {
//             return;
//         }

//         try {
//             await axios.delete(`${base_url}/api/videos/${videoId}`);
//             setVideos(videos.filter(video => video._id !== videoId));
//         } catch (err) {
//             console.error('Error deleting video:', err);
//             alert('Failed to delete video');
//         }
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // Reset entityId if entityType changes
//         if (name === 'entityType') {
//             setFilters(prev => ({
//                 ...prev,
//                 entityId: ''
//             }));
//         }
//     };

//     const applyFilters = () => {
//         fetchVideos();
//     };

//     const resetFilters = () => {
//         setFilters({
//             entityType: '',
//             entityId: '',
//             searchTerm: ''
//         });
//         // Fetch videos without filters
//         fetchVideos();
//     };

//     // Get entity options based on selected type
//     const getEntityOptionsForType = () => {
//         switch (filters.entityType) {
//             case 'Property':
//                 return entityOptions.properties;
//             case 'Project':
//                 return entityOptions.projects;
//             case 'Building':
//                 return entityOptions.buildings;
//             default:
//                 return [];
//         }
//     };

//     // Format the duration in seconds to MM:SS format
//     const formatDuration = (seconds) => {
//         if (!seconds) return '00:00';
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = Math.floor(seconds % 60);
//         return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-900">Video Gallery</h1>
//                 <div className="flex space-x-4">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                     >
//                         <Filter className="h-4 w-4 mr-2" />
//                         {showFilters ? 'Hide Filters' : 'Show Filters'}
//                     </button>
//                     <Link
//                         to="/upload"
//                         className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//                     >
//                         Upload New Video
//                     </Link>
//                 </div>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//                 <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div>
//                             <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Search
//                             </label>
//                             <input
//                                 type="text"
//                                 id="searchTerm"
//                                 name="searchTerm"
//                                 value={filters.searchTerm}
//                                 onChange={handleFilterChange}
//                                 placeholder="Search by title or description"
//                                 className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Entity Type
//                             </label>
//                             <select
//                                 id="entityType"
//                                 name="entityType"
//                                 value={filters.entityType}
//                                 onChange={handleFilterChange}
//                                 className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                             >
//                                 <option value="">All Types</option>
//                                 <option value="Property">Property</option>
//                                 <option value="Project">Project</option>
//                                 <option value="Building">Building</option>
//                                 <option value="Other">Other</option>
//                             </select>
//                         </div>

//                         {filters.entityType && filters.entityType !== 'Other' && (
//                             <div>
//                                 <label htmlFor="entityId" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Select {filters.entityType}
//                                 </label>
//                                 <select
//                                     id="entityId"
//                                     name="entityId"
//                                     value={filters.entityId}
//                                     onChange={handleFilterChange}
//                                     className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                                 >
//                                     <option value="">All {filters.entityType}s</option>
//                                     {getEntityOptionsForType().map(option => (
//                                         <option key={option.id} value={option.id}>
//                                             {option.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}

//                         <div className="flex items-end space-x-2">
//                             <button
//                                 onClick={applyFilters}
//                                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             >
//                                 Apply Filters
//                             </button>
//                             <button
//                                 onClick={resetFilters}
//                                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                             >
//                                 <RefreshCw className="h-4 w-4" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {error && (
//                 <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//                     <p className="text-red-700">{error}</p>
//                 </div>
//             )}

//             {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//             ) : videos.length === 0 ? (
//                 <div className="text-center py-16 bg-gray-50 rounded-lg">
//                     <Info className="mx-auto h-12 w-12 text-gray-400" />
//                     <h3 className="mt-2 text-lg font-medium text-gray-900">No videos found</h3>
//                     <p className="mt-1 text-sm text-gray-500">
//                         {filters.entityType || filters.searchTerm
//                             ? 'Try adjusting your filters or search terms'
//                             : 'Upload your first video to get started'}
//                     </p>
//                     <div className="mt-6">
//                         <Link
//                             to="/upload"
//                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
//                         >
//                             Upload Video
//                         </Link>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {videos?.map(video => (
//                         <div key={video._id} className="bg-white rounded-lg shadow overflow-hidden transition duration-300 hover:shadow-lg">
//                             <div className="relative aspect-video group">
//                                 <img
//                                     src={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
//                                     alt={video.title}
//                                     className="w-full h-full object-cover"
//                                 />
//                                 <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                     <Link
//                                         to={`/videos/${video._id}`}
//                                         className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-300 transform hover:scale-110"
//                                     >
//                                         <Play className="h-6 w-6" />
//                                     </Link>
//                                 </div>
//                                 {video.duration && (
//                                     <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//                                         {formatDuration(video.duration)}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="p-4">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
//                                     {video.title}
//                                 </h3>
//                                 <p className="text-sm text-gray-500 mb-2">
//                                     {video.entityType}{video.entityName ? `: ${video.entityName}` : ''}
//                                 </p>
//                                 <div className="flex justify-between items-center">
//                                     <div className="text-xs text-gray-500">
//                                         {new Date(video.createdAt).toLocaleDateString()}
//                                     </div>
//                                     <button
//                                         onClick={() => handleDeleteVideo(video._id)}
//                                         className="text-red-600 hover:text-red-800 transition duration-150"
//                                         title="Delete video"
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VideoGalleryPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, Trash2, Info, Filter, RefreshCw } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import CopyButton from '../../components/Video/CopyButton';

const VideoGalleryPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        entityType: '',
        entityId: '',
        searchTerm: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [entityOptions, setEntityOptions] = useState({
        properties: [],
        projects: [],
        buildings: []
    });

    // Fetch videos on component mount
    useEffect(() => {
        fetchVideos();
        fetchEntityOptions();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            // Construct query parameters from filters
            const params = new URLSearchParams();
            if (filters.entityType) params.append('entityType', filters.entityType);
            if (filters.entityId) params.append('entityId', filters.entityId);
            if (filters.searchTerm) params.append('search', filters.searchTerm);

            const response = await axios.get(`${base_url}/api/videos?${params.toString()}`);
            setVideos(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError('Failed to load videos. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchEntityOptions = async () => {
        try {
            const [propertiesRes, projectsRes, buildingsRes] = await Promise.all([
                axios.get(`${base_url}/api/properties/all`),
                axios.get(`${base_url}/api/projects`),
                axios.get(`${base_url}/api/buildings`)
            ]);

            setEntityOptions({
                properties: propertiesRes.data.map(item => ({
                    id: item._id,
                    name: item.post_title || `Property ${item.post_id}`
                })),
                projects: projectsRes.data.map(item => ({
                    id: item._id,
                    name: item.name
                })),
                buildings: buildingsRes.data.buildings ? buildingsRes.data.buildings.map(item => ({
                    id: item._id,
                    name: item.name
                })) : []
            });
        } catch (err) {
            console.error('Error fetching entity options:', err);
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!confirm('Are you sure you want to delete this video?')) {
            return;
        }

        try {
            await axios.delete(`${base_url}/api/videos/${videoId}`);
            setVideos(videos.filter(video => video._id !== videoId));
        } catch (err) {
            console.error('Error deleting video:', err);
            alert('Failed to delete video');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset entityId if entityType changes
        if (name === 'entityType') {
            setFilters(prev => ({
                ...prev,
                entityId: ''
            }));
        }
    };

    const applyFilters = () => {
        fetchVideos();
    };

    const resetFilters = () => {
        setFilters({
            entityType: '',
            entityId: '',
            searchTerm: ''
        });
        // Fetch videos without filters
        fetchVideos();
    };

    // Get entity options based on selected type
    const getEntityOptionsForType = () => {
        switch (filters.entityType) {
            case 'Property':
                return entityOptions.properties;
            case 'Project':
                return entityOptions.projects;
            case 'Building':
                return entityOptions.buildings;
            default:
                return [];
        }
    };

    // Format the duration in seconds to MM:SS format
    const formatDuration = (seconds) => {
        if (!seconds) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Video Gallery</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <Link
                        to="/upload"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Upload New Video
                    </Link>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <input
                                type="text"
                                id="searchTerm"
                                name="searchTerm"
                                value={filters.searchTerm}
                                onChange={handleFilterChange}
                                placeholder="Search by title or description"
                                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
                                Entity Type
                            </label>
                            <select
                                id="entityType"
                                name="entityType"
                                value={filters.entityType}
                                onChange={handleFilterChange}
                                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="Property">Property</option>
                                <option value="Project">Project</option>
                                <option value="Building">Building</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {filters.entityType && filters.entityType !== 'Other' && (
                            <div>
                                <label htmlFor="entityId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select {filters.entityType}
                                </label>
                                <select
                                    id="entityId"
                                    name="entityId"
                                    value={filters.entityId}
                                    onChange={handleFilterChange}
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                >
                                    <option value="">All {filters.entityType}s</option>
                                    {getEntityOptionsForType().map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-end space-x-2">
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Info className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No videos found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filters.entityType || filters.searchTerm
                            ? 'Try adjusting your filters or search terms'
                            : 'Upload your first video to get started'}
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/upload"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Upload Video
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos?.map(video => (
                        <div key={video._id} className="bg-white rounded-lg shadow overflow-hidden transition duration-300 hover:shadow-lg">
                            <div className="relative aspect-video group">
                                <img
                                    src={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Link
                                        to={`/videos/${video._id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-300 transform hover:scale-110"
                                    >
                                        <Play className="h-6 w-6" />
                                    </Link>
                                </div>
                                {video.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                        {formatDuration(video.duration)}
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                    {video.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {video.entityType}{video.entityName ? `: ${video.entityName}` : ''}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        {new Date(video.createdAt).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteVideo(video._id)}
                                        className="text-red-600 hover:text-red-800 transition duration-150"
                                        title="Delete video"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            <div>
                                    <CopyButton text={video?.videoUrl}/>
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoGalleryPage;