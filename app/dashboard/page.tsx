"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      router.push("/login"); // ถ้าไม่มี Token ให้ Redirect ไปที่ Login
    } else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken);
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      <p className="mt-4">Hello, {user?.username}</p>
    </div>
  );
};

export default Dashboard;
