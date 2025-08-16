-- ข้อมูลจำลองสำหรับระบบ Co-op
-- รันคำสั่งเหล่านี้หลังจากได้ import ไฟล์ coop.sql แล้ว

-- ========================================
-- 1. เพิ่มอาจารย์เพิ่มเติม
-- ========================================

INSERT INTO `user` (`username`, `fname`, `sname`, `fname_en`, `sname_en`, `major_id`, `role_id`, `is_admin`, `title`, `title_en`, `acad_rank_id`, `created_at`, `updated_at`) VALUES
-- อาจารย์คนที่ 2
('somying.r', 'สมหญิง', 'รักเรียน', 'Somying', 'Rakrian', 1, 1, 0, 'อ.', 'Lecturer', 1, NOW(), NOW()),

-- อาจารย์คนที่ 3  
('wichai.s', 'วิชาย', 'สอนดี', 'Wichai', 'Sondee', 2, 1, 0, 'ผศ.', 'Asst.Prof.', 2, NOW(), NOW()),

-- อาจารย์คนที่ 4
('pimchan.k', 'พิมพ์ชาน', 'ใจใส', 'Pimchan', 'Jaisai', 1, 1, 0, 'ดร.', 'Dr.', 1, NOW(), NOW()),

-- อาจารย์คนที่ 5
('narong.t', 'ณรงค์', 'เทคโนโลยี', 'Narong', 'Technology', 3, 1, 0, 'ผศ.ดร.', 'Asst.Prof.Dr.', 3, NOW(), NOW());

-- ========================================
-- 2. เพิ่มบริษัทเพิ่มเติม
-- ========================================

INSERT INTO `entrepreneur` (`name_th`, `name_en`, `tel`, `email`, `business`, `employees`, `manager`, `manager_position`, `manager_dept`, `contact`, `contact_position`, `contact_dept`, `contact_tel`, `contact_email`, `address`, `enable`) VALUES
-- บริษัทเทคโนโลยี
('บริษัท ดิจิทัล โซลูชั่น จำกัด', 'Digital Solution Co., Ltd.', '02-345-6789', 'info@digitalsolution.co.th', 'Software Development', 75, 'คุณสมศักดิ์ ดีไซน์', 'CTO', 'ฝ่ายเทคโนโลยี', 'คุณอรุณ โค้ดดิ้ง', 'Lead Developer', 'ฝ่ายพัฒนา', '02-345-6790', 'arun@digitalsolution.co.th', '456 ถนนเทคโนโลยี แขวงซอฟต์แวร์ เขตดิจิทัล กรุงเทพฯ 10110', 1),

-- บริษัทการเงิน
('บริษัท ฟินเทค อินโนเวชั่น จำกัด', 'FinTech Innovation Co., Ltd.', '02-456-7890', 'contact@fintech.co.th', 'Financial Technology', 50, 'คุณสมใจ การเงิน', 'CEO', 'ฝ่ายบริหาร', 'คุณดาวใส ระบบ', 'System Analyst', 'ฝ่าย IT', '02-456-7891', 'daosai@fintech.co.th', '789 ถนนการเงิน แขวงเทคโนโลยี เขตนวัตกรรม กรุงเทพฯ 10120', 1),

-- บริษัทเกม
('บริษัท เกมมิ่ง สตูดิโอ จำกัด', 'Gaming Studio Co., Ltd.', '02-567-8901', 'hello@gamingstudio.co.th', 'Game Development', 40, 'คุณสุขใส เกมส์', 'Creative Director', 'ฝ่ายสร้างสรรค์', 'คุณมีชัย ดีไซน์', 'Game Designer', 'ฝ่ายออกแบบ', '02-567-8902', 'meechai@gamingstudio.co.th', '321 ถนนเกม แขวงสร้างสรรค์ เขตบันเทิง กรุงเทพฯ 10130', 1),

