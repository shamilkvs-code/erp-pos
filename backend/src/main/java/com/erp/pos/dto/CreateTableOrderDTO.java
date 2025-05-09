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

    // Nested DTO for order items to avoid circular references
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "DTO for order items within a table order")
    public static class OrderItemDTO {
        @Schema(description = "ID of the product", required = true)
        @NotNull(message = "Product ID is required")
        private Long productId;

        @Schema(description = "Quantity of the product", minimum = "1", required = true)
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @Schema(description = "Unit price of the product", required = true)
        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;

        @Schema(description = "Subtotal for this item (quantity * unit price)", required = true)
        @NotNull(message = "Subtotal is required")
        private BigDecimal subtotal;
    }
}
