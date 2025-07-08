-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 28, 2025 at 10:33 AM
-- Server version: 5.7.44
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ADMIN_GROCERY`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(10) NOT NULL,
  `password` varchar(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `pnumber` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `password`, `name`, `pnumber`) VALUES
(101, 'pass1234', 'Alice Johnson', 9876543210),
(102, 'secure789', 'Bob Smith', 9123456780),
(103, 'alpha456', 'Charlie Brown', 9988776655),
(104, 'beta321', 'Diana Prince', 9012345678),
(105, 'gamma654', 'Ethan Hunt', 9871234560),
(106, 'delta987', 'Fiona Glenanne', 9786543210),
(107, 'omega111', 'George Bluth', 9098765432),
(108, 'theta222', 'Hannah Baker', 9345678901),
(109, 'lambda333', 'Ian Malcolm', 9456123780),
(110, 'sigma444', 'Jane Eyre', 9567890123),
(111, 'zeta555', 'Kevin Malone', 9234567890),
(112, 'psi666', 'Laura Palmer', 9678901234),
(113, 'phi777', 'Michael Scott', 9356789012),
(114, 'chi888', 'Nina Sharp', 9870987654),
(115, 'kappa999', 'Oscar Wilde', 9123098765),
(116, 'tau000', 'Pam Beesly', 9213456789),
(117, 'upsilon111', 'Quentin Tarantino', 9334567890),
(118, 'iota222', 'Rachel Green', 9567012345),
(119, 'eta333', 'Steve Rogers', 9890123456),
(120, 'rho444', 'Tina Fey', 9123409876);

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cust_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone_number`, `created_at`, `updated_at`) VALUES
(1, 'Mehak', '9915904105', '2025-04-27 06:43:44', '2025-04-27 06:43:44'),
(2, 'Alysha', '83347929', '2025-04-27 11:50:36', '2025-04-27 11:50:36'),
(3, 'mehak', '8749292', '2025-04-27 11:53:19', '2025-04-27 11:53:19'),
(4, 'alysha', '32498595', '2025-04-27 12:08:14', '2025-04-27 12:08:14'),
(5, 'Mehaki', '99149503', '2025-04-27 12:14:57', '2025-04-27 12:14:57'),
(6, 'mehak', '9915904105', '2025-04-27 12:24:19', '2025-04-27 12:24:19'),
(7, 'mehak', '98768656', '2025-04-27 12:30:42', '2025-04-27 12:30:42'),
(8, 'Mehak', '991405920', '2025-04-27 12:32:27', '2025-04-27 12:32:27'),
(9, 'Mehak', '9915904105', '2025-04-27 13:23:00', '2025-04-27 13:23:00'),
(10, 'Mehaki', '4892044', '2025-04-27 13:30:18', '2025-04-27 13:30:18'),
(11, 'Mehak', '9915904105', '2025-04-27 16:15:55', '2025-04-27 16:15:55'),
(12, 'Mehakpreet Kaur', '9915904105', '2025-04-27 16:27:26', '2025-04-27 16:27:26'),
(13, 'Harshleen', '83947584', '2025-04-27 16:35:59', '2025-04-27 16:35:59'),
(14, 'Mehaki', '9915904105', '2025-04-27 17:12:19', '2025-04-27 17:12:19'),
(15, 'jessca', '47394892', '2025-04-27 18:04:34', '2025-04-27 18:04:34'),
(16, 'Jessica', '4739294', '2025-04-27 18:17:57', '2025-04-27 18:17:57'),
(17, 'jessica', '372478453', '2025-04-27 18:18:56', '2025-04-27 18:18:56'),
(18, 'Mehak', '4829895', '2025-04-27 18:20:23', '2025-04-27 18:20:23'),
(19, 'Jessica', '84038493', '2025-04-27 19:37:11', '2025-04-27 19:37:11'),
(20, 'Harshleen', '473393892', '2025-04-27 19:41:31', '2025-04-27 19:41:31'),
(21, 'ALYSHA', '82032902', '2025-04-27 19:46:43', '2025-04-27 19:46:43'),
(22, 'alysha', '47293893', '2025-04-27 19:48:36', '2025-04-27 19:48:36'),
(23, 'Mehak', '38293', '2025-04-27 20:21:27', '2025-04-27 20:21:27'),
(24, 'Mehak', '9915904105', '2025-04-27 20:23:51', '2025-04-27 20:23:51'),
(25, 'Aditya', '7392844', '2025-04-27 20:38:07', '2025-04-27 20:38:07'),
(26, 'MAMA', '848494', '2025-04-27 20:52:25', '2025-04-27 20:52:25'),
(27, 'HSJD', '457839', '2025-04-27 21:00:03', '2025-04-27 21:00:03'),
(28, 'Aditya', '4739354', '2025-04-27 21:01:37', '2025-04-27 21:01:37'),
(29, 'aditya', '7459393', '2025-04-27 21:05:04', '2025-04-27 21:05:04'),
(30, 'Adityaaa', '4729284', '2025-04-27 21:18:40', '2025-04-27 21:18:40'),
(31, 'mehak', '439455', '2025-04-27 21:19:47', '2025-04-27 21:19:47'),
(32, 'jessica', '473595', '2025-04-27 21:21:15', '2025-04-27 21:21:15'),
(33, 'gyahs', '124585', '2025-04-27 21:23:57', '2025-04-27 21:23:57'),
(34, 'HUhaha', '372940', '2025-04-27 21:30:12', '2025-04-27 21:30:12'),
(35, 'Mehakpreet Kaur', '9915904105', '2025-04-27 22:11:26', '2025-04-27 22:11:26'),
(36, 'Mehakpreet', '3829482', '2025-04-28 08:01:54', '2025-04-28 08:01:54');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `cust_id` int(100) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `cust_id`, `total_amount`, `order_date`, `created_at`, `updated_at`) VALUES
(10, 36, 240.00, '2025-04-28 08:02:03', '2025-04-28 08:02:03', '2025-04-28 08:02:03');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int(50) NOT NULL,
  `unit` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `stock` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `unit`, `category`, `stock`) VALUES
