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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  LinearProgress,
  Divider,
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
  Business,
  Visibility,
  Timeline,
  Assessment,
  TrendingUp,
} from "@mui/icons-material";
import NotificationPanel from "@/components/NotificationPanel";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  userId: number;
  user: {
    id: number;
    fname: string;
    sname: string;
    username: string;
    major: {
      majorTh: string;
      faculty: {
        facultyTh: string;
      };
    };
  };
  job: {
    name: string;
    entrepreneur: {
      nameTh: string;
    };
  };
  startdate: string;
  enddate: string;
  status: number;
}

interface DashboardStats {
  totalStudents: number;
  activeInternships: number;
  completedReports: number;
  pendingReports: number;
}

const HomePage = () => {
  const { 
    user, 
    loading, 
    logout, 
    checkAuth,
    isStudent, 
    isTeacher, 
    isOfficer, 
    isAdmin,
    getRoleDisplayName 
  } = useAuth();
  const router = useRouter();
  
  // Teacher-specific state
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeInternships: 0,
    completedReports: 0,
    pendingReports: 0,
  });

  // Auto-redirect จะทำงานอัตโนมัติใน useAuth hook แล้ว

  // ดึงข้อมูลสำหรับอาจารย์
  useEffect(() => {
    if (user && !loading && isTeacher) {
      fetchStudents();
      fetchDashboardStats();
    }
  }, [user, loading, isTeacher]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      const response = await fetch(`${backUrl}/teacher/students/${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Mock data for dashboard stats
      setStats({
        totalStudents: 15,
        activeInternships: 12,
        completedReports: 45,
        pendingReports: 3,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'success';
      case 2: return 'primary';
      case 0: return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'กำลังฝึกงาน';
      case 2: return 'เสร็จสิ้น';
      case 0: return 'รอเริ่ม';
      default: return 'ไม่ทราบ';
    }
  };


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
          {/* แจ้งเตือนสำหรับอาจารย์ */}
          {isTeacher && <NotificationPanel userId={user.id} />}
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

        {/* Content Based on User Role */}
        {isTeacher ? (
          // Teacher Dashboard with Student Management
          <>
            {/* Statistics Cards for Teacher */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #1976d2' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Groups sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                      {stats.totalStudents}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      นิสิตทั้งหมด
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #4caf50' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <TrendingUp sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#4caf50">
                      {stats.activeInternships}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      กำลังฝึกงาน
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #ff9800' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Assignment sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#ff9800">
                      {stats.completedReports}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      รายงานเสร็จสิ้น
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #f44336' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Assignment sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" color="#f44336">
                      {stats.pendingReports}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      รออนุมัติ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Progress Cards */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      การจัดการนิสิต
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        ความคืบหน้าการฝึกงาน
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.activeInternships / stats.totalStudents) * 100} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {stats.activeInternships} จาก {stats.totalStudents} คน
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        อัตราส่งรายงาน
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.completedReports / (stats.completedReports + stats.pendingReports)) * 100} 
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {Math.round((stats.completedReports / (stats.completedReports + stats.pendingReports)) * 100)}% เสร็จสิ้น
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      การแจ้งเตือน
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`${stats.pendingReports} รายงานรออนุมัติ`}
                        color="error" 
                        size="small"
                        sx={{ mb: 1, mr: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      • ตรวจสอบรายงานประจำสัปดาห์ใหม่
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • อัปเดตคะแนนการประเมิน
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • ติดตามความคืบหน้านิสิต
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Students Table */}
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" color="primary.main">
                    รายชื่อนิสิตที่ดูแล ({students.length} คน)
                  </Typography>
                </Box>
                
                {loadingStudents ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>รหัสนิสิต</strong></TableCell>
                          <TableCell><strong>ชื่อ-นามสกุล</strong></TableCell>
                          <TableCell><strong>สาขาวิชา</strong></TableCell>
                          <TableCell><strong>บริษัท</strong></TableCell>
                          <TableCell><strong>ตำแหน่ง</strong></TableCell>
                          <TableCell><strong>วันที่เริ่ม-สิ้นสุด</strong></TableCell>
                          <TableCell><strong>สถานะ</strong></TableCell>
                          <TableCell><strong>เอกสาร & รายงาน</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id} hover>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                                  <Person />
                                </Avatar>
                                {student.user.username}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="medium">
                                {student.user.fname} {student.user.sname}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="textSecondary">
                                {student.user.major.majorTh}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {student.user.major.faculty.facultyTh}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Business sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="body2">
                                  {student.job.entrepreneur.nameTh}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {student.job.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(student.startdate).toLocaleDateString('th-TH')}
                              </Typography>
                              <Typography variant="body2">
                                {new Date(student.enddate).toLocaleDateString('th-TH')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusText(student.status)}
                                color={getStatusColor(student.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box display="flex" flexDirection="column" gap={1}>
                                <Box display="flex" gap={1}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Visibility />}
                                    onClick={() => router.push(`/teacher/students/${student.id}`)}
                                    fullWidth
                                  >
                                    ข้อมูลนิสิต
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Description />}
                                    onClick={() => router.push(`/teacher/documents/${student.id}`)}
                                    fullWidth
                                    color="secondary"
                                  >
                                    เอกสาร
                                  </Button>
                                </Box>
                                <Box display="flex" gap={1}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Timeline />}
                                    onClick={() => router.push(`/teacher/reports/${student.id}`)}
                                    fullWidth
                                    color="success"
                                  >
                                    รายงานสัปดาห์
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Assessment />}
                                    onClick={() => router.push(`/teacher/evaluation/${student.id}`)}
                                    fullWidth
                                    color="warning"
                                  >
                                    ประเมินผล
                                  </Button>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          // Student users - show documents directly
          <>
            {isStudent && (
              <>
                {/* User Information Card */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
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
                            {/* <Typography variant="body1">
                              <strong>หลักสูตร:</strong> {user.major?.degree}
                            </Typography> */}
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>w
                  </Grid>

                  {/* Quick Actions Card */}
                  <Grid item xs={12} md={6}>
                    <Fade in={true} timeout={1200}>
                      <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Assignment sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6" color="primary.main">
                              เมนูเพิ่มเติม
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
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
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<Visibility />}
                                onClick={() => router.push("/documents/summary")}
                                sx={{
                                  py: 1.5,
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontSize: "1rem",
                                }}
                              >
                                สรุปข้อมูล COOP ทั้งหมด
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                </Grid>

                {/* เอกสารสหกิจศึกษา */}
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}>
                  📋 เอกสารสหกิจศึกษา
                </Typography>

                <Grid container spacing={3}>
                  {[
                    {
                      number: "01",
                      title: "ใบรายงานตัวสหกิจศึกษา",
                      description: "แบบฟอร์มลงทะเบียนเข้าร่วมโครงการสหกิจศึกษา",
                      icon: <Assignment />,
                      category: "สมัคร",
                      color: "#1976d2"
                    },
                    {
                      number: "04",
                      title: "แบบฟอร์มแจ้งรายละเอียดที่พัก",
                      description: "ข้อมูลที่พักระหว่างการปฏิบัติงาน",
                      icon: <Groups />,
                      category: "ที่พัก",
                      color: "#7b1fa2"
                    },
                    {
                      number: "06",
                      title: "แบบฟอร์มแจ้งแผนการปฏิบัติงาน",
                      description: "แผนการทำงานระหว่างการฝึกงาน",
                      icon: <Timeline />,
                      category: "แผนงาน",
                      color: "#d32f2f"
                    },
                    {
                      number: "07",
                      title: "แบบฟอร์มแจ้งโครงร่างรายงาน",
                      description: "โครงร่างรายงานการปฏิบัติงาน",
                      icon: <Description />,
                      category: "รายงาน",
                      color: "#303f9f"
                    },
                    {
                      number: "10",
                      title: "แบบฟอร์มยืนยันส่งรายงานการปฏิบัติงาน",
                      description: "ยืนยันส่งรายงาน Work Term Report",
                      icon: <Assessment />,
                      category: "ยืนยัน",
                      color: "#4caf50"
                    },
                    {
                      number: "11",
                      title: "แบบฟอร์มรายละเอียดการปฏิบัติงาน",
                      description: "รายละเอียดเกี่ยวกับการปฏิบัติงาน (หลังกลับจากสถานประกอบการ)",
                      icon: <Business />,
                      category: "รายงาน",
                      color: "#303f9f"
                    },
                    {
                      number: "12",
                      title: "แบบฟอร์มประเมินตนเองในการปฏิบัติงาน",
                      description: "การประเมินตนเองของนิสิต 7 หมวดการประเมิน",
                      icon: <Person />,
                      category: "ประเมิน",
                      color: "#455a64"
                    }
                  ].map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Fade in={true} timeout={800 + (index * 100)}>
                        <Card 
                          elevation={3} 
                          sx={{ 
                            height: "100%", 
                            display: "flex", 
                            flexDirection: "column",
                            borderRadius: 3,
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: "50%",
                                  bgcolor: doc.color,
                                  color: "white",
                                  mr: 2,
                                }}
                              >
                                {doc.icon}
                              </Box>
                              <Chip
                                label={doc.category}
                                size="small"
                                sx={{
                                  bgcolor: doc.color,
                                  color: "white",
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Box>
                            
                            <Typography variant="h6" gutterBottom color="primary.main">
                              COOP-{doc.number}
                            </Typography>
                            
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                              {doc.title}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary">
                              {doc.description}
                            </Typography>
                          </CardContent>
                          
                          <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => router.push(`/documents/coop${doc.number}`)}
                              sx={{
                                bgcolor: doc.color,
                                "&:hover": {
                                  bgcolor: doc.color,
                                  filter: "brightness(1.1)",
                                },
                                borderRadius: 2,
                                textTransform: "none",
                              }}
                            >
                              เปิดเอกสาร
                            </Button>
                          </Box>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            
            {/* สำหรับเจ้าหน้าที่ */}
            {isOfficer && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Fade in={true} timeout={1000}>
                    <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <SupervisorAccount sx={{ mr: 1, color: "primary.main" }} />
                          <Typography variant="h6" color="primary.main">
                            จัดการระบบ
                          </Typography>
                        </Box>
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
                          เข้าสู่ระบบจัดการ
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Fade in={true} timeout={1200}>
                    <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Groups sx={{ mr: 1, color: "primary.main" }} />
                          <Typography variant="h6" color="primary.main">
                            จัดการผู้ใช้
                          </Typography>
                        </Box>
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
                          จัดการข้อมูลผู้ใช้
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