-- บริษัทอีคอมเมิร์ซ
('บริษัท อีคอมเมิร์ซ โซลูชั่น จำกัด', 'E-commerce Solution Co., Ltd.', '02-678-9012', 'support@ecommerce.co.th', 'E-commerce Platform', 60, 'คุณร่วมใจ ขายดี', 'Managing Director', 'ฝ่ายบริหาร', 'คุณขายดี ออนไลน์', 'E-commerce Manager', 'ฝ่ายขาย', '02-678-9013', 'kaidee@ecommerce.co.th', '654 ถนนการค้า แขวงออนไลน์ เขตพาณิชย์ กรุงเทพฯ 10140', 1);

-- ========================================
-- 3. เพิ่มงานเพิ่มเติม
-- ========================================

-- หา entrepreneur_id ที่เพิ่งสร้างใหม่
SET @digital_solution_id = (SELECT id FROM entrepreneur WHERE name_th = 'บริษัท ดิจิทัล โซลูชั่น จำกัด');
SET @fintech_id = (SELECT id FROM entrepreneur WHERE name_th = 'บริษัท ฟินเทค อินโนเวชั่น จำกัด');
SET @gaming_id = (SELECT id FROM entrepreneur WHERE name_th = 'บริษัท เกมมิ่ง สตูดิโอ จำกัด');
SET @ecommerce_id = (SELECT id FROM entrepreneur WHERE name_th = 'บริษัท อีคอมเมิร์ซ โซลูชั่น จำกัด');

INSERT INTO `job` (`name`, `job_des`, `entrepreneur_id`) VALUES
-- งานของบริษัท Digital Solution
('Full Stack Developer', 'พัฒนาเว็บแอปพลิเคชันด้วย React, Node.js และ MySQL', @digital_solution_id),
('Mobile App Developer', 'พัฒนาแอปพลิเคชันมือถือด้วย React Native หรือ Flutter', @digital_solution_id),
('UI/UX Designer', 'ออกแบบ User Interface และ User Experience สำหรับแอปพลิเคชัน', @digital_solution_id),

-- งานของบริษัท FinTech Innovation  
('Backend Developer', 'พัฒนา API และระบบฐานข้อมูลสำหรับระบบการเงิน', @fintech_id),
('Data Analyst', 'วิเคราะห์ข้อมูลทางการเงินและสร้างรายงาน', @fintech_id),
('DevOps Engineer', 'จัดการระบบ Infrastructure และ CI/CD Pipeline', @fintech_id),

-- งานของบริษัท Gaming Studio
('Game Developer', 'พัฒนาเกมด้วย Unity หรือ Unreal Engine', @gaming_id),
('3D Artist', 'สร้างโมเดล 3D และ Animation สำหรับเกม', @gaming_id),
('Game Tester', 'ทดสอบคุณภาพเกมและหาจุดบกพร่อง', @gaming_id),

-- งานของบริษัท E-commerce Solution
('Frontend Developer', 'พัฒนาหน้าเว็บไซต์ E-commerce ด้วย Vue.js หรือ Angular', @ecommerce_id),
('Database Administrator', 'จัดการและบำรุงรักษาฐานข้อมูล', @ecommerce_id),
('Digital Marketing Specialist', 'วางแผนและดำเนินกิจกรรมการตลาดออนไลน์', @ecommerce_id);

-- ========================================
-- 4. เพิ่มนิสิตเพิ่มเติม  
-- ========================================

INSERT INTO `user` (`username`, `fname`, `sname`, `fname_en`, `sname_en`, `major_id`, `role_id`, `is_admin`, `title`, `created_at`, `updated_at`) VALUES
-- นิสิตสาขาวิทยาการคอมพิวเตอร์
('65021001', 'ธนวัฒน์', 'โค้ดดี', 'Thanawat', 'Codedee', 4, 3, 0, 'นาย', NOW(), NOW()),
('65021002', 'สาวิตรี', 'เว็บไซต์', 'Savitree', 'Website', 4, 3, 0, 'นางสาว', NOW(), NOW()),
('65021003', 'ปกรณ์', 'ระบบดี', 'Pakorn', 'Systemdee', 4, 3, 0, 'นาย', NOW(), NOW()),

