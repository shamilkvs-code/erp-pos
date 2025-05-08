package com.erp.pos.dto;

import com.erp.pos.model.Order;
import com.erp.pos.model.OrderItem;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTableOrderDTO {
    // Customer ID is optional
    private Long customerId;
    
    // Number of guests is required for table orders
    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "Number of guests must be at least 1")
    private Integer numberOfGuests;
    
    // Order items are required
    @NotNull(message = "Order items are required")
    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItemDTO> orderItems;
    
    // Special instructions are optional
    private String specialInstructions;
    
    // Total amount is required
    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;
    
    // Payment method is optional at order creation time
    private Order.PaymentMethod paymentMethod;
    
    // Payment reference is optional at order creation time
    private String paymentReference;
    
    // Nested DTO for order items to avoid circular references
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        @NotNull(message = "Product ID is required")
        private Long productId;
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
        
        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;
        
        @NotNull(message = "Subtotal is required")
        private BigDecimal subtotal;
    }
}
