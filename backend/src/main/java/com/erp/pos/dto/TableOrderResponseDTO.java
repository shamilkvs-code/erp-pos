package com.erp.pos.dto;

import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TableOrderResponseDTO {
    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private Long customerId;
    private String customerName;
    private Long tableId;
    private String tableNumber;
    private List<OrderItemDTO> orderItems = new ArrayList<>();
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private Order.OrderType orderType;
    private Order.PaymentMethod paymentMethod;
    private String paymentReference;
    private Integer numberOfGuests;
    private String specialInstructions;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Convert from Order entity to TableOrderResponseDTO
    public static TableOrderResponseDTO fromEntity(Order order) {
        TableOrderResponseDTO dto = new TableOrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setOrderDate(order.getOrderDate());
        
        // Set customer info if available
        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getId());
            dto.setCustomerName(order.getCustomer().getName());
        }
        
        // Set table info if available
        if (order.getTable() != null) {
            dto.setTableId(order.getTable().getId());
            dto.setTableNumber(order.getTable().getTableNumber());
        }
        
        // Convert order items
        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(OrderItemDTO::fromEntity)
                    .collect(Collectors.toList()));
        }
        
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setOrderType(order.getOrderType());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentReference(order.getPaymentReference());
        dto.setNumberOfGuests(order.getNumberOfGuests());
        dto.setSpecialInstructions(order.getSpecialInstructions());
        
        // Set creator info if available
        if (order.getCreatedBy() != null) {
            dto.setCreatedById(order.getCreatedBy().getId());
            dto.setCreatedByUsername(order.getCreatedBy().getUsername());
        }
        
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        return dto;
    }
    
    // Nested DTO for order items
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
        
        // Convert from OrderItem entity to OrderItemDTO
        public static OrderItemDTO fromEntity(OrderItem item) {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setId(item.getId());
            
            if (item.getProduct() != null) {
                dto.setProductId(item.getProduct().getId());
                dto.setProductName(item.getProduct().getName());
            }
            
            dto.setQuantity(item.getQuantity());
            dto.setUnitPrice(item.getUnitPrice());
            dto.setSubtotal(item.getSubtotal());
            
            return dto;
        }
    }
}
