"use client";

// import { useState } from "react";
import { getUser } from "../../../utils/db";

export default async function Dashboard() {
    // const [message, setMessage] = useState("");
    // const [chatMessages, setChatMessages] = useState([
    //     { role: "system", content: "Hello! How are you feeling today?" }
    // ]);
    const getUserInfo = await getUser(localStorage.getItem("email"));
    // Mock patient history data
    const patientHistory = getUserInfo;

    // const handleSendMessage = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (message.trim()) {
    //         setChatMessages([...chatMessages, { role: "user", content: message }]);
    //         setMessage("");
    //     }
    // };

    // Calculate dynamic max-height based on number of entries
    const getTableHeight = () => {
        const baseRowHeight = 53; // Height of each row (including padding)
        const headerHeight = 48; // Height of the header
        // const minHeight = baseRowHeight + headerHeight; // Minimum height for one entry + header
        const maxHeight = "60vh"; // Maximum height constraint
        
        const contentHeight = (patientHistory.length * baseRowHeight) + headerHeight;
        
        // If content height is less than maxHeight, return actual content height
        return contentHeight < parseInt(maxHeight) ? `${contentHeight}px` : maxHeight;
    };

    return (
        <main className="flex min-h-screen bg-gray-100 justify-center items-center">
            {/* Centered Section - Patient History Table */}
            <div className="w-2/3 max-w-3xl">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Patient History</h2>
                    <div className="overflow-x-auto">
                        <div 
                            className="overflow-y-auto"
                            style={{ 
                                maxHeight: getTableHeight(),
                                transition: 'max-height 0.3s ease-in-out'
                            }}
                        >
                            <table className="min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.keys(patientHistory).map((key, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{key}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{patientHistory[key].disease}</td>
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