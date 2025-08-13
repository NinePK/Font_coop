// hooks/useAuth.ts - Custom hook for authentication and authorization

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  UserRole, 
  getUserFromCookie, 
  hasRole, 
  isStudent, 
  isTeacher, 
  isOfficer, 
  isAdmin,
  canAccessTeacherRoutes,
  canAccessStudentRoutes,
  canAccessAdminRoutes,
  getRoleDisplayName
} from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = getUserFromCookie();
    setUser(userData);
    setLoading(false);
  }, []);

  const logout = () => {
    document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    router.push("/login");
  };

  const requireAuth = (redirectTo: string = "/login") => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  };

  const requireRole = (role: UserRole, redirectTo: string = "/") => {
    if (!loading && (!user || !hasRole(user, role))) {
      router.push(redirectTo);
    }
  };

  const requireTeacher = (redirectTo: string = "/") => {
    if (!loading && !canAccessTeacherRoutes(user)) {
      router.push(redirectTo);
    }
  };

  const requireStudent = (redirectTo: string = "/") => {
    if (!loading && !canAccessStudentRoutes(user)) {
      router.push(redirectTo);
    }
  };

  const requireAdmin = (redirectTo: string = "/") => {
    if (!loading && !canAccessAdminRoutes(user)) {
      router.push(redirectTo);
    }
  };

  return {
    user,
    loading,
    logout,
    requireAuth,
    requireRole,
    requireTeacher,
    requireStudent,
    requireAdmin,
    
    // Role checking functions
    isStudent: isStudent(user),
    isTeacher: isTeacher(user),
    isOfficer: isOfficer(user),
    isAdmin: isAdmin(user),
    
    // Access checking functions
    canAccessTeacherRoutes: canAccessTeacherRoutes(user),
    canAccessStudentRoutes: canAccessStudentRoutes(user),
    canAccessAdminRoutes: canAccessAdminRoutes(user),
    
    // Utility functions
    getRoleDisplayName: getRoleDisplayName(user),
    hasRole: (role: UserRole) => hasRole(user, role)
  };
};