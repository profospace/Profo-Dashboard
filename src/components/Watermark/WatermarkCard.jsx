import React from 'react';

const WatermarkCard = ({ watermark, isActive, onDelete, onActivate }) => {
    return (
        <div className="border p-4 rounded-xl bg-white shadow-sm text-center">
            <div className="mb-2 h-32 flex items-center justify-center">
                {watermark.type === 'image' ? (
                    <img
                        src={watermark.url}
                        alt="watermark"
                        className="max-h-32 object-contain"
                    />
                ) : (
                    <span className="text-lg font-semibold text-gray-700">{watermark.text}</span>
                )}
            </div>

            <div className="mt-4 flex justify-between items-center gap-2">
                <button
                    onClick={onActivate}
                    className={`px-3 py-1 rounded ${isActive ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    {isActive ? 'Active' : 'Set Active'}
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default WatermarkCard;
