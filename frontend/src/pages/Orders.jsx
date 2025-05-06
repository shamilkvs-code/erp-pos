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
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

// In a real app, we would import an OrderService
// import OrderService from '../services/OrderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          orderNumber: 'ORD-001',
          orderDate: '2023-05-15',
          customer: { id: 1, name: 'John Doe' },
          totalAmount: 125.50,
          status: 'COMPLETED',
          paymentMethod: 'CREDIT_CARD',
          items: [
            { id: 1, product: { id: 1, name: 'Laptop' }, quantity: 1, unitPrice: 100.00, subtotal: 100.00 },
            { id: 2, product: { id: 2, name: 'Mouse' }, quantity: 1, unitPrice: 25.50, subtotal: 25.50 }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          orderDate: '2023-05-14',
          customer: { id: 2, name: 'Jane Smith' },
          totalAmount: 89.99,
          status: 'COMPLETED',
          paymentMethod: 'CASH',
          items: [
            { id: 3, product: { id: 3, name: 'Headphones' }, quantity: 1, unitPrice: 89.99, subtotal: 89.99 }
          ]
        },
        {
          id: 3,
          orderNumber: 'ORD-003',
          orderDate: '2023-05-14',
          customer: { id: 3, name: 'Bob Johnson' },
          totalAmount: 210.75,
          status: 'PENDING',
          paymentMethod: 'DEBIT_CARD',
          items: [
            { id: 4, product: { id: 4, name: 'Monitor' }, quantity: 1, unitPrice: 199.99, subtotal: 199.99 },
            { id: 5, product: { id: 5, name: 'HDMI Cable' }, quantity: 1, unitPrice: 10.76, subtotal: 10.76 }
          ]
        },
        {
          id: 4,
          orderNumber: 'ORD-004',
          orderDate: '2023-05-13',
          customer: { id: 4, name: 'Alice Brown' },
          totalAmount: 45.25,
          status: 'COMPLETED',
          paymentMethod: 'MOBILE_PAYMENT',
          items: [
            { id: 6, product: { id: 6, name: 'USB Drive' }, quantity: 2, unitPrice: 22.50, subtotal: 45.00 },
            { id: 7, product: { id: 7, name: 'Sticker' }, quantity: 1, unitPrice: 0.25, subtotal: 0.25 }
          ]
        },
        {
          id: 5,
          orderNumber: 'ORD-005',
          orderDate: '2023-05-12',
          customer: { id: 5, name: 'Charlie Wilson' },
          totalAmount: 320.00,
          status: 'CANCELLED',
          paymentMethod: 'CREDIT_CARD',
          items: [
            { id: 8, product: { id: 8, name: 'Smartphone' }, quantity: 1, unitPrice: 320.00, subtotal: 320.00 }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
    return method.replace('_', ' ');
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
                        <TableCell>{order.customer.name}</TableCell>
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
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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
                    <TableCell colSpan={8} align="center">
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
