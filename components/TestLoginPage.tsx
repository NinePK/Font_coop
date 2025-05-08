"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define user types for the dropdown
const userTypes = [
  { value: "student", label: "นิสิต (Student)" },
  { value: "teacher", label: "อาจารย์ (Teacher)" },
  { value: "advisor", label: "พนักงานที่ปรึกษา (Advisor)" }
];

// Mock user data for each type
const mockUsers = {
  student: [
    { id: 1001, username: "student1", displayName: "สมชาย ใจดี", majorId: 2, roleId: 3, major: { majorTh: "วิศวกรรมคอมพิวเตอร์", faculty: { facultyTh: "วิศวกรรมศาสตร์" } } },
    { id: 1002, username: "student2", displayName: "สมหญิง รักเรียน", majorId: 3, roleId: 3, major: { majorTh: "เทคโนโลยีสารสนเทศ", faculty: { facultyTh: "ไอซีที" } } },
    { id: 1003, username: "student3", displayName: "วิชัย เก่งกาจ", majorId: 1, roleId: 3, major: { majorTh: "วิทยาการคอมพิวเตอร์", faculty: { facultyTh: "วิทยาศาสตร์" } } }
  ],
  teacher: [
    { id: 2001, username: "teacher1", displayName: "ดร.ประสิทธิ์ สอนดี", majorId: 2, roleId: 1, major: { majorTh: "วิศวกรรมคอมพิวเตอร์", faculty: { facultyTh: "วิศวกรรมศาสตร์" } } },
    { id: 2002, username: "teacher2", displayName: "ผศ.ดร.วิชญา ปัญญาดี", majorId: 3, roleId: 1, major: { majorTh: "เทคโนโลยีสารสนเทศ", faculty: { facultyTh: "ไอซีที" } } }
  ],
  advisor: [
    { id: 3001, username: "advisor1", displayName: "คุณธีรยุทธ ผู้จัดการ", majorId: null, roleId: 2, major: { majorTh: "", faculty: { facultyTh: "บริษัท ABC จำกัด" } } },
    { id: 3002, username: "advisor2", displayName: "คุณนารี หัวหน้าแผนก", majorId: null, roleId: 2, major: { majorTh: "", faculty: { facultyTh: "บริษัท XYZ จำกัด" } } }
  ]
};

const TestLoginPage = () => {
  const [userType, setUserType] = useState("student");
  const [selectedUser, setSelectedUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Filter available users based on selected type
  const availableUsers = mockUsers[userType as keyof typeof mockUsers] || [];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setErrorMessage("Please select a user");
      return;
    }

    // Find the selected user's data
    const selectedUserData = availableUsers.find(user => user.username === selectedUser);
    
    if (selectedUserData) {
      // Format the user data to include all required fields
      const userData = {
        ...selectedUserData,
        // Map user data to match your expected structure 
        fname: selectedUserData.displayName.split(' ')[0],
        sname: selectedUserData.displayName.split(' ')[1],
        fnameEn: selectedUserData.displayName.split(' ')[0],
        snameEn: selectedUserData.displayName.split(' ')[1],
        // Include other needed fields
        title: "",
        email: `${selectedUserData.username}@example.com`,
        role: { status: userType, status_en: userType },
        // Make sure major and faculty are correctly structured
        major: selectedUserData.major
      };

      // Store user data in cookie
      document.cookie = `user_data=${JSON.stringify(userData)}; path=/; max-age=86400`;
      
      // Redirect to home page
      router.push("/home");
    } else {
      setErrorMessage("Error retrieving user data");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Test Login System</h1>
        <div className="text-sm bg-yellow-100 p-3 mb-4 rounded border border-yellow-300">
          This login page is for testing purposes only. It allows you to login as different user types without LDAP authentication.
        </div>
        
        <form onSubmit={handleLogin}>
          {/* User Type Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" id="userTypeLabel">User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              aria-labelledby="userTypeLabel"
            >
              {userTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" id="selectUserLabel">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              aria-labelledby="selectUserLabel"
              required
            >
              <option value="">-- Select a user --</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.displayName} ({user.username})
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Back to Regular Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage;