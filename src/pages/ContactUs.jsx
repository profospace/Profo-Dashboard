import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaTrash, FaPhone, FaEnvelope, FaUser, FaComment, FaCalendar, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { base_url } from "../../utils/base_url";
 

function ContactUs() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        count: 0,
        totalRecords: 0,
    });
    const [filters, setFilters] = useState({
        status: "",
        page: 1,
        limit: 10,
    });

    useEffect(() => {
        fetchContacts();
    }, [filters]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(`${base_url}/api/contact/all`, {
                params: filters,
                headers,
            });

            if (response.data.success) {
                setContacts(response.data.data);
                setPagination(response.data.pagination);
            } else {
                toast.error("Failed to fetch contacts");
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error(
                error.response?.data?.message || "Failed to fetch contacts"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("profo-auth-token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.patch(
                `${base_url}/api/contact/${id}/status`,
                { status: newStatus },
                { headers }
            );

            if (response.data.success) {
                toast.success("Status updated successfully");
                fetchContacts();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(
                error.response?.data?.message || "Failed to update status"
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) {
            return;
        }

        try {
            const token = localStorage.getItem("profo-auth-token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.delete(`${base_url}/api/contact/${id}`, {
                headers,
            });

            if (response.data.success) {
                toast.success("Contact deleted successfully");
                fetchContacts();
            } else {
                toast.error("Failed to delete contact");
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete contact"
            );
        }
    };

    const handleViewDetails = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: key === "status" || key === "limit" ? 1 : prev.page,
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                icon: <FaClock className="inline mr-1" size={12} />,
            },
            contacted: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                icon: <FaCheckCircle className="inline mr-1" size={12} />,
            },
            resolved: {
                bg: "bg-green-100",
                text: "text-green-800",
                icon: <FaCheckCircle className="inline mr-1" size={12} />,
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
            >
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Contact Enquiries
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Total: {pagination.totalRecords} contacts
                            </p>
                        </div>
                        <button
                            onClick={fetchContacts}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            disabled={loading}
                        >
                            <MdRefresh size={20} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Items per page
                            </label>
                            <select
                                value={filters.limit}
                                onChange={(e) =>
                                    handleFilterChange("limit", parseInt(e.target.value))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="text-center py-20">
                            <FaTimesCircle className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600 text-lg">No contacts found</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {contacts.map((contact) => (
                                            <tr
                                                key={contact._id}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <FaUser className="text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {contact.name || "Anonymous"}
                                                            </div>
                                                            {contact.isAuthenticated && (
                                                                <div className="text-xs text-green-600">
                                                                    Verified User
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                                        <FaPhone size={12} className="text-gray-500" />
                                                        {contact.mobile}
                                                    </div>
                                                    {contact.email && (
                                                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                            <FaEnvelope size={12} className="text-gray-500" />
                                                            {contact.email}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={contact.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(contact._id, e.target.value)
                                                        }
                                                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="resolved">Resolved</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                                        <FaCalendar size={12} className="text-gray-500" />
                                                        {formatDate(contact.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(contact)}
                                                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                            title="View Details"
                                                        >
                                                            <FaEye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(contact._id)}
                                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                            title="Delete"
                                                        >
                                                            <FaTrash size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <div key={contact._id} className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaUser className="text-blue-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {contact.name || "Anonymous"}
                                                    </div>
                                                    {contact.isAuthenticated && (
                                                        <div className="text-xs text-green-600">
                                                            Verified User
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {getStatusBadge(contact.status)}
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <div className="text-sm text-gray-900 flex items-center gap-2">
                                                <FaPhone size={12} className="text-gray-500" />
                                                {contact.mobile}
                                            </div>
                                            {contact.email && (
                                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                                    <FaEnvelope size={12} className="text-gray-500" />
                                                    {contact.email}
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                                <FaCalendar size={12} className="text-gray-500" />
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={contact.status}
                                                onChange={(e) =>
                                                    handleStatusChange(contact._id, e.target.value)
                                                }
                                                className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <button
                                                onClick={() => handleViewDetails(contact)}
                                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing{" "}
                                        <span className="font-semibold">
                                            {(pagination.current - 1) * filters.limit + 1}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-semibold">
                                            {Math.min(
                                                pagination.current * filters.limit,
                                                pagination.totalRecords
                                            )}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold">
                                            {pagination.totalRecords}
                                        </span>{" "}
                                        results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.current - 1)}
                                            disabled={pagination.current === 1}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {[...Array(pagination.total)].map((_, idx) => (
                                                <button
                                                    key={idx + 1}
                                                    onClick={() => handlePageChange(idx + 1)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${pagination.current === idx + 1
                                                            ? "bg-blue-600 text-white"
                                                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {idx + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(pagination.current + 1)}
                                            disabled={pagination.current === pagination.total}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Contact Details
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                {getStatusBadge(selectedContact.status)}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaUser className="inline mr-2" />
                                    Name
                                </label>
                                <p className="text-gray-900">
                                    {selectedContact.name || "Not provided"}
                                </p>
                                {selectedContact.isAuthenticated && (
                                    <span className="text-xs text-green-600 mt-1 inline-block">
                                        ✓ Verified User
                                    </span>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaPhone className="inline mr-2" />
                                    Phone Number
                                </label>
                                <a
                                    href={`tel:${selectedContact.mobile}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {selectedContact.mobile}
                                </a>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaEnvelope className="inline mr-2" />
                                    Email
                                </label>
                                {selectedContact.email ? (
                                    <a
                                        href={`mailto:${selectedContact.email}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {selectedContact.email}
                                    </a>
                                ) : (
                                    <p className="text-gray-500">Not provided</p>
                                )}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaComment className="inline mr-2" />
                                    Comment
                                </label>
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {selectedContact.comment || "No comment provided"}
                                </p>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaCalendar className="inline mr-2" />
                                    Submitted On
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(selectedContact.createdAt)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <select
                                    value={selectedContact.status}
                                    onChange={(e) => {
                                        handleStatusChange(selectedContact._id, e.target.value);
                                        setShowModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="pending">Mark as Pending</option>
                                    <option value="contacted">Mark as Contacted</option>
                                    <option value="resolved">Mark as Resolved</option>
                                </select>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedContact._id);
                                        setShowModal(false);
                                    }}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactUs;