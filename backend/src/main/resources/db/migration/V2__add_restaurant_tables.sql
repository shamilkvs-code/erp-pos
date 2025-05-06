-- Create restaurant_tables table
CREATE TABLE restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    current_order_id BIGINT,
    location VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Add new columns to orders table
ALTER TABLE orders
ADD COLUMN table_id BIGINT,
ADD COLUMN order_type VARCHAR(20),
ADD COLUMN number_of_guests INTEGER,
ADD COLUMN special_instructions TEXT;

-- Add foreign key constraint
ALTER TABLE orders
ADD CONSTRAINT fk_orders_table
FOREIGN KEY (table_id)
REFERENCES restaurant_tables(id);

-- Add foreign key constraint for current_order_id in restaurant_tables
ALTER TABLE restaurant_tables
ADD CONSTRAINT fk_tables_current_order
FOREIGN KEY (current_order_id)
REFERENCES orders(id);

-- Update order status enum values
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_status_check
CHECK (status IN ('PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'));

-- Add order type constraint
ALTER TABLE orders
ADD CONSTRAINT orders_type_check
CHECK (order_type IN ('DINE_IN', 'TAKEOUT', 'DELIVERY'));
