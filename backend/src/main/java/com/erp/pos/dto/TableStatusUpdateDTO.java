package com.erp.pos.dto;

import com.erp.pos.enums.TableStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableStatusUpdateDTO {
    @NotNull
    private TableStatus status;
}
