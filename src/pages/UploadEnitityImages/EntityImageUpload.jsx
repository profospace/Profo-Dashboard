import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Image, Trash, AlertTriangle, RefreshCw } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const EntityImageUpload = () => {
    // State for entity selection
    const [entityType, setEntityType] = useState('');
    const [entityId, setEntityId] = useState('');
    const [uploadMode, setUploadMode] = useState('update'); // 'update', 'push', 'selective'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [entityData, setEntityData] = useState(null);

    // Map of entity types to their image field configurations
    const entityConfig = {
        'project': {
            idField: 'projectId',
            imageFields: [
                { id: 'galleryNow', label: 'Gallery Images', multiple: true },
                { id: 'masterPlan', label: 'Master Plan', multiple: false },
                { id: 'brochures', label: 'Brochures', multiple: true, nestedField: true, nested: { url: 'url', title: 'title', thumbnail: 'thumbnail' } }
            ]
        },
        'property': {
            idField: 'post_id',
            imageFields: [
                { id: 'post_images', label: 'Post Images', multiple: true, nestedField: true, nested: { url: 'url' } },
                { id: 'floor_plan_images', label: 'Floor Plan Images', multiple: true, nestedField: true, nested: { url: 'url' } },
                { id: 'galleryList', label: 'Gallery Images', multiple: true }
            ]
        },
        'building': {
            idField: 'buildingId',
            imageFields: [
                { id: 'galleryList', label: 'Gallery Images', multiple: true },
                { id: 'brochureLink', label: 'Brochure', multiple: false }
            ]
        }
    };

    // Reset state when entity type changes
    useEffect(() => {
        setEntityId('');
        setExistingImages([]);
        setSelectedImages([]);
        setImagesToDelete([]);
        setNewImages([]);
        setEntityData(null);
        setError(null);
        setSuccess(false);
    }, [entityType]);

    // Fetch entity data when ID is entered
    const fetchEntityData = async () => {
        if (!entityId || !entityType) return;

        setIsLoading(true);
        setError(null);

        try {
            // This would be replaced with your actual API call
            const response = await fetch(`${base_url}/api/${entityType.toLowerCase()}/${entityId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${entityType} with ID: ${entityId}`);
            }

            const data = await response.json();
            setEntityData(data);

            // Extract existing images based on entity type
            const images = {};
            if (entityConfig[entityType]) {
                entityConfig[entityType].imageFields.forEach(field => {
                    if (data[field.id]) {
                        if (field.nestedField) {
                            images[field.id] = data[field.id].map(item => ({
                                url: field.nested ? item[field.nested.url] : item,
                                title: field.nested && field.nested.title ? item[field.nested.title] : '',
                                thumbnail: field.nested && field.nested.thumbnail ? item[field.nested.thumbnail] : '',
                                fieldId: field.id
                            }));
                        } else if (Array.isArray(data[field.id])) {
                            images[field.id] = data[field.id].map(url => ({
                                url,
                                fieldId: field.id
                            }));
                        } else if (data[field.id]) {
                            images[field.id] = [{
                                url: data[field.id],
                                fieldId: field.id
                            }];
                        }
                    } else {
                        images[field.id] = [];
                    }
                });
            }

            setExistingImages(images);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle entity ID input changes
    const handleEntityIdChange = (e) => {
        setEntityId(e.target.value);
    };

    // Handle entity type selection
    const handleEntityTypeChange = (e) => {
        setEntityType(e.target.value);
    };

    // Handle upload mode selection
    const handleUploadModeChange = (e) => {
        setUploadMode(e.target.value);
    };

    // Handle image field selection for upload
    const handleImageFieldSelect = (fieldId) => {
        setSelectedImages(prev => {
            if (prev.includes(fieldId)) {
                return prev.filter(id => id !== fieldId);
            } else {
                return [...prev, fieldId];
            }
        });
    };

    // Toggle selecting an image for deletion in selective mode
    const toggleImageForDeletion = (image) => {
        if (uploadMode !== 'selective') return;

        setImagesToDelete(prev => {
            if (prev.some(img => img.url === image.url)) {
                return prev.filter(img => img.url !== image.url);
            } else {
                return [...prev, image];
            }
        });
    };

    // Handle new image upload
    const handleImageUpload = (e, fieldId) => {
        const files = Array.from(e.target.files);

        // Create preview URLs for the images
        const newImagePreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            fieldId
        }));

        setNewImages(prev => [...prev, ...newImagePreviews]);
    };

    // Remove a new image from the upload list
    const removeNewImage = (index) => {
        setNewImages(prev => {
            const updated = [...prev];
            // Revoke object URL to avoid memory leaks
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!entityType || !entityId || selectedImages.length === 0 || newImages.length === 0) {
            setError('Please select an entity type, ID, at least one image field, and upload at least one image.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append('entityType', entityType);
            formData.append('entityId', entityId);
            formData.append('uploadMode', uploadMode);

            // Add images to be deleted if in selective mode
            if (uploadMode === 'selective') {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            // Add new images grouped by field
            const imagesByField = {};
            newImages.forEach(image => {
                if (!imagesByField[image.fieldId]) {
                    imagesByField[image.fieldId] = [];
                }
                imagesByField[image.fieldId].push(image.file);
            });

            // Append images to formData
            Object.entries(imagesByField).forEach(([fieldId, files]) => {
                files.forEach((file, index) => {
                    formData.append(`${fieldId}[${index}]`, file);
                });
            });

            // Send the request to our new API endpoint
            const response = await fetch(`${base_url}/api/upload/entity-images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload images');
            }

            setSuccess(true);

            // Reset form after successful upload
            setTimeout(() => {
                setNewImages([]);
                setImagesToDelete([]);
                fetchEntityData(); // Refresh existing images
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Entity Image Upload</h1>

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                    <Check size={20} className="mr-2" />
                    <span>Images successfully uploaded!</span>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                    <AlertTriangle size={20} className="mr-2" />
                    <span>{error}</span>
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Entity Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                    <select
                        value={entityType}
                        onChange={handleEntityTypeChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Entity Type</option>
                        <option value="project">Project</option>
                        <option value="property">Property</option>
                        <option value="building">Building</option>
                    </select>
                </div>

                {/* Entity ID Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {entityType ? `${entityType} ID` : 'Entity ID'}
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            value={entityId}
                            onChange={handleEntityIdChange}
                            placeholder={entityType ? `Enter ${entityType} ID` : 'Enter ID'}
                            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={fetchEntityData}
                            disabled={!entityId || !entityType || isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Fetch'}
                        </button>
                    </div>
                </div>

                {/* Upload Mode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Mode</label>
                    <select
                        value={uploadMode}
                        onChange={handleUploadModeChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="update">Update (Replace All)</option>
                        <option value="push">Push (Add New)</option>
                        <option value="selective">Selective (Choose & Replace)</option>
                    </select>
                </div>
            </div>

            {/* Main content area - shown after entity selection */}
            {entityType && entityData && (
                <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Manage Images for {entityType}: {entityId}
                    </h2>

                    {/* Image Fields Selection */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Select Image Fields to Update:</h3>
                        <div className="flex flex-wrap gap-2">
                            {entityConfig[entityType].imageFields.map(field => (
                                <button
                                    key={field.id}
                                    onClick={() => handleImageFieldSelect(field.id)}
                                    className={`px-3 py-1 rounded-full text-sm ${selectedImages.includes(field.id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {field.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Existing Images Display - for each selected field */}
                    {selectedImages.length > 0 && uploadMode !== 'update' && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">
                                Existing Images {uploadMode === 'selective' ? '(Click to select for deletion)' : ''}:
                            </h3>

                            {selectedImages.map(fieldId => {
                                const config = entityConfig[entityType].imageFields.find(f => f.id === fieldId);
                                const images = existingImages[fieldId] || [];

                                return (
                                    <div key={fieldId} className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">{config.label}</h4>

                                        {images.length === 0 ? (
                                            <p className="text-gray-500 italic">No existing images</p>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {images.map((image, idx) => (
                                                    <div
                                                        key={`${image.url}-${idx}`}
                                                        onClick={() => toggleImageForDeletion(image)}
                                                        className={`relative group cursor-pointer rounded-md overflow-hidden border ${uploadMode === 'selective' && imagesToDelete.some(img => img.url === image.url)
                                                                ? 'border-red-500 opacity-50'
                                                                : 'border-gray-200 hover:border-blue-400'
                                                            }`}
                                                    >
                                                        <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={image.url}
                                                                alt={image.title || `Image ${idx}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                                                            />
                                                        </div>

                                                        {uploadMode === 'selective' && (
                                                            <div className={`absolute top-1 right-1 p-1 rounded-full ${imagesToDelete.some(img => img.url === image.url)
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-white text-gray-600 opacity-0 group-hover:opacity-80'
                                                                }`}>
                                                                <Trash size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* New Image Upload Area */}
                    <form onSubmit={handleSubmit}>
                        {selectedImages.map(fieldId => {
                            const config = entityConfig[entityType].imageFields.find(f => f.id === fieldId);

                            return (
                                <div key={fieldId} className="mb-6">
                                    <h3 className="text-md font-medium mb-2">
                                        Upload New {config.label}:
                                    </h3>

                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor={`file-upload-${fieldId}`}
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG or GIF {config.multiple ? '(multiple files allowed)' : '(single file only)'}
                                                </p>
                                            </div>
                                            <input
                                                id={`file-upload-${fieldId}`}
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, fieldId)}
                                                multiple={config.multiple}
                                                accept="image/*,.pdf" // Allow PDFs for brochures
                                            />
                                        </label>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Preview of new images */}
                        {newImages.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-md font-medium mb-2">New Images Preview:</h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {newImages.map((image, idx) => {
                                        const config = entityConfig[entityType].imageFields.find(f => f.id === image.fieldId);

                                        return (
                                            <div key={idx} className="relative group">
                                                <div className="aspect-square w-full bg-gray-100 rounded-md border border-gray-300 overflow-hidden">
                                                    <img
                                                        src={image.preview}
                                                        alt={`New upload ${idx}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <span className="absolute bottom-0 left-0 right-0 text-xs bg-black bg-opacity-70 text-white p-1 truncate">
                                                    {config.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading || newImages.length === 0 || selectedImages.length === 0}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin mr-2" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="mr-2" />
                                        <span>Upload Images</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EntityImageUpload;