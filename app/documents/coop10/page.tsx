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
  CheckCircle,
  Description,
} from "@mui/icons-material";
import Link from "next/link";

const Coop10Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  
  // ข้อมูลรายงาน
  const [reportTitleThai, setReportTitleThai] = useState<string>("");
  const [reportTitleEnglish, setReportTitleEnglish] = useState<string>("");
  const [submissionDate, setSubmissionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
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
              // ตั้งชื่อรายงานเริ่มต้น
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

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!reportTitleThai.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกหัวข้อรายงานภาษาไทย',
        severity: 'error'
      });
      return;
    }

    if (!reportTitleEnglish.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกหัวข้อรายงานภาษาอังกฤษ',
        severity: 'error'
      });
      return;
    }

    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      trainingId: training?.id,
      reportTitleThai,
      reportTitleEnglish,
      submissionDate,
      studentSignatureDate: new Date().toISOString(),
      advisorApprovalStatus: 'pending' // รออาจารย์อนุมัติ
    };

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/reportsubmission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save report submission');
      }

      // แสดงข้อความสำเร็จ
      setSnackbar({
        open: true,
        message: 'บันทึกการยืนยันส่งรายงานเรียบร้อยแล้ว รอการอนุมัติจากอาจารย์ที่ปรึกษา',
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
            แบบฟอร์มยืนยันส่งรายงานการปฏิบัติงาน
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Link href="/documents" style={{ textDecoration: 'none', color: 'inherit' }}>เอกสารสหกิจศึกษา</Link>
          <Typography color="text.primary">ยืนยันส่งรายงาน</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom color="primary.main">
              โครงการสหกิจศึกษามหาวิทยาลัยพะเยา
            </Typography>
            <Typography variant="h5" gutterBottom>
              แบบฟอร์มแจ้งยืนยันส่งรายงานการปฏิบัติงานนิสิตสหกิจศึกษา
            </Typography>
            <Typography variant="h6" color="textSecondary">
              มหาวิทยาลัยพะเยา
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
              UP_Co-op 10
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* คำชี้แจง */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              คำชี้แจง:
            </Typography>
            <Typography variant="body2">
              ขอให้นิสิตเขียนแบบแจ้งยืนยันการส่งรายงานการปฏิบัติงาน (Work Term Report) 
              และนำส่งอาจารย์ที่ปรึกษาสหกิจศึกษาของสาขาวิชาลงนามก่อนการเข้าสอบการสัมมนาสหกิจศึกษา 
              เพื่อรับรองว่านิสิตได้ส่งรายงานเป็นที่เรียบร้อยแล้ว
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
              สถานที่ปฏิบัติงานสหกิจศึกษา
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
                    label="ตำแหน่งงาน"
                    value={training.job.name || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
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

          {/* ข้อมูลรายงาน */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              รายละเอียดรายงานการปฏิบัติงานสหกิจศึกษา (Work Term Report)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="หัวข้อเรื่อง (ภาษาไทย) *"
                  value={reportTitleThai}
                  onChange={(e) => setReportTitleThai(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  required
                  helperText="กรุณาระบุหัวข้อรายงานภาษาไทยที่ชัดเจนและสอดคล้องกับงานที่ปฏิบัติ"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="หัวข้อเรื่อง (ภาษาอังกฤษ) *"
                  value={reportTitleEnglish}
                  onChange={(e) => setReportTitleEnglish(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  required
                  helperText="กรุณาระบุหัวข้อรายงานภาษาอังกฤษที่สอดคล้องกับหัวข้อภาษาไทย"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="วันที่ยื่นรายงาน"
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* การยืนยันและลายเซ็น */}
          <Card elevation={2} sx={{ mb: 4, bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                การยืนยัน
              </Typography>
              <Typography variant="body1" gutterBottom>
                ใคร่ขอเรียนแจ้งว่าได้ส่ง <strong>รายงานการปฏิบัติงานสหกิจศึกษา (Work Term Report)</strong>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic' }}>
                หัวข้อเรื่อง: "{reportTitleThai || '[รอการกรอกข้อมูล]'}"
              </Typography>
              <Typography variant="body1" gutterBottom>
                ให้กับอาจารย์ที่ปรึกษาสหกิจศึกษาของสาขาวิชาเรียบร้อยแล้ว
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Box textAlign="center">
                    <Typography variant="body2" gutterBottom>
                      ลงชื่อนิสิต: {user.fname} {user.sname}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      วันที่: {new Date().toLocaleDateString('th-TH')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="info" sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                      <strong>รอการรับรองจากอาจารย์ที่ปรึกษา</strong>
                    </Typography>
                    <Typography variant="caption" display="block">
                      อาจารย์ที่ปรึกษาสหกิจศึกษา
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* คำแนะนำเพิ่มเติม */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2">
              <strong>หมายเหตุ:</strong> หลังจากบันทึกแบบฟอร์มนี้ กรุณานำเอกสารไปให้อาจารย์ที่ปรึกษาสหกิจศึกษาลงนาม
              ก่อนเข้าสอบการสัมมนาสหกิจศึกษา การลงนามของอาจารย์เป็นการรับรองว่านิสิตได้ส่งรายงานเรียบร้อยแล้ว
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
              disabled={!reportTitleThai.trim() || !reportTitleEnglish.trim()}
            >
              บันทึกการยืนยัน
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
            bgcolor="primary.light" 
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="body2" color="primary.contrastText">
              <CheckCircle sx={{ verticalAlign: 'middle', mr: 1 }} />
              แบบฟอร์มยืนยันส่งรายงานการปฏิบัติงานสหกิจศึกษา | 
              นิสิต: <strong>{user.fname} {user.sname}</strong> | 
              วันที่: <strong>{new Date().toLocaleDateString('th-TH')}</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default Coop10Page;