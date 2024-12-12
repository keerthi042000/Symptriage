// app/login/page.tsx
"use client";

import { FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUp } from "../../../utils/db";

export default function Signup() {
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = {
            name:(form.elements.namedItem('fname') as HTMLInputElement).value+" "+(form.elements.namedItem('lname') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value
        };
    
        try {
            await signUp(formData);
            // Redirect or handle successful signup
        } catch (error) {
            console.error('Signup failed:', error);
            // Handle error (show error message to user)
        }
    };
    


    return (
        <main className="flex min-h-screen">
            {/* Left Section with Symptraige and Image */}
            <div className="w-1/3 bg-slate-800 flex flex-col justify-center items-center">
                <h2 className="text-4xl font-bold text-blue-400">Symptriage</h2>
                <p className="mt-2 text-gray-400">Mental Health Support</p>
                <div className="mt-8">
                    <Image 
                        src="/prediction.png"
                        alt="Prediction"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                </div>
            </div>

            {/* Right Section with Login Form */}
            <div className="w-2/3 bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-semibold text-blue-600 text-center mb-4">
                        Welcome!
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                            <label className="block text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                name="fname"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                 name="lname"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition"
                        >
                            Submit
                        </button>
                    </form>
                    
                </div>
            </div>
        </main>
    );
}