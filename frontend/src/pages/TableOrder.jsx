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
  List,
  ListItem,
  ListItemText,
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
        // Get table data using the correct API endpoint: GET /api/tables/{id}
        console.log('Fetching table data for tableId using GET /api/tables/' + tableId);
        const tableData = await api.getTableById(tableId, signal);
        console.log('Received table data:', tableData);
        setTable(tableData);

        // Try to get the current order for this table using the correct API endpoint: GET /api/orders/table/{tableId}/current
        try {
          console.log('Fetching current order for table using GET /api/orders/table/' + tableId + '/current');
          const currentOrder = await api.getCurrentTableOrder(tableId, signal);
          console.log('Current order data:', currentOrder);

          if (currentOrder) {
            console.log('Setting current order data');

            // Check if currentOrder is a string (possibly a JSON string)
            if (typeof currentOrder === 'string') {
              try {
                console.log('Current order is a string, attempting to parse as JSON');
                const parsedOrder = JSON.parse(currentOrder);
                console.log('Successfully parsed order data:', parsedOrder);

                // Ensure the parsed order has the expected structure
                const processedOrder = {
                  ...parsedOrder,
                  orderItems: parsedOrder.orderItems || [],
                  totalAmount: parsedOrder.totalAmount || 0
                };

                setOrder(processedOrder);
              } catch (parseError) {
                console.error('Error parsing order data as JSON:', parseError);
                // If parsing fails, set order to null
                setOrder(null);
              }
            } else {
              // Ensure the order has the expected structure
              const processedOrder = {
                ...currentOrder,
                orderItems: currentOrder.orderItems || [],
                totalAmount: currentOrder.totalAmount || 0
              };

              setOrder(processedOrder);
            }
          } else {
            console.log('No current order found for this table');
            setOrder(null);
          }
        } catch (orderError) {
          console.error('Error fetching current order:', orderError);

          // Fallback to using the order from table data
          if (tableData.status === 'OCCUPIED' && tableData.currentOrder) {
            console.log('Falling back to order data from table');
            setOrder(tableData.currentOrder);
          } else {
            console.log('No order data available');
            setOrder(null);
          }
        }

        // Get products
        console.log('Fetching products');
        const productsData = await api.getAllProducts(signal);
        console.log('Received products data:', productsData);

        // Ensure productsData is an array before setting state
        if (Array.isArray(productsData)) {
          console.log('Setting products from array, length:', productsData.length);

          // Validate each product has required fields
          const validProducts = productsData.map(product => {
            // Ensure product has all required fields
            if (!product.id) product.id = Date.now() + Math.floor(Math.random() * 1000);
            if (!product.name) product.name = 'Unknown Product';
            if (!product.price) product.price = 0;
            if (!product.description) product.description = 'No description available';

            // Ensure product has a category
            if (!product.category) {
              product.category = { id: 1, name: 'Uncategorized' };
            } else if (typeof product.category === 'number') {
              // Convert number to object
              product.category = { id: product.category, name: `Category ${product.category}` };
            } else if (typeof product.category === 'string') {
              // Convert string to object
              product.category = { id: 1, name: product.category };
            }

            return product;
          });

          console.log('Setting validated products:', validProducts);
          setProducts(validProducts);
        } else if (productsData && Array.isArray(productsData.products)) {
          // Handle case where API returns { products: [...] }
          console.log('Setting products from nested array, length:', productsData.products.length);

          // Validate each product has required fields
          const validProducts = productsData.products.map(product => {
            // Ensure product has all required fields
            if (!product.id) product.id = Date.now() + Math.floor(Math.random() * 1000);
            if (!product.name) product.name = 'Unknown Product';
            if (!product.price) product.price = 0;
            if (!product.description) product.description = 'No description available';

            // Ensure product has a category
            if (!product.category) {
              product.category = { id: 1, name: 'Uncategorized' };
            } else if (typeof product.category === 'number') {
              // Convert number to object
              product.category = { id: product.category, name: `Category ${product.category}` };
            } else if (typeof product.category === 'string') {
              // Convert string to object
              product.category = { id: 1, name: product.category };
            }

            return product;
          });

          console.log('Setting validated products from nested array:', validProducts);
          setProducts(validProducts);
        } else {
          console.error('Invalid products data format:', productsData);
          // Set empty products array
          console.log('Setting empty products array');
          setProducts([]);
        }

        // Get categories
        console.log('Fetching categories');
        const categoriesData = await api.getAllCategories(signal);
        console.log('Received categories data:', categoriesData);

        // Handle different possible formats of categories data
        if (categoriesData && Array.isArray(categoriesData)) {
          console.log('Setting categories from array, length:', categoriesData.length);

          // Validate each category has required fields
          const validCategories = categoriesData.map(category => {
            // Ensure category has all required fields
            if (!category.id) category.id = Date.now() + Math.floor(Math.random() * 1000);
            if (!category.name) category.name = 'Unknown Category';
            if (!category.description) category.description = 'No description available';

            return category;
          });

          console.log('Setting validated categories:', validCategories);
          setCategories(validCategories);
        } else if (categoriesData && Array.isArray(categoriesData.categories)) {
          console.log('Setting categories from nested array, length:', categoriesData.categories.length);

          // Validate each category has required fields
          const validCategories = categoriesData.categories.map(category => {
            // Ensure category has all required fields
            if (!category.id) category.id = Date.now() + Math.floor(Math.random() * 1000);
            if (!category.name) category.name = 'Unknown Category';
            if (!category.description) category.description = 'No description available';

            return category;
          });

          console.log('Setting validated categories from nested array:', validCategories);
          setCategories(validCategories);
        } else {
          console.error('Invalid categories data format:', categoriesData);
          // Set empty categories array
          console.log('Setting empty categories array');
          setCategories([]);
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

        // Set minimal required data
        setTable({
          id: parseInt(tableId),
          tableNumber: `Table ${tableId}`,
          capacity: 0,
          status: 'AVAILABLE',
          location: ''
        });

        // No order for this table
        setOrder(null);

        // Empty products and categories
        setProducts([]);
        setCategories([]);
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
  const handleBack = async () => {
    try {
      // If there's an active order, make sure it's saved to the database before navigating away
      if (order) {
        console.log('Saving order before navigating back:', order);

        // Skip saving if the order has a temporary ID (not yet saved to database)
        if (order.id && order.id !== Date.now()) {
          // Ensure order has all required fields
          const orderToSave = {
            ...order,
            orderDate: order.orderDate || new Date().toISOString(),
            status: order.status || 'PENDING',
            orderItems: order.orderItems || [],
            totalAmount: order.totalAmount || calculateTotal(order.orderItems || [])
          };

          try {
            // Update the order in the database
            await api.updateOrder(order.id, orderToSave);
            console.log('Order saved successfully before navigation');
          } catch (error) {
            console.error('Error saving order before navigation:', error);
            // Continue with navigation even if save fails
          }
        } else {
          console.log('Order has a temporary ID, attempting to save using correct table cart endpoint: POST /api/orders/table/' + tableId + '/cart');

          // If the order has a temporary ID, try to save it using the table cart endpoint
          try {
            // Only save if there are items in the order
            if (order.orderItems && order.orderItems.length > 0) {
              const firstItem = order.orderItems[0];

              // Use the first item to create an order with the correct API endpoint
              console.log('Creating order with first item using POST /api/orders/table/' + tableId + '/cart');
              await api.addItemToTableCart(tableId, {
                product: firstItem.product,
                quantity: firstItem.quantity,
                unitPrice: firstItem.unitPrice,
                numberOfGuests: order.numberOfGuests || 1,
                specialInstructions: order.specialInstructions || ""
              });

              console.log('First item saved successfully');

              // If there are more items, save them too
              if (order.orderItems.length > 1) {
                // Get the current order for this table to get its ID using the correct API endpoint
                console.log('Fetching current order using GET /api/orders/table/' + tableId + '/current');
                const currentOrder = await api.getCurrentTableOrder(tableId);

                if (currentOrder && currentOrder.id) {
                  console.log('Saving remaining items to order:', currentOrder.id);

                  // Save the remaining items using the correct API endpoint
                  for (let i = 1; i < order.orderItems.length; i++) {
                    const item = order.orderItems[i];

                    console.log(`Adding item ${i+1} to order ${currentOrder.id} using POST /api/orders/${currentOrder.id}/items`);
                    await api.addItemToOrder(currentOrder.id, {
                      product: item.product,
                      quantity: item.quantity,
                      unitPrice: item.unitPrice,
                      specialInstructions: item.specialInstructions || ""
                    });

                    console.log(`Item ${i+1} saved successfully`);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error saving temporary order before navigation:', error);
            // Continue with navigation even if save fails
          }
        }
      }
    } catch (error) {
      console.error('Error in handleBack:', error);
    } finally {
      // Navigate back to tables screen
      navigate('/dashboard/tables');
    }
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle category change
  const handleCategoryChange = (_, newValue) => {
    setSelectedCategory(newValue);
  };

  // Debug function to log product data
  const debugProducts = () => {
    console.log('DEBUG - Products state:', products);
    console.log('DEBUG - Products length:', products.length);
    console.log('DEBUG - Products is array:', Array.isArray(products));

    if (products.length > 0) {
      console.log('DEBUG - First product:', products[0]);
      console.log('DEBUG - First product category:', products[0].category);
      console.log('DEBUG - First product category type:', typeof products[0].category);
    }

    return null;
  };

  // Debug function to log render state
  const debugRender = () => {
    console.log('DEBUG - RENDER STATE:');
    console.log('DEBUG - Table:', table);
    console.log('DEBUG - Order:', order);
    console.log('DEBUG - Products:', products);
    console.log('DEBUG - Categories:', categories);
    console.log('DEBUG - Loading:', loading);
    console.log('DEBUG - Error:', error);
    console.log('DEBUG - DataFetched:', dataFetched);
    console.log('DEBUG - Selected Category:', selectedCategory);

    return null;
  };

  // Call debug functions
  debugProducts();
  debugRender();

  // Filter products based on search query and selected category
  const filteredProducts = () => {
    // Ensure products is an array before filtering
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return [];
    }

    if (products.length === 0) {
      console.warn('Products array is empty');
      return [];
    }

    console.log('Filtering products array of length:', products.length);
    console.log('Selected category:', selectedCategory);
    console.log('Search query:', searchQuery);

    const filtered = products.filter(product => {
      // Skip null or undefined products
      if (!product) {
        console.warn('Skipping null/undefined product');
        return false;
      }

      if (!product.name) {
        console.warn('Product missing name:', product);
        return false;
      }

      if (product.price === undefined || product.price === null) {
        console.warn('Product missing price:', product);
      }

      // Filter by category
      let categoryMatch = selectedCategory === 'all';

      if (!categoryMatch && product.category) {
        // Handle different category formats
        if (typeof product.category === 'object' && product.category !== null) {
          categoryMatch = product.category.id && product.category.id.toString() === selectedCategory;
        } else if (typeof product.category === 'number') {
          categoryMatch = product.category.toString() === selectedCategory;
        } else if (typeof product.category === 'string') {
          categoryMatch = product.category === selectedCategory;
        }
      }

      // Filter by search query
      const searchMatch = !searchQuery ||
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const result = categoryMatch && searchMatch;
      console.log(`Product ${product.name}: categoryMatch=${categoryMatch}, searchMatch=${searchMatch}, result=${result}`);

      return result;
    });

    console.log('Filtered products count:', filtered.length);
    return filtered;
  };

  // Add product to order
  const handleAddProduct = async (product) => {
    console.log('Adding product to order:', product);

    try {
      // Update local state first for immediate UI feedback
      let localOrder = order;
      let localOrderItems = [];
      let existingItem = null;

      if (localOrder) {
        // Ensure order.orderItems is an array
        localOrderItems = localOrder.orderItems || [];

        // Check if product already exists in order
        existingItem = localOrderItems.find(item =>
          item.product && item.product.id === product.id
        );
      }

      // Update local state based on whether the item exists
      if (existingItem) {
        console.log('Product already exists in order, updating quantity locally');

        // Update quantity in local state
        const updatedItems = localOrderItems.map(item => {
          if (item.product && item.product.id === product.id) {
            const newQuantity = item.quantity + 1;
            const newSubtotal = newQuantity * item.unitPrice;

            console.log(`Updating quantity from ${item.quantity} to ${newQuantity}`);
            console.log(`Updating subtotal from ${item.subtotal} to ${newSubtotal}`);

            return {
              ...item,
              quantity: newQuantity,
              subtotal: newSubtotal
            };
          }
          return item;
        });

        const newTotal = calculateTotal(updatedItems);
        console.log(`Updating total from ${localOrder.totalAmount} to ${newTotal}`);

        const updatedOrder = {
          ...localOrder,
          orderItems: updatedItems,
          totalAmount: newTotal
        };

        // Update local state
        setOrder(updatedOrder);
        localOrder = updatedOrder;
      } else if (localOrder) {
        console.log('Product does not exist in order, adding new item locally');

        // Add new item to local state
        const newItem = {
          id: Date.now(), // Temporary ID for local state
          product: product,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price
        };

        const updatedItems = [...localOrderItems, newItem];
        const newTotal = calculateTotal(updatedItems);

        const updatedOrder = {
          ...localOrder,
          orderItems: updatedItems,
          totalAmount: newTotal
        };

        // Update local state
        setOrder(updatedOrder);
        localOrder = updatedOrder;
      } else {
        console.log('No existing order, creating temporary local order');

        // Create a temporary local order
        const newItem = {
          id: Date.now(), // Temporary ID for local state
          product: product,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price
        };

        const newOrder = {
          id: Date.now(), // Temporary ID for local state
          tableId: parseInt(tableId),
          orderNumber: `ORD-${Date.now()}`,
          orderType: 'DINE_IN',
          numberOfGuests: 1,
          orderDate: new Date().toISOString(),
          status: 'PENDING',
          totalAmount: product.price,
          orderItems: [newItem]
        };

        // Update local state
        setOrder(newOrder);
        localOrder = newOrder;

        // Update table status locally
        const updatedTable = { ...table, status: 'OCCUPIED', currentOrder: newOrder };
        setTable(updatedTable);
      }

      // Now save to the database using the correct table cart endpoint: POST /api/orders/table/{tableId}/cart
      console.log('Saving to database using correct API endpoint: POST /api/orders/table/' + tableId + '/cart');

      const itemToAdd = {
        product: product,
        quantity: 1,
        unitPrice: product.price,
        // If we have an existing order, include its ID
        orderId: localOrder && localOrder.id !== Date.now() ? localOrder.id : null,
        // Include number of guests for new orders
        numberOfGuests: 1,
        // Include special instructions if needed
        specialInstructions: ""
      };

      console.log('Item data being sent to cart endpoint:', itemToAdd);
      const savedOrder = await api.addItemToTableCart(tableId, itemToAdd);
      console.log('Item added to table cart in database:', savedOrder);

      // Process the saved order
      if (savedOrder) {
        // Check if savedOrder is a string (possibly a JSON string)
        if (typeof savedOrder === 'string') {
          try {
            console.log('Saved order is a string, attempting to parse as JSON');
            const parsedOrder = JSON.parse(savedOrder);
            console.log('Successfully parsed order data:', parsedOrder);

            // Ensure the parsed order has the expected structure
            const processedOrder = {
              ...parsedOrder,
              orderItems: parsedOrder.orderItems || [],
              totalAmount: parsedOrder.totalAmount || 0
            };

            setOrder(processedOrder);

            // Update table status
            const updatedTable = { ...table, status: 'OCCUPIED', currentOrder: processedOrder };
            setTable(updatedTable);
          } catch (parseError) {
            console.error('Error parsing order data as JSON:', parseError);
            // If parsing fails, keep the local state
          }
        } else {
          // Ensure the saved order has the expected structure
          const processedOrder = {
            ...savedOrder,
            orderItems: savedOrder.orderItems || [],
            totalAmount: savedOrder.totalAmount || 0
          };

          setOrder(processedOrder);

          // Update table status
          const updatedTable = { ...table, status: 'OCCUPIED', currentOrder: processedOrder };
          setTable(updatedTable);
        }
      }
    } catch (error) {
      console.error('Error adding product to order:', error);
      setError('Failed to update order. Please try again.');

      // Continue with local state update even if all API calls fail
      // This ensures the UI remains responsive

      if (order) {
        // Ensure order.orderItems is an array
        if (!order.orderItems) {
          order.orderItems = [];
        }

        // Check if product already exists in order
        const existingItem = order.orderItems.find(item =>
          item.product && item.product.id === product.id
        );

        if (existingItem) {
          const updatedItems = order.orderItems.map(item => {
            if (item.product && item.product.id === product.id) {
              const newQuantity = item.quantity + 1;
              return {
                ...item,
                quantity: newQuantity,
                subtotal: newQuantity * item.unitPrice
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

          const updatedItems = [...order.orderItems, newItem];

          setOrder({
            ...order,
            orderItems: updatedItems,
            totalAmount: calculateTotal(updatedItems)
          });
        }
      } else {
        // Create a new local order if there's no existing order
        const newItem = {
          id: Date.now(), // Temporary ID
          product: product,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price
        };

        const newOrder = {
          id: Date.now(), // Temporary ID
          tableId: parseInt(tableId),
          orderNumber: `ORD-${Date.now()}`,
          orderType: 'DINE_IN',
          numberOfGuests: 1,
          orderDate: new Date().toISOString(),
          status: 'PENDING',
          totalAmount: product.price,
          orderItems: [newItem]
        };

        setOrder(newOrder);

        // Update table status locally
        const updatedTable = { ...table, status: 'OCCUPIED', currentOrder: newOrder };
        setTable(updatedTable);
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
        <Grid container spacing={3}>
          {/* Left Side - Order Info and Items */}
          <Grid item xs={12} md={5}>
            {order ? (
              <>
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
                  </CardContent>
                </Card>
              </>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
                <Typography variant="h6">No active order for this table</Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                  Select products from the right panel to create an order
                </Typography>
              </Paper>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBack}
                sx={{ mt: 2 }}
              >
                Back to Tables
              </Button>
            </Box>
          </Grid>

          {/* Right Side - Product Search and Selection - ALWAYS SHOWN */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Product Selection</Typography>

                {/* Search Box */}
                <Box sx={{ position: 'relative' }}>
                  <SearchIcon sx={{ position: 'absolute', left: '10px', top: '24px', zIndex: 1, color: 'action.active' }} />
                  <TextField
                    fullWidth
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    margin="normal"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-input': { paddingLeft: '40px' }
                    }}
                  />
                </Box>

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

                {/* Debug Info */}
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Debug Info:</Typography>
                  <Typography variant="body2">Products Count: {products.length}</Typography>
                  <Typography variant="body2">Filtered Products: {filteredProducts().length}</Typography>
                  <Typography variant="body2">Selected Category: {selectedCategory}</Typography>
                  <Typography variant="body2">Data Fetched: {dataFetched ? 'Yes' : 'No'}</Typography>
                  <Typography variant="body2">Has Order: {order ? 'Yes' : 'No'}</Typography>
                </Box>

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
                      No products found matching your criteria. Try selecting a different category or clearing your search.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TableOrder;
