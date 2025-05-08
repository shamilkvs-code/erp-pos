# Restaurant Table Order API Documentation

## Overview

This document outlines the API endpoints, data structures, and workflow for managing restaurant table orders in the ERP-POS system. It provides detailed information for the UI team to implement the corresponding frontend features.

## Table of Contents

1. [Data Models](#data-models)
2. [API Endpoints](#api-endpoints)
3. [Workflow Scenarios](#workflow-scenarios)
4. [Implementation Details](#implementation-details)
5. [UI Implementation Guidelines](#ui-implementation-guidelines)

## Data Models

### RestaurantTable

```json
{
  "id": 1,
  "tableNumber": "Table 5",
  "capacity": 4,
  "status": "AVAILABLE", // AVAILABLE, OCCUPIED, RESERVED, CLEANING, MAINTENANCE
  "location": "MAIN",
  "positionX": 100,
  "positionY": 200,
  "width": 80,
  "height": 80,
  "shape": "RECTANGLE",
  "currentOrderId": null // ID of the current active order (if any)
}
```

### Order

```json
{
  "id": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "orderDate": "2023-05-08T12:30:00",
  "customerId": 101,
  "tableId": 5,
  "totalAmount": 49.50,
  "status": "PENDING", // PENDING, IN_PROGRESS, READY, COMPLETED, CANCELLED
  "orderType": "DINE_IN", // DINE_IN, TAKEOUT, DELIVERY
  "paymentMethod": null, // CASH, CREDIT_CARD, DEBIT_CARD, MOBILE_PAYMENT
  "paymentReference": null,
  "numberOfGuests": 2,
  "specialInstructions": "No onions",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    }
  ]
}
```

## API Endpoints

### Table Management

#### Get All Tables

```
GET /api/tables
```

**Response:**
```json
[
  {
    "id": 1,
    "tableNumber": "Table 1",
    "capacity": 4,
    "status": "AVAILABLE",
    "location": "MAIN",
    "currentOrderId": null
  },
  {
    "id": 2,
    "tableNumber": "Table 2",
    "capacity": 2,
    "status": "OCCUPIED",
    "location": "MAIN",
    "currentOrderId": 5
  }
]
```

#### Get Table by ID

```
GET /api/tables/{id}
```

**Response:**
```json
{
  "id": 1,
  "tableNumber": "Table 1",
  "capacity": 4,
  "status": "AVAILABLE",
  "location": "MAIN",
  "currentOrderId": null
}
```

#### Get Tables with Filters

```
GET /api/tables/filter?status=AVAILABLE&location=MAIN&capacity=4
```

**Response:**
```json
[
  {
    "id": 1,
    "tableNumber": "Table 1",
    "capacity": 4,
    "status": "AVAILABLE",
    "location": "MAIN",
    "currentOrderId": null
  }
]
```

#### Get Floor Plan (Tables with Position Information)

```
GET /api/tables/floor-plan
```

**Response:**
```json
[
  {
    "id": 1,
    "tableNumber": "Table 1",
    "capacity": 4,
    "status": "AVAILABLE",
    "location": "MAIN",
    "positionX": 100,
    "positionY": 200,
    "width": 80,
    "height": 80,
    "shape": "RECTANGLE",
    "currentOrderId": null
  }
]
```

#### Mark Table as Available After Cleaning

```
POST /api/tables/{tableId}/mark-available
```

**Response:**
```json
{
  "id": 1,
  "tableNumber": "Table 1",
  "capacity": 4,
  "status": "AVAILABLE",
  "location": "MAIN",
  "currentOrderId": null
}
```

### Order Management

#### Create Table Order

```
POST /api/orders/table/{tableId}
```

**Request Body:**
```json
{
  "customerId": 101,
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

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "orderDate": "2023-05-08T12:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 5,
  "tableNumber": "Table 5",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    }
  ],
  "totalAmount": 30.00,
  "status": "PENDING",
  "orderType": "DINE_IN",
  "paymentMethod": null,
  "paymentReference": null,
  "numberOfGuests": 2,
  "specialInstructions": "No onions"
}
```

#### Get Current Order for a Table

```
GET /api/orders/table/{tableId}/current
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "orderDate": "2023-05-08T12:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 5,
  "tableNumber": "Table 5",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    }
  ],
  "totalAmount": 30.00,
  "status": "PENDING",
  "orderType": "DINE_IN",
  "paymentMethod": null,
  "paymentReference": null,
  "numberOfGuests": 2,
  "specialInstructions": "No onions"
}
```

#### Get Active Cart for a Table

```
GET /api/orders/table/{tableId}/cart
```

**Response:**
Same as the "Get Current Order for a Table" endpoint, but only returns orders that are not COMPLETED or CANCELLED.

#### Add Item to Table Cart

```
POST /api/orders/table/{tableId}/cart
```

**Request Body:**
```json
{
  "orderId": null, // Optional - if not provided, a new order will be created
  "productId": 102,
  "quantity": 1,
  "unitPrice": 5.00,
  "numberOfGuests": 2, // Required for new orders, optional for updates
  "specialInstructions": "No ice"
}
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "orderDate": "2023-05-08T12:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 5,
  "tableNumber": "Table 5",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    },
    {
      "id": 2,
      "productId": 102,
      "productName": "Soda",
      "quantity": 1,
      "unitPrice": 5.00,
      "subtotal": 5.00
    }
  ],
  "totalAmount": 35.00,
  "status": "PENDING",
  "orderType": "DINE_IN",
  "paymentMethod": null,
  "paymentReference": null,
  "numberOfGuests": 2,
  "specialInstructions": "No ice"
}
```

#### Remove Item from Table Cart

```
DELETE /api/orders/table/{tableId}/cart
```

**Request Body:**
```json
{
  "orderId": 1,
  "productId": 102,
  "quantity": 1,
  "removeEntireItem": false
}
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "orderDate": "2023-05-08T12:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 5,
  "tableNumber": "Table 5",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    }
  ],
  "totalAmount": 30.00,
  "status": "PENDING",
  "orderType": "DINE_IN",
  "paymentMethod": null,
  "paymentReference": null,
  "numberOfGuests": 2,
  "specialInstructions": "No onions"
}
```

#### Update Order Status

```
PATCH /api/orders/{id}/status
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "orderDate": "2023-05-08T12:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 5,
  "tableNumber": "Table 5",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    }
  ],
  "totalAmount": 30.00,
  "status": "IN_PROGRESS",
  "orderType": "DINE_IN",
  "paymentMethod": null,
  "paymentReference": null,
  "numberOfGuests": 2,
  "specialInstructions": "No onions"
}
```

#### Complete Order and Clear Table

```
POST /api/orders/{orderId}/complete-and-clear
```

**Request Body:**
```json
{
  "paymentMethod": "CREDIT_CARD",
  "paymentReference": "TRANS-123456"
}
```

**Response:**
```json
{
  "order": {
    "id": 1,
    "orderNumber": "ORD-20230508-A1B2",
    "orderDate": "2023-05-08T12:30:00",
    "customerId": 101,
    "customerName": "John Doe",
    "tableId": 5,
    "tableNumber": "Table 5",
    "orderItems": [
      {
        "id": 1,
        "productId": 101,
        "productName": "Pizza",
        "quantity": 2,
        "unitPrice": 15.00,
        "subtotal": 30.00
      }
    ],
    "totalAmount": 30.00,
    "status": "COMPLETED",
    "orderType": "DINE_IN",
    "paymentMethod": "CREDIT_CARD",
    "paymentReference": "TRANS-123456",
    "numberOfGuests": 2,
    "specialInstructions": "No onions"
  },
  "table": {
    "id": 5,
    "tableNumber": "Table 5",
    "capacity": 4,
    "status": "CLEANING",
    "location": "MAIN",
    "currentOrderId": null
  }
}
```

## Workflow Scenarios

### Scenario 1: Creating a New Table Order

1. User selects an available table from the table layout
2. User creates a new order for the table by adding items
3. System creates a new order with PENDING status
4. System updates the table status to OCCUPIED

**API Flow:**
1. `GET /api/tables` to get all tables
2. `POST /api/orders/table/{tableId}/cart` to create a new order and add items

### Scenario 2: Adding Items to an Existing Order

1. User selects an occupied table from the table layout
2. User views the current order for the table
3. User adds more items to the order
4. System updates the order with the new items

**API Flow:**
1. `GET /api/tables` to get all tables
2. `GET /api/orders/table/{tableId}/current` to get the current order
3. `POST /api/orders/table/{tableId}/cart` to add items to the order

### Scenario 3: Removing Items from an Order

1. User selects an occupied table from the table layout
2. User views the current order for the table
3. User removes items from the order
4. System updates the order without the removed items

**API Flow:**
1. `GET /api/tables` to get all tables
2. `GET /api/orders/table/{tableId}/current` to get the current order
3. `DELETE /api/orders/table/{tableId}/cart` to remove items from the order

### Scenario 4: Completing an Order and Clearing the Table

1. User selects an occupied table from the table layout
2. User views the current order for the table
3. User completes the order with payment details
4. System updates the order status to COMPLETED
5. System updates the table status to CLEANING

**API Flow:**
1. `GET /api/tables` to get all tables
2. `GET /api/orders/table/{tableId}/current` to get the current order
3. `POST /api/orders/{orderId}/complete-and-clear` to complete the order and clear the table

### Scenario 5: Marking a Table as Available After Cleaning

1. User selects a table with CLEANING status
2. User marks the table as available
3. System updates the table status to AVAILABLE

**API Flow:**
1. `GET /api/tables` to get all tables
2. `POST /api/tables/{tableId}/mark-available` to mark the table as available

## Implementation Details

### Key Features

1. **Table Status Management**:
   - Tables have different statuses (AVAILABLE, OCCUPIED, RESERVED, CLEANING, MAINTENANCE)
   - Table status changes based on order operations

2. **Order Status Flow**:
   - PENDING → IN_PROGRESS → READY → COMPLETED
   - Orders can also be CANCELLED at any stage

3. **Adding Items to Orders**:
   - For PENDING orders: If the same product is ordered again, the quantity is increased
   - For IN_PROGRESS or READY orders: If the same product is ordered again, it's added as a new line item
   - This behavior ensures that items ordered after the kitchen has started preparing food are treated as separate orders

4. **Order Completion**:
   - When an order is completed, the table status changes to CLEANING
   - After cleaning, the table can be marked as AVAILABLE again

### Business Rules

1. **Table Assignment**:
   - A table can only have one active order at a time
   - A table must be AVAILABLE or RESERVED to be assigned an order

2. **Order Management**:
   - Items can be added to an order at any stage (PENDING, IN_PROGRESS, READY)
   - Items can be removed from an order only if it's not COMPLETED or CANCELLED
   - An order can be completed only if it has at least one item

3. **Payment Processing**:
   - Payment details are required to complete an order
   - An order can't be completed without payment information

## UI Implementation Guidelines

### Table Layout Screen

1. **Visual Table Layout**:
   - Display tables in a grid or custom layout
   - Use different colors to indicate table status:
     - Green: AVAILABLE
     - Red: OCCUPIED
     - Yellow: RESERVED
     - Blue: CLEANING
     - Gray: MAINTENANCE
   - Show table number and capacity on each table

2. **Table Selection**:
   - Allow users to select a table by clicking on it
   - Show table details and current order (if any) when a table is selected

3. **Table Actions**:
   - For AVAILABLE tables: Allow creating a new order
   - For OCCUPIED tables: Allow viewing/editing the current order
   - For CLEANING tables: Allow marking as available

### Order Management Screen

1. **Order Details**:
   - Show order information (order number, date, customer, etc.)
   - Display list of order items with quantity, unit price, and subtotal
   - Show order total amount

2. **Item Management**:
   - Allow adding new items to the order
   - Allow removing items from the order
   - Allow updating item quantities

3. **Order Actions**:
   - Allow updating order status
   - Allow adding special instructions
   - Allow completing the order with payment details

### Product Selection Screen

1. **Product Categories**:
   - Display product categories for easy navigation
   - Allow filtering products by category

2. **Product List**:
   - Show product details (name, price, description)
   - Allow selecting products to add to the order
   - Allow specifying quantity for selected products

3. **Cart Preview**:
   - Show current items in the order
   - Display order total amount
   - Allow finalizing the order or adding more items

## Important Implementation Notes

1. **Adding Same Items After Order is In Progress**:
   - When adding the same item to an order that's already in IN_PROGRESS or READY status, the system will add it as a new line item instead of increasing the quantity
   - This is important for kitchen operations, as it clearly indicates that this is a new order for the same item
   - The UI should reflect this behavior by showing multiple line items for the same product

2. **Order Status Management**:
   - The UI should provide clear visual indicators of the order status
   - Consider implementing a workflow that guides users through the order status progression

3. **Table Status Transitions**:
   - The UI should automatically update the table status based on order operations
   - Consider implementing real-time updates using WebSockets or polling to keep the table layout up-to-date

4. **Error Handling**:
   - Implement proper error handling for all API calls
   - Display meaningful error messages to users when operations fail
