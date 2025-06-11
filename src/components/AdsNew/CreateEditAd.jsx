// import React, { useState, useEffect } from 'react';
// import { Save, X, MapPin, Calendar, Users, Settings } from 'lucide-react';

// const CreateEditAd = ({ base_url, getAuthConfig, editingAd, onSaveComplete, onCancel }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         header: '',
//         pagelink: '',
//         imagelinks: [''],
//         videoUrl: '',
//         contact: [''],
//         type: {
//             type: 'BANNER',
//             width: 728,
//             height: 90,
//             position: 'top'
//         },
//         locationTargeting: {
//             isLocationBased: false,
//             center: { latitude: 0, longitude: 0 },
//             radius: 10,
//             countries: [],
//             states: [],
//             cities: []
//         },
//         scheduling: {
//             isScheduled: false,
//             startDate: '',
//             endDate: '',
//             timezone: 'UTC',
//             daysOfWeek: [],
//             hourRange: { start: 0, end: 23 }
//         },
//         demographicTargeting: {
//             ageRange: { min: 18, max: 65 },
//             gender: 'all',
//             interests: [],
//             deviceType: 'all'
//         },
//         priority: 1,
//         isActive: true,
//         budget: {
//             daily: 0,
//             total: 0
//         }
//     });
//     const [loading, setLoading] = useState(false);
//     const [activeSection, setActiveSection] = useState('basic');

//     useEffect(() => {
//         if (editingAd) {
//             setFormData({
//                 ...editingAd,
//                 imagelinks: editingAd.imagelinks?.length > 0 ? editingAd.imagelinks : [''],
//                 contact: editingAd.contact?.length > 0 ? editingAd.contact : ['']
//             });
//         }
//     }, [editingAd]);

//     const handleSave = async () => {
//         try {
//             setLoading(true);

//             // Clean up data
//             const cleanData = {
//                 ...formData,
//                 imagelinks: formData.imagelinks.filter(link => link.trim() !== ''),
//                 contact: formData.contact.filter(contact => contact.trim() !== '')
//             };

//             const url = editingAd
//                 ? `${base_url}/api/ads/${editingAd.adId}`
//                 : `${base_url}/api/ads`;

//             const method = editingAd ? 'PUT' : 'POST';

//             const response = await fetch(url, {
//                 ...getAuthConfig(),
//                 method,
//                 body: JSON.stringify(cleanData),
//             });

//             if (response.ok) {
//                 onSaveComplete();
//             }
//         } catch (error) {
//             console.error('Error saving ad:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateFormData = (path, value) => {
//         setFormData(prev => {
//             const newData = { ...prev };
//             const keys = path.split('.');
//             let current = newData;

//             for (let i = 0; i < keys.length - 1; i++) {
//                 current = current[keys[i]];
//             }

//             current[keys[keys.length - 1]] = value;
//             return newData;
//         });
//     };

//     const addArrayItem = (path, defaultValue = '') => {
//         const current = path.split('.').reduce((obj, key) => obj[key], formData);
//         updateFormData(path, [...current, defaultValue]);
//     };

//     const removeArrayItem = (path, index) => {
//         const current = path.split('.').reduce((obj, key) => obj[key], formData);
//         updateFormData(path, current.filter((_, i) => i !== index));
//     };

//     const updateArrayItem = (path, index, value) => {
//         const current = path.split('.').reduce((obj, key) => obj[key], formData);
//         const newArray = [...current];
//         newArray[index] = value;
//         updateFormData(path, newArray);
//     };

//     const sections = [
//         { id: 'basic', name: 'Basic Info', icon: Settings },
//         { id: 'targeting', name: 'Targeting', icon: Users },
//         { id: 'location', name: 'Location', icon: MapPin },
//         { id: 'scheduling', name: 'Scheduling', icon: Calendar },
//     ];

//     const renderBasicInfo = () => (
//         <div className="space-y-6">
//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Ad Name *</label>
//                 <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => updateFormData('name', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                 />
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                 <textarea
//                     value={formData.description}
//                     onChange={(e) => updateFormData('description', e.target.value)}
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
//                     <input
//                         type="text"
//                         value={formData.header}
//                         onChange={(e) => updateFormData('header', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Page Link</label>
//                     <input
//                         type="url"
//                         value={formData.pagelink}
//                         onChange={(e) => updateFormData('pagelink', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type</label>
//                 <select
//                     value={formData.type.type}
//                     onChange={(e) => updateFormData('type.type', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                     <option value="BANNER">Banner</option>
//                     <option value="POPUP">Popup</option>
//                     <option value="INTERSTITIAL">Interstitial</option>
//                     <option value="NATIVE">Native</option>
//                     <option value="VIDEO">Video</option>
//                 </select>
//             </div>

