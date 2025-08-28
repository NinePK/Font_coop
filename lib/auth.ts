// lib/auth.ts - Authentication and authorization utilities

export interface User {
  id: number;
  username: string;
  fname: string;
  sname: string;
  fnameEn: string;
  snameEn: string;
  title?: string;
  majorId?: number;
  roleId: number;
  isAdmin: number;
  role: {
    id: number;
    status: string;
    statusEn: string;
  };
  major?: {
    id: number;
    majorTh: string;
    majorEn: string;
    facultyId: number;
    faculty: {
      facultyTh: string;
      facultyEn: string;
    };
  };
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  OFFICER = 'OFFICER',
  MENTOR = 'MENTOR'
}

// Get user from cookie
export const getUserFromCookie = (): User | null => {
  if (typeof document === 'undefined') return null;
  
  const userData = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_data="))
    ?.split("=")[1];

  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Check if user has specific role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user || !user.role) return false;
  return user.role.statusEn === role;
};

// Check if user is student
export const isStudent = (user: User | null): boolean => {
  return hasRole(user, UserRole.STUDENT);
};

// Check if user is teacher
export const isTeacher = (user: User | null): boolean => {
  return hasRole(user, UserRole.TEACHER);
};

// Check if user is officer
export const isOfficer = (user: User | null): boolean => {
  return hasRole(user, UserRole.OFFICER);
};

// Check if user is mentor
export const isMentor = (user: User | null): boolean => {
  return hasRole(user, UserRole.MENTOR);
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.isAdmin === 1;
};

// Get user role display name
export const getRoleDisplayName = (user: User | null): string => {
  if (!user || !user.role) return 'ไม่ทราบสิทธิ์';
  
  switch (user.role.statusEn) {
    case UserRole.STUDENT:
      return 'นิสิต';
    case UserRole.TEACHER:
      return 'อาจารย์';
    case UserRole.OFFICER:
      return 'เจ้าหน้าที่';
    case UserRole.MENTOR:
      return 'ผู้สอนงาน/พี่เลี้ยง';
    default:
      return user.role.status || 'ไม่ทราบสิทธิ์';
  }
};

// Check if user can access teacher routes
export const canAccessTeacherRoutes = (user: User | null): boolean => {
  return isTeacher(user) || isOfficer(user) || isAdmin(user);
};

// Check if user can access student routes  
export const canAccessStudentRoutes = (user: User | null): boolean => {
  return isStudent(user) || isOfficer(user) || isAdmin(user);
};

// Check if user can access admin routes
export const canAccessAdminRoutes = (user: User | null): boolean => {
  return isAdmin(user) || isOfficer(user);
};

// Check if user can access mentor routes
export const canAccessMentorRoutes = (user: User | null): boolean => {
  return isMentor(user) || isOfficer(user) || isAdmin(user);
};