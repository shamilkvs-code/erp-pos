package com.erp.pos.dto;

import com.erp.pos.model.OrderItem;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableOrderDTO {
    private Long customerId;
    
    @NotNull
    @Min(1)
    private Integer numberOfGuests;
    
    @NotNull
    private List<OrderItem> orderItems;
    
    private String specialInstructions;
    
    @NotNull
    private BigDecimal totalAmount;
}
