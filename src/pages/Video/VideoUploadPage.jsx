// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useDropzone } from 'react-dropzone';
// import { Upload, X, Check, AlertCircle } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

// const VideoUploadPage = () => {
//     const navigate = useNavigate();

//     // Form states
//     const [title, setTitle] = useState('Dummy title');
//     const [description, setDescription] = useState('Dummy Desp');
//     const [entityType, setEntityType] = useState('Project');
//     const [entityId, setEntityId] = useState('');
//     const [videoFile, setVideoFile] = useState(null);
//     const [thumbnailFile, setThumbnailFile] = useState(null);
//     const [thumbnailPreview, setThumbnailPreview] = useState('');

//     // Loading and error states
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [uploadProgress, setUploadProgress] = useState(0);

//     // Entity options for selection
//     const [entityOptions, setEntityOptions] = useState([]);

//     // Get entity options based on selected type
//     useEffect(() => {
//         const fetchEntityOptions = async () => {
//             try {
//                 let endpoint = '';

//                 switch (entityType) {
//                     case 'Property':
//                         endpoint = `${base_url}/api/properties/all`;
//                         break;
//                     case 'Project':
//                         endpoint = `${base_url}/api/projects`;
//                         break;
//                     case 'Building':
//                         endpoint = `${base_url}/api/buildings`;
//                         break;
//                     default:
//                         return;
//                 }

//                 const response = await axios.get(endpoint);

//                 let options = [];
//                 if (entityType === 'Property') {
//                     options = response.data.map(item => ({
//                         id: item._id,
//                         name: item.post_title || `Property ${item.post_id}`
//                     }));
//                 } else if (entityType === 'Project') {
//                     options = response.data.map(item => ({
//                         id: item._id,
//                         name: item.name
//                     }));
//                 } else if (entityType === 'Building') {
//                     options = response.data.buildings.map(item => ({
//                         id: item._id,
//                         name: item.name
//                     }));
//                 }

//                 setEntityOptions(options);

//                 // Reset entity ID when type changes
//                 setEntityId('');
//             } catch (err) {
//                 console.error('Error fetching entity options:', err);
//                 setError('Failed to load entity options');
//             }
//         };

//         fetchEntityOptions();
//     }, [entityType]);

//     // Video dropzone setup
//     const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
//         accept: {
//             'video/*': []
//         },
//         maxFiles: 1,
//         onDrop: acceptedFiles => {
//             if (acceptedFiles.length > 0) {
//                 setVideoFile(acceptedFiles[0]);
//             }
//         }
//     });

//     // Thumbnail dropzone setup
//     const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
//         accept: {
//             'image/*': []
//         },
//         maxFiles: 1,
//         onDrop: acceptedFiles => {
//             if (acceptedFiles.length > 0) {
//                 setThumbnailFile(acceptedFiles[0]);
//                 setThumbnailPreview(URL.createObjectURL(acceptedFiles[0]));
//             }
//         }
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validate form
//         // if (!title || !entityType || !entityId || !videoFile) {
//         //     setError('Please fill in all required fields and upload a video');
//         //     return;
//         // }

//         setLoading(true);
//         setError('');

//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         formData.append('entityType', entityType);
//         formData.append('entityId', entityId);
//         formData.append('video', videoFile);

//         if (thumbnailFile) {
//             formData.append('thumbnail', thumbnailFile);
//         }

//         try {
//             await axios.post(`${base_url}/api/videos/`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//                 onUploadProgress: (progressEvent) => {
//                     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     setUploadProgress(percentCompleted);
//                 }
//             });

//             navigate('/videos');
//         } catch (err) {
//             console.error('Error uploading video:', err);
//             setError(err.response?.data?.message || 'Failed to upload video');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="max-w-2xl mx-auto">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Video</h1>

//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//                         <div className="flex items-center">
//                             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//                             <p className="text-red-700">{error}</p>
//                         </div>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Video Upload */}
//                     <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                             Video File <span className="text-red-500">*</span>
//                         </label>
//                         <div {...getVideoRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition duration-150">
//                             <input {...getVideoInputProps()} />
//                             <div className="text-center">
//                                 <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                 {videoFile ? (
//                                     <div className="mt-2">
//                                         <p className="text-sm font-medium text-gray-900">{videoFile.name}</p>
//                                         <p className="text-xs text-gray-500">
//                                             {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="mt-2">
//                                         <p className="text-sm text-gray-500">
//                                             Drag and drop your video here, or click to select
//                                         </p>
//                                         <p className="text-xs text-gray-400 mt-1">
//                                             MP4, WebM, or MOV up to 500MB
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Thumbnail Upload */}
//                     <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                             Thumbnail Image (Optional)
//                         </label>
//                         <div {...getThumbnailRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition duration-150">
//                             <input {...getThumbnailInputProps()} />
//                             {thumbnailPreview ? (
//                                 <div className="relative">
//                                     <img
//                                         src={thumbnailPreview}
//                                         alt="Thumbnail preview"
//                                         className="mx-auto h-40 object-cover rounded"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             setThumbnailFile(null);
//                                             setThumbnailPreview('');
//                                         }}
//                                         className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//                                     >
//                                         <X className="h-4 w-4 text-gray-600" />
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="text-center">
//                                     <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                     <p className="mt-2 text-sm text-gray-500">
//                                         Add a custom thumbnail, or one will be generated
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Title */}
//                     <div>
//                         <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                             Title <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             id="title"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                             placeholder="Enter video title"
//                             required
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                             Description
//                         </label>
//                         <textarea
//                             id="description"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             rows={3}
//                             className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                             placeholder="Enter video description"
//                         />
//                     </div>

