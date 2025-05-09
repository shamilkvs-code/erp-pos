package com.erp.pos.service;

import com.erp.pos.enums.TableStatus;
import com.erp.pos.model.Order;
import com.erp.pos.model.RestaurantTable;

import java.util.List;
import java.util.Optional;

public interface TableService {
    List<RestaurantTable> getAllTables();
    List<RestaurantTable> getFilteredTables(String status, String location, Integer capacity);
    RestaurantTable getTableById(Long id);
    Optional<RestaurantTable> getTableByNumber(String tableNumber);
    List<RestaurantTable> getTablesByStatus(TableStatus status);
    List<RestaurantTable> getTablesByLocation(String location);
    List<RestaurantTable> getTablesByMinCapacity(Integer capacity);
    RestaurantTable createTable(RestaurantTable table);
    RestaurantTable updateTable(Long id, RestaurantTable table);
    void deleteTable(Long id);
    RestaurantTable assignOrderToTable(Long tableId, Order order);
    RestaurantTable clearTable(Long tableId);
    RestaurantTable changeTableStatus(Long tableId, TableStatus status);
}
