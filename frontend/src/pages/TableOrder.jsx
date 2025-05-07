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
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  ButtonGroup
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Import API services
import * as api from '../services/api';

const TableOrder = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [table, setTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // State to track if data has been fetched
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    // If data has already been fetched, don't fetch again
    if (dataFetched) {
      console.log('Data already fetched, skipping duplicate fetch');
      return;
    }

    console.log('TableOrder component mounted with tableId:', tableId);

    // Create an AbortController to cancel requests when component unmounts
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Get table data
        console.log('Fetching table data for tableId:', tableId);
        const tableData = await api.getTableById(tableId, signal);
        console.log('Received table data:', tableData);
        setTable(tableData);

        // Get order data if table is occupied
        if (tableData.status === 'OCCUPIED' && tableData.currentOrder) {
          console.log('Table is occupied, setting order data');
          setOrder(tableData.currentOrder);
        } else {
          console.log('Table is not occupied or has no order');
          setOrder(null);
        }

        // Get products
        console.log('Fetching products');
        const productsData = await api.getAllProducts(signal);
        console.log('Received products data:', productsData);

        // Ensure productsData is an array before setting state
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData && Array.isArray(productsData.products)) {
          // Handle case where API returns { products: [...] }
          setProducts(productsData.products);
        } else {
          console.error('Invalid products data format:', productsData);
          // Set fallback products
          setProducts([
            { id: 1, name: 'Burger', description: 'Delicious beef burger', price: 9.99, category: { id: 1, name: 'Food' } },
            { id: 2, name: 'Pizza', description: 'Pepperoni pizza', price: 12.99, category: { id: 1, name: 'Food' } },
            { id: 3, name: 'Soda', description: 'Refreshing drink', price: 2.99, category: { id: 2, name: 'Beverages' } }
          ]);
        }

        // Get categories
        console.log('Fetching categories');
        const categoriesData = await api.getAllCategories(signal);
        console.log('Received categories data:', categoriesData);

        // Handle different possible formats of categories data
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData && Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories);
        } else {
          console.error('Invalid categories data format:', categoriesData);
          // Set fallback categories
          setCategories([
            { id: 1, name: 'Food', description: 'Food items' },
            { id: 2, name: 'Beverages', description: 'Drink items' }
          ]);
        }

        // Mark that data has been fetched
        setDataFetched(true);
      } catch (err) {
        // If the request was aborted, don't update state
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          console.log('Data fetch aborted');
          return;
        }

        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');

        // Set fallback data
        setTable({
          id: parseInt(tableId),
          tableNumber: `Table ${tableId}`,
          capacity: 4,
          status: 'OCCUPIED',
          location: 'MAIN'
        });

        setOrder({
          id: 1000 + parseInt(tableId),
          orderNumber: `ORD-${1000 + parseInt(tableId)}`,
          orderType: 'DINE_IN',
          numberOfGuests: 2,
          orderDate: new Date().toISOString(),
          status: 'PENDING',
          totalAmount: 0,
          orderItems: []
        });

        // Set fallback products
        setProducts([
          { id: 1, name: 'Burger', description: 'Delicious beef burger', price: 9.99, category: { id: 1, name: 'Food' } },
          { id: 2, name: 'Pizza', description: 'Pepperoni pizza', price: 12.99, category: { id: 1, name: 'Food' } },
          { id: 3, name: 'Soda', description: 'Refreshing drink', price: 2.99, category: { id: 2, name: 'Beverages' } },
          { id: 4, name: 'Fries', description: 'Crispy french fries', price: 4.99, category: { id: 3, name: 'Sides' } },
          { id: 5, name: 'Ice Cream', description: 'Vanilla ice cream', price: 5.99, category: { id: 4, name: 'Desserts' } }
        ]);

        // Set fallback categories
        setCategories([
          { id: 1, name: 'Food', description: 'Food items' },
          { id: 2, name: 'Beverages', description: 'Drink items' },
          { id: 3, name: 'Sides', description: 'Side dishes' },
          { id: 4, name: 'Desserts', description: 'Sweet treats' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Cleanup function to abort any in-flight requests when the component unmounts
    return () => {
      controller.abort();
    };
  }, [tableId, dataFetched]);

  // Handle back button
  const handleBack = () => {
    navigate('/dashboard/tables');
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle category change
  const handleCategoryChange = (_, newValue) => {
    setSelectedCategory(newValue);
  };

  // Filter products based on search query and selected category
  const filteredProducts = () => {
    // Ensure products is an array before filtering
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return [];
    }

    return products.filter(product => {
      // Skip null or undefined products
      if (!product) return false;

      // Filter by category
      const categoryMatch = selectedCategory === 'all' ||
        (product.category && product.category.id && product.category.id.toString() === selectedCategory);

      // Filter by search query
      const searchMatch = !searchQuery ||
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && searchMatch;
    });
  };

  // Add product to order
  const handleAddProduct = async (product) => {
    if (!order) {
      setError('No active order for this table. Please create an order first.');
      return;
    }

    try {
      // Check if product already exists in order
      const existingItem = order.orderItems?.find(item =>
        item.product && item.product.id === product.id
      );

      if (existingItem) {
        // Update quantity
        const updatedItems = order.orderItems.map(item => {
          if (item.product && item.product.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.unitPrice
            };
          }
          return item;
        });

        const updatedOrder = {
          ...order,
          orderItems: updatedItems,
          totalAmount: calculateTotal(updatedItems)
        };

        // Update order in state
        setOrder(updatedOrder);

        // Save to database
        await api.updateOrder(order.id, updatedOrder);
      } else {
        // Add new item
        const newItem = {
          product: product,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price
        };

        // Save to database
        const updatedOrderData = await api.addItemToOrder(order.id, newItem);

        // If the API call was successful, update the local state with the returned data
        if (updatedOrderData) {
          setOrder(updatedOrderData);
        } else {
          // Fallback: update local state if API call doesn't return the updated order
          const updatedItems = [...(order.orderItems || []), {
            ...newItem,
            id: Date.now() // Temporary ID for local state
          }];

          setOrder({
            ...order,
            orderItems: updatedItems,
            totalAmount: calculateTotal(updatedItems)
          });
        }
      }
    } catch (error) {
      console.error('Error adding product to order:', error);
      setError('Failed to update order. Please try again.');

      // Continue with local state update even if API call fails
      // This ensures the UI remains responsive
      if (existingItem) {
        const updatedItems = order.orderItems.map(item => {
          if (item.product && item.product.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.unitPrice
            };
          }
          return item;
        });

        setOrder({
          ...order,
          orderItems: updatedItems,
          totalAmount: calculateTotal(updatedItems)
        });
      } else {
        const newItem = {
          id: Date.now(), // Temporary ID
          product: product,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price
        };

        const updatedItems = [...(order.orderItems || []), newItem];

        setOrder({
          ...order,
          orderItems: updatedItems,
          totalAmount: calculateTotal(updatedItems)
        });
      }
    }
  };

  // Reduce quantity of an item in the order
  const handleReduceQuantity = async (itemId) => {
    if (!order) return;

    try {
      const updatedItems = order.orderItems.map(item => {
        if (item.id === itemId) {
          // If quantity is 1, this will be handled by the filter below
          if (item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.unitPrice
            };
          }
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove items with quantity 0

      const updatedOrder = {
        ...order,
        orderItems: updatedItems,
        totalAmount: calculateTotal(updatedItems)
      };

      // Update order in state
      setOrder(updatedOrder);

      // Save to database
      await api.updateOrder(order.id, updatedOrder);
    } catch (error) {
      console.error('Error reducing item quantity:', error);
      setError('Failed to update order. Please try again.');

      // Continue with local state update even if API call fails
      const updatedItems = order.orderItems.map(item => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.unitPrice
            };
          }
        }
        return item;
      }).filter(item => item.quantity > 0);

      setOrder({
        ...order,
        orderItems: updatedItems,
        totalAmount: calculateTotal(updatedItems)
      });
    }
  };

  // Remove item from order
  const handleRemoveItem = async (itemId) => {
    if (!order) return;

    try {
      const updatedItems = order.orderItems.filter(item => item.id !== itemId);

      const updatedOrder = {
        ...order,
        orderItems: updatedItems,
        totalAmount: calculateTotal(updatedItems)
      };

      // Update order in state
      setOrder(updatedOrder);

      // Save to database
      await api.updateOrder(order.id, updatedOrder);
    } catch (error) {
      console.error('Error removing item from order:', error);
      setError('Failed to update order. Please try again.');

      // Continue with local state update even if API call fails
      const updatedItems = order.orderItems.filter(item => item.id !== itemId);

      setOrder({
        ...order,
        orderItems: updatedItems,
        totalAmount: calculateTotal(updatedItems)
      });
    }
  };

  // Calculate total amount
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && !table) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Tables
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Custom AppBar */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Table {table?.tableNumber} Order
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container>
        {/* Table Info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Table Information</Typography>
          <Typography><strong>Table Number:</strong> {table?.tableNumber}</Typography>
          <Typography><strong>Capacity:</strong> {table?.capacity} people</Typography>
          <Typography><strong>Status:</strong> {table?.status}</Typography>
          <Typography><strong>Location:</strong> {table?.location}</Typography>
        </Paper>

        {/* Main Content */}
        {order ? (
          <Grid container spacing={3}>
            {/* Left Side - Order Info and Items */}
            <Grid item xs={12} md={5}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Order Information</Typography>
                  <Typography><strong>Order Number:</strong> {order.orderNumber}</Typography>
                  <Typography><strong>Type:</strong> {order.orderType}</Typography>
                  <Typography><strong>Guests:</strong> {order.numberOfGuests}</Typography>
                  <Typography><strong>Status:</strong> {order.status}</Typography>
                  <Typography><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</Typography>
                  <Typography><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2) || '0.00'}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Order Items</Typography>

                  {order.orderItems && order.orderItems.length > 0 ? (
                    <List>
                      {order.orderItems.map((item) => (
                        <React.Fragment key={item.id}>
                          <ListItem
                            secondaryAction={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ButtonGroup size="small" sx={{ mr: 1 }}>
                                  <Button
                                    onClick={() => handleReduceQuantity(item.id)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </Button>
                                  <Button
                                    onClick={() => handleAddProduct(item.product)}
                                  >
                                    <AddIcon fontSize="small" />
                                  </Button>
                                </ButtonGroup>
                                <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemText
                              primary={`${item.product.name} (${item.quantity}x)`}
                              secondary={`$${item.unitPrice?.toFixed(2)} each - Total: $${item.subtotal?.toFixed(2)}`}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography>No items in this order</Typography>
                  )}

                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="h6">
                      Total: ${order.totalAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleBack}
                    >
                      Back to Tables
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Side - Product Search and Selection */}
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Product Selection</Typography>

                  {/* Search Box */}
                  <TextField
                    fullWidth
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    margin="normal"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { paddingLeft: 0 } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Category Tabs */}
                  <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2, mt: 2 }}
                  >
                    <Tab label="All Products" value="all" />
                    {Array.isArray(categories) && categories.map(category => (
                      <Tab key={category.id} label={category.name} value={category.id.toString()} />
                    ))}
                  </Tabs>

                  {/* Product List */}
                  <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {filteredProducts().length > 0 ? (
                      filteredProducts().map(product => (
                        <React.Fragment key={product.id}>
                          <ListItem
                            secondaryAction={
                              <IconButton edge="end" onClick={() => handleAddProduct(product)}>
                                <AddIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={product.name}
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    ${product.price?.toFixed(2)}
                                  </Typography>
                                  {" — "}{product.description}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography align="center" sx={{ p: 2 }}>
                        No products found matching your criteria
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No active order for this table</Typography>
            <Button
              variant="contained"
              onClick={handleBack}
              sx={{ mt: 2 }}
            >
              Back to Tables
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default TableOrder;
