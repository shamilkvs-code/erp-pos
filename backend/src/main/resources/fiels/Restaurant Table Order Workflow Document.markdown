# Restaurant Table Order Workflow Document

## Overview
This document outlines the workflow for managing restaurant table orders in an ERP system designed exclusively for a restaurant. The system uses a single `Orders` table to track orders, with features tailored for handling restaurant tables. The workflow covers the process of creating, managing, and completing table orders, ensuring efficient restaurant operations.

## System Components
The ERP system includes the following key tables to support restaurant table order management:

### 1. Tables Table
- **Purpose**: Stores details of restaurant tables.
- **Fields**:
  - `TableID`: Unique identifier for each table.
  - `TableName`: Descriptive name (e.g., "Table 5").
  - `Status`: Current state (e.g., "Free", "Occupied", "Reserved").
  - `Capacity`: Number of seats (optional, e.g., 4).
- **Example**:
  | TableID | TableName | Status   | Capacity |
  |---------|-----------|----------|----------|
  | 5       | Table 5   | Free     | 4        |

### 2. Orders Table
- **Purpose**: Tracks all restaurant orders.
- **Fields**:
  - `OrderID`: Unique identifier for the order.
  - `TableID`: Links to the `Tables` table.
  - `CustomerID`: Optional, for loyalty tracking.
  - `OrderDateTime`: Timestamp of order creation.
  - `TotalAmount`: Total order value, updated as items are added.
  - `Status`: Order state (e.g., "Open", "Served", "Completed", "Cancelled").
  - `PaymentMethod`: Payment type (e.g., "Cash", "Card", or null until payment).
- **Example**:
  | OrderID | TableID | CustomerID | OrderDateTime       | TotalAmount | Status | PaymentMethod |
  |---------|---------|------------|---------------------|-------------|--------|---------------|
  | 001     | 5       | 101        | 2025-05-08 12:30:00 | 0.00        | Open   | NULL          |

### 3. OrderItems Table
- **Purpose**: Stores individual items in an order.
- **Fields**:
  - `OrderItemID`: Unique identifier.
  - `OrderID`: Links to the `Orders` table.
  - `ProductID`: Links to the `Products` table.
  - `Quantity`: Number of items ordered.
  - `Price`: Price per item.
  - `Subtotal`: Quantity × Price.
- **Example**:
  | OrderItemID | OrderID | ProductID | Quantity | Price | Subtotal |
  |-------------|---------|-----------|----------|-------|----------|
  | 1           | 001     | 101       | 2        | 15.00 | 30.00    |

### 4. Products Table
- **Purpose**: Lists menu items available for ordering.
- **Fields**:
  - `ProductID`: Unique identifier.
  - `Name`: Item name (e.g., "Pizza").
  - `Price`: Cost per item.
  - `Category`: E.g., "Food", "Beverage".
- **Example**:
  | ProductID | Name   | Price | Category |
  |-----------|--------|-------|----------|
  | 101       | Pizza  | 15.00 | Food     |
  | 102       | Soda   | 5.00  | Beverage |

### 5. Inventory Table
- **Purpose**: Tracks ingredients or stock used for menu items.
- **Fields**:
  - `ItemID`: Unique identifier.
  - `Name`: Ingredient name (e.g., "Dough").
  - `Quantity`: Available stock.
  - `Unit`: Measurement unit (e.g., "kg", "units").
- **Example**:
  | ItemID | Name  | Quantity | Unit  |
  |--------|-------|----------|-------|
  | 201    | Dough | 10       | kg    |

## Workflow

### Step 1: Customer Seating and Table Assignment
- **Description**: A customer is seated at a table, and the table is marked as occupied.
- **Process**:
  - Staff uses the ERP’s restaurant module (via tablet, POS, or computer) to view a table layout showing all tables and their statuses.
  - Staff selects a table (e.g., Table 5), updating its `Status` to "Occupied" in the `Tables` table.
  - A new order is created in the `Orders` table:
    - `OrderID`: Auto-generated.
    - `TableID`: Set to Table 5’s `TableID`.
    - `CustomerID`: Optional, if customer is registered.
    - `OrderDateTime`: Current timestamp (e.g., 2025-05-08 12:30:00).
    - `TotalAmount`: 0.00.
    - `Status`: "Open".
    - `PaymentMethod`: Null.
- **Example**:
  - Customer sits at Table 5.
  - ERP creates:
    | OrderID | TableID | CustomerID | OrderDateTime       | TotalAmount | Status | PaymentMethod |
    |---------|---------|------------|---------------------|-------------|--------|---------------|
    | 001     | 5       | 101        | 2025-05-08 12:30:00 | 0.00        | Open   | NULL          |

### Step 2: Taking the Order
- **Description**: Staff adds menu items to the customer’s order.
- **Process**:
  - The waiter uses the ERP’s interface to select items from the `Products` table and specify quantities.
  - Items are added to the `OrderItems` table, linked to the `OrderID`.
  - The `TotalAmount` in the `Orders` table is updated.
  - The order is sent to the kitchen (via Kitchen Display System or printout).
