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

  // Auto redirect effects - จะทำงานอัตโนมัติในหน้าที่เรียกใช้
  useEffect(() => {
    // Auto redirect for auth check
    if (!loading && !user) {
      // Only redirect if we're not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        router.push("/login");
      }
    }
  }, [loading, user, router]);

  const checkAuth = () => {
    return !loading && !!user;
  };

  const checkRole = (role: UserRole) => {
    return !loading && user && hasRole(user, role);
  };

  const checkTeacher = () => {
    return !loading && canAccessTeacherRoutes(user);
  };

  const checkStudent = () => {
    return !loading && canAccessStudentRoutes(user);
  };

  const checkAdmin = () => {
    return !loading && canAccessAdminRoutes(user);
  };

  return {
    user,
    loading,
    logout,
    checkAuth,
    checkRole,
    checkTeacher,
    checkStudent,
    checkAdmin,
    
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