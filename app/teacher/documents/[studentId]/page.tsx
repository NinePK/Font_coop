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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  ButtonGroup,
} from "@mui/material";
import {
  ArrowBack,
  Description,
  Person,
  CheckCircle,
  Schedule,
  Warning,
  Download,
  Upload,
  Assignment,
  BusinessCenter,
  School,
  ThumbUp,
  ThumbDown,
  Visibility,
  History,
  Comment,
  Close,
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

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: "pending" | "submitted" | "approved" | "rejected";
  submittedDate?: string;
  approvedDate?: string;
  downloadUrl?: string;
  category: "pre-training" | "during-training" | "post-training";
  comment?: string;
  approvedBy?: string;
  rejectedReason?: string;
  formData?: any; // ข้อมูลที่นิสิตกรอก
  submissionHistory?: {
    date: string;
    action: 'submitted' | 'approved' | 'rejected';
    comment?: string;
    by?: string;
  }[];
}

const TeacherDocuments = () => {
  const { user, loading, checkTeacher } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for approval management
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [historyDialog, setHistoryDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [processing, setProcessing] = useState(false);

  // การตรวจสอบสิทธิ์จะทำงานอัตโนมัติใน useAuth hook แล้ว

  // ข้อมูลจำลองเอกสารที่ต้องกรอก
  const mockDocuments: Document[] = [
    // เอกสารก่อนฝึกงาน
    {
      id: "doc-01",
      name: "หนังสือขอฝึกงาน",
      description: "หนังสือขออนุญาตฝึกงานจากมหาวิทยาลัย",
      required: true,
      status: "approved",
      submittedDate: "2024-09-01",
      approvedDate: "2024-09-05",
      downloadUrl: "/documents/request-letter.pdf",
      category: "pre-training"
    },
    {
      id: "doc-02", 
      name: "แผนการฝึกงาน",
      description: "แผนการฝึกงานและเป้าหมายการเรียนรู้",
      required: true,
      status: "submitted",
      submittedDate: "2024-09-10",
      category: "pre-training",
      submissionHistory: [
        {
          date: "2024-09-10",
          action: "submitted",
          comment: "ส่งแผนการฝึกงานเวอร์ชันแรก",
          by: "นิสิต"
        }
      ]
    },
    {
      id: "doc-03",
      name: "หนังสือจากบริษัท",
      description: "หนังสือตอบรับจากบริษัทที่จะฝึกงาน",
      required: true,
      status: "approved",
      submittedDate: "2024-09-08",
      approvedDate: "2024-09-12",
      downloadUrl: "/documents/company-acceptance.pdf",
      category: "pre-training"
    },
    // เอกสารระหว่างฝึกงาน
    {
      id: "doc-04",
      name: "รายงานการฝึกงานครั้งที่ 1",
      description: "รายงานการฝึกงานประจำเดือนที่ 1",
      required: true,
      status: "approved",
      submittedDate: "2024-10-30",
      approvedDate: "2024-11-02",
      category: "during-training"
    },
    {
      id: "doc-05",
      name: "รายงานการฝึกงานครั้งที่ 2", 
      description: "รายงานการฝึกงานประจำเดือนที่ 2",
      required: true,
      status: "submitted",
      submittedDate: "2024-11-30",
      category: "during-training",
      submissionHistory: [
        {
          date: "2024-11-30",
          action: "submitted",
          comment: "ส่งรายงานประจำเดือนที่ 2",
          by: "นิสิต"
        }
      ]
    },
    {
      id: "doc-06",
      name: "บันทึกการเข้าร่วมกิจกรรม",
      description: "บันทึกการเข้าร่วมกิจกรรมหรือการประชุมต่างๆ",
      required: false,
      status: "pending",
      category: "during-training"
    },
    // เอกสารหลังฝึกงาน
    {
      id: "doc-07",
      name: "รายงานสรุปการฝึกงาน",
      description: "รายงานสรุปผลการฝึกงานฉบับสมบูรณ์",
      required: true,
      status: "pending",
      category: "post-training"
    },
    {
      id: "doc-08",
      name: "แบบประเมินจากบริษัท",
      description: "แบบประเมินผลการฝึกงานจากพี่เลี้ยง/บริษัท",
      required: true,
      status: "pending",
      category: "post-training"
    },
    {
      id: "doc-09",
      name: "หนังสือขอบคุณ",
      description: "หนังสือขอบคุณส่งให้บริษัทที่ให้ฝึกงาน",
      required: true,
      status: "pending", 
      category: "post-training"
    }
  ];

  // ดึงข้อมูลนิสิต
  useEffect(() => {
    if (user && !loading && studentId) {
      fetchStudentInfo();
      setDocuments(mockDocuments);
      setLoadingData(false);
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

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'success';
      case 'submitted': return 'warning';
      case 'rejected': return 'error';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'submitted': return <Schedule />;
      case 'rejected': return <Warning />;
      case 'pending': return <Assignment />;
      default: return <Assignment />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'submitted': return 'รอการพิจารณา';
      case 'rejected': return 'ไม่อนุมัติ';
      case 'pending': return 'รอการส่ง';
      default: return status;
    }
  };

  const getCategoryName = (category: Document['category']) => {
    switch (category) {
      case 'pre-training': return 'ก่อนฝึกงาน';
      case 'during-training': return 'ระหว่างฝึกงาน';
      case 'post-training': return 'หลังฝึกงาน';
      default: return category;
    }
  };

  const getCategoryIcon = (category: Document['category']) => {
    switch (category) {
      case 'pre-training': return <School />;
      case 'during-training': return <BusinessCenter />;
      case 'post-training': return <Assignment />;
      default: return <Description />;
    }
  };

  // Handle approval/rejection
  const handleApprovalAction = (doc: Document, action: 'approve' | 'reject') => {
    setSelectedDocument(doc);
    setActionType(action);
    setApprovalComment('');
    setApprovalDialog(true);
  };

  const handleApprovalSubmit = async () => {
    if (!selectedDocument || !actionType) return;

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedDocuments = documents.map(doc => {
        if (doc.id === selectedDocument.id) {
          const newHistory = doc.submissionHistory || [];
          newHistory.push({
            date: new Date().toISOString().split('T')[0],
            action: actionType,
            comment: approvalComment,
            by: `${user?.fname} ${user?.sname}`
          });

          return {
            ...doc,
            status: actionType === 'approve' ? 'approved' as const : 'rejected' as const,
            approvedDate: actionType === 'approve' ? new Date().toISOString().split('T')[0] : undefined,
            approvedBy: actionType === 'approve' ? `${user?.fname} ${user?.sname}` : undefined,
            rejectedReason: actionType === 'reject' ? approvalComment : undefined,
            comment: approvalComment,
            submissionHistory: newHistory
          };
        }
        return doc;
      });

      setDocuments(updatedDocuments);
      setSnackbar({
        open: true,
        message: `เอกสาร "${selectedDocument.name}" ${actionType === 'approve' ? 'อนุมัติ' : 'ไม่อนุมัติ'}เรียบร้อยแล้ว`,
        severity: 'success'
      });
      
      setApprovalDialog(false);
      setSelectedDocument(null);
      setApprovalComment('');
      setActionType(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleViewHistory = (doc: Document) => {
    setSelectedDocument(doc);
    setHistoryDialog(true);
  };

  const handleViewDetails = (doc: Document) => {
    setSelectedDocument(doc);
    setDetailDialog(true);
  };

  const getProgress = () => {
    const total = documents.filter(doc => doc.required).length;
    const completed = documents.filter(doc => doc.required && doc.status === 'approved').length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const groupedDocuments = documents.reduce((groups, doc) => {
    if (!groups[doc.category]) {
      groups[doc.category] = [];
    }
    groups[doc.category].push(doc);
    return groups;
  }, {} as Record<string, Document[]>);

  if (loading || loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const progress = getProgress();

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/teacher/students")}>
            <ArrowBack />
          </IconButton>
          <Description sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            เอกสารการฝึกงาน
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
                    bgcolor: "secondary.main",
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
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Progress Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color="primary.main">
            ความคืบหน้าเอกสาร
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress.percentage} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress.percentage)}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="textSecondary">
            เอกสารจำเป็น: {progress.completed}/{progress.total} ฉบับ
          </Typography>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Documents by Category */}
        {Object.entries(groupedDocuments).map(([category, docs]) => (
          <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }} key={category}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Box display="flex" alignItems="center">
                  {getCategoryIcon(category as Document['category'])}
                  <Typography variant="h6" color="primary.main" sx={{ ml: 1 }}>
                    เอกสาร{getCategoryName(category as Document['category'])}
                  </Typography>
                  <Chip 
                    label={`${docs.length} รายการ`} 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                </Box>
              </Box>
              
              <List sx={{ pt: 0 }}>
                {docs.map((doc, index) => (
                  <div key={doc.id}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        {getStatusIcon(doc.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1">
                              {doc.name}
                              {doc.required && (
                                <Chip 
                                  label="จำเป็น" 
                                  size="small" 
                                  color="error" 
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box component="div">
                            <Typography variant="body2" color="textSecondary" gutterBottom component="div">
                              {doc.description}
                            </Typography>
                            {doc.submittedDate && (
                              <Typography variant="caption" color="textSecondary" component="div">
                                ส่งเมื่อ: {new Date(doc.submittedDate).toLocaleDateString('th-TH')}
                                {doc.approvedDate && (
                                  <> | อนุมัติเมื่อ: {new Date(doc.approvedDate).toLocaleDateString('th-TH')}</>
                                )}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={1} flexDirection="column">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            icon={getStatusIcon(doc.status)}
                            label={getStatusText(doc.status)}
                            color={getStatusColor(doc.status) as any}
                            size="small"
                          />
                          {doc.downloadUrl && doc.status === 'approved' && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Download />}
                              onClick={() => window.open(doc.downloadUrl, '_blank')}
                            >
                              ดาวน์โหลด
                            </Button>
                          )}
                        </Box>
                        
                        {/* Action buttons for teachers */}
                        <Box display="flex" gap={1} mt={1}>
                          {doc.status === 'submitted' && (
                            <ButtonGroup size="small">
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<ThumbUp />}
                                onClick={() => handleApprovalAction(doc, 'approve')}
                              >
                                อนุมัติ
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                startIcon={<ThumbDown />}
                                onClick={() => handleApprovalAction(doc, 'reject')}
                              >
                                ไม่อนุมัติ
                              </Button>
                            </ButtonGroup>
                          )}
                          
                          {(doc.status === 'submitted' || doc.formData) && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewDetails(doc)}
                            >
                              ดูรายละเอียด
                            </Button>
                          )}
                          
                          {doc.submissionHistory && doc.submissionHistory.length > 0 && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<History />}
                              onClick={() => handleViewHistory(doc)}
                            >
                              ประวัติ
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                    {index < docs.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Approval Dialog */}
        <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {actionType === 'approve' ? 'อนุมัติเอกสาร' : 'ไม่อนุมัติเอกสาร'}
          </DialogTitle>
          <DialogContent>
            {selectedDocument && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedDocument.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {selectedDocument.description}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={actionType === 'approve' ? 'ความเห็น (ไม่จำเป็น)' : 'เหตุผลที่ไม่อนุมัติ'}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder={actionType === 'approve' ? 'เพิ่มความเห็นหรือข้อเสนอแนะ...' : 'กรุณาระบุเหตุผลที่ไม่อนุมัติ...'}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApprovalDialog(false)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleApprovalSubmit}
              variant="contained"
              color={actionType === 'approve' ? 'success' : 'error'}
              disabled={processing || (actionType === 'reject' && !approvalComment.trim())}
              startIcon={processing ? <CircularProgress size={16} /> : null}
            >
              {processing ? 'กำลังดำเนินการ...' : (actionType === 'approve' ? 'อนุมัติ' : 'ไม่อนุมัติ')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Document Detail Dialog */}
        <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center">
              <Visibility sx={{ mr: 1 }} />
              รายละเอียดเอกสาร
            </Box>
            <IconButton onClick={() => setDetailDialog(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedDocument && selectedDocument.formData && (
              <Box>
                <Typography variant="h6" gutterBottom color="primary.main">
                  {selectedDocument.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                  {selectedDocument.description}
                </Typography>
                
                {/* COOP-01 Data */}
                {selectedDocument.documentType === 'COOP-01' && (
                  <Grid container spacing={3}>
                    {/* ข้อมูลส่วนตัว */}
                    <Grid item xs={12}>
                      <Card elevation={2} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            📋 ข้อมูลนิสิต
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชื่อไทย</Typography>
                              <Typography variant="body1">{selectedDocument.formData.studentName}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชื่ออังกฤษ</Typography>
                              <Typography variant="body1">{selectedDocument.formData.studentNameEn}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">รหัสนิสิต</Typography>
                              <Typography variant="body1">{selectedDocument.formData.studentId}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชั้นปี</Typography>
                              <Typography variant="body1">ปี {selectedDocument.formData.year}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">หลักสูตร</Typography>
                              <Typography variant="body1">{selectedDocument.formData.degree}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">สาขาวิชา</Typography>
                              <Typography variant="body1">{selectedDocument.formData.major}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">คณะ</Typography>
                              <Typography variant="body1">{selectedDocument.formData.faculty}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ภาคการศึกษา</Typography>
                              <Typography variant="body1">{selectedDocument.formData.semester}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* ข้อมูลการฝึกงาน */}
                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            🏢 ข้อมูลการฝึกงานที่เลือก
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ชื่อสถานประกอบการ</Typography>
                              <Typography variant="body1">{selectedDocument.formData.selectedEntrepreneur}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ตำแหน่งงาน</Typography>
                              <Typography variant="body1">{selectedDocument.formData.selectedJob}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">วันที่เริ่มงาน</Typography>
                              <Typography variant="body1">{new Date(selectedDocument.formData.startDate).toLocaleDateString('th-TH')}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">วันที่สิ้นสุดงาน</Typography>
                              <Typography variant="body1">{new Date(selectedDocument.formData.endDate).toLocaleDateString('th-TH')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">อาจารย์ที่ปรึกษา 1</Typography>
                              <Typography variant="body1">{selectedDocument.formData.advisor1}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">อาจารย์ที่ปรึกษา 2</Typography>
                              <Typography variant="body1">{selectedDocument.formData.advisor2}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* COOP-04 Data */}
                {selectedDocument.documentType === 'COOP-04' && (
                  <Grid container spacing={3}>
                    {/* ข้อมูลนิสิตและบริษัท */}
                    <Grid item xs={12}>
                      <Card elevation={2} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            👤 ข้อมูลนิสิตและสถานประกอบการ
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชื่อ-นามสกุล</Typography>
                              <Typography variant="body1">{selectedDocument.formData.studentName}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">รหัสนิสิต</Typography>
                              <Typography variant="body1">{selectedDocument.formData.studentId}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">คณะ</Typography>
                              <Typography variant="body1">{selectedDocument.formData.faculty}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">สาขาวิชา</Typography>
                              <Typography variant="body1">{selectedDocument.formData.major}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ชื่อบริษัท</Typography>
                              <Typography variant="body1">{selectedDocument.formData.companyName}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ที่อยู่บริษัท</Typography>
                              <Typography variant="body1">{selectedDocument.formData.companyAddress}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">โทรศัพท์บริษัท</Typography>
                              <Typography variant="body1">{selectedDocument.formData.companyPhone}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">อีเมลบริษัท</Typography>
                              <Typography variant="body1">{selectedDocument.formData.companyEmail}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* ข้อมูลที่พัก */}
                    <Grid item xs={12}>
                      <Card elevation={2} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            🏠 ข้อมูลที่พัก
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ประเภทที่พัก</Typography>
                              <Typography variant="body1">
                                {selectedDocument.formData.accommodationType === 'dormitory' ? 'หอพัก' :
                                 selectedDocument.formData.accommodationType === 'apartment' ? 'อพาร์ทเมนท์' :
                                 selectedDocument.formData.accommodationType === 'condo' ? 'คอนโดมิเนียม' :
                                 selectedDocument.formData.accommodationType === 'house' ? 'บ้านเช่า' :
                                 selectedDocument.formData.accommodationType === 'relative' ? 'บ้านญาติ' :
                                 selectedDocument.formData.accommodationType === 'company' ? 'ที่พักของบริษัท' : 'อื่นๆ'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชื่อที่พัก</Typography>
                              <Typography variant="body1">{selectedDocument.formData.accommodationName}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">เลขห้อง</Typography>
                              <Typography variant="body1">{selectedDocument.formData.roomNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">เบอร์โทรศัพท์</Typography>
                              <Typography variant="body1">{selectedDocument.formData.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ที่อยู่</Typography>
                              <Typography variant="body1">{selectedDocument.formData.address}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ตำบล/แขวง</Typography>
                              <Typography variant="body1">{selectedDocument.formData.subdistrict}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">อำเภอ/เขต</Typography>
                              <Typography variant="body1">{selectedDocument.formData.district}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">จังหวัด</Typography>
                              <Typography variant="body1">{selectedDocument.formData.province}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">รหัสไปรษณีย์</Typography>
                              <Typography variant="body1">{selectedDocument.formData.postalCode}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* ข้อมูลผู้ติดต่อฉุกเฉิน */}
                    <Grid item xs={12}>
                      <Card elevation={2} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            📞 ผู้ติดต่อกรณีฉุกเฉิน
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชื่อ-นามสกุล</Typography>
                              <Typography variant="body1">{selectedDocument.formData.emergencyContact}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">เบอร์โทรศัพท์</Typography>
                              <Typography variant="body1">{selectedDocument.formData.emergencyPhone}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ความสัมพันธ์</Typography>
                              <Typography variant="body1">{selectedDocument.formData.emergencyRelation}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* ข้อมูลการเดินทาง */}
                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            🚌 ข้อมูลการเดินทางไปสถานประกอบการ
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">วิธีการเดินทาง</Typography>
                              <Typography variant="body1">
                                {selectedDocument.formData.travelMethod === 'car' ? 'รถยนต์ส่วนตัว' :
                                 selectedDocument.formData.travelMethod === 'motorcycle' ? 'รถจักรยานยนต์' :
                                 selectedDocument.formData.travelMethod === 'bus' ? 'รถโดยสารประจำทาง' :
                                 selectedDocument.formData.travelMethod === 'taxi' ? 'แท็กซี่' :
                                 selectedDocument.formData.travelMethod === 'company' ? 'รถรับส่งของบริษัท' : 'อื่นๆ'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">รายละเอียดการเดินทาง</Typography>
                              <Typography variant="body1">{selectedDocument.formData.travelDetails}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ระยะทางประมาณ</Typography>
                              <Typography variant="body1">{selectedDocument.formData.distanceKm} กิโลเมตร</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">เวลาที่ใช้ในการเดินทาง</Typography>
                              <Typography variant="body1">{selectedDocument.formData.travelTime} นาที</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                <Divider sx={{ my: 3 }} />
                <Typography variant="caption" color="textSecondary">
                  ส่งโดย: {selectedDocument.formData.submittedBy} • {new Date(selectedDocument.formData.submittedDate).toLocaleString('th-TH')}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialog(false)}>
              ปิด
            </Button>
          </DialogActions>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={historyDialog} onClose={() => setHistoryDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center">
              <History sx={{ mr: 1 }} />
              ประวัติการดำเนินการ
            </Box>
            <IconButton onClick={() => setHistoryDialog(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedDocument && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedDocument.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                  {selectedDocument.description}
                </Typography>
                
                {selectedDocument.submissionHistory && selectedDocument.submissionHistory.length > 0 ? (
                  <List>
                    {selectedDocument.submissionHistory.map((history, index) => (
                      <ListItem key={index} divider={index < selectedDocument.submissionHistory!.length - 1}>
                        <ListItemIcon>
                          {history.action === 'submitted' && <Upload />}
                          {history.action === 'approved' && <CheckCircle color="success" />}
                          {history.action === 'rejected' && <Warning color="error" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2">
                                {history.action === 'submitted' && 'ส่งเอกสาร'}
                                {history.action === 'approved' && 'อนุมัติ'}
                                {history.action === 'rejected' && 'ไม่อนุมัติ'}
                              </Typography>
                              <Chip 
                                size="small" 
                                label={new Date(history.date).toLocaleDateString('th-TH')}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box component="div">
                              {history.by && (
                                <Typography variant="caption" color="textSecondary" component="div">
                                  โดย: {history.by}
                                </Typography>
                              )}
                              {history.comment && (
                                <Typography variant="body2" sx={{ mt: 0.5 }} component="div">
                                  <Comment sx={{ fontSize: 14, mr: 0.5 }} />
                                  {history.comment}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary" textAlign="center" sx={{ py: 4 }}>
                    ยังไม่มีประวัติการดำเนินการ
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Container>
    </Box>
  );
};

export default TeacherDocuments;