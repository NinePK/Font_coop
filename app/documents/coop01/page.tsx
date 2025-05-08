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
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";

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

  // Fetch Entrepreneurs
  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/entrepreneur/`);
        if (!response.ok) throw new Error("Failed to fetch entrepreneurs");
        const data = await response.json();
        setEntrepreneurs(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntrepreneurs();
  }, []);

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
          const data = await response.json();
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
              {jobs.map((job) => (
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
          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CoopFormPage;
