// AdminSalesmanPage.jsx
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

    // Fetch all salesmen
    const fetchSalesmen = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/api/adminSales/all`, getAuthConfig());
            setSalesmen(res.data.data);
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
            await axios.post(
                `${base_url}/api/adminSales/reset-password/${salesmanId}`,
                {},
                getAuthConfig()
            );
            setMessage('Password reset successfully! The salesman will receive an email with the new password.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setResetLoading(null);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Salesmen Management</h1>

            {loading ? (
                <p>Loading salesmen...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
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
                                    <td className="px-6 py-4 whitespace-nowrap">{s.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{s.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleResetPassword(s._id)}
                                            disabled={resetLoading === s._id}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
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
        </div>
    );
};

export default AdminSalesmanPage;
