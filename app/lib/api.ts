// lib/api.ts
export interface UserQuery {
    fname: string;
    sname: string;
}

export interface User extends UserQuery {
    id: number;
    majorTh: string;
    majorEn: string;
    facTh: string;
    facEn: string;
    email: string;
    status: string;
    majorId?: number; // Optional, อาจยังไม่ระบุ
    roleId?: number;  // Optional, อาจยังไม่ระบุ

}

export interface MajorQuery {
    majorTh: string;
    majorEn: string;
    facultyTh: string;
    facultyEn: string;
}

/**
 * ดึงข้อมูลผู้ใช้จาก Back-end API
 */
export async function getUser(user: UserQuery, backUrl: string): Promise<{ id: number }> {
    try {
        const response = await fetch(`${backUrl}/user/search`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            console.error("Error fetching user:", response.statusText);
            return { id: 0 };
        }

        const data = await response.json();
        if (!data.id) {
            console.error("User ID not found:", data);
            return { id: 0 };
        }

        return data;
    } catch (error) {
        console.error("Error in getUser:", error);
        return { id: 0 };
    }
}

/**
 * ดึงข้อมูล Major ID จาก Back-end API
 */
export async function getMajorId(major: MajorQuery, backUrl: string): Promise<number> {
    try {
        const response = await fetch(`${backUrl}/major`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(major),
        });

        if (!response.ok) {
            console.error("Error fetching major:", response.statusText);
            return 0;
        }

        const data = await response.json();
        return data.major_id || 0;
    } catch (error) {
        console.error("Error in getMajorId:", error);
        return 0;
    }
}
