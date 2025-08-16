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
  Card,
  CardContent,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Save,
  Cancel,
  Add,
  Delete,
  Schedule,
  Work,
} from "@mui/icons-material";
import Link from "next/link";

interface MonthlyPlan {
  month: number;
  workTopic: string;
}

const Coop06Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // สำหรับแผนการปฏิบัติงาน
  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyPlan[]>([
    { month: 1, workTopic: "" }
  ]);
  
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
            }
          }
        } catch (error) {
          console.error("Error fetching training data:", error);
        }
      };
      fetchTraining();
    }
  }, [user, currentSemester]);

  // ดึงข้อมูล COOP-06 ที่เคยบันทึกไว้
  useEffect(() => {
    if (user) {
      const fetchExistingData = async () => {
        try {
          const response = await fetch(`/api/coop06-workplan?userId=${user.id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.documents && result.documents.length > 0) {
              const existingData = result.documents[0];
              console.log("Found existing COOP-06 data:", existingData);
              
              setIsEditing(true);
              
              // โหลดข้อมูลเดิมในฟอร์ม
              setObjective1(existingData.objective1 || "");
              setObjective2(existingData.objective2 || "");
              setObjective3(existingData.objective3 || "");
              setObjective4(existingData.objective4 || "");
              setObjective5(existingData.objective5 || "");
              
              // โหลดแผนรายเดือน
              const monthlyData = [
                { month: 1, workTopic: existingData.month1 || "" },
                { month: 2, workTopic: existingData.month2 || "" },
                { month: 3, workTopic: existingData.month3 || "" },
                { month: 4, workTopic: existingData.month4 || "" },
                { month: 5, workTopic: existingData.month5 || "" },
                { month: 6, workTopic: existingData.month6 || "" }
              ].filter(item => item.workTopic !== ""); // แสดงเฉพาะเดือนที่มีข้อมูล
              
              if (monthlyData.length > 0) {
                setMonthlyPlans(monthlyData);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching existing COOP-06 data:", error);
        }
      };
      fetchExistingData();
    }
  }, [user]);

  // ฟังก์ชันเพิ่มเดือน
  const addMonth = () => {
    const nextMonth = monthlyPlans.length + 1;
    if (nextMonth <= 12) { // จำกัดไม่เกิน 12 เดือน
      setMonthlyPlans([
        ...monthlyPlans,
        { month: nextMonth, workTopic: "" }
      ]);
    } else {
      setSnackbar({
        open: true,
        message: 'ไม่สามารถเพิ่มได้เกิน 12 เดือน',
        severity: 'warning'
      });
    }
  };

  // ฟังก์ชันลบเดือน
  const removeMonth = (monthIndex: number) => {
    if (monthlyPlans.length > 1) {
      const updatedPlans = monthlyPlans.filter((_, index) => index !== monthIndex);
      // อัปเดตเลขเดือนใหม่
      const renumberedPlans = updatedPlans.map((plan, index) => ({
        ...plan,
        month: index + 1
      }));
      setMonthlyPlans(renumberedPlans);
    } else {
      setSnackbar({
        open: true,
        message: 'ต้องมีอย่างน้อย 1 เดือน',
        severity: 'warning'
      });
    }
  };

  // ฟังก์ชันอัปเดตหัวข้องาน
  const updateWorkTopic = (monthIndex: number, value: string) => {
    const updatedPlans = monthlyPlans.map((plan, index) => 
      index === monthIndex ? { ...plan, workTopic: value } : plan
    );
    setMonthlyPlans(updatedPlans);
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    // ตรวจสอบว่ากรอกข้อมูลครบทุกเดือนแล้ว
    const emptyTopics = monthlyPlans.filter(plan => !plan.workTopic.trim());
    if (emptyTopics.length > 0) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกหัวข้องานให้ครบทุกเดือน',
        severity: 'error'
      });
      return;
    }

    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      userId: user?.id,
      trainingId: training?.id,
      monthlyPlans: monthlyPlans,
      totalMonths: monthlyPlans.length,
      submittedAt: new Date().toISOString()
    };

    try {
      // จำลองการส่งข้อมูลไปยัง API
      console.log("บันทึกแผนการปฏิบัติงาน:", formData);
      
      // แสดงข้อความสำเร็จ
      setSnackbar({
        open: true,
        message: 'บันทึกแผนการปฏิบัติงานเรียบร้อยแล้ว',
        severity: 'success'
      });
      
      // รอ 2 วินาทีแล้วกลับไปหน้าหลัก
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
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
            แบบฟอร์มแจ้งแผนการปฏิบัติงาน
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Link href="/documents" style={{ textDecoration: 'none', color: 'inherit' }}>เอกสารสหกิจศึกษา</Link>
          <Typography color="text.primary">แผนการปฏิบัติงาน</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            แบบแจ้งแผนการปฏิบัติงานสหกิจศึกษา
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Coop-06 {isEditing ? '(แก้ไขข้อมูล)' : '(บันทึกใหม่)'}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลส่วนตัวของนิสิต */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลส่วนตัวของนิสิต
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
              <Grid item xs={12}>
                <TextField
                  label="คณะ"
                  value={user.major?.faculty?.facultyTh || ""}
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
            <Typography variant="h6" gutterBottom>
              สถานที่ปฏิบัติงาน
            </Typography>
            {training && training.job && training.job.entrepreneur ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="ปฏิบัติงานที่ (ชื่อบริษัท)"
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
                    label="ระยะเวลาการฝึกงาน"
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
              <Alert severity="warning" sx={{ mb: 2 }}>
                ไม่พบข้อมูลการฝึกงาน กรุณาลงทะเบียนการฝึกงานก่อน (Coop-01)
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* แผนการปฏิบัติงาน */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                แผนการปฏิบัติงาน ({monthlyPlans.length} เดือน)
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={addMonth}
                disabled={monthlyPlans.length >= 12}
              >
                เพิ่มเดือน
              </Button>
            </Box>

            {/* รายการแผนรายเดือน */}
            <Grid container spacing={3}>
              {monthlyPlans.map((plan, index) => (
                <Grid item xs={12} key={index}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      border: '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 4 }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <Typography variant="h6">{plan.month}</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          เดือนที่ {plan.month}
                        </Typography>
                        {monthlyPlans.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeMonth(index)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                      
                      <TextField
                        label={`หัวข้องานเดือนที่ ${plan.month} *`}
                        value={plan.workTopic}
                        onChange={(e) => updateWorkTopic(index, e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="กรุณาระบุหัวข้องาน/กิจกรรม/โปรเจคที่จะทำในเดือนนี้"
                        required
                        helperText="อธิบายงานหรือกิจกรรมหลักที่จะปฏิบัติในเดือนนี้"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* ตัวอย่างการกรอก */}
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                ตัวอย่างการกรอกหัวข้องาน:
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Work fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="เดือนที่ 1: ศึกษาระบบงานและโครงสร้างองค์กร"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Work fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="เดือนที่ 2: พัฒนาโปรแกรมจัดการข้อมูลลูกค้า"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Work fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="เดือนที่ 3: ทดสอบระบบและแก้ไขปัญหา"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Alert>
          </Box>

          {/* คำแนะนำ */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2">
              <strong>หมายเหตุ:</strong> แผนการปฏิบัติงานนี้เป็นเพียงแนวทางในการทำงาน 
              สามารถปรับเปลี่ยนได้ตามความเหมาะสมและข้อตกลงกับสถานประกอบการ 
              ควรปรึกษาอาจารย์ที่ปรึกษาและพี่เลี้ยงในสถานประกอบการก่อนยืนยันแผน
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
              disabled={saving || monthlyPlans.some(plan => !plan.workTopic.trim())}
            >
              {saving ? 'กำลังบันทึก...' : (isEditing ? 'อัพเดทแผนงาน' : 'บันทึกแผนการปฏิบัติงาน')}
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

          {/* สถิติแผน */}
          <Box 
            mt={4} 
            p={2} 
            bgcolor="grey.100" 
            borderRadius={2}
            textAlign="center"
          >
            <Typography variant="body2" color="textSecondary">
              แผนการปฏิบัติงานรวม: <strong>{monthlyPlans.length} เดือน</strong> | 
              หัวข้องานที่กรอกแล้ว: <strong>{monthlyPlans.filter(plan => plan.workTopic.trim()).length}/{monthlyPlans.length}</strong>
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

export default Coop06Page;