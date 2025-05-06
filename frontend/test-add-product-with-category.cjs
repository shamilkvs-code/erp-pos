const axios = require('axios');
const { AUTH_API_URL, PRODUCTS_API_URL } = require('./test-config.cjs');

const API_URL = `${AUTH_API_URL}/`;
const PRODUCTS_URL = PRODUCTS_API_URL;

async function testAddProductWithCategory() {
  try {
    // Login first
    const loginResponse = await axios.post(API_URL + 'signin', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login successful!');

    const token = loginResponse.data.token;

    // Add a product with category
    const productData = {
      name: 'Laptop',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      stockQuantity: 50,
      sku: 'LAPTOP-001',
      barcode: '987654321',
      category: {
        id: 1,
        name: 'Electronics'
      },
      active: true
    };

    const addProductResponse = await axios.post(PRODUCTS_URL, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Product with category added successfully!');
    console.log('Product:', addProductResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAddProductWithCategory();
