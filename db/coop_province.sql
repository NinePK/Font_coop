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
-- Table structure for table `province`
--

DROP TABLE IF EXISTS `province`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `province` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `province`
--

LOCK TABLES `province` WRITE;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
INSERT INTO `province` VALUES (10,'กรุงเทพมหานคร'),(11,'สมุทรปราการ'),(12,'นนทบุรี'),(13,'ปทุมธานี'),(14,'พระนครศรีอยุธยา'),(15,'อ่างทอง'),(16,'ลพบุรี'),(17,'สิงห์บุรี'),(18,'ชัยนาท'),(19,'สระบุรี'),(20,'ชลบุรี'),(21,'ระยอง'),(22,'จันทบุรี'),(23,'ตราด'),(24,'ฉะเชิงเทรา'),(25,'ปราจีนบุรี'),(26,'นครนายก'),(27,'สระแก้ว'),(30,'นครราชสีมา'),(31,'บุรีรัมย์'),(32,'สุรินทร์'),(33,'ศรีสะเกษ'),(34,'อุบลราชธานี'),(35,'ยโสธร'),(36,'ชัยภูมิ'),(37,'อำนาจเจริญ'),(38,'นราธิวาส'),(39,'หนองบัวลำภู'),(40,'ขอนแก่น'),(41,'อุดรธานี'),(42,'เลย'),(43,'หนองคาย'),(44,'มหาสารคาม'),(45,'ร้อยเอ็ด'),(46,'กาฬสินธุ์'),(47,'สกลนคร'),(48,'นครพนม'),(49,'มุกดาหาร'),(50,'เชียงใหม่'),(51,'ลำพูน'),(52,'ลำปาง'),(53,'อุตรดิตถ์'),(54,'แพร่'),(55,'น่าน'),(56,'พะเยา'),(57,'เชียงราย'),(58,'แม่ฮ่องสอน'),(60,'นครสวรรค์'),(61,'อุทัยธานี'),(62,'กำแพงเพชร'),(63,'ตาก'),(64,'สุโขทัย'),(65,'พิษณุโลก'),(66,'พิจิตร'),(67,'เพชรบูรณ์'),(70,'ราชบุรี'),(71,'กาญจนบุรี'),(72,'สุพรรณบุรี'),(73,'นครปฐม'),(74,'สมุทรสาคร'),(75,'สมุทรสงคราม'),(76,'เพชรบุรี'),(77,'ประจวบคีรีขันธ์'),(80,'นครศรีธรรมราช'),(81,'กระบี่'),(82,'พังงา'),(83,'ภูเก็ต'),(84,'สุราษฎร์ธานี'),(85,'ระนอง'),(86,'ชุมพร'),(90,'สงขลา'),(91,'สตูล'),(92,'ตรัง'),(93,'พัทลุง'),(94,'ปัตตานี'),(95,'ยะลา'),(96,'นราธิวาส');
/*!40000 ALTER TABLE `province` ENABLE KEYS */;
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
