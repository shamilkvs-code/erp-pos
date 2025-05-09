# Table Order API Reference

This document provides a comprehensive reference of all API endpoints related to table order management, their relationships, and how they should be used together in the UI implementation.

## API Endpoint Overview

### Table Management

| Endpoint | Method | Description | Used When |
|----------|--------|-------------|-----------|
| `/api/tables` | GET | Get all tables | Loading table layout view |
| `/api/tables/{id}` | GET | Get table by ID | Viewing table details |
| `/api/tables/{id}` | PUT | Update table | Modifying table properties |
| `/api/tables/{id}/status` | PATCH | Update table status | Marking table as available after cleaning |

### Table Order Management

| Endpoint | Method | Description | Used When |
|----------|--------|-------------|-----------|
| `/api/table-orders/table/{tableId}` | GET | Get orders for a table | Viewing order history for a table |
| `/api/table-orders/table/{tableId}` | POST | Create new order for a table | Creating a new order |
| `/api/table-orders/table/{tableId}/current` | GET | Get current active order | Viewing current order details |
| `/api/table-orders/table/{tableId}/cart` | GET | Get active cart for a table | Viewing current cart |
| `/api/table-orders/table/{tableId}/cart` | POST | Add item to cart | Adding items to an order |
| `/api/table-orders/table/{tableId}/cart` | DELETE | Remove item from cart | Removing items from an order |
| `/api/table-orders/{orderId}/complete-and-clear` | POST | Complete order and clear table | Finalizing an order and processing payment |

### Product Management

| Endpoint | Method | Description | Used When |
|----------|--------|-------------|-----------|
| `/api/products` | GET | Get all products | Loading product selection |
| `/api/products/categories` | GET | Get product categories | Filtering products by category |
| `/api/products/{id}` | GET | Get product by ID | Viewing product details |

## API Relationships Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│     Tables      │◀────┤  Table Orders   │────▶│    Products     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Table Status   │     │   Order Items   │     │   Categories    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Detailed API Specifications

### 1. Table Management

#### 1.1 Get All Tables

```
GET /api/tables
```

**Response:**
```json
[
  {
    "id": 1,
    "tableNumber": "T-01",
    "capacity": 4,
    "status": "AVAILABLE",
    "location": "MAIN",
    "currentOrderId": null
  },
  {
    "id": 2,
    "tableNumber": "T-02",
    "capacity": 2,
    "status": "OCCUPIED",
    "location": "MAIN",
    "currentOrderId": 123
  }
]
```

#### 1.2 Get Table by ID

```
GET /api/tables/{id}
```

**Response:**
```json
{
  "id": 1,
  "tableNumber": "T-01",
  "capacity": 4,
  "status": "AVAILABLE",
  "location": "MAIN",
  "positionX": 10,
  "positionY": 20,
  "width": 100,
  "height": 100,
  "shape": "RECTANGLE",
  "currentOrderId": null
}
```

#### 1.3 Update Table Status

```
PATCH /api/tables/{id}/status
```

**Request:**
```json
{
  "status": "AVAILABLE"
}
```

**Response:**
```json
{
  "id": 1,
  "tableNumber": "T-01",
  "capacity": 4,
  "status": "AVAILABLE",
  "location": "MAIN",
  "currentOrderId": null
}
```

### 2. Table Order Management

#### 2.1 Get Orders for a Table

```
GET /api/table-orders/table/{tableId}
```

**Response:**
```json
[
  {
    "id": 123,
    "orderNumber": "ORD-2023-1234",
    "orderDate": "2023-05-09T14:30:00",
    "customerId": 101,
    "customerName": "John Doe",
    "tableId": 2,
    "tableNumber": "T-02",
    "orderItems": [...],
    "totalAmount": 45.50,
    "status": "COMPLETED",
    "orderType": "DINE_IN",
    "paymentMethod": "CREDIT_CARD",
    "paymentReference": "TRANS-123456",
    "numberOfGuests": 2,
    "specialInstructions": "No onions"
  }
]
```

#### 2.2 Create New Order for a Table

```
POST /api/table-orders/table/{tableId}
```

**Request:**
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
  "id": 124,
  "orderNumber": "ORD-2023-1235",
  "orderDate": "2023-05-09T15:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 1,
  "tableNumber": "T-01",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza Margherita",
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

#### 2.3 Get Current Order for a Table

```
GET /api/table-orders/table/{tableId}/current
```

