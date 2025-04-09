// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { base_url } from "../../../utils/base_url";
// import ProjectForm from '../../components/Project/ProjectForm';

// const EditProjectPage = () => {
//     const { projectId } = useParams();
//     const [loading, setLoading] = useState(false);
//     const [fetchingProject, setFetchingProject] = useState(true);
//     const [projectData, setProjectData] = useState(null);
//     const [builders, setBuilders] = useState([]);
//     const navigate = useNavigate();

//     // Fetch project data and builders on component mount
//     useEffect(() => {
//         fetchProject();
//         fetchBuilders();
//     }, [projectId]);

//     const fetchBuilders = async () => {
//         try {
//             const response = await axios.get(`${base_url}/builders`);
//             setBuilders(response.data);
//         } catch (error) {
//             console.error('Error fetching builders:', error);
//             toast.error('Failed to load builders');
//         }
//     };

//     const fetchProject = async () => {
//         try {
//             setFetchingProject(true);
//             const response = await axios.get(`${base_url}/api/projects/${projectId}`);

//             // Format dates for form fields
//             const formattedProject = {
//                 ...response.data,
//                 overview: {
//                     ...response.data.overview,
//                     launchDate: response.data.overview?.launchDate ? new Date(response.data.overview.launchDate).toISOString().split('T')[0] : '',
//                     possessionDate: response.data.overview?.possessionDate ? new Date(response.data.overview.possessionDate).toISOString().split('T')[0] : '',
//                 }
//             };

//             // Extract latitude and longitude from coordinates
//             if (formattedProject.location?.coordinates?.coordinates) {
//                 const [longitude, latitude] = formattedProject.location.coordinates.coordinates;
//                 formattedProject.location = {
//                     ...formattedProject.location,
//                     latitude: latitude,
//                     longitude: longitude
//                 };
//             }

//             setProjectData(formattedProject);
//         } catch (error) {
//             console.error('Error fetching project:', error);
//             toast.error('Failed to load project details');
//             navigate('/projects'); // Redirect back if project can't be loaded
//         } finally {
//             setFetchingProject(false);
//         }
//     };

//     const handleFormChange = (updatedData) => {
//         setProjectData(updatedData);
//     };

//     const handleSubmit = async () => {
//         try {
//             setLoading(true);

//             // Validate required fields
//             if (!projectData.name || !projectData.builder || !projectData.type) {
//                 toast.error('Please fill out all required fields');
//                 setLoading(false);
//                 return;
//             }

//             // Format data for API
//             const formattedData = { ...projectData };

//             // Convert dates to proper format if needed
//             if (formattedData.overview?.launchDate) {
//                 formattedData.overview.launchDate = new Date(formattedData.overview.launchDate);
//             }

//             if (formattedData.overview?.possessionDate) {
//                 formattedData.overview.possessionDate = new Date(formattedData.overview.possessionDate);
//             }

//             // Format location coordinates
//             if (formattedData.location?.latitude && formattedData.location?.longitude) {
//                 const lat = parseFloat(formattedData.location.latitude);
//                 const lng = parseFloat(formattedData.location.longitude);

//                 formattedData.location = {
//                     ...formattedData.location,
//                     coordinates: {
//                         type: 'Point',
//                         coordinates: [lng, lat]
//                     }
//                 };
//             }

//             // Make PUT request to update project
//             const response = await axios.put(`${base_url}/api/projects/${projectId}`, formattedData);

//             toast.success('Project updated successfully');
//             navigate('/projects');
//         } catch (error) {
//             console.error('Error updating project:', error);
//             toast.error(`Failed to update project: ${error.response?.data?.error || error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//             navigate('/projects');
//         }
//     };

//     if (fetchingProject) {
//         return (
//             <div className="container mx-auto px-4 py-16 flex justify-center">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (!projectData) {
//         return (
//             <div className="container mx-auto px-4 py-16 text-center">
//                 <h2 className="text-2xl font-semibold text-gray-700">Project not found</h2>
//                 <p className="mt-4 text-gray-500">The project you're looking for doesn't exist or you don't have permission to edit it.</p>
//                 <button
//                     onClick={() => navigate('/projects')}
//                     className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                     Back to Projects
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-800">Edit Project: {projectData.name}</h1>
//                 <button
//                     onClick={() => navigate(`/projects/${projectId}`)}
//                     className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                 >
//                     View Project
//                 </button>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <ProjectForm
//                     projectData={projectData}
//                     isEditing={true}
//                     onSubmit={handleSubmit}
//                     onReset={handleCancel}
//                     onChange={handleFormChange}
//                     loading={loading}
//                     builders={builders}
//                 />
//             </div>
//         </div>
//     );
// };

// export default EditProjectPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";
import ProjectForm from '../../components/Project/ProjectForm';

