const axios = require('axios');
const { AUTH_API_URL, PRODUCTS_API_URL } = require('./test-config.cjs');

const API_URL = `${AUTH_API_URL}/`;
const PRODUCTS_URL = PRODUCTS_API_URL;

async function testAddProduct() {
  try {
    // Login first
    const loginResponse = await axios.post(API_URL + 'signin', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login successful!');

    const token = loginResponse.data.token;

    // Add a product
    const productData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      stockQuantity: 100,
      sku: 'TEST-001',
      barcode: '123456789',
      category: null,
      active: true
    };

    const addProductResponse = await axios.post(PRODUCTS_URL, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Product added successfully!');
    console.log('Product:', addProductResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAddProduct();
