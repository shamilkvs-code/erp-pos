import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import {
  getTableById,
  getCurrentTableOrder,
  completeAndClearTable,
  getAllProducts
} from '../services/api';

const TableOrder = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchTableAndOrder();
    fetchProducts();
  }, [tableId]);

  const fetchTableAndOrder = async () => {
    setLoading(true);
    try {
      // Get table data from API
      const tableData = await getTableById(tableId);
      setTable(tableData);

      // Get current order for this table if it's occupied
      if (tableData.status === 'OCCUPIED') {
        try {
          const orderData = await getCurrentTableOrder(tableId);
          setOrder(orderData);
        } catch (orderError) {
          console.error('Error fetching order:', orderError);
          // If there's no current order, just set it to null
          setOrder(null);
        }
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching table or order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load table or order: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Get products from API
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load products: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleOpenAddItemDialog = () => {
    setCurrentItem({
      productId: '',
      quantity: 1,
      notes: ''
    });
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
  };

  const handleOpenCompleteDialog = () => {
    setOpenCompleteDialog(true);
  };

  const handleCloseCompleteDialog = () => {
    setOpenCompleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'quantity' ? parseInt(value, 10) : value
    });
  };

  const handleAddItem = async () => {
    try {
      // In a real app, you would call an API to add an item to the order
      // For now, we'll just update the local state
      const product = products.find(p => p.id === currentItem.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const newItem = {
        id: Date.now(), // Temporary ID
        product: product,
        quantity: currentItem.quantity,
        unitPrice: product.price,
        subtotal: product.price * currentItem.quantity,
        notes: currentItem.notes
      };

      setOrder({
        ...order,
        items: [...(order.items || []), newItem],
        totalAmount: (order.totalAmount || 0) + newItem.subtotal
      });

      setSnackbar({
        open: true,
        message: 'Item added to order',
        severity: 'success'
      });
      handleCloseAddItemDialog();
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add item: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      // In a real app, you would call an API to remove an item from the order
      // For now, we'll just update the local state
      const item = order.items.find(i => i.id === itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      setOrder({
        ...order,
        items: order.items.filter(i => i.id !== itemId),
        totalAmount: order.totalAmount - item.subtotal
      });

      setSnackbar({
        open: true,
        message: 'Item removed from order',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to remove item: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await completeAndClearTable(order.id);
      setSnackbar({
        open: true,
        message: 'Order completed and table cleared',
        severity: 'success'
      });
      handleCloseCompleteDialog();
      navigate('/tables');
    } catch (error) {
      console.error('Error completing order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to complete order: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'DINE_IN':
        return 'Dine In';
      case 'TAKEOUT':
        return 'Takeout';
      case 'DELIVERY':
        return 'Delivery';
      default:
        return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!table) {
    return (
      <Box>
        <Typography variant="h5" color="error">Table not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tables')}
          sx={{ mt: 2 }}
        >
          Back to Tables
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tables')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Table {table.tableNumber} Order
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Table Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Table Information
              </Typography>
              <Typography variant="body1">
                <strong>Table Number:</strong> {table.tableNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Capacity:</strong> {table.capacity} people
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {table.status}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {table.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Information */}
        <Grid item xs={12} md={8}>
          {order ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Order #{order.orderNumber}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body1">
                  <strong>Type:</strong> {getOrderTypeLabel(order.orderType)}
                </Typography>
                <Typography variant="body1">
                  <strong>Guests:</strong> {order.numberOfGuests}
                </Typography>
                {order.specialInstructions && (
                  <Typography variant="body1">
                    <strong>Special Instructions:</strong> {order.specialInstructions}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Order Items</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleOpenAddItemDialog}
                    >
                      Add Item
                    </Button>
                  </Box>
                  {order.items && order.items.length > 0 ? (
                    <List>
                      {order.items.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={`${item.quantity}x ${item.product.name}`}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2">
                                    ${item.unitPrice.toFixed(2)} each
                                  </Typography>
                                  {item.notes && (
                                    <Typography component="span" variant="body2" sx={{ display: 'block', fontStyle: 'italic' }}>
                                      Note: {item.notes}
                                    </Typography>
                                  )}
                                </>
                              }
                            />
                            <Typography variant="body1" sx={{ ml: 2, fontWeight: 'bold' }}>
                              ${item.subtotal.toFixed(2)}
                            </Typography>
                          </ListItem>
                          {index < order.items.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                      No items in this order
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 1 }}>
                  <Typography variant="h6" align="right">
                    Total: ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  sx={{ mr: 1 }}
                >
                  Print Receipt
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleOpenCompleteDialog}
                >
                  Complete Order
                </Button>
              </CardActions>
            </Card>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No active order for this table</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create a new order to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/tables')}
              >
                Create Order
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Add Item Dialog */}
      <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Item to Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              name="productId"
              value={currentItem.productId}
              label="Product"
              onChange={handleInputChange}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - ${product.price.toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={currentItem.quantity}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            margin="dense"
            name="notes"
            label="Special Instructions"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            value={currentItem.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddItemDialog}>Cancel</Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            disabled={!currentItem.productId}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Order Dialog */}
      <Dialog open={openCompleteDialog} onClose={handleCloseCompleteDialog}>
        <DialogTitle>Complete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to complete this order and clear the table?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteDialog}>Cancel</Button>
          <Button onClick={handleCompleteOrder} color="success" variant="contained">
            Complete Order
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TableOrder;
