-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: cafe_admin
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

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
-- Table structure for table `AboutUsPages`
--

DROP TABLE IF EXISTS `AboutUsPages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AboutUsPages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AboutUsPages`
--

LOCK TABLES `AboutUsPages` WRITE;
/*!40000 ALTER TABLE `AboutUsPages` DISABLE KEYS */;
INSERT INTO `AboutUsPages` VALUES (1,'description','<p>Hello mama miya</p>','2025-06-21 09:43:09','2025-06-21 10:00:56'),(2,'subHeader','No off','2025-06-21 09:43:09','2025-06-21 10:00:56'),(3,'subDescription','<p>Nice to say</p>','2025-06-21 09:43:09','2025-06-21 10:00:56'),(4,'image','about-us/1750500056692.jpg','2025-06-21 09:50:26','2025-06-21 10:00:56');
/*!40000 ALTER TABLE `AboutUsPages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Banners`
--

DROP TABLE IF EXISTS `Banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `button_title` varchar(255) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Banners`
--

LOCK TABLES `Banners` WRITE;
/*!40000 ALTER TABLE `Banners` DISABLE KEYS */;
INSERT INTO `Banners` VALUES (1,'2 12Nourish Noor Cafe',NULL,NULL,'Test 2','Test 2',0,3,'2025-06-25 13:29:53','2025-06-25 13:49:14'),(2,'Nourish Noor Cafe New',NULL,NULL,'undefined','undefined',1,4,'2025-06-25 13:31:38','2025-06-25 13:49:14'),(3,'Binay Manandhar',NULL,'/banner/1750858332010.png','','',0,5,'2025-06-25 13:32:12','2025-06-25 13:49:14'),(4,'Nourish Noor Cafe w',NULL,'/banner/1750858538982.png','Test','Test',0,6,'2025-06-25 13:35:39','2025-06-25 13:49:14'),(5,'admin',NULL,'/banner/1750858556891.png','','undefined',0,2,'2025-06-25 13:35:56','2025-06-25 13:49:14'),(6,'User',NULL,'/banner/1750858579123.png','undefined','undefined',1,1,'2025-06-25 13:36:19','2025-06-25 13:49:14'),(7,'admin 2',NULL,'/banner/1750858646949.png','null','null',1,7,'2025-06-25 13:37:26','2025-06-25 13:49:14'),(8,'Test 2',NULL,'/banner/1750858672473.png','null','null',0,8,'2025-06-25 13:37:52','2025-06-25 13:49:14'),(9,'horoko',NULL,'/banner/1750858716715.png','','',0,9,'2025-06-25 13:38:36','2025-06-25 13:49:14'),(10,'test','Hello','/banner/1751074127397.png','no','ns',1,10,'2025-06-28 01:28:47','2025-06-28 01:29:02');
/*!40000 ALTER TABLE `Banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CustomerReviews`
--

DROP TABLE IF EXISTS `CustomerReviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CustomerReviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `ratings` varchar(255) DEFAULT NULL,
  `review` text,
  `order` int DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CustomerReviews`
--

LOCK TABLES `CustomerReviews` WRITE;
/*!40000 ALTER TABLE `CustomerReviews` DISABLE KEYS */;
INSERT INTO `CustomerReviews` VALUES (2,'Binay Manandhar','Developer','3','Hello asddsa',2,1,'2025-06-21 08:01:24','2025-06-25 12:55:26'),(3,'Nourish Noor Cafe','Developer','2','Test',4,1,'2025-06-21 08:01:50','2025-06-25 12:55:26'),(4,'Admin','Developer','2','saddddd',3,0,'2025-06-21 08:07:03','2025-06-25 12:55:26'),(5,'sadsa','sadsda','3','sddsa',1,1,'2025-06-21 08:11:27','2025-06-25 12:55:26'),(6,'Test','Test','3','dssdaasd',5,1,'2025-06-25 10:05:49','2025-06-25 12:55:26'),(7,'adssad','sdadsa','1','sadsadsad',6,1,'2025-06-25 10:05:54','2025-06-25 12:55:26'),(8,'saddsa','sadsda','2','saddsasadsda',7,0,'2025-06-25 10:05:59','2025-06-25 12:55:26'),(9,'saddsadsa','adssaddsa','1','sdasadsadsda',8,0,'2025-06-25 10:06:04','2025-06-25 12:55:26'),(10,'sadads','saddsa','2','sadsaddsa',9,0,'2025-06-25 10:06:08','2025-06-25 12:55:26'),(11,'sasaddsa','saddsa','1','sadsadsaasd',10,0,'2025-06-25 10:06:13','2025-06-25 12:55:26'),(12,'qewdwd','wqesaddsa','1','sdadsadssad',14,0,'2025-06-25 10:06:18','2025-06-25 10:11:15'),(13,'sddssdadsa','sadsda','1','sdadsasaddsa',13,0,'2025-06-25 10:06:23','2025-06-25 10:11:15'),(14,'sadsad','sasda','2','sdsadasdds',12,0,'2025-06-25 10:06:27','2025-06-25 10:11:15'),(15,'sdasad','sadsa','2','asddsasad',11,0,'2025-06-25 10:06:31','2025-06-25 10:11:15');
/*!40000 ALTER TABLE `CustomerReviews` ENABLE KEYS */;
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
-- Table structure for table `FoodCategories`
--

