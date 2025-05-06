const axios = require('axios');

const API_URL = 'http://localhost:8080/api/auth/';
const PRODUCTS_URL = 'http://localhost:8080/api/products';

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
