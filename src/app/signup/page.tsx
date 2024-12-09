"use client";

import { FormEvent } from "react";
import Link from "next/link";

export default function Signup() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert("Signup submitted");
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-green-600 mb-4">Signup</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Signup
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-green-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
}
