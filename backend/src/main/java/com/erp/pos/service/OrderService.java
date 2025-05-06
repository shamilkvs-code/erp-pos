package com.erp.pos.service;

import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Optional<Order> getOrderByOrderNumber(String orderNumber);
    List<Order> getOrdersByCustomerId(Long customerId);
    List<Order> getOrdersByUserId(Long userId);
    List<Order> getOrdersByStatus(Order.OrderStatus status);
    Order createOrder(Order order);
    Order updateOrder(Long id, Order order);
    void deleteOrder(Long id);
    void addItemToOrder(Long orderId, OrderItem item);
    void removeItemFromOrder(Long orderId, Long itemId);
}
