package com.erp.pos.service;

import com.erp.pos.dto.DashboardStatsDTO;
import com.erp.pos.dto.RecentOrderDTO;

import java.util.List;

public interface DashboardService {
    DashboardStatsDTO getDashboardStats();
    List<RecentOrderDTO> getRecentOrders();
}
