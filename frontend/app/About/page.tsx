import Footer from "@/components/footer";
import Link from "next/link";

export default function AboutPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-green-700 via-green-600 to-gray-700 py-20 px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 text-4xl mb-5">
                    🌿
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">
                    About ZonePortal
                </h1>
                <p className="text-green-100 text-xl max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
                    A smart city complaint management system built to keep communities clean, organized and green.
                </p>
            </section>

            {/* ── Mission ── */}
            <section className="bg-white py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                    <p className="text-gray-600 text-xl leading-loose font-light tracking-wide max-w-2xl mx-auto">
                        ZonePortal was created to bridge the gap between citizens and city management.
                        We believe every complaint deserves attention. Our platform empowers zone officers
                        to track, manage and resolve city issues faster than ever before.
                    </p>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="bg-gradient-to-br from-gray-50 to-green-50 py-16 px-4 border-t border-gray-100">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8">
                        <p className="text-4xl font-extrabold text-green-600 mb-2">500+</p>
                        <p className="text-sm font-medium text-gray-700">Complaints Resolved</p>
                        <p className="text-xs text-gray-400 mt-1">Across all city zones</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8">
                        <p className="text-4xl font-extrabold text-blue-600 mb-2">50+</p>
                        <p className="text-sm font-medium text-gray-700">Zone Officers</p>
                        <p className="text-xs text-gray-400 mt-1">Active and registered</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8">
                        <p className="text-4xl font-extrabold text-yellow-500 mb-2">20+</p>
                        <p className="text-sm font-medium text-gray-700">City Zones</p>
                        <p className="text-xs text-gray-400 mt-1">Covered and managed</p>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-white py-16 px-4 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center p-6 bg-green-50 border border-green-100 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                                1
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 mb-2">Submit a Complaint</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Citizens or officers submit complaints with zone, area, and description details.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                                2
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 mb-2">Officer Reviews</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                The assigned zone officer reviews the complaint and updates the status.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-yellow-50 border border-yellow-100 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                                3
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 mb-2">Issue Resolved</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                The complaint is marked as resolved and the city gets a little greener.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="bg-gradient-to-br from-gray-50 to-green-50 py-16 px-4 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Built By</h2>
                    <p className="text-gray-500 text-sm mb-10">
                        A passionate team of developers committed to smart city solutions.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {["Argha Ghosh", "Borsha Roy", "Safwan Fahim"].map((name, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-6 flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-xl uppercase mb-3">
                                    {name.charAt(name.length - 1)}
                                </div>
                                <p className="font-semibold text-gray-800 text-sm">{name}</p>
                                <p className="text-xs text-gray-400 mt-1">Full Stack Developer</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-green-700 py-14 px-4 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">
                    Ready to Make Your City Better?
                </h2>
                <p className="text-green-100 text-sm mb-6">
                    Join ZonePortal and start managing city complaints today.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link href="/ZoneOfficer/SignUp">
                        <span className="inline-block px-6 py-3 bg-white text-green-700 font-semibold text-sm rounded-lg hover:bg-green-50 transition-all">
                            Sign Up Now
                        </span>
                    </Link>
                    <Link href="/ZoneOfficer/Complaint/CreateComplain">
                        <span className="inline-block px-6 py-3 bg-green-600 border border-white/30 text-white font-semibold text-sm rounded-lg hover:bg-green-500 transition-all">
                            Create Complaint
                        </span>
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}