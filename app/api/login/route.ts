import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticate } from "ldap-authentication";

const adminUsername = process.env.ADMIN_USERNAME!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const secret = process.env.SECRET!;
const ldapUrl = "ldap://DC-UP-06.up.local";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // 1. เช็คว่าเป็น Admin หรือ User
    if (username === adminUsername && password === adminPassword) {
      // ถ้าเป็น Admin
      const token = jwt.sign({ username, role: "admin" }, secret, { expiresIn: "1d" });
      return NextResponse.json({ token });
    }

    // 2. ถ้าไม่ใช่ Admin เชื่อมต่อกับ LDAP
    const options = {
      ldapOpts: { url: ldapUrl },
      userDn: `${username}@up.local`,
      userPassword: password,
      userSearchBase: "dc=up,dc=local",
      usernameAttribute: "samaccountname",
      username,
    };

    const ldapUser = await authenticate(options);

    if (!ldapUser) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ถ้าเป็น User, สร้าง JWT Token
    const token = jwt.sign({ username, role: "user" }, secret, { expiresIn: "1d" });
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Login failed. Try again." }, { status: 500 });
  }
}
