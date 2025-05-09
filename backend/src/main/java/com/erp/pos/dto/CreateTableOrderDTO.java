package com.erp.pos.dto;

import com.erp.pos.enums.PaymentMethod;
import com.erp.pos.model.OrderItem;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "DTO for creating a new order for a table")
public class CreateTableOrderDTO {
    @Schema(description = "Customer ID - optional")
    private Long customerId;

    @Schema(description = "Number of guests at the table", minimum = "1", required = true)
    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "Number of guests must be at least 1")
    private Integer numberOfGuests;

    @Schema(description = "List of order items", required = true)
    @NotNull(message = "Order items are required")
    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItemDTO> orderItems;

    @Schema(description = "Special instructions for the order")
    private String specialInstructions;

    @Schema(description = "Total amount of the order", required = true)
    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    @Schema(description = "Payment method - optional at order creation time", enumAsRef = true)
    private PaymentMethod paymentMethod;

    @Schema(description = "Payment reference - optional at order creation time")
    private String paymentReference;

    @Schema(description = "Order item")
    private OrderItem orderItem;
}
