package com.erp.pos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalOrders;
    private long totalCustomers;
    private long totalProducts;
    private BigDecimal totalRevenue;
}
