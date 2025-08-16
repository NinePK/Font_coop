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
-- Table structure for table `coop10_confirmation`
--

DROP TABLE IF EXISTS `coop10_confirmation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coop10_confirmation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `training_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `confirmation_date` date NOT NULL COMMENT 'วันที่ยืนยัน',
  `start_work_date` date NOT NULL COMMENT 'วันที่เริ่มงาน',
  `work_schedule` text NOT NULL COMMENT 'ตารางเวลาทำงาน',
  `supervisor_name` varchar(200) NOT NULL COMMENT 'ชื่อผู้ควบคุมงาน',
  `supervisor_position` varchar(200) NOT NULL COMMENT 'ตำแหน่งผู้ควบคุมงาน',
  `supervisor_contact` varchar(100) NOT NULL COMMENT 'ข้อมูลติดต่อผู้ควบคุมงาน',
  `additional_notes` text DEFAULT NULL COMMENT 'หมายเหตุเพิ่มเติม',
  `status` enum('pending','submitted','approved','rejected') DEFAULT 'submitted',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_confirmation_training_idx` (`training_id`),
  KEY `fk_confirmation_user_idx` (`user_id`),
  CONSTRAINT `fk_confirmation_training` FOREIGN KEY (`training_id`) REFERENCES `training` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_confirmation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coop10_confirmation`
--

LOCK TABLES `coop10_confirmation` WRITE;
/*!40000 ALTER TABLE `coop10_confirmation` DISABLE KEYS */;
/*!40000 ALTER TABLE `coop10_confirmation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-15 10:58:07
