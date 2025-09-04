// // import { base_url } from "../../../utils/base_url";



// // const API_BASE_URL = base_url;

// // class AdminAPI {
// //   constructor() {
// //     this.token = localStorage.getItem('authToken');
// //   }

// //   setToken(token) {
// //     this.token = token;
// //     localStorage.setItem('authToken', token);
// //   }

// //   async request(endpoint, options = {}) {
// //     const url = `${API_BASE_URL}${endpoint}`;
// //     const config = {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         ...(this.token && { Authorization: `Bearer ${this.token}` }),
// //         ...options.headers,
// //       },
// //       ...options,
// //     };

// //     try {
// //       const response = await fetch(url, config);
      
// //       if (!response.ok) {
// //         const error = await response.json();
// //         throw new Error(error.message || 'API request failed');
// //       }

// //       return await response.json();
// //     } catch (error) {
// //       console.error('API Error:', error);
// //       throw error;
// //     }
// //   }

// //   // Dashboard Stats
// //   async getDashboardStats(dateRange = '7d') {
// //     return this.request(`/api/wallet/dashboard/stats?range=${dateRange}`);
// //   }

// //   // Transaction Analytics
// //   async getTransactionAnalytics(dateRange = '7d') {
// //     return this.request(`/api/wallet/dashboard/transactions?range=${dateRange}`);
// //   }

// //   // User Analytics
// //   async getUserAnalytics(dateRange = '7d') {
// //     return this.request(`/api/wallet/dashboard/users?range=${dateRange}`);
// //   }

// //   // Plan Analytics
// //   async getPlanAnalytics(dateRange = '7d') {
// //     return this.request(`/api/wallet/dashboard/plans?range=${dateRange}`);
// //   }

// //   // Recent Activity
// //   async getRecentActivity(limit = 10) {
// //     return this.request(`/api/wallet/dashboard/activity?limit=${limit}`);
// //   }

// //   // Users Management
// //   async getUsers(page = 1, limit = 10, search = '') {
// //     return this.request(`/api/wallet/users?page=${page}&limit=${limit}&search=${search}`);
// //   }

// //   // AI Suggestions
// //   async getSuggestions() {
// //     return this.request('/api/wallet/dashboard/suggestions');
// //   }
// // }

// // export default new AdminAPI();

// // import { base_url } from "../../../utils/base_url";


// // const AdminAPI = {
// //   // Dashboard Stats
// //   async getDashboardStats(range = '7d') {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/dashboard/stats?range=${range}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching dashboard stats:', error);
// //       throw error;
// //     }
// //   },

  

// //   // Transaction Analytics
// //   async getTransactionAnalytics(range = '7d') {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/dashboard/transactions?range=${range}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching transaction analytics:', error);
// //       throw error;
// //     }
// //   },

  

// //   // User Analytics
// //   async getUserAnalytics(range = '7d') {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/users?range=${range}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching user analytics:', error);
// //       throw error;
// //     }
// //   },

  

// //   // Plan Analytics
// //   async getPlanAnalytics(range = '7d') {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/dashboard/plans?range=${range}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching plan analytics:', error);
// //       throw error;
// //     }
// //   },

  

// //   // Recent Activity
// //   async getRecentActivity(limit = 10) {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/dashboard/activity?limit=${limit}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching recent activity:', error);
// //       throw error;
// //     }
// //   },

  

// //   // Suggestions
// //   async getSuggestions() {
// //     try {
// //       const response = await fetch('${base_url}/api/wallet/dashboard/suggestions', {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching suggestions:', error);
// //       throw error;
// //     }
// //   },


  
// //   // Users with pagination and search
// //   async getUsers(params = {}) {
// //     try {
// //       const queryParams = new URLSearchParams(params).toString();
// //       const response = await fetch(`/api/wallet/dashboard?${queryParams}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching users:', error);
// //       throw error;
// //     }
// //   },

  

// //   // User Details Analytics
// //   async getUserDetailsAnalytics() {
// //     try {
// //       const response = await fetch('/api/wallet/dashboard-details', {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching user details analytics:', error);
// //       throw error;
// //     }
// //   },

  

// //   // User Transactions
// //   async getUserTransactions(userId) {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/dashboard/${userId}/transactions`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching user transactions:', error);
// //       throw error;
// //     }
// //   },

  

// //   // User Plans
// //   async getUserPlans(userId) {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet/dashboard/${userId}/plans`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching user plans:', error);
// //       throw error;
// //     }
// //   },

  

// //   // Plan Details Analytics
// //   async getPlanDetailsAnalytics() {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet-details`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching plan details analytics:', error);
// //       throw error;
// //     }
// //   },

  

// //   // Revenue Analytics
// //   async getRevenueAnalytics(range = '7d') {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet-analytics?range=${range}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching revenue analytics:', error);
// //       throw error;
// //     }
// //   },

  

// //   // User Activity Analytics
// //   async getUserActivityAnalytics(range = '7d', filterType = 'all') {
// //     try {
// //       const response = await fetch(`${base_url}/api/wallet-activity?range=${range}&filter=${filterType}`, {
// //         headers: {
// //           'Authorization': `Bearer ${this.getToken()}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching user activity analytics:', error);
// //       throw error;
// //     }
// //   },

