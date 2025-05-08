// app/login/student-teacher/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentTeacherLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Call LDAP authentication API
      const response = await fetch("/api/auth/ldap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Save token in a cookie
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        
        // Fetch user info
        const userResponse = await fetch(`/api/user/${username}`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Redirect based on user role
          if (userData.role_id === 1) {
            router.push("/dashboard/teacher");
          } else if (userData.role_id === 3) {
            router.push("/dashboard/student");
          } else {
            router.push("/dashboard");
          }
        } else {
          setErrorMessage("ไม่พบข้อมูลผู้ใช้ในระบบ");
        }
      } else {
        setErrorMessage(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบสำหรับนิสิตและอาจารย์</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              placeholder="กรอกชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}