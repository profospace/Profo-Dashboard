// import React, { useState, useEffect } from 'react';
// import { Filter, Users, Zap, Eye, Send } from 'lucide-react';
// import Alert from '../../components/NotificationDashboard/Alert';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';
// import axios from 'axios';

// const SendNotificationsTab = () => {
//     const [templates, setTemplates] = useState([]);
//     const [selectedTemplate, setSelectedTemplate] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [sending, setSending] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [sendMode, setSendMode] = useState('filter'); // filter, users, topic
//     const [formData, setFormData] = useState({
//         filter: {},
//         userIds: '',
//         topic: '',
//         variables: {},
//         testMode: true
//     });
//     const [variableKey, setVariableKey] = useState('');
//     const [variableValue, setVariableValue] = useState('');
//     const [previewNotification, setPreviewNotification] = useState(null);

//     useEffect(() => {
//         fetchTemplates();
//     }, []);

//     const fetchTemplates = async () => {
//         try {
//             setLoading(true);

//             const res = await axios.get(`${base_url}/api/notifications/admin/templates` , )
//             console.log("res", res)
//             setTemplates(res?.data?.templates)
//             // Mock data for demonstration
           
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to fetch templates:', err);
//             setLoading(false);
//         }finally{
//             setLoading(false)
//         }
//     };

//     const handleTemplateSelect = (templateId) => {
//         const template = templates.find(t => t._id === templateId);
//         setSelectedTemplate(template);
//         setFormData(prev => ({
//             ...prev,
//             variables: {}
//         }));
//         setPreviewNotification(null);
//     };

