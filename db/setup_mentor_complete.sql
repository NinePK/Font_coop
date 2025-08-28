-- Complete setup script for MENTOR role and sample data
-- This script will add the MENTOR role and create sample mentor users

-- Step 1: Add MENTOR role to the role table
INSERT INTO `role` (`id`, `status`, `status_en`) 
VALUES (4, 'ผู้สอนงาน/พี่เลี้ยง', 'MENTOR')
ON DUPLICATE KEY UPDATE 
  `status` = VALUES(`status`),
  `status_en` = VALUES(`status_en`);

-- Update AUTO_INCREMENT to ensure future inserts start from 5
ALTER TABLE `role` AUTO_INCREMENT = 5;

-- Step 2: Insert mentor users with comprehensive data
INSERT INTO `user` (`username`, `fname`, `sname`, `fname_en`, `sname_en`, `title`, `title_en`, `role_id`, `is_admin`, `major_id`, `created_at`, `updated_at`) VALUES
('mentor.somchai', 'สมชาย', 'ใจดี', 'Somchai', 'Jaidee', 'นาย', 'Mr.', 4, 0, 1, NOW(), NOW()),
('mentor.sujitra', 'สุจิตรา', 'รักงาน', 'Sujitra', 'Rakngaan', 'นางสาว', 'Ms.', 4, 0, 2, NOW(), NOW()),
('mentor.wichai', 'วิชัย', 'มั่นคง', 'Wichai', 'Mankhong', 'นาย', 'Mr.', 4, 0, 1, NOW(), NOW()),
('mentor.pranee', 'ปราณี', 'อดทน', 'Pranee', 'Adthon', 'นาง', 'Mrs.', 4, 0, 3, NOW(), NOW()),
('mentor.thanakit', 'ธนกิจ', 'สร้างงาน', 'Thanakit', 'Sangngaan', 'นาย', 'Mr.', 4, 0, 4, NOW(), NOW()),
('mentor.siriporn', 'ศิริพร', 'มีความสุข', 'Siriporn', 'Meekhwamsuk', 'นางสาว', 'Ms.', 4, 0, 2, NOW(), NOW()),
('mentor.kamon', 'กมล', 'ประสบการณ์', 'Kamon', 'Prasopkarn', 'นาย', 'Mr.', 4, 0, 5, NOW(), NOW()),
('mentor.ratana', 'รัตนา', 'สอนงาน', 'Ratana', 'Sonngaan', 'นาง', 'Mrs.', 4, 0, 1, NOW(), NOW()),
('mentor.panya', 'ปัญญา', 'ช่วยเหลือ', 'Panya', 'Chuayleau', 'นาย', 'Mr.', 4, 0, 6, NOW(), NOW()),
('mentor.malee', 'มาลี', 'ดูแล', 'Malee', 'Doolae', 'นาง', 'Mrs.', 4, 0, 3, NOW(), NOW()),
('mentor.surasak', 'สุรศักดิ์', 'พัฒนา', 'Surasak', 'Pattana', 'นาย', 'Mr.', 4, 0, 7, NOW(), NOW()),
('mentor.chanapa', 'ชนาภา', 'แนะนำ', 'Chanapa', 'Naenaam', 'นางสาว', 'Ms.', 4, 0, 4, NOW(), NOW()),
('mentor.manit', 'มนิต', 'ฝึกสอน', 'Manit', 'Fuekson', 'นาย', 'Mr.', 4, 0, 8, NOW(), NOW()),
('mentor.anchalee', 'อัญชลี', 'ให้คำปรึกษา', 'Anchalee', 'Haikhamprueksa', 'นาง', 'Mrs.', 4, 0, 2, NOW(), NOW()),
('mentor.narong', 'ณรงค์', 'มีประสบการณ์', 'Narong', 'Meepraspkarn', 'นาย', 'Mr.', 4, 0, 5, NOW(), NOW()),
('mentor.wanida', 'วนิดา', 'มุ่งมั่น', 'Wanida', 'Mungman', 'นางสาว', 'Ms.', 4, 0, 1, NOW(), NOW()),
('mentor.preecha', 'ประชา', 'เอาใจใส่', 'Preecha', 'Aojaisai', 'นาย', 'Mr.', 4, 0, 3, NOW(), NOW()),
('mentor.niran', 'นิรันดร์', 'เชี่ยวชาญ', 'Niran', 'Chiaochan', 'นาย', 'Mr.', 4, 0, 6, NOW(), NOW()),
('mentor.siriwan', 'ศิริวรรณ', 'สร้างแรงบันดาลใจ', 'Siriwan', 'Sangbandan', 'นาง', 'Mrs.', 4, 0, 4, NOW(), NOW()),
('mentor.vitoon', 'วิทูร', 'นำทาง', 'Vitoon', 'Namthaang', 'นาย', 'Mr.', 4, 0, 8, NOW(), NOW());

-- Step 3: Set academic ranks for some mentors (to show experience levels)
UPDATE `user` SET `acad_rank` = 'ผู้เชี่ยวชาญ', `acad_rank_id` = 1 
WHERE `username` IN ('mentor.somchai', 'mentor.wichai', 'mentor.pranee', 'mentor.surasak', 'mentor.niran');

UPDATE `user` SET `acad_rank` = 'ผู้ชำนาญการ', `acad_rank_id` = 2 
WHERE `username` IN ('mentor.sujitra', 'mentor.thanakit', 'mentor.siriporn', 'mentor.anchalee', 'mentor.siriwan');

UPDATE `user` SET `acad_rank` = 'ผู้ปฏิบัติการ', `acad_rank_id` = 3 
WHERE `username` IN ('mentor.kamon', 'mentor.ratana', 'mentor.panya', 'mentor.malee', 'mentor.wanida');

-- Step 4: Set some mentors as having PhD (for demonstration)
UPDATE `user` SET `phd` = 1 
WHERE `username` IN ('mentor.somchai', 'mentor.pranee', 'mentor.surasak', 'mentor.niran');

-- Step 5: Add some profile pictures (optional - these are just placeholder names)
UPDATE `user` SET `picture` = CONCAT('mentor_', SUBSTRING(`username`, 8), '.jpg')
WHERE `role_id` = 4 AND `username` LIKE 'mentor.%';

-- Display success message
SELECT 'MENTOR role and sample data have been successfully created!' as Status;

-- Show the created mentors
SELECT 
    u.id,
    u.username,
    CONCAT(u.title, ' ', u.fname, ' ', u.sname) as full_name_th,
    CONCAT(u.title_en, ' ', u.fname_en, ' ', u.sname_en) as full_name_en,
    m.major_th as major,
    u.acad_rank,
    CASE WHEN u.phd = 1 THEN 'มี' ELSE 'ไม่มี' END as phd_status,
    r.status as role_name
FROM `user` u
LEFT JOIN `major` m ON u.major_id = m.id
LEFT JOIN `role` r ON u.role_id = r.id
WHERE u.role_id = 4
ORDER BY u.fname;

/*
Summary of created mentors by major:
- Computer Science: 4 mentors
- Engineering: 3 mentors  
- Business Administration: 3 mentors
- Information Technology: 3 mentors
- Marketing: 2 mentors
- Accounting: 2 mentors
- Other majors: 3 mentors

Total: 20 mentor accounts created with various experience levels and backgrounds.

These mentors can be used to:
1. Test the mentor dashboard functionality
2. Assign students to mentors for supervision
3. Demonstrate the mentor workflow in the system
4. Test mentor-specific features and permissions

Login usernames: mentor.somchai, mentor.sujitra, mentor.wichai, etc.
(Passwords would need to be set through your authentication system)
*/