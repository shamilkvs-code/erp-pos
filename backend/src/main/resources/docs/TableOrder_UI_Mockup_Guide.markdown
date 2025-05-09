# Table Order UI Mockup Guide

This document provides visual mockups and layout guidelines for implementing the table order management UI. These mockups should be used in conjunction with the UI Implementation Guide and Implementation Sequence documents.

## Table Layout View

The main view showing all tables in the restaurant with their current status.

```
+--------------------------------------------------------------+
|                       RESTAURANT NAME                         |
+--------------------------------------------------------------+
| [Filter: All ▼] [Search: ________] [Refresh] [Settings]      |
+--------------------------------------------------------------+
|                                                              |
|  +-------+  +-------+  +-------+  +-------+  +-------+      |
|  | T-01  |  | T-02  |  | T-03  |  | T-04  |  | T-05  |      |
|  | (4)   |  | (2)   |  | (6)   |  | (4)   |  | (8)   |      |
|  |       |  |       |  |       |  |       |  |       |      |
|  |  🟢   |  |  🔴   |  |  🟡   |  |  🔵   |  |  🟢   |      |
|  +-------+  +-------+  +-------+  +-------+  +-------+      |
|                                                              |
|  +-------+  +-------+  +-------+  +-------+  +-------+      |
|  | T-06  |  | T-07  |  | T-08  |  | T-09  |  | T-10  |      |
|  | (2)   |  | (4)   |  | (4)   |  | (6)   |  | (2)   |      |
|  |       |  |       |  |       |  |       |  |       |      |
|  |  🟢   |  |  🟢   |  |  🔴   |  |  🟢   |  |  🔴   |      |
|  +-------+  +-------+  +-------+  +-------+  +-------+      |
|                                                              |
+--------------------------------------------------------------+
| Legend: 🟢 Available  🔴 Occupied  🟡 Reserved  🔵 Cleaning  |
+--------------------------------------------------------------+
```

**Key Features:**
- Tables displayed in a grid layout (can also be implemented as a floor plan)
- Each table shows:
  - Table number
  - Capacity (in parentheses)
  - Status indicator (color-coded)
- Filter and search functionality
- Refresh button to update table statuses
- Legend explaining color codes

## Table Detail Panel

Appears when a table is selected, showing detailed information.

```
+--------------------------------------------------------------+
|                       TABLE DETAILS                           |
+--------------------------------------------------------------+
| Table: T-02                                      [X] Close   |
+--------------------------------------------------------------+
| Status: OCCUPIED                                             |
| Capacity: 2 persons                                          |
| Location: Main Floor                                         |
| Current Order: #ORD-2023-1234                                |
+--------------------------------------------------------------+
|                   CURRENT ORDER SUMMARY                      |
+--------------------------------------------------------------+
| Order Time: 2023-05-09 14:30                                 |
| Items: 3                                                     |
| Total: $45.50                                                |
| Status: PENDING                                              |
+--------------------------------------------------------------+
|                         ACTIONS                              |
+--------------------------------------------------------------+
| [View Full Order]  [Add Items]  [Complete Order]             |
+--------------------------------------------------------------+
```

**For Available Tables:**
```
+--------------------------------------------------------------+
|                       TABLE DETAILS                           |
+--------------------------------------------------------------+
| Table: T-01                                      [X] Close   |
+--------------------------------------------------------------+
| Status: AVAILABLE                                            |
| Capacity: 4 persons                                          |
| Location: Main Floor                                         |
+--------------------------------------------------------------+
|                         ACTIONS                              |
+--------------------------------------------------------------+
|              [Create New Order]  [Reserve Table]             |
+--------------------------------------------------------------+
```

**For Cleaning Tables:**
```
+--------------------------------------------------------------+
|                       TABLE DETAILS                           |
+--------------------------------------------------------------+
| Table: T-04                                      [X] Close   |
+--------------------------------------------------------------+
| Status: CLEANING                                             |
| Capacity: 4 persons                                          |
| Location: Main Floor                                         |
+--------------------------------------------------------------+
|                         ACTIONS                              |
+--------------------------------------------------------------+
|                    [Mark as Available]                       |
+--------------------------------------------------------------+
```

## Order Creation Form

Form for creating a new order for a table.

