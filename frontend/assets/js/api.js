/**
 * ClinicHub API Client
 * Handles all API calls to the backend
 */

// API Base URL - Automatically detects localhost or production
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api' 
  : '/api'; // Use relative path in production

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set user in localStorage
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
const removeUser = () => {
  localStorage.removeItem('user');
};

// Make API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    
    return data;
  },

  // Login user
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  // Logout (client-side)
  logout: () => {
    removeToken();
    removeUser();
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!getToken();
  },

  // Get current user from storage
  getCurrentUserFromStorage: () => {
    return getUser();
  },

  // Update profile
  updateProfile: async (profileData) => {
    const data = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    if (data.user) {
      setUser(data.user);
    }
    
    return data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Appointments API
export const appointmentsAPI = {
  // Create appointment
  create: async (appointmentData) => {
    return await apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get user's appointments
  getAll: async () => {
    return await apiRequest('/appointments');
  },

  // Get single appointment
  getById: async (id) => {
    return await apiRequest(`/appointments/${id}`);
  },

  // Update appointment
  update: async (id, appointmentData) => {
    return await apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  },

  // Cancel appointment
  cancel: async (id) => {
    return await apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Clinics API
export const clinicsAPI = {
  // Get all clinics
  getAll: async (category = null) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return await apiRequest(`/clinics${query}`);
  },

  // Get single clinic
  getById: async (id) => {
    return await apiRequest(`/clinics/${id}`);
  },
};

// Contact API
export const contactAPI = {
  // Send contact form
  send: async (contactData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Export utility functions
export { getToken, setToken, removeToken, getUser, setUser, removeUser };

