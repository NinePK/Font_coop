// components/RoleGuard.tsx - Component สำหรับป้องกันการเข้าถึงตาม role

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/auth';
import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import {
  Block,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
  showFallback?: boolean;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  fallbackPath = "/", 
  showFallback = true 
}: RoleGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // แสดง loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  // ตรวจสอบว่า user ล็อกอินแล้วหรือไม่
  if (!user) {
    if (showFallback) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
            <Block sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              กรุณาเข้าสู่ระบบ
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => router.push('/login')}
              sx={{ mt: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
          </Paper>
        </Box>
      );
    }
    router.push('/login');
    return null;
  }

  // ตรวจสอบสิทธิ์
  const hasAccess = allowedRoles.includes(user.role?.statusEn as UserRole);

  if (!hasAccess) {
    if (showFallback) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <Block sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              ไม่มีสิทธิ์เข้าถึง
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              สิทธิ์ปัจจุบัน: {user.role?.status || 'ไม่ทราบ'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              สิทธิ์ที่ต้องการ: {allowedRoles.join(', ')}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />}
              onClick={() => router.push(fallbackPath)}
              sx={{ mt: 2 }}
            >
              กลับหน้าหลัก
            </Button>
          </Paper>
        </Box>
      );
    }
    router.push(fallbackPath);
    return null;
  }

  // ถ้ามีสิทธิ์ให้แสดง children
  return <>{children}</>;
};

// HOC สำหรับ role-based protection
export const withRoleGuard = (
  Component: React.ComponentType<any>,
  allowedRoles: UserRole[],
  fallbackPath?: string
) => {
  return function ProtectedComponent(props: any) {
    return (
      <RoleGuard allowedRoles={allowedRoles} fallbackPath={fallbackPath}>
        <Component {...props} />
      </RoleGuard>
    );
  };
};

// Specific guards for common use cases
export const TeacherGuard = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowedRoles={[UserRole.TEACHER, UserRole.OFFICER]}>
    {children}
  </RoleGuard>
);

export const StudentGuard = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowedRoles={[UserRole.STUDENT]}>
    {children}
  </RoleGuard>
);

export const AdminGuard = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowedRoles={[UserRole.OFFICER]}>
    {children}
  </RoleGuard>
);