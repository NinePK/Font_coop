"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Button,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Alert,
  Snackbar,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Save,
  Cancel,
  Assessment,
  ExpandMore,
  CheckCircle,
  Star,
} from "@mui/icons-material";
import Link from "next/link";

interface EvaluationItem {
  id: string;
  text: string;
  score: number;
}

interface EvaluationCategory {
  id: string;
  title: string;
  items: EvaluationItem[];
}

const Coop12Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [currentSemester, setCurrentSemester] = useState<any>(null);
  
  // สำหรับการประเมิน
  const [evaluations, setEvaluations] = useState<{[key: string]: number}>({});
  const [additionalComments, setAdditionalComments] = useState<string>("");
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // เกณฑ์การประเมิน 7 หมวด
  const evaluationCategories: EvaluationCategory[] = [
    {
      id: "ethics",
      title: "1. คุณธรรม จริยธรรม",
      items: [
        { id: "ethics_1", text: "มีความซื่อสัตย์ สุจริต", score: 0 },
        { id: "ethics_2", text: "มีความเคารพกฎเกณฑ์ และ ระเบียบของหน่วยงาน", score: 0 },
        { id: "ethics_3", text: "มีความเสียสละ และ เห็นต่อประโยชน์ส่วนรวม", score: 0 },
        { id: "ethics_4", text: "มีจรรยาบรรณในวิชาชีพของตนเอง", score: 0 }
      ]
    },
    {
      id: "knowledge",
      title: "2. ความรู้",
      items: [
        { id: "knowledge_1", text: "มีความรู้ในหลักวิชาชีพที่เกี่ยวข้องกับหน้าที่ที่รับผิดชอบ", score: 0 },
        { id: "knowledge_2", text: "มีความเข้าใจในขั้นตอนและวิธีการปฏิบัติงาน", score: 0 },
        { id: "knowledge_3", text: "มีความรู้ในระดับที่สามารถปฏิบัติงานให้บรรลุเป้าหมายได้", score: 0 },
        { id: "knowledge_4", text: "มีความสามารถที่จะนำความรู้มาประยุกต์ใช้ในการทำงานได้", score: 0 },
        { id: "knowledge_5", text: "มีความสามารถทำงานที่ได้รับมอบหมายให้สำเร็จลุล่วงอย่างมีประสิทธิภาพ", score: 0 },
        { id: "knowledge_6", text: "มีความใฝ่รู้ และ แสวงหาความรู้เพิ่มเติม", score: 0 }
      ]
    },
    {
      id: "intellectual",
      title: "3. ทักษะทางปัญญา",
      items: [
        { id: "intellectual_1", text: "มีการวางแผน และ มีความสามารถในการทำงานให้แล้วเสร็จตามกำหนด", score: 0 },
        { id: "intellectual_2", text: "มีความสามารถในการรวบรวมข้อมูลต่างๆ และ ประเมินได้", score: 0 },
        { id: "intellectual_3", text: "มีความสามารถในการวิเคราะห์ และ แก้ไขปัญหาในการทำงาน", score: 0 },
        { id: "intellectual_4", text: "มีความคิดริเริ่มสร้างสรรค์", score: 0 },
        { id: "intellectual_5", text: "มีความสามารถในการนำเสนอข้อมูลต่างๆ เพื่อใช้ในการตัดสินใจ", score: 0 }
      ]
    },
    {
      id: "interpersonal",
      title: "4. ทักษะความสัมพันธ์ระหว่างบุคคลและความรับผิดชอบ",
      items: [
        { id: "interpersonal_1", text: "มีความสามารถปรับตัวให้เข้ากับบุคลากรในหน่วยงาน", score: 0 },
        { id: "interpersonal_2", text: "มีความสามารถในการติดต่อสื่อสารระหว่างบุคคล", score: 0 },
        { id: "interpersonal_3", text: "มีความสามารถในการทำงานเป็นทีม", score: 0 },
        { id: "interpersonal_4", text: "มีความเป็นผู้นำ และ เป็นผู้ตามที่ดี", score: 0 },
        { id: "interpersonal_5", text: "มีความเต็มใจที่จะรับฟังความคิดเห็นของผู้อื่นที่แตกต่างจากตนเอง", score: 0 }
      ]
    },
    {
      id: "numerical",
      title: "5. ทักษะการวิเคราะห์เชิงตัวเลข การสื่อสารและการใช้เทคโนโลยีสารสนเทศ",
      items: [
        { id: "numerical_1", text: "มีทักษะในการวิเคราะห์ และ จัดการข้อมูลเชิงตัวเลข", score: 0 },
        { id: "numerical_2", text: "มีความสามารถในการสื่อสารด้วยภาษาไทย (ฟัง พูด อ่าน เขียน)", score: 0 },
        { id: "numerical_3", text: "มีความสามารถในการสื่อสารด้วยภาษาอังกฤษ (ฟัง พูด อ่าน เขียน)", score: 0 },
        { id: "numerical_4", text: "มีความสามารถในการใช้คอมพิวเตอร์ และ โปรแกรมต่างๆ ที่เกี่ยวข้องกับการทำงาน", score: 0 }
      ]
    },
    {
      id: "aesthetics",
      title: "6. สุนทรียศิลป์",
      items: [
        { id: "aesthetics_1", text: "มีความเข้าใจ และ ภาคภูมิใจในศิลปะและวัฒนธรรมของไทย", score: 0 }
      ]
    },
    {
      id: "health",
      title: "7. ทักษะการส่งเสริมสุขภาพและพัฒนาบุคลิกภาพ",
      items: [
        { id: "health_1", text: "มีสุขภาพที่แข็งแรง และ มีสุขอนามัยที่ดี", score: 0 },
        { id: "health_2", text: "รู้จักกาลเทศะ วางตนอย่างเหมาะสม และ มีบุคลิกภาพที่ดี", score: 0 }
      ]
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
            }
          }
        } catch (error) {
          console.error("Error fetching training data:", error);
        }
      };
      fetchTraining();
    }
  }, [user, currentSemester]);

  // ดึงข้อมูล COOP-12 ที่เคยบันทึกไว้
  useEffect(() => {
    if (user) {
      const fetchExistingData = async () => {
        try {
          const response = await fetch(`/api/coop12-evaluation?userId=${user.id}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.documents && result.documents.length > 0) {
              const existingData = result.documents[0];
              console.log("Found existing COOP-12 data:", existingData);
              
              // โหลดคะแนนเดิมจากข้อมูลที่บันทึกไว้
              const loadedEvaluations: any = {};
              categories.forEach(category => {
                category.items.forEach(item => {
                  if (existingData[item.id] !== undefined) {
                    loadedEvaluations[item.id] = existingData[item.id];
                  }
                });
              });
              setEvaluations(loadedEvaluations);
            }
          }
        } catch (error) {
          console.error("Error fetching existing COOP-12 data:", error);
        }
      };
      fetchExistingData();
    }
  }, [user]);

  // ฟังก์ชันอัปเดตคะแนน
  const handleScoreChange = (itemId: string, score: number) => {
    setEvaluations(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  // คำนวณคะแนนรวมและเปอร์เซ็นต์
  const calculateProgress = () => {
    const totalItems = evaluationCategories.reduce((total, category) => total + category.items.length, 0);
    const completedItems = Object.keys(evaluations).filter(key => evaluations[key] > 0).length;
    const totalScore = Object.values(evaluations).reduce((sum, score) => sum + score, 0);
    const maxScore = totalItems * 10;
    
    return {
      completed: completedItems,
      total: totalItems,
      completedPercentage: (completedItems / totalItems) * 100,
      totalScore,
      maxScore,
      averageScore: completedItems > 0 ? totalScore / completedItems : 0
    };
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    const progress = calculateProgress();
    
    // ตรวจสอบว่าประเมินครบทุกข้อแล้ว
    if (progress.completed < progress.total) {
      setSnackbar({
        open: true,
        message: `กรุณาประเมินให้ครบทุกข้อ (เหลืออีก ${progress.total - progress.completed} ข้อ)`,
        severity: 'error'
      });
      return;
    }

    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      trainingId: training?.id,
      evaluations: JSON.stringify(evaluations),
      additionalComments,
      totalScore: progress.totalScore,
      maxScore: progress.maxScore,
      averageScore: progress.averageScore,
      completedItems: progress.completed
    };

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/selfevaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save self evaluation');
      }

      // แสดงข้อความสำเร็จ
      setSnackbar({
        open: true,
        message: `บันทึกการประเมินตนเองเรียบร้อยแล้ว คะแนนเฉลี่ย: ${progress.averageScore.toFixed(2)}/10.00`,
        severity: 'success'
      });
      
      // รอ 3 วินาทีแล้วกลับไปหน้าหลัก
      setTimeout(() => {
        router.push("/");
      }, 3000);
      
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

  const progress = calculateProgress();

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
            แบบฟอร์มประเมินตนเองในการปฏิบัติงาน
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box p={2}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>
          <Link href="/documents" style={{ textDecoration: 'none', color: 'inherit' }}>เอกสารสหกิจศึกษา</Link>
          <Typography color="text.primary">ประเมินตนเอง</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom color="primary.main">
              โครงการสหกิจศึกษามหาวิทยาลัยพะเยา
            </Typography>
            <Typography variant="h5" gutterBottom>
              แบบฟอร์มประเมินตนเองในการปฏิบัติงานของนิสิตสหกิจศึกษา
            </Typography>
            <Typography variant="h6" color="textSecondary">
              มหาวิทยาลัยพะเยา
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
              UP_Co-op 12 | (ผู้ให้ข้อมูล: นิสิตสหกิจศึกษา)
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* คำชี้แจง */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              คำชี้แจง:
            </Typography>
            <Typography variant="body2" component="div">
              1. ผู้ให้ข้อมูลในแบบประเมินนี้ คือ นิสิตสหกิจศึกษา<br/>
              2. โปรดให้ข้อมูลครบทุกข้อ เพื่อความสมบูรณ์ของการประเมินผล<br/>
              3. โปรดให้คะแนนในแต่ละหัวข้อการประเมิน หากไม่มีข้อมูลให้ใส่เครื่องหมาย – และโปรดให้ความคิดเห็นเพิ่มเติม (ถ้ามี)
            </Typography>
          </Alert>

          {/* ข้อมูลทั่วไป */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              ข้อมูลทั่วไป / Work Term Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ชื่อ-นามสกุลนิสิต"
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
                  label="หลักสูตร"
                  value={user.major?.degree || ""}
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
              <Grid item xs={12}>
                <TextField
                  label="คณะ"
                  value={user.major?.faculty?.facultyTh || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ชื่อสถานประกอบการ"
                  value={training?.job?.entrepreneur?.nameTh || "ไม่ระบุ"}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ความคืบหน้าการประเมิน */}
          <Card elevation={2} sx={{ mb: 4, bgcolor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.contrastText">
                ความคืบหน้าการประเมิน
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress.completedPercentage} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="primary.contrastText">
                    {Math.round(progress.completedPercentage)}%
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ color: 'primary.contrastText' }}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">
                    ประเมินแล้ว: <strong>{progress.completed}/{progress.total}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">
                    คะแนนรวม: <strong>{progress.totalScore}/{progress.maxScore}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">
                    คะแนนเฉลี่ย: <strong>{progress.averageScore.toFixed(2)}/10.00</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Star sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {progress.averageScore >= 8 ? 'ดีเยี่ยม' : 
                       progress.averageScore >= 6.5 ? 'ดี' : 
                       progress.averageScore >= 5 ? 'พอใช้' : 'ต้องปรับปรุง'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* หมวดการประเมิน */}
          {evaluationCategories.map((category, categoryIndex) => (
            <Accordion key={category.id} defaultExpanded={categoryIndex === 0}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" width="100%">
                  <Typography variant="h6" color="primary.main" sx={{ flexGrow: 1 }}>
                    {category.title}
                  </Typography>
                  <Chip 
                    label={`${category.items.filter(item => evaluations[item.id] > 0).length}/${category.items.length}`}
                    size="small"
                    color={category.items.every(item => evaluations[item.id] > 0) ? "success" : "default"}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {category.items.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body1" gutterBottom>
                            {item.text}
                          </Typography>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">คะแนน (เต็ม 10 คะแนน)</FormLabel>
                            <RadioGroup
                              row
                              value={evaluations[item.id] || 0}
                              onChange={(e) => handleScoreChange(item.id, parseInt(e.target.value))}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                <FormControlLabel
                                  key={score}
                                  value={score}
                                  control={<Radio size="small" />}
                                  label={score.toString()}
                                  sx={{ 
                                    '& .MuiFormControlLabel-label': { 
                                      fontSize: '0.875rem',
                                      color: evaluations[item.id] === score ? 'primary.main' : 'text.secondary'
                                    }
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                          {evaluations[item.id] > 0 && (
                            <Box mt={1}>
                              <Typography variant="body2" color="success.main">
                                <CheckCircle sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                คะแนน: {evaluations[item.id]}/10
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* ข้อคิดเห็นเพิ่มเติม */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom color="primary.main">
              ข้อคิดเห็นเพิ่มเติม / Other Comments
            </Typography>
            <TextField
              placeholder="กรุณาให้ข้อคิดเห็นเพิ่มเติมเกี่ยวกับการปฏิบัติงานสหกิจศึกษา เช่น:
• ความรู้สึกโดยรวมเกี่ยวกับการปฏิบัติงาน
• สิ่งที่ได้เรียนรู้และประสบการณ์ที่ได้รับ  
• ความท้าทายและวิธีการแก้ไขปัญหา
• ข้อเสนอแนะสำหรับการปรับปรุงโครงการสหกิจศึกษา
• แนวทางในการพัฒนาตนเองในอนาคต"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              fullWidth
              multiline
              rows={8}
              sx={{ 
                '& .MuiInputBase-input': { 
                  fontSize: '14px',
                  lineHeight: '1.6'
                }
              }}
            />
          </Box>

          {/* สรุปการประเมิน */}
          <Card elevation={3} sx={{ mb: 4, bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.contrastText">
                สรุปผลการประเมิน
              </Typography>
              <Grid container spacing={2} sx={{ color: 'success.contrastText' }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>คะแนนรวมทั้งหมด:</strong> {progress.totalScore}/{progress.maxScore} คะแนน
                  </Typography>
                  <Typography variant="body1">
                    <strong>คะแนนเฉลี่ย:</strong> {progress.averageScore.toFixed(2)}/10.00
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>จำนวนข้อที่ประเมิน:</strong> {progress.completed}/{progress.total} ข้อ
                  </Typography>
                  <Typography variant="body1">
                    <strong>ระดับการประเมิน:</strong> {
                      progress.averageScore >= 8 ? 'ดีเยี่ยม (8.00-10.00)' : 
                      progress.averageScore >= 6.5 ? 'ดี (6.50-7.99)' : 
                      progress.averageScore >= 5 ? 'พอใช้ (5.00-6.49)' : 'ต้องปรับปรุง (ต่ำกว่า 5.00)'
                    }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
              disabled={progress.completed < progress.total}
            >
              บันทึกการประเมิน
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

          {/* หมายเหตุ */}
          <Alert severity="warning" sx={{ mt: 4 }}>
            <Typography variant="body2">
              <strong>หมายเหตุ:</strong> การประเมินตนเองนี้จะช่วยให้นิสิตสามารถทบทวนและประเมินความสามารถของตนเองในการปฏิบัติงาน 
              ผลการประเมินจะเป็นข้อมูลสำหรับการพัฒนาและปรับปรุงตนเองในอนาคต 
              กรุณาให้คะแนนอย่างซื่อสัตย์และตรงตามความเป็นจริง
            </Typography>
          </Alert>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
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

export default Coop12Page;