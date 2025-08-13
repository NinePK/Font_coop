"use client";

import { TeacherGuard } from "@/components/RoleGuard";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  ArrowBack,
  Assignment,
  Person,
  Business,
  CalendarToday,
  CheckCircle,
  Pending,
  Visibility,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WeeklyReport {
  id: number;
  week: number;
  startdate: string;
  enddate: string;
  job: string;
  status: string;
  created_at: string;
  training: {
    user: {
      fname: string;
      sname: string;
      username: string;
    };
    job: {
      entrepreneur: {
        nameTh: string;
      };
    };
  };
}

const TeacherReports = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ดึงข้อมูลรายงานของนิสิตที่อาจารย์ดูแล
  useEffect(() => {
    if (user && !loading) {
      fetchReports();
    }
  }, [user, loading]);

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      // TODO: เรียก API เพื่อดึงรายงานของนิสิตที่อาจารย์ดูแล
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/teacher/${user?.id}/reports`);
      // const data = await response.json();
      // setReports(data);
      
      // Mock data สำหรับตัวอย่าง
      const mockReports: WeeklyReport[] = [
        {
          id: 1,
          week: 1,
          startdate: "2024-06-01",
          enddate: "2024-06-07",
          job: "พัฒนาระบบจัดการข้อมูลลูกค้า",
          status: "pending",
          created_at: "2024-06-08T10:30:00Z",
          training: {
            user: {
              fname: "สมชาย",
              sname: "ใจดี",
              username: "64123001"
            },
            job: {
              entrepreneur: {
                nameTh: "บริษัท เทคโนโลยี จำกัด"
              }
            }
          }
        },
        {
          id: 2,
          week: 2,
          startdate: "2024-06-08",
          enddate: "2024-06-14",
          job: "ทดสอบระบบและแก้ไขข้อผิดพลาด",
          status: "approved",
          created_at: "2024-06-15T09:15:00Z",
          training: {
            user: {
              fname: "สมชาย",
              sname: "ใจดี",
              username: "64123001"
            },
            job: {
              entrepreneur: {
                nameTh: "บริษัท เทคโนโลยี จำกัด"
              }
            }
          }
        },
        {
          id: 3,
          week: 1,
          startdate: "2024-06-15",
          enddate: "2024-06-21",
          job: "วิเคราะห์ความต้องการระบบใหม่",
          status: "pending",
          created_at: "2024-06-22T14:20:00Z",
          training: {
            user: {
              fname: "สมหญิง",
              sname: "รักเรียน",
              username: "64123002"
            },
            job: {
              entrepreneur: {
                nameTh: "บริษัท ซอฟต์แวร์ จำกัด"
              }
            }
          }
        }
      ];
      
      setReports(mockReports);
      setLoadingReports(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoadingReports(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'pending': return 'รอการตรวจ';
      case 'rejected': return 'ไม่อนุมัติ';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'pending': return <Pending />;
      default: return <Assignment />;
    }
  };

  // กรองรายงานตาม status
  const filteredReports = statusFilter === "all" 
    ? reports 
    : reports.filter(report => report.status === statusFilter);

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const approvedCount = reports.filter(r => r.status === 'approved').length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <TeacherGuard>
      <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        {/* Header */}
        <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => router.push("/")}>
              <ArrowBack />
            </IconButton>
            <Assignment sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              รายงานนิสิต
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Summary Cards */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #1976d2' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Assignment sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold" color="#1976d2">
                    {reports.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    รายงานทั้งหมด
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #ff9800' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Pending sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold" color="#ff9800">
                    {pendingCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    รอการตรวจ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card elevation={3} sx={{ borderRadius: 2, border: '2px solid #4caf50' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold" color="#4caf50">
                    {approvedCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    อนุมัติแล้ว
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Reports Table */}
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6" color="primary.main">
                      รายงานประจำสัปดาห์
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>กรองสถานะ</InputLabel>
                      <Select
                        value={statusFilter}
                        label="กรองสถานะ"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="all">ทั้งหมด</MenuItem>
                        <MenuItem value="pending">รอการตรวจ</MenuItem>
                        <MenuItem value="approved">อนุมัติแล้ว</MenuItem>
                        <MenuItem value="rejected">ไม่อนุมัติ</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              
              {loadingReports ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>นิสิต</strong></TableCell>
                        <TableCell><strong>บริษัท</strong></TableCell>
                        <TableCell><strong>สัปดาห์ที่</strong></TableCell>
                        <TableCell><strong>ช่วงวันที่</strong></TableCell>
                        <TableCell><strong>ลักษณะงาน</strong></TableCell>
                        <TableCell><strong>วันที่ส่ง</strong></TableCell>
                        <TableCell><strong>สถานะ</strong></TableCell>
                        <TableCell><strong>การจัดการ</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography fontWeight="medium">
                                  {report.training.user.fname} {report.training.user.sname}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {report.training.user.username}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Business sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="body2">
                                {report.training.job.entrepreneur.nameTh}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`สัปดาห์ที่ ${report.week}`}
                              color="primary"
                              size="small"
                              icon={<CalendarToday />}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(report.startdate).toLocaleDateString('th-TH')} - 
                              {new Date(report.enddate).toLocaleDateString('th-TH')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {report.job}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(report.created_at).toLocaleDateString('th-TH')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(report.status)}
                              color={getStatusColor(report.status) as any}
                              size="small"
                              icon={getStatusIcon(report.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => router.push(`/teacher/reports/${report.id}`)}
                            >
                              ดูรายละเอียด
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
    </TeacherGuard>
  );
};

export default TeacherReports;