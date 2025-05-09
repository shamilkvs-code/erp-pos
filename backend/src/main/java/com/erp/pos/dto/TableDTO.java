package com.erp.pos.dto;

import com.erp.pos.enums.TableStatus;
import com.erp.pos.model.RestaurantTable;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Schema(description = "Table DTO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableDTO {
    @Schema(description = "Unique identifier of the table")
    private Long id;
    
    @Schema(description = "Table number or identifier")
    private String tableNumber;
    
    @Schema(description = "Maximum capacity of the table")
    private Integer capacity;
    
    @Schema(description = "Current status of the table")
    private TableStatus status;
    
    @Schema(description = "Physical location of the table")
    private String location;
    
    @Schema(description = "X-coordinate position of the table")
    private Integer positionX;
    
    @Schema(description = "Y-coordinate position of the table")
    private Integer positionY;
    
    @Schema(description = "Width of the table")
    private Integer width;
    
    @Schema(description = "Height of the table")
    private Integer height;
    
    @Schema(description = "Shape of the table")
    private String shape;
    
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;

    @Schema(description = "ID of the current order associated with this table")
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