```
+--------------------------------------------------------------+
|                     CREATE NEW ORDER                          |
+--------------------------------------------------------------+
| Table: T-01 (4 persons)                         [X] Cancel   |
+--------------------------------------------------------------+
| Number of Guests: [2___]                                     |
+--------------------------------------------------------------+
|                      SELECT PRODUCTS                         |
+--------------------------------------------------------------+
| [Category: All ▼]  [Search: ________]                        |
+--------------------------------------------------------------+
| Product          | Price    | Quantity | Subtotal            |
+--------------------------------------------------------------+
| Pizza Margherita | $15.00   | [2__]    | $30.00              |
| Coca Cola        | $3.50    | [2__]    | $7.00               |
| Tiramisu         | [Add+]   | [0__]    | $0.00               |
| Caesar Salad     | [Add+]   | [0__]    | $0.00               |
+--------------------------------------------------------------+
| Special Instructions:                                        |
| [________________________________________________]          |
+--------------------------------------------------------------+
|                       ORDER SUMMARY                          |
+--------------------------------------------------------------+
| Total Items: 4                                               |
| Total Amount: $37.00                                         |
+--------------------------------------------------------------+
|                    [Create Order]                            |
+--------------------------------------------------------------+
```

## Order Detail View

Detailed view of an existing order.

```
+--------------------------------------------------------------+
|                       ORDER DETAILS                           |
+--------------------------------------------------------------+
| Order #: ORD-2023-1234                          [X] Close    |
| Table: T-02 (2 persons)                                      |
| Order Time: 2023-05-09 14:30                                 |
| Status: PENDING                                              |
+--------------------------------------------------------------+
|                        ORDER ITEMS                           |
+--------------------------------------------------------------+
| Product          | Price    | Quantity | Subtotal   | Actions|
+--------------------------------------------------------------+
| Pizza Margherita | $15.00   | 2        | $30.00     | [✖]    |
| Coca Cola        | $3.50    | 2        | $7.00      | [✖]    |
| Garlic Bread     | $4.25    | 2        | $8.50      | [✖]    |
+--------------------------------------------------------------+
| Special Instructions: No onions on the pizza                 |
+--------------------------------------------------------------+
|                       ORDER SUMMARY                          |
+--------------------------------------------------------------+
| Subtotal: $45.50                                             |
| Tax: $3.64                                                   |
| Total: $49.14                                                |
+--------------------------------------------------------------+
|                         ACTIONS                              |
+--------------------------------------------------------------+
| [Add Items]  [Update Status ▼]  [Complete Order]             |
+--------------------------------------------------------------+
```

## Add Item Form

Form for adding items to an existing order.

```
+--------------------------------------------------------------+
|                        ADD ITEMS                              |
+--------------------------------------------------------------+
| Order #: ORD-2023-1234                          [X] Cancel   |
| Table: T-02                                                  |
+--------------------------------------------------------------+
|                      SELECT PRODUCTS                         |
+--------------------------------------------------------------+
| [Category: All ▼]  [Search: ________]                        |
+--------------------------------------------------------------+
| Product          | Price    | Quantity | Actions             |
+--------------------------------------------------------------+
| Tiramisu         | $6.50    | [1__]    | [Add to Order]      |
| Caesar Salad     | $8.75    | [0__]    | [Add to Order]      |
| Espresso         | $3.25    | [0__]    | [Add to Order]      |
| Cheesecake       | $5.50    | [0__]    | [Add to Order]      |
+--------------------------------------------------------------+
| Special Instructions:                                        |
| [________________________________________________]          |
+--------------------------------------------------------------+
|                    [Done Adding Items]                       |
+--------------------------------------------------------------+
```

## Payment Processing Form

Form for processing payment when completing an order.

```
+--------------------------------------------------------------+
|                    COMPLETE ORDER                             |
+--------------------------------------------------------------+
| Order #: ORD-2023-1234                          [X] Cancel   |
| Table: T-02                                                  |
+--------------------------------------------------------------+
|                       ORDER SUMMARY                          |
+--------------------------------------------------------------+
| Subtotal: $45.50                                             |
| Tax: $3.64                                                   |
| Total: $49.14                                                |
+--------------------------------------------------------------+
|                     PAYMENT DETAILS                          |
+--------------------------------------------------------------+
| Payment Method: [CREDIT_CARD ▼]                              |
| Payment Reference: [TRANS-123456_______________]             |
| Tip Amount: [$5.00_______]                                   |
+--------------------------------------------------------------+
|                      FINAL AMOUNT                            |
+--------------------------------------------------------------+
| Total + Tip: $54.14                                          |
+--------------------------------------------------------------+
|                [Complete Order and Clear Table]              |
+--------------------------------------------------------------+
```