//             {formData.type.type === 'BANNER' && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
//                         <input
//                             type="number"
//                             value={formData.type.width}
//                             onChange={(e) => updateFormData('type.width', parseInt(e.target.value))}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
//                         <input
//                             type="number"
//                             value={formData.type.height}
//                             onChange={(e) => updateFormData('type.height', parseInt(e.target.value))}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
//                         <select
//                             value={formData.type.position}
//                             onChange={(e) => updateFormData('type.position', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             <option value="top">Top</option>
//                             <option value="bottom">Bottom</option>
//                             <option value="middle">Middle</option>
//                             <option value="floating">Floating</option>
//                         </select>
//                     </div>
//                 </div>
//             )}

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Image Links</label>
//                 {formData.imagelinks.map((link, index) => (
//                     <div key={index} className="flex items-center space-x-2 mb-2">
//                         <input
//                             type="url"
//                             value={link}
//                             onChange={(e) => updateArrayItem('imagelinks', index, e.target.value)}
//                             placeholder="Enter image URL"
//                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => removeArrayItem('imagelinks', index)}
//                             className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 ))}
//                 <button
//                     type="button"
//                     onClick={() => addArrayItem('imagelinks')}
//                     className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                 >
//                     + Add Image Link
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
//                     <input
//                         type="number"
//                         min="1"
//                         max="10"
//                         value={formData.priority}
//                         onChange={(e) => updateFormData('priority', parseInt(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                     <select
//                         value={formData.isActive}
//                         onChange={(e) => updateFormData('isActive', e.target.value === 'true')}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value={true}>Active</option>
//                         <option value={false}>Inactive</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget ($)</label>
//                     <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={formData.budget.daily}
//                         onChange={(e) => updateFormData('budget.daily', parseFloat(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
//                     <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={formData.budget.total}
//                         onChange={(e) => updateFormData('budget.total', parseFloat(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>
//         </div>
//     );

//     const renderTargeting = () => (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Min Age</label>
//                     <input
//                         type="number"
//                         min="13"
//                         max="100"
//                         value={formData.demographicTargeting.ageRange.min}
//                         onChange={(e) => updateFormData('demographicTargeting.ageRange.min', parseInt(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Max Age</label>
//                     <input
//                         type="number"
//                         min="13"
//                         max="100"
//                         value={formData.demographicTargeting.ageRange.max}
//                         onChange={(e) => updateFormData('demographicTargeting.ageRange.max', parseInt(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                     <select
//                         value={formData.demographicTargeting.gender}
//                         onChange={(e) => updateFormData('demographicTargeting.gender', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value="all">All</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
//                     <select
//                         value={formData.demographicTargeting.deviceType}
//                         onChange={(e) => updateFormData('demographicTargeting.deviceType', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value="all">All Devices</option>
//                         <option value="mobile">Mobile</option>
//                         <option value="tablet">Tablet</option>
//                         <option value="desktop">Desktop</option>
//                     </select>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderLocation = () => (
//         <div className="space-y-6">
//             <div className="flex items-center">
//                 <input
//                     type="checkbox"
//                     id="locationBased"
//                     checked={formData.locationTargeting.isLocationBased}
//                     onChange={(e) => updateFormData('locationTargeting.isLocationBased', e.target.checked)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="locationBased" className="text-sm font-medium text-gray-700">
//                     Enable Location-Based Targeting
//                 </label>
//             </div>

//             {formData.locationTargeting.isLocationBased && (
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.locationTargeting.center.latitude}
//                                 onChange={(e) => updateFormData('locationTargeting.center.latitude', parseFloat(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.locationTargeting.center.longitude}
//                                 onChange={(e) => updateFormData('locationTargeting.center.longitude', parseFloat(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Radius (km)</label>
//                             <input
//                                 type="number"
//                                 min="0.1"
//                                 max="1000"
//                                 step="0.1"
//                                 value={formData.locationTargeting.radius}
//                                 onChange={(e) => updateFormData('locationTargeting.radius', parseFloat(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const renderScheduling = () => (
//         <div className="space-y-6">
//             <div className="flex items-center">
//                 <input
//                     type="checkbox"
//                     id="scheduled"
//                     checked={formData.scheduling.isScheduled}
//                     onChange={(e) => updateFormData('scheduling.isScheduled', e.target.checked)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="scheduled" className="text-sm font-medium text-gray-700">
//                     Enable Scheduled Targeting
//                 </label>
//             </div>

