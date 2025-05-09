# Table Order UI Implementation Sequence

This document provides a detailed, step-by-step guide for frontend developers on the exact sequence of API calls and UI interactions required to implement the table order management system. This is a companion to the more general UI Implementation Guide.

## Table Management Flow

### Initial Table View Loading

**UI Action**: User opens the table management page

**API Call Sequence**:
1. `GET /api/tables`
   - Purpose: Fetch all tables with their current status
   - Response: Array of table objects with status, capacity, etc.
   - UI Update: Display tables in a grid/floor plan with appropriate status colors

**Code Example**:
```javascript
// React/Axios example
useEffect(() => {
  const fetchTables = async () => {
    try {
      const response = await axios.get('/api/tables');
      setTables(response.data);
    } catch (error) {
      setError('Failed to load tables');
    }
  };
  
  fetchTables();
}, []);
```

### Table Selection

**UI Action**: User clicks on a specific table

**API Call Sequence**:
1. `GET /api/tables/{id}`
   - Purpose: Fetch detailed information about the selected table
   - Response: Detailed table object
   - UI Update: Display table details panel

2. If table status is OCCUPIED:
   - `GET /api/table-orders/table/{tableId}/current`
   - Purpose: Fetch current active order for the table
   - Response: Current order details or 404 if no active order
   - UI Update: Display current order summary in the table details panel

**Code Example**:
```javascript
const handleTableClick = async (tableId) => {
  try {
    // Get table details
    const tableResponse = await axios.get(`/api/tables/${tableId}`);
    setSelectedTable(tableResponse.data);
    
    // If table is occupied, get current order
    if (tableResponse.data.status === 'OCCUPIED') {
      try {
        const orderResponse = await axios.get(`/api/table-orders/table/${tableId}/current`);
        setCurrentOrder(orderResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCurrentOrder(null);
        } else {
          setError('Failed to load current order');
        }
      }
    }
  } catch (error) {
    setError('Failed to load table details');
  }
};
```

## Order Creation Flow

### Starting a New Order

**UI Action**: User selects an available table and clicks "Create New Order"

**API Call Sequence**:
1. `GET /api/products`
   - Purpose: Fetch available products for selection
   - Response: Array of product objects
   - UI Update: Display product selection in the order creation form

2. User fills out order form with:
   - Number of guests
   - Selected products and quantities
   - Special instructions (optional)

3. `POST /api/table-orders/table/{tableId}`
   - Purpose: Create a new order for the table
   - Request Body:
     ```json
     {
       "customerId": 101, // Optional
       "numberOfGuests": 2,
       "orderItems": [
         {
           "productId": 101,
           "quantity": 2,
           "unitPrice": 15.00,
           "subtotal": 30.00
         }
       ],
       "specialInstructions": "No onions",
       "totalAmount": 30.00
     }
     ```
   - Response: Created order object
   - UI Update: 
     - Display success message
     - Update table status to OCCUPIED
     - Navigate to Order Detail View

**Code Example**:
```javascript
// Load products when form opens
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to load products');
    }
  };
  
  fetchProducts();
}, []);

// Handle form submission
const handleCreateOrder = async (formData) => {
  try {
    const response = await axios.post(`/api/table-orders/table/${tableId}`, {
      numberOfGuests: formData.numberOfGuests,
      orderItems: formData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice
      })),
      specialInstructions: formData.specialInstructions,
      totalAmount: formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    });
    
    setOrder(response.data);
    showSuccessMessage('Order created successfully');
    navigate(`/orders/${response.data.id}`);
  } catch (error) {
    setError('Failed to create order');
  }
};
```

## Order Modification Flow

### Adding Items to an Existing Order

**UI Action**: User views an existing order and clicks "Add Item"

**API Call Sequence**:
1. `GET /api/products`
   - Purpose: Fetch available products for selection
   - Response: Array of product objects
   - UI Update: Display product selection in the add item form

