const axios = require('axios');
const { AUTH_API_URL, PRODUCTS_API_URL } = require('./test-config.cjs');

const API_URL = `${AUTH_API_URL}/`;
const PRODUCTS_URL = PRODUCTS_API_URL;

async function testDeleteProduct() {
  try {
    // Login first
    const loginResponse = await axios.post(API_URL + 'signin', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login successful!');

    const token = loginResponse.data.token;

    // Get products before deletion
    const productsBeforeResponse = await axios.get(PRODUCTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Products before deletion:', productsBeforeResponse.data.length);

    // Choose a product to delete (let's try to find one that isn't in an order)
    // For this test, we'll try to delete the last product in the list
    const productIdToDelete = productsBeforeResponse.data[productsBeforeResponse.data.length - 1].id;
    console.log(`Attempting to delete product with ID: ${productIdToDelete}`);

    // Delete the product
    const deleteResponse = await axios.delete(`${PRODUCTS_URL}/${productIdToDelete}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Delete response status:', deleteResponse.status);

    // Get products after deletion
    const productsAfterResponse = await axios.get(PRODUCTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Products after deletion:', productsAfterResponse.data.length);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testDeleteProduct();
