// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded p-6 mb-4">
        <h1 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h1>
        
        <div className="space-y-4">
          <Link 
            href="/login/student-teacher" 
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            นิสิตและอาจารย์
          </Link>
          
          <Link 
            href="/login/advisor" 
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            พนักงานที่ปรึกษา
          </Link>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/test-login" className="text-blue-500 hover:underline">
            เข้าสู่ระบบทดสอบ
          </Link>
        </div>
      </div>
    </div>
  );
}