-- นิสิตสาขาเทคโนโลยีสารสนเทศ
('65022001', 'อัญชลี', 'ดาต้าเบส', 'Anchalee', 'Database', 5, 3, 0, 'นางสาว', NOW(), NOW()),
('65022002', 'วีรชัย', 'เน็ตเวิร์ก', 'Weerachai', 'Network', 5, 3, 0, 'นาย', NOW(), NOW()),
('65022003', 'นันทิยา', 'ซีเคียวริตี้', 'Nantiya', 'Security', 5, 3, 0, 'นางสาว', NOW(), NOW()),

-- นิสิตสาขาวิศวกรรมซอฟต์แวร์
('65023001', 'รัชนก', 'แอปพลิเคชั่น', 'Ratchanok', 'Application', 3, 3, 0, 'นางสาว', NOW(), NOW()),
('65023002', 'ไตรรัตน์', 'เกมมิ่ง', 'Trairat', 'Gaming', 3, 3, 0, 'นาย', NOW(), NOW()),
('65023003', 'ปัทมา', 'ยูไอดีเอ็กซ์', 'Patma', 'UIDX', 3, 3, 0, 'นางสาว', NOW(), NOW());

-- ========================================
-- 5. เพิ่ม Training Records (การมอบหมายนิสิตให้อาจารย์ดูแล)
-- ========================================

-- หาค่า user_id ของอาจารย์และนิสิตที่เพิ่งเพิ่ม
SET @teacher_somying = (SELECT id FROM user WHERE username = 'somying.r' LIMIT 1);
SET @teacher_wichai = (SELECT id FROM user WHERE username = 'wichai.s' LIMIT 1);  
SET @teacher_pimchan = (SELECT id FROM user WHERE username = 'pimchan.k' LIMIT 1);
SET @teacher_narong = (SELECT id FROM user WHERE username = 'narong.t' LIMIT 1);

SET @student1 = (SELECT id FROM user WHERE username = '65021001' LIMIT 1);
SET @student2 = (SELECT id FROM user WHERE username = '65021002' LIMIT 1);
SET @student3 = (SELECT id FROM user WHERE username = '65021003' LIMIT 1);
SET @student4 = (SELECT id FROM user WHERE username = '65022001' LIMIT 1);
SET @student5 = (SELECT id FROM user WHERE username = '65022002' LIMIT 1);
SET @student6 = (SELECT id FROM user WHERE username = '65022003' LIMIT 1);
SET @student7 = (SELECT id FROM user WHERE username = '65023001' LIMIT 1);
SET @student8 = (SELECT id FROM user WHERE username = '65023002' LIMIT 1);
SET @student9 = (SELECT id FROM user WHERE username = '65023003' LIMIT 1);

-- หา job_id ที่เพิ่งสร้างใหม่
SET @job_fullstack = (SELECT id FROM job WHERE name = 'Full Stack Developer' AND entrepreneur_id = @digital_solution_id LIMIT 1);
SET @job_uiux = (SELECT id FROM job WHERE name = 'UI/UX Designer' AND entrepreneur_id = @digital_solution_id LIMIT 1);
SET @job_backend = (SELECT id FROM job WHERE name = 'Backend Developer' AND entrepreneur_id = @fintech_id LIMIT 1);
SET @job_data_analyst = (SELECT id FROM job WHERE name = 'Data Analyst' AND entrepreneur_id = @fintech_id LIMIT 1);
SET @job_devops = (SELECT id FROM job WHERE name = 'DevOps Engineer' AND entrepreneur_id = @fintech_id LIMIT 1);
SET @job_frontend = (SELECT id FROM job WHERE name = 'Frontend Developer' AND entrepreneur_id = @ecommerce_id LIMIT 1);
SET @job_game_dev = (SELECT id FROM job WHERE name = 'Game Developer' AND entrepreneur_id = @gaming_id LIMIT 1);
SET @job_3d_artist = (SELECT id FROM job WHERE name = '3D Artist' AND entrepreneur_id = @gaming_id LIMIT 1);
SET @job_game_tester = (SELECT id FROM job WHERE name = 'Game Tester' AND entrepreneur_id = @gaming_id LIMIT 1);

INSERT INTO `training` (`user_id`, `semester_id`, `job_id`, `teacher_id1`, `teacher_id2`, `startdate`, `enddate`, `address`, `tel`, `email`, `name_mentor`, `position_mentor`, `dept_mentor`, `tel_mentor`, `email_mentor`, `job_position`, `job_des`, `coop`, `status`, `created_at`, `updated_at`) VALUES

