package com.erp.pos.service.impl;

import com.erp.pos.dto.DashboardStatsDTO;
import com.erp.pos.dto.RecentOrderDTO;
import com.erp.pos.enums.OrderStatus;
import com.erp.pos.model.Order;
import com.erp.pos.repository.CustomerRepository;
import com.erp.pos.repository.OrderRepository;
import com.erp.pos.repository.ProductRepository;
import com.erp.pos.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Get total orders count
        stats.setTotalOrders(orderRepository.count());

        // Get total customers count
        stats.setTotalCustomers(customerRepository.count());

        // Get total products count
        stats.setTotalProducts(productRepository.count());

        // Calculate total revenue from all completed orders
        BigDecimal totalRevenue;
        try {
            totalRevenue = orderRepository.findByStatus(OrderStatus.COMPLETED)
                    .stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error calculating total revenue: " + e.getMessage());
            e.printStackTrace();
            // Fallback to zero
            totalRevenue = BigDecimal.ZERO;
        }
        stats.setTotalRevenue(totalRevenue);

        return stats;
    }

    @Override
    public List<RecentOrderDTO> getRecentOrders() {
        try {
            // Get the 5 most recent orders
            List<Order> recentOrders = orderRepository.findTop5ByOrderByOrderDateDesc();

            // Convert to DTOs
            return recentOrders.stream()
                    .map(RecentOrderDTO::fromOrder)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Log the error
            System.err.println("Error fetching recent orders: " + e.getMessage());
            e.printStackTrace();

            // Return an empty list
            return new ArrayList<>();
        }
    }
}
