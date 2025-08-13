"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
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
  SupervisorAccount,
  Groups,
} from "@mui/icons-material";

const HomePage = () => {
  const { 
    user, 
    loading, 
    logout, 
    requireAuth,
    isStudent, 
    isTeacher, 
    isOfficer, 
    isAdmin,
    getRoleDisplayName 
  } = useAuth();
  const router = useRouter();

  // ตรวจสอบการเข้าสู่ระบบ
  requireAuth();


  if (loading) {
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

  if (!user) {
    return null; // จะ redirect ไปหน้า login แล้ว
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
          <IconButton color="inherit" onClick={logout}>
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
                <Box display="flex" gap={1} mt={1}>
                  <Chip
                    label={`รหัส: ${user.username}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label={getRoleDisplayName}
                    sx={{
                      bgcolor: "rgba(255,215,0,0.8)",
                      color: "#333",
                      fontWeight: "bold"
                    }}
                  />
                </Box>
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
                    {isStudent && (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>คณะ:</strong> {user.major?.faculty?.facultyTh}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>สาขาวิชา:</strong> {user.major?.majorTh}
                        </Typography>
                        <Typography variant="body1">
                          <strong>หลักสูตร:</strong> {user.major?.degree}
                        </Typography>
                      </>
                    )}
                    {isTeacher && (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>คณะ:</strong> {user.major?.faculty?.facultyTh || 'ไม่ระบุ'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>ตำแหน่ง:</strong> อาจารย์ที่ปรึกษา
                        </Typography>
                      </>
                    )}
                    {isOfficer && (
                      <Typography variant="body1">
                        <strong>ตำแหน่ง:</strong> เจ้าหน้าที่สหกิจศึกษา
                      </Typography>
                    )}
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
                    {/* เมนูสำหรับนิสิต */}
                    {isStudent && (
                      <>
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
                      </>
                    )}
                    
                    {/* เมนูสำหรับอาจารย์ */}
                    {isTeacher && (
                      <>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<Groups />}
                            onClick={() => router.push("/teacher/students")}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "1rem",
                            }}
                          >
                            นิสิตที่ดูแล
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            startIcon={<Assignment />}
                            onClick={() => router.push("/teacher/reports")}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "1rem",
                            }}
                          >
                            รายงานนิสิต
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="info"
                            startIcon={<SupervisorAccount />}
                            onClick={() => router.push("/teacher/dashboard")}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "1rem",
                            }}
                          >
                            แดชบอร์ด
                          </Button>
                        </Grid>
                      </>
                    )}
                    
                    {/* เมนูสำหรับเจ้าหน้าที่ */}
                    {isOfficer && (
                      <>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<SupervisorAccount />}
                            onClick={() => router.push("/admin/dashboard")}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "1rem",
                            }}
                          >
                            จัดการระบบ
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            startIcon={<Groups />}
                            onClick={() => router.push("/admin/users")}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "1rem",
                            }}
                          >
                            จัดการผู้ใช้
                          </Button>
                        </Grid>
                      </>
                    )}
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
