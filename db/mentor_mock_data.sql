-- Mock data for mentor users
-- This script creates mentor users with role_id = 4 (MENTOR)

-- Insert mentor users
INSERT INTO `user` (`username`, `fname`, `sname`, `fname_en`, `sname_en`, `title`, `title_en`, `role_id`, `is_admin`, `major_id`, `created_at`, `updated_at`) VALUES
('mentor.somchai', 'สมชาย', 'ใจดี', 'Somchai', 'Jaidee', 'นาย', 'Mr.', 4, 0, 1, NOW(), NOW()),
('mentor.sujitra', 'สุจิตรา', 'รักงาน', 'Sujitra', 'Rakngaan', 'นางสาว', 'Ms.', 4, 0, 2, NOW(), NOW()),
('mentor.wichai', 'วิชัย', 'มั่นคง', 'Wichai', 'Mankhong', 'นาย', 'Mr.', 4, 0, 1, NOW(), NOW()),
('mentor.pranee', 'ปราณี', 'อดทน', 'Pranee', 'Adthon', 'นาง', 'Mrs.', 4, 0, 3, NOW(), NOW()),
('mentor.thanakit', 'ธนกิจ', 'สร้างงาน', 'Thanakit', 'Sangngaan', 'นาย', 'Mr.', 4, 0, 4, NOW(), NOW()),
('mentor.siriporn', 'ศิริพร', 'มีความสุข', 'Siriporn', 'Meekhwamsu k', 'นางสาว', 'Ms.', 4, 0, 2, NOW(), NOW()),
('mentor.kamon', 'กมล', 'ประสบการณ์', 'Kamon', 'Prasopkarn', 'นาย', 'Mr.', 4, 0, 5, NOW(), NOW()),
('mentor.ratana', 'รัตนา', 'สอนงาน', 'Ratana', 'Sonngaan', 'นาง', 'Mrs.', 4, 0, 1, NOW(), NOW()),
('mentor.panya', 'ปัญญา', 'ช่วยเหลือ', 'Panya', 'Chuayleau', 'นาย', 'Mr.', 4, 0, 6, NOW(), NOW()),
('mentor.malee', 'มาลี', 'ดูแล', 'Malee', 'Doolae', 'นาง', 'Mrs.', 4, 0, 3, NOW(), NOW()),
('mentor.surasak', 'สุรศักดิ์', 'พัฒนา', 'Surasak', 'Pattana', 'นาย', 'Mr.', 4, 0, 7, NOW(), NOW()),
('mentor.chanapa', 'ชนาภา', 'แนะนำ', 'Chanapa', 'Naenaam', 'นางสาว', 'Ms.', 4, 0, 4, NOW(), NOW()),
('mentor.manit', 'มนิต', 'ฝึกสอน', 'Manit', 'Fuekson', 'นาย', 'Mr.', 4, 0, 8, NOW(), NOW()),
('mentor.anchalee', 'อัญชลี', 'ให้คำปรึกษา', 'Anchalee', 'Haikhamprueksa', 'นาง', 'Mrs.', 4, 0, 2, NOW(), NOW()),
('mentor.narong', 'ณรงค์', 'มีประสบการณ์', 'Narong', 'Meepraso pkarn', 'นาย', 'Mr.', 4, 0, 5, NOW(), NOW());

-- Add some additional data for demonstration
-- Update user photos (optional - can be NULL)
UPDATE `user` SET `picture` = '1.mentor001.jpg' WHERE `username` = 'mentor.somchai';
UPDATE `user` SET `picture` = '1.mentor002.jpg' WHERE `username` = 'mentor.sujitra';
UPDATE `user` SET `picture` = '1.mentor003.jpg' WHERE `username` = 'mentor.wichai';

-- Create some sample academic ranks if needed (these users might have experience)
UPDATE `user` SET `acad_rank` = 'ผู้เชี่ยวชาญ', `acad_rank_id` = 1 WHERE `username` IN ('mentor.somchai', 'mentor.wichai', 'mentor.pranee');
UPDATE `user` SET `acad_rank` = 'ผู้ชำนาญการ', `acad_rank_id` = 2 WHERE `username` IN ('mentor.sujitra', 'mentor.thanakit', 'mentor.siriporn');
UPDATE `user` SET `acad_rank` = 'ผู้ปฏิบัติการ', `acad_rank_id` = 3 WHERE `username` IN ('mentor.kamon', 'mentor.ratana', 'mentor.panya');

-- Sample comments about their expertise
-- (This would typically be in a separate table, but for demo purposes)

/*
Additional information about the mentors:

1. สมชาย ใจดี (Somchai Jaidee) - คอมพิวเตอร์ - ผู้เชี่ยวชาญด้านการพัฒนาเว็บไซต์
2. สุจิตรา รักงาน (Sujitra Rakngaan) - วิศวกรรม - ผู้ชำนาญการด้านระบบเครือข่าย
3. วิชัย มั่นคง (Wichai Mankhong) - คอมพิวเตอร์ - ผู้เชี่ยวชาญด้านฐานข้อมูล
4. ปราณี อดทน (Pranee Adthon) - บริหารธุรกิจ - ผู้เชี่ยวชาญด้านการจัดการโครงการ
5. ธนกิจ สร้างงาน (Thanakit Sangngaan) - เทคโนโลยีสารสนเทศ - ผู้ชำนาญการด้าน Mobile App
6. ศิริพร มีความสุข (Siriporn Meekhwamsuk) - วิศวกรรม - ผู้ชำนาญการด้านระบบอัตโนมัติ
7. กมล ประสบการณ์ (Kamon Prasopkarn) - การตลาด - ผู้ปฏิบัติการด้านดิจิทัลมาร์เก็ตติ้ง
8. รัตนา สอนงาน (Ratana Sonngaan) - คอมพิวเตอร์ - ผู้ปฏิบัติการด้านการออกแบบ UI/UX
9. ปัญญา ช่วยเหลือ (Panya Chuayleau) - บัญชี - ผู้ปฏิบัติการด้านระบบบัญชี
10. มาลี ดูแล (Malee Doolae) - บริหารธุรกิจ - ผู้ปฏิบัติการด้านทรัพยากรบุคคล

เป็นต้น...
*/