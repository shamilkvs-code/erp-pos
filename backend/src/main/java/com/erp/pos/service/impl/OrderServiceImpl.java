package com.erp.pos.service.impl;

import com.erp.pos.exception.ResourceNotFoundException;
import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;
import com.erp.pos.repository.OrderItemRepository;
import com.erp.pos.repository.OrderRepository;
import com.erp.pos.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Override
    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    @Override
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByCreatedById(userId);
    }

    @Override
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public List<Order> getOrdersByType(Order.OrderType orderType) {
        return orderRepository.findByOrderType(orderType);
    }

    @Override
    public List<Order> getOrdersByTableId(Long tableId) {
        return orderRepository.findByTableId(tableId);
    }

    @Override
    @Transactional
    public Order createOrder(Order order) {
        // Generate a unique order number if not provided
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber(generateOrderNumber());
        }

        // Set order date if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }

        // Set default status if not provided
        if (order.getStatus() == null) {
            order.setStatus(Order.OrderStatus.PENDING);
        }

        // Set default order type if not provided
        if (order.getOrderType() == null) {
            // If table is set, it's a dine-in order
            if (order.getTable() != null) {
                order.setOrderType(Order.OrderType.DINE_IN);
            } else {
                // Default to takeout if no table is specified
                order.setOrderType(Order.OrderType.TAKEOUT);
            }
        }

        // Set default total amount if not provided
        if (order.getTotalAmount() == null) {
            order.setTotalAmount(new BigDecimal("0.00"));
        }

        // Save the order first to get an ID
        Order savedOrder = orderRepository.save(order);

        // Update the order items with the saved order reference
        if (savedOrder.getOrderItems() != null && !savedOrder.getOrderItems().isEmpty()) {
            savedOrder.getOrderItems().forEach(item -> {
                item.setOrder(savedOrder);
                orderItemRepository.save(item);
            });
        }

        return savedOrder;
    }

    @Override
    @Transactional
    public Order updateOrder(Long id, Order orderDetails) {
        Order order = getOrderById(id);

        // Update order fields
        order.setOrderDate(orderDetails.getOrderDate());
        order.setCustomer(orderDetails.getCustomer());
        order.setTable(orderDetails.getTable());
        order.setTotalAmount(orderDetails.getTotalAmount());
        order.setStatus(orderDetails.getStatus());
        order.setOrderType(orderDetails.getOrderType());
        order.setPaymentMethod(orderDetails.getPaymentMethod());
        order.setPaymentReference(orderDetails.getPaymentReference());
        order.setNumberOfGuests(orderDetails.getNumberOfGuests());
        order.setSpecialInstructions(orderDetails.getSpecialInstructions());

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    @Override
    @Transactional
    public void addItemToOrder(Long orderId, OrderItem item) {
        Order order = getOrderById(orderId);
        item.setOrder(order);

        // Save the item
        OrderItem savedItem = orderItemRepository.save(item);

        // Add to order's items list
        order.getOrderItems().add(savedItem);

        // Update order total amount
        order.setTotalAmount(order.getTotalAmount().add(item.getSubtotal()));

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void removeItemFromOrder(Long orderId, Long itemId) {
        Order order = getOrderById(orderId);

        // Find the item to remove
        OrderItem itemToRemove = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id: " + itemId));

        // Check if the item belongs to the order
        if (!itemToRemove.getOrder().getId().equals(orderId)) {
            throw new IllegalArgumentException("Item does not belong to the specified order");
        }

        // Update order total amount
        order.setTotalAmount(order.getTotalAmount().subtract(itemToRemove.getSubtotal()));

        // Remove from order's items list
        order.getOrderItems().removeIf(item -> item.getId().equals(itemId));

        // Delete the item
        orderItemRepository.delete(itemToRemove);

        orderRepository.save(order);
    }

    /**
     * Generate a unique order number
     * @return A unique order number
     */
    private String generateOrderNumber() {
        // Format: ORD-YYYYMMDD-XXXX (where XXXX is a random alphanumeric string)
        String datePart = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD-" + datePart + "-" + randomPart;
    }
}