-- นิสิตของอาจารย์สมหญิง
(@student1, 2, @job_fullstack, @teacher_somying, NULL, '2024-11-01', '2025-03-31', '456 ถนนเทคโนโลยี แขวงซอฟต์แวร์ เขตดิจิทัล กรุงเทพฯ 10110', '0812345678', 'thanawat.intern@digitalsolution.co.th', 'คุณอรุณ โค้ดดิ้ง', 'Lead Developer', 'ฝ่ายพัฒนา', '02-345-6790', 'arun@digitalsolution.co.th', 'Full Stack Developer Intern', 'พัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js', 1, 1, NOW(), NOW()),

(@student2, 2, @job_uiux, @teacher_somying, @teacher_pimchan, '2024-11-01', '2025-03-31', '456 ถนนเทคโนโลยี แขวงซอฟต์แวร์ เขตดิจิทัล กรุงเทพฯ 10110', '0823456789', 'savitree.intern@digitalsolution.co.th', 'คุณสมศักดิ์ ดีไซน์', 'CTO', 'ฝ่ายเทคโนโลยี', '02-345-6789', 'somsakd@digitalsolution.co.th', 'UI/UX Designer Intern', 'ออกแบบ User Interface และ User Experience', 1, 1, NOW(), NOW()),

-- นิสิตของอาจารย์วิชาย
(@student3, 2, @job_backend, @teacher_wichai, NULL, '2024-11-01', '2025-03-31', '789 ถนนการเงิน แขวงเทคโนโลยี เขตนวัตกรรม กรุงเทพฯ 10120', '0834567890', 'pakorn.intern@fintech.co.th', 'คุณดาวใส ระบบ', 'System Analyst', 'ฝ่าย IT', '02-456-7891', 'daosai@fintech.co.th', 'Backend Developer Intern', 'พัฒนา API และระบบฐานข้อมูล', 1, 1, NOW(), NOW()),

(@student4, 2, @job_data_analyst, @teacher_wichai, NULL, '2024-11-01', '2025-03-31', '789 ถนนการเงิน แขวงเทคโนโลยี เขตนวัตกรรม กรุงเทพฯ 10120', '0845678901', 'anchalee.intern@fintech.co.th', 'คุณสมใจ การเงิน', 'CEO', 'ฝ่ายบริหาร', '02-456-7890', 'somjai@fintech.co.th', 'Data Analyst Intern', 'วิเคราะห์ข้อมูลทางการเงิน', 1, 1, NOW(), NOW()),

-- นิสิตของอาจารย์พิมพ์ชาน
(@student5, 2, @job_devops, @teacher_pimchan, NULL, '2024-11-01', '2025-03-31', '789 ถนนการเงิน แขวงเทคโนโลยี เขตนวัตกรรม กรุงเทพฯ 10120', '0856789012', 'weerachai.intern@fintech.co.th', 'คุณดาวใส ระบบ', 'System Analyst', 'ฝ่าย IT', '02-456-7891', 'daosai@fintech.co.th', 'DevOps Engineer Intern', 'จัดการระบบ Infrastructure', 1, 1, NOW(), NOW()),

(@student6, 2, @job_frontend, @teacher_pimchan, NULL, '2024-11-01', '2025-03-31', '654 ถนนการค้า แขวงออนไลน์ เขตพาณิชย์ กรุงเทพฯ 10140', '0867890123', 'nantiya.intern@ecommerce.co.th', 'คุณขายดี ออนไลน์', 'E-commerce Manager', 'ฝ่ายขาย', '02-678-9013', 'kaidee@ecommerce.co.th', 'Frontend Developer Intern', 'พัฒนาหน้าเว็บไซต์ E-commerce', 1, 1, NOW(), NOW()),

