import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const WatermarkUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setFile(null);
            setPreview(null);
            return;
        }

        // Check if file is an image
        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select an image file');
            setFile(null);
            setPreview(null);
            return;
        }

        setFile(selectedFile);
        setName(selectedFile.name);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);

        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('watermark', file);
            formData.append('name', name);

            await axios.post(`${base_url}/api/watermarks/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Reset form
            setFile(null);
            setName('');
            setPreview(null);
            setError(null);

            // Notify parent component
            onUploadSuccess();

        } catch (err) {
            setError('Failed to upload watermark. Please try again.');
            console.error('Error uploading watermark:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upload New Watermark</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Watermark Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Watermark Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="watermark-upload"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="watermark-upload" className="cursor-pointer">
                            {preview ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-40 mb-2 object-contain"
                                    />
                                    <span className="text-sm text-gray-500">Click to change</span>
                                </div>
                            ) : (
                                <div className="py-8">
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
                                    <p className="mt-1 text-sm text-gray-500">
                                        Click to upload a watermark image
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={uploading || !file}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium ${uploading || !file
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700'
                        }`}
                >
                    {uploading ? 'Uploading...' : 'Upload Watermark'}
                </button>
            </form>
        </div>
    );
};

export default WatermarkUploader;