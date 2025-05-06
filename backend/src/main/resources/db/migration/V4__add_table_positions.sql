-- Add position fields for visual floor plan
ALTER TABLE restaurant_tables
ADD COLUMN position_x INTEGER,
ADD COLUMN position_y INTEGER,
ADD COLUMN width INTEGER,
ADD COLUMN height INTEGER,
ADD COLUMN shape VARCHAR(20);

-- Update table status enum values to include MAINTENANCE
ALTER TABLE restaurant_tables
DROP CONSTRAINT IF EXISTS restaurant_tables_status_check;

ALTER TABLE restaurant_tables
ADD CONSTRAINT restaurant_tables_status_check
CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MAINTENANCE'));

-- Update sample data with position information
UPDATE restaurant_tables
SET position_x = (id * 150) % 800,
    position_y = (id * 100) % 600,
    width = 100,
    height = 100,
    shape = 'RECTANGLE'
WHERE position_x IS NULL;