**Response:**
```json
{
  "id": 124,
  "orderNumber": "ORD-2023-1235",
  "orderDate": "2023-05-09T15:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 1,
  "tableNumber": "T-01",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza Margherita",
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

#### 2.4 Add Item to Cart

```
POST /api/table-orders/table/{tableId}/cart
```

**Request:**
```json
{
  "orderId": 124,
  "productId": 102,
  "quantity": 1,
  "unitPrice": 5.00,
  "specialInstructions": "No ice"
}
```

**Response:**
```json
{
  "id": 124,
  "orderNumber": "ORD-2023-1235",
  "orderDate": "2023-05-09T15:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 1,
  "tableNumber": "T-01",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza Margherita",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    },
    {
      "id": 2,
      "productId": 102,
      "productName": "Coca Cola",
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

#### 2.5 Remove Item from Cart

```
DELETE /api/table-orders/table/{tableId}/cart
```

**Request:**
```json
{
  "orderId": 124,
  "productId": 102,
  "quantity": 1,
  "removeEntireItem": true
}
```

**Response:**
```json
{
  "id": 124,
  "orderNumber": "ORD-2023-1235",
  "orderDate": "2023-05-09T15:30:00",
  "customerId": 101,
  "customerName": "John Doe",
  "tableId": 1,
  "tableNumber": "T-01",
  "orderItems": [
    {
      "id": 1,
      "productId": 101,
      "productName": "Pizza Margherita",
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

#### 2.6 Complete Order and Clear Table

```
POST /api/table-orders/{orderId}/complete-and-clear
```

**Request:**
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
  "orderId": 124,
  "orderNumber": "ORD-2023-1235",
  "status": "COMPLETED",
  "paymentMethod": "CREDIT_CARD",
  "paymentReference": "TRANS-123456",
  "totalAmount": 30.00,
  "tipAmount": 5.00,
  "finalAmount": 35.00,
  "tableId": 1,
  "tableStatus": "CLEANING"
}
```

### 3. Product Management

#### 3.1 Get All Products

```
GET /api/products
```

**Response:**
```json
[
  {
    "id": 101,
    "name": "Pizza Margherita",
    "description": "Classic pizza with tomato sauce and mozzarella",
    "price": 15.00,
    "categoryId": 1,
    "categoryName": "Pizza",
    "imageUrl": "/images/pizza-margherita.jpg",
    "available": true
  },
  {
    "id": 102,
    "name": "Coca Cola",
    "description": "Refreshing cola drink",
    "price": 5.00,
    "categoryId": 2,
    "categoryName": "Beverages",
    "imageUrl": "/images/coca-cola.jpg",
    "available": true
  }
]
```

#### 3.2 Get Product Categories

```
GET /api/products/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Pizza",
    "description": "Italian pizzas"
  },
  {
    "id": 2,
    "name": "Beverages",
    "description": "Soft drinks and alcoholic beverages"
  },
  {
    "id": 3,
    "name": "Desserts",
    "description": "Sweet treats"
  }
]
```

## Common API Patterns

### 1. Table Status Flow

The typical flow for table status changes is:

1. **AVAILABLE** → **OCCUPIED** (when creating a new order)
2. **OCCUPIED** → **CLEANING** (when completing an order)
3. **CLEANING** → **AVAILABLE** (when marking a table as available)

### 2. Order Status Flow

The typical flow for order status changes is:

1. **PENDING** (when creating a new order)
2. **IN_PROGRESS** (when kitchen starts preparing)
3. **READY** (when food is ready to be served)
4. **COMPLETED** (when order is paid and completed)

Alternatively, an order can be **CANCELLED** at any point before completion.

### 3. Cart Operations

When working with the cart:

1. For a new table with no orders:
   - First call to add an item will create a new order
   - Subsequent calls will add to the existing order

2. For a table with an existing order:
   - All calls will modify the existing order

3. When removing items:
   - If `removeEntireItem` is `true`, the entire item is removed regardless of quantity
   - If `removeEntireItem` is `false`, only the specified quantity is removed
   - If quantity becomes zero, the item is removed entirely

## Error Handling

All API endpoints follow these error patterns:

| Status Code | Meaning | UI Handling |
|-------------|---------|-------------|
| 200/201 | Success | Process response normally |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show "not found" message |
| 500 | Server Error | Show generic error message |

## Authentication

All API endpoints require authentication except for login/register endpoints. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Pagination

For endpoints that return large collections, pagination is supported with these query parameters:

- `page`: Page number (starting from 0)
- `size`: Page size (default 20)
- `sort`: Sort field and direction (e.g., `sort=name,asc`)

Example:
```
GET /api/products?page=0&size=10&sort=price,asc
```

## Filtering

For endpoints that support filtering, use query parameters:

- `category`: Filter products by category
- `status`: Filter tables by status
- `location`: Filter tables by location

Example:
```
GET /api/tables?status=AVAILABLE&location=MAIN
```

## Conclusion

This API reference provides a comprehensive guide to all endpoints related to table order management. Use it in conjunction with the UI Implementation Guide and Implementation Sequence documents to create a robust and user-friendly table order management system.
