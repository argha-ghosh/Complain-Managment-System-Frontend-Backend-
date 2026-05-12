"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* <Header props={{ page: "Home" }} /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-300 to-blue-400 py-20 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to the Zone Portal</h1>
        <p className="text-xl mb-4">We help manage city complaints effectively, keeping everything organized and green 🌿.</p>
        <Link href="/ZoneOfficer">
          <span className="inline-block px-8 py-4 bg-blue-600 text-lg font-semibold text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all">
            Explore Zone Officers
          </span>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <span className="text-4xl text-green-600">🌍</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">City Management</h3>
            <p>Efficient city management with easy access to all data.</p>
          </div>
          <div className="text-center p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <span className="text-4xl text-blue-600">📊</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Analytics</h3>
            <p>Track the status and history of complaints and issues in the city.</p>
          </div>
          <div className="text-center p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <span className="text-4xl text-yellow-500">⚙️</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Automation</h3>
            <p>Automated complaint assignment and progress updates for smooth workflow.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Our Platform?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Our platform simplifies the complaint management system, automates updates, and provides easy-to-read analytics for a greener city.
          </p>
          <Link href="/about">
            <span className="inline-block px-8 py-4 bg-green-600 text-lg font-semibold text-white rounded-lg shadow-lg hover:bg-green-700 transition-all">
              Learn More
            </span>
          </Link>
        </div>
      </section>


      <Footer />
    </>
  );
}