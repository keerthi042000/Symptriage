"use client";

import { useRouter, usePathname } from "next/navigation";
// import { signOut } from "firebase/auth";
// import { auth } from "../utils/firebase"; // adjust path if needed
import { useEffect, useState } from "react";
import { getUser } from "../../utils/db"; // your function to fetch user history
import { userSignOut } from "../../utils/db"; 

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [patientHistory, setPatientHistory] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const email = window.localStorage.getItem("email");
      if (!email) return;

      const res = await getUser(email);
      if (res?.user?.history) {
        setPatientHistory(res.user.history);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = async () => {
    const res = await userSignOut();
    if (res.code === "200") {
      router.push("/");   // ✅ redirect here
    } else {
      console.error("Logout failed", res.msg);
    }
  };

  const navItems = [
    { name: "Chat", path: "/chatbot", display: "/chatbot" },
    { name: "History", path: "/dashboard", display: "/history"},
    // { name: "Logout", path: "/logout" },
  ];

  return (
    <aside className="w-72 bg-blue-600 text-white h-screen flex flex-col">
      {/* Logo */}
      <div
        className="p-6 text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/chatbot")}
      >
        SympTriage
      </div>

      {/* Navigation */}
      <nav className="px-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
              pathname === item.display ? "bg-blue-800" : "hover:bg-blue-700"
            }`}
          >
            {item.name}
          </button>
        ))}
         <button
          onClick={handleLogout}
          className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
              pathname === "" ? "bg-blue-800" : "hover:bg-blue-700"
            }`}
        >
          Logout
        </button>
      </nav>

      {/* History */}
      {/* <div className="flex-1 overflow-y-auto px-4 mt-4">
        <h3 className="text-sm font-semibold mb-2">Patient History</h3>
        <ul className="space-y-2">
          {patientHistory ? (
            Object.entries(patientHistory).map(([date, disease], idx) => (
              <li
                key={idx}
                className="bg-blue-500 hover:bg-blue-700 rounded-md px-3 py-2 text-sm"
              >
                <div className="font-medium">{disease}</div>
                <div className="text-xs text-blue-100">{date}</div>
              </li>
            ))
          ) : (
            <p className="text-xs text-blue-200">No history yet</p>
          )}
        </ul>
      </div> */}

      {/* Logout */}
      {/* <div className="p-4">
        <button
          onClick={userSignOut}
          className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
              pathname === "" ? "bg-blue-800" : "hover:bg-blue-700"
            }`}
        >
          Logout
        </button>
      </div> */}


    </aside>




  );
}
