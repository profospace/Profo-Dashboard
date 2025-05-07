// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash } from 'lucide-react';
// import Alert from '../../components/NotificationDashboard/Alert';
// import TemplateForm from '../../components/NotificationDashboard/TemplateForm';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';

// const TemplatesTab = () => {
//     const [templates, setTemplates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showAddTemplate, setShowAddTemplate] = useState(false);
//     const [selectedTemplate, setSelectedTemplate] = useState(null);

//     useEffect(() => {
//         fetchTemplates();
//     }, []);

//     const fetchTemplates = async () => {
//         try {
//             setLoading(true);
//             // This would be replaced with your actual API endpoint
//             const response = await fetch(`${base_url}/api/notifications/admin/templates` , getAuthConfig());
//             const data = await response.json();

//             if (data.success) {
//                 setTemplates(data.templates);
//             } else {
//                 setError(data.message || 'Failed to fetch templates');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to fetch templates:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditTemplate = (template) => {
//         setSelectedTemplate(template);
//         setShowAddTemplate(true);
//     };

//     const handleDeleteTemplate = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this template?')) {
//             return;
//         }

//         try {
//             // Mock API call
//             setTemplates(templates.filter(t => t._id !== id));
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to delete template:', err);
//         }
//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Notification Templates</h2>
//                 <button
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition duration-150 ease-in-out"
//                     onClick={() => {
//                         setSelectedTemplate(null);
//                         setShowAddTemplate(true);
//                     }}
//                 >
//                     <Plus size={16} className="mr-1" />
//                     Add Template
//                 </button>
//             </div>

//             {error && (
//                 <Alert
//                     title="Error"
//                     description={error}
//                     variant="error"
//                 />
//             )}

//             {loading ? (
//                 <div className="text-center py-8">
//                     <div className="animate-pulse">
//                         <div className="h-8 bg-gray-200 rounded mb-4 w-1/4 mx-auto"></div>
//                         <div className="h-24 bg-gray-200 rounded mb-4"></div>
//                         <div className="h-24 bg-gray-200 rounded"></div>
//                     </div>
//                 </div>
//             ) : (
//                 <>
//                     {templates.length === 0 ? (
//                         <div className="text-center py-8">
//                             <p className="text-gray-500">No templates found. Create your first template to get started.</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {templates.map(template => (
//                                 <div key={template._id} className="border rounded-lg overflow-hidden bg-white transform transition-all duration-200 hover:shadow-md">
//                                     <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//                                         <div>
//                                             <h3 className="font-medium">{template.name}</h3>
//                                             <span className={`text-xs px-2 py-1 rounded-full ${template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                                                 {template.active ? 'Active' : 'Inactive'}
//                                             </span>
//                                             <span className="text-xs ml-2 text-gray-500">{template.category}</span>
//                                         </div>
//                                         <div className="flex space-x-2">
//                                             <button
//                                                 className="p-1 text-gray-500 hover:text-blue-500 transition duration-150"
//                                                 onClick={() => handleEditTemplate(template)}
//                                             >
//                                                 <Edit size={16} />
//                                             </button>
//                                             <button
//                                                 className="p-1 text-gray-500 hover:text-red-500 transition duration-150"
//                                                 onClick={() => handleDeleteTemplate(template._id)}
//                                             >
//                                                 <Trash size={16} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div className="p-4">
//                                         <div className="mb-2">
//                                             <span className="font-medium text-sm text-gray-500">Title:</span>
//                                             <p>{template.title}</p>
//                                         </div>
//                                         <div className="mb-2">
//                                             <span className="font-medium text-sm text-gray-500">Body:</span>
//                                             <p>{template.body}</p>
//                                         </div>
//                                         {template.imageUrl && (
//                                             <div className="mb-2">
//                                                 <span className="font-medium text-sm text-gray-500">Image:</span>
//                                                 <div className="mt-1">
//                                                     <img
//                                                         src={template.imageUrl}
//                                                         alt="Template image"
//                                                         className="h-20 object-cover rounded"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         )}
//                                         {template.variables && template.variables.length > 0 && (
//                                             <div className="mb-2">
//                                                 <span className="font-medium text-sm text-gray-500">Variables:</span>
//                                                 <div className="flex flex-wrap gap-1 mt-1">
//                                                     {template.variables.map(variable => (
//                                                         <span key={variable} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                                                             {`{{${variable}}}`}
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                         <div className="text-xs text-gray-500 mt-3">
//                                             Sent {template.sendCount || 0} times
//                                             {template.lastSentAt && ` • Last sent ${new Date(template.lastSentAt).toLocaleDateString()}`}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </>
//             )}

