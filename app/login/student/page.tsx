"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // แก้ไขจาก 'next/router' เป็น 'next/navigation'
import Link from 'next/link';

// กำหนด type สำหรับ userType
type UserType = 'student' | 'teacher';

// กำหนด Props interface สำหรับ LDAPLoginForm
interface LDAPLoginFormProps {
  userType: UserType;
}

const LDAPLoginForm: React.FC<LDAPLoginFormProps> = ({ userType }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // กำหนด type mapping สำหรับ title
  const titleMap: Record<UserType, string> = {
    'student': 'นิสิต',
    'teacher': 'อาจารย์'
  };
  
  // กำหนด type ของ event parameter
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/ldap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: userType })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'การล็อกอินล้มเหลว');
      }
      
      // บันทึก token ลงใน localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect ไปยังหน้า Dashboard ตามประเภทผู้ใช้
      router.push(`/dashboard/${userType}`);
    } catch (err) {
      // กำหนด type ของ error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; กลับ
        </Link>
        
        <h1 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบสำหรับ{titleMap[userType]}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </div>
  );
};

// หน้า Login สำหรับนิสิต
const StudentLoginPage: React.FC = () => {
  return <LDAPLoginForm userType="student" />;
};

export default StudentLoginPage;