## Mobile View Adaptations

For mobile devices, the layout should adapt as follows:

### Mobile Table Layout

```
+---------------------------+
|      RESTAURANT NAME      |
+---------------------------+
| [Filter ▼] [Search 🔍]    |
+---------------------------+
| +-------+    +-------+   |
| | T-01  |    | T-02  |   |
| | (4)🟢 |    | (2)🔴 |   |
| +-------+    +-------+   |
|                          |
| +-------+    +-------+   |
| | T-03  |    | T-04  |   |
| | (6)🟡 |    | (4)🔵 |   |
| +-------+    +-------+   |
|                          |
| +-------+    +-------+   |
| | T-05  |    | T-06  |   |
| | (8)🟢 |    | (2)🟢 |   |
| +-------+    +-------+   |
+---------------------------+
```

### Mobile Order Detail

```
+---------------------------+
|      ORDER DETAILS        |
+---------------------------+
| Order #: ORD-2023-1234    |
| Table: T-02 (2 persons)   |
| Status: PENDING           |
+---------------------------+
|       ORDER ITEMS         |
+---------------------------+
| Pizza Margherita          |
| $15.00 x 2 = $30.00  [✖] |
+---------------------------+
| Coca Cola                 |
| $3.50 x 2 = $7.00    [✖] |
+---------------------------+
| Garlic Bread              |
| $4.25 x 2 = $8.50    [✖] |
+---------------------------+
| Special: No onions        |
| Total: $45.50             |
+---------------------------+
|         ACTIONS           |
+---------------------------+
| [Add Items]               |
| [Update Status ▼]         |
| [Complete Order]          |
+---------------------------+
```

## UI State Transitions

The following diagram illustrates the state transitions for the UI:

```
┌─────────────┐     Create Order     ┌─────────────┐
│  AVAILABLE  │──────────────────────▶  OCCUPIED   │
└─────────────┘                      └─────────────┘
      ▲                                     │
      │                                     │
      │                                     │
      │                                     │
      │         Complete Order              ▼
┌─────────────┐◀─────────────────────┌─────────────┐
│  CLEANING   │                      │  COMPLETED  │
└─────────────┘                      └─────────────┘
```

## Color Scheme

Use the following color scheme for consistency:

- **Available**: #4CAF50 (Green)
- **Occupied**: #F44336 (Red)
- **Reserved**: #FFC107 (Yellow)
- **Cleaning**: #2196F3 (Blue)
- **Primary Action**: #3F51B5 (Indigo)
- **Secondary Action**: #9E9E9E (Gray)
- **Danger Action**: #F44336 (Red)

## Typography

- **Headings**: Roboto, 18-24px, bold
- **Body Text**: Roboto, 14-16px, regular
- **Labels**: Roboto, 12-14px, medium
- **Buttons**: Roboto, 14-16px, medium

## Icons

Use the following icons for common actions:

- **Add**: Plus sign (➕)
- **Remove**: X sign (✖)
- **Edit**: Pencil icon (✏️)
- **Complete**: Checkmark (✓)
- **Cancel**: X sign (✖)
- **Refresh**: Circular arrow (🔄)

## Implementation Notes

1. **Responsive Design**:
   - Use CSS Grid or Flexbox for layout
   - Implement breakpoints at 768px and 1024px
   - Stack elements vertically on mobile

2. **Accessibility**:
   - Use semantic HTML elements
   - Include proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain color contrast ratios

3. **Animation**:
   - Add subtle transitions between states
   - Use loading indicators during API calls
   - Animate status changes

4. **Error States**:
   - Design error messages inline with fields
   - Use toast notifications for system errors
   - Provide clear recovery actions

## Conclusion

These mockups provide a visual guide for implementing the table order management UI. They should be used as a reference for layout and functionality, but can be adapted to match your application's design system and brand guidelines.