2. User selects product, quantity, and enters special instructions (optional)

3. `POST /api/table-orders/table/{tableId}/cart`
   - Purpose: Add item to the existing order
   - Request Body:
     ```json
     {
       "orderId": 1,
       "productId": 102,
       "quantity": 1,
       "unitPrice": 5.00,
       "specialInstructions": "No ice"
     }
     ```
   - Response: Updated order object
   - UI Update: 
     - Display success message
     - Update order items list
     - Update order total

**Code Example**:
```javascript
const handleAddItem = async (itemData) => {
  try {
    const response = await axios.post(`/api/table-orders/table/${tableId}/cart`, {
      orderId: currentOrder.id,
      productId: itemData.productId,
      quantity: itemData.quantity,
      unitPrice: itemData.unitPrice,
      specialInstructions: itemData.specialInstructions
    });
    
    setCurrentOrder(response.data);
    showSuccessMessage('Item added successfully');
  } catch (error) {
    setError('Failed to add item to order');
  }
};
```

### Removing Items from an Order

**UI Action**: User selects an item in the order and clicks "Remove"

**API Call Sequence**:
1. `DELETE /api/table-orders/table/{tableId}/cart`
   - Purpose: Remove item from the order
   - Request Body:
     ```json
     {
       "orderId": 1,
       "productId": 102,
       "quantity": 1,
       "removeEntireItem": true
     }
     ```
   - Response: Updated order object
   - UI Update: 
     - Display success message
     - Update order items list
     - Update order total

**Code Example**:
```javascript
const handleRemoveItem = async (itemId, removeAll = false) => {
  try {
    const response = await axios.delete(`/api/table-orders/table/${tableId}/cart`, {
      data: {
        orderId: currentOrder.id,
        productId: itemId,
        quantity: 1,
        removeEntireItem: removeAll
      }
    });
    
    setCurrentOrder(response.data);
    showSuccessMessage('Item removed successfully');
  } catch (error) {
    setError('Failed to remove item from order');
  }
};
```

## Order Completion Flow

### Completing an Order and Processing Payment

**UI Action**: User clicks "Complete Order" and enters payment details

**API Call Sequence**:
1. `POST /api/table-orders/{orderId}/complete-and-clear`
   - Purpose: Complete the order, process payment, and clear the table
   - Request Body:
     ```json
     {
       "paymentMethod": "CREDIT_CARD",
       "paymentReference": "TRANS-123456",
       "tipAmount": 5.00
     }
     ```
   - Response: Result object with order and table status
   - UI Update: 
     - Display success message
     - Update table status to CLEANING
     - Navigate back to Table Layout View

**Code Example**:
```javascript
const handleCompleteOrder = async (paymentData) => {
  try {
    const response = await axios.post(`/api/table-orders/${orderId}/complete-and-clear`, {
      paymentMethod: paymentData.paymentMethod,
      paymentReference: paymentData.paymentReference,
      tipAmount: paymentData.tipAmount
    });
    
    showSuccessMessage('Order completed successfully');
    navigate('/tables');
    
    // Refresh tables to show updated status
    fetchTables();
  } catch (error) {
    setError('Failed to complete order');
  }
};
```

### Marking a Table as Available After Cleaning

**UI Action**: User selects a table in CLEANING status and clicks "Mark as Available"

**API Call Sequence**:
1. `PATCH /api/tables/{tableId}/status`
   - Purpose: Update table status to AVAILABLE
   - Request Body:
     ```json
     {
       "status": "AVAILABLE"
     }
     ```
   - Response: Updated table object
   - UI Update: 
     - Display success message
     - Update table status to AVAILABLE in the UI

**Code Example**:
```javascript
const handleMarkTableAvailable = async (tableId) => {
  try {
    const response = await axios.patch(`/api/tables/${tableId}/status`, {
      status: "AVAILABLE"
    });
    
    // Update the table in the tables array
    setTables(tables.map(table => 
      table.id === tableId ? response.data : table
    ));
    
    showSuccessMessage('Table marked as available');
  } catch (error) {
    setError('Failed to update table status');
  }
};
```

