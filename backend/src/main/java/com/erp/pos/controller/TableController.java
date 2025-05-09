package com.erp.pos.controller;

import com.erp.pos.dto.TableDTO;
import com.erp.pos.enums.TableStatus;
import com.erp.pos.model.Order;
import com.erp.pos.model.RestaurantTable;
import com.erp.pos.service.OrderService;
import com.erp.pos.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tables")
@Tag(name = "Table Management", description = "APIs for managing restaurant tables")
public class TableController {

    @Autowired
    private TableService tableService;

    @Autowired
    private OrderService orderService;

    /**
     * Get all tables
     */
    @Operation(summary = "Get all tables", description = "Retrieves a list of all tables in the system")
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
    @Operation(summary = "Get table by ID", description = "Retrieves a table by its unique identifier")
    @GetMapping("/{id}")
    public TableDTO getTableById(@PathVariable Long id) {
        RestaurantTable table = tableService.getTableById(id);
        return TableDTO.fromEntity(table);
    }

    /**
     * Get table by table number
     */
    @Operation(summary = "Get table by table number", description = "Retrieves a table by its table number")
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
    @Operation(summary = "Get tables with optional filtering", description = "Retrieves a list of tables matching the specified criteria")
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
    @Operation(summary = "Create a new table", description = "Creates a new table in the system")
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
    @Operation(summary = "Update an existing table", description = "Updates an existing table in the system")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public TableDTO updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTable tableDetails) {
        RestaurantTable updatedTable = tableService.updateTable(id, tableDetails);
        return TableDTO.fromEntity(updatedTable);
    }

    /**
     * Delete a table
     */
    @Operation(summary = "Delete a table", description = "Deletes a table from the system")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
    }

    /**
     * Assign an order to a table
     */
    @Operation(summary = "Assign an order to a table", description = "Assigns an order to a table")
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
    @Operation(summary = "Create an order for a table", description = "Creates an order for a table")
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
    @Operation(summary = "Clear a table", description = "Removes the current order and sets the table status to CLEANING")
    @PostMapping("/{tableId}/clear")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public TableDTO clearTable(@PathVariable Long tableId) {
        RestaurantTable clearedTable = tableService.clearTable(tableId);
        return TableDTO.fromEntity(clearedTable);
    }

    /**
     * Change table status
     */
    @Operation(summary = "Change table status", description = "Changes the status of a table")
    @PatchMapping("/{tableId}/status")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableDTO> changeTableStatus(@PathVariable Long tableId, @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            TableStatus tableStatus = TableStatus.valueOf(status.toUpperCase());
            RestaurantTable updatedTable = tableService.changeTableStatus(tableId, tableStatus);
            return new ResponseEntity<>(TableDTO.fromEntity(updatedTable), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Update table position (for floor plan)
     */
    @Operation(summary = "Update table position", description = "Updates the position of a table for the floor plan")
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
    @Operation(summary = "Get floor plan", description = "Retrieves a list of all tables with position information")
    @GetMapping("/floor-plan")
    public List<TableDTO> getFloorPlan() {
        List<RestaurantTable> tables = tableService.getAllTables();
        return tables.stream()
                .map(TableDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Mark a table as available after cleaning
     */
    @Operation(summary = "Mark table as available", description = "Marks a table as available after cleaning")
    @PostMapping("/{tableId}/mark-available")
    @PreAuthorize("hasRole('CASHIER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public TableDTO markTableAsAvailable(@PathVariable Long tableId) {
        // Get the table
        RestaurantTable table = tableService.getTableById(tableId);

        // Check if the table is in CLEANING status
        if (table.getStatus() != TableStatus.CLEANING) {
            throw new IllegalStateException("Table must be in CLEANING status to mark as available");
        }

        // Change the table status to AVAILABLE
        RestaurantTable updatedTable = tableService.changeTableStatus(tableId, TableStatus.AVAILABLE);
        return TableDTO.fromEntity(updatedTable);
    }
}
