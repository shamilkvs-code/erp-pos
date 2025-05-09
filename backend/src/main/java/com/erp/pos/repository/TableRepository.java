package com.erp.pos.repository;

import com.erp.pos.enums.TableStatus;
import com.erp.pos.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByTableNumber(String tableNumber);
    List<RestaurantTable> findByStatus(TableStatus status);
    List<RestaurantTable> findByLocation(String location);
    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);
}