//             {showAddTemplate && (
//                 <TemplateForm
//                     template={selectedTemplate}
//                     onClose={() => setShowAddTemplate(false)}
//                     onSave={() => {
//                         setShowAddTemplate(false);
//                         fetchTemplates();
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default TemplatesTab;

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import Alert from '../../components/NotificationDashboard/Alert';
import TemplateForm from '../../components/NotificationDashboard/TemplateForm';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const TemplatesTab = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddTemplate, setShowAddTemplate] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${base_url}/api/notifications/admin/templates`,
                getAuthConfig()
            );

            if (response.data && response.data.success) {
                setTemplates(response.data.templates);
            } else {
                setError(response.data?.message || 'Failed to fetch templates');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error connecting to server');
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTemplate = (template) => {
        setSelectedTemplate(template);
        setShowAddTemplate(true);
    };

    const handleDeleteTemplate = async (id) => {
        if (!window.confirm('Are you sure you want to delete this template?')) {
            return;
        }

        try {
            setError(null);
            const response = await axios.delete(
                `${base_url}/api/notifications/admin/templates/${id}`,
                getAuthConfig()
            );

            if (response.data && response.data.success) {
                // Remove template from state
                setTemplates(templates.filter(t => t._id !== id));
                // Show success message (optional)
                setError({ isSuccess: true, message: 'Template deleted successfully' });
            } else {
                setError(response.data?.message || 'Failed to delete template');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error connecting to server');
            console.error('Failed to delete template:', err);
        }
    };

    const handleTemplateFormClose = () => {
        setShowAddTemplate(false);
        setSelectedTemplate(null);
    };

    const handleTemplateFormSave = () => {
        handleTemplateFormClose();
        fetchTemplates(); // Refresh the templates list
        // Show success message (optional)
        setError({ isSuccess: true, message: 'Template saved successfully' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Notification Templates</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition duration-150 ease-in-out"
                    onClick={() => {
                        setSelectedTemplate(null);
                        setShowAddTemplate(true);
                    }}
                >
                    <Plus size={16} className="mr-1" />
                    Add Template
                </button>
            </div>

            {error && (
                <Alert
                    title={error.isSuccess ? "Success" : "Error"}
                    description={error.message || error}
                    variant={error.isSuccess ? "success" : "error"}
                />
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4 w-1/4 mx-auto"></div>
                        <div className="h-24 bg-gray-200 rounded mb-4"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ) : (
                <>
                    {templates.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No templates found. Create your first template to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templates.map(template => (
                                <div key={template._id} className="border rounded-lg overflow-hidden bg-white transform transition-all duration-200 hover:shadow-md">
                                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">{template.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {template.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-xs ml-2 text-gray-500">{template.category}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-1 text-gray-500 hover:text-blue-500 transition duration-150"
                                                onClick={() => handleEditTemplate(template)}
                                                title="Edit template"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="p-1 text-gray-500 hover:text-red-500 transition duration-150"
                                                onClick={() => handleDeleteTemplate(template._id)}
                                                title="Delete template"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-2">
                                            <span className="font-medium text-sm text-gray-500">Title:</span>
                                            <p>{template.title}</p>
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-medium text-sm text-gray-500">Body:</span>
                                            <p>{template.body}</p>
                                        </div>
                                        {template.imageUrl && (
                                            <div className="mb-2">
                                                <span className="font-medium text-sm text-gray-500">Image:</span>
                                                <div className="mt-1">
                                                    <img
                                                        src={template.imageUrl}
                                                        alt="Template image"
                                                        className="h-20 object-cover rounded"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {template.variables && template.variables.length > 0 && (
                                            <div className="mb-2">
                                                <span className="font-medium text-sm text-gray-500">Variables:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {template.variables.map(variable => (
                                                        <span key={variable} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                            {`{{${variable}}}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 mt-3">
                                            Sent {template.sendCount || 0} times
                                            {template.lastSentAt && ` • Last sent ${new Date(template.lastSentAt).toLocaleDateString()}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {showAddTemplate && (
                <TemplateForm
                    template={selectedTemplate}
                    onClose={handleTemplateFormClose}
                    onSave={handleTemplateFormSave}
                />
            )}
        </div>
    );
};

export default TemplatesTab;