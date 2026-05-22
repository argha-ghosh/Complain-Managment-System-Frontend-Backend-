"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
import Footer from "../../../components/footer";
import axios from "axios";

const ZoneOfficerLogInSchema = z.object({
    name: z
        .string()
        .min(1, "Zone officer name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    email: z
        .string()
        .min(1, "Zone officer email is required")
        .email("Zone officer email must be an email")
        .regex(/^[a-zA-Z0-9]+@gmail\.com$/, "Email must be a valid Gmail address"),
    password: z
        .string()
        .min(1, "Zone officer password is required")
        .min(8, "Zone officer password must be at least 8 characters long")
        .max(25, "Zone officer password cannot exceed 25 characters"),
    nid: z
        .string()
        .min(1, "Zone officer NID is required")
        .length(10, "Zone officer NID must be 10 digits long")
        .regex(/^[0-9]{10}$/, "Zone officer NID must be only digits"),
});

type ZoneOfficerLogInType = z.infer<typeof ZoneOfficerLogInSchema>;

export default function ZoneOfficerLogInForm() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nid, setNID] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // OTP states
    const [otp, setOtp] = useState<string>("");
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otpVerified, setOtpVerified] = useState<boolean>(false);
    const [otpLoading, setOtpLoading] = useState<boolean>(false);

    // Step 1 — Send OTP
    const handleSendOtp = () => {
        setError("");
        setSuccess("");

        const emailCheck = z
            .string()
            .email()
            .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
            .safeParse(email);

        if (!emailCheck.success) {
            setError("Please enter a valid Gmail address first.");
            return;
        }

        setOtpLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/send-otp`, { email })
            .then(() => {
                setOtpSent(true);
                setSuccess("OTP sent! Check your Gmail inbox.");
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to send OTP. Please try again.");
            })
            .finally(() => setOtpLoading(false));
    };

    // Step 2 — Verify OTP
    const handleVerifyOtp = () => {
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setOtpLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/verify-otp`, { email, otp })
            .then(() => {
                setOtpVerified(true);
                setSuccess("✅ Email verified! You can now create your account.");
            })
            .catch((err) => {
                console.error(err);
                setError("Invalid or expired OTP. Please try again.");
            })
            .finally(() => setOtpLoading(false));
    };

    // Step 3 — Create Account
    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otpVerified) {
            setError("Please verify your email with OTP first.");
            return;
        }

        const result = ZoneOfficerLogInSchema.safeParse({ name, email, password, nid });
        if (!result.success) {
            setError(result.error.issues[0]?.message || "Validation error");
            return;
        }

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/create-ZoneOfficer`, {
            ...result.data,
            nid: Number(result.data.nid)
        })
            .then((response) => {
                console.log(response);
                setSuccess("🎉 Zone officer created successfully!");
                setName(""); setEmail(""); setPassword(""); setNID("");
                setOtp(""); setOtpSent(false); setOtpVerified(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to create zone officer. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-50">

            {/* ── Hero Banner ── */}
            <div className="py-8 px-4 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-3xl mb-4">
                    🌳
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Create Officer Account
                </h1>
                <p className="text-gray-500 text-sm">
                    Register a new zone officer in the system
                </p>
            </div>

            {/* ── Form Card ── */}
            <main className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Email + Send OTP button */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    disabled={otpVerified}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setOtpSent(false);
                                        setOtpVerified(false);
                                        setOtp("");
                                    }}
                                    className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-green-50 disabled:opacity-70"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={otpLoading || otpVerified}
                                    className="whitespace-nowrap px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-lg transition"
                                >
                                    {otpVerified ? "✅ Verified" : otpLoading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                                </button>
                            </div>
                        </div>

                        {/* OTP Input — only shows after OTP is sent */}
                        {otpSent && !otpVerified && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Enter 6-Digit OTP
                                </label>
                                <p className="text-xs text-gray-400">
                                    A code was sent to {email}. It expires in 5 minutes.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter your 6 digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        maxLength={6}
                                        className="border border-green-400 bg-green-50 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest font-mono transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={otpLoading}
                                        className="whitespace-nowrap px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-lg transition"
                                    >
                                        {otpLoading ? "Verifying..." : "Verify"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* NID */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="nid" className="text-sm font-medium text-gray-700">
                                NID (10 Digits)
                            </label>
                            <input
                                type="text"
                                id="nid"
                                placeholder="Enter 10 digit NID"
                                value={nid}
                                onChange={(e) => setNID(e.target.value)}
                                maxLength={10}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
                                {success}
                            </div>
                        )}

                        {/* Submit button — disabled until OTP verified */}
                        <button
                            type="submit"
                            disabled={loading || !otpVerified}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm"
                        >
                            {loading ? "Creating..." : "Create Officer Account"}
                        </button>

                        {/* Hint text when not verified */}
                        {!otpVerified && (
                            <p className="text-xs text-center text-gray-400">
                                Verify your email with OTP to enable account creation.
                            </p>
                        )}

                    </form>
                </div>

                <div className="mt-6 text-center">
                    <a href="/LogIn" className="text-sm text-blue-600 hover:underline">
                        ← Login Here
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}