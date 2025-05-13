// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import Alert from './Alert';
// import { base_url } from '../../../utils/base_url';

// const ScheduleForm = ({ onClose, onSave, templates }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         templateId: '',
//         schedule: '',
//         time: '',
//         recipients: 'all',
//         filterCriteria: {},
//         active: true
//     });

//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState(null);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setSaving(true);
//             setError(null);

//             const response = await fetch(`${base_url}/api/notifications/admin/schedules`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             const data = await response.json();

//             if (data.success) {
//                 onSave(data.schedule);
//             } else {
//                 setError(data.message || 'Failed to create schedule');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Failed to create schedule:', err);
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <div className="p-4 border-b flex justify-between items-center">
//                     <h2 className="text-xl font-semibold">Create New Schedule</h2>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="p-4">
//                     {error && (
//                         <Alert
//                             title="Error"
//                             description={error}
//                             variant="error"
//                         />
//                     )}

//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name*</label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                 required
//                                 placeholder="e.g., Daily Price Alerts"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Template*</label>
//                             <select
//                                 name="templateId"
//                                 value={formData.templateId}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                 required
//                             >
//                                 <option value="">Select a template</option>
//                                 {templates.map(template => (
//                                     <option key={template._id} value={template._id}>
//                                         {template.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Type*</label>
//                             <select
//                                 name="schedule"
//                                 value={formData.schedule}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                 required
//                             >
//                                 <option value="">Select schedule type</option>
//                                 <option value="daily">Daily</option>
//                                 <option value="weekly">Weekly</option>
//                                 <option value="monthly">Monthly</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
//                             <input
//                                 type="time"
//                                 name="time"
//                                 value={formData.time}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Recipients*</label>
//                             <select
//                                 name="recipients"
//                                 value={formData.recipients}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//                                 required
//                             >
//                                 <option value="all">All Users</option>
//                                 <option value="active">Active Users</option>
//                                 <option value="filtered">Filtered Users</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="active"
//                                     checked={formData.active}
//                                     onChange={handleChange}
//                                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                                 />
//                                 <span className="text-sm font-medium text-gray-700">Active</span>
//                             </label>
//                         </div>
//                     </div>

//                     <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border rounded hover:bg-gray-50 transition"
//                             disabled={saving}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 transition"
//                             disabled={saving}
//                         >
//                             {saving ? 'Creating...' : 'Create Schedule'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ScheduleForm;


import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Alert from './Alert';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const ScheduleForm = ({ onClose, onSave, templates }) => {
    const [formData, setFormData] = useState({
        name: '',
        templateId: '',
        schedule: '',
        time: '',
        recipients: 'all',
        filterCriteria: {},
        active: true
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // For additional filter options if "filtered" is selected
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [locationFilter, setLocationFilter] = useState('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState('');

    useEffect(() => {
        setShowFilterOptions(formData.recipients === 'filtered');
    }, [formData.recipients]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFilterChange = () => {
        // Update filter criteria based on input fields
        const newFilterCriteria = {};

        if (locationFilter) {
            newFilterCriteria['preferences.locations'] = locationFilter;
        }

        if (propertyTypeFilter) {
            newFilterCriteria['preferences.propertyTypes'] = propertyTypeFilter;
        }

        setFormData(prev => ({
            ...prev,
            filterCriteria: newFilterCriteria
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            // Update filter criteria before submission
            if (formData.recipients === 'filtered') {
                handleFilterChange();
            }

            const response = await axios.post(
                `${base_url}/api/notifications/admin/schedules`,
                formData, // Axios handles JSON.stringify automatically
                getAuthConfig()
            );

            // const data = await response.json();

            if (response.success) {
                onSave(data.schedule);
            } else {
                setError(data.message || 'Failed to create schedule');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Failed to create schedule:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create New Schedule</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <Alert
                            title="Error"
                            description={error}
                            variant="error"
                        />
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                required
                                placeholder="e.g., Daily Price Alerts"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Template*</label>
                            <select
                                name="templateId"
                                value={formData.templateId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                required
                            >
                                <option value="">Select a template</option>
                                {templates.map(template => (
                                    <option key={template._id} value={template._id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Choose the notification template to use for this schedule
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Type*</label>
                            <select
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                required
                            >
                                <option value="">Select schedule type</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly (Mondays)</option>
                                <option value="monthly">Monthly (1st of month)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                24-hour format (HH:MM)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients*</label>
                            <select
                                name="recipients"
                                value={formData.recipients}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                                required
                            >
                                <option value="all">All Users</option>
                                <option value="active">Active Users (active in last 14 days)</option>
                                <option value="filtered">Filtered Users</option>
                            </select>
                        </div>

                        {showFilterOptions && (
                            <div className="space-y-3 p-3 border rounded bg-gray-50">
                                <h3 className="font-medium text-gray-700">Filter Options</h3>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={locationFilter}
                                        onChange={(e) => {
                                            setLocationFilter(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="w-full p-2 border rounded"
                                        placeholder="e.g., Delhi, Mumbai"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Property Type</label>
                                    <input
                                        type="text"
                                        value={propertyTypeFilter}
                                        onChange={(e) => {
                                            setPropertyTypeFilter(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="w-full p-2 border rounded"
                                        placeholder="e.g., Apartment, Villa"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                If checked, the schedule will be active immediately
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 transition"
                            disabled={saving}
                        >
                            {saving ? 'Creating...' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleForm;