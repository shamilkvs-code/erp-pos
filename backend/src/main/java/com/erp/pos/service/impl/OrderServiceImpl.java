package com.erp.pos.service.impl;

import com.erp.pos.dto.AddToTableCartDTO;
import com.erp.pos.dto.CreateTableOrderDTO;
import com.erp.pos.dto.RemoveFromTableCartDTO;
import com.erp.pos.dto.TableOrderResponseDTO;
import com.erp.pos.exception.ResourceNotFoundException;
import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;
import com.erp.pos.model.Product;
import com.erp.pos.model.RestaurantTable;
import com.erp.pos.model.User;
import com.erp.pos.repository.OrderItemRepository;
import com.erp.pos.repository.OrderRepository;
import com.erp.pos.service.CustomerService;
import com.erp.pos.service.OrderService;
import com.erp.pos.service.ProductService;
import com.erp.pos.service.TableService;
import com.erp.pos.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private TableService tableService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CustomerService customerService;

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

    @Override
    @Transactional
    public Order createTableOrder(Long tableId, CreateTableOrderDTO orderDTO) {
        // Get the table
        RestaurantTable table = tableService.getTableById(tableId);

        // Create a new Order entity from the DTO
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setTable(table);
        order.setOrderType(Order.OrderType.DINE_IN);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setNumberOfGuests(orderDTO.getNumberOfGuests());
        order.setSpecialInstructions(orderDTO.getSpecialInstructions());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPaymentReference(orderDTO.getPaymentReference());

        // Set customer if provided
        if (orderDTO.getCustomerId() != null) {
            order.setCustomer(customerService.getCustomerById(orderDTO.getCustomerId()));
        }

        // Set the current user as the creator of the order
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            order.setCreatedBy(currentUser);
        }

        // Convert order items from DTO
        List<OrderItem> orderItems = new ArrayList<>();
        for (CreateTableOrderDTO.OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(productService.getProductById(itemDTO.getProductId()));
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());
            item.setSubtotal(itemDTO.getSubtotal());
            orderItems.add(item);
        }
        order.setOrderItems(orderItems);

        // Create the order
        Order createdOrder = createOrder(order);

        // Update the table status to OCCUPIED and assign the order
        tableService.assignOrderToTable(tableId, createdOrder);

        return createdOrder;
    }

    @Override
    public Optional<Order> getCurrentTableOrder(Long tableId) {
        RestaurantTable table = tableService.getTableById(tableId);

        if (table.getCurrentOrder() != null) {
            return Optional.of(getOrderById(table.getCurrentOrder().getId()));
        }

        return Optional.empty();
    }

    @Override
    public Optional<Order> getActiveTableOrder(Long tableId) {
        RestaurantTable table = tableService.getTableById(tableId);

        if (table.getCurrentOrder() != null) {
            Order order = getOrderById(table.getCurrentOrder().getId());

            // Return the order if it's not COMPLETED or CANCELLED
            if (order.getStatus() != Order.OrderStatus.COMPLETED && order.getStatus() != Order.OrderStatus.CANCELLED) {
                return Optional.of(order);
            }
        }

        return Optional.empty();
    }

    @Override
    @Transactional
    public Order addItemToTableOrder(Long tableId, AddToTableCartDTO cartItemDTO) {
        // Get the table
        RestaurantTable table = tableService.getTableById(tableId);
        Order order;

        // Check if we need to create a new order or update an existing one
        if (cartItemDTO.getOrderId() != null) {
            // Use the provided order ID
            order = getOrderById(cartItemDTO.getOrderId());

            // Verify this order belongs to the specified table
            if (order.getTable() == null || !order.getTable().getId().equals(tableId)) {
                throw new IllegalArgumentException("Order does not belong to the specified table");
            }

            // Verify the order is not COMPLETED or CANCELLED
            if (order.getStatus() == Order.OrderStatus.COMPLETED || order.getStatus() == Order.OrderStatus.CANCELLED) {
                throw new IllegalArgumentException("Cannot add items to a completed or cancelled order");
            }
        } else {
            // Check if there's an existing order for this table
            if (table.getCurrentOrder() != null) {
                Order currentOrder = getOrderById(table.getCurrentOrder().getId());
                // Allow adding items to any order that is not COMPLETED or CANCELLED
                if (currentOrder.getStatus() != Order.OrderStatus.COMPLETED && currentOrder.getStatus() != Order.OrderStatus.CANCELLED) {
                    order = currentOrder;
                } else {
                    // Create a new order
                    order = createNewOrder(table, cartItemDTO);
                }
            } else {
                // Create a new order
                order = createNewOrder(table, cartItemDTO);
            }
        }

        // Add the item to the order
        Product product = productService.getProductById(cartItemDTO.getProductId());

        // Check if this product is already in the order and if the order is still in PENDING status
        boolean shouldAddNewLineItem = true;

        // Only update quantity for existing items if the order is still in PENDING status
        // For orders that are IN_PROGRESS or READY, always add as new line items
        if (order.getStatus() == Order.OrderStatus.PENDING) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct().getId().equals(cartItemDTO.getProductId())) {
                    // Update existing item quantity and subtotal only if order is still PENDING
                    item.setQuantity(item.getQuantity() + cartItemDTO.getQuantity());
                    item.setUnitPrice(cartItemDTO.getUnitPrice()); // Update unit price in case it changed
                    item.setSubtotal(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())));
                    shouldAddNewLineItem = false;
                    break;
                }
            }
        }

        // If product not found in order or order is not in PENDING status, add a new order item
        if (shouldAddNewLineItem) {
            OrderItem newItem = new OrderItem();
            newItem.setOrder(order);
            newItem.setProduct(product);
            newItem.setQuantity(cartItemDTO.getQuantity());
            newItem.setUnitPrice(cartItemDTO.getUnitPrice());
            newItem.setSubtotal(cartItemDTO.getUnitPrice().multiply(new BigDecimal(cartItemDTO.getQuantity())));
            order.getOrderItems().add(newItem);
        }

        // Update order total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            totalAmount = totalAmount.add(item.getSubtotal());
        }
        order.setTotalAmount(totalAmount);

        // Update special instructions if provided
        if (cartItemDTO.getSpecialInstructions() != null) {
            order.setSpecialInstructions(cartItemDTO.getSpecialInstructions());
        }

        // Save the updated order
        Order updatedOrder = updateOrder(order.getId(), order);

        // If this is a new order, assign it to the table
        if (table.getCurrentOrder() == null) {
            tableService.assignOrderToTable(tableId, updatedOrder);
        }

        return updatedOrder;
    }

    /**
     * Helper method to create a new order
     */
    private Order createNewOrder(RestaurantTable table, AddToTableCartDTO cartItemDTO) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setTable(table);
        order.setOrderType(Order.OrderType.DINE_IN);
        order.setStatus(Order.OrderStatus.PENDING);

        // Set number of guests if provided
        if (cartItemDTO.getNumberOfGuests() != null) {
            order.setNumberOfGuests(cartItemDTO.getNumberOfGuests());
        } else {
            // Default to 1 guest if not specified
            order.setNumberOfGuests(1);
        }

        // Set special instructions if provided
        if (cartItemDTO.getSpecialInstructions() != null) {
            order.setSpecialInstructions(cartItemDTO.getSpecialInstructions());
        }

        // Set the current user as the creator of the order
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            order.setCreatedBy(currentUser);
        }

        // Initialize order items list
        order.setOrderItems(new ArrayList<>());

        // Initialize total amount
        order.setTotalAmount(BigDecimal.ZERO);

        // Save the new order
        return createOrder(order);
    }

    @Override
    @Transactional
    public Order removeItemFromTableOrder(Long tableId, RemoveFromTableCartDTO removeItemDTO) {
        // Get the order
        Order order = getOrderById(removeItemDTO.getOrderId());

        // Verify this order belongs to the specified table
        if (order.getTable() == null || !order.getTable().getId().equals(tableId)) {
            throw new IllegalArgumentException("Order does not belong to the specified table");
        }

        // Verify the order is not COMPLETED or CANCELLED
        if (order.getStatus() == Order.OrderStatus.COMPLETED || order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot remove items from a completed or cancelled order");
        }

        // Find the order item for the specified product
        OrderItem itemToUpdate = null;
        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct().getId().equals(removeItemDTO.getProductId())) {
                itemToUpdate = item;
                break;
            }
        }

        if (itemToUpdate == null) {
            throw new ResourceNotFoundException("Product not found in the order");
        }

        // Check if we should remove the entire item or just reduce quantity
        if (removeItemDTO.isRemoveEntireItem() || itemToUpdate.getQuantity() <= removeItemDTO.getQuantity()) {
            // Remove the entire item
            order.getOrderItems().remove(itemToUpdate);
        } else {
            // Reduce the quantity
            itemToUpdate.setQuantity(itemToUpdate.getQuantity() - removeItemDTO.getQuantity());
            // Update the subtotal
            itemToUpdate.setSubtotal(itemToUpdate.getUnitPrice().multiply(new BigDecimal(itemToUpdate.getQuantity())));
        }

        // Update order total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            totalAmount = totalAmount.add(item.getSubtotal());
        }
        order.setTotalAmount(totalAmount);

        // If all items are removed, consider canceling the order
        if (order.getOrderItems().isEmpty()) {
            // Cancel the order
            order.setStatus(Order.OrderStatus.CANCELLED);

            // Save the updated order
            Order updatedOrder = updateOrder(order.getId(), order);

            // Clear the table
            tableService.clearTable(tableId);

            return updatedOrder;
        } else {
            // Save the updated order
            return updateOrder(order.getId(), order);
        }
    }

    @Override
    @Transactional
    public Map<String, Object> completeOrderAndClearTable(Long orderId, Map<String, Object> paymentDetails) {
        // Get the order
        Order order = getOrderById(orderId);

        if (order.getTable() == null) {
            throw new IllegalArgumentException("This order is not associated with a table");
        }

        // Update order status to COMPLETED
        order.setStatus(Order.OrderStatus.COMPLETED);

        // Update payment information if provided
        if (paymentDetails != null) {
            if (paymentDetails.containsKey("paymentMethod")) {
                String paymentMethod = (String) paymentDetails.get("paymentMethod");
                order.setPaymentMethod(Order.PaymentMethod.valueOf(paymentMethod.toUpperCase()));
            }

            if (paymentDetails.containsKey("paymentReference")) {
                order.setPaymentReference((String) paymentDetails.get("paymentReference"));
            }
        }

        // Save the updated order
        Order completedOrder = updateOrder(orderId, order);

        // Clear the table
        Long tableId = order.getTable().getId();
        RestaurantTable clearedTable = tableService.clearTable(tableId);

        // Return both the completed order and the cleared table
        Map<String, Object> response = new HashMap<>();
        response.put("order", completedOrder);
        response.put("table", clearedTable);

        return response;
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        // Validate the status string
        Order.OrderStatus orderStatus;
        try {
            orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }

        // Get the order
        Order order = getOrderById(orderId);

        // Update the status
        order.setStatus(orderStatus);

        // Save and return the updated order
        return updateOrder(orderId, order);
    }
}
