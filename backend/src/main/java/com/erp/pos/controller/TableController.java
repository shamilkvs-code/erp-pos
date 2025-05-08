package com.erp.pos.controller;

import com.erp.pos.dto.TableDTO;
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
import java.util.stream.Collectors;

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
    public List<TableDTO> getAllTables() {
        List<RestaurantTable> tables = tableService.getAllTables();
        return tables.stream()
                .map(TableDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get table by ID
     */
    @GetMapping("/{id}")
    public TableDTO getTableById(@PathVariable Long id) {
        RestaurantTable table = tableService.getTableById(id);
        return TableDTO.fromEntity(table);
    }

    /**
     * Get table by table number
     */
    @GetMapping("/number/{tableNumber}")
    public ResponseEntity<TableDTO> getTableByNumber(@PathVariable String tableNumber) {
        Optional<RestaurantTable> table = tableService.getTableByNumber(tableNumber);
        return table.map(value -> new ResponseEntity<>(TableDTO.fromEntity(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get tables with optional filtering by status, location, and minimum capacity.
     * All parameters are optional and can be combined for more specific filtering.
     *
     * @param status Optional table status filter (e.g., "OCCUPIED", "AVAILABLE", "CLEANING")
     * @param location Optional location filter
     * @param capacity Optional minimum capacity filter
     * @return List of tables matching the specified criteria
     */
    @GetMapping("/filter")
    public ResponseEntity<List<TableDTO>> getTablesWithFilters(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        
        try {
            // Use the service method to get filtered tables
            List<RestaurantTable> tables = tableService.getFilteredTables(status, location, capacity);

            // Convert to DTOs
            List<TableDTO> tableDTOs = tables.stream()
                    .map(TableDTO::fromEntity)
                    .collect(Collectors.toList());
                    
            return ResponseEntity.ok(tableDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Create a new table
     */
    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public TableDTO createTable(@Valid @RequestBody RestaurantTable table) {
        RestaurantTable createdTable = tableService.createTable(table);
        return TableDTO.fromEntity(createdTable);
    }

    /**
     * Update an existing table
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public TableDTO updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTable tableDetails) {
        RestaurantTable updatedTable = tableService.updateTable(id, tableDetails);
        return TableDTO.fromEntity(updatedTable);
    }

    /**
     * Delete a table
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
    }

    /**
     * Assign an order to a table
     */
    @PostMapping("/{tableId}/orders")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public TableDTO assignOrderToTable(@PathVariable Long tableId, @Valid @RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        RestaurantTable updatedTable = tableService.assignOrderToTable(tableId, createdOrder);
        return TableDTO.fromEntity(updatedTable);
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
    public TableDTO clearTable(@PathVariable Long tableId) {
        RestaurantTable clearedTable = tableService.clearTable(tableId);
        return TableDTO.fromEntity(clearedTable);
    }

    /**
     * Change table status
     */
    @PatchMapping("/{tableId}/status")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableDTO> changeTableStatus(@PathVariable Long tableId, @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            RestaurantTable.TableStatus tableStatus = RestaurantTable.TableStatus.valueOf(status.toUpperCase());
            RestaurantTable updatedTable = tableService.changeTableStatus(tableId, tableStatus);
            return new ResponseEntity<>(TableDTO.fromEntity(updatedTable), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Update table position (for floor plan)
     */
    @PatchMapping("/{tableId}/position")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public TableDTO updateTablePosition(
            @PathVariable Long tableId,
            @RequestBody Map<String, Object> positionUpdate) {

        RestaurantTable table = tableService.getTableById(tableId);

        if (positionUpdate.containsKey("positionX")) {
            table.setPositionX((Integer) positionUpdate.get("positionX"));
        }

        if (positionUpdate.containsKey("positionY")) {
            table.setPositionY((Integer) positionUpdate.get("positionY"));
        }

        if (positionUpdate.containsKey("width")) {
            table.setWidth((Integer) positionUpdate.get("width"));
        }

        if (positionUpdate.containsKey("height")) {
            table.setHeight((Integer) positionUpdate.get("height"));
        }

        if (positionUpdate.containsKey("shape")) {
            table.setShape((String) positionUpdate.get("shape"));
        }

        RestaurantTable updatedTable = tableService.updateTable(tableId, table);
        return TableDTO.fromEntity(updatedTable);
    }

    /**
     * Get floor plan (all tables with position information)
     */
    @GetMapping("/floor-plan")
    public List<TableDTO> getFloorPlan() {
        List<RestaurantTable> tables = tableService.getAllTables();
        return tables.stream()
                .map(TableDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
