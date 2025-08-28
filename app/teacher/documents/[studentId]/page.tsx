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
  category: "pre-training" | "during-training" | "post-training";
  comment?: string;
  approvedBy?: string;
  rejectedReason?: string;
  formData?: any;
  documentType?: string;
  submissionHistory?: {
    date: string;
    action: 'submitted' | 'approved' | 'rejected';
    comment?: string;
    by?: string;
  }[];
}

const TeacherStudentDocuments = () => {
  const { user, loading } = useAuth();
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


  // ดึงข้อมูลนิสิตและเอกสาร
  useEffect(() => {
    if (user && !loading && studentId) {
      fetchStudentInfo();
      fetchStudentDocuments();
    }
  }, [user, loading, studentId]);

  const fetchStudentInfo = async () => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      
      // เรียกใช้ API เดิมก่อน (จะต้องแก้ไข backend ภายหลัง) 
      const response = await fetch(`${backUrl}/teacher/students/${user?.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Cannot fetch assigned students`);
      }
      
      const students = await response.json();
      const currentStudent = students.find((s: Student) => s.id.toString() === studentId);
      
      if (currentStudent) {
        setStudent(currentStudent);
      } else {
        setError('ไม่พบข้อมูลนิสิตหรือนิสิตคนนี้ไม่ได้อยู่ในความดูแลของคุณ');
      }
    } catch (error) {
      console.error('Error fetching student info:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต');
    }
  };

  const fetchStudentDocuments = async () => {
    try {
      setLoadingData(true);
      
      // เรียกใช้ API route ของ Next.js
      const response = await fetch(`/api/teacher/student-documents/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Cannot fetch documents`);
      }
      
      const documentsData = await response.json();
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error fetching student documents:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร');
    } finally {
      setLoadingData(false);
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

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'pre-training': return '#1976d2';
      case 'during-training': return '#ed6c02'; 
      case 'post-training': return '#2e7d32';
      default: return '#757575';
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
      // เรียกใช้ API route ของ Next.js
      const response = await fetch(`/api/teacher/student-documents/${studentId}/${selectedDocument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: actionType === 'approve' ? 'approved' : 'rejected',
          comment: approvalComment.trim(),
          teacher_id: user?.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update document status');
      }

      // รีเฟรชข้อมูลเอกสาร
      await fetchStudentDocuments();

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
      console.error('Error updating document approval:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตสถานะเอกสาร กรุณาลองใหม่อีกครั้ง',
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

  // Group documents by category
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

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("/")}>
            <ArrowBack />
          </IconButton>
          <Description sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            เอกสารของนิสิต
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
              <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid #e0e0e0',
                background: `linear-gradient(135deg, ${getCategoryColor(category as Document['category'])}15 0%, ${getCategoryColor(category as Document['category'])}05 100%)`
              }}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ color: getCategoryColor(category as Document['category']) }}>
                    {getCategoryIcon(category as Document['category'])}
                  </Box>
                  <Typography variant="h6" sx={{ ml: 1, color: getCategoryColor(category as Document['category']) }}>
                    เอกสาร{getCategoryName(category as Document['category'])}
                  </Typography>
                  <Chip 
                    label={`${docs.length} รายการ`} 
                    size="small" 
                    sx={{ 
                      ml: 2,
                      bgcolor: getCategoryColor(category as Document['category']),
                      color: 'white'
                    }}
                  />
                </Box>
              </Box>
              
              <List sx={{ pt: 0 }}>
                {docs.map((doc, index) => (
                  <div key={doc.id}>
                    <ListItem 
                      sx={{ 
                        py: 3,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ color: getCategoryColor(doc.category) }}>
                          {getStatusIcon(doc.status)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Box>
                            <Typography variant="h6" gutterBottom component="div">
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
                          <Box>
                            <Typography variant="body1" color="textSecondary" gutterBottom component="div">
                              {doc.description}
                            </Typography>
                            {doc.submittedDate && (
                              <Typography variant="caption" color="textSecondary" component="div" sx={{ mt: 0.5 }}>
                                ส่งเมื่อ: {new Date(doc.submittedDate).toLocaleDateString('th-TH')}
                                {doc.approvedDate && (
                                  <> | อนุมัติเมื่อ: {new Date(doc.approvedDate).toLocaleDateString('th-TH')}</>
                                )}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={2} flexDirection="column">
                        {/* Status Chip */}
                        <Chip
                          icon={getStatusIcon(doc.status)}
                          label={getStatusText(doc.status)}
                          color={getStatusColor(doc.status) as any}
                          size="medium"
                        />
                        
                        {/* Action buttons for submitted documents */}
                        {doc.status === 'submitted' && (
                          <Box display="flex" gap={1}>
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
                          </Box>
                        )}
                        
                        {/* View details button for submitted documents */}
                        {(doc.status === 'submitted' && doc.formData) && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(doc)}
                          >
                            ดูข้อมูลที่กรอก
                          </Button>
                        )}
                        
                        {/* History button */}
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
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            🏢 ข้อมูลการฝึกงาน
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">สถานประกอบการ</Typography>
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
                              <Typography variant="body1">{selectedDocument.formData.advisor1 || 'ไม่ได้ระบุ'}</Typography>
                            </Grid>
                            {selectedDocument.formData.advisor2 && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">อาจารย์ที่ปรึกษา 2</Typography>
                                <Typography variant="body1">{selectedDocument.formData.advisor2}</Typography>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* COOP-04 Data */}
                {selectedDocument.documentType === 'COOP-04' && (
                  <Grid container spacing={3}>
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
                                {selectedDocument.formData.accommodationType === 'apartment' ? 'อพาร์ทเมนท์' :
                                 selectedDocument.formData.accommodationType === 'dormitory' ? 'หอพัก' : 'อื่นๆ'}
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
                              <Typography variant="body2" color="textSecondary">โทรศัพท์</Typography>
                              <Typography variant="body1">{selectedDocument.formData.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">ที่อยู่</Typography>
                              <Typography variant="body1">
                                {selectedDocument.formData.address} ตำบล{selectedDocument.formData.subdistrict} 
                                อำเภอ{selectedDocument.formData.district} จังหวัด{selectedDocument.formData.province} {selectedDocument.formData.postalCode}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            📞 ผู้ติดต่อฉุกเฉิน
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ชื่อผู้ติดต่อ</Typography>
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

                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            🚌 การเดินทาง
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">วิธีการเดินทาง</Typography>
                              <Typography variant="body1">
                                {selectedDocument.formData.travelMethod === 'bus' ? 'รถโดยสารประจำทาง' : 'อื่นๆ'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">รายละเอียด</Typography>
                              <Typography variant="body1">{selectedDocument.formData.travelDetails}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">ระยะทาง</Typography>
                              <Typography variant="body1">{selectedDocument.formData.distanceKm} กิโลเมตร</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">เวลาที่ใช้</Typography>
                              <Typography variant="body1">{selectedDocument.formData.travelTime} นาที</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
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
                
                {selectedDocument.submissionHistory && selectedDocument.submissionHistory.length > 0 ? (
                  <List>
                    {selectedDocument.submissionHistory.map((history, index) => (
                      <ListItem key={index} divider={index < selectedDocument.submissionHistory!.length - 1}>
                        <ListItemIcon>
                          {history.action === 'submitted' && <Assignment />}
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TeacherStudentDocuments;