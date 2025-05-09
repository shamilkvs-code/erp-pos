package com.erp.pos.dto;

import com.erp.pos.model.OrderItem;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// Nested DTO for order items
@Data
@NoArgsConstructor
@Schema(description = "DTO for order items in a table order response")
public class OrderItemDTO {
    @Schema(description = "Order item ID")
    private Long id;

    @Schema(description = "Product ID")
    private Long productId;

    @Schema(description = "Product name")
    private String productName;

    @Schema(description = "Quantity of the product")
    private Integer quantity;

    @Schema(description = "Unit price of the product")
    private BigDecimal unitPrice;

    @Schema(description = "Subtotal for this item (quantity * unit price)")
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
