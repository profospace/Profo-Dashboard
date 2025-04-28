import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WatermarkList from '../../components/Watermark/WatermarkList';
import WatermarkUploader from '../../components/Watermark/WatermarkUploader';
import { base_url } from '../../../utils/base_url';

const WatermarkManager = () => {
    const [watermarks, setWatermarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWatermarks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/api/watermarks`);
            setWatermarks(response.data.response_data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch watermarks. Please try again.');
            console.error('Error fetching watermarks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatermarks();
    }, []);

    const handleUploadSuccess = () => {
        fetchWatermarks();
    };

    const handleSetActive = async (id) => {
        try {
            await axios.put(`${base_url}/api/watermarks/set-active/${id}`);
            fetchWatermarks();
        } catch (err) {
            setError('Failed to set watermark as active. Please try again.');
            console.error('Error setting watermark as active:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${base_url}/api/watermarks/${id}`);
            fetchWatermarks();
        } catch (err) {
            setError('Failed to delete watermark. Please try again.');
            console.error('Error deleting watermark:', err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Watermark Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <WatermarkUploader onUploadSuccess={handleUploadSuccess} />
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Watermark Library</h2>

                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : watermarks?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No watermarks uploaded yet.</p>
                        ) : (
                            <WatermarkList
                                watermarks={watermarks}
                                onSetActive={handleSetActive}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatermarkManager;