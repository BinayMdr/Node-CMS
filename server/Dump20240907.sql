-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: admin_cms
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Branches`
--

DROP TABLE IF EXISTS `Branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `main_branch` tinyint(1) DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branches`
--

LOCK TABLES `Branches` WRITE;
/*!40000 ALTER TABLE `Branches` DISABLE KEYS */;
INSERT INTO `Branches` VALUES (24,'Madikatar',1,1,'2023-10-04 05:22:10','2024-01-12 10:37:01'),(25,'Gongabu',0,0,'2023-10-04 05:27:12','2024-01-13 10:53:22'),(26,'Lazimpat',0,1,'2023-10-04 05:49:41','2024-01-13 12:10:36');
/*!40000 ALTER TABLE `Branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GlobalSettings`
--

DROP TABLE IF EXISTS `GlobalSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GlobalSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalSettings`
--

LOCK TABLES `GlobalSettings` WRITE;
/*!40000 ALTER TABLE `GlobalSettings` DISABLE KEYS */;
INSERT INTO `GlobalSettings` VALUES (1,'name','MV Burger','2023-10-07 06:22:24','2024-01-27 12:42:52'),(2,'pan','1234242','2023-10-07 06:24:49','2024-01-27 12:42:52'),(3,'invoicePrefix','MV','2024-01-27 12:42:41','2024-01-27 12:42:52');
/*!40000 ALTER TABLE `GlobalSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvoiceHasProducts`
--

DROP TABLE IF EXISTS `InvoiceHasProducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvoiceHasProducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `total` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvoiceHasProducts`
--

LOCK TABLES `InvoiceHasProducts` WRITE;
/*!40000 ALTER TABLE `InvoiceHasProducts` DISABLE KEYS */;
INSERT INTO `InvoiceHasProducts` VALUES (22,17,1,'150','1','150','2024-01-17 14:01:32','2024-01-17 14:01:32'),(23,17,3,'10','1','10','2024-01-17 14:01:32','2024-01-17 14:01:32'),(30,21,1,'150','1','150','2024-01-17 14:18:45','2024-01-17 14:18:45'),(31,22,3,'10','1','10','2024-01-17 14:18:52','2024-01-17 14:18:52'),(32,23,3,'10','1','10','2024-01-17 14:19:04','2024-01-17 14:19:04'),(33,23,5,'40','1','40','2024-01-17 14:19:04','2024-01-17 14:19:04'),(34,24,2,'52','1','52','2024-01-17 14:19:12','2024-01-17 14:19:12'),(35,25,3,'10','1','10','2024-01-17 14:19:18','2024-01-17 14:19:18'),(37,27,2,'52','1','52','2024-01-17 14:19:32','2024-01-17 14:19:32'),(40,30,1,'150','1','150','2024-01-17 14:23:10','2024-01-17 14:23:10'),(42,32,1,'150','1','150','2024-01-17 14:38:13','2024-01-17 14:38:13'),(48,31,2,'52','3','156','2024-01-18 14:35:48','2024-01-18 14:35:48'),(49,26,1,'150','1','150','2024-01-18 14:37:44','2024-01-18 14:37:44'),(54,34,2,'52','1','52','2024-01-20 04:28:57','2024-01-20 04:28:57'),(55,34,1,'150','1','150','2024-01-20 04:28:57','2024-01-20 04:28:57'),(56,34,4,'20','1','20','2024-01-20 04:28:57','2024-01-20 04:28:57'),(57,35,2,'52','1','52','2024-01-27 12:47:45','2024-01-27 12:47:45'),(58,36,1,'150','2','300','2024-01-28 09:22:21','2024-01-28 09:22:21'),(59,37,2,'52','201','10452','2024-01-28 09:22:35','2024-01-28 09:22:35'),(60,38,1,'150','1','150','2024-01-28 09:24:58','2024-01-28 09:24:58'),(63,41,1,'150','1','150','2024-01-28 09:27:34','2024-01-28 09:27:34'),(75,39,1,'150','100','15000','2024-01-28 10:07:41','2024-01-28 10:07:41'),(78,40,2,'52','3','156','2024-01-28 10:09:33','2024-01-28 10:09:33'),(79,40,1,'150','2','300','2024-01-28 10:09:33','2024-01-28 10:09:33'),(80,42,1,'150','8','1200','2024-01-28 10:16:50','2024-01-28 10:16:50');
/*!40000 ALTER TABLE `InvoiceHasProducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoices`
--

DROP TABLE IF EXISTS `Invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `sub_total` varchar(255) DEFAULT NULL,
  `discount_percent` varchar(255) DEFAULT NULL,
  `discount_amount` varchar(255) DEFAULT NULL,
  `total` varchar(255) DEFAULT NULL,
  `received_amount` varchar(255) DEFAULT NULL,
  `changed_amount` varchar(255) DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `prepared_by_id` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `offer_id` int DEFAULT NULL,
  `offer_amount` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoices`
--

LOCK TABLES `Invoices` WRITE;
/*!40000 ALTER TABLE `Invoices` DISABLE KEYS */;
INSERT INTO `Invoices` VALUES (17,'MV0001',NULL,'Binay','160','10','16.00','144','0','0',NULL,12,'Pending',26,NULL,NULL,'2024-01-17 14:01:32','2024-01-17 14:01:32'),(21,'MV0002',NULL,'Hari','150','10','15.00','135','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:18:45','2024-01-17 14:18:45'),(22,'MV0003',NULL,'Ram Bahadur','10','10','1.00','9','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:18:52','2024-01-17 14:18:52'),(23,'MV0004',NULL,'Ram Bahadur','50','10','5.00','45','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:19:04','2024-01-17 14:19:04'),(24,'MV0005',NULL,'Hari','52','10','5.20','46.8','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:19:11','2024-01-17 14:19:11'),(25,'MV0006',NULL,'Hari','10','10','1.00','9','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:19:18','2024-01-17 14:19:18'),(26,'MV0007',NULL,'Binay','150','20','30.00','120','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:19:25','2024-01-18 14:37:44'),(27,'MV0008',NULL,'Binay','52','10','5.20','46.8','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:19:32','2024-01-17 14:19:32'),(30,'MV0009',NULL,'Hari','150','10','15.00','135','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:23:10','2024-01-17 14:23:10'),(31,'MV0010',NULL,'Ram Bahadur','156','20','15.60','140.4','200','75.2',2,11,'Completed',24,NULL,NULL,'2024-01-17 14:23:34','2024-01-18 14:35:48'),(32,'MV0011',NULL,'Hari','150','20','30.00','120','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-17 14:38:13','2024-01-17 14:38:13'),(33,'MV0012',NULL,'Hari','170','20','17.00','153','500','347',4,11,'Completed',24,NULL,NULL,'2024-01-18 13:11:58','2024-01-18 14:34:45'),(34,'MV0013',NULL,'Binay','222','0','0.00','222','0','0',4,11,'Pending',24,NULL,NULL,'2024-01-20 04:18:47','2024-01-20 04:28:57'),(35,'MV0014',NULL,'Hari','52','0','0.00','52','0','0',NULL,11,'Pending',24,NULL,NULL,'2024-01-27 12:47:45','2024-01-27 12:47:45'),(38,'MV0017',NULL,'Binay','150','0','0.00','150','0','0',NULL,11,'Pending',NULL,NULL,NULL,'2024-01-28 09:24:58','2024-01-28 09:24:58'),(39,'MV0018',NULL,'Hari','15000','0','0.00','14970','16000','1000',4,12,'Completed',26,5,30,'2024-01-28 09:27:08','2024-01-28 10:07:41'),(40,'MV0019',NULL,'Ram Bahadur','456','0','0.00','410.4','500','89.60000000000002',NULL,12,'Pending',26,5,45.6,'2024-01-28 09:27:28','2024-01-28 10:09:33'),(41,'MV0020',NULL,'Binay','150','0','0.00','150','0','0',NULL,12,'Pending',26,NULL,NULL,'2024-01-28 09:27:34','2024-01-28 09:27:34'),(42,'MV0021',NULL,'Hari','1200.00','0','0.00','1020.00','0','0',NULL,12,'Pending',26,4,180,'2024-01-28 10:16:50','2024-01-28 10:16:50');
/*!40000 ALTER TABLE `Invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Offers`
--

DROP TABLE IF EXISTS `Offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `offer_type` varchar(255) DEFAULT NULL,
  `offer_on` varchar(255) DEFAULT NULL,
  `offer_on_amount` int DEFAULT NULL,
  `offer_on_product` varchar(255) DEFAULT NULL,
  `offer_on_quantity` int DEFAULT NULL,
  `discount_off` float DEFAULT NULL,
  `amount_off` int DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Offers`
--

LOCK TABLES `Offers` WRITE;
/*!40000 ALTER TABLE `Offers` DISABLE KEYS */;
INSERT INTO `Offers` VALUES (1,'5% off on 5000 purchase','Discount','Total Price',5000,NULL,NULL,5,NULL,0,'2024-01-28 06:05:24','2024-01-28 06:12:58'),(2,'100 off on 2000 purchase','Amount','Total Price',2000,NULL,NULL,NULL,100,1,'2024-01-28 06:06:28','2024-01-28 06:06:28'),(3,'Buy 2 burger get Rs. 200 off','Amount','Product',NULL,'1',2,NULL,200,0,'2024-01-28 06:07:17','2024-01-28 06:12:50'),(4,'Buy 3 burger get 15% off','Discount','Product',NULL,'1',3,15,NULL,1,'2024-01-28 06:07:46','2024-01-28 06:07:46'),(5,'Buy 2 burger get 10 % off','Discount','Product',NULL,'1',2,10,NULL,1,'2024-01-28 07:02:10','2024-01-28 07:58:25');
/*!40000 ALTER TABLE `Offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
INSERT INTO `Payments` VALUES (1,'E-sewa',0,'2023-10-07 05:55:17','2024-01-18 13:02:17'),(2,'Khalti',1,'2023-10-07 05:55:30','2023-10-07 05:56:41'),(3,'Phone Pay',1,'2024-01-12 14:18:29','2024-01-12 14:18:29'),(4,'Cash',1,'2024-01-12 14:18:37','2024-01-12 14:18:37');
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,'Burger',150,1,'2023-10-07 10:41:56','2023-10-07 10:41:56'),(2,'Cheese',52,1,'2023-10-07 10:42:28','2023-10-07 10:46:43'),(3,'Coke',10,1,'2024-01-12 13:55:34','2024-01-12 13:55:34'),(4,'Fanta',20,1,'2024-01-12 13:56:06','2024-01-12 13:56:06'),(5,'Patties',40,1,'2024-01-12 13:57:32','2024-01-12 13:57:32'),(6,'soda1',200,0,'2024-01-12 13:58:08','2024-01-17 11:52:11');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20231001141957-create-user.js'),('20231001142156-create-product.js'),('20231001142234-create-branch.js'),('20231001142329-create-customer.js'),('20231001142353-create-payment.js'),('20231001142640-create-invoice.js'),('20231001142751-create-invoice-has-product.js'),('20231001142922-create-setting.js'),('20231001142953-create-global-setting.js'),('20240127134528-create-offer.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Settings`
--

DROP TABLE IF EXISTS `Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settings`
--

LOCK TABLES `Settings` WRITE;
/*!40000 ALTER TABLE `Settings` DISABLE KEYS */;
INSERT INTO `Settings` VALUES (1,26,'Lazimpat, Kathmandu','9849823198','2023-10-07 10:02:08','2024-01-13 09:40:36'),(2,24,'Madikatar, Kathmandu','9812321231','2023-10-07 10:09:36','2024-01-20 03:53:43'),(5,25,'Lazimpat, Kathmandu','asddsadsa','2024-01-13 13:53:08','2024-01-13 13:53:08');
/*!40000 ALTER TABLE `Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (10,'Super Admin','super@admin.com',NULL,'$2b$10$gp5hXb2uKYt21Ww6U.doVe9i.A/au/fMRhZbPHKfMm0MFpNyXYv9K',1,1,'2023-10-01 15:56:00','2023-10-01 15:56:00'),(11,'User','user@mv.com',24,'$2b$10$.4AvMpV0Sb9G69.gPeBQ7OzdmMoqROstjuOTzQ4OvwR8eL2r6R.ZO',1,0,'2023-10-01 15:56:00','2024-01-13 12:10:45'),(12,'Test','test@mv.com',26,'$2b$10$t/QeU.rkqBf8QMe7Eqv06Oo/dO9BFM8h2JemONp0kk56ez55ALEXC',1,0,'2024-01-13 11:37:06','2024-01-14 12:10:41');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-07 12:00:31
