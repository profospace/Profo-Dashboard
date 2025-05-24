import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiAlertTriangle, FiEye } from 'react-icons/fi';
import { base_url } from '../../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PageHeader from '../../components/ui/PageHeader';
import TemplateList from '../../components/email-templates/TemplateList';
import TemplateForm from '../../components/email-templates/TemplateForm';
import TemplatePreview from '../../components/email-templates/TemplatePreview';
import DefaultTemplates from '../../components/email-templates/DefaultTemplates';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [defaultTemplates, setDefaultTemplates] = useState([]);
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showTemplateForm, setShowTemplateForm] = useState(false);
    const [isNewTemplate, setIsNewTemplate] = useState(true);
    const [error, setError] = useState(null);
    const [templateForm, setTemplateForm] = useState({
        name: '',
        subject: 'Your Property Recommendations',
        description: '',
        htmlContent: ''
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get all templates
            const response = await axios.get(`${base_url}/email-templates/`);
            setTemplates(response.data.data || []);

            // Get active template
            const activeResponse = await axios.get(`${base_url}/email-templates/active`);
            setActiveTemplate(activeResponse.data.data);

            if (activeResponse.data.data) {
                setSelectedTemplate(activeResponse.data.data);
            }

            // Get default templates
            const defaultsResponse = await axios.get(`${base_url}/email-templates/defaults`);
            setDefaultTemplates(defaultsResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setError(error.response?.data?.error || 'Failed to fetch templates');
            toast.error('Failed to fetch email templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTemplateFormChange = (e) => {
        const { name, value } = e.target;
        setTemplateForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveTemplate = async (e) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);

            let response;
            if (isNewTemplate) {
                // Create new template
                response = await axios.post(`${base_url}/email-templates`, templateForm);
                toast.success('Template created successfully');
            } else {
                // Update existing template
                response = await axios.put(`${base_url}/email-templates/${templateForm._id}`, templateForm);
                toast.success('Template updated successfully');
            }

            // Close form and refresh templates
            setShowTemplateForm(false);
            fetchTemplates();

            // Select the updated/created template
            if (response?.data?.data) {
                setSelectedTemplate(response.data.data);
            }
        } catch (error) {
            console.error('Error saving template:', error);
            setError(error.response?.data?.error || 'Failed to save template');
            toast.error('Failed to save template');
        } finally {
            setIsSaving(false);
        }
    };

    const previewTemplate = (template) => {
        setSelectedTemplate(template);
    };

    const editTemplate = (template) => {
        setTemplateForm({
            _id: template._id,
            name: template.name,
            subject: template.subject,
            description: template.description || '',
            htmlContent: template.htmlContent
        });
        setIsNewTemplate(false);
        setShowTemplateForm(true);
    };

    const createNewTemplate = () => {
        setTemplateForm({
            name: '',
            subject: 'Your Property Recommendations',
            description: '',
            htmlContent: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1>Property Recommendations</h1>\n  <p>Hello {{userName}},</p>\n  <p>Here are some properties you might be interested in:</p>\n  {{#each recommendations}}\n  <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">\n    <h3>{{title}}</h3>\n    <p>Price: {{price}}</p>\n    <p>Location: {{location}}</p>\n    <p>{{bedrooms}} Bedrooms | {{bathrooms}} Bathrooms | {{area}} sq.ft.</p>\n    <a href="{{detailsUrl}}">View Property</a>\n  </div>\n  {{/each}}\n  <p>Thank you for using our service!</p>\n</div>'
        });
        setIsNewTemplate(true);
        setShowTemplateForm(true);
    };

    const activateTemplate = async (templateId) => {
        try {
            await axios.put(`${base_url}/email-templates/${templateId}/activate`);
            toast.success('Template activated');
            fetchTemplates();
        } catch (error) {
            console.error('Error activating template:', error);
            toast.error('Failed to activate template');
        }
    };

    const deleteTemplate = async (templateId) => {
        if (!window.confirm('Are you sure you want to delete this template?')) {
            return;
        }

        try {
            await axios.delete(`${base_url}/email-templates/${templateId}`);
            toast.success('Template deleted');

            // Refresh templates
            fetchTemplates();

            // Clear selection if the deleted template was selected
            if (selectedTemplate && selectedTemplate._id === templateId) {
                setSelectedTemplate(null);
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            toast.error(error.response?.data?.error || 'Failed to delete template');
        }
    };

    const createFromDefault = async (defaultTemplate) => {
        try {
            setIsSaving(true);

            const response = await axios.post(`${base_url}/email-templates`, {
                name: defaultTemplate.name,
                subject: defaultTemplate.subject,
                description: defaultTemplate.description,
                htmlContent: defaultTemplate.htmlContent
            });

            toast.success('Template created from default');

            if (response?.data?.data) {
                setSelectedTemplate(response.data.data);
            }

            // Refresh templates
            fetchTemplates();
        } catch (error) {
            console.error('Error creating template:', error);
            toast.error('Failed to create template');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Email Templates"
                description="Create and manage email templates for property recommendations"
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

            <div className="flex flex-col lg:flex-row lg:space-x-6">
                <div className="lg:w-1/4">
                    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Your Templates</h2>
                            <button
                                onClick={createNewTemplate}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition duration-150 ease-in-out flex items-center"
                            >
                                <FiPlus className="mr-1" size={16} />
                                New
                            </button>
                        </div>

                        <TemplateList
                            templates={templates}
                            activeTemplate={activeTemplate}
                            selectedTemplate={selectedTemplate}
                            onPreview={previewTemplate}
                            onEdit={editTemplate}
                            onDelete={deleteTemplate}
                            onActivate={activateTemplate}
                        />
                    </div>

                    <DefaultTemplates
                        defaultTemplates={defaultTemplates}
                        onCreate={createFromDefault}
                        isSaving={isSaving}
                    />
                </div>

                <div className="lg:w-3/4">
                    {showTemplateForm ? (
                        <TemplateForm
                            templateForm={templateForm}
                            handleChange={handleTemplateFormChange}
                            saveTemplate={saveTemplate}
                            cancelEdit={() => setShowTemplateForm(false)}
                            isNewTemplate={isNewTemplate}
                            isSaving={isSaving}
                        />
                    ) : selectedTemplate ? (
                        <TemplatePreview
                            template={selectedTemplate}
                            onEdit={() => editTemplate(selectedTemplate)}
                            isActive={activeTemplate && activeTemplate._id === selectedTemplate._id}
                            onActivate={() => activateTemplate(selectedTemplate._id)}
                        />
                    ) : (
                        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                            <FiEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No Template Selected</h3>
                            <p className="text-gray-500 mb-4">Select a template to preview or create a new one.</p>
                            <button
                                onClick={createNewTemplate}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center mx-auto"
                            >
                                <FiPlus className="mr-2" />
                                Create New Template
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailTemplates;