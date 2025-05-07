import axios from 'axios';
import { AUTH_API_URL } from '../config/api.config';

const API_URL = `${AUTH_API_URL}/`;

class AuthService {
  async login(username, password) {
    try {
      console.log('AuthService: Attempting login with:', { username });

      const response = await axios.post(API_URL + 'signin', {
        username,
        password
      });

      console.log('AuthService: Login response received');

      if (response.data && response.data.token) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('AuthService: Login successful, token stored in localStorage');
      } else {
        console.error('AuthService: Login response missing token:', response.data);
        throw new Error('Invalid login response: missing token');
      }

      return response.data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  logout() {
    // Remove both for backward compatibility
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('AuthService: User logged out, localStorage cleared');
  }

  async register(username, email, password, fullName) {
    try {
      console.log('AuthService: Attempting registration');

      const response = await axios.post(API_URL + 'signup', {
        username,
        email,
        password,
        fullName
      });

      console.log('AuthService: Registration successful');
      return response.data;
    } catch (error) {
      console.error('AuthService: Registration error:', error);
      throw error;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Validate that the user object has the expected properties
        if (user && user.token && user.username) {
          return user;
        } else {
          console.warn('AuthService: Invalid user object in localStorage');
          // Clear invalid user data
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error('AuthService: Error parsing user from localStorage:', e);
        // Clear invalid user data
        localStorage.removeItem('user');
      }
    }
    return null;
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

export default new AuthService();
