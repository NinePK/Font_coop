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
-- Table structure for table `student_documents`
--

DROP TABLE IF EXISTS `student_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `document_type` varchar(20) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `status` enum('pending','submitted','approved','rejected') DEFAULT 'pending',
  `submitted_date` datetime DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `training_id` int(11) DEFAULT NULL COMMENT 'เชื่อมโยงกับ training',
  `document_data_id` int(11) DEFAULT NULL COMMENT 'ID ของข้อมูลเอกสารเฉพาะ (เช่น accommodation_id)',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `document_type` (`document_type`),
  KEY `status` (`status`),
  KEY `fk_student_documents_training_idx` (`training_id`),
  CONSTRAINT `fk_student_documents_training` FOREIGN KEY (`training_id`) REFERENCES `training` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_documents`
--

LOCK TABLES `student_documents` WRITE;
/*!40000 ALTER TABLE `student_documents` DISABLE KEYS */;
INSERT INTO `student_documents` VALUES (1,2,'COOP-01','ใบรายงานตัวสหกิจศึกษา','แบบฟอร์มลงทะเบียนเข้าร่วมโครงการสหกิจศึกษา','/uploads/documents/65022207/coop01_report_form.pdf','submitted','2025-08-15 00:36:13',NULL,NULL,NULL,'2025-08-15 00:36:13','2025-08-15 00:36:13',NULL,NULL),(2,2,'COOP-04','แบบฟอร์มแจ้งรายละเอียดที่พัก','ข้อมูลที่พักระหว่างการปฏิบัติงาน','/uploads/documents/65022207/coop04_accommodation_form.pdf','submitted','2025-08-15 00:36:13',NULL,NULL,NULL,'2025-08-15 00:36:13','2025-08-15 00:36:13',NULL,NULL);
/*!40000 ALTER TABLE `student_documents` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-15 10:58:09
