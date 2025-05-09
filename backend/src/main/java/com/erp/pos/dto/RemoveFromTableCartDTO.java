package com.erp.pos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "DTO for removing an item from a table's cart")
public class RemoveFromTableCartDTO {
    @Schema(description = "ID of the order to remove item from", required = true)
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @Schema(description = "ID of the product to remove", required = true)
    @NotNull(message = "Product ID is required")
    private Long productId;

    @Schema(description = "Quantity of the product to remove", minimum = "1", required = true)
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @Schema(description = "If true, remove the entire item regardless of quantity", defaultValue = "false")
    private boolean removeEntireItem = false;
}
