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
-- Table structure for table `assess_entrepreneur`
--

DROP TABLE IF EXISTS `assess_entrepreneur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assess_entrepreneur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `advisor_id` int(11) NOT NULL,
  `entrepreneur_id` int(11) NOT NULL,
  `answer11` int(1) DEFAULT 0,
  `answer12` int(1) DEFAULT 0,
  `answer21` int(1) DEFAULT 0,
  `answer22` int(1) DEFAULT 0,
  `answer23` int(1) DEFAULT 0,
  `answer31` int(1) DEFAULT 0,
  `answer41` int(1) DEFAULT 0,
  `answer42` int(1) DEFAULT 0,
  `answer43` int(1) DEFAULT 0,
  `answer44` int(1) DEFAULT 0,
  `answer45` int(1) DEFAULT 0,
  `answer51` int(1) DEFAULT 0,
  `answer52` int(1) DEFAULT 0,
  `answer53` int(1) DEFAULT 0,
  `answer54` int(1) DEFAULT 0,
  `answer55` int(1) DEFAULT 0,
  `answer56` int(1) DEFAULT 0,
  `answer57` int(1) DEFAULT 0,
  `answer58` int(1) DEFAULT 0,
  `answer61` int(1) DEFAULT 0,
  `updated_at` datetime DEFAULT current_timestamp(),
  `suggestion` mediumtext DEFAULT NULL,
  `answer71` int(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_assess_advisor1_idx` (`advisor_id`),
  KEY `fk_assess_entrepreneur1_idx` (`entrepreneur_id`),
  CONSTRAINT `fk_assess_entrepreneur_advisor` FOREIGN KEY (`advisor_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_assess_entrepreneur_entrepreneur` FOREIGN KEY (`entrepreneur_id`) REFERENCES `entrepreneur` (`id`),
  CONSTRAINT `fk_entrepreneur_assess_entrepreneurs` FOREIGN KEY (`entrepreneur_id`) REFERENCES `entrepreneur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assess_entrepreneur`
--

LOCK TABLES `assess_entrepreneur` WRITE;
/*!40000 ALTER TABLE `assess_entrepreneur` DISABLE KEYS */;
/*!40000 ALTER TABLE `assess_entrepreneur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-15 10:58:04
