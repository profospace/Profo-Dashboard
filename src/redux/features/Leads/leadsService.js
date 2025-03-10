import axios from 'axios';
import { base_url } from '../../../../utils/base_url';

// Get all leads
const getLeads = async () => {
    const response = await axios.get(`${base_url}/property-lead/api/leads`);
    return response.data;
};

// Get lead by ID
const getLeadById = async (leadId) => {
    const response = await axios.get(`${base_url}/property-lead/api/leads/${leadId}`);
    return response.data;
};

// Update lead status
const updateLeadStatus = async (leadId, status) => {
    const response = await axios.patch(`${base_url}/property-lead/api/leads/${leadId}/status`, { status });
    return response.data;
};

// Create new lead
const createLead = async (leadData) => {
    const response = await axios.post(`${base_url}/property-lead/api/leads`, leadData);
    return response.data;
};

// Update lead
const updateLead = async (leadId, leadData) => {
    const response = await axios.put(`${base_url}/property-lead/api/leads/${leadId}`, leadData);
    return response.data;
};

// Delete lead
const deleteLead = async (leadId) => {
    const response = await axios.delete(`${base_url}/property-lead/api/leads/${leadId}`);
    return response.data;
};

const leadsService = {
    getLeads,
    getLeadById,
    updateLeadStatus,
    createLead,
    updateLead,
    deleteLead,
};

export default leadsService;