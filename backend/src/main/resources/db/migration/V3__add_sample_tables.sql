-- Add sample restaurant tables
INSERT INTO restaurant_tables (table_number, capacity, status, location, created_at, updated_at)
VALUES 
('T1', 2, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T2', 2, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T3', 4, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T4', 4, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T5', 6, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T6', 6, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T7', 8, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('T8', 8, 'AVAILABLE', 'Indoor', NOW(), NOW()),
('O1', 2, 'AVAILABLE', 'Outdoor', NOW(), NOW()),
('O2', 2, 'AVAILABLE', 'Outdoor', NOW(), NOW()),
('O3', 4, 'AVAILABLE', 'Outdoor', NOW(), NOW()),
('O4', 4, 'AVAILABLE', 'Outdoor', NOW(), NOW()),
('B1', 6, 'AVAILABLE', 'Balcony', NOW(), NOW()),
('B2', 6, 'AVAILABLE', 'Balcony', NOW(), NOW()),
('VIP1', 10, 'AVAILABLE', 'VIP Room', NOW(), NOW());
