import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData),
  changePassword: (data) => apiClient.put('/auth/change-password', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const protectedService = {
  getUserOnly: () => apiClient.get('/protected/user-only'),
  getAdminOnly: () => apiClient.get('/protected/admin-only'),
  getModeratorOnly: () => apiClient.get('/protected/moderator-only'),
};

export const adminService = {
  getAllUsers: () => apiClient.get('/auth/users'),
  deleteUser: (userId) => apiClient.delete(`/auth/users/${userId}`),
  updateUserRole: (userId, role) => apiClient.put(`/auth/users/${userId}/role`, { role }),
};

export default apiClient;
