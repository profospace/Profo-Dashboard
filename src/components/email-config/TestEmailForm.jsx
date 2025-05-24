import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const TestEmailForm = ({ testConfiguration }) => {
    const [testEmail, setTestEmail] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsTesting(true);

        try {
            await testConfiguration(testEmail);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Test Configuration</h3>
            <form onSubmit={handleSubmit} className="flex items-end space-x-4">
                <div className="flex-1">
                    <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Send Test Email To
                    </label>
                    <input
                        type="email"
                        id="testEmail"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="test@example.com"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isTesting}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center"
                >
                    {isTesting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        <>
                            <FiSend className="mr-2" />
                            Send Test
                        </>
                    )}
                </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
                Sends a test email to verify your configuration is working correctly.
            </p>
        </div>
    );
};

export default TestEmailForm;