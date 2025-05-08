package com.erp.pos.controller;

import com.erp.pos.dto.AddToTableCartDTO;
import com.erp.pos.dto.CreateTableOrderDTO;
import com.erp.pos.dto.RemoveFromTableCartDTO;
import com.erp.pos.dto.TableOrderResponseDTO;
import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;
import com.erp.pos.model.Product;
import com.erp.pos.model.RestaurantTable;
import com.erp.pos.model.User;
import com.erp.pos.service.OrderService;
import com.erp.pos.service.ProductService;
import com.erp.pos.service.CustomerService;
import com.erp.pos.service.TableService;
import com.erp.pos.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private TableService tableService;

    /**
     * Get all orders
     */
    @GetMapping
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    /**
     * Get order by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    /**
     * Get order by order number
     */
    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
        return order.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get orders by customer ID
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    /**
     * Get orders by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            List<Order> orders = orderService.getOrdersByStatus(orderStatus);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Create a new order
     */
    @PostMapping
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) {
        // Set the current user as the creator of the order
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            order.setCreatedBy(currentUser);
        }

        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    /**
     * Update an existing order
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @Valid @RequestBody Order orderDetails) {
        Order updatedOrder = orderService.updateOrder(id, orderDetails);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    /**
     * Delete an order
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Add an item to an order
     */
    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> addItemToOrder(@PathVariable Long orderId, @Valid @RequestBody OrderItem item) {
        orderService.addItemToOrder(orderId, item);
        Order updatedOrder = orderService.getOrderById(orderId);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    /**
     * Remove an item from an order
     */
    @DeleteMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> removeItemFromOrder(@PathVariable Long orderId, @PathVariable Long itemId) {
        orderService.removeItemFromOrder(orderId, itemId);
        Order updatedOrder = orderService.getOrderById(orderId);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    /**
     * Update order status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Order order = orderService.getOrderById(id);
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));

            Order updatedOrder = orderService.updateOrder(id, order);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get orders by order type
     */
    @GetMapping("/type/{orderType}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByType(@PathVariable String orderType) {
        try {
            Order.OrderType type = Order.OrderType.valueOf(orderType.toUpperCase());
            List<Order> orders = orderService.getOrdersByType(type);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get orders for a specific table
     */
    @GetMapping("/table/{tableId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByTable(@PathVariable Long tableId) {
        // Verify the table exists
        tableService.getTableById(tableId);
        // Get orders for this table
        List<Order> orders = orderService.getOrdersByTableId(tableId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    /**
     * Create a new order for a table
     */
    @PostMapping("/table/{tableId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public TableOrderResponseDTO createTableOrder(
            @PathVariable Long tableId,
            @Valid @RequestBody CreateTableOrderDTO orderDTO) {
        // Get the table
        RestaurantTable table = tableService.getTableById(tableId);

        // Create a new Order entity from the DTO
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setTable(table);
        order.setOrderType(Order.OrderType.DINE_IN);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setNumberOfGuests(orderDTO.getNumberOfGuests());
        order.setSpecialInstructions(orderDTO.getSpecialInstructions());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPaymentReference(orderDTO.getPaymentReference());

        // Set customer if provided
        if (orderDTO.getCustomerId() != null) {
            order.setCustomer(customerService.getCustomerById(orderDTO.getCustomerId()));
        }

        // Set the current user as the creator of the order
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            order.setCreatedBy(currentUser);
        }

        // Convert order items from DTO
        List<OrderItem> orderItems = new ArrayList<>();
        for (CreateTableOrderDTO.OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(productService.getProductById(itemDTO.getProductId()));
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());
            item.setSubtotal(itemDTO.getSubtotal());
            orderItems.add(item);
        }
        order.setOrderItems(orderItems);

        // Create the order
        Order createdOrder = orderService.createOrder(order);

        // Update the table status to OCCUPIED and assign the order
        tableService.assignOrderToTable(tableId, createdOrder);

        // Convert to response DTO and return
        return TableOrderResponseDTO.fromEntity(createdOrder);
    }

    /**
     * Get current active order for a table
     */
    @GetMapping("/table/{tableId}/current")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> getCurrentTableOrder(@PathVariable Long tableId) {
        RestaurantTable table = tableService.getTableById(tableId);

        if (table.getCurrentOrder() != null) {
            Order order = orderService.getOrderById(table.getCurrentOrder().getId());
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(order), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get current cart for a table (PENDING order)
     */
    @GetMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> getTableCart(@PathVariable Long tableId) {
        RestaurantTable table = tableService.getTableById(tableId);

        if (table.getCurrentOrder() != null) {
            Order order = orderService.getOrderById(table.getCurrentOrder().getId());

            // Only return if the order is in PENDING status (cart state)
            if (order.getStatus() == Order.OrderStatus.PENDING) {
                return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(order), HttpStatus.OK);
            }
        }

        // If no PENDING order found, return NOT_FOUND
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Add item to table cart
     */
    @PostMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> addToTableCart(
            @PathVariable Long tableId,
            @Valid @RequestBody AddToTableCartDTO cartItemDTO) {

        // Get the table
        RestaurantTable table = tableService.getTableById(tableId);
        Order order;

        // Check if we need to create a new order or update an existing one
        if (cartItemDTO.getOrderId() != null) {
            // Use the provided order ID
            order = orderService.getOrderById(cartItemDTO.getOrderId());

            // Verify this order belongs to the specified table
            if (order.getTable() == null || !order.getTable().getId().equals(tableId)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Verify the order is in PENDING status
            if (order.getStatus() != Order.OrderStatus.PENDING) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            // Check if there's an existing PENDING order for this table
            if (table.getCurrentOrder() != null) {
                Order currentOrder = orderService.getOrderById(table.getCurrentOrder().getId());
                if (currentOrder.getStatus() == Order.OrderStatus.PENDING) {
                    order = currentOrder;
                } else {
                    // Create a new order
                    order = createNewOrder(table, cartItemDTO);
                }
            } else {
                // Create a new order
                order = createNewOrder(table, cartItemDTO);
            }
        }

        // Add the item to the order
        Product product = productService.getProductById(cartItemDTO.getProductId());

        // Check if this product is already in the order
        boolean productFound = false;
        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct().getId().equals(cartItemDTO.getProductId())) {
                // Update existing item quantity and subtotal
                item.setQuantity(item.getQuantity() + cartItemDTO.getQuantity());
                item.setUnitPrice(cartItemDTO.getUnitPrice()); // Update unit price in case it changed
                item.setSubtotal(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())));
                productFound = true;
                break;
            }
        }

        // If product not found in order, add a new order item
        if (!productFound) {
            OrderItem newItem = new OrderItem();
            newItem.setOrder(order);
            newItem.setProduct(product);
            newItem.setQuantity(cartItemDTO.getQuantity());
            newItem.setUnitPrice(cartItemDTO.getUnitPrice());
            newItem.setSubtotal(cartItemDTO.getUnitPrice().multiply(new BigDecimal(cartItemDTO.getQuantity())));
            order.getOrderItems().add(newItem);
        }

        // Update order total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            totalAmount = totalAmount.add(item.getSubtotal());
        }
        order.setTotalAmount(totalAmount);

        // Update special instructions if provided
        if (cartItemDTO.getSpecialInstructions() != null) {
            order.setSpecialInstructions(cartItemDTO.getSpecialInstructions());
        }

        // Save the updated order
        Order updatedOrder = orderService.updateOrder(order.getId(), order);

        // If this is a new order, assign it to the table
        if (table.getCurrentOrder() == null) {
            tableService.assignOrderToTable(tableId, updatedOrder);
        }

        // Return the updated order
        return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
    }

    /**
     * Helper method to create a new order
     */
    private Order createNewOrder(RestaurantTable table, AddToTableCartDTO cartItemDTO) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setTable(table);
        order.setOrderType(Order.OrderType.DINE_IN);
        order.setStatus(Order.OrderStatus.PENDING);

        // Set number of guests if provided
        if (cartItemDTO.getNumberOfGuests() != null) {
            order.setNumberOfGuests(cartItemDTO.getNumberOfGuests());
        } else {
            // Default to 1 guest if not specified
            order.setNumberOfGuests(1);
        }

        // Set special instructions if provided
        if (cartItemDTO.getSpecialInstructions() != null) {
            order.setSpecialInstructions(cartItemDTO.getSpecialInstructions());
        }

        // Set the current user as the creator of the order
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            order.setCreatedBy(currentUser);
        }

        // Initialize order items list
        order.setOrderItems(new ArrayList<>());

        // Initialize total amount
        order.setTotalAmount(BigDecimal.ZERO);

        // Save the new order
        return orderService.createOrder(order);
    }

    /**
     * Remove item from table cart
     */
    @DeleteMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> removeFromTableCart(
            @PathVariable Long tableId,
            @Valid @RequestBody RemoveFromTableCartDTO removeItemDTO) {

        // Get the order
        Order order = orderService.getOrderById(removeItemDTO.getOrderId());

        // Verify this order belongs to the specified table
        if (order.getTable() == null || !order.getTable().getId().equals(tableId)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Verify the order is in PENDING status
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Find the order item for the specified product
        OrderItem itemToUpdate = null;
        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct().getId().equals(removeItemDTO.getProductId())) {
                itemToUpdate = item;
                break;
            }
        }

        // If item not found, return error
        if (itemToUpdate == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Check if we should remove the entire item or just reduce quantity
        if (removeItemDTO.isRemoveEntireItem() || itemToUpdate.getQuantity() <= removeItemDTO.getQuantity()) {
            // Remove the entire item
            order.getOrderItems().remove(itemToUpdate);
        } else {
            // Reduce the quantity
            itemToUpdate.setQuantity(itemToUpdate.getQuantity() - removeItemDTO.getQuantity());
            // Update the subtotal
            itemToUpdate.setSubtotal(itemToUpdate.getUnitPrice().multiply(new BigDecimal(itemToUpdate.getQuantity())));
        }

        // Update order total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            totalAmount = totalAmount.add(item.getSubtotal());
        }
        order.setTotalAmount(totalAmount);

        // If all items are removed, consider canceling the order
        if (order.getOrderItems().isEmpty()) {
            // Option 1: Cancel the order
            order.setStatus(Order.OrderStatus.CANCELLED);

            // Save the updated order
            Order updatedOrder = orderService.updateOrder(order.getId(), order);

            // Clear the table
            tableService.clearTable(tableId);

            // Return the cancelled order
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
        } else {
            // Save the updated order
            Order updatedOrder = orderService.updateOrder(order.getId(), order);

            // Return the updated order
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
        }
    }

    /**
     * Complete an order and clear the table
     */
    @PostMapping("/{orderId}/complete-and-clear")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> completeOrderAndClearTable(
            @PathVariable Long orderId,
            @RequestBody(required = false) Map<String, Object> paymentDetails) {

        // Get the order
        Order order = orderService.getOrderById(orderId);

        if (order.getTable() == null) {
            return new ResponseEntity<>(Map.of("error", "This order is not associated with a table"), HttpStatus.BAD_REQUEST);
        }

        // Update order status to COMPLETED
        order.setStatus(Order.OrderStatus.COMPLETED);

        // Update payment information if provided
        if (paymentDetails != null) {
            if (paymentDetails.containsKey("paymentMethod")) {
                String paymentMethod = (String) paymentDetails.get("paymentMethod");
                order.setPaymentMethod(Order.PaymentMethod.valueOf(paymentMethod.toUpperCase()));
            }

            if (paymentDetails.containsKey("paymentReference")) {
                order.setPaymentReference((String) paymentDetails.get("paymentReference"));
            }
        }

        // Save the updated order
        Order completedOrder = orderService.updateOrder(orderId, order);

        // Clear the table
        Long tableId = order.getTable().getId();
        RestaurantTable clearedTable = tableService.clearTable(tableId);

        // Return both the completed order and the cleared table
        Map<String, Object> response = Map.of(
            "order", TableOrderResponseDTO.fromEntity(completedOrder),
            "table", clearedTable
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
