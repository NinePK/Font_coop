"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Grid,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Assignment,
  Person,
  CalendarToday,
  Work,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface WeeklyReport {
  id: number;
  week: number;
  startdate: string;
  enddate: string;
  training_id: number;
  job: string;
  problem: string;
  fixed: string;
  course_fixed: string;
  exp: string;
  suggestion: string;
  department: string;
  status: string;
  created_at: {
    Time: string;
    Valid: boolean;
  };
}

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

const TeacherReports = () => {
  const { user, loading, checkTeacher } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // การตรวจสอบสิทธิ์จะทำงานอัตโนมัติใน useAuth hook แล้ว

  // ดึงข้อมูลรายงานของนิสิต
  useEffect(() => {
    if (user && !loading && studentId) {
      fetchReports();
      fetchStudentInfo();
    }
  }, [user, loading, studentId]);

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      setError(null);
      
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      
      // ดึงรายงานทั้งหมดแล้วกรองตาม training_id
      const response = await fetch(`${backUrl}/weekly`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Cannot fetch reports`);
      }
      
      const allReports = await response.json();
      console.log('All reports:', allReports);
      
      // กรองรายงานที่เป็นของนิสิตคนนี้
      const studentReports = allReports.filter((report: WeeklyReport) => 
        report.training_id?.toString() === studentId
      );
      
      console.log('Student reports:', studentReports);
      setReports(studentReports);
      setLoadingReports(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      setLoadingReports(false);
      setReports([]);
    }
  };

  const fetchStudentInfo = async () => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      
      // ดึงข้อมูลนิสิตที่อาจารย์ดูแล
      const response = await fetch(`${backUrl}/teacher/students/${user?.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Cannot fetch student info`);
      }
      
      const students = await response.json();
      const currentStudent = students.find((s: Student) => s.id.toString() === studentId);
      
      if (currentStudent) {
        setStudent(currentStudent);
      }
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good': return 'success';
      case 'normal': return 'primary';
      case 'bad': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good': return <CheckCircle />;
      case 'normal': return <Warning />;
      case 'bad': return <ErrorIcon />;
      default: return <Assignment />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good': return 'ดี';
      case 'normal': return 'ปกติ';
      case 'bad': return 'ต้องปรับปรุง';
      default: return status;
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
          <IconButton edge="start" color="inherit" onClick={() => router.push("/teacher/students")}>
            <ArrowBack />
          </IconButton>
          <Assignment sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            รายงานประจำสัปดาห์
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Student Info Card */}
        {student && (
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
                  <Person fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  {student.user.fname} {student.user.sname}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  รหัสนิสิต: {student.user.username}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {student.user.major.majorTh} | {student.user.major.faculty.facultyTh}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  ฝึกงานที่: {student.job.entrepreneur.nameTh} ({student.job.name})
                </Typography>
                <Chip
                  label={`รายงานทั้งหมด ${reports.length} ฉบับ`}
                  color="primary"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Reports */}
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" color="primary.main">
                รายงานประจำสัปดาห์
              </Typography>
            </Box>
            
            {loadingReports ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : reports.length === 0 ? (
              <Box p={4} textAlign="center">
                <Assignment sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  ยังไม่มีรายงาน
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  นิสิตยังไม่ได้ส่งรายงานประจำสัปดาห์
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 3 }}>
                {reports.map((report, index) => (
                  <Paper
                    key={report.id}
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    {/* Report Header */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {report.week}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            สัปดาห์ที่ {report.week}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={0.5}>
                            <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                            <Typography variant="body2" color="textSecondary">
                              {new Date(report.startdate).toLocaleDateString('th-TH')} - {new Date(report.enddate).toLocaleDateString('th-TH')}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Chip
                          icon={getStatusIcon(report.status)}
                          label={getStatusText(report.status)}
                          color={getStatusColor(report.status) as any}
                          sx={{ mr: 1 }}
                        />
                        {report.department && (
                          <Chip
                            icon={<Work />}
                            label={report.department}
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Report Content */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          งานที่ทำ
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {report.job || 'ไม่ระบุ'}
                        </Typography>

                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          ปัญหาที่พบ
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {report.problem || 'ไม่มีปัญหา'}
                        </Typography>

                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          วิธีการแก้ไข
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {report.fixed || 'ไม่ระบุ'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          วิชาที่นำมาใช้
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {report.course_fixed || 'ไม่ระบุ'}
                        </Typography>

                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          ประสบการณ์ที่ได้รับ
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {report.exp || 'ไม่ระบุ'}
                        </Typography>

                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          ข้อเสนอแนะ
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {report.suggestion || 'ไม่มี'}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Report Footer */}
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="textSecondary">
                        ส่งรายงานเมื่อ: {report.created_at?.Valid ? new Date(report.created_at.Time).toLocaleString('th-TH') : 'ไม่ระบุ'}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TeacherReports;