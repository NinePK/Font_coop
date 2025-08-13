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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Groups,
  Person,
  Business,
  Assignment,
  Visibility,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Student {
  id: number;
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
  status: string;
}

const TeacherStudents = () => {
  const { user, loading, requireTeacher } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // ตรวจสอบสิทธิ์การเข้าถึง
  requireTeacher();

  // ดึงข้อมูลนิสิตที่อาจารย์ดูแล
  useEffect(() => {
    if (user && !loading) {
      fetchStudents();
    }
  }, [user, loading]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      // TODO: เรียก API เพื่อดึงข้อมูลนิสิตที่อาจารย์ดูแล
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/teacher/students/${user?.id}`);
      // const data = await response.json();
      // setStudents(data);
      
      // Mock data สำหรับตัวอย่าง
      const mockStudents: Student[] = [
        {
          id: 1,
          user: {
            id: 1,
            fname: "สมชาย",
            sname: "ใจดี",
            username: "64123001",
            major: {
              majorTh: "วิทยาการคมพิวเตอร์",
              faculty: {
                facultyTh: "เทคโนโลยีสารสนเทศและการสื่อสาร"
              }
            }
          },
          job: {
            name: "นักพัฒนาเว็บไซต์",
            entrepreneur: {
              nameTh: "บริษัท เทคโนโลยี จำกัด"
            }
          },
          startdate: "2024-06-01",
          enddate: "2024-10-31",
          status: "active"
        },
        {
          id: 2,
          user: {
            id: 2,
            fname: "สมหญิง",
            sname: "รักเรียน",
            username: "64123002",
            major: {
              majorTh: "วิทยาการคมพิวเตอร์",
              faculty: {
                facultyTh: "เทคโนโลยีสารสนเทศและการสื่อสาร"
              }
            }
          },
          job: {
            name: "นักวิเคราะห์ระบบ",
            entrepreneur: {
              nameTh: "บริษัท ซอฟต์แวร์ จำกัด"
            }
          },
          startdate: "2024-06-15",
          enddate: "2024-11-15",
          status: "active"
        }
      ];
      setStudents(mockStudents);
      setLoadingStudents(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoadingStudents(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'กำลังฝึกงาน';
      case 'completed': return 'เสร็จสิ้น';
      case 'pending': return 'รอเริ่ม';
      default: return 'ไม่ทราบ';
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
          <Groups sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            นิสิตที่ดูแล
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Summary Card */}
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
                <Groups fontSize="large" />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                นิสิตที่คุณดูแล
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                จำนวน {students.length} คน
              </Typography>
              <Chip
                label={`${students.filter(s => s.status === 'active').length} คนกำลังฝึกงาน`}
                color="success"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Students Table */}
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" color="primary.main">
                รายชื่อนิสิต
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
                      <TableCell><strong>การจัดการ</strong></TableCell>
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
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => router.push(`/teacher/students/${student.id}`)}
                            sx={{ mr: 1 }}
                          >
                            ดูรายละเอียด
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Assignment />}
                            onClick={() => router.push(`/teacher/reports/${student.id}`)}
                          >
                            รายงาน
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TeacherStudents;