"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Fade,
  Paper,
  Chip,
} from "@mui/material";
import {
  Description,
  Assignment,
  Person,
  School,
  ExitToApp,
  Home,
} from "@mui/icons-material";

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อมูลจาก cookie
    const userData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (userData) {
      // ถ้ามีข้อมูลผู้ใช้ใน cookie, แปลงเป็น JSON
      setUser(JSON.parse(userData));
    } else {
      // หากไม่มีข้อมูลผู้ใช้ใน cookie, ส่งผู้ใช้กลับไปที่หน้า Login
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // ลบ cookie และส่งกลับไปหน้า login
    document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        <Typography variant="h6" color="primary">
          กำลังโหลด...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header/Navbar */}
      <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <Home sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ระบบสหกิจศึกษา - มหาวิทยาลัยพะเยา
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    fontSize: "2rem",
                  }}
                >
                  <Person fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  ยินดีต้อนรับ, {user.fname} {user.sname}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {user.fnameEn} {user.snameEn}
                </Typography>
                <Chip
                  label={`รหัสนิสิต: ${user.username}`}
                  sx={{
                    mt: 1,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        <Grid container spacing={4}>
          {/* User Information Card */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <School sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" color="primary.main">
                      ข้อมูลการศึกษา
                    </Typography>
                  </Box>
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>คณะ:</strong> {user.major?.faculty?.facultyTh}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>สาขาวิชา:</strong> {user.major?.majorTh}
                    </Typography>
                    <Typography variant="body1">
                      <strong>หลักสูตร:</strong> {user.major?.degree}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Quick Actions Card */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1200}>
              <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Assignment sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" color="primary.main">
                      เมนูหลัก
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Description />}
                        onClick={() => router.push("/documents")}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        เอกสารสหกิจศึกษา
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        startIcon={<Assignment />}
                        onClick={() => router.push("/reportWeekly")}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        รายงานประจำสัปดาห์
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