//                     {/* Entity Type */}
//                     <div>
//                         <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
//                             Entity Type <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             id="entityType"
//                             value={entityType}
//                             onChange={(e) => setEntityType(e.target.value)}
//                             className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                             required
//                         >
//                             <option value="Property">Property</option>
//                             <option value="Project">Project</option>
//                             <option value="Building">Building</option>
//                             <option value="Other">Other</option>
//                         </select>
//                     </div>

//                     {/* Entity ID */}
//                     {entityType !== 'Other' && (
//                         <div>
//                             <label htmlFor="entityId" className="block text-sm font-medium text-gray-700">
//                                 Select {entityType} <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 id="entityId"
//                                 value={entityId}
//                                 onChange={(e) => setEntityId(e.target.value)}
//                                 className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                                 required
//                             >
//                                 <option value="">Select {entityType}</option>
//                                 {entityOptions.map(option => (
//                                     <option key={option.id} value={option.id}>
//                                         {option.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}

//                     {/* Submit Button */}
//                     <div className="pt-4">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
//                         >
//                             {loading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Uploading... {uploadProgress}%
//                                 </>
//                             ) : (
//                                 'Upload Video'
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default VideoUploadPage;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const VideoUploadPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    console.log("State Data" , state)

    // Form states
    const [title, setTitle] = useState('Dummy title');
    const [description, setDescription] = useState('Dummy Desp');
    const [entityType, setEntityType] = useState(state?.entityType || 'Project');
    const [entityId, setEntityId] = useState(state?.entityId || '');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    // Entity options for selection
    const [entityOptions, setEntityOptions] = useState([]);

    // Get entity options based on selected type
    useEffect(() => {
        const fetchEntityOptions = async () => {
            try {
                let endpoint = '';

                switch (entityType) {
                    case 'Property':
                        endpoint = `${base_url}/api/properties/all`;
                        break;
                    case 'Project':
                        endpoint = `${base_url}/api/projects`;
                        break;
                    case 'Building':
                        endpoint = `${base_url}/api/buildings`;
                        break;
                    default:
                        return;
                }

                const response = await axios.get(endpoint);

                let options = [];
                if (entityType === 'Property') {
                    options = response.data.map(item => ({
                        id: item._id,
                        name: item.post_title || `Property ${item.post_id}`
                    }));
                } else if (entityType === 'Project') {
                    options = response.data.map(item => ({
                        id: item._id,
                        name: item.name
                    }));
                } else if (entityType === 'Building') {
                    options = response.data.buildings.map(item => ({
                        id: item._id,
                        name: item.name
                    }));
                }

                setEntityOptions(options);

                // Reset entity ID when type changes
                setEntityId('');
            } catch (err) {
                console.error('Error fetching entity options:', err);
                setError('Failed to load entity options');
            }
        };

        fetchEntityOptions();
    }, [entityType]);

    // Video dropzone setup
    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        accept: {
            'video/*': []
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setVideoFile(acceptedFiles[0]);
            }
        }
    });

    // Thumbnail dropzone setup
    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setThumbnailFile(acceptedFiles[0]);
                setThumbnailPreview(URL.createObjectURL(acceptedFiles[0]));
            }
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        // if (!title || !entityType || !entityId || !videoFile) {
        //     setError('Please fill in all required fields and upload a video');
        //     return;
        // }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('entityType', state?.entityType || entityType);
        formData.append('entityId', state?.entityId || entityId);
        formData.append('video', videoFile);

        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile);
        }

        try {
            await axios.post(`${base_url}/api/videos/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            navigate('/videos');
        } catch (err) {
            console.error('Error uploading video:', err);
            setError(err.response?.data?.message || 'Failed to upload video');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Video</h1>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Video Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Video File <span className="text-red-500">*</span>
                        </label>
                        <div {...getVideoRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition duration-150">
                            <input {...getVideoInputProps()} />
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                {videoFile ? (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-900">{videoFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Drag and drop your video here, or click to select
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            MP4, WebM, or MOV up to 500MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Thumbnail Image (Optional)
                        </label>
                        <div {...getThumbnailRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition duration-150">
                            <input {...getThumbnailInputProps()} />
                            {thumbnailPreview ? (
                                <div className="relative">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="mx-auto h-40 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setThumbnailFile(null);
                                            setThumbnailPreview('');
                                        }}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                    >
                                        <X className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Add a custom thumbnail, or one will be generated
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="Enter video title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="Enter video description"
                        />
                    </div>

                    {/* Entity Type */}
                    <div>
                        <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
                            Entity Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="entityType"
                            value={entityType}
                            onChange={(e) => setEntityType(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            required
                        >
                            <option value="Property">Property</option>
                            <option value="Project">Project</option>
                            <option value="Building">Building</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Entity ID */}
                    {entityType !== 'Other' && (
                        <div>
                            <label htmlFor="entityId" className="block text-sm font-medium text-gray-700">
                                Select {entityType} <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="entityId"
                                value={state?.entityId || entityId}
                                onChange={(e) => setEntityId(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                required
                            >
                                <option value="">Select {entityType}</option>
                                {entityOptions.map(option => (
                                    <option key={option.id} value={state?.entityId || option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading... {uploadProgress}%
                                </>
                            ) : (
                                'Upload Video'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VideoUploadPage;