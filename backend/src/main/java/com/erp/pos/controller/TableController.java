package com.erp.pos.controller;

import com.erp.pos.model.Order;
import com.erp.pos.model.RestaurantTable;
import com.erp.pos.service.OrderService;
import com.erp.pos.service.TableService;
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
@RequestMapping("/api/tables")
public class TableController {

    @Autowired
    private TableService tableService;

    @Autowired
    private OrderService orderService;

    /**
     * Get all tables
     */
    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        List<RestaurantTable> tables = tableService.getAllTables();
        return new ResponseEntity<>(tables, HttpStatus.OK);
    }

    /**
     * Get table by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable Long id) {
        RestaurantTable table = tableService.getTableById(id);
        return new ResponseEntity<>(table, HttpStatus.OK);
    }

    /**
     * Get table by table number
     */
    @GetMapping("/number/{tableNumber}")
    public ResponseEntity<RestaurantTable> getTableByNumber(@PathVariable String tableNumber) {
        Optional<RestaurantTable> table = tableService.getTableByNumber(tableNumber);
        return table.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get tables by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RestaurantTable>> getTablesByStatus(@PathVariable String status) {
        try {
            RestaurantTable.TableStatus tableStatus = RestaurantTable.TableStatus.valueOf(status.toUpperCase());
            List<RestaurantTable> tables = tableService.getTablesByStatus(tableStatus);
            return new ResponseEntity<>(tables, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get tables by location
     */
    @GetMapping("/location/{location}")
    public ResponseEntity<List<RestaurantTable>> getTablesByLocation(@PathVariable String location) {
        List<RestaurantTable> tables = tableService.getTablesByLocation(location);
        return new ResponseEntity<>(tables, HttpStatus.OK);
    }

    /**
     * Get tables by minimum capacity
     */
    @GetMapping("/capacity/{capacity}")
    public ResponseEntity<List<RestaurantTable>> getTablesByMinCapacity(@PathVariable Integer capacity) {
        List<RestaurantTable> tables = tableService.getTablesByMinCapacity(capacity);
        return new ResponseEntity<>(tables, HttpStatus.OK);
    }

    /**
     * Create a new table
     */
    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantTable> createTable(@Valid @RequestBody RestaurantTable table) {
        RestaurantTable createdTable = tableService.createTable(table);
        return new ResponseEntity<>(createdTable, HttpStatus.CREATED);
    }

    /**
     * Update an existing table
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTable tableDetails) {
        RestaurantTable updatedTable = tableService.updateTable(id, tableDetails);
        return new ResponseEntity<>(updatedTable, HttpStatus.OK);
    }

    /**
     * Delete a table
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Assign an order to a table
     */
    @PostMapping("/{tableId}/orders")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantTable> assignOrderToTable(@PathVariable Long tableId, @Valid @RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        RestaurantTable updatedTable = tableService.assignOrderToTable(tableId, createdOrder);
        return new ResponseEntity<>(updatedTable, HttpStatus.OK);
    }

    /**
     * Create an order for a table
     */
    @PostMapping("/{tableId}/create-order")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Order> createOrderForTable(@PathVariable Long tableId, @Valid @RequestBody Order order) {
        // Get the table
        RestaurantTable table = tableService.getTableById(tableId);

        // Create the order
        Order createdOrder = orderService.createOrder(order);

        // Assign the order to the table
        tableService.assignOrderToTable(tableId, createdOrder);

        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    /**
     * Clear a table (remove current order and set status to CLEANING)
     */
    @PostMapping("/{tableId}/clear")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantTable> clearTable(@PathVariable Long tableId) {
        RestaurantTable clearedTable = tableService.clearTable(tableId);
        return new ResponseEntity<>(clearedTable, HttpStatus.OK);
    }

    /**
     * Change table status
     */
    @PatchMapping("/{tableId}/status")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantTable> changeTableStatus(@PathVariable Long tableId, @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            RestaurantTable.TableStatus tableStatus = RestaurantTable.TableStatus.valueOf(status.toUpperCase());
            RestaurantTable updatedTable = tableService.changeTableStatus(tableId, tableStatus);
            return new ResponseEntity<>(updatedTable, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
