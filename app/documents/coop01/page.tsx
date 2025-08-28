"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  Grid,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  Backdrop,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

const CoopFormPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [entrepreneurs, setEntrepreneurs] = useState<any[]>([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "">(""); // สำหรับชั้นปี
  const [advisor1, setAdvisor1] = useState<string>(""); // อาจารย์ที่ปรึกษา 1
  const [advisor2, setAdvisor2] = useState<string>(""); // อาจารย์ที่ปรึกษา 2
  const [teachers, setTeachers] = useState<any[]>([]); // รายชื่ออาจารย์ทั้งหมด
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false); // เพิ่ม state ตรวจสอบข้อมูลเดิม
  const [showRedirectDialog, setShowRedirectDialog] = useState<boolean>(false); // สำหรับแสดง popup redirect
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ดึงข้อมูลจาก cookie
  useEffect(() => {
    const userData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch current semester
  useEffect(() => {
    const fetchCurrentSemester = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/semester/current`);
        if (!response.ok) throw new Error("Failed to fetch current semester");
        const data: any = await response.json();
        setCurrentSemester(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentSemester();
  }, []);

  // Fetch Entrepreneurs
  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/entrepreneur/`);
        if (!response.ok) throw new Error("Failed to fetch entrepreneurs");
        const data: any = await response.json();
        setEntrepreneurs(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntrepreneurs();
  }, []);

  // Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      try {
        console.log('Fetching teachers from API...');
        const response = await fetch('/api/teacher');
        console.log('Teacher API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Teacher API error response:', errorText);
          throw new Error(`Failed to fetch teachers: ${response.status} ${response.statusText}`);
        }
        
        const data: any = await response.json();
        console.log('Teacher API response data:', data);
        setTeachers(Array.isArray(data) ? data : []);
        
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('No teachers found or invalid data format');
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]);
        setSnackbar({
          open: true,
          message: `ไม่สามารถโหลดข้อมูลอาจารย์ได้: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        });
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  // ดึงข้อมูล training ที่เคยบันทึกไว้ (COOP-01)
  useEffect(() => {
    if (user && currentSemester) {
      const fetchExistingTraining = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/training/user/${user.id}-${currentSemester.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const existingTraining = data[0];
              console.log("Found existing training data:", existingTraining);
              
              // ตั้งค่าให้รู้ว่ามีข้อมูลเดิมแล้ว (ไม่ให้แก้ไขได้)
              setHasExistingData(true);
              
              // โหลดข้อมูลเดิมในฟอร์ม
              setSelectedEntrepreneur(existingTraining.job?.entrepreneurId?.toString() || "");
              setSelectedJob(existingTraining.jobId?.toString() || "");
              setSelectedYear(existingTraining.user?.year || "");
              setAdvisor1(existingTraining.teacherId1?.toString() || "");
              setAdvisor2(existingTraining.teacherId2?.toString() || "");
              
              if (existingTraining.startdate) {
                setStartDate(dayjs(existingTraining.startdate));
              }
              if (existingTraining.enddate) {
                setEndDate(dayjs(existingTraining.enddate));
              }
              
              // ถ้ามี entrepreneur ให้ดึง jobs ของ entrepreneur นั้น
              if (existingTraining.job?.entrepreneurId) {
                const jobsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_BACK_URL}/job/search?entrepreneurId=${existingTraining.job.entrepreneurId}`
                );
                if (jobsResponse.ok) {
                  const jobsData = await jobsResponse.json();
                  setJobs(jobsData);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error fetching existing training data:", error);
        }
      };
      fetchExistingTraining();
    }
  }, [user, currentSemester]);

  // Fetch Jobs when Entrepreneur changes
  useEffect(() => {
    if (selectedEntrepreneur) {
      const fetchJobs = async () => {
        setLoadingJobs(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACK_URL}/job/search?entrepreneurId=${selectedEntrepreneur}`
          );
          if (!response.ok) throw new Error("Failed to fetch jobs");
          const data: any = await response.json();
          setJobs(data.jobs || []);
        } catch (error) {
          console.error(error);
          setJobs([]);
        } finally {
          setLoadingJobs(false);
        }
      };
      fetchJobs();
    } else {
      setJobs([]);
    }
  }, [selectedEntrepreneur]);

  const handleAddEntrepreneurClick = () => {
    window.open("/documents/entrepreneur", "_blank");
  };

  const handleSave = async () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!selectedEntrepreneur || !selectedJob || !startDate || !endDate || !selectedYear || !currentSemester || !advisor1) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (อาจารย์ที่ปรึกษา 1 เป็นข้อมูลบังคับ)',
        severity: 'error'
      });
      return;
    }

    // ตรวจสอบว่าวันที่เริ่มน้อยกว่าวันที่สิ้นสุด
    if (startDate && endDate && startDate.isAfter(endDate)) {
      setSnackbar({
        open: true,
        message: 'วันที่เริ่มต้องน้อยกว่าวันที่สิ้นสุด',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      // สร้างข้อมูลตามโครงสร้างตาราง Training ที่แท้จริง
      const trainingData = {
        user_id: parseInt(user.id),                    // ใช้ user_id ไม่ใช่ userId
        job_id: parseInt(selectedJob),                 // ใช้ job_id ไม่ใช่ jobId
        semester_id: parseInt(currentSemester.id),      // ใช้ semester_id ไม่ใช่ semesterId
        startdate: startDate ? startDate.format('YYYY-MM-DD') : null,  // ใช้ format แทน toISOString
        enddate: endDate ? endDate.format('YYYY-MM-DD') : null,        // ใช้ format แทน toISOString
        year: selectedYear,                            // เพิ่มฟิลด์ year
        teacher_id1: advisor1 ? parseInt(advisor1) : null,  // ใช้ teacher_id1 ไม่ใช่ teacherId1
        teacher_id2: advisor2 ? parseInt(advisor2) : null,  // ใช้ teacher_id2 ไม่ใช่ teacherId2
        // ข้อมูลอื่นๆ จะถูกตั้งค่าเป็น null หรือค่าเริ่มต้น
        address: null,
        mooban_id: null,                               // ใช้ mooban_id ไม่ใช่ moobanId
        tambon_id: null,                               // ใช้ tambon_id ไม่ใช่ tambonId
        tel: null,
        email: null,
        lat: null,
        long: null,
        name_mentor: null,                             // ใช้ name_mentor ไม่ใช่ nameMentor
        position_mentor: null,                         // ใช้ position_mentor ไม่ใช่ positionMentor
        dept_mentor: null,                             // ใช้ dept_mentor ไม่ใช่ deptMentor
        tel_mentor: null,                              // ใช้ tel_mentor ไม่ใช่ telMentor
        email_mentor: null,                            // ใช้ email_mentor ไม่ใช่ emailMentor
        job_position: null,                            // ใช้ job_position ไม่ใช่ jobPosition
        job_des: null,                                 // ใช้ job_des ไม่ใช่ jobDes
        time_mentor: null,                             // ใช้ time_mentor ไม่ใช่ timeMentor
        incharge_id1: null,                            // ใช้ incharge_id1 ไม่ใช่ inchargeId1
        incharge_id2: null,                            // ใช้ incharge_id2 ไม่ใช่ inchargeId2
        coop: 0,                                       // เพิ่มฟิลด์ coop
        status: 1                                      // เพิ่มฟิลด์ status
      };

      console.log('Sending training data:', trainingData);

      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: any = await response.json();
      console.log('Training saved successfully:', result);

      // ส่งการแจ้งเตือนไปยังอาจารย์ที่ปรึกษา
      await sendNotificationToTeachers();

      setSnackbar({
        open: true,
        message: 'บันทึกข้อมูลสำเร็จ และส่งการแจ้งเตือนไปยังอาจารย์ที่ปรึกษาแล้ว',
        severity: 'success'
      });

      // แสดง popup redirect loading และ redirect ทันที
      setShowRedirectDialog(true);
      setTimeout(() => {
        // ใช้ Next.js router เพื่อไม่ให้ session หาย
        router.push("/dashboard");
      }, 1500); // รอ 1.5 วินาที แล้ว redirect

    } catch (error) {
      console.error('Error saving data:', error);
      setSnackbar({
        open: true,
        message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const sendNotificationToTeachers = async () => {
    try {
      const notificationData = {
        userId: user.id,
        userName: `${user.fname} ${user.sname}`,
        userCode: user.username,
        advisorId1: advisor1 ? parseInt(advisor1) : null,
        advisorId2: advisor2 ? parseInt(advisor2) : null,
        documentType: 'COOP-01',
        message: `นิสิต ${user.fname} ${user.sname} (${user.username}) ได้ส่งใบรายงานตัวสหกิจศึกษา (COOP-01) เพื่อขออนุมัติ`
      };

      const response = await fetch('/api/notification/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        console.error('Failed to send notification to teachers');
      } else {
        console.log('Notification sent to teachers successfully');
      }
    } catch (error) {
      console.error('Error sending notification to teachers:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                p: 4,
                textAlign: "center"
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                ใบรายงานตัวสหกิจศึกษา
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                COOP-01 Application Form
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* แสดงสถานะเมื่อมีข้อมูลเดิมแล้ว */}
              {hasExistingData && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontSize: "16px"
                    }
                  }}
                >
                  🎉 คุณได้ส่งใบรายงานตัวสหกิจศึกษาไปแล้ว ด้านล่างเป็นข้อมูลที่คุณเคยบันทึกไว้
                </Alert>
              )}

              {/* ข้อมูลนิสิต */}
              <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
                <CardHeader
                  title="ข้อมูลนิสิต"
                  sx={{
                    bgcolor: "primary.50",
                    "& .MuiCardHeader-title": {
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "primary.main"
                    }
                  }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* ชื่อไทย, ชื่ออังกฤษ, และรหัสนิสิต */}
                    <Grid item xs={4}>
                      <TextField
                        label="ชื่อไทย"
                        value={`${user.fname} ${user.sname}`}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="ชื่ออังกฤษ"
                        value={`${user.fnameEn} ${user.snameEn}`}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="รหัสนิสิต"
                        value={user.username}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* หลักสูตร */}
                    <Grid item xs={12}>
                      <TextField
                        label="หลักสูตร"
                        value={user.major.degree}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* สาขาวิชา */}
                    <Grid item xs={12}>
                      <TextField
                        label="สาขาวิชา"
                        value={user.major.majorTh}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* คณะ */}
                    <Grid item xs={12}>
                      <TextField
                        label="คณะ"
                        value={user.major.faculty.facultyTh}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* ภาคการศึกษาปัจจุบัน */}
                    <Grid item xs={12}>
                      <TextField
                        label="ภาคการศึกษาปัจจุบัน"
                        value={currentSemester ? `ภาคเรียนที่ ${currentSemester.semester} ปีการศึกษา ${currentSemester.year}` : 'กำลังโหลด...'}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                        color={currentSemester ? "success" : "warning"}
                      />
                    </Grid>

                    {/* ชั้นปี */}
                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={hasExistingData}>
                        <InputLabel id="year-select-label">ชั้นปี</InputLabel>
                        <Select
                          labelId="year-select-label"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                          <MenuItem value={1}>ปี 1</MenuItem>
                          <MenuItem value={2}>ปี 2</MenuItem>
                          <MenuItem value={3}>ปี 3</MenuItem>
                          <MenuItem value={4}>ปี 4</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* ข้อมูลสถานประกอบการ */}
              <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
                <CardHeader
                  title="ข้อมูลสถานประกอบการ"
                  sx={{
                    bgcolor: "success.50",
                    "& .MuiCardHeader-title": {
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "success.main"
                    }
                  }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={hasExistingData}>
                        <InputLabel id="entrepreneur-select-label">ชื่อสถานประกอบการ</InputLabel>
                        <Select
                          labelId="entrepreneur-select-label"
                          value={selectedEntrepreneur}
                          onChange={(e) => setSelectedEntrepreneur(e.target.value)}
                          required
                        >
                          <MenuItem value="">
                            <em>เลือกสถานประกอบการ</em>
                          </MenuItem>
                          {entrepreneurs.map((entrepreneur) => (
                            <MenuItem key={entrepreneur.id} value={entrepreneur.id}>
                              {entrepreneur.nameTh}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {!hasExistingData && (
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                          <Typography variant="body2" color="textSecondary">
                            ไม่พบสถานประกอบการที่ต้องการ?
                          </Typography>
                          <Tooltip title="เพิ่มสถานประกอบการใหม่">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={handleAddEntrepreneurClick}
                              sx={{ ml: 2 }}
                            >
                              เพิ่มใหม่
                            </Button>
                          </Tooltip>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={hasExistingData || !selectedEntrepreneur || loadingJobs}>
                        <InputLabel id="job-select-label">ตำแหน่งงาน</InputLabel>
                        <Select
                          labelId="job-select-label"
                          value={selectedJob}
                          onChange={(e) => setSelectedJob(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>{loadingJobs ? "กำลังโหลด..." : "เลือกตำแหน่งงาน"}</em>
                          </MenuItem>
                          {Array.isArray(jobs) && jobs.map((job) => (
                            <MenuItem key={job.id} value={job.id}>
                              {job.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {loadingJobs && (
                          <Box display="flex" justifyContent="center" mt={1}>
                            <CircularProgress size={20} />
                          </Box>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* ระยะเวลาการฝึก */}
              <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
                <CardHeader
                  title="ระยะเวลาการฝึก"
                  sx={{
                    bgcolor: "warning.50",
                    "& .MuiCardHeader-title": {
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "warning.main"
                    }
                  }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <DatePicker
                        label="วันที่เริ่มต้น"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        disabled={hasExistingData}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            variant: "outlined"
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="วันที่สิ้นสุด"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        disabled={hasExistingData}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            variant: "outlined"
                          } 
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* อาจารย์ที่ปรึกษา */}
              <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
                <CardHeader
                  title="อาจารย์ที่ปรึกษา"
                  sx={{
                    bgcolor: "secondary.50",
                    "& .MuiCardHeader-title": {
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "secondary.main"
                    }
                  }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={hasExistingData || loadingTeachers}>
                        <InputLabel id="advisor1-select-label">อาจารย์ที่ปรึกษา 1 (บังคับ)</InputLabel>
                        <Select
                          labelId="advisor1-select-label"
                          value={advisor1}
                          onChange={(e) => setAdvisor1(e.target.value)}
                          required
                        >
                          <MenuItem value="">
                            <em>{loadingTeachers ? "กำลังโหลด..." : "เลือกอาจารย์ที่ปรึกษา 1"}</em>
                          </MenuItem>
                          {teachers.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                              {teacher.fname} {teacher.sname} ({teacher.username})
                            </MenuItem>
                          ))}
                        </Select>
                        {loadingTeachers && (
                          <Box display="flex" justifyContent="center" mt={1}>
                            <CircularProgress size={20} />
                          </Box>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={hasExistingData || loadingTeachers}>
                        <InputLabel id="advisor2-select-label">อาจารย์ที่ปรึกษา 2 (ไม่บังคับ)</InputLabel>
                        <Select
                          labelId="advisor2-select-label"
                          value={advisor2}
                          onChange={(e) => setAdvisor2(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>{loadingTeachers ? "กำลังโหลด..." : "เลือกอาจารย์ที่ปรึกษา 2"}</em>
                          </MenuItem>
                          {teachers.filter(teacher => teacher.id !== advisor1).map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                              {teacher.fname} {teacher.sname} ({teacher.username})
                            </MenuItem>
                          ))}
                        </Select>
                        {loadingTeachers && (
                          <Box display="flex" justifyContent="center" mt={1}>
                            <CircularProgress size={20} />
                          </Box>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* ปุ่มบันทึกข้อมูล */}
              <Box display="flex" justifyContent="center" mt={4}>
                {!hasExistingData ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ 
                      minWidth: 250,
                      minHeight: 50,
                      borderRadius: 3,
                      fontSize: "16px",
                      fontWeight: "bold",
                      boxShadow: "0 8px 16px rgba(25, 118, 210, 0.3)",
                      "&:hover": {
                        boxShadow: "0 12px 24px rgba(25, 118, 210, 0.4)",
                        transform: "translateY(-2px)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    {saving ? 'กำลังบันทึก...' : '📝 บันทึกข้อมูล'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    disabled
                    sx={{ 
                      minWidth: 250,
                      minHeight: 50,
                      borderRadius: 3,
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  >
                    ✅ ส่งข้อมูลแล้ว
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Snackbar สำหรับแสดงข้อความ */}
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

      {/* Redirect Loading Dialog */}
      <Dialog
        open={showRedirectDialog}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
            textAlign: 'center'
          }
        }}
      >
        <DialogContent sx={{ py: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              🎉 บันทึกข้อมูลสำเร็จ!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              กำลังนำคุณไปยังหน้าหลัก...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CoopFormPage;