const EditProjectPage = () => {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchingProject, setFetchingProject] = useState(true);
    const [projectData, setProjectData] = useState(null);
    const [builders, setBuilders] = useState([]);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [floorPlanFiles, setFloorPlanFiles] = useState({});
    const navigate = useNavigate();

    // Fetch project data and builders on component mount
    useEffect(() => {
        fetchProject();
        fetchBuilders();
    }, [projectId]);

    const fetchBuilders = async () => {
        try {
            const response = await axios.get(`${base_url}/builders`);
            setBuilders(response.data);
        } catch (error) {
            console.error('Error fetching builders:', error);
            toast.error('Failed to load builders');
        }
    };

    const fetchProject = async () => {
        try {
            setFetchingProject(true);
            const response = await axios.get(`${base_url}/api/projects/${projectId}`);

            // Format dates for form fields
            const formattedProject = {
                ...response.data,
                overview: {
                    ...response.data.overview,
                    launchDate: response.data.overview?.launchDate ? new Date(response.data.overview.launchDate).toISOString().split('T')[0] : '',
                    possessionDate: response.data.overview?.possessionDate ? new Date(response.data.overview.possessionDate).toISOString().split('T')[0] : '',
                }
            };

            // Extract latitude and longitude from coordinates
            if (formattedProject.location?.coordinates?.coordinates) {
                const [longitude, latitude] = formattedProject.location.coordinates.coordinates;
                formattedProject.location = {
                    ...formattedProject.location,
                    latitude: latitude,
                    longitude: longitude
                };
            }

            setProjectData(formattedProject);
        } catch (error) {
            console.error('Error fetching project:', error);
            toast.error('Failed to load project details');
            navigate('/projects'); // Redirect back if project can't be loaded
        } finally {
            setFetchingProject(false);
        }
    };

    const handleFormChange = (updatedData) => {
        setProjectData(updatedData);
    };

    // Function to handle file updates from ProjectForm
    const handleFileUpdates = (newGalleryFiles, newFloorPlanFiles) => {
        if (newGalleryFiles) {
            setGalleryFiles(newGalleryFiles);
        }

        if (newFloorPlanFiles) {
            setFloorPlanFiles(newFloorPlanFiles);
        }

        console.log("Files updated:", {
            galleryFiles: newGalleryFiles?.length || 0,
            floorPlanFiles: Object.keys(newFloorPlanFiles || {}).length
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Validate required fields
            if (!projectData.name || !projectData.builder || !projectData.type) {
                toast.error('Please fill out all required fields');
                setLoading(false);
                return;
            }

            // Format data for API
            const formattedData = { ...projectData };

            // Convert dates to proper format if needed
            if (formattedData.overview?.launchDate) {
                formattedData.overview.launchDate = new Date(formattedData.overview.launchDate);
            }

            if (formattedData.overview?.possessionDate) {
                formattedData.overview.possessionDate = new Date(formattedData.overview.possessionDate);
            }

            // Format location coordinates
            if (formattedData.location?.latitude && formattedData.location?.longitude) {
                const lat = parseFloat(formattedData.location.latitude);
                const lng = parseFloat(formattedData.location.longitude);

                formattedData.location = {
                    ...formattedData.location,
                    coordinates: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    }
                };
            }

            let response;

            // Check if we have files to upload
            const hasGalleryFiles = galleryFiles && galleryFiles.length > 0;
            const hasFloorPlanFiles = floorPlanFiles && Object.keys(floorPlanFiles).length > 0;

            if (hasGalleryFiles || hasFloorPlanFiles) {
                // Create FormData object for file uploads
                const formDataObj = new FormData();
                formDataObj.append('data', JSON.stringify(formattedData));

                // Add gallery images to FormData
                if (hasGalleryFiles) {
                    galleryFiles.forEach((file, index) => {
                        console.log(`Adding gallery file ${index}:`, file.name);
                        formDataObj.append('galleryList', file);
                    });
                }

                // Add floor plan images to FormData
                if (hasFloorPlanFiles) {
                    const floorPlanIndices = [];

                    Object.entries(floorPlanFiles).forEach(([index, file]) => {
                        console.log(`Adding floor plan file for index ${index}:`, file.name);
                        formDataObj.append('floorPlanImages', file);
                        floorPlanIndices.push(index);
                    });

                    // Add indices to help backend map files to floor plans
                    formDataObj.append('floorPlanIndices', JSON.stringify(floorPlanIndices));
                }

                // Use multipart/form-data for the PUT request
                response = await axios.put(`${base_url}/api/projects/${projectId}`, formDataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Make regular PUT request (JSON) if no files
                response = await axios.put(`${base_url}/api/projects/${projectId}`, formattedData);
            }

            toast.success('Project updated successfully');
            navigate('/projects');
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error(`Failed to update project: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate('/projects');
        }
    };

    if (fetchingProject) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Project not found</h2>
                <p className="mt-4 text-gray-500">The project you're looking for doesn't exist or you don't have permission to edit it.</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Edit Project: {projectData.name}</h1>
                <button
                    onClick={() => navigate(`/projects/${projectId}`)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    View Project
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <ProjectForm
                    projectData={projectData}
                    isEditing={true}
                    onSubmit={handleSubmit}
                    onReset={handleCancel}
                    onChange={handleFormChange}
                    onFileUpdates={handleFileUpdates}
                    loading={loading}
                    builders={builders}
                />
            </div>
        </div>
    );
};

export default EditProjectPage;

