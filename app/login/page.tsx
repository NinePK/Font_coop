// app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginType = 'student-teacher' | 'mentor' | '';

const LoginPage = () => {
  const [loginType, setLoginType] = useState<LoginType>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLoginTypeSelect = (type: LoginType) => {
    setLoginType(type);
    setError('');
    setUsername('');
    setPassword('');
    setEmail('');
  };

  const handleStudentTeacherLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'การล็อกอินล้มเหลว');
      }

      // บันทึก token ลงใน cookie
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      
      // Redirect ไปยังหน้า home
      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMentorLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'การล็อกอินล้มเหลว');
      }

      // บันทึก token ลงใน cookie
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      
      // Redirect ไปยังหน้า home
      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (loginType === 'mentor') {
      handleMentorLogin();
    } else if (loginType === 'student-teacher') {
      handleStudentTeacherLogin();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const renderLoginForm = () => {
    if (loginType === 'student-teacher') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1 font-medium">
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1 font-medium">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !username || !password}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
              loading || !username || !password
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      );
    }

    if (loginType === 'mentor') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="กรอกอีเมล"
              required
            />
          </div>
          
          <div>
            <label htmlFor="mentor-password" className="block text-gray-700 mb-1 font-medium">
              รหัสผ่าน
            </label>
            <input
              id="mentor-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
              loading || !email || !password ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบพนักงานที่ปรึกษา'}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ระบบสหกิจศึกษา</h1>
            <p className="text-gray-600">กรุณาเลือกประเภทการเข้าสู่ระบบ</p>
          </div>

          {!loginType ? (
            <div className="space-y-4">
              <button 
                onClick={() => handleLoginTypeSelect('student-teacher')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>นิสิต / อาจารย์</span>
                </div>
              </button>
              
              <button 
                onClick={() => handleLoginTypeSelect('mentor')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6.001" />
                  </svg>
                  <span>พนักงานที่ปรึกษา</span>
                </div>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  เข้าสู่ระบบ
                  {loginType === 'student-teacher' && 'นิสิต/อาจารย์'}
                  {loginType === 'mentor' && 'พนักงานที่ปรึกษา'}
                </h2>
                <button
                  onClick={() => handleLoginTypeSelect('')}
                  className="text-gray-500 hover:text-gray-700 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {renderLoginForm()}
            </div>
          )}

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500 space-x-4">
              <Link href="/test-login" className="text-blue-500 hover:underline">
                ทดสอบระบบ
              </Link>
              <Link href="/admin-login" className="text-blue-500 hover:underline">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;