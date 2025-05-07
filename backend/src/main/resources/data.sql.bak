-- Insert roles
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_CASHIER') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_MANAGER') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, created_at, updated_at, active)
VALUES ('admin', 'admin@erp-pos.com', '$2a$10$8RjyG9E4y2Qb0fKxDylExechtV26UJVV6pwhC8OyFmFGE.OGk6YfS', 'Administrator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true)
ON CONFLICT (username) DO NOTHING;

-- Insert test user (password: test123)
INSERT INTO users (username, email, password, full_name, created_at, updated_at, active)
VALUES ('test', 'test@erp-pos.com', '$2a$10$8RjyG9E4y2Qb0fKxDylExechtV26UJVV6pwhC8OyFmFGE.OGk6YfS', 'Test User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true)
ON CONFLICT (username) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Assign admin role to test user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'test' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Insert sample restaurant tables
INSERT INTO restaurant_tables (table_number, capacity, status, location, created_at, updated_at)
VALUES
('T1', 2, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T2', 2, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T3', 4, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T4', 4, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T5', 6, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T6', 6, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T7', 8, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T8', 8, 'AVAILABLE', 'Indoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('O1', 2, 'AVAILABLE', 'Outdoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('O2', 2, 'AVAILABLE', 'Outdoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('O3', 4, 'AVAILABLE', 'Outdoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('O4', 4, 'AVAILABLE', 'Outdoor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B1', 6, 'AVAILABLE', 'Balcony', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B2', 6, 'AVAILABLE', 'Balcony', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('VIP1', 10, 'AVAILABLE', 'VIP Room', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (table_number) DO NOTHING;
