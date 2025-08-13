-- Mock Data สำหรับทดสอบระบบอาจารย์
-- เพิ่มข้อมูล role และ faculty, major ก่อน

-- Insert roles
INSERT INTO `role` (`id`, `status`, `status_en`) VALUES
(1, 'อาจารย์', 'TEACHER'),
(2, 'เจ้าหน้าที่', 'OFFICER'), 
(3, 'นิสิต', 'STUDENT');

-- Insert faculty
INSERT INTO `faculty` (`id`, `faculty_en`, `faculty_th`) VALUES
(1, 'Information and Communication Technology', 'เทคโนโลยีสารสนเทศและการสื่อสาร'),
(2, 'Engineering', 'วิศวกรรมศาสตร์'),
(3, 'Medicine', 'แพทยศาสตร์');

-- Insert major
INSERT INTO `major` (`id`, `major_en`, `major_th`, `faculty_id`, `degree`, `under_major_id`) VALUES
(1, 'Computer Science', 'วิทยาการคอมพิวเตอร์', 1, 'ปริญญาตรี', 0),
(2, 'Information Technology', 'เทคโนโลยีสารสนเทศ', 1, 'ปริญญาตรี', 0),
(3, 'Software Engineering', 'วิศวกรรมซอฟต์แวร์', 2, 'ปริญญาตรี', 0);

-- Insert mock teacher data
INSERT INTO `user` (
    `id`, `username`, `title`, `fname`, `sname`, `fname_en`, `sname_en`, 
    `major_id`, `role_id`, `is_admin`, `created_at`, `updated_at`
) VALUES
-- อาจารย์คนที่ 1
(100, 'teacher001', 'ผศ.ดร.', 'สมชาย', 'ใจดี', 'Somchai', 'Jaidee', 1, 1, 0, NOW(), NOW()),

-- อาจารย์คนที่ 2  
(101, 'teacher002', 'อ.', 'สมหญิง', 'รักเรียน', 'Somying', 'Rakrian', 1, 1, 0, NOW(), NOW()),

-- อาจารย์คนที่ 3
(102, 'teacher003', 'ผศ.', 'วิชาย', 'สอนดี', 'Wichai', 'Sondee', 2, 1, 0, NOW(), NOW());

-- Insert mock student data (นิสิตที่อาจารย์ดูแล)
INSERT INTO `user` (
    `id`, `username`, `title`, `fname`, `sname`, `fname_en`, `sname_en`, 
    `major_id`, `role_id`, `is_admin`, `created_at`, `updated_at`
) VALUES
-- นิสิต 1
(200, '64123001', 'นาย', 'ธนพล', 'เรียนดี', 'Thanapol', 'Riandee', 1, 3, 0, NOW(), NOW()),

-- นิสิต 2
(201, '64123002', 'นางสาว', 'สุดา', 'ขยัน', 'Suda', 'Kayan', 1, 3, 0, NOW(), NOW()),

-- นิสิต 3
(202, '64123003', 'นาย', 'วิทย์', 'ปัญญา', 'Wit', 'Punya', 2, 3, 0, NOW(), NOW());

-- Insert mock entrepreneur data
INSERT INTO `entrepreneur` (
    `id`, `name_th`, `name_en`, `tel`, `email`, `business`, `employees`,
    `manager`, `manager_position`, `manager_dept`,
    `contact`, `contact_position`, `contact_dept`, `contact_tel`, `contact_email`,
    `address`, `enable`
) VALUES
(1, 'บริษัท เทคโนโลยี จำกัด', 'Technology Co., Ltd.', '02-123-4567', 'info@tech.co.th', 'Software Development', 50,
 'คุณสมศักดิ์ ใหญ่ใจ', 'ผู้จัดการใหญ่', 'ฝ่ายบริหาร',
 'คุณสมใจ ดีมาก', 'หัวหน้าโครงการ', 'ฝ่ายพัฒนา', '02-123-4568', 'somjai@tech.co.th',
 '123 ถนนเทคโนโลยี แขวงนวัตกรรม เขตดิจิทัล กรุงเทพฯ 10100', 1),

(2, 'บริษัท ซอฟต์แวร์ จำกัด', 'Software Co., Ltd.', '02-234-5678', 'contact@soft.co.th', 'Web Development', 30,
 'คุณสมหญิง ฉลาด', 'ผู้อำนวยการ', 'ฝ่ายบริหาร',
 'คุณสมพงษ์ เก่ง', 'หัวหน้าทีม', 'ฝ่ายพัฒนา', '02-234-5679', 'sompong@soft.co.th',
 '456 ถนนซอฟต์แวร์ แขวงโปรแกรม เขตไอที กรุงเทพฯ 10200', 1);

-- Insert mock job data
INSERT INTO `job` (`id`, `name`, `job_des`, `entrepreneur_id`) VALUES
(1, 'นักพัฒนาเว็บไซต์', 'พัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js', 1),
(2, 'นักวิเคราะห์ระบบ', 'วิเคราะห์และออกแบบระบบสารสนเทศ', 2),
(3, 'นักทดสอบซอฟต์แวร์', 'ทดสอบคุณภาพซอฟต์แวร์และเขียน Test Case', 1);

