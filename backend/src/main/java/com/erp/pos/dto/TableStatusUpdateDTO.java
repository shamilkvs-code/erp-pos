package com.erp.pos.dto;

import com.erp.pos.model.RestaurantTable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableStatusUpdateDTO {
    @NotNull
    private RestaurantTable.TableStatus status;
}
