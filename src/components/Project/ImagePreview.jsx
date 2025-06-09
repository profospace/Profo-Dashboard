import React from 'react';
import { X, Plus } from 'lucide-react';

const ImagePreview = ({
    images = [],
    onRemove,
    onAdd,
    title,
    maxImages = 20,
    acceptedFormats = "image/*"
}) => {
    const handleFileAdd = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }
        if (onAdd) {
            onAdd(files);
        }
    };

    return (
        <div className="space-y-3">
            {title && (
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">{title}</h4>
                    <span className="text-sm text-gray-500">
                        {images.length}/{maxImages} images
                    </span>
                </div>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Existing Images */}
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                            <img
                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {onRemove && (
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ))}

                {/* Add New Image Button */}
                {images.length < maxImages && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                        <div className="text-center">
                            <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Add Image</span>
                        </div>
                        <input
                            type="file"
                            multiple
                            accept={acceptedFormats}
                            onChange={handleFileAdd}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-500">
                Click on images to remove them. Click the + button to add more images.
                Supported formats: JPG, PNG, WEBP. Max file size: 5MB each.
            </p>
        </div>
    );
};

export default ImagePreview;