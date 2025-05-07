package com.erp.pos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable extends BaseEntity {

    @NotBlank
    private String tableNumber;

    @NotNull
    @Positive
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private TableStatus status;

    @ManyToOne
    @JoinColumn(name = "current_order_id")
    @JsonIgnoreProperties("table")
    private Order currentOrder;

    private String location; // e.g., "MAIN", "OUTDOOR", "PRIVATE", "BAR", etc.

    // Position for visual floor plan
    private Integer positionX;
    private Integer positionY;
    private Integer width;
    private Integer height;
    private String shape; // "RECTANGLE", "CIRCLE", "CUSTOM"

    public enum TableStatus {
        AVAILABLE, OCCUPIED, RESERVED, CLEANING, MAINTENANCE
    }
}