-- นิสิตของอาจารย์ณรงค์
(@student7, 2, @job_game_dev, @teacher_narong, NULL, '2024-11-01', '2025-03-31', '321 ถนนเกม แขวงสร้างสรรค์ เขตบันเทิง กรุงเทพฯ 10130', '0878901234', 'ratchanok.intern@gamingstudio.co.th', 'คุณมีชัย ดีไซน์', 'Game Designer', 'ฝ่ายออกแบบ', '02-567-8902', 'meechai@gamingstudio.co.th', 'Game Developer Intern', 'พัฒนาเกมด้วย Unity', 1, 1, NOW(), NOW()),

(@student8, 2, @job_3d_artist, @teacher_narong, @teacher_wichai, '2024-11-01', '2025-03-31', '321 ถนนเกม แขวงสร้างสรรค์ เขตบันเทิง กรุงเทพฯ 10130', '0889012345', 'trairat.intern@gamingstudio.co.th', 'คุณสุขใส เกมส์', 'Creative Director', 'ฝ่ายสร้างสรรค์', '02-567-8901', 'sukjai@gamingstudio.co.th', '3D Artist Intern', 'สร้างโมเดล 3D และ Animation', 1, 1, NOW(), NOW()),

(@student9, 2, @job_game_tester, @teacher_narong, NULL, '2024-11-01', '2025-03-31', '321 ถนนเกม แขวงสร้างสรรค์ เขตบันเทิง กรุงเทพฯ 10130', '0890123456', 'patma.intern@gamingstudio.co.th', 'คุณมีชัย ดีไซน์', 'Game Designer', 'ฝ่ายออกแบบ', '02-567-8902', 'meechai@gamingstudio.co.th', 'Game Tester Intern', 'ทดสอบคุณภาพเกม', 1, 1, NOW(), NOW());

-- ========================================
-- 6. เพิ่มรายงานประจำสัปดาห์ตัวอย่าง
-- ========================================

-- รายงานของนิสิต ธนวัฒน์ (student1)
INSERT INTO `weekly` (`week`, `startdate`, `enddate`, `training_id`, `job`, `problem`, `fixed`, `course_fixed`, `exp`, `suggestion`, `department`, `status`, `created_at`, `updated_at`) VALUES
(1, '2024-11-01', '2024-11-07', (SELECT id FROM training WHERE user_id = @student1 LIMIT 1), 'เรียนรู้ React.js พื้นฐานและโครงสร้างโปรเจกต์', 'ยังไม่คุ้นเคยกับ JSX และ Component lifecycle', 'ศึกษาจาก documentation และทำ tutorial', 'ใช้ความรู้จากวิชา Web Programming', 'เข้าใจ React Components และ Props', 'ควรมี workshop เพิ่มเติมเกี่ยวกับ React', 'ฝ่ายพัฒนา', 'approved', NOW(), NOW()),

(2, '2024-11-08', '2024-11-14', (SELECT id FROM training WHERE user_id = @student1 LIMIT 1), 'พัฒนา Login และ Registration component', 'มีปัญหาการจัดการ state และ form validation', 'ใช้ React Hook Form และ Yup สำหรับ validation', 'ประยุกต์จากวิชา Database และ Security', 'เรียนรู้ Form handling และ State management', 'ควรมีการอบรม Security best practices', 'ฝ่ายพัฒนา', 'pending', NOW(), NOW());

-- รายงานของนิสิต สาวิตรี (student2)  
INSERT INTO `weekly` (`week`, `startdate`, `enddate`, `training_id`, `job`, `problem`, `fixed`, `course_fixed`, `exp`, `suggestion`, `department`, `status`, `created_at`, `updated_at`) VALUES
(1, '2024-11-01', '2024-11-07', (SELECT id FROM training WHERE user_id = @student2 LIMIT 1), 'ศึกษา Design System และ Figma', 'ยังไม่เคยใช้ Figma มาก่อน', 'ดู tutorial และฝึกใช้ Figma', 'ใช้หลักการจากวิชา HCI', 'เรียนรู้การใช้ Figma และ Design principles', 'ควรมี Design workshop', 'ฝ่ายออกแบบ', 'approved', NOW(), NOW());

-- แสดงข้อความเมื่อเสร็จสิ้น
SELECT 'ข้อมูลจำลองได้ถูกเพิ่มเข้าฐานข้อมูลเรียบร้อยแล้ว!' AS message;