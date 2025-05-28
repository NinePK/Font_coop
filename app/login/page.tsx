import React from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">ระบบสหกิจศึกษา</h1>
        
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/login/student')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            นิสิต
          </button>
          
          <button 
            onClick={() => router.push('/login/teacher')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            อาจารย์
          </button>
          
          <button 
            onClick={() => router.push('/login/advisor')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            พนักงานที่ปรึกษา
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;