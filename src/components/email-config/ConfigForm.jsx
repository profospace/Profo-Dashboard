import React from 'react';
import { FiSave } from 'react-icons/fi';

const ConfigForm = ({ formConfig, handleConfigChange, saveConfig, isSaving }) => {
    return (
        <form onSubmit={saveConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Configuration Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formConfig.name}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Host
                    </label>
                    <input
                        type="text"
                        id="host"
                        name="host"
                        value={formConfig.host}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="smtp.example.com"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                    </label>
                    <input
                        type="number"
                        id="port"
                        name="port"
                        value={formConfig.port}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="auth.user" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        id="auth.user"
                        name="auth.user"
                        value={formConfig.auth?.user || ''}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="auth.pass" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="auth.pass"
                        name="auth.pass"
                        value={formConfig.auth?.pass || ''}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                        From Email
                    </label>
                    <input
                        type="email"
                        id="from"
                        name="from"
                        value={formConfig.from}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="notifications@yourdomain.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="replyTo" className="block text-sm font-medium text-gray-700 mb-1">
                        Reply To (Optional)
                    </label>
                    <input
                        type="email"
                        id="replyTo"
                        name="replyTo"
                        value={formConfig.replyTo || ''}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="support@yourdomain.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule (Cron Expression)
                    </label>
                    <input
                        type="text"
                        id="schedule"
                        name="schedule"
                        value={formConfig.schedule}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0 10 * * *"
                    />
                    <p className="mt-1 text-xs text-gray-500">Default: 10 AM daily (0 10 * * *)</p>
                </div>
                <div>
                    <label htmlFor="appBaseUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Application Base URL
                    </label>
                    <input
                        type="url"
                        id="appBaseUrl"
                        name="appBaseUrl"
                        value={formConfig.appBaseUrl}
                        onChange={handleConfigChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://yourdomain.com"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="secure"
                    name="secure"
                    checked={formConfig.secure || false}
                    onChange={handleConfigChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="secure" className="ml-2 block text-sm text-gray-700">
                    Use Secure Connection (SSL/TLS)
                </label>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formConfig.isActive || false}
                    onChange={handleConfigChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Set as Active Configuration
                </label>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FiSave className="mr-2" />
                            Save Configuration
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ConfigForm;