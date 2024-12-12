"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../../utils/db";

export default function Dashboard() {
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const email = localStorage.getItem("email"); // Get email from localStorage
        if (!email) throw new Error("No email found in localStorage");

        const getUserInfo = await getUser(email); // Fetch user info from your backend
        setPatientHistory(getUserInfo.history || {}); // Set patient history data
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchUserInfo();
  }, []);

  const getTableHeight = () => {
    const baseRowHeight = 53; // Height of each row (including padding)
    const headerHeight = 48; // Height of the header
    const maxHeight = "60vh"; // Maximum height constraint

    const contentHeight = (patientHistory.length * baseRowHeight) + headerHeight;
    return contentHeight < parseInt(maxHeight) ? `${contentHeight}px` : maxHeight;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen bg-gray-100 justify-center items-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="w-2/3 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
            Patient History
          </h2>
          <div className="overflow-x-auto">
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "300px",
                transition: "max-height 0.3s ease-in-out",
              }}
            >
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disease
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.keys(patientHistory).map((key, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{key}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patientHistory[key].disease}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}