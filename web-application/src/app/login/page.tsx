"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "../firebase/config";
import { signIn } from "../../../utils/db";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await signIn(email, password);
            console.log("Logged in user:", response);
            
            // Redirect to dashboard or home page after successful login
            router.push("/dashboard"); // Adjust this path as needed
        } catch (error: any) {
            if (error.code) {
                switch (error.code) {
                    case "auth/user-not-found":
                        setError("No user found with this email.");
                        break;
                    case "auth/wrong-password":
                        setError("Incorrect password.");
                        break;
                    case "auth/invalid-email":
                        setError("Invalid email address.");
                        break;
                    default:
                        setError("An error occurred during login. Please try again.");
                        break;
                }
            } else {
                setError("An unexpected error occurred.");
            }
            console.error("Login error:", error);
        }
    };

    return (
        <main className="flex min-h-screen">
            {/* Left Section with Symptraige */}
            <div className="w-1/3 bg-slate-800 flex flex-col justify-center items-center">
                <h2 className="text-4xl font-bold text-blue-400">Symptriage</h2>
                <p className="mt-2 text-gray-400">Mental Health Support</p>
                <div className="mt-6">
                    <Image 
                        src="/prediction.png"
                        alt="Prediction"
                        width={200}
                        height={200}
                        priority // Ensures faster loading of this image
                    />
                </div>
            </div>

            {/* Right Section with Login Form */}
            <div className="w-2/3 bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-semibold text-blue-600 text-center mb-4">
                        Welcome Back!
                    </h1>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition"
                        >
                            Login
                        </button>
                    </form>
                    <p className="mt-6 text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
