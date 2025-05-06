/**
 * API Configuration
 * 
 * This file contains the base URL for all API requests.
 * Change this value to point to your backend server.
 */

// Base URL for all API requests
export const API_BASE_URL = 'http://localhost:8081';

// Auth API endpoint
export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

// Products API endpoint
export const PRODUCTS_API_URL = `${API_BASE_URL}/api`;

// Other API endpoints can be added here
export const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;
export const CUSTOMERS_API_URL = `${API_BASE_URL}/api/customers`;
export const TABLES_API_URL = `${API_BASE_URL}/api/tables`;
export const USERS_API_URL = `${API_BASE_URL}/api/users`;
export const CATEGORIES_API_URL = `${API_BASE_URL}/api/categories`;
export const DASHBOARD_API_URL = `${API_BASE_URL}/api/dashboard`;

export default {
  API_BASE_URL,
  AUTH_API_URL,
  PRODUCTS_API_URL,
  ORDERS_API_URL,
  CUSTOMERS_API_URL,
  TABLES_API_URL,
  USERS_API_URL,
  CATEGORIES_API_URL,
  DASHBOARD_API_URL
};
