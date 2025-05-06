const axios = require('axios');
const { AUTH_API_URL, PRODUCTS_API_URL } = require('./test-config.cjs');

const API_URL = `${AUTH_API_URL}/`;
const PRODUCTS_URL = PRODUCTS_API_URL;

async function testProducts() {
  try {
    // Login first
    const loginResponse = await axios.post(API_URL + 'signin', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login successful!');

    const token = loginResponse.data.token;

    // Get products
    const productsResponse = await axios.get(PRODUCTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Products retrieved successfully!');
    console.log('Products:', productsResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testProducts();
