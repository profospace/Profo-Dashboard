// import React, { useState, useEffect } from 'react';

// const GalleryUpload = ({ existingImages = [], onChange }) => {
//     const [previewImages, setPreviewImages] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);

//     useEffect(() => {
//         // Initialize with existing images
//         if (existingImages.length > 0) {
//             setPreviewImages(existingImages.map(url => ({
//                 url,
//                 isExisting: true
//             })));
//         }
//     }, [existingImages]);

//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setUploadedFiles(prevFiles => [...prevFiles, ...files]);

//         // Create previews for new files
//         const newPreviews = files.map(file => ({
//             url: URL.createObjectURL(file),
//             file,
//             isExisting: false
//         }));

//         setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);

//         // Call the onChange handler with the updated files
//         onChange(files);
//     };

//     const removeImage = (index) => {
//         const newPreviews = [...previewImages];
//         const removedPreview = newPreviews[index];
//         newPreviews.splice(index, 1);
//         setPreviewImages(newPreviews);

//         // If this was a new file (not an existing image), also remove from uploadedFiles
//         if (!removedPreview.isExisting) {
//             const newFiles = [...uploadedFiles];
//             // Find the index of the file in uploadedFiles that matches the file in the preview
//             const fileIndex = newFiles.findIndex(file => file === removedPreview.file);
//             if (fileIndex !== -1) {
//                 newFiles.splice(fileIndex, 1);
//                 setUploadedFiles(newFiles);
//                 onChange(newFiles);
//             }
//         }

//         // If removing an existing image, we'd need to handle that differently
//         // (like marking it for deletion on the server)
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
//     };

//     const handleDragLeave = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

//         if (e.dataTransfer.files.length) {
//             const droppedFiles = Array.from(e.dataTransfer.files);
//             setUploadedFiles(prevFiles => [...prevFiles, ...droppedFiles]);

//             // Create previews for new files
//             const newPreviews = droppedFiles.map(file => ({
//                 url: URL.createObjectURL(file),
//                 file,
//                 isExisting: false
//             }));

//             setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);

//             // Call the onChange handler with the updated files
//             onChange(droppedFiles);
//         }
//     };

//     return (
//         <div className="space-y-4">
//             <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-200"
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//             >
//                 <div className="space-y-2">
//                     <svg
//                         className="mx-auto h-12 w-12 text-gray-400"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                     >
//                         <path
//                             d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                         />
//                     </svg>
//                     <div className="text-sm text-gray-600">
//                         <label htmlFor="file-upload" className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
//                             <span>Upload images</span>
//                             <input
//                                 id="file-upload"
//                                 name="file-upload"
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="sr-only"
//                                 onChange={handleFileChange}
//                             />
//                         </label>
//                         <p className="mt-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                         PNG, JPG, GIF up to 10MB
//                     </p>
//                 </div>
//             </div>

//             {previewImages.length > 0 && (
//                 <div className="mt-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">Gallery Images</h4>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                         {previewImages.map((preview, index) => (
//                             <div key={index} className="relative group">
//                                 <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
//                                     <img
//                                         src={preview.url}
//                                         alt={`Gallery image ${index + 1}`}
//                                         className="h-full w-full object-cover object-center"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => removeImage(index)}
//                                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                                     >
//                                         <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                         </svg>
//                                     </button>
//                                 </div>
//                                 {preview.isExisting && (
//                                     <span className="inline-flex items-center mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
//                                         Existing
//                                     </span>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GalleryUpload;


// import React, { useState, useEffect } from 'react';

// const GalleryUpload = ({ existingImages = [], onChange }) => {
//     const [existingImagesList, setExistingImagesList] = useState([]);
//     const [newImages, setNewImages] = useState([]);
//     const [removedExistingImages, setRemovedExistingImages] = useState([]);

//     useEffect(() => {
//         // Initialize with existing images
//         if (existingImages.length > 0) {
//             const formattedExisting = existingImages.map((url, index) => ({
//                 id: `existing_${index}`,
//                 url,
//                 isExisting: true,
//                 isMarkedForRemoval: false
//             }));
//             setExistingImagesList(formattedExisting);
//         }
//     }, [existingImages]);

//     // Notify parent component of changes
//     useEffect(() => {
//         const retainedImages = existingImagesList
//             .filter(img => !img.isMarkedForRemoval)
//             .map(img => img.url);

//         const removedImages = existingImagesList
//             .filter(img => img.isMarkedForRemoval)
//             .map(img => img.url);

//         const newImageFiles = newImages.map(img => img.file);

//         onChange({
//             newImages: newImageFiles,
//             retainedImages,
//             removedImages
//         });
//     }, [existingImagesList, newImages, onChange]);

//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         addNewImages(files);
//     };

//     const addNewImages = (files) => {
//         const newImageObjects = files.map((file, index) => ({
//             id: `new_${Date.now()}_${index}`,
//             url: URL.createObjectURL(file),
//             file,
//             isExisting: false
//         }));

