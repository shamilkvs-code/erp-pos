package com.erp.pos.controller;

import com.erp.pos.dto.AddToTableCartDTO;
import com.erp.pos.dto.CreateTableOrderDTO;
import com.erp.pos.dto.RemoveFromTableCartDTO;
import com.erp.pos.dto.TableOrderResponseDTO;
import com.erp.pos.exception.ResourceNotFoundException;
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
        Order createdOrder = orderService.createTableOrder(tableId, orderDTO);
        return TableOrderResponseDTO.fromEntity(createdOrder);
    }

    /**
     * Get current active order for a table
     */
    @GetMapping("/table/{tableId}/current")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> getCurrentTableOrder(@PathVariable Long tableId) {
        Optional<Order> orderOpt = orderService.getCurrentTableOrder(tableId);

        return orderOpt.map(order -> new ResponseEntity<>(TableOrderResponseDTO.fromEntity(order), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get current cart for a table (active order)
     */
    @GetMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> getTableCart(@PathVariable Long tableId) {
        Optional<Order> orderOpt = orderService.getActiveTableOrder(tableId);

        return orderOpt.map(order -> new ResponseEntity<>(TableOrderResponseDTO.fromEntity(order), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Add item to table cart
     */
    @PostMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> addToTableCart(
            @PathVariable Long tableId,
            @Valid @RequestBody AddToTableCartDTO cartItemDTO) {
        try {
            Order updatedOrder = orderService.addItemToTableOrder(tableId, cartItemDTO);
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    /**
     * Remove item from table cart
     */
    @DeleteMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> removeFromTableCart(
            @PathVariable Long tableId,
            @Valid @RequestBody RemoveFromTableCartDTO removeItemDTO) {
        try {
            Order updatedOrder = orderService.removeItemFromTableOrder(tableId, removeItemDTO);
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
        try {
            Map<String, Object> result = orderService.completeOrderAndClearTable(orderId, paymentDetails);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}
