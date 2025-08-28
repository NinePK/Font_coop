-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: coop
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `coop04_accommodation`
--

DROP TABLE IF EXISTS `coop04_accommodation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coop04_accommodation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `training_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `accommodation_type` varchar(50) NOT NULL,
  `accommodation_name` varchar(200) DEFAULT NULL,
  `room_number` varchar(20) DEFAULT NULL,
  `address` varchar(500) NOT NULL,
  `subdistrict` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `emergency_contact` varchar(200) NOT NULL,
  `emergency_phone` varchar(20) NOT NULL,
  `emergency_relation` varchar(100) NOT NULL,
  `travel_method` varchar(100) NOT NULL,
  `travel_details` text DEFAULT NULL,
  `distance_km` decimal(5,2) DEFAULT NULL,
  `travel_time` int(11) DEFAULT NULL,
  `status` enum('pending','submitted','approved','rejected') DEFAULT 'submitted',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_accommodation_training_idx` (`training_id`),
  KEY `fk_accommodation_user_idx` (`user_id`),
  CONSTRAINT `fk_accommodation_training` FOREIGN KEY (`training_id`) REFERENCES `training` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_accommodation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_coop04_accommodation_training` FOREIGN KEY (`training_id`) REFERENCES `training` (`id`),
  CONSTRAINT `fk_coop04_accommodation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coop04_accommodation`
--

LOCK TABLES `coop04_accommodation` WRITE;
/*!40000 ALTER TABLE `coop04_accommodation` DISABLE KEYS */;
INSERT INTO `coop04_accommodation` VALUES (1,135,38,'dormitory','htyhtyh','4','tyhthyth','จตุจักร','จตุจักร','กรุงเทพมหานคร','76000','1234567890','ioukuy','14252252','iopih','car','piopij',10.00,10,'submitted','2025-08-15 11:29:00','2025-08-15 11:59:35');
/*!40000 ALTER TABLE `coop04_accommodation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-26 13:52:15
