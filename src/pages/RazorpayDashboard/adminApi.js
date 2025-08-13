import { base_url } from "../../../utils/base_url";

const API_BASE_URL = base_url;

class AdminAPI {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats(dateRange = '7d') {
    return this.request(`/api/wallet/dashboard/stats?range=${dateRange}`);
  }

  // Transaction Analytics
  async getTransactionAnalytics(dateRange = '7d') {
    return this.request(`/api/wallet/dashboard/transactions?range=${dateRange}`);
  }

  // User Analytics
  async getUserAnalytics(dateRange = '7d') {
    return this.request(`/api/wallet/dashboard/users?range=${dateRange}`);
  }

  // Plan Analytics
  async getPlanAnalytics(dateRange = '7d') {
    return this.request(`/api/wallet/dashboard/plans?range=${dateRange}`);
  }

  // Recent Activity
  async getRecentActivity(limit = 10) {
    return this.request(`/api/wallet/dashboard/activity?limit=${limit}`);
  }

  // Users Management
  async getUsers(page = 1, limit = 10, search = '') {
    return this.request(`/api/wallet/users?page=${page}&limit=${limit}&search=${search}`);
  }

  // AI Suggestions
  async getSuggestions() {
    return this.request('/api/wallet/dashboard/suggestions');
  }
}

export default new AdminAPI();