package com.erp.pos.repository;

import com.erp.pos.enums.OrderStatus;
import com.erp.pos.enums.OrderType;
import com.erp.pos.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByCreatedById(Long userId);
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatus(String status);
    List<Order> findByOrderType(OrderType orderType);
    List<Order> findByTableId(Long tableId);
    List<Order> findTop5ByOrderByOrderDateDesc();
}
