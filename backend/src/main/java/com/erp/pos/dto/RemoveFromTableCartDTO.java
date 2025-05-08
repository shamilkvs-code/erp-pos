package com.erp.pos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RemoveFromTableCartDTO {
    // Order ID is required
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    // Product ID is required
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    // Quantity to remove is required
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    // If true, remove the entire item regardless of quantity
    private boolean removeEntireItem = false;
}
