"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";


const LandingPage = () => {

  const router = useRouter();

  const handleStartPrediction = () => {
    const email = localStorage.getItem("email");
    if (email) {
      router.push("/chatbot"); // 🔹 user is logged in → go to chatbot
    } else {
      router.push("/login"); // 🔹 not logged in → go to login page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-blue-800">SympTriage</h1>
          <div className="space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-blue-800">Login</Link>
            <Link href="/signup" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              AI-Powered Disease Prediction & Medicine Recommendations
            </h2>
            <p className="text-gray-600 mb-8">
              Get instant disease predictions based on your symptoms and receive personalized medicine recommendations from our advanced AI system.
            </p>
            <div className="space-x-4">

              <button
                onClick={handleStartPrediction}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Start Prediction
              </button>

              {/* <Link href="/predict" className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Start Prediction
              </Link> */}
              <Link href="./Blogs" className="border border-blue-800 text-blue-800 px-6 py-3 rounded-lg hover:bg-blue-50">
                Learn More
              </Link>
            </div>
          </div>
          
          
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/prediction.png"
              alt="Health Prediction Illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-xl mb-4">Disease Prediction</h4>
              <p className="text-gray-600">Advanced AI algorithms to predict potential health conditions based on your symptoms.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-xl mb-4">Medicine Recommendations</h4>
              <p className="text-gray-600">Get personalized medicine recommendations based on your condition and history.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-xl mb-4">24/7 Support</h4>
              <p className="text-gray-600">Access our platform anytime with round-the-clock customer support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-bold mb-4">HealthPredict</h5>
              <p className="text-sm">Your trusted health prediction platform</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact Us</h5>
              <p className="text-sm">Email: support@healthpredict.com</p>
              <p className="text-sm">Phone: (555) 123-4567</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Follow Us</h5>
              <div className="space-x-4">
                {/* Add your social media icons/links here */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
