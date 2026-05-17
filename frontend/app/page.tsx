"use client";

import Footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-gray-100 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Dhaka Road & Drainage Issue Reporting System 🌿
        </h1>
        <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto">
          A simple platform to manage city complaints, track zone officers, and keep your city clean and green.
        </p>
        <Link href="/ZoneOfficer/Complaint/CreateComplain">
          <span className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
            Create a Complaint
          </span>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-3xl">🌍</span>
            <h3 className="text-lg font-semibold text-gray-800 mt-3 mb-1">City Management</h3>
            <p className="text-sm text-gray-500">Manage all city zones and officers in one place.</p>
          </div>
          <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-3xl">📊</span>
            <h3 className="text-lg font-semibold text-gray-800 mt-3 mb-1">Track Complaints</h3>
            <p className="text-sm text-gray-500">Track the status and history of complaints easily.</p>
          </div>
          <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-3xl">⚙️</span>
            <h3 className="text-lg font-semibold text-gray-800 mt-3 mb-1">Automation</h3>
            <p className="text-sm text-gray-500">Automated updates and smooth complaint workflow.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 border-t border-gray-200 py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Why Choose Our Platform?</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6">
          Our platform simplifies the complaint management system, automates updates, and provides easy analytics for a greener city.
        </p>
        <Link href="/About">
          <span className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
            Learn More
          </span>
        </Link>
      </section>

      <Footer />
    </>
  );
}