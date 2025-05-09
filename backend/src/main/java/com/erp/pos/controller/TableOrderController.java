package com.erp.pos.controller;

import com.erp.pos.dto.AddToTableCartDTO;
import com.erp.pos.dto.CreateTableOrderDTO;
import com.erp.pos.dto.RemoveFromTableCartDTO;
import com.erp.pos.dto.TableOrderResponseDTO;
import com.erp.pos.exception.ResourceNotFoundException;
import com.erp.pos.model.Order;
import com.erp.pos.service.OrderService;
import com.erp.pos.service.TableService;
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

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/table-orders")
@Tag(name = "Table Order Management", description = "APIs for managing restaurant table orders and cart operations")
public class TableOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private TableService tableService;

    @Operation(summary = "Get orders for a specific table", description = "Retrieves all orders associated with a specific table")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the orders",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Table not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/table/{tableId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByTable(
            @Parameter(description = "ID of the table to retrieve orders for", required = true) @PathVariable Long tableId) {
        // Verify the table exists
        tableService.getTableById(tableId);
        // Get orders for this table
        List<Order> orders = orderService.getOrdersByTableId(tableId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @Operation(summary = "Create a new order for a table", description = "Creates a new order associated with a specific table")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Order successfully created",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TableOrderResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid order data"),
        @ApiResponse(responseCode = "404", description = "Table not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PostMapping("/table/{tableId}")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public TableOrderResponseDTO createTableOrder(
            @Parameter(description = "ID of the table to create order for", required = true) @PathVariable Long tableId,
            @Parameter(description = "Order details", required = true) @Valid @RequestBody CreateTableOrderDTO orderDTO) {
        Order createdOrder = orderService.createTableOrder(tableId, orderDTO);
        return TableOrderResponseDTO.fromEntity(createdOrder);
    }

    @Operation(summary = "Get current active order for a table", description = "Retrieves the current active order for a specific table")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the current order",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TableOrderResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "No active order found for the table"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/table/{tableId}/current")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> getCurrentTableOrder(
            @Parameter(description = "ID of the table to get current order for", required = true) @PathVariable Long tableId) {
        Optional<Order> orderOpt = orderService.getCurrentTableOrder(tableId);

        return orderOpt.map(order -> new ResponseEntity<>(TableOrderResponseDTO.fromEntity(order), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get current cart for a table", description = "Retrieves the current cart (active order) for a specific table")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the cart",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TableOrderResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "No active cart found for the table"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @GetMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> getTableCart(
            @Parameter(description = "ID of the table to get cart for", required = true) @PathVariable Long tableId) {
        Optional<Order> orderOpt = orderService.getActiveTableOrder(tableId);

        return orderOpt.map(order -> new ResponseEntity<>(TableOrderResponseDTO.fromEntity(order), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Add item to table cart", description = "Adds an item to the cart for a specific table")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Item successfully added to cart",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TableOrderResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid item data"),
        @ApiResponse(responseCode = "404", description = "Table or product not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PostMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> addToTableCart(
            @Parameter(description = "ID of the table to add item to cart", required = true) @PathVariable Long tableId,
            @Parameter(description = "Item details to add to cart", required = true) @Valid @RequestBody AddToTableCartDTO cartItemDTO) {
        try {
            Order updatedOrder = orderService.addItemToTableOrder(tableId, cartItemDTO);
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Remove item from table cart", description = "Removes an item from the cart for a specific table")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Item successfully removed from cart",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = TableOrderResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "404", description = "Table, order, or item not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @DeleteMapping("/table/{tableId}/cart")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableOrderResponseDTO> removeFromTableCart(
            @Parameter(description = "ID of the table to remove item from cart", required = true) @PathVariable Long tableId,
            @Parameter(description = "Details of the item to remove", required = true) @Valid @RequestBody RemoveFromTableCartDTO removeItemDTO) {
        try {
            Order updatedOrder = orderService.removeItemFromTableOrder(tableId, removeItemDTO);
            return new ResponseEntity<>(TableOrderResponseDTO.fromEntity(updatedOrder), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Complete an order and clear the table", description = "Completes an order, processes payment, and clears the table for new customers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order successfully completed and table cleared",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400", description = "Invalid request or payment details"),
        @ApiResponse(responseCode = "404", description = "Order or table not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - requires CASHIER, MANAGER, or ADMIN role")
    })
    @PostMapping("/{orderId}/complete-and-clear")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> completeOrderAndClearTable(
            @Parameter(description = "ID of the order to complete", required = true) @PathVariable Long orderId,
            @Parameter(description = "Payment details for the order") @RequestBody(required = false) Map<String, Object> paymentDetails) {
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
