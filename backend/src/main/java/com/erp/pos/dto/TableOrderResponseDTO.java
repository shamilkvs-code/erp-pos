package com.erp.pos.dto;

import com.erp.pos.enums.OrderStatus;
import com.erp.pos.enums.OrderType;
import com.erp.pos.enums.PaymentMethod;
import com.erp.pos.model.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@Schema(description = "DTO for table order response")
public class TableOrderResponseDTO {
    @Schema(description = "Order ID")
    private Long id;

    @Schema(description = "Order number")
    private String orderNumber;

    @Schema(description = "Date and time when the order was placed")
    private LocalDateTime orderDate;

    @Schema(description = "Customer ID")
    private Long customerId;

    @Schema(description = "Customer name")
    private String customerName;

    @Schema(description = "Table ID")
    private Long tableId;

    @Schema(description = "Table number")
    private String tableNumber;

    @Schema(description = "List of order items")
    private List<OrderItemDTO> orderItems = new ArrayList<>();

    @Schema(description = "Total amount of the order")
    private BigDecimal totalAmount;

    @Schema(description = "Order status", enumAsRef = true)
    private OrderStatus status;

    @Schema(description = "Order type", enumAsRef = true)
    private OrderType orderType;

    @Schema(description = "Payment method", enumAsRef = true)
    private PaymentMethod paymentMethod;

    @Schema(description = "Payment reference")
    private String paymentReference;

    @Schema(description = "Number of guests")
    private Integer numberOfGuests;

    @Schema(description = "Special instructions for the order")
    private String specialInstructions;

    @Schema(description = "ID of the user who created the order")
    private Long createdById;

    @Schema(description = "Username of the user who created the order")
    private String createdByUsername;

    @Schema(description = "Date and time when the order was created")
    private LocalDateTime createdAt;

    @Schema(description = "Date and time when the order was last updated")
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
}
