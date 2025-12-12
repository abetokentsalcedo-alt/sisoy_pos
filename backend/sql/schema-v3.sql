-- Complete Sisoy POS Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(50) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone_number VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accommodations table
CREATE TABLE IF NOT EXISTS accommodations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) NOT NULL,
  accommodation_id VARCHAR(50) NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  transaction_id VARCHAR(100),
  receipt_generated BOOLEAN DEFAULT FALSE,
  receipt_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id),
  INDEX idx_booking_date (date_from, date_to),
  INDEX idx_client (client_id),
  INDEX idx_status (status)
);

-- Payments table
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

-- Daily Revenue table
CREATE TABLE IF NOT EXISTS daily_revenue (
  id VARCHAR(50) PRIMARY KEY,
  revenue_date DATE NOT NULL UNIQUE,
  total_revenue DECIMAL(10, 2) NOT NULL,
  booking_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Check-ins table (for tracking who checked in and when)
CREATE TABLE IF NOT EXISTS check_ins (
  id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL,
  accommodation_id VARCHAR(50) NOT NULL,
  client_id VARCHAR(50) NOT NULL,
  check_in_date DATE NOT NULL,
  check_in_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  INDEX idx_check_in_date (check_in_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_accommodation ON bookings(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_booking_created ON bookings(created_at);
