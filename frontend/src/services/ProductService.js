import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/api/products/';

class ProductService {
  getAllProducts() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getProductById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  getProductsByCategory(categoryId) {
    return axios.get(API_URL + 'category/' + categoryId, { headers: authHeader() });
  }

  searchProducts(name) {
    return axios.get(API_URL + 'search?name=' + name, { headers: authHeader() });
  }

  createProduct(product) {
    return axios.post(API_URL, product, { headers: authHeader() });
  }

  updateProduct(id, product) {
    return axios.put(API_URL + id, product, { headers: authHeader() });
  }

  deleteProduct(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  disableProduct(id) {
    return axios.patch(API_URL + id + '/disable', {}, { headers: authHeader() });
  }

  enableProduct(id) {
    return axios.patch(API_URL + id + '/enable', {}, { headers: authHeader() });
  }
}

export default new ProductService();
