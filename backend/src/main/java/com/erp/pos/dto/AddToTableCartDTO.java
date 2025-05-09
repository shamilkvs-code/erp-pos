package com.erp.pos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "DTO for adding an item to a table's cart")
public class AddToTableCartDTO {
    @Schema(description = "Order ID - optional, if not provided, a new order will be created")
    private Long orderId;

    @Schema(description = "Product ID to add to the cart", required = true)
    @NotNull(message = "Product ID is required")
    private Long productId;

    @Schema(description = "Quantity of the product to add", minimum = "1", required = true)
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @Schema(description = "Unit price of the product", required = true)
    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    @Schema(description = "Number of guests - required for new orders, optional for updates")
    private Integer numberOfGuests;

    @Schema(description = "Special instructions for the order item")
    private String specialInstructions;
}
