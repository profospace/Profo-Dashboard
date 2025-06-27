import React, { useState, useEffect } from 'react';
import {
    Home,
    Phone,
    MapPin,
    IndianRupee,
    Calendar,
    Users,
    TrendingUp,
    CheckCircle,
    Clock,
    UserCheck,
    XCircle
} from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const Requirement = () => {
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        fetchLeads();
        fetchStats();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await fetch(`${base_url}/api/requirement`);
            const data = await response.json();
            setLeads(data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${base_url}/api/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updateLeadStatus = async (leadId, status) => {
        try {
            const response = await fetch(`${base_url}/api/requirement/${leadId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchLeads();
                fetchStats();
            }
        } catch (error) {
            console.error('Error updating lead status:', error);
        }
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)} L`;
        } else {
            return `₹${(amount / 1000).toFixed(0)}K`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800 border-blue-200',
            contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            interested: 'bg-green-100 text-green-800 border-green-200',
            closed: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[status] || colors.new;
    };

    const getStatusIcon = (status) => {
        const icons = {
            new: Clock,
            contacted: Phone,
            interested: UserCheck,
            closed: CheckCircle
        };
        const IconComponent = icons[status] || Clock;
        return <IconComponent className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Property Leads Dashboard</h1>
                                <p className="text-gray-600">Manage your property inquiries</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">New Leads</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats?.statusBreakdown.new}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Interested</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.statusBreakdown.interested}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Closed</p>
                                    <p className="text-3xl font-bold text-gray-600">{stats.statusBreakdown.closed}</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-gray-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leads Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Property Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Budget Range
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Areas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {lead.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Home className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900 capitalize">
                                                    {lead.propertyType.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <IndianRupee className="w-4 h-4 mr-1 text-gray-400" />
                                                <span className="text-sm text-gray-900">
                                                    {formatCurrency(lead.budgetRange.min)} - {formatCurrency(lead.budgetRange.max)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                                                <div className="text-sm text-gray-900">
                                                    {lead.areas.slice(0, 2).join(', ')}
                                                    {lead.areas.length > 2 && (
                                                        <span className="text-gray-500"> +{lead.areas.length - 2} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(lead.createdAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                                                {getStatusIcon(lead.status)}
                                                <span className="ml-1 capitalize">{lead.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="interested">Interested</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {leads.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                        <p className="text-gray-500">Property inquiries will appear here once submitted.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requirement;