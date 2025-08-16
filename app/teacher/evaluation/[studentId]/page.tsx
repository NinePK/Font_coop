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
  CircularProgress,
  Grid,
  Alert,
  Rating,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ArrowBack,
  Assessment,
  Person,
  Star,
  Save,
  Grade,
  TrendingUp,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
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

interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
  category: string;
}

interface Evaluation {
  criteriaId: string;
  score: number;
  comment: string;
}

interface WeeklyReport {
  id: number;
  week: number;
  startdate: string;
  enddate: string;
  status: string;
  job: string;
  exp: string;
}

const TeacherEvaluation = () => {
  const { user, loading, checkTeacher } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [overallComment, setOverallComment] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // การตรวจสอบสิทธิ์จะทำงานอัตโนมัติใน useAuth hook แล้ว

  // เกณฑ์การประเมิน
  const evaluationCriteria: EvaluationCriteria[] = [
    {
      id: "technical_skills",
      name: "ทักษะทางเทคนิค",
      description: "ความสามารถในการประยุกต์ใช้ความรู้ทางเทคนิค",
      maxScore: 5,
      weight: 30,
      category: "ทักษะวิชาชีพ"
    },
    {
      id: "problem_solving", 
      name: "การแก้ไขปัญหา",
      description: "ความสามารถในการวิเคราะห์และแก้ไขปัญหา",
      maxScore: 5,
      weight: 25,
      category: "ทักษะวิชาชีพ"
    },
    {
      id: "communication",
      name: "การสื่อสาร",
      description: "ทักษะการสื่อสารและการทำงานร่วมกับผู้อื่น",
      maxScore: 5,
      weight: 20,
      category: "ทักษะส่วนบุคคล"
    },
    {
      id: "responsibility",
      name: "ความรับผิดชอบ",
      description: "การส่งงานตรงเวลาและคุณภาพของงาน",
      maxScore: 5,
      weight: 15,
      category: "ทักษะส่วนบุคคล"
    },
    {
      id: "learning_attitude",
      name: "เจตคติในการเรียนรู้",
      description: "ความกระตือรือร้นในการเรียนรู้สิ่งใหม่",
      maxScore: 5,
      weight: 10,
      category: "ทักษะส่วนบุคคล"
    }
  ];

  // ดึงข้อมูลนิสิตและรายงาน
  useEffect(() => {
    if (user && !loading && studentId) {
      fetchStudentInfo();
      fetchReports();
      initializeEvaluations();
    }
  }, [user, loading, studentId]);

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
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  const fetchReports = async () => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      
      // ดึงรายงานทั้งหมดแล้วกรองตาม training_id
      const response = await fetch(`${backUrl}/weekly`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Cannot fetch reports`);
      }
      
      const allReports = await response.json();
      
      // กรองรายงานที่เป็นของนิสิตคนนี้
      const studentReports = allReports.filter((report: any) => 
        report.training_id?.toString() === studentId
      );
      
      setReports(studentReports);
      setLoadingData(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoadingData(false);
    }
  };

  const initializeEvaluations = () => {
    const initialEvaluations = evaluationCriteria.map(criteria => ({
      criteriaId: criteria.id,
      score: 0,
      comment: ""
    }));
    setEvaluations(initialEvaluations);
  };

  const handleScoreChange = (criteriaId: string, score: number) => {
    setEvaluations(prev => 
      prev.map(evalItem => 
        evalItem.criteriaId === criteriaId 
          ? { ...evalItem, score } 
          : evalItem
      )
    );
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setEvaluations(prev => 
      prev.map(evalItem => 
        evalItem.criteriaId === criteriaId 
          ? { ...evalItem, comment } 
          : evalItem
      )
    );
  };

  const calculateOverallScore = () => {
    const totalWeightedScore = evaluations.reduce((total, evalItem) => {
      const criteria = evaluationCriteria.find(c => c.id === evalItem.criteriaId);
      return total + (evalItem.score * (criteria?.weight || 0));
    }, 0);
    
    const totalWeight = evaluationCriteria.reduce((total, criteria) => total + criteria.weight, 0);
    
    return totalWeightedScore / totalWeight;
  };

  const getGrade = (score: number) => {
    if (score >= 4.5) return { grade: 'A', color: 'success' };
    if (score >= 4.0) return { grade: 'B+', color: 'success' };
    if (score >= 3.5) return { grade: 'B', color: 'primary' };
    if (score >= 3.0) return { grade: 'C+', color: 'primary' };
    if (score >= 2.5) return { grade: 'C', color: 'warning' };
    if (score >= 2.0) return { grade: 'D+', color: 'warning' };
    if (score >= 1.5) return { grade: 'D', color: 'error' };
    return { grade: 'F', color: 'error' };
  };

  const handleSaveEvaluation = async () => {
    setSaving(true);
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('บันทึกผลการประเมินเรียบร้อยแล้ว');
      router.push('/teacher/students');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const overallScore = calculateOverallScore();
  const gradeInfo = getGrade(overallScore);
  const completedReports = reports.filter(r => r.status !== 'pending').length;

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/teacher/students")}>
            <ArrowBack />
          </IconButton>
          <Assessment sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ประเมินผลการฝึกงาน
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
                    bgcolor: "warning.main",
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
                <Box display="flex" gap={1} mt={2}>
                  <Chip
                    icon={<TrendingUp />}
                    label={`รายงาน ${completedReports} ฉบับ`}
                    color="primary"
                  />
                  <Chip
                    icon={<Grade />}
                    label={`คะแนนรวม ${overallScore.toFixed(2)}`}
                    color={gradeInfo.color as any}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Overall Score Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color="primary.main">
            ผลการประเมินรวม
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box textAlign="center">
                <Typography variant="h2" color={`${gradeInfo.color}.main`}>
                  {gradeInfo.grade}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  เกรด
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box textAlign="center">
                <Typography variant="h3" color="text.primary">
                  {overallScore.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  คะแนนเฉลี่ย (จาก 5.00)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Rating 
                value={overallScore} 
                precision={0.1} 
                readOnly 
                size="large" 
                sx={{ fontSize: 40 }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Evaluation Form */}
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" color="primary.main" gutterBottom>
              การประเมินรายหัวข้อ
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>หัวข้อการประเมิน</strong></TableCell>
                    <TableCell><strong>น้ำหนัก (%)</strong></TableCell>
                    <TableCell><strong>คะแนน</strong></TableCell>
                    <TableCell><strong>คะแนนถ่วงน้ำหนัก</strong></TableCell>
                    <TableCell><strong>ความคิดเห็น</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evaluationCriteria.map((criteria) => {
                    const evaluation = evaluations.find(e => e.criteriaId === criteria.id);
                    const weightedScore = (evaluation?.score || 0) * criteria.weight;
                    
                    return (
                      <TableRow key={criteria.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {criteria.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {criteria.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${criteria.weight}%`} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Rating
                            value={evaluation?.score || 0}
                            onChange={(_, value) => handleScoreChange(criteria.id, value || 0)}
                            max={criteria.maxScore}
                            size="small"
                          />
                          <Typography variant="body2" color="textSecondary">
                            {evaluation?.score || 0}/{criteria.maxScore}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {weightedScore.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="ความคิดเห็น..."
                            value={evaluation?.comment || ""}
                            onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            {/* Overall Comment */}
            <Typography variant="subtitle1" gutterBottom>
              ความคิดเห็นโดยรวม
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="ข้อคิดเห็นและข้อเสนอแนะโดยรวมสำหรับนิสิต..."
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={() => router.push('/teacher/students')}
                startIcon={<Cancel />}
              >
                ยกเลิก
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveEvaluation}
                startIcon={<Save />}
                disabled={saving}
                sx={{ minWidth: 150 }}
              >
                {saving ? <CircularProgress size={20} /> : 'บันทึกการประเมิน'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TeacherEvaluation;