"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../../utils/db";
import Header from "../header"
import Sidebar from "../sidebar"
export default function Dashboard() {
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const email = localStorage.getItem("email"); // Get email from localStorage
        if (!email) throw new Error("No email found in localStorage");

        const getUserInfo = await getUser(email); // Fetch user info from your backend
        console.log("Email : ",email, "UserInfo : ",getUserInfo['user'].history)
        // setPatientHistory(getUserInfo['user'].history || {}); // Set patient history data
        setPatientHistory(Array.isArray(getUserInfo['user'].history) ? getUserInfo['user'].history : []);

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
    // <main className="flex min-h-screen bg-gray-100 justify-center items-center">
    <main className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="w-2/3 max-w">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
            Patient History
          </h2>
          {/* <Header /> */}
          {/* <div className="overflow-x-auto">
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "300px",
                transition: "max-height 0.3s ease-in-out",
              }} */}
            {/* > */}
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
                  {/* {Object.keys(patientHistory).map((key, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{key}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patientHistory[key].disease}
                      </td>
                    </tr>
                  ))} */}

                  {patientHistory.map((entry, index) => {
                    const date = Object.keys(entry)[0]; // "2025-09-24 01:09:42"
                    const disease = entry[date]; // "GERD"
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{disease}</td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </div>
        {/* </div>
      </div> */}
    </main>
  );
}