package com.erp.pos.service.impl;

import com.erp.pos.enums.TableStatus;
import com.erp.pos.exception.ResourceNotFoundException;
import com.erp.pos.model.Order;
import com.erp.pos.model.RestaurantTable;
import com.erp.pos.repository.TableRepository;
import com.erp.pos.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TableServiceImpl implements TableService {

    @Autowired
    private TableRepository tableRepository;

    @Override
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @Override
    public List<RestaurantTable> getFilteredTables(String status, String location, Integer capacity) {
        return getAllTables().stream()
            .filter(table -> {
                // Status filter
                if (status != null && !status.isEmpty()) {
                    try {
                        TableStatus tableStatus = TableStatus.valueOf(status.toUpperCase());
                        if (table.getStatus() != tableStatus) {
                            return false;
                        }
                    } catch (IllegalArgumentException e) {
                        // Invalid status, don't apply this filter
                    }
                }

                // Location filter
                if (location != null && !location.isEmpty() &&
                    !location.equalsIgnoreCase(table.getLocation())) {
                    return false;
                }

                // Capacity filter
                if (capacity != null && table.getCapacity() < capacity) {
                    return false;
                }

                return true;
            })
            .collect(Collectors.toList());
    }

    @Override
    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
    }

    @Override
    public Optional<RestaurantTable> getTableByNumber(String tableNumber) {
        return tableRepository.findByTableNumber(tableNumber);
    }

    @Override
    public List<RestaurantTable> getTablesByStatus(TableStatus status) {
        return tableRepository.findByStatus(status);
    }

    @Override
    public List<RestaurantTable> getTablesByLocation(String location) {
        return tableRepository.findByLocation(location);
    }

    @Override
    public List<RestaurantTable> getTablesByMinCapacity(Integer capacity) {
        return tableRepository.findByCapacityGreaterThanEqual(capacity);
    }

    @Override
    @Transactional
    public RestaurantTable createTable(RestaurantTable table) {
        // Set default status if not provided
        if (table.getStatus() == null) {
            table.setStatus(TableStatus.AVAILABLE);
        }

        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable updateTable(Long id, RestaurantTable tableDetails) {
        RestaurantTable table = getTableById(id);

        table.setTableNumber(tableDetails.getTableNumber());
        table.setCapacity(tableDetails.getCapacity());
        table.setStatus(tableDetails.getStatus());
        table.setLocation(tableDetails.getLocation());

        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public void deleteTable(Long id) {
        RestaurantTable table = getTableById(id);
        tableRepository.delete(table);
    }

    @Override
    @Transactional
    public RestaurantTable assignOrderToTable(Long tableId, Order order) {
        RestaurantTable table = getTableById(tableId);

        // Check if table is available
        if (table.getStatus() != TableStatus.AVAILABLE && table.getStatus() != TableStatus.RESERVED) {
            throw new IllegalStateException("Table is not available for assignment");
        }

        table.setCurrentOrder(order);
        table.setStatus(TableStatus.OCCUPIED);

        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable clearTable(Long tableId) {
        RestaurantTable table = getTableById(tableId);

        table.setCurrentOrder(null);
        table.setStatus(TableStatus.CLEANING);

        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable changeTableStatus(Long tableId, TableStatus status) {
        RestaurantTable table = getTableById(tableId);

        table.setStatus(status);

        return tableRepository.save(table);
    }
}
