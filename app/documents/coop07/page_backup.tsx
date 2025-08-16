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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Save,
  Cancel,
  Description,
  Assignment,
  TrendingUp,
  PlaylistAdd,
  Delete,
} from "@mui/icons-material";
import Link from "next/link";

interface ReportChapter {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
}

interface ReportOutline {
  chapterTitle: string;
  chapterDescription: string;
  subChapters: string[];
}

const Coop07Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  
  // สำหรับข้อมูลรายงาน
  const [reportTitle, setReportTitle] = useState<string>("");
  const [reportType, setReportType] = useState<string>("");
  const [reportObjective, setReportObjective] = useState<string>("");
  const [reportScope, setReportScope] = useState<string>("");
  const [reportMethodology, setReportMethodology] = useState<string>("");
  const [expectedResults, setExpectedResults] = useState<string>("");
  
  // สำหรับโครงร่างรายงาน
  const [reportOutline, setReportOutline] = useState<ReportOutline[]>([]);
  const [newChapterTitle, setNewChapterTitle] = useState<string>("");
  const [newChapterDescription, setNewChapterDescription] = useState<string>("");
  const [newSubChapter, setNewSubChapter] = useState<string>("");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(-1);
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // โครงร่างมาตรฐานที่แนะนำ
  const recommendedChapters: ReportChapter[] = [
    {
      id: "ch1",
      title: "บทที่ 1 บทนำ",
      description: "ความเป็นมา วัตถุประสงค์ ขอบเขตของการศึกษา",
      isRequired: true
    },
    {
      id: "ch2", 
      title: "บทที่ 2 ข้อมูลสถานประกอบการ",
      description: "ประวัติ โครงสร้างองค์กร และข้อมูลทั่วไปของสถานประกอบการ",
      isRequired: true
    },
    {
      id: "ch3",
      title: "บทที่ 3 การปฏิบัติงาน", 
      description: "รายละเอียดงานที่ปฏิบัติ กระบวนการทำงาน และเครื่องมือที่ใช้",
      isRequired: true
    },
    {
      id: "ch4",
      title: "บทที่ 4 ผลการปฏิบัติงาน",
      description: "ผลงานที่ได้รับ ปัญหาที่พบและการแก้ไข",
      isRequired: true
    },
    {
      id: "ch5",
      title: "บทที่ 5 สรุปและข้อเสนอแนะ",
      description: "สรุปผลการปฏิบัติงาน ข้อเสนอแนะ และประโยชน์ที่ได้รับ",
      isRequired: true
    }
  ];

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
            if (data && data.length > 0) {
              setTraining(data[0]);
              // ตั้งชื่อรายงานเริ่มต้น
              setReportTitle(`รายงานการปฏิบัติงานสหกิจศึกษา ณ ${data[0].job?.entrepreneur?.nameTh || 'สถานประกอบการ'}`);
            }
          }
        } catch (error) {
          console.error("Error fetching training data:", error);
        }
      };
      fetchTraining();
    }
  }, [user, currentSemester]);

  // โหลดโครงร่างมาตรฐาน
  useEffect(() => {
    const defaultOutline = recommendedChapters.map(chapter => ({
      chapterTitle: chapter.title,
      chapterDescription: chapter.description,
      subChapters: []
    }));
    setReportOutline(defaultOutline);
  }, []);

  // ฟังก์ชันเพิ่มบท
  const addChapter = () => {
    if (!newChapterTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกชื่อบท',
        severity: 'warning'
      });
      return;
    }

    const newChapter: ReportOutline = {
      chapterTitle: newChapterTitle,
      chapterDescription: newChapterDescription,
      subChapters: []
    };

    setReportOutline([...reportOutline, newChapter]);
    setNewChapterTitle("");
    setNewChapterDescription("");
  };

  // ฟังก์ชันเพิ่มหัวข้อย่อย
  const addSubChapter = (chapterIndex: number) => {
    if (!newSubChapter.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกหัวข้อย่อย',
        severity: 'warning'
      });
      return;
    }

    const updatedOutline = [...reportOutline];
    updatedOutline[chapterIndex].subChapters.push(newSubChapter);
    setReportOutline(updatedOutline);
    setNewSubChapter("");
    setSelectedChapterIndex(-1);
  };

  // ฟังก์ชันลบบท
  const removeChapter = (index: number) => {
    const updatedOutline = reportOutline.filter((_, i) => i !== index);
    setReportOutline(updatedOutline);
  };

  // ฟังก์ชันลบหัวข้อย่อย
  const removeSubChapter = (chapterIndex: number, subIndex: number) => {
    const updatedOutline = [...reportOutline];
    updatedOutline[chapterIndex].subChapters = updatedOutline[chapterIndex].subChapters.filter((_, i) => i !== subIndex);
    setReportOutline(updatedOutline);
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    if (!reportTitle.trim() || !reportType || !reportObjective.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
        severity: 'error'
      });
      return;
    }

    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      trainingId: training?.id,
      chapters: JSON.stringify({
        reportTitle,
        reportType,
        reportObjective,
        reportScope,
        reportMethodology,
        expectedResults,
        reportOutline
      })
    };

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/reportoutline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save report outline');
      }

      // แสดงข้อความสำเร็จ
      setSnackbar({
        open: true,
        message: 'บันทึกโครงร่างรายงานเรียบร้อยแล้ว',
        severity: 'success'
      });
      
      // รอ 2 วินาทีแล้วกลับไปหน้าหลัก
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        severity: 'error'
      });
    }
  };

  // ฟังก์ชันยกเลิก
  const handleCancel = () => {
    if (confirm("คุณต้องการยกเลิกการกรอกแบบฟอร์มหรือไม่?")) {
      router.back();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            แบบฟอร์มแจ้งโครงร่างรายงาน
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Link href="/documents" style={{ textDecoration: 'none', color: 'inherit' }}>เอกสารสหกิจศึกษา</Link>
          <Typography color="text.primary">โครงร่างรายงาน</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            แบบแจ้งโครงร่างรายงานการปฏิบัติงานสหกิจศึกษา
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Coop-07
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
          {training && training.job && (
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                ข้อมูลสถานประกอบการ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ชื่อสถานประกอบการ"
                    value={training.job.entrepreneur?.nameTh || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ตำแหน่งงาน"
                    value={training.job.name || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* ข้อมูลรายงาน */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลทั่วไปของรายงาน
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="ชื่อรายงาน *"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>ประเภทรายงาน *</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="ประเภทรายงาน *"
                  >
                    <MenuItem value="internship">รายงานการฝึกงาน</MenuItem>
                    <MenuItem value="cooperative">รายงานการปฏิบัติงานสหกิจศึกษา</MenuItem>
                    <MenuItem value="project">รายงานโครงงาน</MenuItem>
                    <MenuItem value="research">รายงานการวิจัย</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="วัตถุประสงค์ของรายงาน *"
                  value={reportObjective}
                  onChange={(e) => setReportObjective(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ขอบเขตของรายงาน"
                  value={reportScope}
                  onChange={(e) => setReportScope(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="วิธีการดำเนินงาน"
                  value={reportMethodology}
                  onChange={(e) => setReportMethodology(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ผลที่คาดว่าจะได้รับ"
                  value={expectedResults}
                  onChange={(e) => setExpectedResults(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* โครงร่างรายงาน */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              โครงร่างรายงาน
            </Typography>
            
            {/* แสดงโครงร่างปัจจุบัน */}
            <Box mb={3}>
              {reportOutline.map((chapter, chapterIndex) => (
                <Card key={chapterIndex} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box flexGrow={1}>
                        <Typography variant="h6" color="primary.main" gutterBottom>
                          {chapter.chapterTitle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {chapter.chapterDescription}
                        </Typography>
                        
                        {/* หัวข้อย่อย */}
                        {chapter.subChapters.length > 0 && (
                          <Box mt={2}>
                            <Typography variant="subtitle2" gutterBottom>
                              หัวข้อย่อย:
                            </Typography>
                            <List dense>
                              {chapter.subChapters.map((subChapter, subIndex) => (
                                <ListItem key={subIndex} sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <Typography variant="body2">•</Typography>
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={subChapter}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => removeSubChapter(chapterIndex, subIndex)}
                                    sx={{ ml: 1 }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                        {/* เพิ่มหัวข้อย่อย */}
                        {selectedChapterIndex === chapterIndex ? (
                          <Box mt={2} display="flex" gap={1}>
                            <TextField
                              size="small"
                              placeholder="หัวข้อย่อย"
                              value={newSubChapter}
                              onChange={(e) => setNewSubChapter(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addSubChapter(chapterIndex);
                                }
                              }}
                              sx={{ flexGrow: 1 }}
                            />
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => addSubChapter(chapterIndex)}
                            >
                              เพิ่ม
                            </Button>
                            <Button
                              size="small"
                              onClick={() => setSelectedChapterIndex(-1)}
                            >
                              ยกเลิก
                            </Button>
                          </Box>
                        ) : (
                          <Box mt={2}>
                            <Button
                              size="small"
                              startIcon={<PlaylistAdd />}
                              onClick={() => setSelectedChapterIndex(chapterIndex)}
                            >
                              เพิ่มหัวข้อย่อย
                            </Button>
                          </Box>
                        )}
                      </Box>
                      
                      <IconButton
                        color="error"
                        onClick={() => removeChapter(chapterIndex)}
                        sx={{ ml: 2 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* เพิ่มบทใหม่ */}
            <Card sx={{ bgcolor: 'grey.50' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  เพิ่มบทใหม่
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="ชื่อบท"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      fullWidth
                      margin="normal"
                      placeholder="เช่น บทที่ 6 การวิเคราะห์และการปรับปรุง"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="คำอธิบายบท"
                      value={newChapterDescription}
                      onChange={(e) => setNewChapterDescription(e.target.value)}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                      placeholder="อธิบายเนื้อหาที่จะครอบคลุมในบทนี้"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<PlaylistAdd />}
                      onClick={addChapter}
                    >
                      เพิ่มบท
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* ข้อแนะนำ */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              ข้อแนะนำการเขียนโครงร่าง:
            </Typography>
            <Typography variant="body2">
              • โครงร่างควรมี 5-7 บทหลัก<br/>
              • แต่ละบทควรมีหัวข้อย่อยที่ชัดเจน<br/>
              • ควรเรียงลำดับเนื้อหาอย่างต่อเนื่องและสมเหตุสมผล<br/>
              • ทบทวนโครงร่างกับอาจารย์ที่ปรึกษาก่อนเริ่มเขียนรายงาน
            </Typography>
          </Alert>

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
              บันทึกโครงร่าง
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Coop07Page;