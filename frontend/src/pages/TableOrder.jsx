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
  Receipt as ReceiptIcon,
  Remove as RemoveIcon,
  Edit as EditIcon
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
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    productId: '',
    quantity: 1,
    notes: ''
  });
  const [editMode, setEditMode] = useState(false);
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
      if (tableData.status === 'OCCUPIED' && tableData.currentOrder) {
        try {
          // Use the current order from the table data
          const orderData = tableData.currentOrder;

          // Initialize items array if it doesn't exist
          if (!orderData.orderItems) {
            orderData.orderItems = [];
          }

          // Rename orderItems to items for compatibility with the UI
          orderData.items = orderData.orderItems;

          setOrder(orderData);
        } catch (orderError) {
          console.error('Error processing order:', orderError);
          // If there's an error, just set it to null
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
      id: null,
      productId: '',
      quantity: 1,
      notes: ''
    });
    setEditMode(false);
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
  };

  const handleEditItem = (itemId) => {
    const item = order.items.find(i => i.id === itemId);
    if (item) {
      setCurrentItem({
        id: item.id,
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes || ''
      });
      setEditMode(true);
      setOpenAddItemDialog(true);
    }
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

      if (editMode) {
        // Edit existing item
        const existingItem = order.items.find(i => i.id === currentItem.id);
        if (!existingItem) {
          throw new Error('Item not found');
        }

        // Calculate the difference in subtotal
        const oldSubtotal = existingItem.subtotal;
        const newSubtotal = product.price * currentItem.quantity;
        const subtotalDifference = newSubtotal - oldSubtotal;

        // Update the item
        const updatedItems = order.items.map(item => {
          if (item.id === currentItem.id) {
            return {
              ...item,
              product: product,
              quantity: currentItem.quantity,
              unitPrice: product.price,
              subtotal: newSubtotal,
              notes: currentItem.notes
            };
          }
          return item;
        });

        setOrder({
          ...order,
          items: updatedItems,
          orderItems: updatedItems,
          totalAmount: parseFloat(order.totalAmount) + subtotalDifference
        });

        setSnackbar({
          open: true,
          message: 'Item updated successfully',
          severity: 'success'
        });
      } else {
        // Add new item
        const newItem = {
          id: Date.now(), // Temporary ID
          product: product,
          quantity: currentItem.quantity,
          unitPrice: product.price,
          subtotal: product.price * currentItem.quantity,
          notes: currentItem.notes
        };

        // Update both items and orderItems arrays
        const updatedItems = [...(order.items || []), newItem];

        setOrder({
          ...order,
          items: updatedItems,
          orderItems: updatedItems,
          totalAmount: (parseFloat(order.totalAmount) || 0) + newItem.subtotal
        });

        setSnackbar({
          open: true,
          message: 'Item added to order',
          severity: 'success'
        });
      }

      handleCloseAddItemDialog();
    } catch (error) {
      console.error('Error managing item:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${editMode ? 'update' : 'add'} item: ${error.message}`,
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

      // Filter out the item from both arrays
      const updatedItems = order.items.filter(i => i.id !== itemId);

      setOrder({
        ...order,
        items: updatedItems,
        orderItems: updatedItems,
        totalAmount: parseFloat(order.totalAmount) - item.subtotal
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
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                      <List sx={{ p: 0 }}>
                        {order.items.map((item, index) => (
                          <React.Fragment key={item.id}>
                            <ListItem
                              sx={{
                                py: 2,
                                backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                              }}
                              secondaryAction={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditItem(item.id)}
                                    sx={{ mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveItem(item.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              }
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 8 }}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.main',
                                  color: 'white',
                                  mr: 2
                                }}>
                                  <Typography variant="body1" fontWeight="bold">
                                    {item.quantity}
                                  </Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {item.product.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      ${item.unitPrice.toFixed(2)} each
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                                      ${item.subtotal.toFixed(2)}
                                    </Typography>
                                  </Box>
                                  {item.notes && (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                                      Note: {item.notes}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </ListItem>
                            {index < order.items.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Paper sx={{ textAlign: 'center', py: 3, mb: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        No items in this order
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Click "Add Item" to start adding products to this order
                      </Typography>
                    </Paper>
                  )}
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Tax:</Typography>
                    <Typography variant="body1">${(parseFloat(order.totalAmount || 0) * 0.1).toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary.main">
                      ${(parseFloat(order.totalAmount || 0) * 1.1).toFixed(2)}
                    </Typography>
                  </Box>
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

      {/* Add/Edit Item Dialog */}
      <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Order Item' : 'Add Item to Order'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="product-label">Select Product</InputLabel>
              <Select
                labelId="product-label"
                name="productId"
                value={currentItem.productId}
                label="Select Product"
                onChange={handleInputChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{product.name}</Typography>
                      <Typography variant="body2" color="primary">${product.price.toFixed(2)}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {currentItem.productId && (
            <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {products.find(p => p.id === currentItem.productId)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {products.find(p => p.id === currentItem.productId)?.description || 'No description available'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body1">
                  Price: ${products.find(p => p.id === currentItem.productId)?.price.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => setCurrentItem({
                      ...currentItem,
                      quantity: Math.max(1, currentItem.quantity - 1)
                    })}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    sx={{ width: '70px', mx: 1 }}
                    name="quantity"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={currentItem.quantity}
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setCurrentItem({
                      ...currentItem,
                      quantity: currentItem.quantity + 1
                    })}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  Subtotal: ${(products.find(p => p.id === currentItem.productId)?.price * currentItem.quantity).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}

          <TextField
            margin="dense"
            name="notes"
            label="Special Instructions"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={currentItem.notes}
            onChange={handleInputChange}
            placeholder="E.g., No onions, extra spicy, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddItemDialog}>Cancel</Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            color="primary"
            disabled={!currentItem.productId || currentItem.quantity < 1}
          >
            {editMode ? 'Update Item' : 'Add to Order'}
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
