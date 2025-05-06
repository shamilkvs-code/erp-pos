const axios = require('axios');

const API_URL = 'http://localhost:8080/api/auth/';

async function testLogin() {
  try {
    const response = await axios.post(API_URL + 'signin', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login successful!');
    console.log('User:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  }
}

testLogin();
