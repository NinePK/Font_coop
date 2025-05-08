import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const adminUsername = process.env.ADMIN_USERNAME!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const secret = process.env.SECRET!;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // ตรวจสอบ username และ password กับข้อมูล Admin
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign({ username, role: "admin" }, secret, { expiresIn: "1d" });
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ message: "Invalid Admin Credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ message: "Login failed. Try again." }, { status: 500 });
  }
}
