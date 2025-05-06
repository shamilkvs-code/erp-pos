/**
 * Test Configuration
 *
 * This file contains the base URL for all API requests in test scripts.
 * Change this value to point to your backend server.
 */

// Base URL for all API requests
const API_BASE_URL = 'http://localhost:8081';

// Auth API endpoint
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

// Products API endpoint
const PRODUCTS_API_URL = `${API_BASE_URL}/api/products`;

// Other API endpoints can be added here
const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;
const CUSTOMERS_API_URL = `${API_BASE_URL}/api/customers`;
const TABLES_API_URL = `${API_BASE_URL}/api/tables`;
const USERS_API_URL = `${API_BASE_URL}/api/users`;
const CATEGORIES_API_URL = `${API_BASE_URL}/api/categories`;
const DASHBOARD_API_URL = `${API_BASE_URL}/api/dashboard`;

module.exports = {
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