//         setNewImages(prevImages => [...prevImages, ...newImageObjects]);
//     };

//     const removeExistingImage = (imageId) => {
//         setExistingImagesList(prevImages =>
//             prevImages.map(img =>
//                 img.id === imageId
//                     ? { ...img, isMarkedForRemoval: !img.isMarkedForRemoval }
//                     : img
//             )
//         );
//     };

//     const removeNewImage = (imageId) => {
//         setNewImages(prevImages => {
//             const imageToRemove = prevImages.find(img => img.id === imageId);
//             if (imageToRemove) {
//                 // Revoke the object URL to prevent memory leaks
//                 URL.revokeObjectURL(imageToRemove.url);
//             }
//             return prevImages.filter(img => img.id !== imageId);
//         });
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
//     };

//     const handleDragLeave = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

//         if (e.dataTransfer.files.length) {
//             const droppedFiles = Array.from(e.dataTransfer.files);
//             addNewImages(droppedFiles);
//         }
//     };

//     const allImages = [...existingImagesList, ...newImages];
//     const retainedCount = existingImagesList.filter(img => !img.isMarkedForRemoval).length;
//     const totalCount = retainedCount + newImages.length;

//     return (
//         <div className="space-y-4">
//             {/* Upload Area */}
//             <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-200"
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//             >
//                 <div className="space-y-2">
//                     <svg
//                         className="mx-auto h-12 w-12 text-gray-400"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                     >
//                         <path
//                             d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                         />
//                     </svg>
//                     <div className="text-sm text-gray-600">
//                         <label htmlFor="file-upload" className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
//                             <span>Upload new images</span>
//                             <input
//                                 id="file-upload"
//                                 name="file-upload"
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="sr-only"
//                                 onChange={handleFileChange}
//                             />
//                         </label>
//                         <p className="mt-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                         PNG, JPG, GIF up to 10MB
//                     </p>
//                 </div>
//             </div>

//             {/* Image Summary */}
//             {allImages.length > 0 && (
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="flex justify-between items-center text-sm">
//                         <span className="text-gray-600">
//                             Total Images: <span className="font-medium text-gray-900">{totalCount}</span>
//                         </span>
//                         <div className="flex gap-4">
//                             <span className="text-green-600">
//                                 Existing: <span className="font-medium">{retainedCount}</span>
//                             </span>
//                             <span className="text-blue-600">
//                                 New: <span className="font-medium">{newImages.length}</span>
//                             </span>
//                             {removedExistingImages.length > 0 && (
//                                 <span className="text-red-600">
//                                     Removed: <span className="font-medium">{removedExistingImages.length}</span>
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Images Grid */}
//             {allImages.length > 0 && (
//                 <div className="mt-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-3">Gallery Images</h4>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                         {allImages.map((image) => (
//                             <div key={image.id} className="relative group">
//                                 <div className={`aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 ${image.isMarkedForRemoval ? 'opacity-50' : ''
//                                     }`}>
//                                     <img
//                                         src={image.url}
//                                         alt={`Gallery image`}
//                                         className="h-24 w-full object-cover object-center"
//                                     />

//                                     {/* Overlay for marked for removal */}
//                                     {image.isMarkedForRemoval && (
//                                         <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
//                                             <span className="text-white text-xs font-medium">
//                                                 Will be removed
//                                             </span>
//                                         </div>
//                                     )}

//                                     {/* Action button */}
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             if (image.isExisting) {
//                                                 removeExistingImage(image.id);
//                                             } else {
//                                                 removeNewImage(image.id);
//                                             }
//                                         }}
//                                         className={`absolute top-1 right-1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${image.isExisting
//                                                 ? (image.isMarkedForRemoval
//                                                     ? 'bg-green-500 text-white'
//                                                     : 'bg-yellow-500 text-white')
//                                                 : 'bg-red-500 text-white'
//                                             }`}
//                                         title={
//                                             image.isExisting
//                                                 ? (image.isMarkedForRemoval ? 'Keep this image' : 'Mark for removal')
//                                                 : 'Remove new image'
//                                         }
//                                     >
//                                         {image.isExisting ? (
//                                             image.isMarkedForRemoval ? (
//                                                 // Undo icon
//                                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
//                                                 </svg>
//                                             ) : (
//                                                 // Remove icon
//                                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                                 </svg>
//                                             )
//                                         ) : (
//                                             // Delete icon for new images
//                                             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>

//                                 {/* Image status badge */}
//                                 <div className="mt-1">
//                                     {image.isExisting ? (
//                                         <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${image.isMarkedForRemoval
//                                                 ? 'bg-red-100 text-red-800'
//                                                 : 'bg-green-100 text-green-800'
//                                             }`}>
//                                             {image.isMarkedForRemoval ? 'To Remove' : 'Existing'}
//                                         </span>
//                                     ) : (
//                                         <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
//                                             New
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Help text */}
//             {existingImages.length > 0 && (
//                 <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-4">
//                     <div className="flex">
//                         <div className="flex-shrink-0">
//                             <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                         <div className="ml-3">
//                             <p className="text-sm text-blue-700">
//                                 <strong>Image Management:</strong> Click the trash icon on existing images to mark them for removal (they won't be deleted immediately).
//                                 Click the undo icon to keep them. New images can be removed completely before saving.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GalleryUpload;



