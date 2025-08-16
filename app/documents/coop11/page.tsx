"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Button,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Save,
  Cancel,
  Description,
  Work,
  Assignment,
} from "@mui/icons-material";
import Link from "next/link";

const Coop11Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // ข้อมูลรายละเอียดงาน
  const [jobPosition, setJobPosition] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [reportTitleThai, setReportTitleThai] = useState<string>("");
  const [reportTitleEnglish, setReportTitleEnglish] = useState<string>("");
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    const userData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
  }, [router]);

  // ดึงข้อมูลภาคการศึกษาปัจจุบัน
  useEffect(() => {
    const fetchCurrentSemester = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/semester/current`);
        if (!response.ok) throw new Error("Failed to fetch current semester");
        const data = await response.json();
        setCurrentSemester(data);
      } catch (error) {
        console.error("Error fetching current semester:", error);
      }
    };
    fetchCurrentSemester();
  }, []);

  // ดึงข้อมูล training ของ user ปัจจุบัน
  useEffect(() => {
    if (user && currentSemester) {
      const fetchTraining = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/training/user/${user.id}-${currentSemester.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setTraining(data[0]);
              // ตั้งค่าเริ่มต้น
              setJobPosition(data[0].job?.name || "");
              
              const defaultTitleThai = `รายงานการปฏิบัติงานสหกิจศึกษา ณ ${data[0].job?.entrepreneur?.nameTh || 'สถานประกอบการ'}`;
              const defaultTitleEnglish = `Work Term Report at ${data[0].job?.entrepreneur?.nameEn || data[0].job?.entrepreneur?.nameTh || 'Company'}`;
              
              setReportTitleThai(defaultTitleThai);
              setReportTitleEnglish(defaultTitleEnglish);
            }
          }
        } catch (error) {
          console.error("Error fetching training data:", error);
        }
      };
      fetchTraining();
    }
  }, [user, currentSemester]);

  // ดึงข้อมูล COOP-11 ที่เคยบันทึกไว้
  useEffect(() => {
    if (user) {
      const fetchExistingData = async () => {
        try {
          const response = await fetch(`/api/coop11-details?userId=${user.id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.documents && result.documents.length > 0) {
              const existingData = result.documents[0];
              console.log("Found existing COOP-11 data:", existingData);
              
              setIsEditing(true);
              
              // โหลดข้อมูลเดิมในฟอร์ม
              setJobPosition(existingData.jobPosition || "");
              setReportTitleThai(existingData.reportTitleThai || "");
              setReportTitleEnglish(existingData.reportTitleEnglish || "");
              setJobDescription(existingData.jobDescription || "");
              setLearningOutcomes(existingData.learningOutcomes || "");
              setSoftwareTools(existingData.softwareTools || "");
              setSkillsGained(existingData.skillsGained || "");
              setWorkChallenges(existingData.workChallenges || "");
              setProblems(existingData.problems || "");
              setSolutions(existingData.solutions || "");
              setCompanyBenefits(existingData.companyBenefits || "");
              setSuggestions(existingData.suggestions || "");
            }
          }
        } catch (error) {
          console.error("Error fetching existing COOP-11 data:", error);
        }
      };
      fetchExistingData();
    }
  }, [user]);

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!jobPosition.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกตำแหน่งงาน',
        severity: 'error'
      });
      return;
    }

    if (!jobDescription.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกรายละเอียดเนื้องานที่ปฏิบัติ',
        severity: 'error'
      });
      return;
    }

    if (!reportTitleThai.trim() || !reportTitleEnglish.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกหัวข้อรายงานทั้งภาษาไทยและภาษาอังกฤษ',
        severity: 'error'
      });
      return;
    }

    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      trainingId: training?.id,
      jobPosition,
      jobDescription,
      reportTitleThai,
      reportTitleEnglish,
      status: 'submitted'
    };

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/jobdetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save job details');
      }

      // แสดงข้อความสำเร็จ
      setSnackbar({
        open: true,
        message: 'บันทึกรายละเอียดการปฏิบัติงานเรียบร้อยแล้ว ข้อมูลจะถูกนำไปจัดทำคู่มือสรุปผลการปฏิบัติงานประจำปีการศึกษา',
        severity: 'success'
      });
      
      // รอ 3 วินาทีแล้วกลับไปหน้าหลัก
      setTimeout(() => {
        router.push("/");
      }, 3000);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        severity: 'error'
      });
    }
  };

  // ฟังก์ชันยกเลิก
  const handleCancel = () => {
    if (confirm("คุณต้องการยกเลิกการกรอกแบบฟอร์มหรือไม่?")) {
      router.back();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <IconButton color="inherit" onClick={() => router.push("/")}>
            <Home />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            แบบฟอร์มรายละเอียดการปฏิบัติงานสหกิจศึกษา
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Link href="/documents" style={{ textDecoration: 'none', color: 'inherit' }}>เอกสารสหกิจศึกษา</Link>
          <Typography color="text.primary">รายละเอียดการปฏิบัติงาน</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom color="primary.main">
              โครงการสหกิจศึกษามหาวิทยาลัยพะเยา
            </Typography>
            <Typography variant="h5" gutterBottom>
              แบบฟอร์มแจ้งรายละเอียดเกี่ยวกับการปฏิบัติงานสหกิจศึกษา
            </Typography>
            <Typography variant="h6" color="textSecondary">
              มหาวิทยาลัยพะเยา
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
              UP_Co-op 11 | (ผู้ให้ข้อมูล: นิสิต หลังกลับจากสถานประกอบการ) {isEditing ? '(แก้ไขข้อมูล)' : '(บันทึกใหม่)'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* คำชี้แจง */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              คำชี้แจง:
            </Typography>
            <Typography variant="body2">
              คณะ/วิทยาลัย ต้องการข้อมูลเกี่ยวกับการปฏิบัติงานของนิสิต 
              เพื่อจัดทำเป็นคู่มือสรุปผลการปฏิบัติงานประจำปีการศึกษา 
              และนำส่งคณะ/วิทยาลัย ทันทีที่กลับจากสถานประกอบการ
            </Typography>
          </Alert>

          {/* เรียนคณบดี */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              เรียน คณบดีคณะ {user.major?.faculty?.facultyTh}
            </Typography>
          </Box>

          {/* ข้อมูลนิสิต */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              ข้อมูลนิสิต
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ชื่อ-นามสกุล"
                  value={`${user.fname} ${user.sname}`}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="รหัสนิสิต"
                  value={user.username}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="หลักสูตร"
                  value={user.major?.degree || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="สาขาวิชา"
                  value={user.major?.majorTh || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลสถานประกอบการ */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              ข้อมูลสถานที่ปฏิบัติงาน
            </Typography>
            {training && training.job && training.job.entrepreneur ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="ปฏิบัติงานสหกิจศึกษา ณ สถานประกอบการ"
                    value={training.job.entrepreneur.nameTh || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ตำแหน่งงาน *"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    helperText="ระบุตำแหน่งงานที่ได้รับมอบหมายในการปฏิบัติงาน"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ระยะเวลาการปฏิบัติงาน"
                    value={training.startdate && training.enddate 
                      ? `${new Date(training.startdate).toLocaleDateString('th-TH')} - ${new Date(training.enddate).toLocaleDateString('th-TH')}`
                      : ""
                    }
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Alert severity="warning">
                ไม่พบข้อมูลการฝึกงาน กรุณาลงทะเบียนการฝึกงานก่อน (Coop-01)
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* รายละเอียดเนื้องานที่ปฏิบัติ */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              รายละเอียดเนื้องานที่ปฏิบัติ (Job Description)
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>คำแนะนำ:</strong> นิสิตควรขอคำปรึกษาจากอาจารย์ที่ปรึกษาสหกิจศึกษาก่อนเขียน 
                เพื่อความถูกต้องทางด้านวิชาการ หรือดูตัวอย่างประกอบ
              </Typography>
            </Alert>
            
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary.main">
                  รายละเอียดเนื้องานที่ปฏิบัติ *
                </Typography>
                <TextField
                  placeholder="กรุณาอธิบายรายละเอียดของงานที่ได้ปฏิบัติในสถานประกอบการ เช่น:
• หน้าที่และความรับผิดชอบหลัก
• กระบวนการทำงานที่เกี่ยวข้อง  
• เครื่องมือและเทคโนโลยีที่ใช้
• การทำงานร่วมกับทีมหรือแผนกต่างๆ
• โปรเจคหรืองานพิเศษที่ได้รับมอบหมาย
• ความรู้และทักษะที่ใช้ในการทำงาน"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={15}
                  required
                  helperText="กรุณาเขียนรายละเอียดให้ชัดเจนและครอบคลุม เพื่อใช้ในการจัดทำคู่มือสรุปผลการปฏิบัติงาน"
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* หัวข้อรายงาน */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              หัวข้อรายงาน (Report Topic)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="หัวข้อรายงาน (ภาษาไทย) *"
                  value={reportTitleThai}
                  onChange={(e) => setReportTitleThai(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  required
                  helperText="ระบุหัวข้อรายงานภาษาไทยที่สะท้อนถึงงานที่ได้ปฏิบัติ"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="หัวข้อรายงาน (ภาษาอังกฤษ) *"
                  value={reportTitleEnglish}
                  onChange={(e) => setReportTitleEnglish(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  required
                  helperText="ระบุหัวข้อรายงานภาษาอังกฤษที่สอดคล้องกับหัวข้อภาษาไทย"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ข้อมูลสำหรับเจ้าหน้าที่ */}
          <Card elevation={2} sx={{ mb: 4, bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                สำหรับเจ้าหน้าที่สหกิจศึกษา (Co-op staff only)
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                  ลงนามรับเอกสาร: ____________________
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  วันที่: ____________________
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* คำแนะนำเพิ่มเติม */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2">
              <strong>หมายเหตุ:</strong> ข้อมูลที่กรอกในแบบฟอร์มนี้จะถูกนำไปใช้ในการจัดทำคู่มือสรุปผลการปฏิบัติงาน
              ประจำปีการศึกษา กรุณากรอกข้อมูลให้ถูกต้อง ครบถ้วน และมีรายละเอียดที่เพียงพอ
            </Typography>
          </Alert>

          {/* ปุ่มบันทึกและยกเลิก */}
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            mt={4}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
              size="large"
              disabled={!jobPosition.trim() || !jobDescription.trim() || !reportTitleThai.trim() || !reportTitleEnglish.trim()}
            >
              {isEditing ? 'อัพเดทรายละเอียดการปฏิบัติงาน' : 'บันทึกรายละเอียดการปฏิบัติงาน'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancel}
              size="large"
            >
              ยกเลิก
            </Button>
          </Box>

          {/* สรุปข้อมูล */}
          <Box 
            mt={4} 
            p={2} 
            bgcolor="success.light" 
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="body2" color="success.contrastText">
              <Assignment sx={{ verticalAlign: 'middle', mr: 1 }} />
              แบบฟอร์มรายละเอียดการปฏิบัติงานสหกิจศึกษา | 
              นิสิต: <strong>{user.fname} {user.sname}</strong> | 
              สถานประกอบการ: <strong>{training?.job?.entrepreneur?.nameTh || 'ไม่ระบุ'}</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Coop11Page;