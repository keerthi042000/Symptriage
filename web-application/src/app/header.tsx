"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { userSignOut } from "../../utils/db"; // adjust path to your firebase config

export default function Header() {
  const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("email");
//       router.push("/"); // redirect to landing/login page
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <h1
          className="cursor-pointer text-lg font-bold"
          onClick={() => router.push("/chat")}
        >
          SympTriage
        </h1>

        <nav className="flex gap-6">
          <button
            onClick={() => router.push("/chat")}
            className="hover:underline"
          >
            Chat
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:underline"
          >
            History
          </button>
          <button onClick={userSignOut} className="hover:underline">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
