"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // นำเข้า Link จาก Next.js

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อมูลจาก cookie
    const userData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (userData) {
      // ถ้ามีข้อมูลผู้ใช้ใน cookie, แปลงเป็น JSON
      setUser(JSON.parse(userData));
    } else {
      // หากไม่มีข้อมูลผู้ใช้ใน cookie, ส่งผู้ใช้กลับไปที่หน้า Login
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // หากยังไม่โหลดข้อมูลผู้ใช้, ให้แสดงข้อความ Loading...
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      <div className="mt-4">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Full Name:</strong> {user.fname} {user.sname}</p>
        <p><strong>English Name:</strong> {user.fnameEn} {user.snameEn}</p>
        <p><strong>Major:</strong> {user.major.majorTh}</p> {/* majorTh */}
        <p><strong>Degree:</strong> {user.major.degree}</p> {/* degree */}
        <p><strong>Faculty:</strong> {user.major.faculty.facultyTh}</p> {/* facultyTh */}
      </div>

      {/* ปุ่มไปยังหน้า /reportDaily */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/reportDaily")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Daily Report
        </button>
      </div>

      {/* ลิงค์ไปยังหน้า /documents */}
      <div className="mt-6">
        <Link href="/documents">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Go to Documents
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
