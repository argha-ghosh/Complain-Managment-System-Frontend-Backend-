import Link from "next/link";
import Footer from "@/components/footer";

export default function Home() {
    return (
        <>
            {/* ── Hero Section — group mate style ── */}
            <section className="flex flex-col justify-center items-center text-center px-6 py-32 bg-gradient-to-r from-indigo-100 via-white to-sky-100">
                <div className="max-w-4xl">
                    <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
                        Report Road & Drainage
                        <span className="text-indigo-600"> Problems Easily</span>
                    </h1>

                    <p className="mt-8 text-xl text-gray-600 leading-9">
                        A smart complaint and monitoring platform for reporting
                        road damage, drainage blockage, and infrastructure issues
                        across Dhaka city.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                        Login or create an account to submit complaints and track updates.
                    </p>

                    <div className="mt-12 flex justify-center gap-6">
                        <Link href="/login">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition duration-300">
                                Login
                            </button>
                        </Link>
                        <Link href="/ZoneOfficer/SignUp">
                            <button className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition duration-300">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Features Section — your green style ── */}
            {/* <section className="py-16 px-4 bg-white">
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
            </section> */}

            {/* ── About Section — your green style ── */}
            {/* <section className="bg-gradient-to-br from-gray-50 to-green-50 border-t border-gray-200 py-16 px-4 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Why Choose Our Platform?</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6">
                    Our platform simplifies the complaint management system, automates updates, and provides easy analytics for a greener city.
                </p>
                <Link href="/ZoneOfficer/Complaint/CreateComplain">
                    <span className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all">
                        Create a Complaint
                    </span>
                </Link>
            </section> */}

            <Footer />
        </>
    );
}