import React, { useState, useEffect } from 'react';

const GalleryUpload = ({ existingImages = [], onChange }) => {
    const [existingImagesList, setExistingImagesList] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [removedExistingImages, setRemovedExistingImages] = useState([]);

    useEffect(() => {
        // Initialize with existing images
        if (existingImages.length > 0) {
            const formattedExisting = existingImages.map((url, index) => ({
                id: `existing_${index}`,
                url,
                isExisting: true,
                isMarkedForRemoval: false
            }));
            setExistingImagesList(formattedExisting);
        }
    }, [existingImages]);

    // Notify parent component of changes
    useEffect(() => {
        const retainedImages = existingImagesList
            .filter(img => !img.isMarkedForRemoval)
            .map(img => img.url);

        const removedImages = existingImagesList
            .filter(img => img.isMarkedForRemoval)
            .map(img => img.url);

        const newImageFiles = newImages.map(img => img.file);

        onChange({
            newImages: newImageFiles,
            retainedImages,
            removedImages
        });
    }, [existingImagesList, newImages, onChange]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        addNewImages(files);
    };

    const addNewImages = (files) => {
        const newImageObjects = files.map((file, index) => ({
            id: `new_${Date.now()}_${index}`,
            url: URL.createObjectURL(file),
            file,
            isExisting: false
        }));

        setNewImages(prevImages => [...prevImages, ...newImageObjects]);
    };

    const removeExistingImage = (imageId) => {
        setExistingImagesList(prevImages =>
            prevImages.map(img =>
                img.id === imageId
                    ? { ...img, isMarkedForRemoval: !img.isMarkedForRemoval }
                    : img
            )
        );
    };

    const removeNewImage = (imageId) => {
        setNewImages(prevImages => {
            const imageToRemove = prevImages.find(img => img.id === imageId);
            if (imageToRemove) {
                // Revoke the object URL to prevent memory leaks
                URL.revokeObjectURL(imageToRemove.url);
            }
            return prevImages.filter(img => img.id !== imageId);
        });
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
            addNewImages(droppedFiles);
        }
    };

    const allImages = [...existingImagesList, ...newImages];
    const retainedCount = existingImagesList.filter(img => !img.isMarkedForRemoval).length;
    const totalCount = retainedCount + newImages.length;

    return (
        <div className="space-y-4">
            {/* Upload Area */}
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
                            <span>Upload new images</span>
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

            {/* Image Summary */}
            {allImages.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                            Total Images: <span className="font-medium text-gray-900">{totalCount}</span>
                        </span>
                        <div className="flex gap-4">
                            <span className="text-green-600">
                                Existing: <span className="font-medium">{retainedCount}</span>
                            </span>
                            <span className="text-blue-600">
                                New: <span className="font-medium">{newImages.length}</span>
                            </span>
                            {removedExistingImages.length > 0 && (
                                <span className="text-red-600">
                                    Removed: <span className="font-medium">{removedExistingImages.length}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Images Grid */}
            {allImages.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Gallery Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {allImages.map((image) => (
                            <div key={image.id} className="relative group">
                                <div className={`aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 ${image.isMarkedForRemoval ? 'opacity-50' : ''
                                    }`}>
                                    <img
                                        src={image.url}
                                        alt={`Gallery image`}
                                        className="h-24 w-full object-cover object-center"
                                    />

                                    {/* Overlay for marked for removal */}
                                    {image.isMarkedForRemoval && (
                                        <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                                Will be removed
                                            </span>
                                        </div>
                                    )}

                                    {/* Action button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (image.isExisting) {
                                                removeExistingImage(image.id);
                                            } else {
                                                removeNewImage(image.id);
                                            }
                                        }}
                                        className={`absolute top-1 right-1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${image.isExisting
                                                ? (image.isMarkedForRemoval
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-yellow-500 text-white')
                                                : 'bg-red-500 text-white'
                                            }`}
                                        title={
                                            image.isExisting
                                                ? (image.isMarkedForRemoval ? 'Keep this image' : 'Mark for removal')
                                                : 'Remove new image'
                                        }
                                    >
                                        {image.isExisting ? (
                                            image.isMarkedForRemoval ? (
                                                // Undo icon
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                </svg>
                                            ) : (
                                                // Remove icon
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )
                                        ) : (
                                            // Delete icon for new images
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Image status badge */}
                                <div className="mt-1">
                                    {image.isExisting ? (
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${image.isMarkedForRemoval
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {image.isMarkedForRemoval ? 'To Remove' : 'Existing'}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Help text */}
            {existingImages.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Image Management:</strong> Click the trash icon on existing images to mark them for removal (they won't be deleted immediately).
                                Click the undo icon to keep them. New images can be removed completely before saving.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryUpload;