-- Insert mock semester data
INSERT INTO `semester` (`id`, `semester`, `year`, `is_current`) VALUES
(1, 1, 2567, 1),
(2, 2, 2566, 0);

-- Insert mock training data (เชื่อมนิสิตกับอาจารย์)
INSERT INTO `training` (
    `id`, `user_id`, `semester_id`, `job_id`, `teacher_id1`, `teacher_id2`,
    `startdate`, `enddate`, `coop`, `status`,
    `address`, `tel`, `email`,
    `name_mentor`, `position_mentor`, `dept_mentor`, `tel_mentor`, `email_mentor`,
    `job_position`, `job_des`
) VALUES
-- นิสิต 1 ดูแลโดยอาจารย์ 100
(1, 200, 1, 1, 100, NULL, '2024-06-01', '2024-10-31', 1, 1,
 '123 ถนนเทคโนโลยี แขวงนวัตกรรม เขตดิจิทัล กรุงเทพฯ 10100', '02-123-4567', 'info@tech.co.th',
 'คุณสมใจ ดีมาก', 'หัวหน้าโครงการ', 'ฝ่ายพัฒนา', '02-123-4568', 'somjai@tech.co.th',
 'นักพัฒนาเว็บไซต์', 'พัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js'),

-- นิสิต 2 ดูแลโดยอาจารย์ 100
(2, 201, 1, 2, 100, 101, '2024-06-15', '2024-11-15', 1, 1,
 '456 ถนนซอฟต์แวร์ แขวงโปรแกรม เขตไอที กรุงเทพฯ 10200', '02-234-5678', 'contact@soft.co.th',
 'คุณสมพงษ์ เก่ง', 'หัวหน้าทีม', 'ฝ่ายพัฒนา', '02-234-5679', 'sompong@soft.co.th',
 'นักวิเคราะห์ระบบ', 'วิเคราะห์และออกแบบระบบสารสนเทศ'),

-- นิสิต 3 ดูแลโดยอาจารย์ 101
(3, 202, 1, 3, 101, NULL, '2024-07-01', '2024-11-30', 1, 1,
 '123 ถนนเทคโนโลยี แขวงนวัตกรรม เขตดิจิทัล กรุงเทพฯ 10100', '02-123-4567', 'info@tech.co.th',
 'คุณสมใจ ดีมาก', 'หัวหน้าโครงการ', 'ฝ่ายพัฒนา', '02-123-4568', 'somjai@tech.co.th',
 'นักทดสอบซอฟต์แวร์', 'ทดสอบคุณภาพซอฟต์แวร์และเขียน Test Case');

-- Insert mock weekly reports
INSERT INTO `weekly` (
    `id`, `week`, `startdate`, `enddate`, `training_id`, 
    `job`, `problem`, `fixed`, `course_fixed`, `exp`, `suggestion`, 
    `department`, `status`, `created_at`, `updated_at`
) VALUES
-- รายงานของนิสิต 1 (training_id = 1)
(1, 1, '2024-06-01', '2024-06-07', 1,
 'เรียนรู้พื้นฐาน React และทำความเข้าใจโครงสร้างโปรเจกต์',
 'ยังไม่คุ้นเคยกับ JSX syntax',
 'อ่าน documentation และดู tutorial เพิ่มเติม',
 'ใช้ความรู้จากวิชา Web Programming',
 'ได้เรียนรู้วิธีการใช้ React components',
 'ควรมีการอบรมพื้นฐานก่อนเริ่มงาน',
 'ฝ่ายพัฒนา', 'pending', NOW(), NOW()),

(2, 2, '2024-06-08', '2024-06-14', 1,
 'พัฒนา component สำหรับแสดงข้อมูลผู้ใช้',
 'มีปัญหาการจัดการ state',
 'ใช้ useState และ useEffect hooks',
 'ประยุกต์ใช้ความรู้จากวิชา React Programming',
 'เข้าใจ React hooks มากขึ้น',
 'ควรมี code review เป็นประจำ',
 'ฝ่ายพัฒนา', 'approved', NOW(), NOW()),

-- รายงานของนิสิต 2 (training_id = 2)
(3, 1, '2024-06-15', '2024-06-21', 2,
 'วิเคราะห์ความต้องการระบบจัดการสินค้า',
 'การสื่อสารกับผู้ใช้ยังไม่ชัดเจน',
 'จัดทำแบบสอบถามและสัมภาษณ์เพิ่ม',
 'ใช้เทคนิคจากวิชา System Analysis',
 'ได้เรียนรู้วิธีการเก็บ requirement',
 'ควรมีเทมเพลตสำหรับการสัมภาษณ์',
 'ฝ่ายวิเคราะห์', 'pending', NOW(), NOW());

-- เพิ่มข้อมูล officer สำหรับทดสอบ
INSERT INTO `user` (
    `id`, `username`, `title`, `fname`, `sname`, `fname_en`, `sname_en`, 
    `major_id`, `role_id`, `is_admin`, `created_at`, `updated_at`
) VALUES
-- เจ้าหน้าที่
(300, 'officer001', 'นาย', 'สมเกียรติ', 'จัดการ', 'Somkiat', 'Judkan', 1, 2, 1, NOW(), NOW());