import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ToggleOff as DisableIcon,
  ToggleOn as EnableIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getAllCategories,
  createCategory
} from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Product dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openDisableDialog, setOpenDisableDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    sku: '',
    barcode: '',
    categoryId: ''
  });

  // Category dialog states
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    description: ''
  });

  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch categories from the API
      console.log('Categories component: Calling getAllCategories()');
      const data = await getAllCategories();
      console.log('Categories component: Received categories data:', data);

      // Handle different possible formats of categories data
      if (Array.isArray(data)) {
        console.log('Categories component: Setting categories array directly, length:', data.length);
        setCategories(data);
      } else if (data && Array.isArray(data.categories)) {
        console.log('Categories component: Setting categories from data.categories, length:', data.categories.length);
        setCategories(data.categories);
      } else if (data && data.content && Array.isArray(data.content)) {
        // Handle Spring Boot pagination format
        console.log('Categories component: Setting categories from data.content, length:', data.content.length);
        setCategories(data.content);
      } else if (data && Array.isArray(data.categoryNames)) {
        // Handle the specific format from the API
        console.log('Categories component: Converting categoryNames to category objects, length:', data.categoryNames.length);

        // Convert category names to category objects
        const categoryObjects = data.categoryNames.map((name, index) => ({
          id: index + 1,
          name: name,
          description: `Category for ${name}`
        }));

        setCategories(categoryObjects);
      } else {
        console.error('Categories component: Invalid categories data format:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Categories component: Error fetching categories:', error);

      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication error. Please log in again.',
          severity: 'error'
        });

        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to load categories: ' + (error.response?.data?.message || error.message),
          severity: 'warning'
        });
      }

      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch products from the API
      console.log('Products component: Calling getAllProducts()');
      const data = await getAllProducts();
      console.log('Products component: Received products data:', data);

      // Handle different possible formats of products data
      if (Array.isArray(data)) {
        console.log('Products component: Setting products array directly, length:', data.length);
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        console.log('Products component: Setting products from data.products, length:', data.products.length);
        setProducts(data.products);
      } else if (data && data.content && Array.isArray(data.content)) {
        // Handle Spring Boot pagination format
        console.log('Products component: Setting products from data.content, length:', data.content.length);
        setProducts(data.content);
      } else if (data && Array.isArray(data.productNames)) {
        // Handle the specific format from the API
        console.log('Products component: Converting productNames to product objects, length:', data.productNames.length);

        // Convert product names to product objects
        const productObjects = data.productNames.map((name, index) => ({
          id: index + 1,
          name: name,
          description: `Description for ${name}`,
          price: 0,
          stockQuantity: 0,
          category: null,
          active: true
        }));

        setProducts(productObjects);
      } else {
        console.error('Products component: Invalid products data format:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Products component: Error fetching products:', error);

      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication error. Please log in again.',
          severity: 'error'
        });

        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to load products: ' + (error.response?.data?.message || error.message),
          severity: 'error'
        });
      }

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stockQuantity: product.stockQuantity,
        sku: product.sku || '',
        barcode: product.barcode || '',
        categoryId: product.category ? product.category.id : ''
      });
    } else {
      setCurrentProduct({
        id: null,
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        sku: '',
        barcode: '',
        categoryId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDisableDialog = (product) => {
    setCurrentProduct(product);
    setOpenDisableDialog(true);
  };

  const handleCloseDisableDialog = () => {
    setOpenDisableDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSaveProduct = () => {
    const productData = {
      ...currentProduct,
      price: parseFloat(currentProduct.price),
      stockQuantity: parseInt(currentProduct.stockQuantity),
      category: { id: currentProduct.categoryId }
    };

    if (currentProduct.id) {
      // Update existing product
      updateProduct(currentProduct.id, productData)
        .then(() => {
          fetchProducts();
          handleCloseDialog();
          setSnackbar({
            open: true,
            message: 'Product updated successfully',
            severity: 'success'
          });
        })
        .catch(error => {
          console.error('Error updating product:', error);
          setSnackbar({
            open: true,
            message: 'Failed to update product: ' + (error.response?.data?.message || error.message),
            severity: 'error'
          });
        });
    } else {
      // Create new product
      createProduct(productData)
        .then(() => {
          fetchProducts();
          handleCloseDialog();
          setSnackbar({
            open: true,
            message: 'Product created successfully',
            severity: 'success'
          });
        })
        .catch(error => {
          console.error('Error creating product:', error);
          setSnackbar({
            open: true,
            message: 'Failed to create product: ' + (error.response?.data?.message || error.message),
            severity: 'error'
          });
        });
    }
  };

  const handleToggleProductStatus = () => {
    const isDisabling = currentProduct.active;

    // For now, we'll just update the product with the new status
    // since we don't have specific enable/disable endpoints
    const updatedProduct = {
      ...currentProduct,
      active: !currentProduct.active
    };

    updateProduct(currentProduct.id, updatedProduct)
      .then(() => {
        fetchProducts();
        handleCloseDisableDialog();
        setSnackbar({
          open: true,
          message: `Product ${isDisabling ? 'disabled' : 'enabled'} successfully`,
          severity: 'success'
        });
      })
      .catch(error => {
        console.error(`Error ${isDisabling ? 'disabling' : 'enabling'} product:`, error);
        setSnackbar({
          open: true,
          message: `Failed to ${isDisabling ? 'disable' : 'enable'} product: ${error.response?.data?.message || error.message}`,
          severity: 'error'
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Handle open category dialog
  const handleOpenCategoryDialog = () => {
    setCurrentCategory({
      id: null,
      name: '',
      description: ''
    });
    setOpenCategoryDialog(true);
  };

  // Handle close category dialog
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };

  // Handle save category
  const handleSaveCategory = async () => {
    try {
      // Validate inputs
      if (!currentCategory.name) {
        setSnackbar({
          open: true,
          message: 'Category name is required',
          severity: 'error'
        });
        return;
      }

      // Create new category
      await createCategory(currentCategory);

      // Show success message
      setSnackbar({
        open: true,
        message: 'Category created successfully',
        severity: 'success'
      });

      // Close dialog and refresh categories
      handleCloseCategoryDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save category: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CategoryIcon />}
            onClick={handleOpenCategoryDialog}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        variant="fullWidth"
      >
        <Tab label="Products" />
        <Tab label="Categories" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Products Tab */}
          {activeTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category ? product.category.name : '-'}</TableCell>
                        <TableCell>${product.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>{product.sku || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.active ? "Active" : "Disabled"}
                            color={product.active ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color={product.active ? "error" : "success"}
                            onClick={() => handleOpenDisableDialog(product)}
                            title={product.active ? "Disable Product" : "Enable Product"}
                          >
                            {product.active ? <DisableIcon /> : <EnableIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Categories Tab */}
          {activeTab === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Products Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>
                          {Array.isArray(products)
                            ? products.filter(p => p.category && p.category.id === category.id).length
                            : 0}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentProduct.id ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Product Name"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={currentProduct.description}
              onChange={handleInputChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={currentProduct.price}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="stockQuantity"
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                inputProps={{ min: 0 }}
                value={currentProduct.stockQuantity}
                onChange={handleInputChange}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                fullWidth
                id="sku"
                label="SKU"
                name="sku"
                value={currentProduct.sku}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                id="barcode"
                label="Barcode"
                name="barcode"
                value={currentProduct.barcode}
                onChange={handleInputChange}
              />
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={currentProduct.categoryId}
                label="Category"
                onChange={handleInputChange}
              >
                {Array.isArray(categories) ? (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>No categories available</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disable/Enable Confirmation Dialog */}
      <Dialog open={openDisableDialog} onClose={handleCloseDisableDialog}>
        <DialogTitle>
          {currentProduct.active ? 'Disable Product' : 'Enable Product'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {currentProduct.active
              ? `Are you sure you want to disable the product "${currentProduct.name}"? It will no longer be available for new orders.`
              : `Are you sure you want to enable the product "${currentProduct.name}"? It will be available for new orders.`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisableDialog}>Cancel</Button>
          <Button
            onClick={handleToggleProductStatus}
            color={currentProduct.active ? "error" : "success"}
            variant="contained"
          >
            {currentProduct.active ? 'Disable' : 'Enable'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Form Dialog */}
      <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Category Name"
              name="name"
              value={currentCategory.name}
              onChange={handleCategoryInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={currentCategory.description}
              onChange={handleCategoryInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
