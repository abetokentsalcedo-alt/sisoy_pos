-- Updated schema with receipt tracking and seed data for accommodations

-- Payments table (for receipt tracking)
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100),
  receipt_path VARCHAR(255),
  receipt_generated BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Accommodations table
CREATE TABLE IF NOT EXISTS accommodations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active'
);

-- Add fields to bookings table if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receipt_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receipt_path VARCHAR(255);

-- Added seed data for all 35 accommodations (10 rooms + 20 cottages + 5 villas)

-- Insert Standard Rooms (1-10)
INSERT INTO accommodations (name, type, capacity, price_per_night, description, status) VALUES
('Room 1', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 2', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 3', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 4', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 5', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 6', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 7', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 8', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 9', 'Room', 2, 80.00, 'Standard room with all amenities', 'active'),
('Room 10', 'Room', 2, 80.00, 'Standard room with all amenities', 'active');

-- Insert Cottages Regular (1-10, 1-5 pax)
INSERT INTO accommodations (name, type, capacity, price_per_night, description, status) VALUES
('Cottage Regular 1', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 2', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 3', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 4', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 5', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 6', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 7', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 8', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 9', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active'),
('Cottage Regular 10', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', 'active');

-- Insert Cottages Large (1-10, 15+ pax)
INSERT INTO accommodations (name, type, capacity, price_per_night, description, status) VALUES
('Cottage Large 1', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 2', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 3', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 4', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 5', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 6', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 7', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 8', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 9', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active'),
('Cottage Large 10', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', 'active');

-- Insert Villas (1-5)
INSERT INTO accommodations (name, type, capacity, price_per_night, description, status) VALUES
('Villa 1', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', 'active'),
('Villa 2', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', 'active'),
('Villa 3', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', 'active'),
('Villa 4', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', 'active'),
('Villa 5', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', 'active');
