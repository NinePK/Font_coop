// app/api/ldap/route.ts
import { NextResponse } from 'next/server';
import { authenticate } from 'ldap-authentication';
import jwt from 'jsonwebtoken';

const ldapUrl = 'ldap://DC-UP-06.up.local';
const baseDN = 'dc=up,dc=local';
const secret = process.env.SECRET!;
const bypassLDAP = process.env.BYPASS_LDAP === 'true';

export async function POST(req: Request) {
    try {
        const { username, password, represent } = await req.json();

        if (bypassLDAP) {
            const user = { id: 38, username, fname: 'ภคภพ', fname_en: 'PAKAPOP' };
            const token = jwt.sign(user, secret, { expiresIn: '24h' });
            return NextResponse.json({ token });
        }

        const usernameSearch = represent || username;

        const options = {
            ldapOpts: {
                url: ldapUrl,
            },
            userDn: `${username}@up.local`,
            userPassword: password,
            userSearchBase: baseDN,
            usernameAttribute: 'samaccountname',
            username: usernameSearch,
            attributes: ['distinguishedName', 'description', 'displayName', 'email'],
        };

        const ldapUser = await authenticate(options);

        if (!ldapUser) {
            return NextResponse.json({ message: 'Invalid Username or Password' }, { status: 401 });
        }

        const user = mapLDAPToUser(ldapUser);
        const token = jwt.sign(user, secret, { expiresIn: '24h' });

        return NextResponse.json({ token });
    } catch (error) {
        console.error('LDAP Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

function mapLDAPToUser(ldapUser: Record<string, any>) {
    return {
        id: ldapUser.dn,
        fullname: ldapUser.displayName,
        email: ldapUser.email,
    };
}