DROP TABLE IF EXISTS `FoodCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FoodCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FoodCategories`
--

LOCK TABLES `FoodCategories` WRITE;
/*!40000 ALTER TABLE `FoodCategories` DISABLE KEYS */;
INSERT INTO `FoodCategories` VALUES (1,'Starter',0,1,'2025-06-25 12:52:44','2025-06-28 01:44:57'),(2,'Dinner',1,2,'2025-06-25 12:52:50','2025-06-28 01:44:57');
/*!40000 ALTER TABLE `FoodCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FoodItems`
--

DROP TABLE IF EXISTS `FoodItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FoodItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `food_category_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FoodItems`
--

LOCK TABLES `FoodItems` WRITE;
/*!40000 ALTER TABLE `FoodItems` DISABLE KEYS */;
INSERT INTO `FoodItems` VALUES (1,1,'Nourish Noor Cafes','/food-item/1751036210403.png',0,2,'2025-06-27 14:56:36','2025-06-27 14:57:01'),(2,1,'Admin','/food-item/1751036218955.png',1,1,'2025-06-27 14:56:58','2025-06-27 14:57:01');
/*!40000 ALTER TABLE `FoodItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Galleries`
--

DROP TABLE IF EXISTS `Galleries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Galleries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Galleries`
--

LOCK TABLES `Galleries` WRITE;
/*!40000 ALTER TABLE `Galleries` DISABLE KEYS */;
INSERT INTO `Galleries` VALUES (28,'3','/gallery/1750851203101.png',5,'2025-06-25 11:33:23','2025-06-25 11:42:16'),(29,'5','/gallery/1750851203107.png',3,'2025-06-25 11:33:23','2025-06-25 11:42:16'),(30,'2','/gallery/1750851203111.png',1,'2025-06-25 11:33:23','2025-06-25 11:42:16'),(31,'4','/gallery/1750851203132.png',4,'2025-06-25 11:33:23','2025-06-25 11:42:16'),(32,'1','/gallery/1750851203133.png',2,'2025-06-25 11:33:23','2025-06-25 11:42:16');
/*!40000 ALTER TABLE `Galleries` ENABLE KEYS */;
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
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalSettings`
--

LOCK TABLES `GlobalSettings` WRITE;
/*!40000 ALTER TABLE `GlobalSettings` DISABLE KEYS */;
INSERT INTO `GlobalSettings` VALUES (1,'name','Nourish Noor Cafe','2023-10-07 06:22:24','2025-06-27 14:24:14'),(2,'pan','1234242','2023-10-07 06:24:49','2025-06-04 11:52:11'),(4,'phoneNumber','9841111','2025-06-04 12:16:57','2025-06-27 14:24:16'),(5,'email','asdsdsa@gmail.com','2025-06-04 12:16:57','2025-06-27 14:24:16'),(6,'googleMap','asdsadasd Test','2025-06-04 12:17:58','2025-06-27 14:24:16'),(9,'bannerImage','global-settings/1750499489681.png','2025-06-04 12:52:07','2025-06-21 09:51:29'),(10,'facebookLink','123','2025-06-21 01:28:25','2025-06-27 14:24:16'),(11,'instagramLink','132','2025-06-21 01:28:25','2025-06-27 14:24:16'),(12,'twitterLink','12321','2025-06-21 01:28:25','2025-06-27 14:24:16'),(13,'pinterestLink','12312','2025-06-21 01:28:25','2025-06-27 14:24:16'),(14,'workingTime','<p>Monday: 5pm - 10pm</p>\r\n<p>Monday: 5pm - 10pm</p>\r\n<p>Monday: 5pm - 10pm</p>\r\n<p>Monday: 5pm - 10pm</p>\r\n<p>Monday: 5pm - 10pm</p>\r\n<p>Monday: 5pm - 10pm</p>\r\n<p>Monday: 5pm - 10pm<br>Bar opens till 10pm</p>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>','2025-06-21 02:07:39','2025-06-27 14:24:16');
/*!40000 ALTER TABLE `GlobalSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupHasRoles`
--

DROP TABLE IF EXISTS `GroupHasRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupHasRoles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupHasRoles`
--

LOCK TABLES `GroupHasRoles` WRITE;
/*!40000 ALTER TABLE `GroupHasRoles` DISABLE KEYS */;
INSERT INTO `GroupHasRoles` VALUES (24,1,12,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(25,1,2,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(26,1,3,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(27,1,4,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(28,1,33,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(29,1,34,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(30,1,35,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(31,1,8,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(32,1,7,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(33,1,6,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(34,1,10,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(35,1,11,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(36,1,31,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(37,1,14,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(38,1,15,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(39,1,16,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(40,1,18,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(41,1,21,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(42,1,20,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(43,1,22,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(44,1,24,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(45,1,25,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(46,1,30,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(47,1,27,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(48,1,28,'2025-06-28 03:26:52','2025-06-28 03:26:52'),(49,2,2,'2025-06-28 03:27:20','2025-06-28 03:27:20'),(50,2,3,'2025-06-28 03:27:20','2025-06-28 03:27:20'),(51,2,4,'2025-06-28 03:27:20','2025-06-28 03:27:20');
/*!40000 ALTER TABLE `GroupHasRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Groups`
--

DROP TABLE IF EXISTS `Groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Groups`
--

LOCK TABLES `Groups` WRITE;
/*!40000 ALTER TABLE `Groups` DISABLE KEYS */;
INSERT INTO `Groups` VALUES (1,'Super Admin','2025-06-28 03:25:29','2025-06-28 03:26:52'),(2,'Admin','2025-06-28 03:27:20','2025-06-28 03:27:20');
/*!40000 ALTER TABLE `Groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomePages`
--

DROP TABLE IF EXISTS `HomePages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomePages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomePages`
--

LOCK TABLES `HomePages` WRITE;
/*!40000 ALTER TABLE `HomePages` DISABLE KEYS */;
INSERT INTO `HomePages` VALUES (1,'image1Title','123','2025-06-28 02:19:19','2025-06-28 02:30:37'),(2,'image1Description','123321','2025-06-28 02:19:19','2025-06-28 02:30:37'),(3,'image2Title','21231','2025-06-28 02:19:19','2025-06-28 02:30:37'),(4,'image2Description','2132323','2025-06-28 02:19:19','2025-06-28 02:30:37'),(5,'image3Title','2133212','2025-06-28 02:19:19','2025-06-28 02:30:37'),(6,'image3Description','2323','2025-06-28 02:19:19','2025-06-28 02:30:37'),(7,'specialDishes','12312332213','2025-06-28 02:19:19','2025-06-28 02:30:37'),(8,'expertChefs','21321321321','2025-06-28 02:19:19','2025-06-28 02:30:37'),(9,'eventHosted','321321321321','2025-06-28 02:19:19','2025-06-28 02:30:37'),(10,'happyCustomers','213213321','2025-06-28 02:19:19','2025-06-28 02:30:37'),(11,'image1','home/1751077808416.png','2025-06-28 02:30:08','2025-06-28 02:30:08'),(12,'image2','home/1751077837502.png','2025-06-28 02:30:08','2025-06-28 02:30:37'),(13,'image3','home/1751077808429.png','2025-06-28 02:30:08','2025-06-28 02:30:08');
/*!40000 ALTER TABLE `HomePages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES (1,'Test','test@admin.com','helllllllllllllllllllllllllllllllllllllllllllllllllll',NULL,NULL);
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `parent_role_id` int DEFAULT NULL,
  `order` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'User',NULL,1,NULL,NULL),(2,'View-user',1,1,NULL,NULL),(3,'Add-user',1,2,NULL,NULL),(4,'Edit-User',1,3,NULL,NULL),(5,'Banner',NULL,3,NULL,NULL),(6,'View-banner',5,1,NULL,NULL),(7,'Add-banner',5,2,NULL,NULL),(8,'Edit-banner',5,3,NULL,NULL),(9,'Food Category',NULL,4,NULL,NULL),(10,'View-food-category',9,1,NULL,NULL),(11,'Add-food-category',9,2,NULL,NULL),(12,'Edit-food-category',9,3,NULL,NULL),(13,'Gallery',NULL,5,NULL,NULL),(14,'View-gallery',13,1,NULL,NULL),(15,'Add-gallery',13,2,NULL,NULL),(16,'Edit-gallery',13,3,NULL,NULL),(17,'Message',NULL,6,NULL,NULL),(18,'View-message',17,1,NULL,NULL),(19,'Customer Review',NULL,7,NULL,NULL),(20,'View-customer-review',19,1,NULL,NULL),(21,'Add-customer-review',19,2,NULL,NULL),(22,'Edit-customer-review',19,3,NULL,NULL),(23,'Home',NULL,8,NULL,NULL),(24,'View-home',23,1,NULL,NULL),(25,'Add-home',23,2,NULL,NULL),(26,'About Us',NULL,9,NULL,NULL),(27,'View-about-us',26,1,NULL,NULL),(28,'Add-about-us',26,2,NULL,NULL),(29,'Global Setting',NULL,10,NULL,NULL),(30,'View-global-setting',29,1,NULL,NULL),(31,'Add-global-setting',29,2,NULL,NULL),(32,'Group',NULL,2,NULL,NULL),(33,'View-group',32,1,NULL,NULL),(34,'Add-group',32,2,NULL,NULL),(35,'Edit-group',32,3,NULL,NULL);
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20231001141957-create-user.js'),('20231001142156-create-product.js'),('20231001142234-create-branch.js'),('20231001142329-create-customer.js'),('20231001142353-create-payment.js'),('20231001142640-create-invoice.js'),('20231001142751-create-invoice-has-product.js'),('20231001142922-create-setting.js'),('20231001142953-create-global-setting.js'),('20240127134528-create-offer.js'),('20250621064253-create-customer-review.js'),('20250621064303-create-message.js'),('20250621090613-create-home-page.js'),('20250621090623-create-about-us-page.js'),('20250625103421-create-gallery.js'),('20250625123346-create-food-category.js'),('20250625130142-create-banner.js'),('20250627141833-create-food-item.js'),('20250628014611-create-home-page.js'),('20250628025725-create-role.js'),('20250628025730-create-group-has-roles.js'),('20250628025730-create-group.js'),('20250628025736-create-group-has-roles.js'),('20250628031847-create-groups.js');
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
  `group_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `branch_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (10,1,'Super Admin','super@admin.com','$2b$10$gp5hXb2uKYt21Ww6U.doVe9i.A/au/fMRhZbPHKfMm0MFpNyXYv9K',1,1,'2023-10-01 15:56:00','2023-10-01 15:56:00',NULL),(11,NULL,'User','user@mv.com','$2b$10$SGJa8qhT.MKz5B6YddaDJO16y/RB9/OzwlGSr62.sXrTEXuOjLCsq',0,0,'2023-10-01 15:56:00','2024-12-19 01:36:23',NULL),(12,NULL,'Test','test@mv.com','$2b$10$t/QeU.rkqBf8QMe7Eqv06Oo/dO9BFM8h2JemONp0kk56ez55ALEXC',1,0,'2024-01-13 11:37:06','2024-01-14 12:10:41',NULL),(13,2,'Binay Manandhar','binaymdr25@gmail.com','$2b$10$9RlPZKR8C5tz0pkTaOEWEOldoaZaC9bCMTq6tnamSqfb19PGEwxpC',1,0,'2025-06-28 03:38:51','2025-06-28 03:38:51',NULL);
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

-- Dump completed on 2025-06-28 10:30:36
