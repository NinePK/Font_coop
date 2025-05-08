// app/api/ldap/route.ts
import { NextResponse } from 'next/server';
import { authenticate } from 'ldap-authentication';
import jwt from 'jsonwebtoken';
import { getUser, getMajorId, UserQuery, MajorQuery,User } from '../../lib/api';

const ldapUrl = 'ldap://DC-UP-06.up.local';
const baseDN = 'dc=up,dc=local';
const secret = process.env.SECRET!;
const bypassLDAP = process.env.BYPASS_LDAP === 'true';
const backUrl = process.env.BACK_URL!;

export async function POST(req: Request) {
    const { username, password } = await req.json();
  
    try {
      const options = {
        ldapOpts: {
          url: ldapUrl,
        },
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
  
      const token = jwt.sign({ username }, secret, { expiresIn: "1d" });
      return NextResponse.json({ token });
    } catch (error) {
      console.error("Login Error:", error);
      return NextResponse.json({ message: "Login failed. Try again." }, { status: 500 });
    }
  }

function mapLDAPToUser(ldapUser: Record<string, any>): User {
    return {
        id: 0,
        fname: ldapUser.description.split(' ')[0],
        sname: ldapUser.description.split(' ')[1],
        majorTh: ldapUser.displayName.replace('สาขาวิชา', ''),
        majorEn: ldapUser.distinguishedName.split(',')[1]?.split('=')[1] || '',
        facTh: ldapUser.department || '',
        facEn: ldapUser.distinguishedName.split(',')[2]?.split('_')[1] || '',
        email: ldapUser.email || '',
        status: ldapUser.extensionAttribute6 || '',
    };
}

function assignRoleId(status: string): number {
    switch (status) {
        case 'TEACHER':
            return 1;
        case 'STAFF':
            return 2;
        case 'STUDENT':
            return 3;
        default:
            return 0;
    }
}