//     const handleSendModeChange = (mode) => {
//         setSendMode(mode);
//         setError(null);
//         setSuccess(null);
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleFilterChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             filter: {
//                 ...prev.filter,
//                 [field]: value
//             }
//         }));
//     };

//     const addVariable = () => {
//         if (!variableKey.trim()) return;

//         setFormData(prev => ({
//             ...prev,
//             variables: {
//                 ...prev.variables,
//                 [variableKey]: variableValue
//             }
//         }));

//         setVariableKey('');
//         setVariableValue('');
//     };

//     const removeVariable = (key) => {
//         const newVariables = { ...formData.variables };
//         delete newVariables[key];

//         setFormData(prev => ({
//             ...prev,
//             variables: newVariables
//         }));
//     };

//     const handlePreview = async () => {
//         if (!selectedTemplate) return;

//         try {
//             setLoading(true);
//             setError(null);
//             setSuccess(null);

//             // Mock preview generation
//             setTimeout(() => {
//                 const preview = {
//                     title: selectedTemplate.title,
//                     body: selectedTemplate.body
//                 };

//                 // Replace variables in title and body
//                 Object.entries(formData.variables).forEach(([key, value]) => {
//                     const regex = new RegExp(`{{${key}}}`, 'g');
//                     preview.title = preview.title.replace(regex, value);
//                     preview.body = preview.body.replace(regex, value);
//                 });

//                 setPreviewNotification(preview);
//                 setLoading(false);
//             }, 500);
//         } catch (err) {
//             setError('Error generating preview');
//             console.error('Failed to preview notification:', err);
//             setLoading(false);
//         }
//     };

//     // const handleSendTest = async () => {
//     //     if (!selectedTemplate) return;

//     //     try {
//     //         setSending(true);
//     //         setError(null);
//     //         setSuccess(null);

//     //         // This would need to be replaced with actual test user ID
//     //         // const testUserId = "6801f64ddc168a8e9c2ee495"; // Example user ID
//     //         const testUserId = "6801f64ddc168a8e9c2ee495"; // Example user ID

//     //         const response = await axios.post(
//     //             `${base_url}/api/notifications/admin/templates/${selectedTemplate._id}/send-test`,
//     //             {
//     //                 recipientId: testUserId,
//     //                 variables: formData.variables
//     //             },
//     //             getAuthConfig() // This will include headers like Authorization
//     //         );

//     //         const data = await response.json();

//     //         if (data.success) {
//     //             setSuccess('Test notification sent successfully!');
//     //         } else {
//     //             setError(data.message || 'Failed to send test notification');
//     //         }
//     //     } catch (err) {
//     //         setError('Error connecting to server');
//     //         console.error('Failed to send test notification:', err);
//     //     } finally {
//     //         setSending(false);
//     //     }
//     // };

//     const handleSendTest = async () => {
//         if (!selectedTemplate) {
//             setError('Please select a template first');
//             return;
//         }

//         try {
//             setSending(true);
//             setError(null);
//             setSuccess(null);

//             // This would need to be replaced with actual test user ID
//             const testUserId = "6801f64ddc168a8e9c2ee495"; // Example user ID

//             const response = await axios.post(
//                 `${base_url}/api/notifications/admin/templates/${selectedTemplate._id}/send-test`,
//                 {
//                     recipientId: testUserId,
//                     variables: formData.variables
//                 },
//                 getAuthConfig() // This will include headers like Authorization
//             );

//             // Check if response is successful
//             if (response.data && response.data.success) {
//                 setSuccess('Test notification sent successfully!');
//             } else {
//                 setError(response.data?.message || 'Failed to send test notification');
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Error connecting to server');
//             console.error('Failed to send test notification:', err);
//         } finally {
//             setSending(false);
//         }
//     };
    
//     const handleSend = async () => {
//         if (!selectedTemplate) {
//             setError('Please select a template first');
//             return;
//         }

//         try {
//             setSending(true);
//             setError(null);
//             setSuccess(null);

//             let payload = {
//                 notification: previewNotification,
//                 testMode: formData.testMode
//             };

//             // Add send mode specific data
//             if (sendMode === 'filter' && Object.keys(formData.filter).length > 0) {
//                 payload.filter = formData.filter;
//             } else if (sendMode === 'users' && formData.userIds.length > 0) {
//                 payload.userIds = formData.userIds.split(',').map(id => id.trim());
//             } else if (sendMode === 'topic' && formData.topic) {
//                 payload.topic = formData.topic;
//             } else {
//                 setError('Please complete the required fields for your selected send mode');
//                 setSending(false);
//                 return;
//             }

//             const response = await axios.post(
//                 `${base_url}/api/notifications/admin/send`,
//                 payload,
//                 getAuthConfig()
//             );

//             const data = await response.json();

//             if (data.success) {
//                 setSuccess('Notification sent successfully!');
//                 // Reset form after successful send
//                 if (!formData.testMode) {
//                     setFormData({
//                         filter: {},
//                         userIds: [],
//                         topic: '',
//                         variables: {},
//                         testMode: true
//                     });
//                     setSelectedTemplate(null);
//                     setPreviewNotification(null);
//                 }
//             } else {
//                 setError(data.message || 'Failed to send notification');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to send notification:', err);
//         } finally {
//             setSending(false);
//         }
//     }


//     const sendModeButton = (mode, icon, label) => {
//         const isActive = sendMode === mode;
//         return (
//             <button
//                 className={`flex-1 p-2 flex items-center justify-center transition duration-150 ${isActive ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
//                     }`}
//                 onClick={() => handleSendModeChange(mode)}
//             >
//                 {React.createElement(icon, { size: 16, className: "inline mr-1" })}
//                 {label}
//             </button>
//         );
//     };

//     return (
//         <div>
//             <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>

//             {error && (
//                 <Alert
//                     title="Error"
//                     description={error}
//                     variant="error"
//                 />
//             )}

//             {success && (
//                 <Alert
//                     title="Success"
//                     description={success}
//                     variant="success"
//                 />
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <h3 className="text-lg font-medium mb-3">1. Select Template</h3>

//                     {loading ? (
//                         <div className="text-center py-4">
//                             <div className="animate-pulse h-10 bg-gray-200 rounded mb-4"></div>
//                         </div>
//                     ) : (
//                         <div className="border rounded overflow-hidden">
//                             <div className="bg-gray-50 p-3 border-b">
//                                 <select
//                                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                     onChange={(e) => handleTemplateSelect(e.target.value)}
//                                     value={selectedTemplate?._id || ''}
//                                 >
//                                     <option value="">-- Select a template --</option>
//                                     {templates.map(template => (
//                                         <option key={template._id} value={template._id}>
//                                             {template.name} - {template.title}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {selectedTemplate && (
//                                 <div className="p-3">
//                                     <h4 className="font-medium">{selectedTemplate.title}</h4>
//                                     <p className="text-gray-600 text-sm mt-1">{selectedTemplate.body}</p>

//                                     {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
//                                         <div className="mt-3">
//                                             <h5 className="text-sm font-medium">Variables</h5>

//                                             <div className="flex mb-2 mt-2">
//                                                 <select
//                                                     value={variableKey}
//                                                     onChange={(e) => setVariableKey(e.target.value)}
//                                                     className="w-1/3 p-2 border rounded-l focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                                 >
//                                                     <option value="">-- Select variable --</option>
//                                                     {selectedTemplate.variables.map(variable => (
//                                                         <option key={variable} value={variable}>
//                                                             {variable}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <input
//                                                     type="text"
//                                                     value={variableValue}
//                                                     onChange={(e) => setVariableValue(e.target.value)}
//                                                     className="w-2/3 p-2 border-t border-b border-r rounded-r focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                                     placeholder="Value"
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={addVariable}
//                                                     className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
//                                                 >
//                                                     Set
//                                                 </button>
//                                             </div>

//                                             {Object.keys(formData.variables).length > 0 && (
//                                                 <div className="bg-gray-50 p-2 rounded border mb-2">
//                                                     {Object.entries(formData.variables).map(([key, value]) => (
//                                                         <div key={key} className="flex justify-between items-center mb-1">
//                                                             <div>
//                                                                 <span className="font-medium">{key}:</span> {value}
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => removeVariable(key)}
//                                                                 className="text-red-500 hover:text-red-700 transition"
//                                                             >
//                                                                 <span aria-hidden="true">&times;</span>
//                                                             </button>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}

