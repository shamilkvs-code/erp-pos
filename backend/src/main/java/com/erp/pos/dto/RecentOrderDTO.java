package com.erp.pos.dto;

import com.erp.pos.model.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrderDTO {
    private Long id;
    private String orderNumber;
    private String orderDate;
    private Order.OrderStatus status;
    private BigDecimal totalAmount;
    private CustomerInfo customer;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerInfo {
        private Long id;
        private String name;
    }
    
    public static RecentOrderDTO fromOrder(Order order) {
        RecentOrderDTO dto = new RecentOrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        
        // Handle null orderDate
        if (order.getOrderDate() != null) {
            dto.setOrderDate(order.getOrderDate().toString());
        } else {
            dto.setOrderDate("N/A");
        }
        
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO);
        
        // Add customer info if available
        if (order.getCustomer() != null) {
            CustomerInfo customerInfo = new CustomerInfo(
                order.getCustomer().getId(),
                order.getCustomer().getName()
            );
            dto.setCustomer(customerInfo);
        }
        
        return dto;
    }
}
