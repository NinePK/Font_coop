"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Save,
  Cancel,
} from "@mui/icons-material";
import Link from "next/link";

const Coop07Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [existingData, setExistingData] = useState<any>(null);

  // สำหรับข้อมูลโครงร่างรายงาน
  const [reportTitle, setReportTitle] = useState<string>("");
  const [reportType, setReportType] = useState<string>("");
  const [reportObjective, setReportObjective] = useState<string>("");

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

  // ดึงข้อมูล COOP-07 ที่เคยบันทึกไว้
  useEffect(() => {
    if (user) {
      const fetchExistingData = async () => {
        try {
          const response = await fetch(`/api/coop07-outline?userId=${user.id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.outline) {
              console.log("Found existing COOP-07 data:", result.data);
              const outline = result.data.outline;
              setExistingData(result.data);
              setIsEditing(true);
              
              // โหลดข้อมูลเดิมในฟอร์ม
              setReportTitle(outline.report_title || "");
              setReportType(outline.report_type || "");
              setReportObjective(outline.report_objective || "");
            } else {
              console.log("No existing COOP-07 data found");
            }
          }
        } catch (error) {
          console.error("Error fetching existing COOP-07 data:", error);
        }
      };
      fetchExistingData();
    }
  }, [user]);

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    if (!reportTitle.trim() || !reportType || !reportObjective.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      // สร้างข้อมูลที่จะส่งไปยัง API
      const formData = {
        userId: user?.id,
        trainingId: training?.id || null,
        reportTitle,
        reportType,
        reportObjective,
        outlineDetails: {
          submittedAt: new Date().toISOString()
        }
      };

      let response;
      if (isEditing && existingData) {
        // อัพเดทข้อมูลเดิม
        console.log("อัพเดทข้อมูล COOP-07:", formData);
        response = await fetch('/api/coop07-outline', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, id: existingData.document.id }),
        });
      } else {
        // บันทึกข้อมูลใหม่
        console.log("บันทึกข้อมูล COOP-07 ใหม่:", formData);
        response = await fetch('/api/coop07-outline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('บันทึกข้อมูลสำเร็จ:', result);

      setSnackbar({
        open: true,
        message: 'บันทึกโครงร่างรายงานเรียบร้อยแล้ว',
        severity: 'success'
      });
      
      // รอ 2 วินาทีแล้วกลับไปหน้าหลัก
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (error) {
      console.error('Error saving COOP-07 data:', error);
      setSnackbar({
        open: true,
        message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // ฟังก์ชันยกเลิก
  const handleCancel = () => {
    if (confirm("คุณต้องการยกเลิกการกรอกแบบฟอร์มหรือไม่?")) {
      router.back();
    }
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
      {/* Navbar อย่างง่าย */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <IconButton color="inherit" onClick={() => router.push("/")}>
            <Home />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            โครงร่างรายงานสหกิจศึกษา
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Typography color="text.primary">โครงร่างรายงาน</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            แบบฟอร์มแจ้งโครงร่างรายงานการปฏิบัติงานสหกิจศึกษา
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Coop-07 {isEditing ? '(แก้ไขข้อมูล)' : '(บันทึกใหม่)'}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลนิสิต */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
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
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลรายงาน */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลรายงาน
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="หัวข้อรายงาน"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>ประเภทรายงาน</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="ประเภทรายงาน"
                  >
                    <MenuItem value="individual">รายงานเดี่ยว</MenuItem>
                    <MenuItem value="group">รายงานกลุ่ม</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="วัตถุประสงค์ของรายงาน"
                  value={reportObjective}
                  onChange={(e) => setReportObjective(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>

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
              disabled={saving || !reportTitle.trim() || !reportType || !reportObjective.trim()}
            >
              {saving ? 'กำลังบันทึก...' : (isEditing ? 'อัพเดทโครงร่าง' : 'บันทึกโครงร่าง')}
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
        </Paper>
      </Box>

      {/* Snackbar สำหรับแสดงข้อความ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Coop07Page;