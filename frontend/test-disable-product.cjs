const axios = require('axios');
const { AUTH_API_URL, PRODUCTS_API_URL } = require('./test-config.cjs');

const API_URL = `${AUTH_API_URL}/`;
const PRODUCTS_URL = PRODUCTS_API_URL;

async function testDisableProduct() {
  try {
    // Login first
    const loginResponse = await axios.post(API_URL + 'signin', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login successful!');

    const token = loginResponse.data.token;

    // Get products before disabling
    const productsBeforeResponse = await axios.get(PRODUCTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Products before disabling:');
    productsBeforeResponse.data.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Active: ${product.active}`);
    });

    // Choose a product to disable (let's disable the first one)
    const productIdToDisable = productsBeforeResponse.data[0].id;
    console.log(`\nAttempting to disable product with ID: ${productIdToDisable}`);

    // Disable the product
    const disableResponse = await axios.patch(`${PRODUCTS_URL}/${productIdToDisable}/disable`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Disable response:', disableResponse.data);

    // Get products after disabling
    const productsAfterResponse = await axios.get(PRODUCTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\nProducts after disabling:');
    productsAfterResponse.data.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Active: ${product.active}`);
    });

    // Now let's enable the product again
    console.log(`\nAttempting to enable product with ID: ${productIdToDisable}`);

    const enableResponse = await axios.patch(`${PRODUCTS_URL}/${productIdToDisable}/enable`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Enable response:', enableResponse.data);

    // Get products after enabling
    const productsAfterEnablingResponse = await axios.get(PRODUCTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\nProducts after enabling:');
    productsAfterEnablingResponse.data.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Active: ${product.active}`);
    });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testDisableProduct();
