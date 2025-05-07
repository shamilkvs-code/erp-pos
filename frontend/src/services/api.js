import axios from 'axios';
import { PRODUCTS_API_URL, AUTH_API_URL } from '../config/api.config';

const API_URL = PRODUCTS_API_URL;

// Add a request interceptor to add the auth token to every request
axios.interceptors.request.use(
  (config) => {
    // Try to get the token from user object first (preferred method)
    const userStr = localStorage.getItem('user');
    let token = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token;
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    // Fallback to direct token storage if user object doesn't exist or doesn't have token
    if (!token) {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const login = async (username, password) => {
  try {
    console.log('Attempting login with:', { username });

    const response = await axios.post(`${AUTH_API_URL}/signin`, { username, password });
    console.log('Login response received');

    if (response.data && response.data.token) {
      // Store only in the user object for consistency
      localStorage.setItem('user', JSON.stringify(response.data));

      // Log successful login
      console.log('Login successful, token stored in localStorage');
    } else {
      console.error('Login response missing token:', response.data);
      throw new Error('Invalid login response: missing token');
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    console.log('Attempting signup with:', userData);

    const response = await axios.post(`${AUTH_API_URL}/signup`, userData);
    console.log('Signup response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

export const logout = () => {
  // Remove both for backward compatibility
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Log logout
  console.log('User logged out, localStorage cleared');
};

export const register = async (username, email, password, fullName, roles) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/signup`, {
      username,
      email,
      password,
      fullName,
      roles,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Products API
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Categories API
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Orders API
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (id, order) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}`, order);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByType = async (orderType) => {
  try {
    const response = await axios.get(`${API_URL}/orders/type/${orderType}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByTable = async (tableId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/table/${tableId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentTableOrder = async (tableId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/table/${tableId}/current`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTableOrder = async (tableId, order) => {
  try {
    const response = await axios.post(`${API_URL}/orders/table/${tableId}`, order);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeAndClearTable = async (orderId) => {
  try {
    const response = await axios.post(`${API_URL}/orders/${orderId}/complete-and-clear`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Users API
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Customers API
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCustomer = async (customer) => {
  try {
    const response = await axios.post(`${API_URL}/customers`, customer);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async (id, customer) => {
  try {
    const response = await axios.put(`${API_URL}/customers/${id}`, customer);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Dashboard API
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/recent-orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  // First check for user object with token
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        return true;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }

  // Fallback to direct token check for backward compatibility
  return localStorage.getItem('token') !== null;
};

// Helper function to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Validate that the user object has the expected properties
      if (user && user.token && user.username) {
        return user;
      } else {
        console.warn('Invalid user object in localStorage:', user);
        // Clear invalid user data
        localStorage.removeItem('user');
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      // Clear invalid user data
      localStorage.removeItem('user');
    }
  }
  return null;
};

// Helper function to check if user has a specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (user && user.roles) {
    return user.roles.includes(role);
  }
  return false;
};

// Tables API
export const getAllTables = async () => {
  try {
    const response = await axios.get(`${API_URL}/tables`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTableById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tables/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTableByNumber = async (tableNumber) => {
  try {
    const response = await axios.get(`${API_URL}/tables/number/${tableNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTablesByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/tables/status/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTablesByLocation = async (location) => {
  try {
    const response = await axios.get(`${API_URL}/tables/location/${location}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTablesByCapacity = async (capacity) => {
  try {
    const response = await axios.get(`${API_URL}/tables/capacity/${capacity}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTable = async (table) => {
  try {
    const response = await axios.post(`${API_URL}/tables`, table);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTable = async (id, table) => {
  try {
    const response = await axios.put(`${API_URL}/tables/${id}`, table);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTable = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/tables/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignOrderToTable = async (tableId, orderId) => {
  try {
    const response = await axios.post(`${API_URL}/tables/${tableId}/orders`, { orderId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrderForTable = async (tableId, order) => {
  try {
    console.log(`Creating order for table ${tableId} with data:`, order);

    // Make sure all required fields are present
    const orderData = {
      ...order,
      orderDate: order.orderDate || new Date().toISOString(),
      totalAmount: order.totalAmount || 0.00,
      status: order.status || 'PENDING',
      orderItems: order.orderItems || []
    };

    // Convert totalAmount to string with 2 decimal places
    if (typeof orderData.totalAmount === 'number') {
      orderData.totalAmount = orderData.totalAmount.toFixed(2);
    }

    const response = await axios.post(`${API_URL}/orders/table/${tableId}`, orderData);
    console.log('Order creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createOrderForTable:', error.response?.data || error.message);
    throw error;
  }
};

export const clearTable = async (tableId) => {
  try {
    const response = await axios.post(`${API_URL}/tables/${tableId}/clear`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeTableStatus = async (tableId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/tables/${tableId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  logout,
  register,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  getCategoryById,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByType,
  getOrdersByTable,
  getCurrentTableOrder,
  createTableOrder,
  completeAndClearTable,
  getAllTables,
  getTableById,
  getTableByNumber,
  getTablesByStatus,
  getTablesByLocation,
  getTablesByCapacity,
  createTable,
  updateTable,
  deleteTable,
  assignOrderToTable,
  createOrderForTable,
  clearTable,
  changeTableStatus,
  getAllUsers,
  getUserById,
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getDashboardStats,
  getRecentOrders,
  isAuthenticated,
  getCurrentUser,
  hasRole,
};