//                                             <div className="mt-2 flex space-x-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={handlePreview}
//                                                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition flex items-center"
//                                                 >
//                                                     <Eye size={14} className="mr-1" />
//                                                     Preview
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     onClick={handleSendTest}
//                                                     className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition flex items-center"
//                                                 >
//                                                     <Send size={14} className="mr-1" />
//                                                     Send Test
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {previewNotification && (
//                                         <div className="mt-4 border p-3 rounded bg-gray-50">
//                                             <h5 className="text-sm font-medium">Preview</h5>
//                                             <div className="mt-2 p-3 bg-white border rounded shadow-sm">
//                                                 <div className="font-medium">{previewNotification.title}</div>
//                                                 <p className="text-sm mt-1">{previewNotification.body}</p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     <h3 className="text-lg font-medium mb-3 mt-6">2. Select Recipients</h3>

//                     <div className="border rounded overflow-hidden">
//                         <div className="bg-gray-50 p-3 border-b">
//                             <div className="flex border rounded">
//                                 {sendModeButton('filter', Filter, 'By Filter')}
//                                 {sendModeButton('users', Users, 'Specific Users')}
//                                 {sendModeButton('topic', Zap, 'Topic')}
//                             </div>
//                         </div>

//                         <div className="p-3">
//                             {sendMode === 'filter' && (
//                                 <div>
//                                     <p className="text-sm mb-3">Send to users matching specific criteria:</p>

//                                     <div className="mb-3">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                                         <input
//                                             type="text"
//                                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                             placeholder="e.g., city=Mumbai"
//                                             value={formData.filter.location || ''}
//                                             onChange={(e) => handleFilterChange('location', e.target.value)}
//                                         />
//                                     </div>

//                                     <div className="mb-3">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Preference</label>
//                                         <select
//                                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                             value={formData.filter.preference || ''}
//                                             onChange={(e) => handleFilterChange('preference', e.target.value)}
//                                         >
//                                             <option value="">Any preference</option>
//                                             <option value="priceAlerts">Price Alerts Enabled</option>
//                                             <option value="newPropertyAlerts">New Property Alerts Enabled</option>
//                                             <option value="savedSearchAlerts">Saved Search Alerts Enabled</option>
//                                             <option value="dailyDigest">Daily Digest Enabled</option>
//                                         </select>
//                                     </div>

//                                     <div className="mb-3">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
//                                         <select
//                                             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                             value={formData.filter.activity || ''}
//                                             onChange={(e) => handleFilterChange('activity', e.target.value)}
//                                         >
//                                             <option value="">Any activity</option>
//                                             <option value="active">Active in last 30 days</option>
//                                             <option value="inactive">Inactive for 30+ days</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             )}

//                             {sendMode === 'users' && (
//                                 <div>
//                                     <p className="text-sm mb-3">Send to specific users by ID:</p>

//                                     <textarea
//                                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                         rows="4"
//                                         name="userIds"
//                                         value={formData.userIds}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter user IDs separated by commas"
//                                     ></textarea>

//                                     <p className="text-xs text-gray-500 mt-1">
//                                         Enter user IDs separated by commas (e.g., 5f8a3b2c1d4e5f6a7b8c9d0e, 5f8a3b2c1d4e5f6a7b8c9d0f)
//                                     </p>
//                                 </div>
//                             )}

//                             {sendMode === 'topic' && (
//                                 <div>
//                                     <p className="text-sm mb-3">Send to users subscribed to a topic:</p>

//                                     <input
//                                         type="text"
//                                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                         name="topic"
//                                         value={formData.topic}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., price-alerts"
//                                     />

//                                     <p className="text-xs text-gray-500 mt-1">
//                                         Only users who have explicitly subscribed to this topic will receive the notification
//                                     </p>
//                                 </div>
//                             )}

//                             <div className="mt-4">
//                                 <label className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="testMode"
//                                         checked={formData.testMode}
//                                         onChange={handleInputChange}
//                                         className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                                     />
//                                     <span className="text-sm font-medium text-gray-700">Test Mode</span>
//                                 </label>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     In test mode, the notification will only be sent to one user instead of all recipients
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div>
//                     <h3 className="text-lg font-medium mb-3">3. Review & Send</h3>

//                     <div className="border rounded overflow-hidden">
//                         <div className="bg-gray-50 p-3 border-b">
//                             <h4 className="font-medium">Notification Summary</h4>
//                         </div>

//                         <div className="p-3">
//                             {!selectedTemplate ? (
//                                 <p className="text-gray-500">Please select a template first</p>
//                             ) : !previewNotification ? (
//                                 <p className="text-gray-500">Click "Preview" to see how your notification will appear</p>
//                             ) : (
//                                 <div>
//                                     <div className="mb-4">
//                                         <h5 className="text-sm font-medium">Notification Content</h5>
//                                         <div className="mt-2 p-3 bg-gray-50 border rounded">
//                                             <div className="font-medium">{previewNotification.title}</div>
//                                             <p className="text-sm mt-1">{previewNotification.body}</p>
//                                         </div>
//                                     </div>

//                                     <div className="mb-4">
//                                         <h5 className="text-sm font-medium">Recipients</h5>
//                                         <div className="mt-2 p-3 bg-gray-50 border rounded">
//                                             {sendMode === 'filter' && (
//                                                 <div className="text-sm">
//                                                     <p><span className="font-medium">Method:</span> By Filter</p>
//                                                     {Object.keys(formData.filter).filter(k => formData.filter[k]).length > 0 ? (
//                                                         <div className="mt-1">
//                                                             <ul className="list-disc list-inside">
//                                                                 {Object.entries(formData.filter).map(([key, value]) => (
//                                                                     value && <li key={key}>{key}: {value}</li>
//                                                                 ))}
//                                                             </ul>
//                                                         </div>
//                                                     ) : (
//                                                         <p className="text-red-500 mt-1">No filters specified</p>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {sendMode === 'users' && (
//                                                 <div className="text-sm">
//                                                     <p><span className="font-medium">Method:</span> Specific Users</p>
//                                                     {formData.userIds ? (
//                                                         <div className="mt-1">
//                                                             <p>{formData.userIds.split(',').length} users selected</p>
//                                                         </div>
//                                                     ) : (
//                                                         <p className="text-red-500 mt-1">No users specified</p>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {sendMode === 'topic' && (
//                                                 <div className="text-sm">
//                                                     <p><span className="font-medium">Method:</span> Topic</p>
//                                                     {formData.topic ? (
//                                                         <div className="mt-1">
//                                                             <p>Topic: {formData.topic}</p>
//                                                         </div>
//                                                     ) : (
//                                                         <p className="text-red-500 mt-1">No topic specified</p>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {formData.testMode && (
//                                                 <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-sm rounded border border-yellow-200">
//                                                     <strong>Test Mode:</strong> Only 1 user will receive this notification
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={handleSend}
//                                         disabled={sending || !previewNotification}
//                                         className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium disabled:bg-blue-300 transition flex justify-center items-center"
//                                     >
//                                         {sending ? (
//                                             <span className="flex items-center">
//                                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                                 Sending Notification...
//                                             </span>
//                                         ) : formData.testMode ? (
//                                             <>
//                                                 <Send size={18} className="mr-2" />
//                                                 Send Test Notification
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Send size={18} className="mr-2" />
//                                                 Send Notification to All Recipients
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SendNotificationsTab;

import React, { useState, useEffect } from 'react';
import { Filter, Users, Zap, Eye, Send } from 'lucide-react';
import Alert from './Alert';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const SendNotificationsTab = () => {
    // Component state remains unchanged
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [sendMode, setSendMode] = useState('filter');
    const [formData, setFormData] = useState({
        filter: {},
        userIds: '',
        topic: '',
        variables: {},
        testMode: true
    });
    const [variableKey, setVariableKey] = useState('');
    const [variableValue, setVariableValue] = useState('');
    const [previewNotification, setPreviewNotification] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/api/notifications/admin/templates`, getAuthConfig());

            if (response.data && response.data.templates) {
                setTemplates(response.data.templates);
            } else {
                console.warn('No templates returned from API');
                setTemplates([]);
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        setSelectedTemplate(template);
        setFormData(prev => ({
            ...prev,
            variables: {}
        }));
        setPreviewNotification(null);
    };

    const handleSendModeChange = (mode) => {
        setSendMode(mode);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFilterChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            filter: {
                ...prev.filter,
                [field]: value
            }
        }));
    };

    const addVariable = () => {
        if (!variableKey.trim()) return;

        setFormData(prev => ({
            ...prev,
            variables: {
                ...prev.variables,
                [variableKey]: variableValue
            }
        }));

        setVariableKey('');
        setVariableValue('');
    };

    const removeVariable = (key) => {
        const newVariables = { ...formData.variables };
        delete newVariables[key];

        setFormData(prev => ({
            ...prev,
            variables: newVariables
        }));
    };

    const handlePreview = async () => {
        if (!selectedTemplate) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Create preview from template
            const preview = {
                title: selectedTemplate.title,
                body: selectedTemplate.body
            };

            // Replace variables in title and body
            Object.entries(formData.variables).forEach(([key, value]) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                preview.title = preview.title.replace(regex, value);
                preview.body = preview.body.replace(regex, value);
            });

            setPreviewNotification(preview);
        } catch (err) {
            setError('Error generating preview');
            console.error('Failed to preview notification:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendTest = async () => {
        if (!selectedTemplate) {
            setError('Please select a template first');
            return;
        }

        try {
            setSending(true);
            setError(null);
            setSuccess(null);

            // Test user ID - this should be a valid user ID with registered FCM tokens
            const testUserId = "6801f64ddc168a8e9c2ee495";

            const response = await axios.post(
                `${base_url}/api/notifications/admin/templates/${selectedTemplate._id}/send-test`,
                {
                    recipientId: testUserId,
                    variables: formData.variables
                },
                getAuthConfig()
            );

            console.log('Test notification response:', response.data);

            // Check if response is successful
            if (response.data && response.data.success) {
                setSuccess('Test notification sent successfully!');
            } else {
                setError(response.data?.message || 'Failed to send test notification');
            }
        } catch (err) {
            console.error('Failed to send test notification:', err);
            setError(err.response?.data?.message || 'Error connecting to server');
        } finally {
            setSending(false);
        }
    };

    const handleSend = async () => {
        if (!selectedTemplate || !previewNotification) {
            setError('Please select a template and generate a preview first');
            return;
        }

        try {
            setSending(true);
            setError(null);
            setSuccess(null);

            let payload = {
                notification: {
                    ...previewNotification,
                    data: {} // Add any additional data needed
                },
                testMode: formData.testMode
            };

            // Add send mode specific data
            if (sendMode === 'filter' && Object.keys(formData.filter).length > 0) {
                payload.filter = formData.filter;
            } else if (sendMode === 'users' && formData.userIds.trim()) {
                payload.userIds = formData.userIds.split(',').map(id => id.trim());
            } else if (sendMode === 'topic' && formData.topic.trim()) {
                payload.topic = formData.topic;
            } else {
                setError('Please complete the required fields for your selected send mode');
                setSending(false);
                return;
            }

            console.log('Sending notification with payload:', payload);

            const response = await axios.post(
                `${base_url}/api/notifications/admin/send`,
                payload,
                getAuthConfig()
            );

            console.log('Send notification response:', response.data);

            if (response.data && response.data.success) {
                setSuccess('Notification sent successfully!');

                // Reset form after successful send if not in test mode
                if (!formData.testMode) {
                    setFormData({
                        filter: {},
                        userIds: '',
                        topic: '',
                        variables: {},
                        testMode: true
                    });
                    setSelectedTemplate(null);
                    setPreviewNotification(null);
                }
            } else {
                setError(response.data?.message || 'Failed to send notification');
            }
        } catch (err) {
            console.error('Failed to send notification:', err);
            setError(err.response?.data?.message || 'Error connecting to server');
        } finally {
            setSending(false);
        }
    };

    // Rest of component remain unchanged
    const sendModeButton = (mode, icon, label) => {
        const isActive = sendMode === mode;
        return (
            <button
                className={`flex-1 p-2 flex items-center justify-center transition duration-150 ${isActive ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
                    }`}
                onClick={() => handleSendModeChange(mode)}
            >
                {React.createElement(icon, { size: 16, className: "inline mr-1" })}
                {label}
            </button>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>

            {error && (
                <Alert
                    title="Error"
                    description={error}
                    variant="error"
                />
            )}

            {success && (
                <Alert
                    title="Success"
                    description={success}
                    variant="success"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-3">1. Select Template</h3>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-pulse h-10 bg-gray-200 rounded mb-4"></div>
                        </div>
                    ) : (
                        <div className="border rounded overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b">
                                <select
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                    onChange={(e) => handleTemplateSelect(e.target.value)}
                                    value={selectedTemplate?._id || ''}
                                >
                                    <option value="">-- Select a template --</option>
                                    {templates.map(template => (
                                        <option key={template._id} value={template._id}>
                                            {template.name} - {template.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTemplate && (
                                <div className="p-3">
                                    <h4 className="font-medium">{selectedTemplate.title}</h4>
                                    <p className="text-gray-600 text-sm mt-1">{selectedTemplate.body}</p>

                                    {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                                        <div className="mt-3">
                                            <h5 className="text-sm font-medium">Variables</h5>

                                            <div className="flex mb-2 mt-2">
                                                <select
                                                    value={variableKey}
                                                    onChange={(e) => setVariableKey(e.target.value)}
                                                    className="w-1/3 p-2 border rounded-l focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                                >
                                                    <option value="">-- Select variable --</option>
                                                    {selectedTemplate.variables.map(variable => (
                                                        <option key={variable} value={variable}>
                                                            {variable}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={variableValue}
                                                    onChange={(e) => setVariableValue(e.target.value)}
                                                    className="w-2/3 p-2 border-t border-b border-r rounded-r focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                                    placeholder="Value"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addVariable}
                                                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                                                >
                                                    Set
                                                </button>
                                            </div>

                                            {Object.keys(formData.variables).length > 0 && (
                                                <div className="bg-gray-50 p-2 rounded border mb-2">
                                                    {Object.entries(formData.variables).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center mb-1">
                                                            <div>
                                                                <span className="font-medium">{key}:</span> {value}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVariable(key)}
                                                                className="text-red-500 hover:text-red-700 transition"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-2 flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={handlePreview}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition flex items-center"
                                                >
                                                    <Eye size={14} className="mr-1" />
                                                    Preview
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSendTest}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition flex items-center"
                                                >
                                                    <Send size={14} className="mr-1" />
                                                    Send Test
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {previewNotification && (
                                        <div className="mt-4 border p-3 rounded bg-gray-50">
                                            <h5 className="text-sm font-medium">Preview</h5>
                                            <div className="mt-2 p-3 bg-white border rounded shadow-sm">
                                                <div className="font-medium">{previewNotification.title}</div>
                                                <p className="text-sm mt-1">{previewNotification.body}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <h3 className="text-lg font-medium mb-3 mt-6">2. Select Recipients</h3>

                    <div className="border rounded overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                            <div className="flex border rounded">
                                {sendModeButton('filter', Filter, 'By Filter')}
                                {sendModeButton('users', Users, 'Specific Users')}
                                {sendModeButton('topic', Zap, 'Topic')}
                            </div>
                        </div>

                        <div className="p-3">
                            {sendMode === 'filter' && (
                                <div>
                                    <p className="text-sm mb-3">Send to users matching specific criteria:</p>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                            placeholder="e.g., city=Mumbai"
                                            value={formData.filter.location || ''}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preference</label>
                                        <select
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                            value={formData.filter.preference || ''}
                                            onChange={(e) => handleFilterChange('preference', e.target.value)}
                                        >
                                            <option value="">Any preference</option>
                                            <option value="priceAlerts">Price Alerts Enabled</option>
                                            <option value="newPropertyAlerts">New Property Alerts Enabled</option>
                                            <option value="savedSearchAlerts">Saved Search Alerts Enabled</option>
                                            <option value="dailyDigest">Daily Digest Enabled</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                                        <select
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                            value={formData.filter.activity || ''}
                                            onChange={(e) => handleFilterChange('activity', e.target.value)}
                                        >
                                            <option value="">Any activity</option>
                                            <option value="active">Active in last 30 days</option>
                                            <option value="inactive">Inactive for 30+ days</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {sendMode === 'users' && (
                                <div>
                                    <p className="text-sm mb-3">Send to specific users by ID:</p>

                                    <textarea
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                        rows="4"
                                        name="userIds"
                                        value={formData.userIds}
                                        onChange={handleInputChange}
                                        placeholder="Enter user IDs separated by commas"
                                    ></textarea>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter user IDs separated by commas (e.g., 5f8a3b2c1d4e5f6a7b8c9d0e, 5f8a3b2c1d4e5f6a7b8c9d0f)
                                    </p>
                                </div>
                            )}

                            {sendMode === 'topic' && (
                                <div>
                                    <p className="text-sm mb-3">Send to users subscribed to a topic:</p>

                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleInputChange}
                                        placeholder="e.g., price-alerts"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">
                                        Only users who have explicitly subscribed to this topic will receive the notification
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="testMode"
                                        checked={formData.testMode}
                                        onChange={handleInputChange}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Test Mode</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    In test mode, the notification will only be sent to one user instead of all recipients
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-3">3. Review & Send</h3>

                    <div className="border rounded overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                            <h4 className="font-medium">Notification Summary</h4>
                        </div>

                        <div className="p-3">
                            {!selectedTemplate ? (
                                <p className="text-gray-500">Please select a template first</p>
                            ) : !previewNotification ? (
                                <p className="text-gray-500">Click "Preview" to see how your notification will appear</p>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <h5 className="text-sm font-medium">Notification Content</h5>
                                        <div className="mt-2 p-3 bg-gray-50 border rounded">
                                            <div className="font-medium">{previewNotification.title}</div>
                                            <p className="text-sm mt-1">{previewNotification.body}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="text-sm font-medium">Recipients</h5>
                                        <div className="mt-2 p-3 bg-gray-50 border rounded">
                                            {sendMode === 'filter' && (
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Method:</span> By Filter</p>
                                                    {Object.keys(formData.filter).filter(k => formData.filter[k]).length > 0 ? (
                                                        <div className="mt-1">
                                                            <ul className="list-disc list-inside">
                                                                {Object.entries(formData.filter).map(([key, value]) => (
                                                                    value && <li key={key}>{key}: {value}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 mt-1">No filters specified</p>
                                                    )}
                                                </div>
                                            )}

                                            {sendMode === 'users' && (
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Method:</span> Specific Users</p>
                                                    {formData.userIds ? (
                                                        <div className="mt-1">
                                                            <p>{formData.userIds.split(',').length} users selected</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 mt-1">No users specified</p>
                                                    )}
                                                </div>
                                            )}

                                            {sendMode === 'topic' && (
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Method:</span> Topic</p>
                                                    {formData.topic ? (
                                                        <div className="mt-1">
                                                            <p>Topic: {formData.topic}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 mt-1">No topic specified</p>
                                                    )}
                                                </div>
                                            )}

                                            {formData.testMode && (
                                                <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-sm rounded border border-yellow-200">
                                                    <strong>Test Mode:</strong> Only 1 user will receive this notification
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !previewNotification}
                                        className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium disabled:bg-blue-300 transition flex justify-center items-center"
                                    >
                                        {sending ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending Notification...
                                            </span>
                                        ) : formData.testMode ? (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Send Test Notification
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Send Notification to All Recipients
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendNotificationsTab;