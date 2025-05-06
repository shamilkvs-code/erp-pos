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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ToggleOff as DisableIcon,
  ToggleOn as EnableIcon
} from '@mui/icons-material';
import ProductService from '../services/ProductService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProducts();
    // In a real app, we would fetch categories from an API
    setCategories([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Food & Beverages' },
      { id: 4, name: 'Home & Garden' }
    ]);
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    ProductService.getAllProducts()
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load products',
          severity: 'error'
        });
        setLoading(false);
      });
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
      ProductService.updateProduct(currentProduct.id, productData)
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
            message: 'Failed to update product',
            severity: 'error'
          });
        });
    } else {
      // Create new product
      ProductService.createProduct(productData)
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
            message: 'Failed to create product',
            severity: 'error'
          });
        });
    }
  };

  const handleToggleProductStatus = () => {
    const isDisabling = currentProduct.active;
    const action = isDisabling ?
      ProductService.disableProduct(currentProduct.id) :
      ProductService.enableProduct(currentProduct.id);

    action
      .then((response) => {
        fetchProducts();
        handleCloseDisableDialog();
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        });
      })
      .catch(error => {
        console.error(`Error ${isDisabling ? 'disabling' : 'enabling'} product:`, error);
        setSnackbar({
          open: true,
          message: `Failed to ${isDisabling ? 'disable' : 'enable'} product`,
          severity: 'error'
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category ? product.category.name : '-'}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
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
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
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
