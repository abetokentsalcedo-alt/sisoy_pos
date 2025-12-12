-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 09:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sisoy_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` enum('Villa','Cottage','Room') NOT NULL,
  `capacity` int(11) NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `status` enum('active','inactive','maintenance') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accommodations`
--

INSERT INTO `accommodations` (`id`, `name`, `type`, `capacity`, `price_per_night`, `description`, `amenities`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Room 1', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(2, 'Room 2', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(3, 'Room 3', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(4, 'Room 4', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(5, 'Room 5', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(6, 'Room 6', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(7, 'Room 7', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(8, 'Room 8', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(9, 'Room 9', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(10, 'Room 10', 'Room', 2, 80.00, 'Standard room with all amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(11, 'Cottage Regular 1', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(12, 'Cottage Regular 2', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(13, 'Cottage Regular 3', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(14, 'Cottage Regular 4', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(15, 'Cottage Regular 5', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(16, 'Cottage Regular 6', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(17, 'Cottage Regular 7', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(18, 'Cottage Regular 8', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(19, 'Cottage Regular 9', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(20, 'Cottage Regular 10', 'Cottage', 5, 150.00, 'Cozy cottage for up to 5 guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(21, 'Cottage Large 1', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(22, 'Cottage Large 2', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(23, 'Cottage Large 3', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(24, 'Cottage Large 4', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(25, 'Cottage Large 5', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(26, 'Cottage Large 6', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(27, 'Cottage Large 7', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(28, 'Cottage Large 8', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(29, 'Cottage Large 9', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(30, 'Cottage Large 10', 'Cottage', 20, 350.00, 'Spacious cottage for 15+ guests', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(31, 'Villa 1', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(32, 'Villa 2', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(33, 'Villa 3', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(34, 'Villa 4', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(35, 'Villa 5', 'Villa', 8, 350.00, 'Luxury villa with premium amenities', NULL, 'active', '2025-11-29 17:03:33', '2025-11-29 17:03:33'),
(36, 'Deluxe Room', 'Room', 2, 150.00, 'Spacious room with ocean view', NULL, 'active', '2025-11-29 18:25:05', '2025-11-29 18:25:05'),
(37, 'Standard Room', 'Room', 2, 100.00, 'Comfortable standard room', NULL, 'active', '2025-11-29 18:25:05', '2025-11-29 18:25:05'),
(38, 'Luxury Suite', 'Villa', 4, 250.00, 'Premium villa with private pool', NULL, 'active', '2025-11-29 18:25:05', '2025-11-29 18:25:05'),
(39, 'Cottage Retreat', 'Cottage', 3, 180.00, 'Cozy cottage in garden', NULL, 'active', '2025-11-29 18:25:05', '2025-11-29 18:25:05');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `accommodation_id` int(11) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guests` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','checked-in','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `receipt_generated` tinyint(1) DEFAULT 0,
  `receipt_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_number`, `customer_id`, `accommodation_id`, `check_in`, `check_out`, `guests`, `total_price`, `status`, `notes`, `created_by`, `created_at`, `updated_at`, `receipt_generated`, `receipt_path`) VALUES
(7, 'BK-20251129-4VGC', 5, 10, '2026-11-01', '2028-12-11', 1, 61680.00, 'confirmed', '', NULL, '2025-11-29 19:12:14', '2025-11-29 19:12:14', 0, NULL),
(8, 'BK-20251129-XHR6', 6, 27, '2025-11-15', '2025-11-30', 1, 5250.00, 'confirmed', '', NULL, '2025-11-29 19:32:57', '2025-11-29 19:32:57', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `country`, `created_at`, `updated_at`) VALUES
(1, 'a', 'a', 'a@gmail.com', '09908989', 'rssffasa', '', '', '2025-11-29 17:21:09', '2025-11-29 17:21:09'),
(2, 'jayson', 'asasa', 'jayson@gmail.com', '0905678291', 'hcdc', NULL, NULL, '2025-11-29 18:41:50', '2025-11-29 18:41:50'),
(3, 'sir owen', 'aaa', '23434', 'qrqwrw', 'rqwrqw', NULL, NULL, '2025-11-29 18:46:22', '2025-11-29 18:46:22'),
(4, 'admin', 'try', 'try@gmail.com', '098989', 'BLK 30 LOT 3 MOLAVE HOMES PHASE 2, INDANGAN, DAVAO CITY', NULL, NULL, '2025-11-29 18:57:25', '2025-11-29 18:57:25'),
(5, 'sir ', 'owen', 'o@gmail.com', '090605050505', 'Toril', NULL, NULL, '2025-11-29 19:11:49', '2025-11-29 19:11:49'),
(6, 'hans', 'asdad', 'lah@gmail.com', '980880', '7807887087', NULL, NULL, '2025-11-29 19:31:22', '2025-11-29 19:31:22');

-- --------------------------------------------------------

--
-- Table structure for table `daily_revenue`
--

CREATE TABLE `daily_revenue` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total_revenue` decimal(10,2) DEFAULT 0.00,
  `bookings_count` int(11) DEFAULT 0,
  `checked_in_count` int(11) DEFAULT 0,
  `checked_out_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','card','online','bank_transfer') DEFAULT 'cash',
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'completed',
  `transaction_reference` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `booking_id`, `customer_id`, `amount`, `payment_method`, `status`, `transaction_reference`, `description`, `notes`, `created_at`, `updated_at`) VALUES
(1, 7, 5, 61680.00, 'cash', 'completed', 'TXN-BK-20251129-4VGC', 'Payment for booking BK-20251129-4VGC', NULL, '2025-11-29 19:12:14', '2025-11-29 19:12:14'),
(2, 8, 6, 5250.00, 'cash', 'completed', 'TXN-BK-20251129-XHR6', 'Payment for booking BK-20251129-XHR6', NULL, '2025-11-29 19:32:57', '2025-11-29 19:32:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$YIjlrJyEvzDyUVVF3dsmK.V6oJsPy8XxUqI1iWspXnQvnP8/LewG2', 'Admin User', NULL, 'admin', '2025-11-29 17:03:13', '2025-11-29 17:03:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_number` (`booking_number`),
  ADD KEY `accommodation_id` (`accommodation_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `booking_number_2` (`booking_number`),
  ADD KEY `status` (`status`),
  ADD KEY `check_in` (`check_in`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `phone` (`phone`);

--
-- Indexes for table `daily_revenue`
--
ALTER TABLE `daily_revenue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `status` (`status`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `daily_revenue`
--
ALTER TABLE `daily_revenue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodations` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