//             {formData.scheduling.isScheduled && (
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//                             <input
//                                 type="datetime-local"
//                                 value={formData.scheduling.startDate}
//                                 onChange={(e) => updateFormData('scheduling.startDate', e.target.value)}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//                             <input
//                                 type="datetime-local"
//                                 value={formData.scheduling.endDate}
//                                 onChange={(e) => updateFormData('scheduling.endDate', e.target.value)}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Start Hour (0-23)</label>
//                             <input
//                                 type="number"
//                                 min="0"
//                                 max="23"
//                                 value={formData.scheduling.hourRange.start}
//                                 onChange={(e) => updateFormData('scheduling.hourRange.start', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">End Hour (0-23)</label>
//                             <input
//                                 type="number"
//                                 min="0"
//                                 max="23"
//                                 value={formData.scheduling.hourRange.end}
//                                 onChange={(e) => updateFormData('scheduling.hourRange.end', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const renderContent = () => {
//         switch (activeSection) {
//             case 'basic':
//                 return renderBasicInfo();
//             case 'targeting':
//                 return renderTargeting();
//             case 'location':
//                 return renderLocation();
//             case 'scheduling':
//                 return renderScheduling();
//             default:
//                 return renderBasicInfo();
//         }
//     };

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-900">
//                         {editingAd ? 'Edit Ad' : 'Create New Ad'}
//                     </h2>
//                     <p className="text-gray-600">
//                         {editingAd ? 'Update your advertising campaign' : 'Set up a new advertising campaign'}
//                     </p>
//                 </div>
//                 <div className="flex space-x-4">
//                     <button
//                         onClick={onCancel}
//                         className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSave}
//                         disabled={loading}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
//                     >
//                         <Save size={20} className="mr-2" />
//                         {loading ? 'Saving...' : 'Save Ad'}
//                     </button>
//                 </div>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6">
//                 {/* Section Navigation */}
//                 <div className="lg:w-64">
//                     <nav className="space-y-2">
//                         {sections.map((section) => {
//                             const Icon = section.icon;
//                             return (
//                                 <button
//                                     key={section.id}
//                                     onClick={() => setActiveSection(section.id)}
//                                     className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
//                                             ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                                             : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                                         }`}
//                                 >
//                                     <Icon size={20} className="mr-3" />
//                                     {section.name}
//                                 </button>
//                             );
//                         })}
//                     </nav>
//                 </div>

//                 {/* Form Content */}
//                 <div className="flex-1">
//                     <div className="bg-gray-50 rounded-xl p-6">
//                         {renderContent()}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateEditAd;

// import React, { useState, useEffect } from 'react';
// import { Save, X, MapPin, Calendar, Users, Settings } from 'lucide-react';

// const CreateEditAd = ({ base_url, getAuthConfig, editingAd, onSaveComplete, onCancel }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         header: '',
//         pagelink: '',
//         imagelinks: [''],
//         videoUrl: '',
//         contact: [''],
//         type: 'BANNER',
//         // BANNER fields
//         width: 728,
//         height: 90,
//         position: 'top',
//         // POPUP fields
//         delay: 5,
//         showOnAppOpen: false,
//         // INTERSTITIAL fields
//         fullscreen: true,
//         showFrequency: 1,
//         // VIDEO fields
//         duration: 30,
//         skippable: false,
//         skipAfter: 5,
//         locationTargeting: {
//             isLocationBased: false,
//             center: { latitude: 0, longitude: 0 },
//             radius: 10,
//             countries: [],
//             states: [],
//             cities: []
//         },
//         scheduling: {
//             isScheduled: false,
//             startDate: '',
//             endDate: '',
//             timezone: 'UTC',
//             daysOfWeek: [],
//             hourRange: { start: 0, end: 23 }
//         },
//         demographicTargeting: {
//             ageRange: { min: 18, max: 65 },
//             gender: 'all',
//             interests: [],
//             deviceType: 'all'
//         },
//         priority: 1,
//         isActive: true,
//         budget: {
//             daily: 0,
//             total: 0
//         }
//     });
//     const [loading, setLoading] = useState(false);
//     const [activeSection, setActiveSection] = useState('basic');

//     useEffect(() => {
//         if (editingAd) {
//             setFormData({
//                 ...editingAd,
//                 imagelinks: editingAd.imagelinks?.length > 0 ? editingAd.imagelinks : [''],
//                 contact: editingAd.contact?.length > 0 ? editingAd.contact : [''],
//                 // Ensure all type-specific fields are properly set
//                 type: editingAd.type || 'BANNER',
//                 width: editingAd.width || 728,
//                 height: editingAd.height || 90,
//                 position: editingAd.position || 'top',
//                 delay: editingAd.delay || 5,
//                 showOnAppOpen: editingAd.showOnAppOpen || false,
//                 fullscreen: editingAd.fullscreen !== undefined ? editingAd.fullscreen : true,
//                 showFrequency: editingAd.showFrequency || 1,
//                 duration: editingAd.duration || 30,
//                 skippable: editingAd.skippable || false,
//                 skipAfter: editingAd.skipAfter || 5,
//             });
//         }
//     }, [editingAd]);

//     const handleSave = async () => {
//         try {
//             setLoading(true);

//             // Validate required fields based on ad type
//             if (!formData.name.trim()) {
//                 alert('Ad name is required');
//                 return;
//             }

