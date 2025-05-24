import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiSave, FiPlus, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiTrash2, FiEdit } from 'react-icons/fi';
import { base_url } from '../../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PageHeader from '../../components/ui/PageHeader';
import ConfigForm from '../../components/email-config/ConfigForm';
import ConfigList from '../../components/email-config/ConfigList';
import TestEmailForm from '../../components/email-config/TestEmailForm';

const EmailConfig = () => {
    const [configs, setConfigs] = useState([]);
    const [activeConfig, setActiveConfig] = useState(null);
    const [formConfig, setFormConfig] = useState({
        name: '',
        host: '',
        port: 587,
        secure: false,
        auth: { user: '', pass: '' },
        from: '',
        replyTo: '',
        schedule: '0 10 * * *',
        appBaseUrl: 'https://yourdomain.com',
        isActive: true
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${base_url}/email-config`);
            setConfigs(response.data.data);

            // Get active config
            const activeResponse = await axios.get(`${base_url}/email-config/active`);
            setActiveConfig(activeResponse.data.data);

            if (activeResponse.data.data) {
                setFormConfig(activeResponse.data.data);
                setIsCreatingNew(false);
            }

            setError(null);
        } catch (error) {
            console.error('Error fetching configurations:', error);
            setError(error.response?.data?.error || 'Failed to fetch configurations');
            toast.error('Failed to fetch email configurations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('auth.')) {
            const authField = name.split('.')[1];
            setFormConfig(prev => ({
                ...prev,
                auth: {
                    ...prev.auth,
                    [authField]: value
                }
            }));
        } else {
            setFormConfig(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const saveConfig = async (e) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);

            let response;
            if (formConfig._id && !isCreatingNew) {
                // Update existing config
                response = await axios.put(`${base_url}/email-config/${formConfig._id}`, formConfig);
                toast.success('Email configuration updated successfully');
            } else {
                // Create new config
                response = await axios.post(`${base_url}/email-config`, formConfig);
                toast.success('Email configuration created successfully');
            }

            setActiveConfig(response.data.data);
            setFormConfig(response.data.data);
            setIsCreatingNew(false);

            // Refresh configs list
            fetchConfigs();
        } catch (error) {
            console.error('Error saving configuration:', error);
            setError(error.response?.data?.error || 'Failed to save configuration');
            toast.error(error.response?.data?.error || 'Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    const createNewConfig = () => {
        setFormConfig({
            name: 'New Configuration',
            host: '',
            port: 587,
            secure: false,
            auth: { user: '', pass: '' },
            from: '',
            replyTo: '',
            schedule: '0 10 * * *',
            appBaseUrl: 'https://yourdomain.com',
            isActive: true
        });
        setIsCreatingNew(true);
    };

    const editConfig = (config) => {
        setFormConfig(config);
        setIsCreatingNew(false);
    };

    const activateConfig = async (configId) => {
        try {
            await axios.put(`${base_url}/email-config/${configId}/activate`);
            toast.success('Configuration activated');
            fetchConfigs();
        } catch (error) {
            console.error('Error activating configuration:', error);
            toast.error('Failed to activate configuration');
        }
    };

    const deleteConfig = async (configId) => {
        if (!window.confirm('Are you sure you want to delete this configuration?')) {
            return;
        }

        try {
            await axios.delete(`${base_url}/email-config/${configId}`);
            toast.success('Configuration deleted');

            // If we deleted the current form config, reset it
            if (formConfig._id === configId) {
                if (configs.length > 1) {
                    // Find another config to display
                    const nextConfig = configs.find(c => c._id !== configId);
                    if (nextConfig) {
                        setFormConfig(nextConfig);
                    }
                } else {
                    // No more configs, create a new one
                    createNewConfig();
                }
            }

            fetchConfigs();
        } catch (error) {
            console.error('Error deleting configuration:', error);
            toast.error(error.response?.data?.error || 'Failed to delete configuration');
        }
    };

    const testConfiguration = async (testEmail) => {
        if (!testEmail) {
            toast.warning('Please enter a test email address');
            return;
        }

        try {
            let response;
            if (formConfig._id && !isCreatingNew) {
                response = await axios.post(`${base_url}/email-config/${formConfig._id}/test`, { email: testEmail });
            } else {
                response = await axios.post(`${base_url}/email-config/test`, {
                    email: testEmail,
                    ...formConfig
                });
            }

            if (response.data.success) {
                toast.success('Test email sent successfully!');
            } else {
                toast.error(response.data.error || 'Failed to send test email');
            }
        } catch (error) {
            console.error('Error testing email config:', error);
            toast.error(error.response?.data?.error || 'Failed to send test email');
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Email Configuration"
                description="Manage your email server settings and schedules for recommendation emails"
            />

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiAlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="flex-1">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isCreatingNew ? 'Create New Configuration' : 'Edit Configuration'}
                            </h2>
                            <button
                                onClick={createNewConfig}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center"
                            >
                                <FiPlus className="mr-1" />
                                New Config
                            </button>
                        </div>

                        <ConfigForm
                            formConfig={formConfig}
                            handleConfigChange={handleConfigChange}
                            saveConfig={saveConfig}
                            isSaving={isSaving}
                        />

                        <div className="mt-8 border-t pt-6">
                            <TestEmailForm testConfiguration={testConfiguration} />
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/3 mt-6 lg:mt-0">
                    <ConfigList
                        configs={configs}
                        activeConfig={activeConfig}
                        editConfig={editConfig}
                        activateConfig={activateConfig}
                        deleteConfig={deleteConfig}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailConfig;