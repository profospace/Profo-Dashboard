import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const UploadForm = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [type, setType] = useState('image');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (type === 'image') {
            if (!file) return alert('Please choose an image file');
            formData.append('uploadedFile', file);
            formData.append('type', 'image');
        } else {
            if (!text.trim()) return alert('Text cannot be empty');
            formData.append('text', text);
            formData.append('type', 'text');
        }

        await axios.post(`${base_url}/api/watermarks`, formData);
        onUpload();
        setFile(null);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
            <div className="mb-4 flex gap-4">
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="image"
                        checked={type === 'image'}
                        onChange={() => setType('image')}
                    />
                    <span className="ml-1">Image</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="text"
                        checked={type === 'text'}
                        onChange={() => setType('text')}
                    />
                    <span className="ml-1">Text</span>
                </label>
            </div>

            {type === 'image' ? (
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                    className="block w-full mb-4"
                />
            ) : (
                <input
                    type="text"
                    placeholder="Enter watermark text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
            )}

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Upload Watermark
            </button>
        </form>
    );
};

export default UploadForm;
