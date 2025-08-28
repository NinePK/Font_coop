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
-- Table structure for table `major`
--

DROP TABLE IF EXISTS `major`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `major` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `major_en` varchar(100) DEFAULT NULL,
  `major_th` varchar(100) DEFAULT NULL,
  `faculty_id` int(11) NOT NULL,
  `degree` varchar(100) DEFAULT NULL,
  `under_major_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_major_faculty_idx` (`faculty_id`) USING BTREE,
  CONSTRAINT `fk_major_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major`
--

LOCK TABLES `major` WRITE;
/*!40000 ALTER TABLE `major` DISABLE KEYS */;
INSERT INTO `major` VALUES (-1,'Undefined','ไม่ได้กำหนด',1,NULL,0),(1,'Computer Engineering','วิศวกรรมคอมพิวเตอร์',1,'วิศวกรรมศาสตรบัณฑิต',1),(2,'Secretary office','สำนักงานคณะ เทคโนโลยีสารสนเทศและการสื่อสาร',1,NULL,2),(3,'Software Engineering','วิศวกรรมซอฟต์แวร์',1,'วิศวกรรมศาสตรบัณฑิต',3),(4,'Computer Science','วิทยาการคอมพิวเตอร์',1,'วิทยาศาสตรบัณฑิต',4),(5,'Information Technology','เทคโนโลยีสารสนเทศ',1,'วิทยาศาสตรบัณฑิต',5),(6,'Geographic Information Science','ภูมิสารสนเทศศาสตร์',1,'วิทยาศาสตรบัณฑิต',6),(7,'Computer Graphics and Multimedia','คอมพิวเตอร์กราฟิกและมัลติมีเดีย',1,'ศิลปศาสตรบัณฑิต',7),(8,'Business Computer','คอมพิวเตอร์ธุรกิจ',1,'บริหารธุรกิจบัณฑิต',8),(9,'Information Technology and English','วท.บ. (เทคโนโลยีสารสนเทศ) และ ศศ.บ. (ภาษาอังกฤษ)',1,'วิทยาศาสตรบัณฑิต และ ศิลปศาสตรบัณฑิต',5),(10,'Computer Graphics and Multimedia','เทคโนโลยีคอมพิวเตอร์กราฟิกและมัลติมีเดีย',1,NULL,0),(11,'Y61','โรงเรียนสาธิตมหาวิทยาลัยพะเยา',2,NULL,0),(12,'64','ทันตแพทยศาสตร์',3,NULL,0),(13,'DEV','งานพัฒนาระบบสารสนเทศ',4,NULL,0),(14,'64','การบัญชี',5,NULL,0),(15,'Secretary office','สำนักงานคณะ ศิลปศาสตร์',6,NULL,0);
/*!40000 ALTER TABLE `major` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-26 13:52:12
