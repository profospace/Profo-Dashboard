// // AdminSalesmanPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';


// const AdminSalesmanPage = () => {
//     const [salesmen, setSalesmen] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [resetLoading, setResetLoading] = useState(null);
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');

//     // Fetch all salesmen
//     const fetchSalesmen = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`${base_url}/api/adminSales/all`, getAuthConfig());
//             setSalesmen(res.data.data);
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.message || 'Failed to fetch salesmen');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSalesmen();
//     }, []);

//     // Handle password reset
//     const handleResetPassword = async (salesmanId) => {
//         try {
//             setResetLoading(salesmanId);
//             setMessage('');
//             await axios.post(
//                 `${base_url}/api/adminSales/reset-password/${salesmanId}`,
//                 {},
//                 getAuthConfig()
//             );
//             setMessage('Password reset successfully! The salesman will receive an email with the new password.');
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.message || 'Failed to reset password');
//         } finally {
//             setResetLoading(null);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-2xl font-bold mb-4">Salesmen Management</h1>

//             {loading ? (
//                 <p>Loading salesmen...</p>
//             ) : error ? (
//                 <p className="text-red-500">{error}</p>
//             ) : (
//                 <div className="overflow-x-auto bg-white shadow rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {salesmen.map((s) => (
//                                 <tr key={s._id}>
//                                     <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{s.phone || '-'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{s.role}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{s.status}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                                         <button
//                                             onClick={() => handleResetPassword(s._id)}
//                                             disabled={resetLoading === s._id}
//                                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                                         >
//                                             {resetLoading === s._id ? 'Resetting...' : 'Reset Password'}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {message && (
//                 <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
//                     {message}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminSalesmanPage;


// AdminSalesmanPage.jsx - Complete Updated Code
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const AdminSalesmanPage = () => {
    const [salesmen, setSalesmen] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'salesman',
        assignedAreas: []
    });
    const [areaInput, setAreaInput] = useState({ city: '', localities: '' });

    // Fetch all salesmen
    const fetchSalesmen = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/adminSales/all`, getAuthConfig());
            setSalesmen(res.data.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to fetch salesmen');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesmen();
    }, []);

    // Handle password reset
    const handleResetPassword = async (salesmanId) => {
        try {
            setResetLoading(salesmanId);
            setMessage('');
            setError('');
            await axios.post(
                `${base_url}/api/adminSales/reset-password/${salesmanId}`,
                {},
                getAuthConfig()
            );
            setMessage('Password reset successfully! The salesman will receive an email with the new password.');
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to reset password');
            setTimeout(() => setError(''), 5000);
        } finally {
            setResetLoading(null);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle area input changes
    const handleAreaInputChange = (e) => {
        const { name, value } = e.target;
        setAreaInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add area to assignedAreas
    const handleAddArea = () => {
        if (areaInput.city.trim()) {
            const localities = areaInput.localities
                .split(',')
                .map(l => l.trim())
                .filter(l => l !== '');

            setFormData(prev => ({
                ...prev,
                assignedAreas: [
                    ...prev.assignedAreas,
                    {
                        city: areaInput.city.trim(),
                        localities: localities.length > 0 ? localities : []
                    }
                ]
            }));
            setAreaInput({ city: '', localities: '' });
        }
    };

    // Remove area from assignedAreas
    const handleRemoveArea = (index) => {
        setFormData(prev => ({
            ...prev,
            assignedAreas: prev.assignedAreas.filter((_, i) => i !== index)
        }));
    };

    // Handle create salesman
    const handleCreateSalesman = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Name and email are required');
            return;
        }

        try {
            setCreateLoading(true);
            setError('');
            setMessage('');

            const res = await axios.post(
                `${base_url}/api/adminSales/create`,
                formData,
                getAuthConfig()
            );

            setMessage(res.data.message || 'Salesman created successfully!');

            // Reset form and close modal
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'salesman',
                assignedAreas: []
            });
            setIsModalOpen(false);

            // Refresh salesmen list
            fetchSalesmen();

            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create salesman');
            setTimeout(() => setError(''), 5000);
        } finally {
            setCreateLoading(false);
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'salesman',
            assignedAreas: []
        });
        setAreaInput({ city: '', localities: '' });
        setError('');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Salesmen Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                    + Create Salesman
                </button>
            </div>

            {loading ? (
                <p>Loading salesmen...</p>
            ) : error && !isModalOpen ? (
                <p className="text-red-500 mb-4">{error}</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salesmen.map((s) => (
                                <tr key={s._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{s.phone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded ${s.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                s.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {s.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded ${s.status === 'active' ? 'bg-green-100 text-green-800' :
                                                s.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleResetPassword(s._id)}
                                            disabled={resetLoading === s._id}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {resetLoading === s._id ? 'Resetting...' : 'Reset Password'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {message && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
                    {message}
                </div>
            )}

            {/* Create Salesman Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Create New Salesman</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                disabled={createLoading}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateSalesman} className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={createLoading}
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={createLoading}
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={createLoading}
                                    />
                                </div>

                                {/* Role Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={createLoading}
                                    >
                                        <option value="salesman">Salesman</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>

                                {/* Assigned Areas Section */}
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assigned Areas
                                    </label>

                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            name="city"
                                            value={areaInput.city}
                                            onChange={handleAreaInputChange}
                                            placeholder="City"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={createLoading}
                                        />
                                        <input
                                            type="text"
                                            name="localities"
                                            value={areaInput.localities}
                                            onChange={handleAreaInputChange}
                                            placeholder="Localities (comma-separated)"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={createLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddArea}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
                                            disabled={createLoading || !areaInput.city.trim()}
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {formData.assignedAreas.length > 0 && (
                                        <div className="space-y-2">
                                            {formData.assignedAreas.map((area, index) => (
                                                <div key={index} className="flex items-start justify-between bg-gray-50 p-3 rounded">
                                                    <div>
                                                        <p className="font-medium">{area.city}</p>
                                                        {area.localities.length > 0 && (
                                                            <p className="text-sm text-gray-600">
                                                                {area.localities.join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveArea(index)}
                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                        disabled={createLoading}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                    disabled={createLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={createLoading}
                                >
                                    {createLoading ? 'Creating...' : 'Create Salesman'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSalesmanPage;