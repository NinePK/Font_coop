-- Add mentor role to the role table
-- This script adds the MENTOR role with ID 4

INSERT INTO `role` (`id`, `status`, `status_en`) 
VALUES (4, 'ผู้สอนงาน/พี่เลี้ยง', 'MENTOR')
ON DUPLICATE KEY UPDATE 
  `status` = VALUES(`status`),
  `status_en` = VALUES(`status_en`);

-- Update AUTO_INCREMENT to ensure future inserts start from 5
ALTER TABLE `role` AUTO_INCREMENT = 5;