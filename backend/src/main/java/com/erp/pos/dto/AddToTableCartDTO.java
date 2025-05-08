package com.erp.pos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToTableCartDTO {
    // Order ID is optional - if not provided, a new order will be created
    private Long orderId;
    
    // Product ID is required
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    // Quantity is required
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    // Unit price is required
    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;
    
    // Number of guests is required for new orders, optional for updates
    private Integer numberOfGuests;
    
    // Special instructions are optional
    private String specialInstructions;
}
