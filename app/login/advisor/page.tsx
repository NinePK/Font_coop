// app/login/advisor/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdvisorLoginPage() {
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Call advisor authentication API
      const response = await fetch("/api/auth/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, tel }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Save token in a cookie
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        
        // Redirect to advisor dashboard
        router.push("/dashboard/advisor");
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
        <h1 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบสำหรับพนักงานที่ปรึกษา</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">อีเมล</label>
            <input
              type="email"
              placeholder="กรอกอีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              placeholder="กรอกเบอร์โทรศัพท์"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}