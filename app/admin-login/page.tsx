"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [userUsername, setUserUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const backUrl = process.env.NEXT_PUBLIC_BACK_URL;
      
        if (!backUrl) {
          setErrorMessage("BACK_URL is not set in environment variables.");
          return;
        }
      
        // ตรวจสอบข้อมูลของ Admin
        if (adminUsername !== process.env.NEXT_PUBLIC_ADMIN_USERNAME || adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
          setErrorMessage("Invalid Admin credentials.");
          return;
        }
      
        try {
          // ส่งข้อมูล username ไปที่ API
          const res = await fetch(`${backUrl}/user/search/${userUsername}`, {
            method: "GET",
          });
      
          if (res.ok) {
            const userData = await res.json();
      
            if (userData.id) {
              // เก็บข้อมูลผู้ใช้ใน Cookie
              document.cookie = `user_data=${JSON.stringify(userData)}; path=/; max-age=86400`;
              // Redirect ไปที่หน้า Home
              router.push("/home");
            } else {
              setErrorMessage("User not found.");
            }
          } else {
            setErrorMessage("Failed to fetch user data.");
          }
        } catch (error) {
          setErrorMessage("An error occurred during login.");
          console.error("Login Error:", error);
        }
      };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded p-6">
                <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>
                <form onSubmit={handleAdminLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Admin Username</label>
                        <input
                            type="text"
                            placeholder="Enter Admin username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Admin Password</label>
                        <input
                            type="password"
                            placeholder="Enter Admin password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">User Username</label>
                        <input
                            type="text"
                            placeholder="Enter username of the user"
                            value={userUsername}
                            onChange={(e) => setUserUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