- **Example**:
  - Customer orders 2 pizzas ($15 each) and 1 soda ($5).
  - ERP updates `OrderItems`:
    | OrderItemID | OrderID | ProductID | Quantity | Price | Subtotal |
    |-------------|---------|-----------|----------|-------|----------|
    | 1           | 001     | 101       | 2        | 15.00 | 30.00    |
    | 2           | 001     | 102       | 1        | 5.00  | 5.00     |
  - `Orders` table updates `TotalAmount` to $35.00.

### Step 3: Inventory Update
- **Description**: Ingredients are deducted from inventory as items are ordered.
- **Process**:
  - The ERP reduces stock in the `Inventory` table based on the items ordered.
  - Example: For 2 pizzas, deduct dough, cheese, and toppings; for 1 soda, deduct 1 soda unit.
  - Low-stock alerts are triggered if necessary.

### Step 4: Order Management
- **Description**: Staff manages the order during the customer’s dining experience.
- **Process**:
  - Staff can:
    - View open orders by table (`Status = Open`).
    - Add items (e.g., dessert), updating `OrderItems` and `TotalAmount`.
    - Modify or cancel items (subject to permissions).
    - Track kitchen progress (e.g., "Pending", "Served").
  - Example: Customer adds a dessert ($10). ERP adds to `OrderItems` and updates `TotalAmount` to $45.00.

### Step 5: Serving the Order
- **Description**: Food is prepared and served to the customer.
- **Process**:
  - The kitchen marks items as ready (via KDS or ERP).
  - The waiter serves the items to Table 5.
  - Optional: Update order `Status` to "Served".

### Step 6: Billing and Payment
- **Description**: The customer requests the bill, and payment is processed.
- **Process**:
  - The waiter generates the bill, including:
    - Subtotal from `OrderItems` (e.g., $45.00).
    - Taxes or service charges (e.g., 10% service charge = $4.50).
    - Total: $49.50.
  - The customer selects a payment method (e.g., card).
  - The ERP updates the `Orders` table:
    - `TotalAmount`: $49.50.
    - `Status`: "Completed".
    - `PaymentMethod`: "Card".
  - The `Tables` table updates Table 5’s `Status` to "Free".
- **Example**:
  | OrderID | TableID | CustomerID | OrderDateTime       | TotalAmount | Status    | PaymentMethod |
  |---------|---------|------------|---------------------|-------------|-----------|---------------|
  | 001     | 5       | 101        | 2025-05-08 12:30:00 | 49.50       | Completed | Card          |

### Step 7: Post-Order Actions
- **Description**: Finalize the order and prepare for the next customer.
- **Process**:
  - Log the order for reporting and accounting (e.g., $49.50 revenue).
  - Finalize inventory adjustments.
  - Table 5 is ready for the next customer.

## ERP Interface Features
- **Table Layout**: Visual display of tables with real-time statuses (e.g., green for Free, red for Occupied).
- **Order Entry**: Menu-driven interface for adding, modifying, or cancelling items.
- **Kitchen Integration**: Sends orders to the kitchen and tracks preparation status.
- **Billing**: Generates bills with taxes/service charges and processes payments.
- **Role-Based Access**: Restricts actions (e.g., waiters can’t void orders, managers can apply discounts).
- **Reporting**: Sales reports by table, menu item, or time period.

## Example Workflow for Table 5
1. Customer sits at Table 5. Waiter marks Table 5 as "Occupied" and creates an order (`OrderID = 001`, `TableID = 5`, `Status = Open`).
2. Waiter adds 2 pizzas and 1 soda, updating `OrderItems` (`TotalAmount = $35.00`). Order is sent to the kitchen.
3. Customer adds a dessert, increasing `TotalAmount` to $45.00.
4. Kitchen prepares and serves items.
5. Customer requests the bill ($45.00 + $4.50 service charge = $49.50).
6. Customer pays by card. ERP updates order to `Status = Completed`, `PaymentMethod = Card`, and sets Table 5 to "Free".

## Challenges and Solutions
- **Multiple Orders per Table**:
  - **Challenge**: Customers ordering in rounds.
  - **Solution**: Append items to the same `OrderID` or allow multiple open orders per `TableID`.
- **Table Status Errors**:
  - **Challenge**: Table marked Free while an order is open.
  - **Solution**: Sync `Tables` and `Orders` tables to ensure consistency.
- **Split Bills or Table Transfers**:
  - **Challenge**: Customers splitting bills or moving tables.
  - **Solution**: Enable splitting `OrderItems` or reassigning `TableID`.
- **Inventory Mismatches**:
  - **Challenge**: Cancellations causing inventory errors.
  - **Solution**: Reverse deductions for cancelled items.

## Benefits
- **Efficiency**: Streamlines order-taking, kitchen communication, and billing.
- **Real-Time Tracking**: Updates table status, order progress, and inventory instantly.
- **Flexibility**: Supports modifications, cancellations, and additional orders.
- **Analytics**: Provides detailed sales and performance reports.

## Implementation Notes
- **ERP Systems**: Suitable for customizable platforms like Odoo, SAP, or NetSuite.
- **Configuration**:
  - Set up table layouts and menu items in the ERP.
  - Configure tax/service charge rules.
  - Integrate with KDS for kitchen communication.
  - Define role-based permissions for staff.
- **Validation**: Ensure `TableID` in `Orders` matches a valid table in `Tables`.