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
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Save,
  Cancel,
} from "@mui/icons-material";
import Link from "next/link";

const Coop04Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  
  // สร้าง state สำหรับฟอร์ม
  const [accommodationType, setAccommodationType] = useState<string>("");
  const [accommodationName, setAccommodationName] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [subdistrict, setSubdistrict] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [emergencyPhone, setEmergencyPhone] = useState<string>("");
  const [emergencyRelation, setEmergencyRelation] = useState<string>("");
  const [travelMethod, setTravelMethod] = useState<string>("");
  const [travelDetails, setTravelDetails] = useState<string>("");
  const [distanceKm, setDistanceKm] = useState<string>("");
  const [travelTime, setTravelTime] = useState<string>("");

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
            console.log("Training data from API:", data);
            if (data && data.length > 0) {
              console.log("Setting training:", data[0]);
              setTraining(data[0]); // เอาข้อมูลการฝึกงานแรก
            } else {
              console.log("No training data found for user");
            }
          } else {
            console.log("Failed to fetch training data:", response.status);
          }
        } catch (error) {
          console.error("Error fetching training data:", error);
        }
      };
      fetchTraining();
    }
  }, [user, currentSemester]);

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      userId: user?.id,
      accommodationType,
      accommodationName,
      roomNumber,
      address,
      subdistrict,
      district,
      province,
      postalCode,
      phoneNumber,
      emergencyContact,
      emergencyPhone,
      emergencyRelation,
      travelMethod,
      travelDetails,
      distanceKm,
      travelTime,
    };

    // จำลองการส่งข้อมูลไปยัง API
    console.log("บันทึกข้อมูล:", formData);
    
    // แสดงข้อความแจ้งเตือน
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    
    // กลับไปยังหน้าหลัก
    router.push("/");
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
            แบบฟอร์มที่พักสหกิจศึกษา
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Typography color="text.primary">แบบฟอร์มที่พัก</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            แบบแจ้งรายละเอียดที่พักระหว่างการปฏิบัติงานสหกิจศึกษา
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Coop-04
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
              <Grid item xs={12} md={6}>
                <TextField
                  label="คณะ"
                  value={user.major?.faculty?.facultyTh || ""}
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
            <Typography variant="h6" gutterBottom>
              ข้อมูลสถานประกอบการ
            </Typography>
            {training && training.job && training.job.entrepreneur ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ชื่อบริษัท (ไทย)"
                    value={training.job.entrepreneur.nameTh || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ชื่อบริษัท (อังกฤษ)"
                    value={training.job.entrepreneur.nameEn || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="ที่อยู่บริษัท"
                    value={training.job.entrepreneur.address || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="โทรศัพท์"
                    value={training.job.entrepreneur.tel || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="อีเมล"
                    value={training.job.entrepreneur.email || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                ไม่พบข้อมูลการฝึกงาน กรุณาลงทะเบียนการฝึกงานก่อน
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลที่พัก */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลที่พัก
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="accommodation-type-label">ประเภทที่พัก</InputLabel>
                  <Select
                    labelId="accommodation-type-label"
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value)}
                    label="ประเภทที่พัก"
                    aria-labelledby="accommodation-type-label"
                  >
                    <MenuItem value="dormitory">หอพัก</MenuItem>
                    <MenuItem value="apartment">อพาร์ทเมนท์</MenuItem>
                    <MenuItem value="condo">คอนโดมิเนียม</MenuItem>
                    <MenuItem value="house">บ้านเช่า</MenuItem>
                    <MenuItem value="relative">บ้านญาติ</MenuItem>
                    <MenuItem value="company">ที่พักของบริษัท</MenuItem>
                    <MenuItem value="other">อื่นๆ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ชื่อที่พัก"
                  value={accommodationName}
                  onChange={(e) => setAccommodationName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="เลขที่ห้อง"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ที่อยู่"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ตำบล/แขวง"
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="อำเภอ/เขต"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="จังหวัด"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="รหัสไปรษณีย์"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="เบอร์โทรศัพท์"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลผู้ติดต่อกรณีฉุกเฉิน */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลผู้ติดต่อกรณีฉุกเฉิน
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ชื่อ-นามสกุล ผู้ติดต่อฉุกเฉิน"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="เบอร์โทรศัพท์"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ความสัมพันธ์"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลการเดินทาง */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลการเดินทางไปสถานประกอบการ
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="travel-method-label">วิธีการเดินทาง</InputLabel>
                  <Select
                    labelId="travel-method-label"
                    value={travelMethod}
                    onChange={(e) => setTravelMethod(e.target.value)}
                    label="วิธีการเดินทาง"
                    aria-labelledby="travel-method-label"
                  >
                    <MenuItem value="car">รถยนต์ส่วนตัว</MenuItem>
                    <MenuItem value="motorcycle">รถจักรยานยนต์</MenuItem>
                    <MenuItem value="bus">รถโดยสารประจำทาง</MenuItem>
                    <MenuItem value="taxi">แท็กซี่</MenuItem>
                    <MenuItem value="company">รถรับส่งของบริษัท</MenuItem>
                    <MenuItem value="other">อื่นๆ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="รายละเอียดการเดินทาง"
                  value={travelDetails}
                  onChange={(e) => setTravelDetails(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ระยะทางประมาณ (กิโลเมตร)"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="เวลาที่ใช้ในการเดินทาง (นาที)"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
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
            >
              บันทึกข้อมูล
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
    </Box>
  );
};

export default Coop04Page;