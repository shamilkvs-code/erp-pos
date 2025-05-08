package com.erp.pos.controller;

import com.erp.pos.dto.DashboardStatsDTO;
import com.erp.pos.dto.RecentOrderDTO;
import com.erp.pos.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsDTO getDashboardStats() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/recent-orders")
    public List<RecentOrderDTO> getRecentOrders() {
        return dashboardService.getRecentOrders();
    }
}
