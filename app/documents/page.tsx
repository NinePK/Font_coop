"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentGuard } from "@/components/RoleGuard";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Description,
  ArrowBack,
  Assignment,
  School,
  Business,
  LocationOn,
  Phone,
  Email,
  Person,
  Work,
  Schedule,
  Assessment,
  Hotel,
} from "@mui/icons-material";

const DocumentsPage = () => {
  const router = useRouter();

  // ข้อมูลเอกสารที่ใช้งานจริง (เฉพาะที่สร้างแล้ว)
  const documents = [
    {
      number: "01",
      title: "ใบรายงานตัวสหกิจศึกษา",
      description: "แบบฟอร์มลงทะเบียนเข้าร่วมโครงการสหกิจศึกษา",
      icon: <Assignment />,
      color: "primary",
      category: "สมัคร",
      available: true,
    },
    {
      number: "04",
      title: "แบบฟอร์มแจ้งรายละเอียดที่พัก",
      description: "ข้อมูลที่พักระหว่างการปฏิบัติงาน",
      icon: <Hotel />,
      color: "warning",
      category: "ที่พัก",
      available: true,
    },
    {
      number: "06",
      title: "แบบฟอร์มแจ้งแผนการปฏิบัติงาน",
      description: "แผนการทำงานระหว่างการฝึกงาน",
      icon: <Schedule />,
      color: "primary",
      category: "แผนงาน",
      available: true,
    },
    {
      number: "07",
      title: "แบบฟอร์มแจ้งโครงร่างรายงาน",
      description: "โครงร่างรายงานการปฏิบัติงาน",
      icon: <Description />,
      color: "secondary",
      category: "รายงาน",
      available: true,
    },
    {
      number: "10",
      title: "แบบฟอร์มยืนยันส่งรายงานการปฏิบัติงาน",
      description: "ยืนยันส่งรายงาน Work Term Report",
      icon: <Assessment />,
      color: "success",
      category: "ยืนยัน",
      available: true,
    },
    {
      number: "11",
      title: "แบบฟอร์มรายละเอียดการปฏิบัติงาน",
      description: "รายละเอียดเกี่ยวกับการปฏิบัติงาน (หลังกลับจากสถานประกอบการ)",
      icon: <Work />,
      color: "info",
      category: "รายงาน",
      available: true,
    },
    {
      number: "12",
      title: "แบบฟอร์มประเมินตนเองในการปฏิบัติงาน",
      description: "การประเมินตนเองของนิสิต 7 หมวดการประเมิน",
      icon: <Person />,
      color: "warning",
      category: "ประเมิน",
      available: true,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "สมัคร": return "#1976d2";
      case "งาน": return "#388e3c";
      case "นิเทศ": return "#f57c00";
      case "ที่พัก": return "#7b1fa2";
      case "แผนงาน": return "#d32f2f";
      case "รายงาน": return "#303f9f";
      case "ประเมิน": return "#455a64";
      default: return "#757575";
    }
  };

  return (
    <StudentGuard>
      <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push("/")}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            เอกสารสหกิจศึกษา
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: "#333" }}>
          📋 เอกสารสหกิจศึกษา
        </Typography>

        <Grid container spacing={3}>
          {documents.map((doc, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                        bgcolor: getCategoryColor(doc.category),
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
                        bgcolor: getCategoryColor(doc.category),
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
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Link href={`/documents/coop${doc.number}`} style={{ width: "100%" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: getCategoryColor(doc.category),
                        "&:hover": {
                          bgcolor: getCategoryColor(doc.category),
                          filter: "brightness(1.1)",
                        },
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      เปิดเอกสาร
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
      </Box>
    </StudentGuard>
  );
};

export default DocumentsPage;
