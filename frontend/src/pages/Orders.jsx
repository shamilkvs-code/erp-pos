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
  Chip,
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
  Collapse,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  TableRestaurant as TableIcon
} from '@mui/icons-material';
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByType
} from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState({});
  const [orderTypeFilter, setOrderTypeFilter] = useState('ALL');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchOrders();
  }, [orderTypeFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders from the API
      let data;
      if (orderTypeFilter === 'ALL') {
        data = await getAllOrders();
      } else {
        data = await getOrdersByType(orderTypeFilter);
      }

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderTypeFilterChange = (event) => {
    setOrderTypeFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  useEffect(() => {
    fetchOrders();
  }, [orderTypeFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRow = (id) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatPaymentMethod = (method) => {
    return method ? method.replace('_', ' ') : 'N/A';
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Orders
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel id="order-type-filter-label">Order Type</InputLabel>
            <Select
              labelId="order-type-filter-label"
              id="order-type-filter"
              value={orderTypeFilter}
              label="Order Type"
              onChange={handleOrderTypeFilterChange}
            >
              <MenuItem value="ALL">All Orders</MenuItem>
              <MenuItem value="DINE_IN">Dine In</MenuItem>
              <MenuItem value="TAKEOUT">Takeout</MenuItem>
              <MenuItem value="DELIVERY">Delivery</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSnackbar({
                open: true,
                message: 'Order creation would be implemented in a real app',
                severity: 'info'
              });
            }}
          >
            New Order
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleRow(order.id)}
                          >
                            {openRows[order.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                        <TableCell>{order.orderType ? getOrderTypeLabel(order.orderType) : 'N/A'}</TableCell>
                        <TableCell>
                          {order.table ? (
                            <Chip
                              icon={<TableIcon fontSize="small" />}
                              label={`Table ${order.table.tableNumber}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatPaymentMethod(order.paymentMethod)}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSnackbar({
                                open: true,
                                message: 'Order editing would be implemented in a real app',
                                severity: 'info'
                              });
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSnackbar({
                                open: true,
                                message: 'Order deletion would be implemented in a real app',
                                severity: 'info'
                              });
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                          <Collapse in={openRows[order.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Order Items
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Subtotal</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.product.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                                      <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

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

export default Orders;
