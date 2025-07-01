// import React, { useState, useEffect } from 'react';
// import { Plus, Settings, Eye, EyeOff, Upload, Trash2, Save, RefreshCw } from 'lucide-react';
// import IconCard from './IconCard';
// import IconEditor from './IconEditor';
// import PreviewModal from './PreviewModal';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';
// import axios from 'axios';

// const BottomNavManager = () => {
//     const [icons, setIcons] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedIcon, setSelectedIcon] = useState(null);
//     const [showEditor, setShowEditor] = useState(false);
//     const [showPreview, setShowPreview] = useState(false);
//     const [version, setVersion] = useState('');
//     const [lastUpdated, setLastUpdated] = useState('');
//     const [saving, setSaving] = useState(false);


//     // Fetch bottom navigation icons
//     const fetchBottomNavIcons = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/bottom-nav-icons`, {
//                 method: 'GET',
//                 headers: getAuthConfig(),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching bottom nav icons:', error);
//             throw error;
//         }
//     };

//     // Create a new icon
//     const createIcon = async (formData) => {
//         try {
//             const config = getAuthConfig();
//             const response = await axios.post(`${base_url}/api/bottom-nav-icons`, formData, config);
//             return response.data;
//         } catch (error) {
//             console.error('Error creating icon:', error.response?.data || error.message);
//             throw error;
//         }
//     };

//     // Update a specific icon
//     const updateIcon = async (iconId, formData) => {
//         try {
//             const config = getAuthConfig();
//             const response = await axios.post(`${base_url}/api/bottom-nav-icons/${iconId}`, formData, config);
//             return response.data;
//         } catch (error) {
//             console.error('Error updating icon:', error.response?.data || error.message);
//             throw error;
//         }
//     };

//     // Update all icons configuration
//     const updateAllIcons = async (iconsData) => {
//         try {
//             const config = getAuthConfig();
//             config.headers['Content-Type'] = 'application/json';

//             const response = await axios.put(`${base_url}/api/bottom-nav-icons`, { icons: iconsData }, config);
//             return response.data;
//         } catch (error) {
//             console.error('Error updating all icons:', error.response?.data || error.message);
//             throw error;
//         }
//     };


//     const deleteIcon = async (iconId) => {
//         try {
//             const response = await axios.delete(
//                 `${base_url}/api/bottom-nav-icons/${iconId}`,
//                 getAuthConfig() 
//             );

//             return response.data;
//         } catch (error) {
//             console.error('Error deleting icon:', error.response?.data || error.message);
//             throw error;
//         }
//     };
    

//     useEffect(() => {
//         loadIcons();
//     }, []);