//             if (formData.type === 'BANNER' && (!formData.width || !formData.height)) {
//                 alert('Width and height are required for BANNER ads');
//                 return;
//             }

//             if (formData.type === 'POPUP' && !formData.delay) {
//                 alert('Delay is required for POPUP ads');
//                 return;
//             }

//             if (formData.type === 'VIDEO' && !formData.duration) {
//                 alert('Duration is required for VIDEO ads');
//                 return;
//             }

//             // Clean up data
//             const cleanData = {
//                 ...formData,
//                 imagelinks: formData.imagelinks.filter(link => link.trim() !== ''),
//                 contact: formData.contact.filter(contact => contact.trim() !== '')
//             };

//             const url = editingAd
//                 ? `${base_url}/api/ads/${editingAd.adId}`
//                 : `${base_url}/api/ads`;

//             const method = editingAd ? 'PUT' : 'POST';

//             const response = await fetch(url, {
//                 ...getAuthConfig(),
//                 method,
//                 headers: {
//                     ...getAuthConfig().headers,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(cleanData),
//             });

//             const result = await response.json();

//             if (response.ok && result.success) {
//                 onSaveComplete();
//             } else {
//                 alert(result.message || 'Failed to save ad');
//             }
//         } catch (error) {
//             console.error('Error saving ad:', error);
//             alert('Failed to save ad. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateFormData = (path, value) => {
//         setFormData(prev => {
//             const newData = { ...prev };
//             const keys = path.split('.');
//             let current = newData;

//             for (let i = 0; i < keys.length - 1; i++) {
//                 if (!current[keys[i]]) {
//                     current[keys[i]] = {};
//                 }
//                 current = current[keys[i]];
//             }

//             current[keys[keys.length - 1]] = value;
//             return newData;
//         });
//     };

//     const addArrayItem = (path, defaultValue = '') => {
//         const current = path.split('.').reduce((obj, key) => obj[key], formData);
//         updateFormData(path, [...current, defaultValue]);
//     };

//     const removeArrayItem = (path, index) => {
//         const current = path.split('.').reduce((obj, key) => obj[key], formData);
//         updateFormData(path, current.filter((_, i) => i !== index));
//     };

//     const updateArrayItem = (path, index, value) => {
//         const current = path.split('.').reduce((obj, key) => obj[key], formData);
//         const newArray = [...current];
//         newArray[index] = value;
//         updateFormData(path, newArray);
//     };

//     const sections = [
//         { id: 'basic', name: 'Basic Info', icon: Settings },
//         { id: 'targeting', name: 'Targeting', icon: Users },
//         { id: 'location', name: 'Location', icon: MapPin },
//         { id: 'scheduling', name: 'Scheduling', icon: Calendar },
//     ];

//     const renderBasicInfo = () => (
//         <div className="space-y-6">
//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Ad Name *</label>
//                 <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => updateFormData('name', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                 />
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                 <textarea
//                     value={formData.description}
//                     onChange={(e) => updateFormData('description', e.target.value)}
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
//                     <input
//                         type="text"
//                         value={formData.header}
//                         onChange={(e) => updateFormData('header', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Page Link</label>
//                     <input
//                         type="url"
//                         value={formData.pagelink}
//                         onChange={(e) => updateFormData('pagelink', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type</label>
//                 <select
//                     value={formData.type}
//                     onChange={(e) => updateFormData('type', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                     <option value="BANNER">Banner</option>
//                     <option value="POPUP">Popup</option>
//                     <option value="INTERSTITIAL">Interstitial</option>
//                     <option value="NATIVE">Native</option>
//                     <option value="VIDEO">Video</option>
//                 </select>
//             </div>

