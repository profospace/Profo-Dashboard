import React, { useState, useEffect } from 'react';

const GalleryUpload = ({ existingImages = [], onChange }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        // Initialize with existing images
        if (existingImages.length > 0) {
            setPreviewImages(existingImages.map(url => ({
                url,
                isExisting: true
            })));
        }
    }, [existingImages]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);

        // Create previews for new files
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            file,
            isExisting: false
        }));

        setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);

        // Call the onChange handler with the updated files
        onChange(files);
    };

    const removeImage = (index) => {
        const newPreviews = [...previewImages];
        const removedPreview = newPreviews[index];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);

        // If this was a new file (not an existing image), also remove from uploadedFiles
        if (!removedPreview.isExisting) {
            const newFiles = [...uploadedFiles];
            // Find the index of the file in uploadedFiles that matches the file in the preview
            const fileIndex = newFiles.findIndex(file => file === removedPreview.file);
            if (fileIndex !== -1) {
                newFiles.splice(fileIndex, 1);
                setUploadedFiles(newFiles);
                onChange(newFiles);
            }
        }

        // If removing an existing image, we'd need to handle that differently
        // (like marking it for deletion on the server)
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

        if (e.dataTransfer.files.length) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setUploadedFiles(prevFiles => [...prevFiles, ...droppedFiles]);

            // Create previews for new files
            const newPreviews = droppedFiles.map(file => ({
                url: URL.createObjectURL(file),
                file,
                isExisting: false
            }));

            setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);

            // Call the onChange handler with the updated files
            onChange(droppedFiles);
        }
    };

    return (
        <div className="space-y-4">
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-2">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="text-sm text-gray-600">
                        <label htmlFor="file-upload" className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload images</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange}
                            />
                        </label>
                        <p className="mt-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                    </p>
                </div>
            </div>

            {previewImages.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Gallery Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                    <img
                                        src={preview.url}
                                        alt={`Gallery image ${index + 1}`}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                                {preview.isExisting && (
                                    <span className="inline-flex items-center mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                        Existing
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryUpload;