package com.erp.pos.service;

import com.erp.pos.dto.AddToTableCartDTO;
import com.erp.pos.dto.CreateTableOrderDTO;
import com.erp.pos.dto.RemoveFromTableCartDTO;
import com.erp.pos.enums.OrderStatus;
import com.erp.pos.enums.OrderType;
import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Optional<Order> getOrderByOrderNumber(String orderNumber);
    List<Order> getOrdersByCustomerId(Long customerId);
    List<Order> getOrdersByUserId(Long userId);
    List<Order> getOrdersByStatus(OrderStatus status);
    List<Order> getOrdersByType(OrderType orderType);
    List<Order> getOrdersByTableId(Long tableId);
    Order createOrder(Order order);
    Order updateOrder(Long id, Order order);
    void deleteOrder(Long id);
    void addItemToOrder(Long orderId, OrderItem item);
    void removeItemFromOrder(Long orderId, Long itemId);

    // New methods for table order operations
    Order createTableOrder(Long tableId, CreateTableOrderDTO orderDTO);
    Optional<Order> getCurrentTableOrder(Long tableId);
    Optional<Order> getActiveTableOrder(Long tableId);
    Order addItemToTableOrder(Long tableId, AddToTableCartDTO cartItemDTO);
    Order removeItemFromTableOrder(Long tableId, RemoveFromTableCartDTO removeItemDTO);
    Map<String, Object> completeOrderAndClearTable(Long orderId, Map<String, Object> paymentDetails);

    // Method to update order status
    Order updateOrderStatus(Long orderId, String status);
}