//             {/* Type-specific fields */}
//             {formData.type === 'BANNER' && (
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-medium text-gray-900 mb-3">Banner Settings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Width (px) *</label>
//                             <input
//                                 type="number"
//                                 value={formData.width}
//                                 onChange={(e) => updateFormData('width', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Height (px) *</label>
//                             <input
//                                 type="number"
//                                 value={formData.height}
//                                 onChange={(e) => updateFormData('height', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
//                             <select
//                                 value={formData.position}
//                                 onChange={(e) => updateFormData('position', e.target.value)}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="top">Top</option>
//                                 <option value="bottom">Bottom</option>
//                                 <option value="middle">Middle</option>
//                                 <option value="floating">Floating</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {formData.type === 'POPUP' && (
//                 <div className="bg-purple-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-medium text-gray-900 mb-3">Popup Settings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds) *</label>
//                             <input
//                                 type="number"
//                                 min="0"
//                                 value={formData.delay}
//                                 onChange={(e) => updateFormData('delay', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 required
//                             />
//                         </div>
//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id="showOnAppOpen"
//                                 checked={formData.showOnAppOpen}
//                                 onChange={(e) => updateFormData('showOnAppOpen', e.target.checked)}
//                                 className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="showOnAppOpen" className="text-sm font-medium text-gray-700">
//                                 Show on App Open
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {formData.type === 'INTERSTITIAL' && (
//                 <div className="bg-orange-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-medium text-gray-900 mb-3">Interstitial Settings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id="fullscreen"
//                                 checked={formData.fullscreen}
//                                 onChange={(e) => updateFormData('fullscreen', e.target.checked)}
//                                 className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="fullscreen" className="text-sm font-medium text-gray-700">
//                                 Fullscreen
//                             </label>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Show Frequency</label>
//                             <input
//                                 type="number"
//                                 min="1"
//                                 value={formData.showFrequency}
//                                 onChange={(e) => updateFormData('showFrequency', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {formData.type === 'VIDEO' && (
//                 <div className="bg-red-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-medium text-gray-900 mb-3">Video Settings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds) *</label>
//                             <input
//                                 type="number"
//                                 min="1"
//                                 value={formData.duration}
//                                 onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 required
//                             />
//                         </div>
//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id="skippable"
//                                 checked={formData.skippable}
//                                 onChange={(e) => updateFormData('skippable', e.target.checked)}
//                                 className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="skippable" className="text-sm font-medium text-gray-700">
//                                 Skippable
//                             </label>
//                         </div>
//                         {formData.skippable && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Skip After (seconds)</label>
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     value={formData.skipAfter}
//                                     onChange={(e) => updateFormData('skipAfter', parseInt(e.target.value))}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
//                         <input
//                             type="url"
//                             value={formData.videoUrl}
//                             onChange={(e) => updateFormData('videoUrl', e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter video URL"
//                         />
//                     </div>
//                 </div>
//             )}

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Image Links</label>
//                 {formData.imagelinks.map((link, index) => (
//                     <div key={index} className="flex items-center space-x-2 mb-2">
//                         <input
//                             type="url"
//                             value={link}
//                             onChange={(e) => updateArrayItem('imagelinks', index, e.target.value)}
//                             placeholder="Enter image URL"
//                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => removeArrayItem('imagelinks', index)}
//                             className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 ))}
//                 <button
//                     type="button"
//                     onClick={() => addArrayItem('imagelinks')}
//                     className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                 >
//                     + Add Image Link
//                 </button>
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
//                 {formData.contact.map((contact, index) => (
//                     <div key={index} className="flex items-center space-x-2 mb-2">
//                         <input
//                             type="text"
//                             value={contact}
//                             onChange={(e) => updateArrayItem('contact', index, e.target.value)}
//                             placeholder="Enter contact info"
//                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => removeArrayItem('contact', index)}
//                             className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>
//                 ))}
//                 <button
//                     type="button"
//                     onClick={() => addArrayItem('contact')}
//                     className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                 >
//                     + Add Contact
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
//                     <input
//                         type="number"
//                         min="1"
//                         max="10"
//                         value={formData.priority}
//                         onChange={(e) => updateFormData('priority', parseInt(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                     <select
//                         value={formData.isActive}
//                         onChange={(e) => updateFormData('isActive', e.target.value === 'true')}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value={true}>Active</option>
//                         <option value={false}>Inactive</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget ($)</label>
//                     <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={formData.budget.daily}
//                         onChange={(e) => updateFormData('budget.daily', parseFloat(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
//                     <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={formData.budget.total}
//                         onChange={(e) => updateFormData('budget.total', parseFloat(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>
//         </div>
//     );

//     const renderTargeting = () => (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Min Age</label>
//                     <input
//                         type="number"
//                         min="13"
//                         max="100"
//                         value={formData.demographicTargeting.ageRange.min}
//                         onChange={(e) => updateFormData('demographicTargeting.ageRange.min', parseInt(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Max Age</label>
//                     <input
//                         type="number"
//                         min="13"
//                         max="100"
//                         value={formData.demographicTargeting.ageRange.max}
//                         onChange={(e) => updateFormData('demographicTargeting.ageRange.max', parseInt(e.target.value))}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                     <select
//                         value={formData.demographicTargeting.gender}
//                         onChange={(e) => updateFormData('demographicTargeting.gender', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value="all">All</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
//                     <select
//                         value={formData.demographicTargeting.deviceType}
//                         onChange={(e) => updateFormData('demographicTargeting.deviceType', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         <option value="all">All Devices</option>
//                         <option value="mobile">Mobile</option>
//                         <option value="tablet">Tablet</option>
//                         <option value="desktop">Desktop</option>
//                     </select>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderLocation = () => (
//         <div className="space-y-6">
//             <div className="flex items-center">
//                 <input
//                     type="checkbox"
//                     id="locationBased"
//                     checked={formData.locationTargeting.isLocationBased}
//                     onChange={(e) => updateFormData('locationTargeting.isLocationBased', e.target.checked)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="locationBased" className="text-sm font-medium text-gray-700">
//                     Enable Location-Based Targeting
//                 </label>
//             </div>

//             {formData.locationTargeting.isLocationBased && (
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.locationTargeting.center.latitude}
//                                 onChange={(e) => updateFormData('locationTargeting.center.latitude', parseFloat(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.locationTargeting.center.longitude}
//                                 onChange={(e) => updateFormData('locationTargeting.center.longitude', parseFloat(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Radius (km)</label>
//                             <input
//                                 type="number"
//                                 min="0.1"
//                                 max="1000"
//                                 step="0.1"
//                                 value={formData.locationTargeting.radius}
//                                 onChange={(e) => updateFormData('locationTargeting.radius', parseFloat(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const renderScheduling = () => (
//         <div className="space-y-6">
//             <div className="flex items-center">
//                 <input
//                     type="checkbox"
//                     id="scheduled"
//                     checked={formData.scheduling.isScheduled}
//                     onChange={(e) => updateFormData('scheduling.isScheduled', e.target.checked)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="scheduled" className="text-sm font-medium text-gray-700">
//                     Enable Scheduled Targeting
//                 </label>
//             </div>

//             {formData.scheduling.isScheduled && (
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//                             <input
//                                 type="datetime-local"
//                                 value={formData.scheduling.startDate}
//                                 onChange={(e) => updateFormData('scheduling.startDate', e.target.value)}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//                             <input
//                                 type="datetime-local"
//                                 value={formData.scheduling.endDate}
//                                 onChange={(e) => updateFormData('scheduling.endDate', e.target.value)}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Start Hour (0-23)</label>
//                             <input
//                                 type="number"
//                                 min="0"
//                                 max="23"
//                                 value={formData.scheduling.hourRange.start}
//                                 onChange={(e) => updateFormData('scheduling.hourRange.start', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">End Hour (0-23)</label>
//                             <input
//                                 type="number"
//                                 min="0"
//                                 max="23"
//                                 value={formData.scheduling.hourRange.end}
//                                 onChange={(e) => updateFormData('scheduling.hourRange.end', parseInt(e.target.value))}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const renderContent = () => {
//         switch (activeSection) {
//             case 'basic':
//                 return renderBasicInfo();
//             case 'targeting':
//                 return renderTargeting();
//             case 'location':
//                 return renderLocation();
//             case 'scheduling':
//                 return renderScheduling();
//             default:
//                 return renderBasicInfo();
//         }
//     };

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-900">
//                         {editingAd ? 'Edit Ad' : 'Create New Ad'}
//                     </h2>
//                     <p className="text-gray-600">
//                         {editingAd ? 'Update your advertising campaign' : 'Set up a new advertising campaign'}
//                     </p>
//                 </div>
//                 <div className="flex space-x-4">
//                     <button
//                         onClick={onCancel}
//                         className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSave}
//                         disabled={loading}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
//                     >
//                         <Save size={20} className="mr-2" />
//                         {loading ? 'Saving...' : 'Save Ad'}
//                     </button>
//                 </div>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6">
//                 {/* Section Navigation */}
//                 <div className="lg:w-64">
//                     <nav className="space-y-2">
//                         {sections.map((section) => {
//                             const Icon = section.icon;
//                             return (
//                                 <button
//                                     key={section.id}
//                                     onClick={() => setActiveSection(section.id)}
//                                     className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
//                                         ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                                         }`}
//                                 >
//                                     <Icon size={20} className="mr-3" />
//                                     {section.name}
//                                 </button>
//                             );
//                         })}
//                     </nav>
//                 </div>

//                 {/* Form Content */}
//                 <div className="flex-1">
//                     <div className="bg-gray-50 rounded-xl p-6">
//                         {renderContent()}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateEditAd;

import React, { useState, useEffect } from 'react';
import { Save, X, MapPin, Calendar, Users, Settings } from 'lucide-react';

const CreateEditAd = ({ base_url, getAuthConfig, editingAd, onSaveComplete, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        header: '',
        pagelink: '',
        imagelinks: [''],
        videoUrl: '',
        contact: [''],
        type: 'BANNER',
        // BANNER fields
        width: 728,
        height: 90,
        position: 'top',
        // POPUP fields
        delay: 5,
        showOnAppOpen: false,
        // INTERSTITIAL fields
        fullscreen: true,
        showFrequency: 1,
        // VIDEO fields
        duration: 30,
        skippable: false,
        skipAfter: 5,
        locationTargeting: {
            isLocationBased: false,
            center: { latitude: 0, longitude: 0 },
            radius: 10,
            countries: [],
            states: [],
            cities: []
        },
        scheduling: {
            isScheduled: false,
            startDate: '',
            endDate: '',
            timezone: 'UTC',
            daysOfWeek: [],
            hourRange: { start: 0, end: 23 }
        },
        demographicTargeting: {
            ageRange: { min: 18, max: 65 },
            gender: 'all',
            interests: [],
            deviceType: 'all'
        },
        priority: 1,
        isActive: true,
        budget: {
            daily: 0,
            total: 0
        }
    });

    console.log("formdata" , formData)
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    useEffect(() => {
        if (editingAd) {
            setFormData({
                ...editingAd,
                imagelinks: editingAd.imagelinks?.length > 0 ? editingAd.imagelinks : [''],
                contact: editingAd.contact?.length > 0 ? editingAd.contact : [''],
                // Ensure all type-specific fields are properly set
                type: editingAd.type || 'BANNER',
                width: editingAd.width || 728,
                height: editingAd.height || 90,
                position: editingAd.position || 'top',
                delay: editingAd.delay || 5,
                showOnAppOpen: editingAd.showOnAppOpen || false,
                fullscreen: editingAd.fullscreen !== undefined ? editingAd.fullscreen : true,
                showFrequency: editingAd.showFrequency || 1,
                duration: editingAd.duration || 30,
                skippable: editingAd.skippable || false,
                skipAfter: editingAd.skipAfter || 5,
            });
        }
    }, [editingAd]);

    const handleSave = async () => {
        try {
            setLoading(true);

            // Validate required fields based on ad type
            if (!formData.name.trim()) {
                alert('Ad name is required');
                return;
            }

            // Type-specific validation
            if (formData.type === 'BANNER') {
                if (!formData.width || !formData.height) {
                    alert('Width and height are required for BANNER ads');
                    return;
                }
            }

            if (formData.type === 'POPUP') {
                if (!formData.delay || formData.delay <= 0) {
                    alert('Delay is required for POPUP ads and must be greater than 0');
                    return;
                }
            }

            if (formData.type === 'INTERSTITIAL') {
                if (!formData.showFrequency || formData.showFrequency <= 0) {
                    alert('Show frequency is required for INTERSTITIAL ads');
                    return;
                }
            }

            if (formData.type === 'VIDEO') {
                if (!formData.duration || formData.duration <= 0) {
                    alert('Duration is required for VIDEO ads and must be greater than 0');
                    return;
                }
            }

            // Clean up data
            const cleanData = {
                ...formData,
                imagelinks: formData.imagelinks.filter(link => link.trim() !== ''),
                contact: formData.contact.filter(contact => contact.trim() !== '')
            };

            const url = editingAd
                ? `${base_url}/api/ads/${editingAd.adId}`
                : `${base_url}/api/ads`;

            const method = editingAd ? 'PUT' : 'POST';

            const response = await fetch(url, {
                ...getAuthConfig(),
                method,
                headers: {
                    ...getAuthConfig().headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                onSaveComplete();
            } else {
                alert(result.message || 'Failed to save ad');
            }
        } catch (error) {
            console.error('Error saving ad:', error);
            alert('Failed to save ad. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const addArrayItem = (path, defaultValue = '') => {
        const current = path.split('.').reduce((obj, key) => obj[key], formData);
        updateFormData(path, [...current, defaultValue]);
    };

    const removeArrayItem = (path, index) => {
        const current = path.split('.').reduce((obj, key) => obj[key], formData);
        updateFormData(path, current.filter((_, i) => i !== index));
    };

    const updateArrayItem = (path, index, value) => {
        const current = path.split('.').reduce((obj, key) => obj[key], formData);
        const newArray = [...current];
        newArray[index] = value;
        updateFormData(path, newArray);
    };

    const sections = [
        { id: 'basic', name: 'Basic Info', icon: Settings },
        { id: 'targeting', name: 'Targeting', icon: Users },
        { id: 'location', name: 'Location', icon: MapPin },
        { id: 'scheduling', name: 'Scheduling', icon: Calendar },
    ];

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Name *</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
                    <input
                        type="text"
                        value={formData.header}
                        onChange={(e) => updateFormData('header', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Link</label>
                    <input
                        type="url"
                        value={formData.pagelink}
                        onChange={(e) => updateFormData('pagelink', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type</label>
                <select
                    value={formData.type}
                    onChange={(e) => updateFormData('type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="BANNER">Banner</option>
                    <option value="POPUP">Popup</option>
                    <option value="INTERSTITIAL">Interstitial</option>
                    <option value="NATIVE">Native</option>
                    <option value="VIDEO">Video</option>
                </select>
            </div>

            {/* Type-specific fields */}
            {formData.type === 'BANNER' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Banner Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Width (px) *</label>
                            <input
                                type="number"
                                value={formData.width}
                                onChange={(e) => updateFormData('width', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height (px) *</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => updateFormData('height', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <select
                                value={formData.position}
                                onChange={(e) => updateFormData('position', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="middle">Middle</option>
                                <option value="floating">Floating</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {formData.type === 'POPUP' && (
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Popup Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds) *</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.delay}
                                onChange={(e) => updateFormData('delay', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="showOnAppOpen"
                                checked={formData.showOnAppOpen}
                                onChange={(e) => updateFormData('showOnAppOpen', e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showOnAppOpen" className="text-sm font-medium text-gray-700">
                                Show on App Open
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {formData.type === 'INTERSTITIAL' && (
                <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Interstitial Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="fullscreen"
                                checked={formData.fullscreen}
                                onChange={(e) => updateFormData('fullscreen', e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="fullscreen" className="text-sm font-medium text-gray-700">
                                Fullscreen
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Show Frequency</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.showFrequency}
                                onChange={(e) => updateFormData('showFrequency', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}

            {formData.type === 'VIDEO' && (
                <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Video Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds) *</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.duration}
                                onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="skippable"
                                checked={formData.skippable}
                                onChange={(e) => updateFormData('skippable', e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="skippable" className="text-sm font-medium text-gray-700">
                                Skippable
                            </label>
                        </div>
                        {formData.skippable && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skip After (seconds)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.skipAfter}
                                    onChange={(e) => updateFormData('skipAfter', parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                        <input
                            type="url"
                            value={formData.videoUrl}
                            onChange={(e) => updateFormData('videoUrl', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter video URL"
                        />
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Links</label>
                {formData.imagelinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => updateArrayItem('imagelinks', index, e.target.value)}
                            placeholder="Enter image URL"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('imagelinks', index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('imagelinks')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    + Add Image Link
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                {formData.contact.map((contact, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => updateArrayItem('contact', index, e.target.value)}
                            placeholder="Enter contact info"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('contact', index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('contact')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    + Add Contact
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => updateFormData('priority', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        value={formData.isActive}
                        onChange={(e) => updateFormData('isActive', e.target.value === 'true')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.budget.daily}
                        onChange={(e) => updateFormData('budget.daily', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.budget.total}
                        onChange={(e) => updateFormData('budget.total', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    const renderTargeting = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Age</label>
                    <input
                        type="number"
                        min="13"
                        max="100"
                        value={formData.demographicTargeting.ageRange.min}
                        onChange={(e) => updateFormData('demographicTargeting.ageRange.min', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Age</label>
                    <input
                        type="number"
                        min="13"
                        max="100"
                        value={formData.demographicTargeting.ageRange.max}
                        onChange={(e) => updateFormData('demographicTargeting.ageRange.max', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                        value={formData.demographicTargeting.gender}
                        onChange={(e) => updateFormData('demographicTargeting.gender', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                    <select
                        value={formData.demographicTargeting.deviceType}
                        onChange={(e) => updateFormData('demographicTargeting.deviceType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Devices</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                        <option value="desktop">Desktop</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderLocation = () => (
        <div className="space-y-6">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="locationBased"
                    checked={formData.locationTargeting.isLocationBased}
                    onChange={(e) => updateFormData('locationTargeting.isLocationBased', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="locationBased" className="text-sm font-medium text-gray-700">
                    Enable Location-Based Targeting
                </label>
            </div>

            {formData.locationTargeting.isLocationBased && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.locationTargeting.center.latitude}
                                onChange={(e) => updateFormData('locationTargeting.center.latitude', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.locationTargeting.center.longitude}
                                onChange={(e) => updateFormData('locationTargeting.center.longitude', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Radius (km)</label>
                            <input
                                type="number"
                                min="0.1"
                                max="1000"
                                step="0.1"
                                value={formData.locationTargeting.radius}
                                onChange={(e) => updateFormData('locationTargeting.radius', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderScheduling = () => (
        <div className="space-y-6">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="scheduled"
                    checked={formData.scheduling.isScheduled}
                    onChange={(e) => updateFormData('scheduling.isScheduled', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="scheduled" className="text-sm font-medium text-gray-700">
                    Enable Scheduled Targeting
                </label>
            </div>

            {formData.scheduling.isScheduled && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="datetime-local"
                                value={formData.scheduling.startDate}
                                onChange={(e) => updateFormData('scheduling.startDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="datetime-local"
                                value={formData.scheduling.endDate}
                                onChange={(e) => updateFormData('scheduling.endDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Hour (0-23)</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={formData.scheduling.hourRange.start}
                                onChange={(e) => updateFormData('scheduling.hourRange.start', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Hour (0-23)</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={formData.scheduling.hourRange.end}
                                onChange={(e) => updateFormData('scheduling.hourRange.end', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'basic':
                return renderBasicInfo();
            case 'targeting':
                return renderTargeting();
            case 'location':
                return renderLocation();
            case 'scheduling':
                return renderScheduling();
            default:
                return renderBasicInfo();
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingAd ? 'Edit Ad' : 'Create New Ad'}
                    </h2>
                    <p className="text-gray-600">
                        {editingAd ? 'Update your advertising campaign' : 'Set up a new advertising campaign'}
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Ad'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Section Navigation */}
                <div className="lg:w-64">
                    <nav className="space-y-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} className="mr-3" />
                                    {section.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEditAd;