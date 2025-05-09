# Table Order API Documentation

This document provides details about the Table Order API endpoints available in the ERP-POS system.

## Base URL

All endpoints are relative to the base URL: `/api/table-orders`

## Authentication

All endpoints require authentication. The following roles have access to these endpoints:
- CASHIER
- MANAGER
- ADMIN

## Endpoints

### Get Orders for a Table

```
GET /table/{tableId}
```

Retrieves all orders associated with a specific table.

**Path Parameters:**
- `tableId` (required): ID of the table to retrieve orders for

**Response:**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-20230508-A1B2",
    "orderDate": "2023-05-08T12:30:00",
    "customerId": 101,
    "tableId": 5,
    "totalAmount": 49.50,
    "status": "PENDING",
    "orderType": "DINE_IN",
    "paymentMethod": null,
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
]
```

### Create Table Order

```
POST /table/{tableId}
```

Creates a new order associated with a specific table.

**Path Parameters:**
- `tableId` (required): ID of the table to create order for

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

### Get Current Order for a Table

```
GET /table/{tableId}/current
```

Retrieves the current active order for a specific table.

**Path Parameters:**
- `tableId` (required): ID of the table to get current order for

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

### Get Active Cart for a Table

```
GET /table/{tableId}/cart
```

Retrieves the current cart (active order) for a specific table.

**Path Parameters:**
- `tableId` (required): ID of the table to get cart for

**Response:**
Same as the "Get Current Order for a Table" endpoint, but only returns orders that are not COMPLETED or CANCELLED.

### Add Item to Table Cart

```
POST /table/{tableId}/cart
```

Adds an item to the cart for a specific table.

**Path Parameters:**
- `tableId` (required): ID of the table to add item to cart

**Request Body:**
```json
{
  "orderId": null,
  "productId": 102,
  "quantity": 1,
  "unitPrice": 5.00,
  "numberOfGuests": 2,
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
  "specialInstructions": "No onions"
}
```

### Remove Item from Table Cart

```
DELETE /table/{tableId}/cart
```

Removes an item from the cart for a specific table.

**Path Parameters:**
- `tableId` (required): ID of the table to remove item from cart

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

### Complete Order and Clear Table

```
POST /{orderId}/complete-and-clear
```

Completes an order, processes payment, and clears the table for new customers.

**Path Parameters:**
- `orderId` (required): ID of the order to complete

**Request Body:**
```json
{
  "paymentMethod": "CREDIT_CARD",
  "paymentReference": "TRANS-123456",
  "tipAmount": 5.00
}
```

**Response:**
```json
{
  "orderId": 1,
  "orderNumber": "ORD-20230508-A1B2",
  "status": "COMPLETED",
  "paymentMethod": "CREDIT_CARD",
  "paymentReference": "TRANS-123456",
  "totalAmount": 30.00,
  "tipAmount": 5.00,
  "finalAmount": 35.00,
  "tableId": 5,
  "tableStatus": "CLEANING"
}
```
