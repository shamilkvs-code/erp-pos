const axios = require('axios');
const { AUTH_API_URL } = require('./test-config.cjs');

const API_URL = `${AUTH_API_URL}/`;

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
