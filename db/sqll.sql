-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema coop
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema coop
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `coop` DEFAULT CHARACTER SET utf8mb4 ;
USE `coop` ;

-- -----------------------------------------------------
-- Table `coop`.`acadrank`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`acadrank` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name_th` VARCHAR(100) NULL DEFAULT NULL,
  `name_en` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`faculty`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`faculty` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `faculty_en` VARCHAR(100) NULL DEFAULT NULL,
  `faculty_th` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`major`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`major` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `major_en` VARCHAR(100) NULL DEFAULT NULL,
  `major_th` VARCHAR(100) NULL DEFAULT NULL,
  `faculty_id` INT(11) NOT NULL,
  `degree` VARCHAR(100) NULL DEFAULT NULL,
  `under_major_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_major_faculty_idx` USING BTREE (`faculty_id`) VISIBLE,
  CONSTRAINT `fk_major_faculty`
    FOREIGN KEY (`faculty_id`)
    REFERENCES `coop`.`faculty` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `status_en` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL DEFAULT NULL,
  `fname` VARCHAR(45) NULL DEFAULT NULL,
  `sname` VARCHAR(45) NULL DEFAULT NULL,
  `major_id` INT(11) NULL DEFAULT NULL,
  `picture` VARCHAR(100) NULL DEFAULT NULL,
  `role_id` INT(11) NOT NULL DEFAULT 3,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `fname_en` VARCHAR(50) NULL DEFAULT NULL,
  `sname_en` VARCHAR(50) NULL DEFAULT NULL,
  `is_admin` BIGINT(20) NULL DEFAULT 0,
  `title` VARCHAR(45) NULL DEFAULT NULL,
  `title_en` VARCHAR(45) NULL DEFAULT NULL,
  `acad_rank` VARCHAR(45) NULL DEFAULT NULL,
  `phd` INT(1) NULL DEFAULT 0,
  `acad_rank_id` INT(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_user_major1_idx` (`major_id` ASC) VISIBLE,
  INDEX `fk_user_role1_idx` (`role_id` ASC) VISIBLE,
  INDEX `fk_user_acad_rank_idx` (`acad_rank_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_acad_rank`
    FOREIGN KEY (`acad_rank_id`)
    REFERENCES `coop`.`acadrank` (`id`),
  CONSTRAINT `fk_user_acadrank`
    FOREIGN KEY (`acad_rank_id`)
    REFERENCES `coop`.`acadrank` (`id`),
  CONSTRAINT `fk_user_major`
    FOREIGN KEY (`major_id`)
    REFERENCES `coop`.`major` (`id`),
  CONSTRAINT `fk_user_major1`
    FOREIGN KEY (`major_id`)
    REFERENCES `coop`.`major` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `coop`.`role` (`id`),
  CONSTRAINT `fk_user_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `coop`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 195
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`province`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`province` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 97
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`amphur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`amphur` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(100) NULL DEFAULT NULL,
  `code` INT(11) NULL DEFAULT NULL,
  `amphur_seq` INT(11) NULL DEFAULT 0,
  `province_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`, `province_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `outer_index` (`amphur_seq` ASC) VISIBLE,
  INDEX `fk_amphur_province1` (`province_id` ASC) VISIBLE,
  CONSTRAINT `fk_amphur_province`
    FOREIGN KEY (`province_id`)
    REFERENCES `coop`.`province` (`id`),
  CONSTRAINT `province_id_fk`
    FOREIGN KEY (`province_id`)
    REFERENCES `coop`.`province` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 957
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`tambon`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`tambon` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(100) NULL DEFAULT NULL,
  `tambon_seq` INT(11) NOT NULL DEFAULT 0,
  `amphur_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `outer_index` (`tambon_seq` ASC) VISIBLE,
  INDEX `fk_tambon_amphur1` (`amphur_id` ASC) VISIBLE,
  CONSTRAINT `amphur_id_fk`
    FOREIGN KEY (`amphur_id`)
    REFERENCES `coop`.`amphur` (`id`),
  CONSTRAINT `fk_tambon_amphur`
    FOREIGN KEY (`amphur_id`)
    REFERENCES `coop`.`amphur` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8882
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`mooban`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`mooban` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(100) NULL DEFAULT NULL,
  `moo` INT(11) NOT NULL DEFAULT 0,
  `tambon_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `outer_index` (`moo` ASC) VISIBLE,
  INDEX `fk_mooban_tambon1` (`tambon_id` ASC) VISIBLE,
  CONSTRAINT `fk_mooban_tambon`
    FOREIGN KEY (`tambon_id`)
    REFERENCES `coop`.`tambon` (`id`),
  CONSTRAINT `tambon_id_fk`
    FOREIGN KEY (`tambon_id`)
    REFERENCES `coop`.`tambon` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2137
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`entrepreneur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`entrepreneur` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name_th` VARCHAR(100) NULL DEFAULT NULL,
  `name_en` VARCHAR(100) NULL DEFAULT NULL,
  `tel` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `business` VARCHAR(100) NULL DEFAULT NULL,
  `employees` INT(11) NULL DEFAULT NULL,
  `manager` VARCHAR(100) NULL DEFAULT NULL,
  `manager_position` VARCHAR(100) NULL DEFAULT NULL,
  `manager_dept` VARCHAR(100) NULL DEFAULT NULL,
  `contact` VARCHAR(100) NULL DEFAULT NULL,
  `contact_position` VARCHAR(100) NULL DEFAULT NULL,
  `contact_dept` VARCHAR(100) NULL DEFAULT NULL,
  `contact_tel` VARCHAR(100) NULL DEFAULT NULL,
  `contact_email` VARCHAR(100) NULL DEFAULT NULL,
  `address` VARCHAR(100) NULL DEFAULT NULL,
  `mooban_id` INT(11) NULL DEFAULT NULL,
  `tambon_id` INT(11) NULL DEFAULT NULL,
  `enable` INT(11) NULL DEFAULT 1,
  `coop` INT(11) NULL DEFAULT 0,
  `created_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_th` (`name_th` ASC, `name_en` ASC) VISIBLE,
  INDEX `fk_entrepreneur_mooban1_idx` (`mooban_id` ASC) VISIBLE,
  INDEX `fk_entrepreneur_tambon1_idx` (`tambon_id` ASC) VISIBLE,
  INDEX `fk_entrepreneur_created_idx` (`created_id` ASC) VISIBLE,
  CONSTRAINT `fk_entrepreneur_created_user`
    FOREIGN KEY (`created_id`)
    REFERENCES `coop`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_entrepreneur_mooban`
    FOREIGN KEY (`mooban_id`)
    REFERENCES `coop`.`mooban` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_entrepreneur_tambon`
    FOREIGN KEY (`tambon_id`)
    REFERENCES `coop`.`tambon` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 67
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`incharge`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`incharge` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `fname` VARCHAR(100) NULL DEFAULT NULL,
  `sname` VARCHAR(100) NULL DEFAULT NULL,
  `position` VARCHAR(100) NULL DEFAULT NULL,
  `entrepreneur_id` INT(11) NOT NULL,
  `username` VARCHAR(100) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_incharge_entrepreneur1_idx` (`entrepreneur_id` ASC) VISIBLE,
  CONSTRAINT `fk_incharge_entrepreneur`
    FOREIGN KEY (`entrepreneur_id`)
    REFERENCES `coop`.`entrepreneur` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`job`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`job` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `job_des` VARCHAR(400) NULL DEFAULT NULL,
  `entrepreneur_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_incharge_entrepreneur1_idx` (`entrepreneur_id` ASC) VISIBLE,
  CONSTRAINT `fk_entrepreneur_jobs`
    FOREIGN KEY (`entrepreneur_id`)
    REFERENCES `coop`.`entrepreneur` (`id`),
  CONSTRAINT `fk_incharge_entrepreneur1_idx`
    FOREIGN KEY (`entrepreneur_id`)
    REFERENCES `coop`.`entrepreneur` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_job_entrepreneur`
    FOREIGN KEY (`entrepreneur_id`)
    REFERENCES `coop`.`entrepreneur` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 105
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`semester`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`semester` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `semester` INT(11) NULL DEFAULT NULL,
  `year` INT(11) NULL DEFAULT NULL,
  `is_current` INT(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`training`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`training` (
  `user_id` INT(11) NOT NULL,
  `semester_id` INT(11) NOT NULL,
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `job_id` INT(11) NOT NULL,
  `address` VARCHAR(100) NULL DEFAULT NULL,
  `mooban_id` INT(11) NULL DEFAULT NULL,
  `incharge_id1` INT(11) NULL DEFAULT NULL,
  `incharge_id2` INT(11) NULL DEFAULT NULL,
  `teacher_id1` INT(11) NULL DEFAULT NULL,
  `teacher_id2` INT(11) NULL DEFAULT NULL,
  `startdate` DATE NULL DEFAULT NULL,
  `enddate` DATE NULL DEFAULT NULL,
  `tambon_id` INT(11) NULL DEFAULT NULL,
  `tel` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `lat` DOUBLE NULL DEFAULT NULL,
  `long` DOUBLE NULL DEFAULT NULL,
  `name_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `position_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `dept_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `tel_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `email_mentor` VARCHAR(100) NULL DEFAULT NULL,
  `job_position` VARCHAR(100) NULL DEFAULT NULL,
  `job_des` VARCHAR(400) NULL DEFAULT NULL,
  `time_mentor` DATE NULL DEFAULT NULL,
  `coop` INT(11) NULL DEFAULT 0,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `status` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_user_has_semester_semester1_idx` (`semester_id` ASC) VISIBLE,
  INDEX `fk_user_has_semester_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_training_job1_idx` (`job_id` ASC) VISIBLE,
  INDEX `fk_training_mooban1_idx` (`mooban_id` ASC) VISIBLE,
  INDEX `fk_training_incharge1_idx` (`incharge_id1` ASC) VISIBLE,
  INDEX `fk_training_incharge2_idx` (`incharge_id2` ASC) VISIBLE,
  INDEX `fk_training_user1_idx` (`teacher_id1` ASC) VISIBLE,
  INDEX `fk_training_user2_idx` (`teacher_id2` ASC) VISIBLE,
  INDEX `fk_training_tambon1_idx` (`tambon_id` ASC) VISIBLE,
  CONSTRAINT `fk_training_incharge1`
    FOREIGN KEY (`incharge_id1`)
    REFERENCES `coop`.`incharge` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_training_incharge2`
    FOREIGN KEY (`incharge_id2`)
    REFERENCES `coop`.`incharge` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_training_job`
    FOREIGN KEY (`job_id`)
    REFERENCES `coop`.`job` (`id`),
  CONSTRAINT `fk_training_mooban`
    FOREIGN KEY (`mooban_id`)
    REFERENCES `coop`.`mooban` (`id`),
  CONSTRAINT `fk_training_semester`
    FOREIGN KEY (`semester_id`)
    REFERENCES `coop`.`semester` (`id`),
  CONSTRAINT `fk_training_tambon`
    FOREIGN KEY (`tambon_id`)
    REFERENCES `coop`.`tambon` (`id`),
  CONSTRAINT `fk_training_teacher1`
    FOREIGN KEY (`teacher_id1`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_training_teacher2`
    FOREIGN KEY (`teacher_id2`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_training_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_user_trainings`
    FOREIGN KEY (`user_id`)
    REFERENCES `coop`.`user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 128
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `coop`.`advisor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`advisor` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `advisor_id` INT(11) NOT NULL,
  `training_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_advisor_user1_idx` (`advisor_id` ASC) VISIBLE,
  INDEX `fk_advisor_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_advisor_advisor`
    FOREIGN KEY (`advisor_id`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_advisor_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`),
  CONSTRAINT `fk_advisor_user`
    FOREIGN KEY (`advisor_id`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_training_advisors`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 293
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`assess_entrepreneur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`assess_entrepreneur` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `advisor_id` INT(11) NOT NULL,
  `entrepreneur_id` INT(11) NOT NULL,
  `answer11` INT(1) NULL DEFAULT 0,
  `answer12` INT(1) NULL DEFAULT 0,
  `answer21` INT(1) NULL DEFAULT 0,
  `answer22` INT(1) NULL DEFAULT 0,
  `answer23` INT(1) NULL DEFAULT 0,
  `answer31` INT(1) NULL DEFAULT 0,
  `answer41` INT(1) NULL DEFAULT 0,
  `answer42` INT(1) NULL DEFAULT 0,
  `answer43` INT(1) NULL DEFAULT 0,
  `answer44` INT(1) NULL DEFAULT 0,
  `answer45` INT(1) NULL DEFAULT 0,
  `answer51` INT(1) NULL DEFAULT 0,
  `answer52` INT(1) NULL DEFAULT 0,
  `answer53` INT(1) NULL DEFAULT 0,
  `answer54` INT(1) NULL DEFAULT 0,
  `answer55` INT(1) NULL DEFAULT 0,
  `answer56` INT(1) NULL DEFAULT 0,
  `answer57` INT(1) NULL DEFAULT 0,
  `answer58` INT(1) NULL DEFAULT 0,
  `answer61` INT(1) NULL DEFAULT 0,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `suggestion` MEDIUMTEXT NULL DEFAULT NULL,
  `answer71` INT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_assess_advisor1_idx` (`advisor_id` ASC) VISIBLE,
  INDEX `fk_assess_entrepreneur1_idx` (`entrepreneur_id` ASC) VISIBLE,
  CONSTRAINT `fk_assess_entrepreneur_advisor`
    FOREIGN KEY (`advisor_id`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_assess_entrepreneur_entrepreneur`
    FOREIGN KEY (`entrepreneur_id`)
    REFERENCES `coop`.`entrepreneur` (`id`),
  CONSTRAINT `fk_entrepreneur_assess_entrepreneurs`
    FOREIGN KEY (`entrepreneur_id`)
    REFERENCES `coop`.`entrepreneur` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`assess_student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`assess_student` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `advisor_id` INT(11) NOT NULL,
  `answer11` INT(2) NULL DEFAULT 0,
  `answer12` INT(2) NULL DEFAULT 0,
  `answer13` INT(2) NULL DEFAULT 0,
  `answer14` INT(2) NULL DEFAULT 0,
  `answer21` INT(2) NULL DEFAULT 0,
  `answer22` INT(2) NULL DEFAULT 0,
  `answer23` INT(2) NULL DEFAULT 0,
  `answer24` INT(2) NULL DEFAULT 0,
  `answer25` INT(2) NULL DEFAULT 0,
  `answer26` INT(2) NULL DEFAULT 0,
  `answer31` INT(2) NULL DEFAULT 0,
  `answer32` INT(2) NULL DEFAULT 0,
  `answer33` INT(2) NULL DEFAULT 0,
  `answer34` INT(2) NULL DEFAULT 0,
  `answer35` INT(2) NULL DEFAULT 0,
  `answer41` INT(2) NULL DEFAULT 0,
  `answer42` INT(2) NULL DEFAULT 0,
  `answer43` INT(2) NULL DEFAULT 0,
  `answer44` INT(2) NULL DEFAULT 0,
  `answer45` INT(2) NULL DEFAULT 0,
  `answer51` INT(2) NULL DEFAULT 0,
  `answer52` INT(2) NULL DEFAULT 0,
  `answer53` INT(2) NULL DEFAULT 0,
  `answer54` INT(2) NULL DEFAULT 0,
  `answer61` INT(2) NULL DEFAULT 0,
  `answer71` INT(2) NULL DEFAULT 0,
  `answer72` INT(2) NULL DEFAULT 0,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `training_id` INT(11) NOT NULL,
  `suggestion` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_assess_advisor1_idx` (`advisor_id` ASC) VISIBLE,
  INDEX `fk_assess_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_assess_student_advisor`
    FOREIGN KEY (`advisor_id`)
    REFERENCES `coop`.`user` (`id`),
  CONSTRAINT `fk_assess_student_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`),
  CONSTRAINT `fk_training_assess_students`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 44
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`daily`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`daily` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `startdate` DATE NULL DEFAULT NULL,
  `starttime` DATETIME(3) NULL DEFAULT NULL,
  `endtime` DATETIME(3) NULL DEFAULT NULL,
  `training_id` INT(11) NOT NULL,
  `job` MEDIUMTEXT NULL DEFAULT NULL,
  `problem` MEDIUMTEXT NULL DEFAULT NULL,
  `fixed` MEDIUMTEXT NULL DEFAULT NULL,
  `course_fixed` MEDIUMTEXT NULL DEFAULT NULL,
  `exp` MEDIUMTEXT NULL DEFAULT NULL,
  `suggestion` MEDIUMTEXT NULL DEFAULT NULL,
  `department` VARCHAR(100) NULL DEFAULT NULL,
  `status` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_record_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_daily_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`form_submission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`form_submission` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `training_id` INT(11) NOT NULL,
  `form_type` VARCHAR(50) NULL DEFAULT NULL,
  `submission_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `status` VARCHAR(20) NULL DEFAULT 'submitted',
  `reviewed_by_user` INT(11) NULL DEFAULT NULL,
  `reviewed_by_incharge` INT(11) NULL DEFAULT NULL,
  `reviewed_at` DATETIME NULL DEFAULT NULL,
  `approval_status` ENUM('pending', 'approved', 'rejected') NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  INDEX `fk_form_training` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_form_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`notification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`notification` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL DEFAULT NULL,
  `incharge_id` INT(11) NULL DEFAULT NULL,
  `sender_id` INT(11) NULL DEFAULT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `is_read` TINYINT(1) NULL DEFAULT 0,
  `type` VARCHAR(50) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  INDEX `fk_notification_user` (`user_id` ASC) VISIBLE,
  INDEX `fk_notification_incharge` (`incharge_id` ASC) VISIBLE,
  CONSTRAINT `fk_notification_incharge`
    FOREIGN KEY (`incharge_id`)
    REFERENCES `coop`.`incharge` (`id`),
  CONSTRAINT `fk_notification_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `coop`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`plan`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`plan` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `month` INT(2) NULL DEFAULT NULL,
  `topic` VARCHAR(100) NULL DEFAULT NULL,
  `training_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uni_plain_id` (`id` ASC) VISIBLE,
  INDEX `fk_record_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_plain_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_plan_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`),
  CONSTRAINT `fk_training_plans`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1183
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`record`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`record` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `week` INT(11) NULL DEFAULT NULL,
  `startdate` DATE NULL DEFAULT NULL,
  `enddate` DATE NULL DEFAULT NULL,
  `starttime` DATETIME(3) NULL DEFAULT NULL,
  `endtime` DATETIME(3) NULL DEFAULT NULL,
  `training_id` INT(11) NOT NULL,
  `job` MEDIUMTEXT NULL DEFAULT NULL,
  `problem` MEDIUMTEXT NULL DEFAULT NULL,
  `fixed` MEDIUMTEXT NULL DEFAULT NULL,
  `course_fixed` MEDIUMTEXT NULL DEFAULT NULL,
  `exp` MEDIUMTEXT NULL DEFAULT NULL,
  `suggestion` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_record_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_record_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`report` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `topic_th` VARCHAR(200) NULL DEFAULT NULL,
  `topic_en` VARCHAR(200) NULL DEFAULT NULL,
  `detail` MEDIUMTEXT NULL DEFAULT NULL,
  `training_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uni_report_id` (`id` ASC) VISIBLE,
  INDEX `fk_record_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_report_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`),
  CONSTRAINT `fk_training_reports`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 49
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `coop`.`weekly`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`weekly` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `week` INT(11) NULL DEFAULT NULL,
  `startdate` DATE NULL DEFAULT NULL,
  `enddate` DATE NULL DEFAULT NULL,
  `training_id` INT(11) NOT NULL,
  `job` MEDIUMTEXT NULL DEFAULT NULL,
  `problem` MEDIUMTEXT NULL DEFAULT NULL,
  `fixed` MEDIUMTEXT NULL DEFAULT NULL,
  `course_fixed` MEDIUMTEXT NULL DEFAULT NULL,
  `exp` MEDIUMTEXT NULL DEFAULT NULL,
  `suggestion` MEDIUMTEXT NULL DEFAULT NULL,
  `department` VARCHAR(100) NULL DEFAULT NULL,
  `status` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_record_training1_idx` (`training_id` ASC) VISIBLE,
  CONSTRAINT `fk_training_weeklys`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`),
  CONSTRAINT `fk_weekly_training`
    FOREIGN KEY (`training_id`)
    REFERENCES `coop`.`training` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1534
DEFAULT CHARACTER SET = utf8mb4;

USE `coop` ;

-- -----------------------------------------------------
-- Placeholder table for view `coop`.`user_count`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coop`.`user_count` (`status` INT, `status_en` INT, `user_count` INT);

-- -----------------------------------------------------
-- View `coop`.`user_count`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `coop`.`user_count`;
USE `coop`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`coop`@`localhost` SQL SECURITY DEFINER VIEW `coop`.`user_count` AS select `coop`.`role`.`status` AS `status`,`coop`.`role`.`status_en` AS `status_en`,count(`coop`.`user`.`id`) AS `user_count` from (`coop`.`user` join `coop`.`role` on(`coop`.`user`.`role_id` = `coop`.`role`.`id`)) where `coop`.`role`.`status_en` in ('TEACHER','STUDENT','OFFICER') group by `coop`.`role`.`status_en`;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
