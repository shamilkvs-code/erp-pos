# Table Order UI Implementation Guide

This document provides guidance for frontend developers on how to implement the UI for table order management in the ERP-POS system. It outlines the flow of API calls, the order in which they should be made, and how to implement the UI components.

## Table of Contents

1. [Overview](#overview)
2. [UI Components](#ui-components)
3. [User Flows](#user-flows)
4. [API Call Sequences](#api-call-sequences)
5. [Error Handling](#error-handling)
6. [UI State Management](#ui-state-management)
7. [Implementation Tips](#implementation-tips)

## Overview

The table order management system allows restaurant staff to:
- View all tables and their status
- Create new orders for tables
- Add items to existing orders
- Remove items from orders
- Complete orders and clear tables

The UI should provide an intuitive interface for these operations, making it easy for staff to manage orders efficiently.

## UI Components

### 1. Table Layout View

This is the main view showing all tables in the restaurant with their current status.

**Component Requirements:**
- Visual representation of tables (can be grid, floor plan, or list)
- Color-coding based on table status:
  - Available (Green)
  - Occupied (Red)
  - Reserved (Yellow)
  - Cleaning (Blue)
- Table information display:
  - Table number
  - Capacity
  - Current status
  - Current order ID (if occupied)
- Actions:
  - Select a table to view details
  - Create a new order for an available table
  - View current order for an occupied table

**API Endpoints Used:**
- `GET /api/tables` - To fetch all tables and their status

### 2. Table Detail View

Shows detailed information about a selected table.

**Component Requirements:**
- Table information:
  - Table number
  - Capacity
  - Current status
  - Location
- Current order summary (if table is occupied)
- Actions:
  - Create new order (if table is available)
  - View current order (if table is occupied)
  - Mark table as available (if table is in cleaning status)

**API Endpoints Used:**
- `GET /api/tables/{id}` - To fetch detailed information about a specific table
- `GET /api/table-orders/table/{tableId}/current` - To fetch the current order for the table

### 3. Order Creation Form

Form for creating a new order for a table.

**Component Requirements:**
- Number of guests input
- Product selection (with search/filter)
- Quantity selection for each product
- Special instructions input
- Order summary with total amount
- Submit button

**API Endpoints Used:**
- `GET /api/products` - To fetch available products
- `POST /api/table-orders/table/{tableId}` - To create a new order

### 4. Order Detail View

Shows detailed information about an order.

**Component Requirements:**
- Order information:
  - Order number
  - Order date
  - Table number
  - Number of guests
  - Status
- Order items list:
  - Product name
  - Quantity
  - Unit price
  - Subtotal
- Order total
- Special instructions
- Actions:
  - Add items to order
  - Remove items from order
  - Complete order and process payment

**API Endpoints Used:**
- `GET /api/table-orders/table/{tableId}/current` - To fetch the current order
- `POST /api/table-orders/table/{tableId}/cart` - To add items to the order
- `DELETE /api/table-orders/table/{tableId}/cart` - To remove items from the order
- `POST /api/table-orders/{orderId}/complete-and-clear` - To complete the order and clear the table

### 5. Add Item Form

Form for adding items to an existing order.

**Component Requirements:**
- Product selection (with search/filter)
- Quantity input
- Special instructions input
- Unit price display
- Subtotal calculation
- Add button

**API Endpoints Used:**
- `GET /api/products` - To fetch available products
- `POST /api/table-orders/table/{tableId}/cart` - To add the item to the order

### 6. Payment Processing Form

Form for processing payment when completing an order.

**Component Requirements:**
- Order summary
- Payment method selection
- Payment reference input
- Tip amount input
- Total amount display
- Complete button

**API Endpoints Used:**
- `POST /api/table-orders/{orderId}/complete-and-clear` - To complete the order and process payment

## User Flows

### 1. Creating a New Order for a Table

1. User navigates to the Table Layout View
2. User selects an available table
3. User is shown the Table Detail View
4. User clicks "Create New Order"
5. User is shown the Order Creation Form
6. User enters the number of guests
7. User selects products and quantities
8. User enters special instructions (optional)
9. User submits the form
10. User is redirected to the Order Detail View for the new order

**API Call Sequence:**
1. `GET /api/tables` - Fetch all tables
2. `GET /api/tables/{id}` - Fetch selected table details
3. `GET /api/products` - Fetch available products
4. `POST /api/table-orders/table/{tableId}` - Create the new order
5. `GET /api/table-orders/table/{tableId}/current` - Fetch the created order

### 2. Adding Items to an Existing Order

1. User navigates to the Table Layout View
2. User selects an occupied table
3. User is shown the Table Detail View with current order summary
4. User clicks "View Order"
5. User is shown the Order Detail View
6. User clicks "Add Item"
7. User is shown the Add Item Form
8. User selects a product and quantity
9. User enters special instructions (optional)
10. User submits the form
11. User is returned to the updated Order Detail View

**API Call Sequence:**
1. `GET /api/tables` - Fetch all tables
2. `GET /api/tables/{id}` - Fetch selected table details
3. `GET /api/table-orders/table/{tableId}/current` - Fetch current order
4. `GET /api/products` - Fetch available products
5. `POST /api/table-orders/table/{tableId}/cart` - Add item to the order
6. `GET /api/table-orders/table/{tableId}/current` - Fetch the updated order

### 3. Removing Items from an Order

1. User navigates to the Order Detail View (following steps in flow 2)
2. User selects an item to remove
3. User clicks "Remove" or adjusts quantity to zero
4. User confirms the removal
5. User is shown the updated Order Detail View

**API Call Sequence:**
1. `GET /api/table-orders/table/{tableId}/current` - Fetch current order
2. `DELETE /api/table-orders/table/{tableId}/cart` - Remove item from the order
3. `GET /api/table-orders/table/{tableId}/current` - Fetch the updated order

### 4. Completing an Order and Clearing a Table

1. User navigates to the Order Detail View (following steps in flow 2)
2. User clicks "Complete Order"
3. User is shown the Payment Processing Form
4. User selects payment method
5. User enters payment reference (if applicable)
6. User enters tip amount (if applicable)
7. User clicks "Complete"
8. User is redirected to the Table Layout View, where the table is now in "Cleaning" status

**API Call Sequence:**
1. `GET /api/table-orders/table/{tableId}/current` - Fetch current order
2. `POST /api/table-orders/{orderId}/complete-and-clear` - Complete the order and clear the table
3. `GET /api/tables` - Fetch updated tables

### 5. Marking a Table as Available After Cleaning

1. User navigates to the Table Layout View
2. User selects a table in "Cleaning" status
3. User is shown the Table Detail View
4. User clicks "Mark as Available"
5. User is redirected to the Table Layout View, where the table is now "Available"

**API Call Sequence:**
1. `GET /api/tables` - Fetch all tables
2. `GET /api/tables/{id}` - Fetch selected table details
3. `PATCH /api/tables/{id}/status` - Update table status to "AVAILABLE"
4. `GET /api/tables` - Fetch updated tables

## API Call Sequences

### Initial Page Load

When the application first loads, make these API calls:

1. `GET /api/tables` - Fetch all tables and their status
2. `GET /api/products/categories` - Fetch product categories for quick access

### Table Selection

When a user selects a table:

1. `GET /api/tables/{id}` - Fetch detailed information about the selected table
2. If table is occupied:
   - `GET /api/table-orders/table/{tableId}/current` - Fetch the current order

### Order Creation

When creating a new order:

1. `GET /api/products` - Fetch available products (can be filtered by category)
2. `POST /api/table-orders/table/{tableId}` - Create the new order with initial items

### Order Modification

When modifying an existing order:

1. For adding items:
   - `POST /api/table-orders/table/{tableId}/cart` - Add items to the order
   
2. For removing items:
   - `DELETE /api/table-orders/table/{tableId}/cart` - Remove items from the order

3. After any modification:
   - `GET /api/table-orders/table/{tableId}/current` - Fetch the updated order

### Order Completion

When completing an order:

1. `POST /api/table-orders/{orderId}/complete-and-clear` - Complete the order and clear the table
2. `GET /api/tables` - Fetch updated tables to refresh the UI

## Error Handling

### Common Error Scenarios

1. **Table Not Found**
   - Status Code: 404
   - UI Action: Display error message and redirect to Table Layout View

2. **Order Not Found**
   - Status Code: 404
   - UI Action: Display error message and redirect to Table Layout View

3. **Invalid Order Data**
   - Status Code: 400
   - UI Action: Highlight invalid fields and display specific error messages

4. **Authentication/Authorization Errors**
   - Status Code: 401/403
   - UI Action: Redirect to login page or display permission error

5. **Server Errors**
   - Status Code: 500
   - UI Action: Display generic error message and provide retry option

### Error Messages

Provide clear, user-friendly error messages:

- "Table not found. Please select another table."
- "This table is currently unavailable."
- "Failed to create order. Please check the information and try again."
- "Failed to add item to order. Please try again."
- "Failed to remove item from order. Please try again."
- "Failed to complete order. Please check payment details and try again."

## UI State Management

### Table States

Maintain the following states for tables:

- **AVAILABLE**: Table is ready for new customers
- **RESERVED**: Table is reserved for future customers
- **OCCUPIED**: Table has active customers with an order
- **CLEANING**: Table needs cleaning before becoming available

### Order States

Maintain the following states for orders:

- **PENDING**: Order has been created but not yet processed
- **IN_PROGRESS**: Order is being prepared
- **READY**: Order is ready to be served
- **COMPLETED**: Order has been served and paid for
- **CANCELLED**: Order has been cancelled

### UI State Transitions

1. When a new order is created:
   - Table state changes from AVAILABLE to OCCUPIED
   - Order state is set to PENDING

2. When an order is completed:
   - Table state changes from OCCUPIED to CLEANING
   - Order state changes to COMPLETED

3. When a table is marked as available:
   - Table state changes from CLEANING to AVAILABLE

## Implementation Tips

### 1. Real-time Updates

Consider implementing real-time updates using WebSockets or polling to keep the UI in sync with the backend:

- Update table status in real-time
- Show notifications for order status changes
- Refresh order details when items are added/removed

### 2. Offline Support

Implement offline support for critical operations:

- Cache table and product data
- Queue operations when offline
- Sync when connection is restored

### 3. Performance Optimization

Optimize API calls to improve performance:

- Batch API calls where possible
- Implement pagination for large datasets
- Cache frequently accessed data

### 4. Mobile Responsiveness

Ensure the UI is responsive and works well on tablets and mobile devices:

- Use responsive design principles
- Optimize touch interactions for mobile devices
- Simplify UI for smaller screens

### 5. Accessibility

Make the UI accessible to all users:

- Use semantic HTML
- Provide keyboard navigation
- Add ARIA attributes
- Ensure sufficient color contrast

## Example Implementation Timeline

1. **Week 1**: Implement Table Layout View and Table Detail View
2. **Week 2**: Implement Order Creation Form and Order Detail View
3. **Week 3**: Implement Add Item Form and Remove Item functionality
4. **Week 4**: Implement Payment Processing Form and Order Completion
5. **Week 5**: Implement Error Handling and UI State Management
6. **Week 6**: Testing and Refinement

## Conclusion

This guide provides a comprehensive framework for implementing the UI for table order management. By following the recommended API call sequences and user flows, you can create an intuitive and efficient interface for restaurant staff to manage table orders.

Remember to maintain close communication with the backend team during implementation to address any issues or requirements that may arise.
