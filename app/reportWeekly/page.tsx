"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentGuard } from "@/components/RoleGuard";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  ArrowBack,
  Save,
  Assignment,
  CalendarToday,
  Business,
  CheckCircle,
  Warning,
  Error,
  Help,
} from "@mui/icons-material";

const ReportWeeklyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);

  // Weekly Report States
  const [week, setWeek] = useState<number>(1);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(6, 'day'));
  const [job, setJob] = useState<string>("");
  const [problem, setProblem] = useState<string>("");
  const [fixed, setFixed] = useState<string>("");
  const [courseFixed, setCourseFixed] = useState<string>("");
  const [exp, setExp] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [status, setStatus] = useState<string>("normal");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
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
        const data = await response.json();
        setCurrentSemester(data);
      } catch (error) {
        console.error("Error fetching current semester:", error);
      }
    };
    fetchCurrentSemester();
  }, []);

  // ดึงข้อมูล training
  useEffect(() => {
    if (user && currentSemester) {
      const fetchTraining = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/training/user/${user.id}-${currentSemester.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setTraining(data[0]);
              if (data[0].job && data[0].job.entrepreneur) {
                setDepartment(data[0].job.entrepreneur.nameTh || "");
              }
            }
          }
        } catch (error) {
          console.error("Error fetching training data:", error);
        }
      };
      fetchTraining();
    }
  }, [user, currentSemester]);

  const handleSave = async () => {
    if (!training) {
      setSnackbar({
        open: true,
        message: 'ไม่พบข้อมูลการฝึกงาน กรุณาลงทะเบียนการฝึกงานก่อน',
        severity: 'error'
      });
      return;
    }

    if (!job || !startDate || !endDate) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        severity: 'error'
      });
      return;
    }

    try {
      const weeklyData = {
        week: week,
        startdate: startDate.format('YYYY-MM-DD'),
        enddate: endDate.format('YYYY-MM-DD'),
        training_id: training.id,
        job: job,
        problem: problem,
        fixed: fixed,
        course_fixed: courseFixed,
        exp: exp,
        suggestion: suggestion,
        department: department,
        status: status,
      };

      console.log('Saving weekly report:', weeklyData);

      const response = await fetch('/api/weekly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weeklyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
      }

      setSnackbar({
        open: true,
        message: 'บันทึกรายงานประจำสัปดาห์เรียบร้อยแล้ว',
        severity: 'success'
      });

      // Reset form
      setWeek(week + 1);
      setStartDate(dayjs());
      setEndDate(dayjs().add(6, 'day'));
      setJob("");
      setProblem("");
      setFixed("");
      setCourseFixed("");
      setExp("");
      setSuggestion("");
      setStatus("normal");

    } catch (error) {
      console.error('Error saving weekly report:', error);
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get status color and icon
  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "good": return "#4caf50"; // green
      case "normal": return "#2196f3"; // blue
      case "uncomfortable": return "#ff9800"; // orange  
      case "need_advice": return "#f44336"; // red
      default: return "#757575"; // grey
    }
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case "good": return <CheckCircle />;
      case "normal": return <CheckCircle />;
      case "uncomfortable": return <Warning />;
      case "need_advice": return <Help />;
      default: return <CheckCircle />;
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
    <StudentGuard>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        {/* Header */}
        <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => router.push("/")}
            >
              <ArrowBack />
            </IconButton>
            <Assignment sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              รายงานประจำสัปดาห์
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* User & Training Info */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  ข้อมูลนิสิต
                </Typography>
                <Typography variant="body1">
                  <strong>ชื่อ:</strong> {user.fname} {user.sname}
                </Typography>
                <Typography variant="body1">
                  <strong>รหัสนิสิต:</strong> {user.username}
                </Typography>
                <Typography variant="body1">
                  <strong>สาขาวิชา:</strong> {user.major?.majorTh}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {training && training.job && training.job.entrepreneur ? (
                  <>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      ข้อมูลสถานประกอบการ
                    </Typography>
                    <Typography variant="body1">
                      <strong>บริษัท:</strong> {training.job.entrepreneur.nameTh}
                    </Typography>
                    <Typography variant="body1">
                      <strong>ตำแหน่ง:</strong> {training.job.name}
                    </Typography>
                    <Chip
                      label={`สัปดาห์ที่ ${week}`}
                      color="primary"
                      icon={<CalendarToday />}
                      sx={{ mt: 1 }}
                    />
                  </>
                ) : (
                  <Alert severity="warning">
                    ไม่พบข้อมูลการฝึกงาน กรุณาลงทะเบียนการฝึกงานก่อน
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Weekly Report Form */}
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom align="center" color="primary.main">
                📝 รายงานประจำสัปดาห์ที่ {week}
              </Typography>
              
              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                {/* Week and Date Range */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="สัปดาห์ที่"
                    type="number"
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="วันที่เริ่มต้น"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      if (newValue) {
                        setEndDate(newValue.add(6, 'day'));
                      }
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="วันที่สิ้นสุด"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* Department */}
                <Grid item xs={12}>
                  <TextField
                    label="หน่วยงาน/แผนก"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    fullWidth
                  />
                </Grid>

                {/* Job Description */}
                <Grid item xs={12}>
                  <TextField
                    label="ลักษณะงานที่ปฏิบัติในสัปดาห์นี้"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Problems */}
                <Grid item xs={12}>
                  <TextField
                    label="ปัญหาที่พบในการปฏิบัติงาน"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                {/* Solutions */}
                <Grid item xs={12}>
                  <TextField
                    label="วิธีการแก้ไขปัญหา"
                    value={fixed}
                    onChange={(e) => setFixed(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                {/* Course Application */}
                <Grid item xs={12}>
                  <TextField
                    label="การนำความรู้จากรายวิชาต่างๆ มาใช้ในการปฏิบัติงาน"
                    value={courseFixed}
                    onChange={(e) => setCourseFixed(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                {/* Experience */}
                <Grid item xs={12}>
                  <TextField
                    label="ประสบการณ์ที่ได้รับ"
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                {/* Suggestions */}
                <Grid item xs={12}>
                  <TextField
                    label="ข้อเสนอแนะ"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>สถานะการปฏิบัติงาน</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="สถานะการปฏิบัติงาน"
                    >
                      <MenuItem value="normal">
                        <Box display="flex" alignItems="center">
                          <CheckCircle sx={{ color: "#2196f3", mr: 1 }} />
                          ปกติ
                        </Box>
                      </MenuItem>
                      <MenuItem value="good">
                        <Box display="flex" alignItems="center">
                          <CheckCircle sx={{ color: "#4caf50", mr: 1 }} />
                          ดี
                        </Box>
                      </MenuItem>
                      <MenuItem value="uncomfortable">
                        <Box display="flex" alignItems="center">
                          <Warning sx={{ color: "#ff9800", mr: 1 }} />
                          ไม่สบายใจ
                        </Box>
                      </MenuItem>
                      <MenuItem value="need_advice">
                        <Box display="flex" alignItems="center">
                          <Help sx={{ color: "#f44336", mr: 1 }} />
                          ต้องการคำปรึกษา
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Status Indicator */}
                {status && (
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: getStatusColor(status) + "10",
                        border: `2px solid ${getStatusColor(status)}40`,
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Box sx={{ color: getStatusColor(status), mr: 1 }}>
                          {getStatusIcon(status)}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            สถานะปัจจุบัน
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ color: getStatusColor(status), fontWeight: 600 }}
                          >
                            {status === "normal" && "ปกติ"}
                            {status === "good" && "ดี"} 
                            {status === "uncomfortable" && "ไม่สบายใจ"}
                            {status === "need_advice" && "ต้องการคำปรึกษา"}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Save Button */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    },
                  }}
                >
                  บันทึกรายงาน
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>

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
      </LocalizationProvider>
    </StudentGuard>
  );
};

export default ReportWeeklyPage;