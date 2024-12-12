"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { signUp } from "../../../utils/db";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        const form = e.target as HTMLFormElement;
        const firstName = (form.elements.namedItem("fname") as HTMLInputElement).value;
        const lastName = (form.elements.namedItem("lname") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        try {
            // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;
            // console.log("Signed up user:", user);
            let user = {
                name: `${firstName} ${lastName}`,
                email: email,
                password: password
            }

            let res = await signUp(user)
            console.log(res)

            // Redirect to the dashboard or home page after successful signup
            //router.push("/dashboard");
        } catch (error: any) {
            if (error.code) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        setError("This email is already registered.");
                        break;
                    case "auth/invalid-email":
                        setError("Invalid email address.");
                        break;
                    case "auth/weak-password":
                        setError("Password should be at least 6 characters.");
                        break;
                    default:
                        setError("An error occurred during signup. Please try again.");
                        break;
                }
            } else {
                setError("An unexpected error occurred.");
            }
            console.error("Signup error:", error);
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
                        priority
                    />
                </div>
            </div>

            {/* Right Section with Signup Form */}
            <div className="w-2/3 bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-semibold text-blue-600 text-center mb-4">
                        Welcome!
                    </h1>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fname" className="block text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                id="fname"
                                type="text"
                                name="fname"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lname" className="block text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                id="lname"
                                type="text"
                                name="lname"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
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
                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
