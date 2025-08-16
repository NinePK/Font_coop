"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

const CoopFormPage = () => {
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
  const [saving, setSaving] = useState<boolean>(false);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
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
    if (!selectedEntrepreneur || !selectedJob || !startDate || !endDate || !selectedYear || !currentSemester) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบว่ามีภาคการศึกษาปัจจุบัน',
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

      setSnackbar({
        open: true,
        message: 'บันทึกข้อมูลสำเร็จ',
        severity: 'success'
      });

      // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
      setSelectedEntrepreneur("");
      setSelectedJob("");
      setStartDate(null);
      setEndDate(null);
      setSelectedYear("");
      setAdvisor1("");
      setAdvisor2("");

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        className="min-h-screen bg-gray-100"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          className="bg-white shadow-md rounded p-6"
          style={{ maxWidth: "800px", width: "100%" }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            ใบรายงานตัวสหกิจศึกษา
          </Typography>

          {/* ข้อมูลผู้ใช้ */}
          <Grid container spacing={2}>
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="year-select-label">ชั้นปี</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))} // แปลงค่าเป็น number
                >
                  <MenuItem value={1}>ปี 1</MenuItem>
                  <MenuItem value={2}>ปี 2</MenuItem>
                  <MenuItem value={3}>ปี 3</MenuItem>
                  <MenuItem value={4}>ปี 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <FormControl fullWidth margin="normal">
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

            {/* Add Button for Entrepreneur */}
            <Box display="flex" alignItems="center" marginY={2}>
              <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
                ค้นหาไม่พบ
              </Typography>
              <Tooltip title="เพิ่มสถานประกอบการ">
                <IconButton color="primary" onClick={handleAddEntrepreneurClick}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Select for Jobs */}
            <FormControl fullWidth margin="normal" disabled={!selectedEntrepreneur || loadingJobs}>
              <InputLabel id="job-select-label">ตำแหน่ง</InputLabel>
              <Select
                labelId="job-select-label"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <MenuItem value="">
                  <em>{loadingJobs ? "กำลังโหลด..." : "ตำแหน่ง"}</em>
                </MenuItem>
                {Array.isArray(jobs) && jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.name}
                  </MenuItem>
                ))}
              </Select>
              {loadingJobs && <CircularProgress size={24} style={{ marginLeft: "1rem" }} />}
            </FormControl>

            {/* Date Picker for Start and End Dates */}
            <Box display="flex" justifyContent="space-between" marginTop={2} gap={2}>
              <DatePicker
                label="จาก"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
              <DatePicker
                label="ถึง"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            </Box>
            
            {/* อาจารย์ที่ปรึกษา 1 */}
            <Grid item xs={12}>
              <TextField
                label="อาจารย์ที่ปรึกษา 1"
                value={advisor1}
                onChange={(e) => setAdvisor1(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>

            {/* อาจารย์ที่ปรึกษา 2 */}
            <Grid item xs={12}>
              <TextField
                label="อาจารย์ที่ปรึกษา 2"
                value={advisor2}
                onChange={(e) => setAdvisor2(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>

            {/* ปุ่มบันทึกข้อมูล */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" marginTop={3}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ minWidth: 200 }}
                >
                  {saving ? <CircularProgress size={24} /> : 'บันทึกข้อมูล'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
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
    </LocalizationProvider>
  );
};

export default CoopFormPage;