## Real-time Order Monitoring Flow

### Checking Order Status

**UI Action**: User wants to monitor active orders

**API Call Sequence**:
1. `GET /api/table-orders/table/{tableId}/current`
   - Purpose: Fetch current order status
   - Response: Current order object with status
   - UI Update: Display order status and details

2. Implement polling or WebSockets to periodically update order status:
   - Poll every 30 seconds or
   - Listen for WebSocket events for real-time updates

**Code Example**:
```javascript
// Polling example
useEffect(() => {
  if (!tableId) return;
  
  const intervalId = setInterval(async () => {
    try {
      const response = await axios.get(`/api/table-orders/table/${tableId}/current`);
      setCurrentOrder(response.data);
    } catch (error) {
      // Handle 404 gracefully - table might be cleared
      if (error.response && error.response.status === 404) {
        setCurrentOrder(null);
      }
    }
  }, 30000); // Poll every 30 seconds
  
  return () => clearInterval(intervalId);
}, [tableId]);
```

## Multi-Table View Flow

### Monitoring All Tables

**UI Action**: User wants to see status of all tables at once

**API Call Sequence**:
1. `GET /api/tables`
   - Purpose: Fetch all tables with their current status
   - Response: Array of table objects with status
   - UI Update: Display tables with color-coding based on status

2. Implement polling to keep the view updated:
   - Poll every 60 seconds to refresh table statuses

**Code Example**:
```javascript
useEffect(() => {
  const fetchTables = async () => {
    try {
      const response = await axios.get('/api/tables');
      setTables(response.data);
    } catch (error) {
      setError('Failed to load tables');
    }
  };
  
  // Initial fetch
  fetchTables();
  
  // Set up polling
  const intervalId = setInterval(fetchTables, 60000); // Poll every minute
  
  return () => clearInterval(intervalId);
}, []);
```

## Important Implementation Notes

### 1. Order of API Calls

Always maintain this order of operations:

1. Fetch reference data first (tables, products)
2. Perform user-initiated actions (create, update, delete)
3. Fetch updated data to reflect changes

### 2. Error Handling

For each API call, implement proper error handling:

- Display user-friendly error messages
- Log detailed errors for debugging
- Provide retry mechanisms for critical operations

### 3. Loading States

Show loading indicators during API calls:

- Use spinners or skeleton screens
- Disable buttons during operations
- Provide feedback on long-running operations

### 4. Optimistic Updates

For better user experience, implement optimistic updates:

- Update UI immediately after user action
- Revert changes if API call fails
- Show toast notifications for success/failure

### 5. Form Validation

Implement client-side validation before API calls:

- Validate required fields
- Check numeric values (quantities, prices)
- Validate special instructions length

## UI Component Hierarchy

For optimal implementation, structure your components as follows:

```
TableManagementPage
├── TableLayoutView
│   └── TableItem (multiple)
├── TableDetailPanel
│   ├── TableInfo
│   ├── CurrentOrderSummary (if occupied)
│   └── TableActions
├── OrderCreationForm
│   ├── GuestInfoSection
│   ├── ProductSelectionSection
│   └── OrderSummarySection
├── OrderDetailView
│   ├── OrderHeader
│   ├── OrderItemsList
│   │   └── OrderItemRow (multiple)
│   ├── OrderSummary
│   └── OrderActions
└── PaymentProcessingForm
    ├── OrderSummary
    ├── PaymentMethodSelection
    └── PaymentDetails
```

## Conclusion

By following this detailed implementation sequence, frontend developers can create a robust and user-friendly table order management system that integrates seamlessly with the backend API. The step-by-step approach ensures that all necessary API calls are made in the correct order, and that the UI is updated appropriately at each stage of the process.