//     console.log(icons)
//     const loadIcons = async () => {
//         try {
//             setLoading(true);
//             const response = await fetchBottomNavIcons();
//             if (response.success) {
//                 setIcons(response.data.icons || []);
//                 setVersion(response.data.version || '');
//                 setLastUpdated(response.data.lastUpdated || '');
//             }
//         } catch (error) {
//             console.error('Failed to load icons:', error);
//             // If no configuration exists, start with empty array
//             setIcons([]);
//             setVersion('1.0.0');
//             setLastUpdated(new Date().toISOString());
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditIcon = (icon) => {
//         setSelectedIcon(icon);
//         setShowEditor(true);
//     };

//     const handleSaveIcon = async (iconData) => {
//         try {
//             setSaving(true);

//             if (selectedIcon) {
//                 // Update existing icon
//                 const response = await updateIcon(selectedIcon.id, iconData);
//                 if (response.success) {
//                     await loadIcons();
//                     setShowEditor(false);
//                     setSelectedIcon(null);
//                 }
//             } else {
//                 // Create new icon
//                 const response = await createIcon(iconData);
//                 if (response.success) {
//                     await loadIcons();
//                     setShowEditor(false);
//                     setSelectedIcon(null);
//                 }
//             }
//         } catch (error) {
//             console.error('Failed to save icon:', error);

//             // Show user-friendly error message
//             let errorMessage = 'Failed to save icon';
//             if (error.response?.data?.message) {
//                 errorMessage = error.response.data.message;
//             } else if (error.message) {
//                 errorMessage = error.message;
//             }

//             // You can replace this with a proper toast notification
//             alert(errorMessage);
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDeleteIcon = async (iconId) => {
//         if (window.confirm('Are you sure you want to delete this icon?')) {
//             try {
//                 const response = await deleteIcon(iconId);
//                 if (response.success) {
//                     await loadIcons();
//                 }
//             } catch (error) {
//                 console.error('Failed to delete icon:', error);
//                 alert('Failed to delete icon');
//             }
//         }
//     };

//     const handleReorderIcons = (dragIndex, hoverIndex) => {
//         const draggedIcon = icons[dragIndex];
//         const newIcons = [...icons];
//         newIcons.splice(dragIndex, 1);
//         newIcons.splice(hoverIndex, 0, draggedIcon);

//         // Update order values
//         const updatedIcons = newIcons.map((icon, index) => ({
//             ...icon,
//             order: index
//         }));

//         setIcons(updatedIcons);
//     };

//     const handleSaveAllIcons = async () => {
//         try {
//             setSaving(true);
//             const response = await updateAllIcons(icons);
//             if (response.success) {
//                 await loadIcons();
//             }
//         } catch (error) {
//             console.error('Failed to save all icons:', error);
//             alert('Failed to save all icons');
//         } finally {
//             setSaving(false);
//         }
//     };

//     const toggleIconEnabled = (iconId) => {
//         setIcons(icons.map(icon =>
//             icon.id === iconId
//                 ? { ...icon, isEnabled: !icon.isEnabled }
//                 : icon
//         ));
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="flex items-center space-x-3">
//                     <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
//                     <span className="text-lg text-gray-600">Loading navigation icons...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center py-6">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900">Bottom Navigation Manager</h1>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 Manage your app's bottom navigation icons and configuration
//                             </p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <div className="text-right">
//                                 <div className="text-sm font-medium text-gray-900">Version {version}</div>
//                                 <div className="text-xs text-gray-500">
//                                     Updated {new Date(lastUpdated).toLocaleDateString()}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setShowPreview(true)}
//                                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                             >
//                                 <Eye className="w-4 h-4 mr-2" />
//                                 Preview
//                             </button>
//                             <button
//                                 onClick={handleSaveAllIcons}
//                                 disabled={saving}
//                                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 {saving ? (
//                                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                                 ) : (
//                                     <Save className="w-4 h-4 mr-2" />
//                                 )}
//                                 Save Changes
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center">
//                             <div className="flex-shrink-0">
//                                 <Settings className="w-8 h-8 text-blue-600" />
//                             </div>
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-500">Total Icons</p>
//                                 <p className="text-2xl font-semibold text-gray-900">{icons.length}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center">
//                             <div className="flex-shrink-0">
//                                 <Eye className="w-8 h-8 text-green-600" />
//                             </div>
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-500">Enabled Icons</p>
//                                 <p className="text-2xl font-semibold text-gray-900">
//                                     {icons.filter(icon => icon.isEnabled).length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center">
//                             <div className="flex-shrink-0">
//                                 <EyeOff className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-500">Disabled Icons</p>
//                                 <p className="text-2xl font-semibold text-gray-900">
//                                     {icons.filter(icon => !icon.isEnabled).length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Icons Grid */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <h2 className="text-lg font-semibold text-gray-900">Navigation Icons</h2>
//                         <p className="text-sm text-gray-500">Drag and drop to reorder icons</p>
//                     </div>

//                     <div className="p-6">
//                         {icons.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">No icons configured</h3>
//                                 <p className="text-gray-500 mb-6">Get started by adding your first navigation icon</p>
//                                 <button
//                                     onClick={() => setShowEditor(true)}
//                                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Add First Icon
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                                 {icons
//                                     .sort((a, b) => a.order - b.order)
//                                     .map((icon, index) => (
//                                         <IconCard
//                                             key={icon.id}
//                                             icon={icon?.selectedIconUrl}
//                                             index={index}
//                                             onEdit={() => handleEditIcon(icon)}
//                                             onDelete={() => handleDeleteIcon(icon.id)}
//                                             onToggleEnabled={() => toggleIconEnabled(icon.id)}
//                                             onReorder={handleReorderIcons}
//                                         />
//                                     ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Add New Icon Button */}
//                 {icons.length > 0 && (
//                     <div className="mt-8 text-center">
//                         <button
//                             onClick={() => {
//                                 setSelectedIcon(null);
//                                 setShowEditor(true);
//                             }}
//                             className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
//                         >
//                             <Plus className="w-5 h-5 mr-2" />
//                             Add New Icon
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Modals */}
//             {showEditor && (
//                 <IconEditor
//                     icon={selectedIcon}
//                     onSave={handleSaveIcon}
//                     onClose={() => {
//                         setShowEditor(false);
//                         setSelectedIcon(null);
//                     }}
//                     saving={saving}
//                 />
//             )}

//             {showPreview && (
//                 <PreviewModal
//                     icons={icons.filter(icon => icon.isEnabled).sort((a, b) => a.order - b.order)}
//                     onClose={() => setShowPreview(false)}
//                 />
//             )}
//         </div>
//     );
// };

// import React, { useState, useEffect } from 'react';
// import { Plus, Settings, Edit, Trash2, Save, RefreshCw, Eye, EyeOff, GripVertical, Upload, X } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

// const BottomNavManager = () => {
//     const [icons, setIcons] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [showEditor, setShowEditor] = useState(false);
//     const [editingIcon, setEditingIcon] = useState(null);

//     console.log("icons", icons)

//     // Configuration - You can set these values
//     const API_BASE_URL = base_url;
//     const AUTH_TOKEN = localStorage.getItem('authToken') || 'your-auth-token';

//     // Fetch icons from API
//     const fetchIcons = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons`, {
//                 method: 'GET',
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             if (data.success) {
//                 setIcons(data.data || []);
//             } else {
//                 throw new Error(data.message || 'Failed to fetch icons');
//             }
//         } catch (error) {
//             console.error('Error fetching icons:', error);
//             alert('Failed to load icons: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchIcons();
//     }, []);

//     const handleCreateIcon = () => {
//         setEditingIcon(null);
//         setShowEditor(true);
//     };

//     const handleEditIcon = (icon) => {
//         setEditingIcon(icon);
//         setShowEditor(true);
//     };

//     const handleDeleteIcon = async (iconId) => {
//         if (!window.confirm('Are you sure you want to delete this icon?')) {
//             return;
//         }

//         try {
//             setSaving(true);
//             const response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons/${iconId}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             if (data.success) {
//                 await fetchIcons(); // Refresh the list
//                 alert('Icon deleted successfully');
//             } else {
//                 throw new Error(data.message || 'Failed to delete icon');
//             }
//         } catch (error) {
//             console.error('Error deleting icon:', error);
//             alert('Failed to delete icon: ' + error.message);
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleToggleEnabled = async (icon) => {
//         try {
//             setSaving(true);
//             const formData = new FormData();
//             formData.append('isEnabled', !icon.isEnabled);

//             const response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons/${icon.id}`, {
//                 method: 'PUT',
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             if (data.success) {
//                 await fetchIcons(); // Refresh the list
//             } else {
//                 throw new Error(data.message || 'Failed to update icon');
//             }
//         } catch (error) {
//             console.error('Error toggling icon:', error);
//             alert('Failed to update icon: ' + error.message);
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="flex items-center space-x-3">
//                     <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
//                     <span className="text-lg text-gray-600">Loading navigation icons...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center py-6">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900">Bottom Navigation Manager</h1>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 Manage your app's bottom navigation icons
//                             </p>
//                         </div>
//                         <button
//                             onClick={handleCreateIcon}
//                             disabled={saving}
//                             className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             <Plus className="w-4 h-4 mr-2" />
//                             Add New Icon
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Stats */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-white rounded-lg shadow p-6">
//                         <div className="flex items-center">
//                             <Settings className="w-8 h-8 text-blue-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-500">Total Icons</p>
//                                 <p className="text-2xl font-semibold text-gray-900">{icons.length}</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-6">
//                         <div className="flex items-center">
//                             <Eye className="w-8 h-8 text-green-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-500">Enabled</p>
//                                 <p className="text-2xl font-semibold text-gray-900">
//                                     {/* {icons?.filter(icon => icon?.isEnabled).length} */}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-6">
//                         <div className="flex items-center">
//                             <EyeOff className="w-8 h-8 text-gray-400" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-500">Disabled</p>
//                                 <p className="text-2xl font-semibold text-gray-900">
//                                     {/* {icons?.filter(icon => !icon?.isEnabled).length} */}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Icons List */}
//                 <div className="bg-white rounded-lg shadow">
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <h2 className="text-lg font-semibold text-gray-900">Navigation Icons</h2>
//                     </div>

//                     <div className="p-6">
//                         {icons.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">No icons configured</h3>
//                                 <p className="text-gray-500 mb-6">Get started by adding your first navigation icon</p>
//                                 <button
//                                     onClick={handleCreateIcon}
//                                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Add First Icon
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                                 {icons
//                                     .sort((a, b) => a.order - b.order)
//                                     .map((icon) => (
//                                         <IconCard
//                                             key={icon.id}
//                                             icon={icon}
//                                             onEdit={() => handleEditIcon(icon)}
//                                             onDelete={() => handleDeleteIcon(icon?.id)}
//                                             onToggleEnabled={() => handleToggleEnabled(icon)}
//                                             disabled={saving}
//                                         />
//                                     ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Editor Modal */}
//             {showEditor && (
//                 <IconEditor
//                     icon={editingIcon}
//                     onClose={() => {
//                         setShowEditor(false);
//                         setEditingIcon(null);
//                     }}
//                     onSave={async (savedIcon) => {
//                         try {
//                             setSaving(true);
//                             let response;

//                             if (editingIcon) {
//                                 // Update existing icon
//                                 response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons/${editingIcon.id}`, {
//                                     method: 'PUT',
//                                     body: savedIcon // savedIcon is FormData from the editor
//                                 });
//                             } else {
//                                 // Create new icon
//                                 response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons`, {
//                                     method: 'POST',
//                                     body: savedIcon // savedIcon is FormData from the editor
//                                 });
//                             }

//                             if (!response.ok) {
//                                 throw new Error(`HTTP error! status: ${response.status}`);
//                             }

//                             const data = await response.json();
//                             if (data.success) {
//                                 await fetchIcons(); // Refresh the list
//                                 setShowEditor(false);
//                                 setEditingIcon(null);
//                                 alert(editingIcon ? 'Icon updated successfully' : 'Icon created successfully');
//                             } else {
//                                 throw new Error(data.message || 'Failed to save icon');
//                             }
//                         } catch (error) {
//                             console.error('Error saving icon:', error);
//                             alert('Failed to save icon: ' + error.message);
//                         } finally {
//                             setSaving(false);
//                         }
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default BottomNavManager;


// import React, { useState, useEffect } from 'react';
// import { Plus, Settings, Edit, Trash2, Save, RefreshCw, Eye, EyeOff, GripVertical, Upload, X } from 'lucide-react';

import React, { useState, useEffect } from 'react';
import { Plus, Settings, Eye, EyeOff, Upload, Trash2, Save, RefreshCw } from 'lucide-react';
import IconCard from "./IconCard"
import IconEditor from './IconEditor';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const BottomNavManager = () => {
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [editingIcon, setEditingIcon] = useState(null);

    // Configuration - You can set these values
    const API_BASE_URL = base_url; // Change this to your backend URL
    const AUTH_TOKEN = 'your-auth-token'; // Replace with actual token or get from localStorage

    // Fetch icons from API
    const fetchIcons = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setIcons(data.data || []);
            } else {
                throw new Error(data.message || 'Failed to fetch icons');
            }
        } catch (error) {
            console.error('Error fetching icons:', error);
            alert('Failed to load icons: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIcons();
    }, []);

    const handleCreateIcon = () => {
        setEditingIcon(null);
        setShowEditor(true);
    };

    const handleEditIcon = (icon) => {
        setEditingIcon(icon);
        setShowEditor(true);
    };

    const handleDeleteIcon = async (iconId) => {
        if (!window.confirm('Are you sure you want to delete this icon?')) {
            return;
        }

        try {
            setSaving(true);
            // const response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons/${iconId}`, {
            //     method: 'DELETE',
               
            // });

            const response = await axios.delete(`${API_BASE_URL}/api/bottom-nav-icons/${iconId}` , getAuthConfig())


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                await fetchIcons();
                alert('Icon deleted successfully');
            } else {
                throw new Error(data.message || 'Failed to delete icon');
            }
        } catch (error) {
            console.error('Error deleting icon:', error);
            alert('Failed to delete icon: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEnabled = async (icon) => {
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('isEnabled', !icon.isEnabled);

            const response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons/${icon.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                await fetchIcons();
            } else {
                throw new Error(data.message || 'Failed to update icon');
            }
        } catch (error) {
            console.error('Error toggling icon:', error);
            alert('Failed to update icon: ' + error.message);
        } finally {
            setSaving(false);
        }
    };
    console.log("icons" , icons)

    const handleSaveIcon = async (formData) => {
        try {
            setSaving(true);
            let response;

            if (editingIcon) {
                // Update existing icon
                response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons/${editingIcon.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${AUTH_TOKEN}`
                    },
                    body: formData
                });
            } else {
                // Create new icon
                response = await fetch(`${API_BASE_URL}/api/bottom-nav-icons`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${AUTH_TOKEN}`
                    },
                    body: formData
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                await fetchIcons();
                setShowEditor(false);
                setEditingIcon(null);
                alert(editingIcon ? 'Icon updated successfully' : 'Icon created successfully');
            } else {
                throw new Error(data.message || 'Failed to save icon');
            }
        } catch (error) {
            console.error('Error saving icon:', error);
            alert('Failed to save icon: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center space-x-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-lg text-gray-600">Loading navigation icons...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Bottom Navigation Manager</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage your app's bottom navigation icons
                            </p>
                        </div>
                        <button
                            onClick={handleCreateIcon}
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Icon
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <Settings className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Icons</p>
                                <p className="text-2xl font-semibold text-gray-900">{icons.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <Eye className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Enabled</p>
                                {/* <p className="text-2xl font-semibold text-gray-900">
                                    {icons?.filter(icon => icon.isEnabled).length}
                                </p> */}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <EyeOff className="w-8 h-8 text-gray-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Disabled</p>
                                {/* <p className="text-2xl font-semibold text-gray-900">
                                    {icons.filter(icon => !icon.isEnabled).length}
                                </p> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icons List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Navigation Icons</h2>
                    </div>

                    <div className="p-6">
                        {icons.length === 0 ? (
                            <div className="text-center py-12">
                                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No icons configured</h3>
                                <p className="text-gray-500 mb-6">Get started by adding your first navigation icon</p>
                                <button
                                    onClick={handleCreateIcon}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Icon
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {icons?.icons?.map((icon) => (
                                        <IconCard
                                            key={icon.id}
                                            icon={icon}
                                            onEdit={() => handleEditIcon(icon)}
                                            onDelete={() => handleDeleteIcon(icon.id)}
                                            onToggleEnabled={() => handleToggleEnabled(icon)}
                                            disabled={saving}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Editor Modal */}
            {showEditor && (
                <IconEditor
                    icon={editingIcon}
                    onClose={() => {
                        setShowEditor(false);
                        setEditingIcon(null);
                    }}
                    onSave={handleSaveIcon}
                    saving={saving}
                />
            )}
        </div>
    );
};


export default BottomNavManager;