(1, 'Yoga Bar', 60, 'each', 'Snacks', 85),
(2, 'Chips', 20, 'pack', 'Snacks', 198),
(3, 'Cookies', 50, 'box', 'Snacks', 138),
(4, 'Popcorn', 30, 'pack', 'Snacks', 174),
(5, 'Crackers', 40, 'box', 'Snacks', 128),
(6, 'Pretzels', 35, 'pack', 'Snacks', 170),
(7, 'Trail Mix', 60, 'pack', 'Snacks', 90),
(8, 'Nachos', 45, 'pack', 'Snacks', 140),
(9, 'Biscuits', 30, 'packet', 'Snacks', 183),
(10, 'Nuts Mix', 70, 'pack', 'Snacks', 109),
(11, 'Apple', 60, 'kg', 'Fruit', 100),
(12, 'Banana', 80, 'dozen', 'Fruit', 118),
(13, 'Orange', 100, 'kg', 'Fruit', 90),
(14, 'Tomato', 50, 'kg', 'Vegetable', 149),
(15, 'Potato', 120, 'kg', 'Vegetable', 198),
(16, 'Carrot', 70, 'kg', 'Vegetable', 179),
(17, 'Strawberry', 250, 'box', 'Fruit', 74),
(18, 'Spinach', 110, 'bunch', 'Vegetable', 60),
(19, 'Mango', 130, 'kg', 'Fruit', 82),
(20, 'Broccoli', 150, 'box', 'Vegetable', 70),
(21, 'Milk', 55, 'liter', 'Dairy', 100),
(22, 'Cheddar Cheese', 300, 'kg', 'Dairy', 40),
(23, 'Butter', 250, 'pack', 'Dairy', 60),
(24, 'Yogurt', 35, 'cup', 'Dairy', 80),
(25, 'Paneer', 280, 'kg', 'Dairy', 50),
(26, 'Cream', 120, 'pack', 'Dairy', 45),
(27, 'Ghee', 500, 'kg', 'Dairy', 30),
(28, 'Buttermilk', 25, 'bottle', 'Dairy', 70),
(29, 'Mozzarella Cheese', 320, 'kg', 'Dairy', 35),
(30, 'Flavored Milk', 40, 'bottle', 'Dairy', 90),
(31, 'Frozen French Fries', 150, 'kg', 'Frozen', 100),
(32, 'Frozen Peas', 120, 'kg', 'Frozen', 80),
(33, 'Frozen Chicken Nuggets', 220, 'kg', 'Frozen', 60),
(34, 'Frozen Fish Fillets', 350, 'kg', 'Frozen', 50),
(35, 'Frozen Vegetables Mix', 130, 'kg', 'Frozen', 90),
(36, 'Frozen Pizza', 500, 'box', 'Frozen', 40),
(37, 'Frozen Dumplings', 250, 'kg', 'Frozen', 70),
(38, 'Frozen Corn', 100, 'kg', 'Frozen', 110),
(39, 'Frozen Ice Cream', 180, 'litre', 'Frozen', 120),
(40, 'Frozen Spring Rolls', 200, 'box', 'Frozen', 65),
(41, 'Coca-Cola', 50, 'bottle', 'Beverages', 200),
(42, 'Pepsi', 45, 'bottle', 'Beverages', 180),
(43, 'Orange Juice', 100, 'litre', 'Beverages', 150),
(44, 'Lemonade', 70, 'litre', 'Beverages', 130),
(45, 'Iced Tea', 80, 'bottle', 'Beverages', 100),
(46, 'Coffee', 250, 'packet', 'Beverages', 90),
(47, 'Green Tea', 150, 'box', 'Beverages', 75),
(48, 'Mineral Water', 20, 'bottle', 'Beverages', 300),
(49, 'Energy Drink', 120, 'can', 'Beverages', 80),
(50, 'Milk', 60, 'litre', 'Beverages', 200),
(51, 'Lentils', 90, 'kg', 'Pulses', 180),
(52, 'Chickpeas', 100, 'kg', 'Pulses', 150),
(53, 'Black Beans', 120, 'kg', 'Pulses', 200),
(54, 'Green Gram', 110, 'kg', 'Pulses', 120),
(55, 'Red Lentils', 95, 'kg', 'Pulses', 170),
(56, 'Pigeon Peas', 130, 'kg', 'Pulses', 130),
(57, 'Mung Beans', 85, 'kg', 'Pulses', 150),
(58, 'Kidney Beans', 125, 'kg', 'Pulses', 140),
(59, 'Split Peas', 75, 'kg', 'Pulses', 160),
(60, 'Black-eyed Peas', 110, 'kg', 'Pulses', 110);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cust_id` (`cust_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
