package com.erp.pos.controller;

import com.erp.pos.enums.OrderStatus;
import com.erp.pos.enums.OrderType;
import com.erp.pos.exception.ResourceNotFoundException;
import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;
import com.erp.pos.model.Product;
import com.erp.pos.model.User;
import com.erp.pos.service.OrderService;
import com.erp.pos.service.ProductService;
import com.erp.pos.service.CustomerService;
import com.erp.pos.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management", description = "APIs for managing orders and order operations")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CustomerService customerService;

    @Operation(summary = "Get all orders", description = "Retrieves a list of all orders in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all orders",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the order",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderById(
            @Parameter(description = "ID of the order to retrieve", required = true) @PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @Operation(summary = "Get order by order number", description = "Retrieves a specific order by its order number")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the order",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderByOrderNumber(
            @Parameter(description = "Order number to retrieve", required = true) @PathVariable String orderNumber) {
        Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
        return order.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get orders by customer ID", description = "Retrieves all orders for a specific customer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the orders",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(
            @Parameter(description = "ID of the customer to retrieve orders for", required = true) @PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @Operation(summary = "Get orders by status", description = "Retrieves all orders with a specific status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the orders",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid status value"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByStatus(
            @Parameter(description = "Status to filter orders by (PENDING, IN_PROGRESS, READY, COMPLETED, CANCELLED)", required = true)
            @PathVariable String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            List<Order> orders = orderService.getOrdersByStatus(orderStatus);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Create a new order", description = "Creates a new order in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Order successfully created",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid order data"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PostMapping
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> createOrder(
            @Parameter(description = "Order object to be created", required = true)
            @Valid @RequestBody Order order) {
        // Set the current user as the creator of the order
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            order.setCreatedBy(currentUser);
        }

        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing order", description = "Updates an existing order with new details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order successfully updated",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid order data"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrder(
            @Parameter(description = "ID of the order to update", required = true) @PathVariable Long id,
            @Parameter(description = "Updated order details", required = true) @Valid @RequestBody Order orderDetails) {
        Order updatedOrder = orderService.updateOrder(id, orderDetails);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    @Operation(summary = "Delete an order", description = "Deletes an order from the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Order successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires MANAGER or ADMIN role")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID of the order to delete", required = true) @PathVariable Long id) {
        orderService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Add an item to an order", description = "Adds a new item to an existing order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Item successfully added to order",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid item data"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> addItemToOrder(
            @Parameter(description = "ID of the order to add item to", required = true) @PathVariable Long orderId,
            @Parameter(description = "Item to add to the order", required = true) @Valid @RequestBody OrderItem item) {
        orderService.addItemToOrder(orderId, item);
        Order updatedOrder = orderService.getOrderById(orderId);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    @Operation(summary = "Remove an item from an order", description = "Removes an item from an existing order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Item successfully removed from order",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order or item not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @DeleteMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> removeItemFromOrder(
            @Parameter(description = "ID of the order to remove item from", required = true) @PathVariable Long orderId,
            @Parameter(description = "ID of the item to remove", required = true) @PathVariable Long itemId) {
        orderService.removeItemFromOrder(orderId, itemId);
        Order updatedOrder = orderService.getOrderById(orderId);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    @Operation(summary = "Update order status", description = "Updates the status of an existing order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order status successfully updated",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid status value"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @Parameter(description = "ID of the order to update status", required = true) @PathVariable Long id,
            @Parameter(description = "New status value", required = true) @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Order order = orderService.getOrderById(id);
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));

            Order updatedOrder = orderService.updateOrder(id, order);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Get orders by order type", description = "Retrieves all orders of a specific type")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the orders",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid order type value"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/type/{orderType}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByType(
            @Parameter(description = "Order type to filter by (DINE_IN, TAKEAWAY, DELIVERY)", required = true)
            @PathVariable String orderType) {
        try {
            OrderType type = OrderType.valueOf(orderType.toUpperCase());
            List<Order> orders = orderService.getOrdersByType(type);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
















}