// //   // Helper method to get token (you'll need to implement this based on your auth system)
// //   getToken() {
// //     // Return the admin token from localStorage, sessionStorage, or your auth system
// //     return localStorage.getItem('authToken') || '';
// //   }
// // };

// // export default AdminAPI;

// import { base_url } from "../../../utils/base_url";

// const API_BASE_URL = base_url;

// class AdminAPI {
//   constructor() {
//     this.token = localStorage.getItem('authToken');
//   }

//   setToken(token) {
//     this.token = token;
//     localStorage.setItem('authToken', token);
//   }

//   getToken() {
//     return this.token || localStorage.getItem('authToken') || '';
//   }

//   async request(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'API request failed');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   }

//   // Dashboard Stats
//   async getDashboardStats(range = '7d') {
//     return this.request(`/api/wallet/dashboard/stats?range=${range}`);
//   }

//   // Transaction Analytics
//   async getTransactionAnalytics(range = '7d') {
//     return this.request(`/api/wallet/dashboard/transactions?range=${range}`);
//   }

//   // User Analytics
//   async getUserAnalytics(range = '7d') {
//     return this.request(`/api/wallet/users?range=${range}`);
//   }

//   // Plan Analytics
//   async getPlanAnalytics(range = '7d') {
//     return this.request(`/api/wallet/dashboard/plans?range=${range}`);
//   }

//   // Recent Activity
//   async getRecentActivity(limit = 10) {
//     return this.request(`/api/wallet/dashboard/activity?limit=${limit}`);
//   }

//   // AI Suggestions
//   async getSuggestions() {
//     return this.request('/api/wallet/dashboard/suggestions');
//   }

//   // Users with pagination and search
//   async getUsers(params = {}) {
//     const queryParams = new URLSearchParams(params).toString();
//     return this.request(`/api/wallet/dashboard/users?${queryParams}`);
//   }

//   // User Details Analytics
//   async getUserDetailsAnalytics() {
//     return this.request('/api/wallet/dashboard-details');
//   }

//   // User Transactions
//   async getUserTransactions(userId) {
//     return this.request(`/api/wallet/dashboard/${userId}/transactions`);
//   }

//   // User Plans
//   async getUserPlans(userId) {
//     return this.request(`/api/wallet/dashboard/${userId}/plans`);
//   }

//   // Plan Details Analytics
//   async getPlanDetailsAnalytics() {
//     return this.request('/api/wallet-details');
//   }

//   // Revenue Analytics
//   async getRevenueAnalytics(range = '7d') {
//     return this.request(`/api/wallet/wallet-analytics?range=${range}`);
//   }

//   // User Activity Analytics
//   async getUserActivityAnalytics(range = '7d', filterType = 'all') {
//     return this.request(`/api/wallet/wallet-activity?range=${range}&filter=${filterType}`);
//   }
// }

// export default new AdminAPI();


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

  getToken() {
    return this.token || localStorage.getItem('authToken') || '';
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
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
  async getDashboardStats(range = '7d') {
    return this.request(`/api/wallet/dashboard/stats?range=${range}`);
  }

  // Transaction Analytics
  async getTransactionAnalytics(range = '7d') {
    return this.request(`/api/wallet/dashboard/transactions?range=${range}`);
  }

  // User Analytics
  async getUserAnalytics(range = '7d') {
    return this.request(`/api/wallet/users?range=${range}`);
  }

  // Plan Analytics
  async getPlanAnalytics(range = '7d') {
    return this.request(`/api/wallet/dashboard/plans?range=${range}`);
  }

  // Recent Activity
  async getRecentActivity(limit = 10) {
    return this.request(`/api/wallet/dashboard/activity?limit=${limit}`);
  }

  // AI Suggestions
  async getSuggestions() {
    return this.request('/api/wallet/dashboard/suggestions');
  }

  // Users with pagination and search - UPDATED TO USE NEW ROUTE
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/api/user-management/users?${queryParams}`);
  }

  // User Details Analytics
  async getUserDetailsAnalytics() {
    return this.request('/api/wallet/dashboard-details');
  }

  // User Transactions
  async getUserTransactions(userId) {
    return this.request(`/api/wallet/dashboard/${userId}/transactions`);
  }

  // User Plans
  async getUserPlans(userId) {
    return this.request(`/api/wallet/dashboard/${userId}/plans`);
  }

  // Plan Details Analytics
  async getPlanDetailsAnalytics() {
    return this.request('/api/wallet-details');
  }

  // Revenue Analytics
  async getRevenueAnalytics(range = '7d') {
    return this.request(`/api/wallet/wallet-analytics?range=${range}`);
  }

  // User Activity Analytics
  async getUserActivityAnalytics(range = '7d', filterType = 'all') {
    return this.request(`/api/wallet/wallet-activity?range=${range}&filter=${filterType}`);
  }

  // NEW USER MANAGEMENT METHODS

  // Get user statistics
  async getUserStats(range = '7d') {
    return this.request(`/api/user-management/stats?range=${range}`);
  }

  // Get specific user details
  async getUserDetails(userId) {
    return this.request(`/api/user-management/users/${userId}`);
  }

  // Update user wallet balance
  async updateUserWallet(userId, amount, type, description) {
    return this.request(`/api/user-management/users/${userId}/wallet`, {
      method: 'PATCH',
      body: JSON.stringify({ amount, type, description })
    });
  }
}

export default new AdminAPI();