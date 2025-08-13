"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack,
  SupervisorAccount,
  Groups,
  Assignment,
  TrendingUp,
  School,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalStudents: number;
  activeInternships: number;
  completedReports: number;
  pendingReports: number;
}

const TeacherDashboard = () => {
  const { user, loading, requireTeacher } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeInternships: 0,
    completedReports: 0,
    pendingReports: 0,
  });

  // ตรวจสอบสิทธิ์การเข้าถึง
  requireTeacher();

  // ดึงข้อมูลสถิติ
  useEffect(() => {
    if (user && !loading) {
      fetchDashboardStats();
    }
  }, [user, loading]);

  const fetchDashboardStats = async () => {
    try {
      // TODO: เรียก API เพื่อดึงสถิติของอาจารย์
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/teacher/stats/${user?.id}`);
      // const data = await response.json();
      // setStats(data);
      
      // Mock data สำหรับตัวอย่าง
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/")}>
            <ArrowBack />
          </IconButton>
          <SupervisorAccount sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            แดชบอร์ดอาจารย์
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                <SupervisorAccount fontSize="large" />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                สวัสดี, {user?.title} {user?.fname} {user?.sname}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                อาจารย์ที่ปรึกษาสหกิจศึกษา
              </Typography>
              <Chip
                label="อาจารย์"
                color="primary"
                icon={<School />}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Cards */}
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

        {/* Quick Actions */}
        <Grid container spacing={4}>
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
      </Container>
    </Box>
  );
};

export default TeacherDashboard;