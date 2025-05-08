"use client";

import Link from "next/link";

const DocumentsPage = () => {
  // สร้างลิงค์จาก /documents/coop01 ถึง /documents/coop14
  const links = Array.from({ length: 14 }, (_, index) => {
    const coopNumber = (index + 1).toString().padStart(2, "0"); // ให้เลขมี 2 หลัก (coop01 ถึง coop14)
    return `/documents/coop${coopNumber}`;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>
      <div className="space-y-4">
        {/* ลิงค์ไปยัง coop01 ถึง coop14 */}
        {links.map((link, index) => (
          <div key={index}>
            <Link href={link}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                Go to {`Coop${(index + 1).toString().padStart(2, "0")}`}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
