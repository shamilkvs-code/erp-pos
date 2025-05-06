package com.erp.pos.controller;

import com.erp.pos.model.Order;
import com.erp.pos.repository.CustomerRepository;
import com.erp.pos.repository.OrderRepository;
import com.erp.pos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total orders count
        long totalOrders = orderRepository.count();
        stats.put("totalOrders", totalOrders);
        
        // Get total customers count
        long totalCustomers = customerRepository.count();
        stats.put("totalCustomers", totalCustomers);
        
        // Get total products count
        long totalProducts = productRepository.count();
        stats.put("totalProducts", totalProducts);
        
        // Calculate total revenue from all completed orders
        BigDecimal totalRevenue = orderRepository.findByStatus("COMPLETED")
                .stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/recent-orders")
    public ResponseEntity<?> getRecentOrders() {
        // Get the 5 most recent orders
        List<Order> recentOrders = orderRepository.findTop5ByOrderByOrderDateDesc();
        
        // Convert to a simplified format for the frontend
        List<Map<String, Object>> simplifiedOrders = recentOrders.stream()
                .map(order -> {
                    Map<String, Object> simplifiedOrder = new HashMap<>();
                    simplifiedOrder.put("id", order.getId());
                    simplifiedOrder.put("orderNumber", order.getOrderNumber());
                    simplifiedOrder.put("orderDate", order.getOrderDate().toString());
                    simplifiedOrder.put("status", order.getStatus());
                    simplifiedOrder.put("totalAmount", order.getTotalAmount());
                    
                    // Add customer info if available
                    if (order.getCustomer() != null) {
                        Map<String, Object> customer = new HashMap<>();
                        customer.put("id", order.getCustomer().getId());
                        customer.put("name", order.getCustomer().getName());
                        simplifiedOrder.put("customer", customer);
                    }
                    
                    return simplifiedOrder;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(simplifiedOrders);
    }
}
