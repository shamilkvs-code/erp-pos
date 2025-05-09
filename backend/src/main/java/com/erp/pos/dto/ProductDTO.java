package com.erp.pos.dto;

import com.erp.pos.model.Product;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Product DTO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    @Schema(description = "Product ID") 
    private Long id;

    @Schema(description = "Product name")
    private String name;

    @Schema(description = "Product description")
    private String description; 

    @Schema(description = "Product price")
    private BigDecimal price;

    @Schema(description = "Product stock quantity")
    private Integer stockQuantity;

    @Schema(description = "Product SKU")
    private String sku;

    @Schema(description = "Product barcode")
    private String barcode;

    @Schema(description = "Category ID")
    private Long categoryId;

    @Schema(description = "Category name")
    private String categoryName;

    @Schema(description = "Product active status")
    private boolean active;

    @Schema(description = "Product creation date")
    private LocalDateTime createdAt;

    @Schema(description = "Product update date")
    private LocalDateTime updatedAt;

    // Convert from Product entity to ProductDTO
    public static ProductDTO fromEntity(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setSku(product.getSku());
        dto.setBarcode(product.getBarcode());
        dto.setActive(product.isActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        // Set category info if available
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        return dto;
    }
}
