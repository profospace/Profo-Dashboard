import React from 'react';

const CopyButton = ({ text }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Text copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded"
        >
            Copy Text
        </button>
    );
};

export default CopyButton;
