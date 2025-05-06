import axios from 'axios';
import { AUTH_API_URL } from '../config/api.config';

const API_URL = `${AUTH_API_URL}/`;

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, email, password, fullName) {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password,
      fullName
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
