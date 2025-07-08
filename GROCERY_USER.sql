-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 28, 2025 at 10:31 AM
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
-- Database: `GROCERY_USER`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` varchar(11) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT '100'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `unit`, `category`, `stock`) VALUES
(1, 'Yoga bar', 60.00, 'each', 'Snacks', 89),
(2, 'Apple', 60.00, 'kg', 'Fruits & Vegetables', 96),
(3, 'Banana', 80.00, 'dozen', 'Fruits & Vegetables', 120),
(4, 'Orange', 100.00, 'kg', 'Fruits & Vegetables', 90),
(5, 'Tomato', 50.00, 'kg', 'Fruits & Vegetables', 150),
(6, 'Potato', 120.00, 'kg', 'Fruits & Vegetables', 198),
(7, 'Carrot', 70.00, 'kg', 'Fruits & Vegetables', 180),
(8, 'Strawberry', 250.00, 'box', 'Fruits & Vegetables', 75),
(9, 'Spinach', 110.00, 'bunch', 'Fruits & Vegetables', 60),
(10, 'Mango', 130.00, 'kg', 'Fruits & Vegetables', 83),
(11, 'Broccoli', 150.00, 'box', 'Fruits & Vegetables', 70),
(12, 'Chips', 20.00, 'pack', 'Snacks', 200),
(13, 'Cookies', 50.00, 'box', 'Snacks', 150),
(14, 'Popcorn', 30.00, 'pack', 'Snacks', 180),
(15, 'Crackers', 40.00, 'box', 'Snacks', 130),
(16, 'Pretzels', 35.00, 'pack', 'Snacks', 170),
(17, 'Trail Mix', 60.00, 'pack', 'Snacks', 90),
(18, 'Nachos', 45.00, 'pack', 'Snacks', 140),
(19, 'Biscuits', 30.00, 'packet', 'Snacks', 190),
(20, 'Nuts Mix', 70.00, 'pack', 'Snacks', 110),
(21, 'Milk', 55.00, 'liter', 'Dairy', 100),
(22, 'Cheddar Cheese', 300.00, 'kg', 'Dairy', 40),
(23, 'Butter', 250.00, 'pack', 'Dairy', 60),
(24, 'Yogurt', 35.00, 'cup', 'Dairy', 80),
(25, 'Paneer', 280.00, 'kg', 'Dairy', 50),
(26, 'Cream', 120.00, 'pack', 'Dairy', 45),
(27, 'Ghee', 500.00, 'kg', 'Dairy', 30),
(28, 'Buttermilk', 25.00, 'bottle', 'Dairy', 70),
(29, 'Mozzarella Cheese', 320.00, 'kg', 'Dairy', 35),
(30, 'Flavored Milk', 40.00, 'bottle', 'Dairy', 90),
(31, 'Frozen French Fries', 150.00, 'kg', 'Frozen', 100),
(32, 'Frozen Peas', 120.00, 'kg', 'Frozen', 80),
(33, 'Frozen Chicken Nuggets', 220.00, 'kg', 'Frozen', 60),
(34, 'Frozen Fish Fillets', 350.00, 'kg', 'Frozen', 50),
(35, 'Frozen Vegetables Mix', 130.00, 'kg', 'Frozen', 90),
(36, 'Frozen Pizza', 500.00, 'box', 'Frozen', 40),
(37, 'Frozen Dumplings', 250.00, 'kg', 'Frozen', 68),
(38, 'Frozen Corn', 100.00, 'kg', 'Frozen', 110),
(39, 'Frozen Ice Cream', 180.00, 'litre', 'Frozen', 120),
(40, 'Frozen Spring Rolls', 200.00, 'box', 'Frozen', 65),
(41, 'Coca-Cola', 50.00, 'bottle', 'Beverages', 199),
(42, 'Pepsi', 45.00, 'bottle', 'Beverages', 180),
(43, 'Orange Juice', 100.00, 'litre', 'Beverages', 150),
(44, 'Lemonade', 70.00, 'litre', 'Beverages', 130),
(45, 'Iced Tea', 80.00, 'bottle', 'Beverages', 100),
(46, 'Coffee', 250.00, 'packet', 'Beverages', 90),
(47, 'Green Tea', 150.00, 'box', 'Beverages', 75),
(48, 'Mineral Water', 20.00, 'bottle', 'Beverages', 300),
(49, 'Energy Drink', 120.00, 'can', 'Beverages', 80),
(50, 'Milk', 60.00, 'litre', 'Beverages', 200),
(51, 'Lentils', 90.00, 'kg', 'Pulses', 180),
(52, 'Chickpeas', 100.00, 'kg', 'Pulses', 150),
(53, 'Black Beans', 120.00, 'kg', 'Pulses', 200),
(54, 'Green Gram', 110.00, 'kg', 'Pulses', 120),
(55, 'Red Lentils', 95.00, 'kg', 'Pulses', 170),
(56, 'Pigeon Peas', 130.00, 'kg', 'Pulses', 130),
(57, 'Mung Beans', 85.00, 'kg', 'Pulses', 150),
(58, 'Kidney Beans', 125.00, 'kg', 'Pulses', 140),
(59, 'Split Peas', 75.00, 'kg', 'Pulses', 160),
(60, 'Black-eyed Peas', 110.00, 'kg', 'Pulses', 110);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `hashed_password` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `hashed_password`, `password`) VALUES
(1, 'mehak_1398', 'mehak@gmail.com', '$2b$08$W8nvxDmhv4hXMp5s2c3UsuWoNV1trddcYfGYsy3BIoIqoGcT2LR6m', 'mehak123'),
(2, 'alysha12', 'alysha@gmail.com', '$2b$08$ubWxpJ3QwFsdjVTEUgQhhOKqi3geapW1cS7ULMZX3vcCkJsdMzcOi', 'alysha123'),
(3, 'aditya01', 'aditya@gmail.com', '$2b$08$R6EsaOLZgfC2HSUraL.m0eZV..4HDT4fubp/5du16XSqekbdDt6wO', 'aditya12'),
(4, 'random_12', 'random@gmail.com', '$2b$08$rJ8ikX1DgD8L83yzElSZPuumVu7jDdV1Ig8OchAvxPJO0X/QioOwy', 'grocery12'),
(5, 'Jun', 'jund@gmail.com', '$2b$08$6zrllo34iHmbSr0lF3QzlOEoAGY8EOX7KIObcV/yUy4LgOFA55vaa', 'password@11'),
(6, 'user12', 'user@gmail.com', '$2b$08$8ZO2fe0ZFIx4NobVIsopOeN.t4GsQoaqlFUZHrXQ16drsQl7j2KK6', 'user@12'),
(7, 'Mehakpreet', 'mehakpreet@gmail.com', '$2b$08$qC6Ry7Y92BNFJgRfarSr6.XDCoD7WxD438.8HO3efUSaYyYRuKCqC', 'youareamazing');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`),
  ADD KEY `FK_CART` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FK_CART` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_user1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
