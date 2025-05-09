package com.erp.pos.dto;

import com.erp.pos.enums.TableStatus;
import com.erp.pos.model.RestaurantTable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TableDTO {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private TableStatus status;
    private String location;
    private Integer positionX;
    private Integer positionY;
    private Integer width;
    private Integer height;
    private String shape;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Include only the order ID if there is a current order
    private Long currentOrderId;

    // Convert from RestaurantTable entity to TableDTO
    public static TableDTO fromEntity(RestaurantTable table) {
        TableDTO dto = new TableDTO();
        dto.setId(table.getId());
        dto.setTableNumber(table.getTableNumber());
        dto.setCapacity(table.getCapacity());
        dto.setStatus(table.getStatus());
        dto.setLocation(table.getLocation());
        dto.setPositionX(table.getPositionX());
        dto.setPositionY(table.getPositionY());
        dto.setWidth(table.getWidth());
        dto.setHeight(table.getHeight());
        dto.setShape(table.getShape());
        dto.setCreatedAt(table.getCreatedAt());
        dto.setUpdatedAt(table.getUpdatedAt());

        // Set the current order ID if there is one
        if (table.getCurrentOrder() != null) {
            dto.setCurrentOrderId(table.getCurrentOrder().getId());
        }

        return dto;
    }
}
