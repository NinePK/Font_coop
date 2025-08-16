"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Edit,
  Visibility,
  CheckCircle,
  Cancel,
  Hotel,
  Assignment,
  Description,
  Work,
  Assessment,
} from "@mui/icons-material";
import Link from "next/link";

interface CoopData {
  id?: number;
  title: string;
  description: string;
  route: string;
  status: 'completed' | 'pending';
  data?: any;
  icon: React.ReactNode;
  color: string;
}

const CoopSummaryPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [coopData, setCoopData] = useState<CoopData[]>([
    {
      title: "COOP-01",
      description: "ใบรายงานตัวสหกิจศึกษา",
      route: "/documents/coop01",
      status: 'pending',
      icon: <Assignment />,
      color: "#1976D2"
    },
    {
      title: "COOP-04",
      description: "แบบแจ้งรายละเอียดที่พักระหว่างการปฏิบัติงานสหกิจศึกษา",
      route: "/documents/coop04",
      status: 'pending',
      icon: <Hotel />,
      color: "#2196F3"
    },
    {
      title: "COOP-06", 
      description: "แผนการปฏิบัติงานสหกิจศึกษา",
      route: "/documents/coop06",
      status: 'pending',
      icon: <Assignment />,
      color: "#4CAF50"
    },
    {
      title: "COOP-07",
      description: "โครงร่างรายงานการปฏิบัติงานสหกิจศึกษา", 
      route: "/documents/coop07",
      status: 'pending',
      icon: <Description />,
      color: "#FF9800"
    },
    {
      title: "COOP-11",
      description: "รายละเอียดงานที่ปฏิบัติในสหกิจศึกษา",
      route: "/documents/coop11", 
      status: 'pending',
      icon: <Work />,
      color: "#9C27B0"
    },
    {
      title: "COOP-12",
      description: "แบบประเมินตนเองการปฏิบัติงานสหกิจศึกษา",
      route: "/documents/coop12",
      status: 'pending', 
      icon: <Assessment />,
      color: "#F44336"
    }
  ]);

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

  // ดึงข้อมูล COOP ทั้งหมด
  useEffect(() => {
    if (user) {
      fetchAllCoopData();
    }
  }, [user]);

  const fetchAllCoopData = async () => {
    setLoading(true);
    try {
      const promises = [
        fetchTrainingData('COOP-01'), // COOP-01 ใช้ training API
        fetchCoopData('/api/coop04-accommodation', 'COOP-04'),
        fetchCoopData('/api/coop06-workplan', 'COOP-06'), 
        fetchCoopData('/api/coop07-outline', 'COOP-07'),
        fetchCoopData('/api/coop11-details', 'COOP-11'),
        fetchCoopData('/api/coop12-evaluation', 'COOP-12')
      ];

      const results = await Promise.allSettled(promises);
      
      setCoopData(prev => prev.map((item, index) => {
        const result = results[index];
        if (result.status === 'fulfilled' && result.value) {
          return {
            ...item,
            status: 'completed' as const,
            data: result.value,
            id: result.value.id
          };
        }
        return item;
      }));
      
    } catch (error) {
      console.error('Error fetching COOP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoopData = async (endpoint: string, type: string) => {
    try {
      const response = await fetch(`${endpoint}?userId=${user.id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          console.log(`Found ${type} data:`, result.data);
          return result.data;
        } else if (result.success && result.documents) {
          // สำหรับ API ที่ return format ต่างออกไป
          console.log(`Found ${type} data:`, result.documents);
          return result.documents[0]; // เอาข้อมูลล่าสุด
        }
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return null;
    }
  };

  const fetchTrainingData = async (type: string) => {
    try {
      const semesterResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/semester/current`);
      if (!semesterResponse.ok) return null;
      const semester = await semesterResponse.json();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/training/user/${user.id}-${semester.id}`);
      if (response.ok) {
        const result = await response.json();
        if (result && result.length > 0) {
          console.log(`Found ${type} data:`, result[0]);
          return result[0];
        }
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return null;
    }
  };

  const handleEdit = (route: string) => {
    router.push(route);
  };

  const formatDate = (dateString: string | any) => {
    try {
      if (typeof dateString === 'object' && dateString.Time) {
        return new Date(dateString.Time).toLocaleDateString('th-TH');
      }
      if (typeof dateString === 'string') {
        return new Date(dateString).toLocaleDateString('th-TH');
      }
      return '-';
    } catch {
      return '-';
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <IconButton color="inherit" onClick={() => router.push("/")}>
            <Home />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            สรุปข้อมูลเอกสาร COOP ทั้งหมด
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Typography color="text.primary">สรุปเอกสาร COOP</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        {/* ข้อมูลนิสิต */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            ข้อมูลนิสิต
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography><strong>ชื่อ-นามสกุล:</strong> {user.fname} {user.sname}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>รหัสนิสิต:</strong> {user.username}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>คณะ:</strong> {user.major?.faculty?.facultyTh || ""}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>สาขาวิชา:</strong> {user.major?.majorTh || ""}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* รายการเอกสาร COOP */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          รายการเอกสาร COOP
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>กำลังโหลดข้อมูล...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {coopData.map((item, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderLeft: `4px solid ${item.color}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box sx={{ color: item.color, mr: 2 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Box display="flex" alignItems="center" mb={2}>
                      <Chip
                        icon={item.status === 'completed' ? <CheckCircle /> : <Cancel />}
                        label={item.status === 'completed' ? 'เรียบร้อยแล้ว' : 'ยังไม่ได้กรอก'}
                        color={item.status === 'completed' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    {item.status === 'completed' && item.data && (
                      <Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                          อัพเดทล่าสุด: {formatDate(item.data.updatedAt || item.data.createdAt)}
                        </Typography>
                        {item.title === 'COOP-01' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            บริษัท: {item.data.job?.entrepreneur?.nameTh || '-'}
                          </Typography>
                        )}
                        {item.title === 'COOP-04' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            ที่พัก: {item.data.accommodationName || '-'}
                          </Typography>
                        )}
                        {item.title === 'COOP-06' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            แผนงาน: {item.data.objectives || item.data.objective1 || '-'}
                          </Typography>
                        )}
                        {item.title === 'COOP-07' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            หัวข้อ: {item.data.reportTitle || '-'}
                          </Typography>
                        )}
                        {item.title === 'COOP-11' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            ตำแหน่งงาน: {item.data.jobPosition || '-'}
                          </Typography>
                        )}
                        {item.title === 'COOP-12' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            ประเมินแล้ว: ✓
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={item.status === 'completed' ? <Edit /> : <Visibility />}
                      onClick={() => handleEdit(item.route)}
                      sx={{ backgroundColor: item.color }}
                    >
                      {item.status === 'completed' ? 'แก้ไข' : 'กรอกข้อมูล'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* สถิติ */}
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            สถิติการกรอกข้อมูล
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {coopData.filter(item => item.status === 'completed').length}
                </Typography>
                <Typography variant="body2">เรียบร้อยแล้ว</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {coopData.filter(item => item.status === 'pending').length}
                </Typography>
                <Typography variant="body2">ยังไม่ได้กรอก</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {Math.round((coopData.filter(item => item.status === 'completed').length / coopData.length) * 100)}%
                </Typography>
                <Typography variant="body2">ความสมบูรณ์</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="text.primary">
                  {coopData.length}
                </Typography>
                <Typography variant="body2">เอกสารทั้งหมด</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CoopSummaryPage;